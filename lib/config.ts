export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://aniversario-thais-17.vercel.app";

export const EVENT = {
  fullName: "Thais Laysa Pereira Fone Wah",
  first: "Thais Laysa",
  rest: "Pereira Fone Wah",
  age: 17,
  startISO: "2026-10-31T12:00:00+02:00",
  endISO: "2026-10-31T18:00:00+02:00",
  rsvpDeadlineISO: "2026-10-28T23:59:59+02:00",
  place: "Casa da prima Celia",
  address: "Entrada no Machute, Bairro do Aeroporto, Beira",
  mapsUrl: "https://maps.app.goo.gl/EKpGaaGp4C91dchL6",
  hashtag: "#ThaisWah17",
  instagram: "https://www.instagram.com/thais_layysa",
  instagramHandle: "@thais_layysa",
  rsvpPhone: "258867566153",
  emola: { number: "867566153", display: "86 756 6153", holder: "Francisco Madoro" },
  contacts: [
    { name: "Prima Celia", tel: "+258860466777", display: "86 046 6777" },
    { name: "Tia Ita", tel: "+258875112320", display: "87 511 2320" },
  ],
  message:
    "Aos 17 anos, celebro o que já vivi e tudo o que ainda vou escrever. Quero ter-te ao meu lado num almoço cheio de elegância e boa energia. A tua presença faz este dia ainda mais especial.",
  program: [
    { time: "12h00", title: "Chegada", text: "Recepção dos convidados" },
    { time: "12h30", title: "Sessão de fotos", text: "Os primeiros retratos do dia" },
    { time: "13h30", title: "Almoço", text: "Todos à mesa" },
    { time: "15h00", title: "Bolo e parabéns", text: "O momento de apagar as velas" },
    { time: "16h00", title: "Música e dança", text: "Até quando a energia durar" },
  ],
  credit: { name: "Wilfred Deloviar", phone: "258868991785" },
};

export const wa = (phone: string, text: string) =>
  `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
