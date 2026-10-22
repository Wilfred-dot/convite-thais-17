import { INVITE_HTML } from "./inviteHtml";

const clean = (s: string) => s.replace(/[^\p{L}\p{N}\s'’-]/gu, "").replace(/\s+/g, " ").trim().slice(0, 80);
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

export function renderInvite(guest: string, origin = ""): string {
  const name = clean(guest);
  const title = name ? `Convite para ${name} · Thais 17 Anos` : "Thais Laysa · 17 Anos";
  const ogTitle = name ? `${name}, tens um convite especial` : "Thais Laysa celebra 17 anos";
  const desc = "Festa de Aniversário · Sábado, 31 de Outubro, às 12h00 · Beira";
  const img = `${origin}/og-v2.jpg`;
  const body = INVITE_HTML
    .replace(/<title>.*?<\/title>/, "")
    .replace('"__GUEST__"', JSON.stringify(name).replace(/</g, "\\u003c"));
  return `<!doctype html><html lang="pt"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>${esc(title)}</title><meta name="theme-color" content="#22040e">
<meta name="description" content="${esc(desc)}">
<meta name="robots" content="noindex,nofollow">
<meta property="og:type" content="website"><meta property="og:locale" content="pt_PT">
<meta property="og:title" content="${esc(ogTitle)}"><meta property="og:description" content="${esc(desc)}">
<meta property="og:image" content="${img}"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:image" content="${img}">
<link rel="icon" href="/icon.svg"><style>html,body{margin:0;background:#14020a}</style></head>
<body>${body}</body></html>`;
}

export const htmlResponse = (html: string) =>
  new Response(html, { headers: { "content-type": "text/html; charset=utf-8", "cache-control": "public, max-age=0, s-maxage=600" } });
