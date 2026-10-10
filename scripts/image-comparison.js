const fs = require('node:fs');
const path = require('node:path');
const { marked } = require('marked');
const { root, readMarkdown, ejs } = require('./site-content');

const sourceDir = path.join(root, 'content', 'posts', 'image-ai-models-comparison');
const template = fs.readFileSync(path.join(root, 'templates', 'image-comparison.ejs'), 'utf8');
const models = [
  { key: 'flux-dev', prefix: 'diffusers_FLUX.1-dev-bnb-4bit', name: 'FLUX.1 Dev', detail: 'Diffusers · bnb 4-bit' },
  { key: 'flux-klein', prefix: 'unsloth_FLUX.2-klein-4B-GGUF', name: 'FLUX.2 Klein 4B', detail: 'Unsloth · GGUF' },
  { key: 'qwen', prefix: 'unsloth_Qwen-Image-2.1-GGUF', name: 'Qwen Image 2.1', detail: 'Unsloth · GGUF' },
  { key: 'sdxl', prefix: 'unsloth_sdxl-turbo', name: 'SDXL Turbo', detail: 'Unsloth' }
];

function comparisonData() {
  const scenes = fs.readdirSync(sourceDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && entry.name.startsWith('scene-'))
    .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }))
    .map((entry) => {
      const files = fs.readdirSync(path.join(sourceDir, entry.name)).filter((file) => file.toLowerCase().endsWith('.png'));
      return {
        id: entry.name,
        label: entry.name.replace('-', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase()),
        models: Object.fromEntries(models.map((model) => [model.key, files.filter((file) => file.startsWith(model.prefix)).sort().map((file) => ({ file, label: file.match(/_(\d+)_/)?.[1] ? `Variant ${file.match(/_(\d+)_/)[1]}` : 'Output', url: `/blog/image-ai-models-comparison/${entry.name}/${encodeURIComponent(file)}` }))]))
      };
    });
  return { models, scenes };
}

function renderComparisonPage() {
  const { attributes, body } = readMarkdown(path.join(root, 'content', 'posts', 'image-ai-models-comparison.md'));
  const intro = body.split('<!--more-->')[0].replace(/<image[^>]*>/gi, '').trim();
  const data = comparisonData();
  return ejs.render(template, {
    title: attributes.title || 'AI image model comparison',
    intro: marked.parse(intro),
    models: data.models,
    scenes: data.scenes,
    dataJson: JSON.stringify(data)
  });
}

module.exports = { sourceDir, comparisonData, renderComparisonPage };
