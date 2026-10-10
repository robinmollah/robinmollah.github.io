const fs = require('node:fs');
const path = require('node:path');
const ejs = require('ejs');
const { marked } = require('marked');

const root = path.resolve(__dirname, '..');
const template = fs.readFileSync(path.join(root, 'templates', 'layout.ejs'), 'utf8');

function readMarkdown(file) {
  const source = fs.readFileSync(file, 'utf8');
  if (!source.startsWith('---')) return { attributes: {}, body: source };
  const end = source.indexOf('\n---', 3);
  if (end === -1) return { attributes: {}, body: source };
  const attributes = {};
  for (const line of source.slice(4, end).split('\n')) {
    const separator = line.indexOf(':');
    if (separator === -1) continue;
    attributes[line.slice(0, separator).trim()] = line.slice(separator + 1).trim().replace(/^['"]|['"]$/g, '');
  }
  return { attributes, body: source.slice(end + 4).trimStart() };
}

function slugify(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function summary(body) {
  const text = body
    .split('<!--more-->')[0]
    .replace(/<[^>]+>/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/[#*_`>-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return text.length > 220 ? `${text.slice(0, 217).trimEnd()}…` : text;
}

function renderMarkdownPage(file, backLink = '') {
  const { attributes, body } = readMarkdown(file);
  const title = attributes.title || path.basename(file, '.md');
  const rendered = marked.parse(body).replace(/https?:\/\/robin\.engineer\/[^"')]+\/([^"')/]+\.(?:svg|png|jpg|jpeg|gif))/gi, '$1');
  const content = `${backLink ? `<p><a href="${backLink}">← All engineering notes</a></p>` : ''}<article><h1>${title}</h1>${attributes.date ? `<p class="muted">${attributes.date}</p>` : ''}${rendered}</article>`;
  return { title, description: attributes.description || title, html: ejs.render(template, { title, description: attributes.description || title, body: content }) };
}

function getPosts(directory = 'archive') {
  return fs.readdirSync(path.join(root, 'content', directory))
    .filter((file) => file.endsWith('.md'))
    .map((file) => {
      const source = path.join(root, 'content', directory, file);
      const { attributes, body } = readMarkdown(source);
      return { file, source, title: attributes.title || path.basename(file, '.md'), date: attributes.date || '', slug: slugify(path.basename(file, '.md')), summary: summary(body) };
    })
    .sort((a, b) => b.date.localeCompare(a.date));
}

module.exports = { root, readMarkdown, renderMarkdownPage, getPosts, template, ejs };
