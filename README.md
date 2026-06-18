![iOS](https://img.shields.io/badge/iOS-17.6%2B-black?logo=apple)
![App Store](https://img.shields.io/badge/App%20Store-available-3b82f6?logo=apple)
![Models](https://img.shields.io/badge/models-200%2B-06b6d4)

# Hands-free AI for Siri and CarPlay

MILO lets you say "Hey Siri, ask MILO…" and routes your voice to GPT, Claude,
Gemini, or 200+ other models — from the lock screen, your headphones, or the car.

[**Download on the App Store &rarr;**](https://apps.apple.com/app/ask-milo-ai-chat-assistant/id6780062368) &nbsp;·&nbsp; [**Report a bug**](https://github.com/luongnv89/milo-website/issues/new?template=bug_report.yml&labels=bug) &nbsp;·&nbsp; [**Request a feature**](https://github.com/luongnv89/milo-website/issues/new?template=feature_request.yml&labels=enhancement)

---

## Report a bug or request a feature

This repo is where MILO's feedback lives. Pick the form that fits — each one
comes pre-filled, and a free GitHub account is all you need.

| I want to… | Open this |
|---|---|
| Report something broken | [Bug report](https://github.com/luongnv89/milo-website/issues/new?template=bug_report.yml&labels=bug) |
| Pitch a model, shortcut, or workflow | [Feature request](https://github.com/luongnv89/milo-website/issues/new?template=feature_request.yml&labels=enhancement) |
| Ask a question or share praise | [General feedback](https://github.com/luongnv89/milo-website/issues/new?template=feedback.yml) |

MILO is built and used daily by one person. Every issue is read.

## What MILO does

On iOS, only Siri can be triggered hands-free system-wide. MILO hands that voice
off to the model you choose — so you get a real AI answer while driving, walking,
or multitasking.

| Feature | What you get |
|---|---|
| Hands-free | Trigger via Siri from lock screen, headphones, or CarPlay |
| Made for the car | CarPlay mode keeps answers short and spoken |
| 200+ models | 8 providers plus on-device Apple Intelligence and local Ollama |
| Switch by voice | Change models mid-conversation without touching the screen |
| Private by default | Keys in the iOS Keychain; history stays on-device via SwiftData |
| Bring your own keys | Pay providers directly; many have free tiers |

## Get MILO

1. Open the [MILO listing on the App Store](https://apps.apple.com/app/ask-milo-ai-chat-assistant/id6780062368) on your iPhone.
2. Tap Get to download it like any other app. Requires iOS 17.6+.

## This repo

This is the source for MILO's marketing site, [askmilo.pro](https://askmilo.pro).
It doubles as the public issue tracker for the app.

```bash
npm install
npm run dev      # start the dev server
```

<details>
<summary>Tech stack & local development</summary>

- [Vite](https://vitejs.dev/) + [React 19](https://react.dev/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- Deployed to **GitHub Pages** via GitHub Actions

```bash
npm install
npm run dev      # start the dev server
npm run build    # production build to dist/
npm run preview  # preview the production build locally
```

</details>

<details>
<summary>Deployment</summary>

Every push to `main` triggers [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml),
which builds the site and publishes `dist/` to GitHub Pages.

The site is served from the apex domain `askmilo.pro` (set via
[`public/CNAME`](public/CNAME)), so [`vite.config.js`](vite.config.js) sets
`base: '/'`.

> **GitHub Pages setup:** Settings &rarr; Pages &rarr; Source = **GitHub Actions**.

</details>
