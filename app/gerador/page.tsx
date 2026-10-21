"use client";
import { useState } from "react";
import Silk from "../../components/Silk";
import { slugify, nameFromSlug } from "../../lib/guest";
import { wa } from "../../lib/config";

type Row = { name: string; url: string; msg: string };

export default function Gerador() {
  const [text, setText] = useState("");
  const [rows, setRows] = useState<Row[]>([]);
  const [done, setDone] = useState<string | null>(null);

  const flash = (k: string) => { setDone(k); setTimeout(() => setDone(null), 1800); };
  const copy = async (k: string, v: string) => {
    try { await navigator.clipboard.writeText(v); } catch {
      const t = document.createElement("textarea"); t.value = v; document.body.appendChild(t); t.select();
      try { document.execCommand("copy"); } catch {} t.remove();
    }
    flash(k);
  };

  const generate = () => {
    const seen = new Set<string>();
    const out: Row[] = [];
    for (const line of text.split("\n")) {
      const slug = slugify(line);
      if (!slug || seen.has(slug)) continue;
      seen.add(slug);
      const name = nameFromSlug(slug);
      const url = `${location.origin}/c/${slug}`;
      const msg = `Olá, ${name.split(" ")[0]}! ✨ A Thais convida-te para celebrar os seus 17 anos, no sábado, 31 de Outubro, às 12h. Abre o teu convite: ${url}`;
      out.push({ name, url, msg });
    }
    setRows(out);
  };

  return (
    <>
      <Silk />
      <main className="relative z-10 mx-auto max-w-2xl px-5 py-12">
        <h1 className="font-display text-4xl gold-text">Gerador de convites</h1>
        <p className="mt-3 text-silk/75">Um nome completo por linha. Cada convidado recebe o seu próprio link.</p>
        <textarea
          value={text} onChange={(e) => setText(e.target.value)} rows={8}
          placeholder={"Maria João da Silva\nCarlos Alberto Mondlane"}
          className="mt-6 w-full rounded-2xl glass p-4 text-silk placeholder:text-silk/30 outline-none focus:border-champagne"
        />
        <div className="mt-4 flex flex-wrap gap-3">
          <button className="btn btn-gold" onClick={generate}>Gerar links</button>
          {rows.length > 0 && (
            <button className="btn btn-line" onClick={() => copy("all", rows.map((r) => `${r.name}\t${r.url}`).join("\n"))}>
              {done === "all" ? "Lista copiada" : `Copiar lista (${rows.length})`}
            </button>
          )}
        </div>

        <ul className="mt-8 space-y-3">
          {rows.map((r) => (
            <li key={r.url} className="glass rounded-2xl p-4">
              <p className="font-display italic text-xl text-rose">{r.name}</p>
              <p className="mt-1 break-all text-sm text-silk/60">{decodeURI(r.url)}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button className="btn btn-line !min-h-10 !px-4 text-sm" onClick={() => copy(r.url, r.url)}>{done === r.url ? "Link copiado" : "Copiar link"}</button>
                <button className="btn btn-line !min-h-10 !px-4 text-sm" onClick={() => copy(r.url + "m", r.msg)}>{done === r.url + "m" ? "Mensagem copiada" : "Copiar mensagem"}</button>
                <a className="btn btn-gold !min-h-10 !px-4 text-sm" href={wa("", r.msg).replace("wa.me//", "wa.me/")} target="_blank" rel="noopener noreferrer">Abrir no WhatsApp</a>
              </div>
            </li>
          ))}
        </ul>
      </main>
    </>
  );
}
