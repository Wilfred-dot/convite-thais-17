import fs from "node:fs";
import path from "node:path";
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const tpl = fs.readFileSync(path.join(root, "invite/template.html"), "utf8");

// A música é o primeiro ficheiro .mp3 (ou .m4a) da pasta public, seja qual for o nome
const musicFile = fs.readdirSync(path.join(root, "public")).filter((f) => /\.(mp3|m4a)$/i.test(f)).sort()[0] || "musica.mp3";
const musicType = /\.m4a$/i.test(musicFile) ? "audio/mp4" : "audio/mpeg";

// Versão do site (Next.js): ficheiros servidos de /public
const site = tpl
  .replace("__FOTO1__", "/fotos/foto-1.jpg").replace("__FOTO2__", "/fotos/foto-2.jpg").replace("__FOTO3__", "/fotos/foto-3.jpg")
  .replace("__MUSIC__", "/" + encodeURIComponent(musicFile))
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
    .replace("__MUSIC__", b64("public/" + musicFile, musicType))
    .replace("__ICS__", ics)
    .replace("__VCF__", b64("public/wilfred-deloviar.vcf", "text/vcard"))
    .replace("__ALBUM_LIVE__", "false")
    .replace('"__GUEST__"', '""');
  fs.writeFileSync(out, html);
}
