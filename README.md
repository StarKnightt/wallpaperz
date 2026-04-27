# Wallpaperz

<p align="center">
  <img src="https://img.shields.io/github/stars/StarKnightt/wallpaperz?style=social" alt="GitHub stars">
  <img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License">
  <img src="https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat" alt="Contributions welcome">
</p>

An open-source wallpaper platform where you can browse HD/4K wallpapers and generate your own with AI. Built with Next.js, powered by ImageKit and Stability AI.

**Live at [wallpaperz.in](https://wallpaperz.in)**

## Features

- Browse and download HD & 4K wallpapers across categories (nature, anime, space, minimalist, etc.)
- Search and filter wallpapers in real time
- Generate custom 16:9 wallpapers using AI (Stable Diffusion XL) — requires sign-in
- Fullscreen preview with keyboard navigation and share links
- Dark and light mode
- Responsive — works on desktop, tablet, and mobile
- Pull-to-refresh to sync latest wallpapers from ImageKit

## Tech Stack

| | |
|---|---|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS, Radix UI / shadcn |
| **Animations** | Framer Motion |
| **Auth** | Clerk |
| **Images** | ImageKit |
| **AI Generation** | Stability AI (DreamStudio) |
| **Hosting** | Vercel |

## Getting Started

### Prerequisites

- Node.js 18+
- API keys for [Clerk](https://clerk.dev), [ImageKit](https://imagekit.io), and [Stability AI](https://platform.stability.ai) (see `env.example.txt`)

### Setup

```bash
git clone https://github.com/StarKnightt/wallpaperz.git
cd wallpaperz
npm install
cp env.example.txt .env.local
# Fill in your API keys in .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment Variables

See `env.example.txt` for the full list. The main ones:

| Variable | What it's for |
|---|---|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk auth (client) |
| `CLERK_SECRET_KEY` | Clerk auth (server) |
| `IMAGEKIT_PUBLIC_KEY` | ImageKit (client) |
| `IMAGEKIT_PRIVATE_KEY` | ImageKit (server) |
| `IMAGEKIT_URL_ENDPOINT` | ImageKit URL |
| `DREAMSTUDIO_API_KEY` | Stability AI for image generation |

## Screenshots

<details>
<summary>Click to expand</summary>
<br>
<p align="center">
  <img src="https://ik.imagekit.io/starknight/screenshots/home.png" alt="Home page" width="80%">
  <img src="https://ik.imagekit.io/starknight/screenshots/ai-generate.png" alt="AI Generate page" width="80%">
</p>
</details>

## Project Structure

```
app/
  page.tsx              Home — wallpaper grid with search and filters
  ai-generate/          AI image generation (Clerk-gated)
  category/[slug]/      Category pages with SEO metadata
  api/
    wallpapers/sync/    Fetches wallpapers from ImageKit (cached 1hr)
    ai-generate/        Calls Stability AI (rate-limited, 5/hr/user)
    imagekit/           Client upload auth
components/             UI components (Header, WallpaperGrid, Preview, etc.)
lib/                    ImageKit client/server, hooks, utils
types/                  TypeScript types
```

## Contributing

1. Fork the repo
2. Create a branch (`git checkout -b feature/something`)
3. Commit your changes
4. Push and open a PR

All contributions are welcome — features, bug fixes, or just improving the docs.

## License

MIT — see [LICENSE](LICENSE).

## Contact

Prasen — [prasen.dev](https://prasen.dev)

Project: [github.com/StarKnightt/wallpaperz](https://github.com/StarKnightt/wallpaperz)
