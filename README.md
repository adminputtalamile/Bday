# A Birthday Surprise

A cinematic, personalized birthday experience. Upload photos, write a message, and
generate a private link that turns into an interactive birthday journey — opening
scene, animated greeting, memory timeline, photo slideshow, a tap-to-reveal secret
message, a countdown surprise, and a grand confetti finale.

Photos and audio are compressed in the browser and, when deployed on Vercel with
Blob storage enabled, uploaded there directly — keeping the share link itself tiny
regardless of file size. Without Blob storage configured (e.g. running locally),
uploads fall back to embedding directly in the share link instead, within a much
smaller size limit. Either way there's no traditional database — recipient data
(names, messages, the photo/audio URLs) all lives in the link itself.

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

The recipient's name, message, and settings (plus photo/audio URLs) are serialized
to JSON, compressed, and placed in the URL's hash fragment (`#gift=...`). Hash
fragments are never sent to a server, so this part stays static-hostable anywhere.

- With Blob storage configured, photos and audio are uploaded to it and only their
  URLs go in the link — file size barely affects link length.
- Without it, uploads embed directly in the link instead, so more or larger files
  make the link longer. The Studio shows an estimated link size and blocks copying
  a link that's grown too large to reliably open.
- The link only works once the site is deployed somewhere reachable by the
  recipient — running it purely on `localhost` won't be openable by someone else.

## Enabling Vercel Blob storage (optional but recommended)

Uploads use Vercel Blob's **client upload** pattern: the browser uploads the file
bytes directly to Blob storage, and `api/upload.ts` only ever issues a short-lived
token for that upload — the file itself never passes through our own function. This
avoids any server/edge request-size ceiling, so a full song works the same as a
small photo.

1. In the Vercel dashboard, add a Blob store to the project **and connect it to
   this project** (Storage → your store → Connect Project — creating a store does
   not automatically wire it to a project). Vercel then injects the required
   `BLOB_READ_WRITE_TOKEN` env var into new deployments.
2. Redeploy after connecting it — env vars only apply to deployments made after
   they're set, not retroactively to an already-running one.
3. To test uploads locally, run `vercel link` then `vercel env pull` to get the
   token into `.env.local`, and use `vercel dev` instead of `npm run dev` (plain
   Vite dev/preview servers don't run `/api` functions at all — uploads will just
   use the embedded-in-link fallback there, which is fine for everything else).

If an upload fails, the browser console logs the real reason (open DevTools →
Console) — the UI itself falls back silently to embedding rather than surfacing an
error, since that fallback keeps things working even without storage configured.

## Project structure

```
api/
  upload.ts       Vercel Edge Function — issues client upload tokens for Blob storage
src/
  components/
    studio/       the sender-facing creation UI (form, photo manager, share bar)
    experience/   the recipient-facing cinematic journey (scenes, music player, nav)
    effects/      shared visual effects (hearts, sparkles, ambient glow)
  lib/            image compression, blob upload, link encode/decode, draft autosave
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
