# A Birthday Surprise

A cinematic, personalized birthday experience. Upload photos, write a message, and
generate a private link that turns into an interactive birthday journey — opening
scene, animated greeting, memory timeline, photo slideshow, a tap-to-reveal secret
message, a countdown surprise, and a grand confetti finale.

Everything runs client-side: photos are compressed in the browser and the whole
experience is packed into the share link itself, so there's no server or database
involved.

## Getting started

```bash
npm install
npm run dev
```

Open the printed local URL. Fill in the **Studio** form, upload a few photos, then
use **Preview experience** to try it, or **Copy share link** to get a URL you can
send to the recipient. Opening that link (in any browser, on any device) plays the
experience directly — no account or backend required.

## How the share link works

The recipient's name, message, photos, and settings are serialized to JSON,
compressed, and placed in the URL's hash fragment (`#gift=...`). Hash fragments are
never sent to a server, so nothing is uploaded — the link is the data. This keeps
the whole project static and deployable anywhere (Netlify, Vercel, GitHub Pages,
etc.), but it also means:

- More or larger photos make the link longer. The Studio shows an estimated link
  size and automatically compresses uploads to keep it reasonable.
- The link only works once the site is deployed somewhere reachable by the
  recipient — running it purely on `localhost` won't be openable by someone else.

## Project structure

```
src/
  components/
    studio/       the sender-facing creation UI (form, photo manager, share bar)
    experience/   the recipient-facing cinematic journey (scenes, music player, nav)
    effects/      shared visual effects (hearts, sparkles, ambient glow)
  lib/            image compression, link encode/decode, local draft autosave
  hooks/          small shared hooks (prefers-reduced-motion)
  types.ts        the BirthdayData shape shared by both sides
```

## Scripts

- `npm run dev` — start the dev server
- `npm run build` — type-check and build for production
- `npm run preview` — preview the production build locally
- `npm run lint` — lint the codebase

## Notes on media

No third-party photos, video, or music are bundled. Background music is optional
and sender-provided via a URL to a track they have the rights to use (e.g. a
royalty-free host) — nothing is embedded or redistributed by this project.
