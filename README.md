# Robin Mollah's website

This is a plain static website. The published pages are HTML files at the repository root, with their CSS and JavaScript kept alongside them.

## Preview locally

From the repository root, run:

```sh
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

## Writing notes

Keep rough writing in [`content/`](content/). Markdown files there are source material, not pages served by the site. Ask the AI to correct the grammar, preserve the meaning, and turn a selected Markdown file into a finished HTML page before publishing it.

The writing workflow and optional page metadata are documented in [`content/README.md`](content/README.md).
