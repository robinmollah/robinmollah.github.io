const fs = require('node:fs');
const path = require('node:path');
const express = require('express');
const { root, renderMarkdownPage, getPosts, ejs, template } = require('./scripts/site-content');
const { sourceDir, renderComparisonPage } = require('./scripts/image-comparison');

const app = express();
const port = Number(process.env.PORT || 8000);
const archivedPosts = new Map(getPosts('archive').map((post) => [post.slug, post]));
const activePosts = new Map(getPosts('posts').map((post) => [post.slug, post]));

app.get('/archive/', (req, res) => {
  const list = [...archivedPosts.values()].map(({ title, date, slug, summary }) => `<article><h2><a href="/archive/${slug}/">${title}</a></h2><p class="muted">${date.slice(0, 4)}</p><p>${summary}</p></article>`).join('\n');
  res.send(ejs.render(template, { title: 'Archive', description: 'Archived engineering notes by Robin Mollah.', body: `<h1>Archive</h1><p class="muted">Rendered from Markdown by EJS in development mode.</p>${list}` }));
});

app.get('/blog/', (req, res) => {
  const list = [...activePosts.values()].map(({ title, date, slug, summary }) => `<article><h2><a href="/blog/${slug}/">${title}</a></h2><p class="muted">${date.slice(0, 4)}</p><p>${summary}</p></article>`).join('\n');
  res.send(ejs.render(template, { title: 'Blog', description: 'Recent engineering notes by Robin Mollah.', body: `<h1>Blog</h1><p class="muted">Rendered from Markdown by EJS in development mode.</p>${list || '<p>No active posts yet.</p>'}` }));
});
app.get('/blog/:slug/', (req, res, next) => renderPost(req, res, next, activePosts, '/blog/'));
app.get('/blog/:slug', (req, res, next) => renderPost(req, res, next, activePosts, '/blog/'));

function renderPost(req, res, next, collection, backLink) {
  const post = collection.get(req.params.slug);
  if (!post) return next();
  if (post.slug === 'image-ai-models-comparison') return res.send(renderComparisonPage());
  res.send(renderMarkdownPage(post.source, backLink).html);
}

app.get('/archive/:slug/', (req, res, next) => renderPost(req, res, next, archivedPosts, '/archive/'));
app.get('/archive/:slug', (req, res, next) => renderPost(req, res, next, archivedPosts, '/archive/'));

function sendComparisonAsset(req, res, next) {
  const scene = path.basename(req.params.scene);
  const asset = path.basename(req.params.asset);
  const file = path.join(sourceDir, scene, asset);
  if (!file.startsWith(sourceDir) || !fs.existsSync(file)) return next();
  res.sendFile(file);
}

app.get('/blog/image-ai-models-comparison/:scene/:asset', sendComparisonAsset);
app.get('/archive/image-ai-models-comparison/:scene/:asset', sendComparisonAsset);

function sendPostAsset(req, res, next, collection, sourceDirectory) {
  const post = collection.get(req.params.slug);
  if (!post) return next();
  const asset = path.basename(req.params.asset);
  const directory = path.join(root, 'content', sourceDirectory);
  const file = path.join(directory, path.basename(post.file, '.md'), asset);
  if (!file.startsWith(directory) || !fs.existsSync(file)) return next();
  res.sendFile(file);
}

app.get('/blog/:slug/:asset', (req, res, next) => sendPostAsset(req, res, next, activePosts, 'posts'));
app.get('/archive/:slug/:asset', (req, res, next) => sendPostAsset(req, res, next, archivedPosts, 'archive'));

for (const page of ['about', 'contact', 'privacy-policy']) {
  app.get(`/${page}/`, (req, res) => res.send(renderMarkdownPage(path.join(root, 'content', 'pages', `${page}.md`)).html));
}

app.use(express.static(root));
app.listen(port, () => console.log(`Development server: http://localhost:${port}`));
