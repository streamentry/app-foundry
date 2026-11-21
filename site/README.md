# Tini Apps website

Astro site for `https://tiniapps.runlumi.app`, deployed as a Cloudflare Worker. The
site has product information, a factual privacy and data page, and a support FAQ
for Shift Calendar. It adds no analytics, forms, accounts, or advertising.

## Local use

From the repository root:

```sh
npm run site:dev
npm run site:build
npm run site:preview
```

## Deploy

The Worker binds the custom domain `tiniapps.runlumi.app`. Before production deploy,
set `PUBLIC_SUPPORT_EMAIL` to the real public privacy and support contact. The
privacy page intentionally displays a pre-release notice while this value is
missing. The compatibility date is pinned to the newest date supported by the
age-eligible local Worker runtime. Update it after upgrading Wrangler and its
runtime. Confirm the contact, policy text, and Cloudflare zone before running:

```sh
npx wrangler whoami
npm run site:deploy
```

Do not put Cloudflare tokens in this repository. Use `wrangler login` for local
authorization or a secured `CLOUDFLARE_API_TOKEN` in automation.
