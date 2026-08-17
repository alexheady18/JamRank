# JamRank — Jam Band Tape Vault

Rate live versions of jam band songs, pulled straight from the Internet
Archive's entire collection. Covers Grateful Dead, Phish, Widespread
Panic, Umphrey's McGee, Goose, and STS9 to start — easy to add more.

## Deploying — no coding or terminal required

Everything below happens through websites (GitHub, Neon, Vercel) by
clicking buttons. You won't write or edit any code.

1. **GitHub** (free) — create an account at github.com, then create a
   new repository and drag the contents of this folder into it using
   "Add file → Upload files" on the repo page.
2. **Neon** (free) — create an account at neon.tech, create a new
   project, and copy the **connection string** it gives you (starts
   with `postgresql://`).
3. **Vercel** (free) — create an account at vercel.com (sign in with
   GitHub), click "Add New → Project", and import the repository you
   just created.
4. Before clicking Deploy, open "Environment Variables" and add one:
   - Name: `DATABASE_URL`
   - Value: the connection string you copied from Neon
5. Click **Deploy**. Vercel installs everything, creates the database
   tables automatically, and gives you a live `.vercel.app` link when
   it's done (a few minutes).

That's it — the site is live. Every time you upload changed files to
GitHub, Vercel redeploys automatically.

### Custom domain (optional)

In the Vercel project settings under "Domains," you can attach a domain
you own, or buy one directly through Vercel.

## How it works (for context, not required reading)

- **No manual database of shows.** The first time someone looks up a
  song, the server searches Archive.org for matching recordings and
  saves the results, so future visitors get an instant answer.
- **Ratings** are tied to an anonymous cookie per visitor — no login
  required, no personal data collected.
- Song matching is text-based (Archive.org has no per-track search API),
  so it's a strong guess, not a guarantee — each song page has a
  "Refresh from Archive.org" button to re-check for new tapes.

## Adding more bands or songs

Everything lives in one file: `data/bands.ts`. Each band is a name, a
color, one or more name variants Archive.org uses for that band's
recordings, and a starter list of songs. Upload the edited file to
GitHub and Vercel redeploys with the new band showing up automatically.
Visitors can also search any song beyond the starter list.

## If you want a developer to extend this later

- `app/` — pages and API routes (Next.js App Router)
- `components/` — the star rating, tape counter, and version list UI
- `prisma/schema.prisma` — the two database tables (`Version`, `Rating`)
- `lib/archive.ts` — the Archive.org search logic
- Local dev: `npm install`, set `DATABASE_URL` in `.env`, then
  `npm run dev`

## Known limitations

- Match quality depends on how complete each taper's show description
  is on Archive.org.
- The anonymous cookie is a light deterrent, not real anti-abuse — fine
  for a fan project, worth hardening if it gets heavy traffic.
- Independent fan project, not affiliated with any band or archive.org
  — please keep the credit line in the footer.
