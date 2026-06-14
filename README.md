# Narve Labs — Website

Marketing site for [narvelabs.com](https://narvelabs.com). Built with Astro and Tailwind CSS.

## Tech Stack

- **Framework:** Astro (static output)
- **Styling:** Tailwind CSS v4
- **Animations:** GSAP + ScrollTrigger
- **3D:** Three.js (hero canvas)
- **Lead capture:** Make.com webhook → Airtable

## Getting Started

```bash
npm install
npm run dev
```

## Commands

| Command | Action |
|---------|--------|
| `npm run dev` | Start local dev server at `localhost:4321` |
| `npm run build` | Build for production to `./dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run check` | Run Astro type checks |

## Environment Variables

Create a `.env` file at the root (see `.gitignore` — never commit this):

```env
PUBLIC_MAKE_WEBHOOK_URL=your_make_webhook_url

# Airtable (if used server-side in future)
AIRTABLE_PAT=your_personal_access_token
AIRTABLE_BASE_ID=your_base_id
AIRTABLE_TABLE_NAME=Leads
AIRTABLE_TABLE_ID=your_table_id
```

## Lead Form

The "Let's Talk" form (`src/components/Contact.astro`) collects:
- Name, Email, Message
- UTM params + referrer (captured silently from the URL)

Submissions POST to a Make.com webhook which saves to Airtable and sends an email notification.

## Project Structure

```
src/
├── components/
│   ├── Nav.astro
│   ├── Hero.astro
│   ├── Marquee.astro
│   ├── Manifesto.astro
│   ├── Services.astro
│   ├── HowItWorks.astro
│   ├── Uses.astro
│   ├── Contact.astro   ← lead form
│   └── Footer.astro
├── layouts/
│   └── BaseLayout.astro
├── pages/
│   └── index.astro
├── scripts/
│   └── main.ts         ← GSAP animations + Three.js
└── styles/
    └── global.css
```
