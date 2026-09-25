# Products & Tools

Standalone React catalog for Robin Mollah's SaaS products and quick engineering
tools. It is kept outside Hexo's `source/` directory and has its own build and
deployment output.

## Development

```sh
cd open-source-tools
npm install
npm run dev
```

## Production

```sh
npm run build
npm run preview
```

Deploy `open-source-tools/dist/` as a static site. For hosts with project-root
configuration, set the root directory to `open-source-tools`, the build command
to `npm run build`, and the output directory to `dist`.

The app uses clean client-side product routes. `public/_redirects` provides the
SPA fallback for Netlify and Cloudflare Pages, while `vercel.json` provides the
equivalent Vercel rewrite.

Add SaaS products to `products` and future utilities to `quickTools` in
`src/App.jsx`. Product detail routes and tool routes can be introduced as those
applications are prepared for deployment.
