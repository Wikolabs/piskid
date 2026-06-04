"use client";

import { useState, useEffect, useRef } from "react";

// ─── Malagasy palette (flag-derived, refined for web) ──────────────────────────
const C = {
  white: "#FFFFFF",
  parchment: "#FAF8F1",
  paper: "#F5F1E6",
  red: "#DC2626",
  redDeep: "#991B1B",
  redSoft: "#FEE2E2",
  redGlow: "rgba(220,38,38,0.22)",
  green: "#16A34A",
  greenDeep: "#14532D",
  greenSoft: "#DCFCE7",
  greenGlow: "rgba(22,163,74,0.22)",
  gold: "#D97706",
  goldSoft: "#FEF3C7",
  goldGlow: "rgba(217,119,6,0.22)",
  earth: "#78350F",
  text: "#1A1A1A",
  textMuted: "#525252",
  textSoft: "#737373",
  border: "rgba(20,83,45,0.10)",
};

const SERIF = `"Cormorant Garamond", Georgia, serif`;
const DISPLAY = `"Playfair Display", Georgia, serif`;

// ─── Verified Malagasy ohabolana grouped by theme ─────────────────────────────
type Theme = "fihavanana" | "fahendrena" | "fanaovan-tsoa";

const THEMES: Record<Theme, { label: string; fr: string; color: string; bg: string }> = {
  "fihavanana":     { label: "Fihavanana sy Firaisankina", fr: "Parenté & solidarité",   color: C.greenDeep, bg: C.greenSoft },
  "fahendrena":     { label: "Fahendrena sy Fikarohana",   fr: "Sagesse & réflexion",    color: C.gold,      bg: C.goldSoft },
  "fanaovan-tsoa":  { label: "Fanaovan-tsoa sy Fitondrantena", fr: "Bienfaisance & conduite", color: C.red,   bg: C.redSoft },
};

const OHABOLANA: Array<{ theme: Theme; mg: string; fr: string; meaning: string }> = [
  // ── Fihavanana sy Firaisankina ────────────────────────────────────────────
  {
    theme: "fihavanana",
    mg: "Ny fitiavana toy ny lamban'akoho, ka faty no hisarahana.",
    fr: "L'amour est comme le plumage de la poule : seule la mort en sépare.",
    meaning: "Hevitra : manasongadina ny fitiavana sy ny fihavanana mafy orina tsy misy mahasara-tsika afa-tsy ny fahafatesana.",
  },
  {
    theme: "fihavanana",
    mg: "Ny havana toy ny volon-kirihitra : raha tsy very dia mifampitady.",
    fr: "Les parents sont comme les poils ras : s'ils ne se perdent pas, ils se cherchent toujours.",
    meaning: "Hevitra : ny havana na dia maro sy misampantsampana aza dia mbola mifanampy ihany rehefa misy ny olana.",
  },
  {
    theme: "fihavanana",
    mg: "Asa vadi-drano, tsy vita raha tsy ifanakonana.",
    fr: "Travail à deux comme un canal d'eau : impossible sans coopération.",
    meaning: "Hevitra : misy asa tsy vita raha tsy iraisan'ny rehetra sy ifanampiana.",
  },
  // ── Fahendrena sy Fikarohana Hevitra ──────────────────────────────────────
  {
    theme: "fahendrena",
    mg: "Ny hevitry ny maro mahataka-davitra.",
    fr: "La pensée du grand nombre porte loin.",
    meaning: "Hevitra : ny fiaraha-midinika sy ny fihainoana ny maro dia mitondra vokatra lavitra kokoa noho ny fijerin'ny olona iray.",
  },
  {
    theme: "fahendrena",
    mg: "Raha tsy misy ny mandamina, ny adala no mpanapaka.",
    fr: "Sans organisateur, c'est l'insensé qui décide.",
    meaning: "Hevitra : rehefa tsy misy ny hendry mitondra ny fanapahan-kevitra dia ny tsy ampy saina no manjaka.",
  },
  // ── Fanaovan-tsoa sy Fitondrantena ────────────────────────────────────────
  {
    theme: "fanaovan-tsoa",
    mg: "Ny tanana tsy miankin-doha, fa ny atao no miverina.",
    fr: "La main ne se pose pas sur la tête, c'est ce qu'on fait qui revient.",
    meaning: "Hevitra : ny soa atao dia miverina amin'ny tena ihany — ny ratsy koa toy izany.",
  },
  {
    theme: "fanaovan-tsoa",
    mg: "Aza ny am-bava no mamelona, fa ny asa no mampahory.",
    fr: "Ce ne sont pas les paroles qui nourrissent, mais le travail qui fait peiner.",
    meaning: "Hevitra : mamporisika ny olona mba hiasa mafy fa tsy ho tsara resaka fotsiny no ahazoana ny tsara.",
  },
  {
    theme: "fanaovan-tsoa",
    mg: "Hitsikitsika tsy mandihy foana fa ao raha.",
    fr: "Le faucon ne danse pas sans raison : il y a quelque chose.",
    meaning: "Hevitra : misy antony sy antony foana ny fihetsika hafahafa na miafina ataon'ny olona iray — mariho.",
  },
];

