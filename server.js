const fs = require('node:fs');
const path = require('node:path');
const express = require('express');
const { root, renderMarkdownPage, getPosts, ejs, template } = require('./scripts/site-content');

const app = express();
const port = Number(process.env.PORT || 8000);
const posts = new Map(getPosts().map((post) => [post.slug, post]));

app.get('/archive/', (req, res) => {
  const list = [...posts.values()].map(({ title, date, slug }) => `<article><h2><a href="/archive/${slug}/">${title}</a></h2><p class="muted">${date.slice(0, 4)}</p></article>`).join('\n');
  res.send(ejs.render(template, { title: 'Archive', description: 'Archived engineering notes by Robin Mollah.', body: `<h1>Archive</h1><p class="muted">Rendered from Markdown by EJS in development mode.</p>${list}` }));
});

app.get('/blog/', (req, res) => res.redirect('/archive/'));
app.get('/blog/:slug/', (req, res) => res.redirect(`/archive/${req.params.slug}/`));
app.get('/blog/:slug', (req, res) => res.redirect(`/archive/${req.params.slug}/`));

function renderPost(req, res, next) {
  const post = posts.get(req.params.slug);
  if (!post) return next();
  res.send(renderMarkdownPage(post.source, '/archive/').html);
}

app.get('/archive/:slug/', renderPost);
app.get('/archive/:slug', renderPost);

app.get('/archive/:slug/:asset', (req, res, next) => {
  const post = posts.get(req.params.slug);
  if (!post) return next();
  const asset = path.basename(req.params.asset);
  const file = path.join(root, 'content', 'archive', path.basename(post.file, '.md'), asset);
  if (!file.startsWith(path.join(root, 'content', 'archive')) || !fs.existsSync(file)) return next();
  res.sendFile(file);
});

for (const page of ['about', 'contact', 'privacy-policy']) {
  app.get(`/${page}/`, (req, res) => res.send(renderMarkdownPage(path.join(root, 'content', 'pages', `${page}.md`)).html));
}

app.use(express.static(root));
app.listen(port, () => console.log(`Development server: http://localhost:${port}`));
