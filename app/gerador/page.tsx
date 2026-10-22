"use client";
import { useEffect, useMemo, useState } from "react";
import Silk from "../../components/Silk";
import { slugify, nameFromSlug } from "../../lib/guest";

type Status = "novo" | "enviado" | "confirmou" | "nao-vai";
type Guest = { slug: string; name: string; phone: string; status: Status; sentAt?: number };

const KEY = "thais17_convidados_v1";
const ALBUM_URL = "https://drive.google.com/drive/folders/1HjlU6OYaQQZy-BXWTae3RJpxM3Bwb3sM?usp=sharing";
const FESTA = Date.parse("2026-10-31T12:00:00+02:00");
const ALBUM_OPEN = Date.parse("2026-10-31T00:00:00+02:00");
const ALBUM_CLOSE = Date.parse("2026-11-03T23:59:59+02:00");
const PRAZO = Date.parse("2026-10-28T23:59:59+02:00");

const LABEL: Record<Status, string> = { novo: "Link gerado", enviado: "Enviado", confirmou: "Confirmou", "nao-vai": "Não vai" };

const phoneDigits = (p: string) => {
  const d = p.replace(/\D/g, "");
  if (!d) return "";
  return d.length === 9 && d.startsWith("8") ? "258" + d : d;
};
const waLink = (phone: string, text: string) => `https://wa.me/${phoneDigits(phone)}?text=${encodeURIComponent(text)}`;

const inviteMsg = (name: string, url: string) =>
  `${name}, celebro os meus 17 anos no sábado, 31 de Outubro, às 12h00, e gostava muito de te ter comigo. O teu convite está aqui: ${url}`;
const reminderMsg = (name: string, url: string) =>
  `${name}, a minha festa de 17 anos é no sábado, 31 de Outubro, às 12h00. Ainda não recebi a tua resposta e gostava muito de saber se vens. Podes confirmar até 28 de Outubro no teu convite: ${url}`;

function span(ms: number) {
  if (ms <= 0) return "0 min";
  const m = Math.floor(ms / 60000), d = Math.floor(m / 1440), h = Math.floor((m % 1440) / 60), mi = m % 60;
  return d > 0 ? `${d} d ${h} h` : h > 0 ? `${h} h ${mi} min` : `${mi} min`;
}