const CHAPTERS = [
  {
    key: "ohabolana",
    title: "Ohabolana",
    fr: "Proverbes",
    desc: "Arivo taona feno fahendrena tafiditra anaty teny vitsivitsy — ampita avy amin'ny taranaka iray ho amin'ny iray.",
    color: C.green,
    bg: C.greenSoft,
    glow: C.greenGlow,
    icon: "tree" as const,
  },
  {
    key: "kabary",
    title: "Kabary",
    fr: "Art oratoire",
    desc: "Ny fitenenana ampahibemaso malagasy. Fomba fahandriam-pirenena izay mampifandray ny olona amin'ny fomba hendry.",
    color: C.red,
    bg: C.redSoft,
    glow: C.redGlow,
    icon: "voice" as const,
  },
  {
    key: "fomba",
    title: "Fomba",
    fr: "Coutumes",
    desc: "Famadihana, fihavanana, hasina — ireo fanaon-drazana mamatotra ny maha-malagasy mandritra ny taonjato.",
    color: C.gold,
    bg: C.goldSoft,
    glow: C.goldGlow,
    icon: "compass" as const,
  },
  {
    key: "lalana",
    title: "Lalana",
    fr: "Sentier de vie",
    desc: "Monoro ny lalana tokony ho aleha mba hahay hamindra raha tojo ny sarotra sy ny olana. Toro-hevitra mazava avy amin'ny fahendrena nentin-drazana.",
    color: C.redDeep,
    bg: C.redSoft,
    glow: C.redGlow,
    icon: "compass" as const,
  },
];

// ─── Sources of wisdom (the trainers of iMahay) ────────────────────────────────
const SOURCES = [
  { mg: "Zokiolona", fr: "Anciens" },
  { mg: "Ray aman-dreny", fr: "Parents respectés" },
  { mg: "Olo-be", fr: "Notables" },
  { mg: "Manam-pahaizana malagasy", fr: "Érudits malgaches" },
  { mg: "Mpiandry kolontsaina", fr: "Gardiens de la culture" },
  { mg: "Ohabolana sy kabary", fr: "Proverbes & oratoire" },
];

// ─── Icons ────────────────────────────────────────────────────────────────────
function Icon({ name, color, size = 40 }: { name: "tree" | "voice" | "compass" | "shield"; color: string; size?: number }) {
  const s = size;
  if (name === "tree") return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22V12" /><path d="M7 12c0-3 2-5 5-5s5 2 5 5" /><path d="M4 9c0-3 3-5 5-5" /><path d="M20 9c0-3-3-5-5-5" /><path d="M9 14c-2 0-4 2-4 4 0 0 1 1 3 1" /><path d="M15 14c2 0 4 2 4 4 0 0-1 1-3 1" />
    </svg>
  );
  if (name === "voice") return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 11v2a9 9 0 0 0 18 0v-2" /><rect x="9" y="2" width="6" height="13" rx="3" /><path d="M12 19v3" /><path d="M8 22h8" />
    </svg>
  );
  if (name === "compass") return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><polygon points="16 8 14 14 8 16 10 10 16 8" />
    </svg>
  );
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" />
    </svg>
  );
}

// ─── Aloalo silhouette — traditional Malagasy funerary art post ────────────────
// Zebu head + horns pointing UP, then diamond, figure, medallion, post, base.
function Aloalo({ size = 200, color = C.earth, opacity = 0.08 }: { size?: number; color?: string; opacity?: number }) {
  return (
    <svg width={size} height={size * 2.4} viewBox="0 0 80 192" fill="none" style={{ opacity }}>
      {/* Zebu HORNS — smooth half-circle curves */}
      <path d="M32 26 C 16 26, 8 14, 16 4"  stroke={color} strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <path d="M48 26 C 64 26, 72 14, 64 4"  stroke={color} strokeWidth="2.2" fill="none" strokeLinecap="round" />
      {/* Zebu HEAD circle */}
      <circle cx="40" cy="28" r="9" stroke={color} strokeWidth="1.6" fill="none" />
      <circle cx="40" cy="28" r="1.8" fill={color} />
      {/* Diamond carving — touches head bottom (no gap) */}
      <path d="M40 37 L 52 50 L 40 62 L 28 50 Z" stroke={color} strokeWidth="1.4" fill="none" />
      {/* Inner cross */}
      <path d="M40 43 L 40 56 M34 50 L 46 50" stroke={color} strokeWidth="1.2" />
      {/* Stylized figure (head + body) */}
      <circle cx="40" cy="72" r="5" stroke={color} strokeWidth="1.4" fill="none" />
      <path d="M40 77 L 40 95 M 32 84 L 48 84 M 36 95 L 32 110 M 44 95 L 48 110"
            stroke={color} strokeWidth="1.6" strokeLinecap="round" fill="none" />
      {/* Lower circle ornament */}
      <circle cx="40" cy="120" r="8" stroke={color} strokeWidth="1.4" fill="none" />
      <path d="M32 120 L 48 120 M 40 112 L 40 128" stroke={color} strokeWidth="1.2" />
      {/* Vertical post */}
      <rect x="36" y="130" width="8" height="58" rx="1.5" stroke={color} strokeWidth="1.4" fill="none" />
      {/* Triangular notches on post */}
      <path d="M36 145 L 32 148 L 36 151 Z M44 145 L 48 148 L 44 151 Z M36 162 L 32 165 L 36 168 Z M44 162 L 48 165 L 44 168 Z"
            fill={color} opacity="0.7" />
      {/* Base mound */}
      <ellipse cx="40" cy="190" rx="14" ry="2.5" fill={color} opacity="0.6" />
    </svg>
  );
}

