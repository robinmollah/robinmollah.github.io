# Writing with Markdown

Use this directory for notes and drafts. Write freely in Markdown and keep one idea per file.

When a note is ready, ask the AI to:

1. Fix grammar, spelling, and awkward phrasing while preserving the author's voice and meaning.
2. Keep code, commands, URLs, and technical names exact.
3. Turn the result into a complete accessible HTML page that matches the site's existing visual style.
4. Save the finished page at the requested public route, and leave the original Markdown file unchanged.
5. Add a link from the site navigation or notes index when appropriate.

## Suggested page metadata

```yaml
---
title: A clear page title
date: 2026-10-04
description: A short description for search and link previews.
---
```

Published HTML belongs at the repository root or inside a route directory such as `blog/` or `archive/`. Markdown stays under `content/` so it is never mistaken for a page that the browser should serve directly.
