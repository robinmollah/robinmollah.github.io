const fs = require('node:fs');
const path = require('node:path');
const { root, renderMarkdownPage, getPosts, ejs, template } = require('./site-content');
const { renderComparisonPage } = require('./image-comparison');

function writePage(destination, html) {
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.writeFileSync(destination, html);
}

function redirect(destination, target) {
  writePage(destination, `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta http-equiv="refresh" content="0; url=${target}"><link rel="canonical" href="${target}"><title>Moved</title></head><body><p>This page moved to <a href="${target}">${target}</a>.</p></body></html>`);
}

function copyTree(source, destination) {
  for (const entry of fs.readdirSync(source, { withFileTypes: true })) {
    const from = path.join(source, entry.name);
    const to = path.join(destination, entry.name);
    if (entry.isDirectory()) { fs.mkdirSync(to, { recursive: true }); copyTree(from, to); }
    else if (entry.name !== '.DS_Store') fs.copyFileSync(from, to);
  }
}

function renderPost(post, backLink) {
  return post.slug === 'image-ai-models-comparison'
    ? renderComparisonPage()
    : renderMarkdownPage(post.source, backLink).html;
}

function buildPosts(posts, sourceDirectory, outputDirectory, backLink) {
  for (const post of posts) {
    writePage(path.join(root, outputDirectory, post.slug, 'index.html'), renderPost(post, backLink));
    const assets = path.join(root, 'content', sourceDirectory, path.basename(post.file, '.md'));
    if (fs.existsSync(assets)) copyTree(assets, path.join(root, outputDirectory, post.slug));
  }
}

function writeListing(posts, route, title, description) {
  const postList = posts.map(({ title: postTitle, date, slug, summary }) => `<article><h2><a href="/${route}/${slug}/">${postTitle}</a></h2><p class="muted">${date.slice(0, 4)}</p><p>${summary}</p></article>`).join('\n');
  writePage(path.join(root, route, 'index.html'), ejs.render(template, { title, description, body: `<h1>${title}</h1><p class="muted">${description}</p>${postList || '<p>No posts yet.</p>'}` }));
}

const archivedPosts = getPosts('archive');
const activePosts = getPosts('posts');
fs.rmSync(path.join(root, 'archive', 'image-ai-models-comparison'), { recursive: true, force: true });
buildPosts(archivedPosts, 'archive', 'archive', '/archive/');
buildPosts(activePosts, 'posts', 'blog', '/blog/');
writeListing(archivedPosts, 'archive', 'Archive', 'Archived engineering notes by Robin Mollah.');
writeListing(activePosts, 'blog', 'Blog', 'Recent engineering notes by Robin Mollah.');

for (const post of archivedPosts) redirect(path.join(root, 'blog', post.slug, 'index.html'), `/archive/${post.slug}/`);

for (const page of ['about', 'contact', 'privacy-policy']) {
  const result = renderMarkdownPage(path.join(root, 'content', 'pages', `${page}.md`));
  writePage(path.join(root, page, 'index.html'), result.html);
}

console.log(`Built ${activePosts.length} active posts, ${archivedPosts.length} archived posts, and 3 pages.`);
