# MILO — Landing Page

The marketing website for **MILO**, an iOS app that gives Siri the brains of
GPT, Claude, Gemini, and 200+ AI models — hands-free, even in CarPlay.

🔗 **Live:** https://luongnv.com/milo-website/

## Tech stack

- [Vite](https://vitejs.dev/) + [React 19](https://react.dev/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- Deployed to **GitHub Pages** via GitHub Actions

## Local development

```bash
npm install
npm run dev      # start the dev server
npm run build    # production build to dist/
npm run preview  # preview the production build locally
```

## Deployment

Every push to `main` triggers [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml),
which builds the site and publishes `dist/` to GitHub Pages.

The site is served from a project subpath (`/milo-website/`), so
[`vite.config.js`](vite.config.js) sets `base: '/milo-website/'`. Runtime asset
references in components use `import.meta.env.BASE_URL` so they resolve under
that subpath.

> **GitHub Pages setup:** Settings → Pages → Source = **GitHub Actions**.
