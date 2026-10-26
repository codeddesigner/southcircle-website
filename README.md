# South Circle website

The site at [southcircle.io](https://southcircle.io): a static, single-page site with an admin at `/admin`.

- `index.html`, `site.css`, `site.js` and the other scripts are the public site. `content.js` applies the text and page order saved in the admin, then loads the rest.
- `privacy.html` / `privacy.js` is the privacy policy page (editable in Admin → Settings).
- `admin/` is the admin panel (sign-in, products, showcase cards, stats, gallery, clients, team, hiring, content, pages, settings).
- `vercel.json` holds the clean addresses (`/products`, `/admin/hiring`, …), headers and redirects.

Content, products, applications and uploads live in Supabase. The site is hosted on Vercel.
