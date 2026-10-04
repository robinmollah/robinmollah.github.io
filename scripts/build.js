const fs = require('node:fs');
const path = require('node:path');
const { root, renderMarkdownPage, getPosts, ejs, template } = require('./site-content');

function writePage(destination, html) {
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.writeFileSync(destination, html);
}

const posts = getPosts();
for (const post of posts) {
  const page = renderMarkdownPage(post.source, '/blog/');
  writePage(path.join(root, 'blog', post.slug, 'index.html'), page.html);
  const assets = path.join(root, 'content', 'posts', path.basename(post.file, '.md'));
  if (fs.existsSync(assets)) {
    for (const asset of fs.readdirSync(assets)) {
      fs.copyFileSync(path.join(assets, asset), path.join(root, 'blog', post.slug, asset));
    }
  }
}

const postList = posts.map(({ title, date, slug }) => `<article><h2><a href="/blog/${slug}/">${title}</a></h2><p class="muted">${date.slice(0, 4)}</p></article>`).join('\n');
const blog = ejs.render(template, {
  title: 'Blog',
  description: 'Engineering notes by Robin Mollah.',
  body: `<h1>Engineering notes</h1><p class="muted">These pages are generated from the Markdown source in <code>content/posts/</code>.</p>${postList}`
});
writePage(path.join(root, 'blog', 'index.html'), blog);

for (const page of ['about', 'contact', 'privacy-policy']) {
  const result = renderMarkdownPage(path.join(root, 'content', 'pages', `${page}.md`));
  writePage(path.join(root, page, 'index.html'), result.html);
}

console.log(`Built ${posts.length} blog posts and 3 pages.`);
