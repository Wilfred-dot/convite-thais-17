"use client";
import { useEffect, useMemo, useState } from "react";
import QRCode from "qrcode";
import { slugify, nameFromSlug } from "../../lib/guest";

type Guest = { slug: string; name: string; status: string };
type Mode = "convites" | "nomes" | "mesa" | "qr";

const KEY = "thais17_convidados_v1";
const ALBUM_URL = "https://drive.google.com/drive/folders/1HjlU6OYaQQZy-BXWTae3RJpxM3Bwb3sM?usp=sharing";
const INSTA = "https://www.instagram.com/thais_layysa";
const TAG = "https://www.instagram.com/explore/tags/thaiswah17/";
const DEMO = ["Maria João da Silva", "Carlos Alberto Mondlane"];

const SIZE: Record<Mode, string> = { convites: "105mm 148mm", nomes: "105mm 74mm", mesa: "105mm 148mm", qr: "A4" };

export default function Imprimir() {
  const [mode, setMode] = useState<Mode>("convites");
  const [guests, setGuests] = useState<Guest[]>([]);
  const [which, setWhich] = useState<"todos" | "confirmou">("todos");
  const [copies, setCopies] = useState(6);
  const [qr, setQr] = useState<Record<string, string>>({});
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(location.origin);
    try { const raw = localStorage.getItem(KEY); if (raw) setGuests(JSON.parse(raw)); } catch {}
  }, []);

  const demo = guests.length === 0;
  const list: Guest[] = useMemo(() => {
    const base = demo ? DEMO.map((n) => ({ slug: slugify(n), name: nameFromSlug(slugify(n)), status: "novo" })) : guests;
    return which === "confirmou" && !demo ? base.filter((g) => g.status === "confirmou") : base;
  }, [guests, which, demo]);

  const urls = useMemo(() => {
    const m: Record<string, string> = { insta: INSTA, tag: TAG, album: ALBUM_URL, site: origin || "https://convite-thais-17.vercel.app" };
    list.forEach((g) => { m["g:" + g.slug] = `${origin}/c/${g.slug}`; });
    return m;
  }, [list, origin]);

  useEffect(() => {
    let off = false;
    (async () => {
      const out: Record<string, string> = {};
      for (const [k, u] of Object.entries(urls)) {
        out[k] = await QRCode.toString(u, { type: "svg", margin: 0, errorCorrectionLevel: "M", color: { dark: "#3a0919", light: "#ffffff00" } });
      }
      if (!off) setQr(out);
    })();
    return () => { off = true; };
  }, [urls]);

  const Q = ({ k, mm }: { k: string; mm: number }) => (
    <div className="qrbox" style={{ width: `${mm}mm`, height: `${mm}mm` }} dangerouslySetInnerHTML={{ __html: qr[k] || "" }} />
  );

  const dl = async (k: string, file: string) => {
    const png = await QRCode.toDataURL(urls[k], { width: 1200, margin: 3, errorCorrectionLevel: "M", color: { dark: "#3a0919", light: "#ffffff" } });
    const a = document.createElement("a"); a.href = png; a.download = file; a.click();
  };

  const nameSize = (n: string) => (n.length <= 18 ? "8.5mm" : n.length <= 26 ? "7mm" : "5.6mm");

  return (
    <div className="imp">
      <style>{`
        @page{size:${SIZE[mode]};margin:0}
        .imp{background:#14020a;min-height:100vh;color:#f3e6dc;font-family:Jost,system-ui,sans-serif}
        .imp .bar{position:sticky;top:0;z-index:5;background:#22040e;border-bottom:1px solid rgba(216,185,138,.3);padding:12px 16px;display:flex;flex-wrap:wrap;gap:8px;align-items:center}
        .imp .bar button,.imp .bar select,.imp .bar input{background:transparent;border:1px solid rgba(216,185,138,.5);color:#f3e6dc;border-radius:999px;padding:8px 14px;font:inherit;font-size:14px}
        .imp .bar button.on{background:#d8b98a;color:#22040e}
        .imp .bar option{background:#22040e}
        .imp .note{padding:10px 16px;font-size:13px;opacity:.75}
        .imp .sheet{display:flex;flex-direction:column;align-items:center;gap:18px;padding:18px 0 60px}
        .pg{position:relative;overflow:hidden;color:#f3e6dc;font-family:"Bodoni Moda",Georgia,serif;text-align:center;
          background:radial-gradient(120% 70% at 15% 0%,#7a1634 0%,transparent 60%),radial-gradient(100% 70% at 100% 100%,#5c1228 0%,transparent 60%),#2a0814;
          -webkit-print-color-adjust:exact;print-color-adjust:exact}
        .pg.a6{width:105mm;height:148mm}.pg.a7{width:105mm;height:74mm}
        .pg .in{position:absolute;inset:4mm;border:.35mm solid rgba(216,185,138,.75);border-radius:2mm}
        .gold{color:#e6c995}
        .sans{font-family:Jost,system-ui,sans-serif;font-weight:300}
        .cap{font-family:Jost,system-ui,sans-serif;font-weight:400;letter-spacing:.32em;text-transform:uppercase;color:#d8b98a}
        .arch{position:absolute;left:50%;transform:translateX(-50%);top:13mm;width:64mm;height:80mm;border-radius:32mm 32mm 2mm 2mm;border:.5mm solid #d8b98a;background:url(/fotos/foto-2.jpg) 50% 18%/cover}
        .qrbox svg{width:100%;height:100%;display:block}
        .qrw{background:#fffaf3;padding:2mm;border-radius:2mm;display:inline-block;line-height:0}
        .stage{display:flex;flex-direction:column;align-items:center;gap:18px}
        @media print{
          html,body{background:#fff!important}
          .imp{background:#fff;min-height:0}
          .noprint{display:none!important}
          .imp .sheet{display:block;padding:0;gap:0}
          .pg{page-break-after:always;break-after:page;margin:0}
          .sheet > :last-child,.sheet > :last-child .pg:last-child{break-after:auto;page-break-after:auto}
        }
      `}</style>

      <div className="bar noprint">
        {([["convites", "Convites"], ["nomes", "Cartões de nome"], ["mesa", "Cartão de mesa"], ["qr", "QR codes"]] as const).map(([k, l]) => (
          <button key={k} className={mode === k ? "on" : ""} onClick={() => setMode(k)}>{l}</button>
        ))}
        {(mode === "convites" || mode === "nomes") && (
          <select value={which} onChange={(e) => setWhich(e.target.value as "todos" | "confirmou")}>
            <option value="todos">Todos os convidados</option>
            <option value="confirmou">Só os que confirmaram</option>
          </select>
        )}
        {mode === "mesa" && (
          <label style={{ fontSize: 14 }}>Cópias <input type="number" min={1} max={40} value={copies} onChange={(e) => setCopies(Math.max(1, Math.min(40, +e.target.value || 1)))} style={{ width: 64 }} /></label>
        )}
        {mode !== "qr" && <button className="on" onClick={() => window.print()}>Imprimir / Guardar PDF</button>}
      </div>
      <p className="note noprint">
        {demo && mode !== "mesa" && mode !== "qr" ? "Ainda não há lista de convidados neste aparelho. Estes são nomes de exemplo. Gera os links primeiro no gerador, no mesmo telemóvel ou computador. " : ""}
        {mode === "convites" && "Cada convidado leva 2 páginas A6: frente e verso. Na impressão escolhe tamanho A6 (ou papel A4 com “Ajustar à página”) e activa “Gráficos de fundo”."}
        {mode === "nomes" && "Um cartão de 105 × 74 mm por convidado (A7). Activa “Gráficos de fundo” na impressão."}
        {mode === "mesa" && "Um cartão A6 com os três QR codes. Escolhe quantas cópias queres."}
        {mode === "qr" && "Toca em cada QR para descarregar a imagem, ou usa “Imprimir” do navegador para esta página."}
      </p>

      <div className="sheet">
        {mode === "convites" && list.map((g) => (
          <div key={g.slug} className="stage">
            <div className="pg a6">
              <div className="in" />
              <div className="arch" />
              <div style={{ position: "absolute", left: 0, right: 0, top: "97mm" }}>
                <div className="cap" style={{ fontSize: "2.6mm" }}>Festa de Aniversário</div>
                <div className="gold" style={{ fontSize: "12mm", lineHeight: 1.05, marginTop: "2mm" }}>Thais Laysa</div>
                <div className="cap" style={{ fontSize: "3.2mm", marginTop: "2mm", color: "#e9b9bd" }}>17 anos</div>
                <div style={{ fontStyle: "italic", fontSize: "4.4mm", color: "#f0d8a8", marginTop: "5mm" }}>celebra comigo os meus 17 anos</div>
              </div>
            </div>
            <div className="pg a6">
              <div className="in" />
              <div style={{ position: "absolute", left: "9mm", right: "9mm", top: "10mm" }}>
                <div className="cap" style={{ fontSize: "2.4mm" }}>Convite para</div>
                <div style={{ fontStyle: "italic", fontSize: g.name.length > 24 ? "6mm" : "7.6mm", color: "#e9b9bd", lineHeight: 1.15, marginTop: "2mm" }}>{g.name}</div>
                <div style={{ width: "18mm", height: ".3mm", background: "#d8b98a", margin: "3.5mm auto" }} />
                <div className="gold" style={{ fontSize: "7.4mm", fontStyle: "italic", lineHeight: 1 }}>Sábado</div>
                <div className="sans" style={{ fontSize: "4mm", marginTop: "1.5mm" }}>31 de Outubro de 2026</div>
                <div className="gold" style={{ fontSize: "6.4mm", marginTop: "0mm" }}>às 12h00</div>
                <div className="sans" style={{ fontSize: "3.5mm", lineHeight: 1.5, marginTop: "3.5mm" }}>
                  <b style={{ fontWeight: 400, color: "#f0d8a8" }}>Casa da Celia</b><br />Entrada do Machute<br />Bairro do Aeroporto, Beira
                </div>
                <div className="sans" style={{ fontSize: "3.3mm", marginTop: "2.5mm" }}>Dress code: <b style={{ fontWeight: 400, color: "#e9b9bd" }}>rosa</b></div>
                <div className="sans" style={{ fontSize: "3.1mm", marginTop: "2mm", lineHeight: 1.4, opacity: .9 }}>Confirma até 28 de Outubro<br />WhatsApp 86 756 6153</div>
                <div style={{ marginTop: "4mm" }}><span className="qrw"><Q k={"g:" + g.slug} mm={22} /></span></div>
                <div className="sans" style={{ fontSize: "2.7mm", marginTop: "1.5mm", opacity: .8 }}>Aponta a câmara para abrires o teu convite</div>
                <div className="cap" style={{ fontSize: "2.6mm", marginTop: "2mm" }}>#ThaisWah17</div>
              </div>
            </div>
          </div>
        ))}

        {mode === "nomes" && list.map((g) => (
          <div key={g.slug} className="pg a7">
            <div className="in" style={{ inset: "3mm" }} />
            <div className="cap" style={{ position: "absolute", left: 0, right: 0, top: "9mm", fontSize: "2.4mm" }}>Thais 17 anos</div>
            <div style={{ position: "absolute", left: "8mm", right: "8mm", top: "50%", transform: "translateY(-50%)" }}>
              <div className="gold" style={{ fontSize: nameSize(g.name), fontStyle: "italic", lineHeight: 1.15 }}>{g.name}</div>
            </div>
            <div className="cap" style={{ position: "absolute", left: 0, right: 0, bottom: "9mm", fontSize: "2.4mm" }}>#ThaisWah17</div>
          </div>
        ))}

        {mode === "mesa" && Array.from({ length: copies }).map((_, i) => (
          <div key={i} className="pg a6">
            <div className="in" />
            <div style={{ position: "absolute", left: "8mm", right: "8mm", top: "11mm" }}>
              <div className="cap" style={{ fontSize: "2.4mm" }}>Thais Laysa · 17 anos</div>
              <div className="gold" style={{ fontSize: "7.6mm", fontStyle: "italic", lineHeight: 1.1, marginTop: "2mm" }}>Partilha os momentos</div>
              <div className="sans" style={{ fontSize: "3.2mm", marginTop: "2mm", opacity: .9 }}>Aponta a câmara do telemóvel a cada código</div>
              {([["insta", "Segue a Thais", "@thais_layysa"], ["tag", "Publica com a hashtag", "#ThaisWah17"], ["album", "Fotos e vídeos da festa", "Álbum partilhado"]] as const).map(([k, a, b]) => (
                <div key={k} style={{ display: "flex", alignItems: "center", gap: "5mm", marginTop: "6mm", textAlign: "left" }}>
                  <span className="qrw"><Q k={k} mm={25} /></span>
                  <div><div className="cap" style={{ fontSize: "2.3mm", letterSpacing: ".2em" }}>{a}</div><div style={{ fontStyle: "italic", fontSize: "5mm", color: "#f0d8a8", marginTop: "1mm" }}>{b}</div></div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {mode === "qr" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 16, padding: 16, width: "100%", maxWidth: 760 }}>
            {([["site", "Convite", "qr-convite.png"], ["insta", "Instagram @thais_layysa", "qr-instagram.png"], ["tag", "Hashtag #ThaisWah17", "qr-hashtag.png"], ["album", "Álbum de fotos e vídeos", "qr-album.png"]] as const).map(([k, l, f]) => (
              <button key={k} onClick={() => dl(k, f)} style={{ background: "#fffaf3", borderRadius: 16, padding: 14, color: "#3a0919", border: 0, cursor: "pointer" }}>
                <Q k={k} mm={46} />
                <div style={{ marginTop: 8, fontSize: 14 }}>{l}</div>
                <div style={{ fontSize: 12, opacity: .7 }}>Tocar para descarregar</div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
