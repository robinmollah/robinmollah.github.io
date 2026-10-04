const fs = require('node:fs');
const path = require('node:path');
const { root, renderMarkdownPage, getPosts, ejs, template } = require('./site-content');

function writePage(destination, html) {
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.writeFileSync(destination, html);
}

function redirect(destination, target) {
  writePage(destination, `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta http-equiv="refresh" content="0; url=${target}"><link rel="canonical" href="${target}"><title>Moved</title></head><body><p>This page moved to <a href="${target}">${target}</a>.</p></body></html>`);
}

const posts = getPosts();
for (const post of posts) {
  const page = renderMarkdownPage(post.source, '/archive/');
  writePage(path.join(root, 'archive', post.slug, 'index.html'), page.html);
  redirect(path.join(root, 'blog', post.slug, 'index.html'), `/archive/${post.slug}/`);
  const assets = path.join(root, 'content', 'archive', path.basename(post.file, '.md'));
  if (fs.existsSync(assets)) {
    for (const asset of fs.readdirSync(assets)) {
      fs.copyFileSync(path.join(assets, asset), path.join(root, 'archive', post.slug, asset));
    }
  }
}

const postList = posts.map(({ title, date, slug }) => `<article><h2><a href="/archive/${slug}/">${title}</a></h2><p class="muted">${date.slice(0, 4)}</p></article>`).join('\n');
const archive = ejs.render(template, {
  title: 'Archive',
  description: 'Archived engineering notes by Robin Mollah.',
  body: `<h1>Archive</h1><p class="muted">Archived engineering notes generated from the Markdown source in <code>content/archive/</code>.</p>${postList}`
});
writePage(path.join(root, 'archive', 'index.html'), archive);
redirect(path.join(root, 'blog', 'index.html'), '/archive/');

for (const page of ['about', 'contact', 'privacy-policy']) {
  const result = renderMarkdownPage(path.join(root, 'content', 'pages', `${page}.md`));
  writePage(path.join(root, page, 'index.html'), result.html);
}

console.log(`Built ${posts.length} archived posts and 3 pages.`);
