/* Each page of the site (/products, /services …) is the same single-page app, but search engines should
   see it as its own page. This runs on Vercel before the page is sent and fills in that page's title,
   description, share tags, main heading and breadcrumb, so Google reads them straight away. */
export const config = { matcher: ['/products', '/stats', '/services', '/gallery', '/careers', '/contact'] };

const SITE = 'https://southcircle.io';
const PAGES = {
  products: { name: 'Products', title: 'Products | SouthCircle', h1: 'SouthCircle products: consumer apps we create and operate',
    desc: 'The consumer apps SouthCircle creates and operates, built to become part of everyday life. Tap any product to see what it does and where to get it.' },
  stats: { name: 'Stats', title: 'SouthCircle in numbers | SouthCircle', h1: 'SouthCircle in numbers',
    desc: 'Products launched, revenue enabled, monthly usage and people reached: what SouthCircle’s consumer apps have done so far.' },
  services: { name: 'Services', title: 'Services: product, design, engineering and operations | SouthCircle', h1: 'SouthCircle services: product, design, engineering and operations',
    desc: 'SouthCircle builds consumer products end to end: product strategy and prototypes, UX and interface design, web and mobile engineering, and 24/7 operations.' },
  gallery: { name: 'Gallery', title: 'Gallery: life at SouthCircle', h1: 'Gallery: life at SouthCircle',
    desc: 'The life we live outside building products: photos from the SouthCircle team in Lagos, Nigeria.' },
  careers: { name: 'Careers', title: 'Careers at SouthCircle | Join our team', h1: 'Careers at SouthCircle',
    desc: 'Past and present SouthCircle team members have contributed to the world’s greatest projects. See their work and join the team in Lagos.' },
  contact: { name: 'Contact', title: 'Contact SouthCircle | Start a conversation', h1: 'Contact SouthCircle',
    desc: 'Start a project with SouthCircle. Email hello@southcircle.io or send a message about what you’re building.' }
};
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export function fill(html, id) {
  const p = PAGES[id]; if (!p) return html;
  const url = `${SITE}/${id}`, t = esc(p.title), d = esc(p.desc);
  const crumbs = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'SouthCircle', item: `${SITE}/` },
    { '@type': 'ListItem', position: 2, name: p.name, item: url }] };
  return html
    .replace(/<title>[^<]*<\/title>/, `<title>${t}</title>`)
    .replace(/(<meta name="description" content=")[^"]*/, `$1${d}`)
    .replace(/(<meta property="og:title" content=")[^"]*/, `$1${t}`)
    .replace(/(<meta property="og:description" content=")[^"]*/, `$1${d}`)
    .replace(/(<meta property="og:url" content=")[^"]*/, `$1${url}`)
    .replace(/(<meta name="twitter:title" content=")[^"]*/, `$1${t}`)
    .replace(/(<meta name="twitter:description" content=")[^"]*/, `$1${d}`)
    .replace(/(<h1 class="sr">)[^<]*/, `$1${esc(p.h1)}`)
    .replace('</head>', `<link rel="canonical" href="${url}">\n<script type="application/ld+json">${JSON.stringify(crumbs)}</script>\n</head>`);
}

export default async function middleware(request) {
  const u = new URL(request.url);
  const id = u.pathname.replace(/^\/+|\/+$/g, '').toLowerCase();
  if (!PAGES[id]) return;
  const pass = new Headers({ 'x-sc-page': id });                   // keep the visitor's access on protected preview links
  for (const k of ['cookie', 'authorization', 'x-vercel-protection-bypass']) { const v = request.headers.get(k); if (v) pass.set(k, v); }
  const res = await fetch(new URL('/index.html' + u.search, u), { headers: pass });
  if (!res.ok) return;
  const html = await res.text();
  if (!html.includes('id="stage"')) return;                         // not the site page (e.g. a login screen): serve it normally
  const headers = new Headers({ 'content-type': 'text/html; charset=utf-8', 'cache-control': 'public, max-age=0, must-revalidate' });   // canonical + noindex headers come from vercel.json
  return new Response(fill(html, id), { status: 200, headers });
}