// ─── iMahay wordmark with red/green accent ─────────────────────────────────────
function Wordmark({ size = 22 }: { size?: number }) {
  return (
    <div style={{ display: "inline-flex", alignItems: "baseline", gap: 0, fontFamily: DISPLAY, fontSize: size, fontWeight: 700, letterSpacing: -0.4, lineHeight: 1 }}>
      <span style={{ color: C.greenDeep }}>i</span>
      <span style={{ color: C.text }}>Mahay</span>
      <span style={{ color: C.red, marginLeft: 2 }}>.</span>
    </div>
  );
}

// ─── Central chatbot widget — the hero centerpiece ─────────────────────────────
interface ChatMsg { role: "user" | "assistant"; content: string; }

function CentralChat() {
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, loading]);

  async function send(forcedText?: string) {
    const text = (forcedText !== undefined ? forcedText : input).trim();
    if (!text || loading) return;
    setMessages((m) => [...m, { role: "user", content: text }]);
    setInput("");
    setLoading(true);
    try {
      const r = await fetch("/api/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: text, lang: "fr" }),
      });
      const j = await r.json();
      const reply = j.reply || "Tsy mbola voarakitra ny valiny. Andramo indray.";
      setMessages((m) => [...m, { role: "assistant", content: reply }]);
    } catch {
      setMessages((m) => [...m, { role: "assistant", content: "Misy olana amin'ny fifandraisana. Andramo indray afaka kelikely." }]);
    } finally {
      setLoading(false);
    }
  }

  const suggestions = [
    "Inona no atao raha misy fifanolanana amin'ny mpiara-monina ?",
    "Manao ahoana ny fomba fitafiana amin'ny famadihana ?",
    "Ohabolana inona no ilaina amin'ny faharetana ?",
  ];

  return (
    <div
      style={{
        position: "relative",
        borderRadius: 28,
        padding: 2,
        background: `linear-gradient(135deg, ${C.green} 0%, ${C.gold} 50%, ${C.red} 100%)`,
        boxShadow: `0 30px 80px ${C.redGlow}, 0 20px 60px ${C.greenGlow}`,
        maxWidth: 760,
        margin: "0 auto",
        animation: "auraRotate 12s linear infinite",
      }}
    >
      <div style={{ background: C.white, borderRadius: 26, overflow: "hidden" }}>
        <div
          style={{
            padding: "16px 22px",
            background: `linear-gradient(90deg, ${C.greenSoft} 0%, ${C.parchment} 50%, ${C.redSoft} 100%)`,
            borderBottom: `1px solid ${C.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: C.green, boxShadow: `0 0 12px ${C.green}`, animation: "pulseDot 2s ease-in-out infinite" }} />
            <span style={{ fontFamily: DISPLAY, fontSize: 14, fontWeight: 700, color: C.text }}>
              iMahay — <span style={{ color: C.greenDeep, fontStyle: "italic" }}>Ilay Mpampianatra</span>
            </span>
          </div>
          <span style={{ fontFamily: SERIF, fontSize: 11, fontStyle: "italic", color: C.textMuted }}>
            Maimaim-poana · 24/7
          </span>
        </div>

        <div
          ref={scrollRef}
          style={{
            height: messages.length === 0 ? 260 : 360,
            overflowY: "auto",
            padding: "22px",
            transition: "height 0.3s ease",
            background: `radial-gradient(ellipse at top, ${C.parchment} 0%, ${C.white} 70%)`,
          }}
        >
          {messages.length === 0 ? (
            <div style={{ textAlign: "center", paddingTop: 18 }}>
              <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 20, color: C.text, marginBottom: 10, lineHeight: 1.45 }}>
                « Mahaiza mametra-panontaniana. »
              </div>
              <div style={{ fontFamily: SERIF, fontSize: 14, color: C.textMuted, fontStyle: "italic", marginBottom: 6 }}>
                Apetraho ny fanontanianao — momba ny fiainana, ny fihavanana, ny ahiahy.
              </div>
              <div style={{ fontSize: 12, color: C.textSoft, marginBottom: 22 }}>
                Hisy valiny avy amin&apos;ny mpampianatra.
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 8 }}>
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    style={{
                      background: C.parchment,
                      border: `1px solid ${C.border}`,
                      color: C.textMuted,
                      padding: "8px 14px",
                      borderRadius: 100,
                      fontSize: 12,
                      cursor: "pointer",
                      fontFamily: "inherit",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = C.goldSoft; e.currentTarget.style.color = C.gold; e.currentTarget.style.borderColor = C.goldGlow; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = C.parchment; e.currentTarget.style.color = C.textMuted; e.currentTarget.style.borderColor = C.border; }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((m, i) => (
              <div
                key={i}
                style={{
                  marginBottom: 16,
                  display: "flex",
                  justifyContent: m.role === "user" ? "flex-end" : "flex-start",
                }}
              >
                <div
                  style={{
                    maxWidth: "84%",
                    padding: "13px 18px",
                    borderRadius: m.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                    background: m.role === "user" ? `linear-gradient(135deg, ${C.green} 0%, ${C.greenDeep} 100%)` : C.parchment,
                    border: m.role === "assistant" ? `1px solid ${C.border}` : "none",
                    color: m.role === "user" ? "#fff" : C.text,
                    fontSize: 14,
                    lineHeight: 1.7,
                    whiteSpace: "pre-wrap",
                    fontFamily: m.role === "assistant" ? SERIF : "inherit",
                    boxShadow: m.role === "user" ? `0 6px 22px ${C.greenGlow}` : "0 4px 14px rgba(0,0,0,0.04)",
                  }}
                >
                  {m.content}
                </div>
              </div>
            ))
          )}
          {loading && (
            <div style={{ display: "flex", gap: 5, padding: "10px 4px", alignItems: "center" }}>
              <span style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 12, color: C.textMuted, marginRight: 8 }}>iMahay mieritreritra</span>
              {[0, 1, 2].map((i) => (
                <span key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: i === 0 ? C.green : i === 1 ? C.gold : C.red, animation: `pulseDot 1.2s ease-in-out ${i * 0.16}s infinite` }} />
              ))}
            </div>
          )}
        </div>

        <form
          onSubmit={(e) => { e.preventDefault(); send(); }}
          style={{ padding: "16px 18px", borderTop: `1px solid ${C.border}`, background: C.white, display: "flex", gap: 10, alignItems: "center" }}
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Anontanio amin'ny teny malagasy…"
            style={{
              flex: 1, border: "none", outline: "none", padding: "12px 14px", fontSize: 15,
              fontFamily: SERIF, fontStyle: "italic", color: C.text, background: C.parchment, borderRadius: 14,
            }}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            aria-label="Alefa"
            style={{
              width: 46, height: 46, borderRadius: 14, border: "none",
              background: input.trim() ? `linear-gradient(135deg, ${C.green} 0%, ${C.gold} 100%)` : C.paper,
              color: input.trim() ? "#fff" : C.textSoft,
              cursor: input.trim() ? "pointer" : "not-allowed",
              transition: "transform 0.18s",
              flexShrink: 0,
              boxShadow: input.trim() ? `0 8px 24px ${C.greenGlow}` : "none",
              fontSize: 18, fontWeight: 700,
            }}
            onMouseEnter={(e) => { if (input.trim()) e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}
          >
            ↑
          </button>
        </form>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════

export default function Home() {
  const [currentOhabolana, setCurrentOhabolana] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setCurrentOhabolana((i) => (i + 1) % OHABOLANA.length), 8000);
    return () => clearInterval(id);
  }, []);

  return (
    <main style={{ minHeight: "100vh", background: C.white, position: "relative", overflow: "hidden" }}>
      {/* Ambient floating dust particles */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        {[...Array(22)].map((_, i) => (
          <div key={i}
            style={{
              position: "absolute",
              left: `${(i * 47) % 100}%`,
              top: `${110 + (i % 30)}%`,
              width: 4 + (i % 4), height: 4 + (i % 4),
              borderRadius: "50%",
              background: i % 3 === 0 ? C.red : i % 3 === 1 ? C.green : C.gold,
              opacity: 0.45,
              animation: `riseDust ${28 + (i * 1.6)}s linear ${-(i * 1.9)}s infinite`,
              boxShadow: `0 0 12px ${i % 3 === 0 ? C.redGlow : i % 3 === 1 ? C.greenGlow : C.goldGlow}`,
            }}
          />
        ))}
      </div>

      {/* Aloalo silhouettes — traditional Mahafaly funerary art */}
      <div style={{ position: "absolute", top: 80, left: 20, zIndex: 0, pointerEvents: "none" }}>
        <Aloalo size={120} color={C.green} opacity={0.10} />
      </div>
      <div style={{ position: "absolute", top: 130, right: 30, zIndex: 0, pointerEvents: "none" }}>
        <Aloalo size={140} color={C.red} opacity={0.09} />
      </div>
      <div style={{ position: "absolute", top: "60%", left: 60, zIndex: 0, pointerEvents: "none" }}>
        <Aloalo size={100} color={C.gold} opacity={0.08} />
      </div>
      <div style={{ position: "absolute", top: "80%", right: 60, zIndex: 0, pointerEvents: "none" }}>
        <Aloalo size={110} color={C.earth} opacity={0.08} />
      </div>
      <div style={{ position: "absolute", top: "120%", left: "50%", marginLeft: -55, zIndex: 0, pointerEvents: "none" }}>
        <Aloalo size={110} color={C.green} opacity={0.07} />
      </div>

      {/* ─── NAVBAR ─────────────────────────────────────────────────────────── */}
      <nav style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(255,255,255,0.85)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <a href="/" style={{ textDecoration: "none" }}>
            <Wordmark size={24} />
          </a>
          <div style={{ display: "flex", gap: 22, alignItems: "center" }}>
            <a href="#ohabolana" style={{ fontSize: 14, color: C.textMuted, textDecoration: "none", fontWeight: 500 }}>Ohabolana</a>
            <a href="#mpampianatra" style={{ fontSize: 14, color: C.textMuted, textDecoration: "none", fontWeight: 500 }}>Mpampianatra</a>
            <a href="#piliers" style={{ fontSize: 14, color: C.textMuted, textDecoration: "none", fontWeight: 500 }}>Andry</a>
            <a href="#lalana" style={{ fontSize: 14, color: C.redDeep, textDecoration: "none", fontWeight: 600 }}>Lalana</a>
          </div>
        </div>
      </nav>

      {/* ─── HERO with central chat ──────────────────────────────────────────── */}
      <section style={{ position: "relative", padding: "70px 24px 80px", zIndex: 1 }}>
        <div
          style={{
            position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
            width: "min(900px, 100%)", height: 700,
            background: `radial-gradient(ellipse at 50% 0%, ${C.greenGlow} 0%, transparent 50%), radial-gradient(ellipse at 50% 60%, ${C.goldGlow} 0%, transparent 60%), radial-gradient(ellipse at 50% 100%, ${C.redGlow} 0%, transparent 50%)`,
            pointerEvents: "none", animation: "auraRotate 14s ease-in-out infinite", opacity: 0.85,
          }}
        />

        <div style={{ position: "relative", maxWidth: 980, margin: "0 auto", textAlign: "center" }}>
          <div
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: C.greenSoft, border: `1px solid ${C.greenGlow}`,
              padding: "6px 16px", borderRadius: 100, fontSize: 11, fontWeight: 700,
              letterSpacing: 2.2, textTransform: "uppercase", color: C.greenDeep,
              marginBottom: 24, fontFamily: DISPLAY,
            }}
          >
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: C.green, animation: "pulseDot 1.6s ease-in-out infinite" }} />
            Faharanitan-tsaina malagasy
          </div>

          <h1
            style={{
              fontFamily: DISPLAY, fontSize: "clamp(2.6rem, 6vw, 4.8rem)", fontWeight: 700,
              lineHeight: 1.05, letterSpacing: "-1.5px", margin: "0 0 16px", color: C.text,
            }}
          >
            Ny fahendren&apos;ny{" "}
            <em
              style={{
                fontFamily: SERIF, fontStyle: "italic",
                background: `linear-gradient(90deg, ${C.green} 0%, ${C.gold} 50%, ${C.red} 100%)`,
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                backgroundClip: "text", fontWeight: 600,
              }}
            >
              razana
            </em>
            <br />
            miteny aminao{" "}
            <em style={{ fontFamily: SERIF, fontStyle: "italic", color: C.greenDeep, fontWeight: 600 }}>
              izao
            </em>.
          </h1>

          <p
            style={{
              fontFamily: SERIF, fontStyle: "italic", fontSize: "1.3rem", lineHeight: 1.6,
              color: C.textMuted, maxWidth: 760, margin: "0 auto 16px",
            }}
          >
            iMahay dia mpampianatra IA novolavolain&apos;ny <strong style={{ color: C.greenDeep, fontWeight: 600 }}>zokiolona</strong>,
            ny <strong style={{ color: C.redDeep, fontWeight: 600 }}>ray aman-dreny</strong>, ny{" "}
            <strong style={{ color: C.gold, fontWeight: 600 }}>manam-pahaizana malagasy</strong>
            {" "}sy ny kolontsain&apos;ny tanindrazana. Mihaino, manoro ny lalana tokony ho aleha, manampy hamindra raha tojo ny sarotra.
          </p>
          <p style={{ fontSize: 13, color: C.textSoft, fontStyle: "italic", fontFamily: SERIF, margin: "0 auto 40px", maxWidth: 640 }}>
            <em>La sagesse des ancêtres te parle maintenant. iMahay est formé par les anciens, parents, érudits et la culture malgache. Il écoute, conseille, protège.</em>
          </p>

          <CentralChat />

          <p style={{ fontSize: 13, color: C.textSoft, marginTop: 30, fontStyle: "italic", fontFamily: SERIF }}>
            <span style={{ color: C.green, fontWeight: 700 }}>●</span> Maimaim-poana · Tsy mila fisoratana anarana · Valiny amin&apos;ny teny malagasy
          </p>
        </div>
      </section>

      {/* ─── MPAMPIANATRA — Sources of wisdom ─────────────────────────────────── */}
      <section id="mpampianatra" style={{ padding: "80px 24px", position: "relative", zIndex: 1, background: `linear-gradient(180deg, ${C.white} 0%, ${C.parchment} 100%)` }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontFamily: DISPLAY, fontSize: 11, fontWeight: 700, letterSpacing: 3, color: C.gold, textTransform: "uppercase", marginBottom: 12 }}>
            Iza no nampianatra iMahay ?
          </div>
          <h2 style={{ fontFamily: DISPLAY, fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 600, color: C.text, margin: "0 0 14px", lineHeight: 1.2 }}>
            <em style={{ fontFamily: SERIF, fontStyle: "italic", color: C.greenDeep }}>Tsy avy</em> amin&apos;ny mpanao siansa irery.
          </h2>
          <p style={{ fontFamily: SERIF, fontSize: "1.1rem", color: C.textMuted, maxWidth: 620, margin: "0 auto 40px", fontStyle: "italic" }}>
            Avy amin&apos;ny olona — ireo izay nitahiry sy nampita ny faharanitan-tsaina malagasy nandritra ny taonjato.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14, maxWidth: 900, margin: "0 auto" }}>
            {SOURCES.map((s, i) => (
              <div
                key={s.mg}
                style={{
                  background: C.white,
                  border: `1px solid ${C.border}`,
                  borderRadius: 14,
                  padding: "20px 16px",
                  textAlign: "center",
                  animation: `fadeRise 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.06}s both`,
                  transition: "transform 0.3s, border-color 0.3s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.borderColor = C.greenGlow; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = C.border; }}
              >
                <div style={{ fontFamily: DISPLAY, fontSize: "1.05rem", fontWeight: 600, color: C.greenDeep, marginBottom: 4 }}>
                  {s.mg}
                </div>
                <div style={{ fontFamily: SERIF, fontSize: 12, fontStyle: "italic", color: C.textSoft }}>
                  {s.fr}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── OHABOLANA carousel ──────────────────────────────────────────────── */}
      <section id="ohabolana" style={{ padding: "100px 24px", position: "relative", zIndex: 1, background: `linear-gradient(180deg, ${C.parchment} 0%, ${C.greenSoft} 100%)` }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 50 }}>
            <div style={{ fontFamily: DISPLAY, fontSize: 11, fontWeight: 700, letterSpacing: 3, color: C.greenDeep, textTransform: "uppercase", marginBottom: 12 }}>
              Ohabolana — Voafantina
            </div>
            <h2 style={{ fontFamily: DISPLAY, fontSize: "clamp(2rem, 4.5vw, 3.4rem)", fontWeight: 600, color: C.text, margin: "0 0 14px", lineHeight: 1.15 }}>
              Arivo taona feno{" "}
              <em style={{ fontFamily: SERIF, fontStyle: "italic", color: C.greenDeep }}>fahendrena</em>,<br />
              voakitika anaty teny vitsy.
            </h2>
          </div>

          {(() => {
            const cur = OHABOLANA[currentOhabolana];
            const t = THEMES[cur.theme];
            return (
              <div
                key={currentOhabolana}
                style={{
                  background: C.white, border: `1px solid ${t.color}33`, borderRadius: 28,
                  padding: "50px 48px", textAlign: "center",
                  boxShadow: `0 30px 80px ${t.color}1A`,
                  animation: "fadeRise 0.8s ease-out", position: "relative",
                }}
              >
                <div style={{ position: "absolute", top: -1, left: "20%", right: "20%", height: 3, background: `linear-gradient(90deg, transparent, ${t.color}, transparent)` }} />
                <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: t.bg, border: `1px solid ${t.color}33`, color: t.color, padding: "5px 14px", borderRadius: 100, fontSize: 10.5, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", fontFamily: DISPLAY, marginBottom: 22 }}>
                  <span style={{ width: 5, height: 5, borderRadius: "50%", background: t.color }} />
                  {t.label}
                </div>
                <p style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: "clamp(1.5rem, 3vw, 2.1rem)", lineHeight: 1.4, color: t.color, margin: "0 0 22px", fontWeight: 500 }}>
                  « {cur.mg} »
                </p>
                <p style={{ fontFamily: SERIF, fontSize: "0.95rem", color: C.textSoft, margin: "0 0 18px", fontStyle: "italic" }}>
                  {cur.fr}
                </p>
                <p style={{ fontFamily: SERIF, fontSize: "1.05rem", color: C.text, margin: 0, lineHeight: 1.65, maxWidth: 600, marginLeft: "auto", marginRight: "auto" }}>
                  {cur.meaning}
                </p>
              </div>
            );
          })()}

          <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 28, flexWrap: "wrap" }}>
            {OHABOLANA.map((o, i) => {
              const t = THEMES[o.theme];
              const active = i === currentOhabolana;
              return (
                <button
                  key={i}
                  onClick={() => setCurrentOhabolana(i)}
                  aria-label={`Ohabolana ${i + 1}`}
                  style={{
                    width: active ? 32 : 10, height: 10, borderRadius: 5,
                    border: "none", background: active ? t.color : `${t.color}50`,
                    cursor: "pointer", transition: "width 0.3s, background 0.3s",
                  }}
                />
              );
            })}
          </div>

          {/* Theme legend */}
          <div style={{ display: "flex", justifyContent: "center", gap: 14, marginTop: 22, flexWrap: "wrap" }}>
            {(Object.keys(THEMES) as Theme[]).map((k) => {
              const t = THEMES[k];
              return (
                <span key={k} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontFamily: SERIF, fontStyle: "italic", fontSize: 12, color: C.textMuted }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: t.color }} />
                  {t.fr}
                </span>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── 4 ANDRY CARDS ─────────────────────────────────────────────────── */}
      <section id="piliers" style={{ padding: "100px 24px", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{ fontFamily: DISPLAY, fontSize: 11, fontWeight: 700, letterSpacing: 3, color: C.red, textTransform: "uppercase", marginBottom: 12 }}>
              Andry efatra
            </div>
            <h2 style={{ fontFamily: DISPLAY, fontSize: "clamp(2rem, 4.5vw, 3.2rem)", fontWeight: 600, color: C.text, margin: "0 0 14px", lineHeight: 1.15 }}>
              Inona no <em style={{ fontFamily: SERIF, fontStyle: "italic", color: C.redDeep }}>valitenenin&apos;ny</em> Mpampianatra ?
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 22 }}>
            {CHAPTERS.map((ch, i) => (
              <div
                key={ch.key}
                style={{
                  background: C.white, border: `1px solid ${C.border}`, borderRadius: 22,
                  padding: "36px 28px", position: "relative", overflow: "hidden", cursor: "pointer",
                  transition: "all 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
                  animation: `fadeRise 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.08}s both`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-8px)";
                  e.currentTarget.style.boxShadow = `0 30px 60px ${ch.glow}, 0 0 0 1.5px ${ch.color}40`;
                  e.currentTarget.style.borderColor = ch.color + "40";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.borderColor = C.border;
                }}
              >
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg, ${ch.color}, ${ch.color}80, transparent)` }} />
                <div style={{ width: 64, height: 64, borderRadius: 16, background: ch.bg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 22 }}>
                  <Icon name={ch.icon} color={ch.color} size={32} />
                </div>
                <div style={{ fontFamily: DISPLAY, fontSize: 11, fontWeight: 700, letterSpacing: 2.5, color: C.textSoft, textTransform: "uppercase", marginBottom: 4 }}>
                  {ch.fr}
                </div>
                <h3 style={{ fontFamily: DISPLAY, fontSize: "1.65rem", fontWeight: 600, color: ch.color, margin: "0 0 14px" }}>
                  {ch.title}
                </h3>
                <p style={{ fontFamily: SERIF, fontSize: "0.96rem", lineHeight: 1.65, color: C.textMuted, margin: 0 }}>
                  {ch.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── LALANA — Sentier de vie ───────────────────────────────────────── */}
      <section id="lalana" style={{ padding: "100px 24px", position: "relative", zIndex: 1, background: `linear-gradient(180deg, ${C.white} 0%, ${C.goldSoft} 100%)` }}>
        <div style={{ maxWidth: 920, margin: "0 auto" }}>
          <div
            style={{
              background: C.white, border: `2px solid ${C.gold}30`, borderRadius: 28,
              padding: "56px 48px", boxShadow: `0 30px 80px rgba(217,119,6,0.12)`,
              position: "relative", overflow: "hidden",
            }}
          >
            <div style={{ position: "absolute", top: -60, right: -60, width: 200, height: 200, borderRadius: "50%", background: `radial-gradient(circle, ${C.goldGlow} 0%, transparent 70%)`, pointerEvents: "none" }} />
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <Icon name="compass" color={C.gold} size={36} />
              <div style={{ fontFamily: DISPLAY, fontSize: 11, fontWeight: 700, letterSpacing: 3, color: C.gold, textTransform: "uppercase" }}>
                Lalana — Sentier de vie
              </div>
            </div>
            <h2 style={{ fontFamily: DISPLAY, fontSize: "clamp(1.8rem, 4vw, 2.6rem)", fontWeight: 600, color: C.text, margin: "0 0 18px", lineHeight: 1.2 }}>
              Monoro ny lalana tokony <em style={{ fontFamily: SERIF, fontStyle: "italic", color: C.gold }}>ho aleha</em>.
            </h2>
            <p style={{ fontFamily: SERIF, fontSize: "1.15rem", lineHeight: 1.7, color: C.textMuted, margin: "0 0 16px", fontStyle: "italic" }}>
              Rehefa tojo ny sarotra sy ny olana, dia mila <strong style={{ color: C.greenDeep }}>fanazavana mazava</strong> sy
              {" "}<strong style={{ color: C.gold }}>torohevitra azo itokisana</strong>. iMahay mihaino aloha, manaja ny safidinao,
              ary manoro ny dingana tokony ho atao mba hahafahana mamindra amim-pahatoniana — araka ny fahendrena nentin-drazana.
            </p>
            <p style={{ fontFamily: SERIF, fontSize: "0.95rem", lineHeight: 1.6, color: C.textSoft, margin: "0 0 24px", fontStyle: "italic" }}>
              <em>iMahay accompagne : il indique le chemin à suivre pour savoir avancer quand on traverse une difficulté.</em>
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
              {[
                { label: "Maimaim-poana", color: C.green },
                { label: "Tsy tonon-anarana", color: C.gold },
                { label: "Mihaino aloha", color: C.greenDeep },
                { label: "Manoro ny lalana", color: C.red },
              ].map((b) => (
                <div key={b.label} style={{ padding: "8px 16px", borderRadius: 100, background: `${b.color}15`, border: `1px solid ${b.color}30`, color: b.color, fontSize: 13, fontWeight: 600, fontFamily: DISPLAY }}>
                  ✓ {b.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ────────────────────────────────────────────────────────── */}
      <section style={{ padding: "100px 24px", position: "relative", zIndex: 1 }}>
        <div
          style={{
            maxWidth: 800, margin: "0 auto", padding: "60px 48px",
            background: `linear-gradient(135deg, ${C.greenDeep} 0%, ${C.red} 100%)`,
            borderRadius: 28, textAlign: "center", position: "relative", overflow: "hidden",
            boxShadow: `0 40px 100px rgba(20,83,45,0.30)`,
          }}
        >
          <div style={{ position: "absolute", top: "-50%", left: "50%", width: "60%", height: "200%", background: `radial-gradient(ellipse at 50% 0%, ${C.goldGlow} 0%, transparent 65%)`, transform: "translateX(-50%)", pointerEvents: "none" }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <h2 style={{ fontFamily: DISPLAY, fontSize: "clamp(1.8rem, 4vw, 2.6rem)", fontWeight: 600, color: "#fff", margin: "0 0 18px", lineHeight: 1.2 }}>
              Mahaiza.{" "}
              <em style={{ fontFamily: SERIF, fontStyle: "italic", color: C.goldSoft, fontWeight: 600 }}>
                Manontania. Misafidiana.
              </em>
            </h2>
            <p style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: "1.15rem", color: "rgba(255,255,255,0.9)", maxWidth: 540, margin: "0 auto 32px", lineHeight: 1.6 }}>
              Miandry anao ny Mpampianatra. Tsy misy fanontaniana kely loatra, tsy misy mendrika fanaovan-tsinontsinona.
            </p>
            <a
              href="#top"
              onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              style={{
                background: "#fff", color: C.greenDeep, border: "none",
                padding: "16px 36px", borderRadius: 100, fontSize: 15, fontWeight: 700,
                cursor: "pointer", fontFamily: "inherit", display: "inline-flex",
                alignItems: "center", gap: 10, textDecoration: "none", letterSpacing: 0.3,
                boxShadow: "0 12px 40px rgba(0,0,0,0.2)",
              }}
            >
              Manontania ny Mpampianatra ↑
            </a>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─────────────────────────────────────────────────────────── */}
      <footer style={{ padding: "50px 24px 30px", borderTop: `1px solid ${C.border}`, background: C.parchment }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", textAlign: "center" }}>
          <Wordmark size={20} />
          <p style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: "0.95rem", color: C.textMuted, maxWidth: 540, margin: "16px auto 18px" }}>
            « Ny fahalalana toy ny voantongon-tsofina, mitombo amin&apos;ny fihainoana. »
            <br />
            <span style={{ color: C.greenDeep, fontFamily: DISPLAY, fontSize: 11, fontStyle: "normal", letterSpacing: 2, fontWeight: 700 }}>
              Ohabolana malagasy
            </span>
          </p>
          <p style={{ fontSize: 12, color: C.textSoft, margin: 0 }}>
            © {new Date().getFullYear()} iMahay — Faharanitan-tsaina malagasy. Maimaim-poana · 24/7.
          </p>
        </div>
      </footer>

      <style>{`
        @keyframes riseDust {
          0%   { transform: translateY(0)     scale(0.6); opacity: 0; }
          15%  { opacity: 0.6; }
          85%  { opacity: 0.45; }
          100% { transform: translateY(-130vh) scale(1.1); opacity: 0; }
        }
        @keyframes pulseDot { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.4; transform: scale(1.6); } }
        @keyframes auraRotate { 0%, 100% { filter: hue-rotate(0deg); } 50% { filter: hue-rotate(20deg); } }
        @keyframes fadeRise { 0% { opacity: 0; transform: translateY(24px); } 100% { opacity: 1; transform: translateY(0); } }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { animation: none !important; transition: none !important; }
        }
      `}</style>
    </main>
  );
}
