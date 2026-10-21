import fs from "node:fs";
import path from "node:path";
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const tpl = fs.readFileSync(path.join(root, "invite/template.html"), "utf8");

// Versão do site (Next.js): ficheiros servidos de /public
const site = tpl
  .replace("__FOTO1__", "/fotos/foto-1.jpg").replace("__FOTO2__", "/fotos/foto-2.jpg").replace("__FOTO3__", "/fotos/foto-3.jpg")
  .replace("__MUSIC__", "/musica.mp3")
  .replace("__ICS__", "/festa.ics")
  .replace("__VCF__", "/wilfred-deloviar.vcf")
  .replace("__ALBUM_LIVE__", "true");
fs.writeFileSync(
  path.join(root, "lib/inviteHtml.ts"),
  "// Gerado por scripts/build-invite.mjs a partir de invite/template.html. Não editar.\nexport const INVITE_HTML = " + JSON.stringify(site) + ";\n"
);

// Pré-visualização autónoma (um só ficheiro) para o Claude
const out = process.argv[2];
if (out) {
  const b64 = (f, t) => `data:${t};base64,` + fs.readFileSync(path.join(root, f)).toString("base64");
  const ics = "data:text/calendar;charset=utf-8," + encodeURIComponent(fs.readFileSync(path.join(root, "lib/festa.ics.txt"), "utf8"));
  const html = tpl
    .replace("__FOTO1__", b64("public/fotos/foto-1.jpg", "image/jpeg")).replace("__FOTO2__", b64("public/fotos/foto-2.jpg", "image/jpeg")).replace("__FOTO3__", b64("public/fotos/foto-3.jpg", "image/jpeg"))
    .replace("__MUSIC__", b64("public/musica.mp3", "audio/mpeg"))
    .replace("__ICS__", ics)
    .replace("__VCF__", b64("public/wilfred-deloviar.vcf", "text/vcard"))
    .replace("__ALBUM_LIVE__", "false")
    .replace('"__GUEST__"', '""');
  fs.writeFileSync(out, html);
}