export default function Gerador() {
  const [text, setText] = useState("");
  const [guests, setGuests] = useState<Guest[]>([]);
  const [ready, setReady] = useState(false);
  const [filter, setFilter] = useState<"todos" | Status | "pendentes">("todos");
  const [done, setDone] = useState<string | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const [backup, setBackup] = useState("");

  useEffect(() => {
    try { const raw = localStorage.getItem(KEY); if (raw) setGuests(JSON.parse(raw)); } catch {}
    setReady(true);
    const t = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(t);
  }, []);
  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem(KEY, JSON.stringify(guests)); } catch {}
  }, [guests, ready]);

  const flash = (k: string) => { setDone(k); setTimeout(() => setDone(null), 1600); };
  const copy = async (k: string, v: string) => {
    try { await navigator.clipboard.writeText(v); } catch {
      const t = document.createElement("textarea"); t.value = v; document.body.appendChild(t); t.select();
      try { document.execCommand("copy"); } catch {} t.remove();
    }
    flash(k);
  };

  const url = (g: Guest) => `${typeof location !== "undefined" ? location.origin : ""}/c/${g.slug}`;
  const update = (slug: string, patch: Partial<Guest>) => setGuests((a) => a.map((g) => (g.slug === slug ? { ...g, ...patch } : g)));

  const add = () => {
    const have = new Set(guests.map((g) => g.slug));
    const fresh: Guest[] = [];
    for (const line of text.split("\n")) {
      const slug = slugify(line);
      if (!slug || have.has(slug)) continue;
      have.add(slug);
      fresh.push({ slug, name: nameFromSlug(slug), phone: "", status: "novo" });
    }
    if (fresh.length) setGuests((a) => [...a, ...fresh]);
    setText("");
  };

  const count = useMemo(() => {
    const c = { total: guests.length, novo: 0, enviado: 0, confirmou: 0, "nao-vai": 0 } as Record<string, number>;
    guests.forEach((g) => { c[g.status]++; });
    return c;
  }, [guests]);

  const shown = guests.filter((g) =>
    filter === "todos" ? true : filter === "pendentes" ? g.status === "enviado" || g.status === "novo" : g.status === filter,
  );

  const exportText = guests.map((g) => `${g.name}\t${LABEL[g.status]}\t${g.phone}\t${url(g)}`).join("\n");
  const exportJson = JSON.stringify(guests);
  const importJson = () => {
    try { const a = JSON.parse(backup); if (Array.isArray(a)) { setGuests(a); setBackup(""); flash("imp"); } } catch { flash("imp-err"); }
  };

  const albumState =
    now < ALBUM_OPEN ? `O álbum abre em ${span(ALBUM_OPEN - now)}`
    : now <= ALBUM_CLOSE ? `Álbum aberto. Fecha em ${span(ALBUM_CLOSE - now)}`
    : "O álbum já fechou";

  return (
    <>
      <Silk />
      <main className="relative z-10 mx-auto max-w-2xl px-5 py-12">
        <p className="text-center text-xs uppercase tracking-[.4em] text-champagne/80">Thais Laysa · 17 anos</p>
        <h1 className="mt-3 text-center font-display text-4xl gold-text">Gerador de convites</h1>
        <p className="mt-3 text-center text-silk/75">Escreve os nomes completos, gera os links e acompanha quem confirmou.</p>

        <section className="mt-8 grid grid-cols-2 gap-3 text-center">
          <div className="glass rounded-2xl p-4"><p className="text-xs uppercase tracking-widest text-silk/60">Festa em</p><p className="mt-1 font-display text-2xl text-champagne">{now < FESTA ? span(FESTA - now) : "É hoje"}</p></div>
          <div className="glass rounded-2xl p-4"><p className="text-xs uppercase tracking-widest text-silk/60">Prazo de resposta</p><p className="mt-1 font-display text-2xl text-champagne">{now < PRAZO ? span(PRAZO - now) : "Terminou"}</p></div>
        </section>

        <section className="mt-3 glass rounded-2xl p-4 text-center">
          <p className="text-xs uppercase tracking-widest text-silk/60">Álbum de memórias</p>
          <p className="mt-1 text-silk/85">{albumState}</p>
          <a className="btn btn-gold mt-3" href={ALBUM_URL} target="_blank" rel="noopener noreferrer">Abrir a pasta do álbum</a>
          <p className="mt-2 text-xs text-silk/50">Aberto para testes. Para fechar até à festa, falar comigo.</p>
        </section>

        <section className="mt-3 glass rounded-2xl p-4 text-center">
          <p className="text-xs uppercase tracking-widest text-silk/60">Material para imprimir</p>
          <p className="mt-1 text-sm text-silk/75">Convites A6, cartões de nome, cartão de mesa e QR codes.</p>
          <a className="btn btn-gold mt-3" href="/imprimir">Abrir impressão e QR codes</a>
        </section>

        <h2 className="mt-10 font-display text-2xl text-rose">Novos convidados</h2>
        <textarea
          value={text} onChange={(e) => setText(e.target.value)} rows={5}
          placeholder={"Maria João da Silva\nCarlos Alberto Mondlane"}
          className="mt-3 w-full rounded-2xl glass p-4 text-silk placeholder:text-silk/30 outline-none focus:border-champagne"
        />
        <div className="mt-3"><button className="btn btn-gold" onClick={add}>Gerar links</button></div>

        <h2 className="mt-10 font-display text-2xl text-rose">Lista de convidados</h2>
        <div className="mt-3 grid grid-cols-4 gap-2 text-center text-sm">
          {([["Total", count.total], ["Enviados", count.enviado], ["Confirmaram", count.confirmou], ["Não vão", count["nao-vai"]]] as const).map(([l, n]) => (
            <div key={l} className="glass rounded-xl p-2"><p className="font-display text-2xl text-champagne">{n}</p><p className="text-[11px] text-silk/60">{l}</p></div>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {([["todos", "Todos"], ["pendentes", "Sem resposta"], ["confirmou", "Confirmaram"], ["nao-vai", "Não vão"]] as const).map(([k, l]) => (
            <button key={k} onClick={() => setFilter(k)} className={`btn !min-h-9 !px-4 text-sm ${filter === k ? "btn-gold" : "btn-line"}`}>{l}</button>
          ))}
        </div>

        <ul className="mt-5 space-y-3">
          {shown.map((g) => {
            const u = url(g);
            const pending = g.status === "novo" || g.status === "enviado";
            return (
              <li key={g.slug} className="glass rounded-2xl p-4">
                <div className="flex items-start justify-between gap-3">
                  <p className="font-display italic text-xl text-rose">{g.name}</p>
                  <button aria-label="Apagar" className="text-silk/40 hover:text-silk" onClick={() => { if (confirm(`Apagar ${g.name}?`)) setGuests((a) => a.filter((x) => x.slug !== g.slug)); }}>✕</button>
                </div>
                <p className="mt-1 break-all text-xs text-silk/50">{decodeURI(u)}</p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <select value={g.status} onChange={(e) => update(g.slug, { status: e.target.value as Status })}
                    className="rounded-full border border-champagne/40 bg-transparent px-3 py-2 text-sm text-silk">
                    {(Object.keys(LABEL) as Status[]).map((k) => <option key={k} value={k} className="bg-[#22040e]">{LABEL[k]}</option>)}
                  </select>
                  <input value={g.phone} onChange={(e) => update(g.slug, { phone: e.target.value })} inputMode="tel" placeholder="Telefone (opcional)"
                    className="min-w-0 flex-1 rounded-full border border-silk/20 bg-transparent px-4 py-2 text-sm text-silk placeholder:text-silk/30 outline-none focus:border-champagne" />
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button className="btn btn-line !min-h-10 !px-4 text-sm" onClick={() => copy(g.slug + "l", u)}>{done === g.slug + "l" ? "Link copiado" : "Copiar link"}</button>
                  <button className="btn btn-line !min-h-10 !px-4 text-sm" onClick={() => copy(g.slug + "m", inviteMsg(g.name, u))}>{done === g.slug + "m" ? "Mensagem copiada" : "Copiar mensagem"}</button>
                  <a className="btn btn-gold !min-h-10 !px-4 text-sm" href={waLink(g.phone, inviteMsg(g.name, u))} target="_blank" rel="noopener noreferrer"
                    onClick={() => { if (g.status === "novo") update(g.slug, { status: "enviado", sentAt: Date.now() }); }}>Enviar no WhatsApp</a>
                  {pending && g.status === "enviado" && (
                    <a className="btn btn-line !min-h-10 !px-4 text-sm" href={waLink(g.phone, reminderMsg(g.name, u))} target="_blank" rel="noopener noreferrer">Lembrete</a>
                  )}
                </div>
              </li>
            );
          })}
          {ready && shown.length === 0 && <li className="glass rounded-2xl p-6 text-center text-silk/60">Ainda não há ninguém nesta lista.</li>}
        </ul>

        {guests.length > 0 && (
          <section className="mt-10 glass rounded-2xl p-4">
            <p className="font-display text-xl text-rose">Cópia de segurança</p>
            <p className="mt-1 text-sm text-silk/65">A lista fica guardada só neste telemóvel. Se limparem os dados do navegador, perde-se. Copia de vez em quando e guarda no WhatsApp contigo.</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button className="btn btn-line !min-h-10 !px-4 text-sm" onClick={() => copy("bk", exportJson)}>{done === "bk" ? "Copiado" : "Copiar cópia"}</button>
              <button className="btn btn-line !min-h-10 !px-4 text-sm" onClick={() => copy("tx", exportText)}>{done === "tx" ? "Copiado" : "Copiar como texto"}</button>
            </div>
          </section>
        )}
        <section className="mt-3 glass rounded-2xl p-4">
          <p className="text-sm text-silk/65">Restaurar uma cópia: cola aqui o texto copiado.</p>
          <textarea value={backup} onChange={(e) => setBackup(e.target.value)} rows={2} className="mt-2 w-full rounded-xl bg-transparent border border-silk/20 p-3 text-sm text-silk outline-none focus:border-champagne" />
          <button className="btn btn-line !min-h-10 !px-4 text-sm mt-2" onClick={importJson}>{done === "imp" ? "Restaurado" : done === "imp-err" ? "Texto inválido" : "Restaurar"}</button>
        </section>
      </main>
    </>
  );
}
