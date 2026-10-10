# Robin Mollah's website

This is a plain static website. The published pages are HTML files at the repository root, with their CSS and JavaScript kept alongside them. EJS is used only to generate repeated page shells and navigation during the build; the deployed site contains ordinary HTML.

## Development server

The development server renders Markdown through EJS on every request, so edits are visible after refreshing the page:

```sh
npm install
npm run dev
```

Open <http://localhost:8000>. Recent posts are at <http://localhost:8000/blog/> and older posts are at <http://localhost:8000/archive/>.

## Production build

For static hosting, generate ordinary HTML first:

```sh
npm run build
```

The generated files can be served by any web server. To preview that static output locally:

```sh
npm run serve
```

## Writing notes

Keep rough writing in [`content/`](content/). Markdown files there are source material, not pages served by the site. Ask the AI to correct the grammar, preserve the meaning, and turn a selected Markdown file into a finished HTML page before publishing it.

The writing workflow and optional page metadata are documented in [`content/README.md`](content/README.md).
