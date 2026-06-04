"use client";

import { useState, useEffect, useRef } from "react";

// ─── Malagasy palette (flag-derived, refined for web) ──────────────────────────
const C = {
  white: "#FFFFFF",
  parchment: "#FAF8F1",
  paper: "#F5F1E6",
  red: "#DC2626",          // flag red — vibrant, laterite earth of Madagascar
  redDeep: "#991B1B",
  redSoft: "#FEE2E2",
  redGlow: "rgba(220,38,38,0.22)",
  green: "#16A34A",        // flag green — rice paddies, vitality
  greenDeep: "#14532D",
  greenSoft: "#DCFCE7",
  greenGlow: "rgba(22,163,74,0.22)",
  gold: "#D97706",         // sun, elder wisdom, baobab
  goldSoft: "#FEF3C7",
  goldGlow: "rgba(217,119,6,0.22)",
  earth: "#78350F",        // laterite earth brown
  text: "#1A1A1A",
  textMuted: "#525252",
  textSoft: "#737373",
  border: "rgba(20,83,45,0.10)",
};

const SERIF = `"Cormorant Garamond", Georgia, serif`;
const DISPLAY = `"Playfair Display", Georgia, serif`;

// ─── Famous Malagasy ohabolana with French translations ───────────────────────
const OHABOLANA = [
  {
    mg: "Ny teny tsy mba mafy fa ny vato no mafy.",
    fr: "Ce n'est pas la parole qui est dure, c'est la pierre.",
    meaning: "Les mots ne blessent pas par leur force, mais par leur vérité.",
  },
  {
    mg: "Tsy misy hazo tsy mihofahofa rehefa misy rivotra.",
    fr: "Aucun arbre ne reste immobile quand le vent souffle.",
    meaning: "Même les plus forts sont éprouvés. La résilience naît de l'épreuve.",
  },
  {
    mg: "Ny tanan-kavia tsy misaraka amin'ny tanan-kavanana.",
    fr: "La main gauche ne se sépare pas de la main droite.",
    meaning: "La famille, la communauté — on avance ensemble ou pas du tout.",
  },
  {
    mg: "Aleo maty rahampitso toy izay maty androany.",
    fr: "Mieux vaut mourir demain qu'aujourd'hui.",
    meaning: "Ne renonce jamais. Demain peut tout changer.",
  },
  {
    mg: "Ny adidy aleha fa ny zo no mialoha.",
    fr: "Les devoirs viennent après, les droits passent en premier.",
    meaning: "Connaître sa dignité avant de connaître ses obligations.",
  },
  {
    mg: "Ny fahalalana toy ny voantongon-tsofina, mitombo amin'ny fihainoana.",
    fr: "La connaissance est comme le lobe de l'oreille : elle grandit en écoutant.",
    meaning: "L'humilité d'écouter est le commencement de la sagesse.",
  },
];

const CHAPTERS = [
  {
    key: "ohabolana",
    title: "Ohabolana",
    fr: "Proverbes",
    desc: "Mille ans de sagesse condensés en quelques mots — chaque génération les transmet aux suivantes.",
    color: C.green,
    bg: C.greenSoft,
    glow: C.greenGlow,
    icon: "tree" as const,
  },
  {
    key: "kabary",
    title: "Kabary",
    fr: "Art oratoire",
    desc: "La parole publique malgache. Une tradition vivante où l'éloquence est un service rendu à la communauté.",
    color: C.red,
    bg: C.redSoft,
    glow: C.redGlow,
    icon: "voice" as const,
  },
  {
    key: "fomba",
    title: "Fomba",
    fr: "Coutumes",
    desc: "Famadihana, fihavanana, hasina — les usages qui tissent l'identité malgache à travers le temps.",
    color: C.gold,
    bg: C.goldSoft,
    glow: C.goldGlow,
    icon: "compass" as const,
  },
  {
    key: "anti-arnaque",
    title: "Anti-arnaque",
    fr: "Mpisikidy fictifs",
    desc: "Trop de gens vulnérables se font escroquer par de faux devins. iMahay protège, conseille, oriente — gratuitement.",
    color: C.redDeep,
    bg: C.redSoft,
    glow: C.redGlow,
    icon: "shield" as const,
  },
];

// ─── Icons ────────────────────────────────────────────────────────────────────
function Icon({ name, color, size = 40 }: { name: "tree" | "voice" | "compass" | "shield"; color: string; size?: number }) {
  const s = size;
  if (name === "tree") return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22V12" />
      <path d="M7 12c0-3 2-5 5-5s5 2 5 5" />
      <path d="M4 9c0-3 3-5 5-5" />
      <path d="M20 9c0-3-3-5-5-5" />
      <path d="M9 14c-2 0-4 2-4 4 0 0 1 1 3 1" />
      <path d="M15 14c2 0 4 2 4 4 0 0-1 1-3 1" />
    </svg>
  );
  if (name === "voice") return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 11v2a9 9 0 0 0 18 0v-2" />
      <rect x="9" y="2" width="6" height="13" rx="3" />
      <path d="M12 19v3" />
      <path d="M8 22h8" />
    </svg>
  );
  if (name === "compass") return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polygon points="16 8 14 14 8 16 10 10 16 8" />
    </svg>
  );
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

// ─── Stylized baobab silhouette ────────────────────────────────────────────────
function Baobab({ size = 80, color = C.earth, opacity = 0.10 }: { size?: number; color?: string; opacity?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ opacity }}>
      <path
        d="M50 90 L50 50 M50 50 C 30 48 24 36 18 26 M50 50 C 70 48 76 36 82 26 M50 50 C 50 30 44 22 36 12 M50 50 C 50 30 56 22 64 12 M50 50 C 40 50 32 56 28 64 M50 50 C 60 50 68 56 72 64 M48 90 L52 90 L52 96 L48 96 Z"
        stroke={color}
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      <ellipse cx="50" cy="50" rx="14" ry="8" fill={color} />
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

  async function send() {
    const text = input.trim();
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
      const reply = j.reply || j.brief || "Mizotra mafy ny lalana. Andramo indray.";
      setMessages((m) => [...m, { role: "assistant", content: reply }]);
    } catch {
      setMessages((m) => [...m, { role: "assistant", content: "Misy mihontsona ny fifandraisana. Andramo indray afaka kely." }]);
    } finally {
      setLoading(false);
    }
  }

  const suggestions = [
    "Inona no atao raha misy fifanolanana amin'ny mpiara-monina ?",
    "Comment se protéger d'un faux mpisikidy ?",
    "Que dit un ohabolana sur la patience ?",
  ];

  return (
    <div
      style={{
        position: "relative",
        borderRadius: 28,
        padding: 2,
        background: `linear-gradient(135deg, ${C.green} 0%, ${C.gold} 50%, ${C.red} 100%)`,
        boxShadow: `0 30px 80px ${C.redGlow}, 0 20px 60px ${C.greenGlow}`,
        maxWidth: 720,
        margin: "0 auto",
        animation: "auraRotate 12s linear infinite",
      }}
    >
      <div
        style={{
          background: C.white,
          borderRadius: 26,
          overflow: "hidden",
        }}
      >
        {/* Top label */}
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
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: C.green,
                boxShadow: `0 0 12px ${C.green}`,
                animation: "pulseDot 2s ease-in-out infinite",
              }}
            />
            <span style={{ fontFamily: DISPLAY, fontSize: 14, fontWeight: 700, color: C.text }}>
              iMahay — <span style={{ color: C.greenDeep, fontStyle: "italic" }}>l&apos;Expert</span>
            </span>
          </div>
          <span style={{ fontFamily: SERIF, fontSize: 11, fontStyle: "italic", color: C.textMuted }}>
            Maimaim-poana · 24/7
          </span>
        </div>

        {/* Messages */}
        <div
          ref={scrollRef}
          style={{
            height: messages.length === 0 ? 220 : 320,
            overflowY: "auto",
            padding: "22px",
            transition: "height 0.3s ease",
            background: `radial-gradient(ellipse at top, ${C.parchment} 0%, ${C.white} 70%)`,
          }}
        >
          {messages.length === 0 ? (
            <div style={{ textAlign: "center", paddingTop: 18 }}>
              <div
                style={{
                  fontFamily: SERIF,
                  fontStyle: "italic",
                  fontSize: 19,
                  color: C.text,
                  marginBottom: 10,
                  lineHeight: 1.45,
                }}
              >
                « Mahaiza mametra-panontaniana. »
              </div>
              <div style={{ fontFamily: SERIF, fontSize: 14, color: C.textMuted, fontStyle: "italic" }}>
                Pose ta question — sur la vie, la sagesse, ou ce qui t&apos;inquiète. L&apos;expert répond.
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 8, marginTop: 22 }}>
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => setInput(s)}
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
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = C.goldSoft;
                      e.currentTarget.style.color = C.gold;
                      e.currentTarget.style.borderColor = C.goldGlow;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = C.parchment;
                      e.currentTarget.style.color = C.textMuted;
                      e.currentTarget.style.borderColor = C.border;
                    }}
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
                    background: m.role === "user"
                      ? `linear-gradient(135deg, ${C.green} 0%, ${C.greenDeep} 100%)`
                      : C.parchment,
                    border: m.role === "assistant" ? `1px solid ${C.border}` : "none",
                    color: m.role === "user" ? "#fff" : C.text,
                    fontSize: 14,
                    lineHeight: 1.65,
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
            <div style={{ display: "flex", gap: 5, padding: "10px 4px" }}>
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: i === 0 ? C.green : i === 1 ? C.gold : C.red,
                    animation: `pulseDot 1.2s ease-in-out ${i * 0.16}s infinite`,
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
          style={{
            padding: "16px 18px",
            borderTop: `1px solid ${C.border}`,
            background: C.white,
            display: "flex",
            gap: 10,
            alignItems: "center",
          }}
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Anontanio amin'ny teny malagasy na frantsay…"
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              padding: "12px 14px",
              fontSize: 15,
              fontFamily: SERIF,
              fontStyle: "italic",
              color: C.text,
              background: C.parchment,
              borderRadius: 14,
            }}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            aria-label="Envoyer"
            style={{
              width: 46,
              height: 46,
              borderRadius: 14,
              border: "none",
              background: input.trim()
                ? `linear-gradient(135deg, ${C.green} 0%, ${C.gold} 100%)`
                : C.paper,
              color: input.trim() ? "#fff" : C.textSoft,
              cursor: input.trim() ? "pointer" : "not-allowed",
              transition: "transform 0.18s, box-shadow 0.18s",
              flexShrink: 0,
              boxShadow: input.trim() ? `0 8px 24px ${C.greenGlow}` : "none",
              fontSize: 18,
              fontWeight: 700,
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
    const id = setInterval(() => setCurrentOhabolana((i) => (i + 1) % OHABOLANA.length), 7500);
    return () => clearInterval(id);
  }, []);

  return (
    <main style={{ minHeight: "100vh", background: C.white, position: "relative", overflow: "hidden" }}>
      {/* Ambient floating dust particles */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        {[...Array(22)].map((_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${(i * 47) % 100}%`,
              top: `${110 + (i % 30)}%`,
              width: 4 + (i % 4),
              height: 4 + (i % 4),
              borderRadius: "50%",
              background: i % 3 === 0 ? C.red : i % 3 === 1 ? C.green : C.gold,
              opacity: 0.45,
              animation: `riseDust ${28 + (i * 1.6)}s linear ${-(i * 1.9)}s infinite`,
              boxShadow: `0 0 12px ${i % 3 === 0 ? C.redGlow : i % 3 === 1 ? C.greenGlow : C.goldGlow}`,
            }}
          />
        ))}
      </div>

      {/* Baobab silhouettes behind hero */}
      <div style={{ position: "absolute", top: 100, left: -30, zIndex: 0, transform: "rotate(-8deg)" }}>
        <Baobab size={220} color={C.green} opacity={0.07} />
      </div>
      <div style={{ position: "absolute", top: 220, right: -20, zIndex: 0, transform: "rotate(12deg)" }}>
        <Baobab size={180} color={C.red} opacity={0.06} />
      </div>

      {/* ─── NAVBAR ─────────────────────────────────────────────────────────── */}
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "rgba(255,255,255,0.85)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderBottom: `1px solid ${C.border}`,
        }}
      >
        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <a href="/" style={{ textDecoration: "none" }}>
            <Wordmark size={24} />
          </a>
          <div style={{ display: "flex", gap: 22, alignItems: "center" }}>
            <a href="#ohabolana" style={{ fontSize: 14, color: C.textMuted, textDecoration: "none", fontWeight: 500 }}>Ohabolana</a>
            <a href="#piliers" style={{ fontSize: 14, color: C.textMuted, textDecoration: "none", fontWeight: 500 }}>Piliers</a>
            <a href="#anti-arnaque" style={{ fontSize: 14, color: C.redDeep, textDecoration: "none", fontWeight: 600 }}>Anti-arnaque</a>
          </div>
        </div>
      </nav>

      {/* ─── HERO with central chat ──────────────────────────────────────────── */}
      <section style={{ position: "relative", padding: "70px 24px 80px", zIndex: 1 }}>
        {/* Glow behind */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: "min(900px, 100%)",
            height: 700,
            background: `radial-gradient(ellipse at 50% 0%, ${C.greenGlow} 0%, transparent 50%), radial-gradient(ellipse at 50% 60%, ${C.goldGlow} 0%, transparent 60%), radial-gradient(ellipse at 50% 100%, ${C.redGlow} 0%, transparent 50%)`,
            pointerEvents: "none",
            animation: "auraRotate 14s ease-in-out infinite",
            opacity: 0.85,
          }}
        />

        <div style={{ position: "relative", maxWidth: 980, margin: "0 auto", textAlign: "center" }}>
          {/* Tag */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: C.greenSoft,
              border: `1px solid ${C.greenGlow}`,
              padding: "6px 16px",
              borderRadius: 100,
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 2.2,
              textTransform: "uppercase",
              color: C.greenDeep,
              marginBottom: 24,
              fontFamily: DISPLAY,
            }}
          >
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: C.green, animation: "pulseDot 1.6s ease-in-out infinite" }} />
            Faharanitan-tsaina malagasy
          </div>

          {/* Headline */}
          <h1
            style={{
              fontFamily: DISPLAY,
              fontSize: "clamp(2.6rem, 6vw, 4.8rem)",
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: "-1.5px",
              margin: "0 0 16px",
              color: C.text,
            }}
          >
            La sagesse{" "}
            <em
              style={{
                fontFamily: SERIF,
                fontStyle: "italic",
                background: `linear-gradient(90deg, ${C.green} 0%, ${C.gold} 50%, ${C.red} 100%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                fontWeight: 600,
              }}
            >
              malgache
            </em>
            <br />
            te parle.{" "}
            <em
              style={{
                fontFamily: SERIF,
                fontStyle: "italic",
                color: C.greenDeep,
                fontWeight: 600,
              }}
            >
              Maintenant.
            </em>
          </h1>

          <p
            style={{
              fontFamily: SERIF,
              fontStyle: "italic",
              fontSize: "1.3rem",
              lineHeight: 1.6,
              color: C.textMuted,
              maxWidth: 720,
              margin: "0 auto 48px",
            }}
          >
            iMahay est un expert IA formé sur les <strong style={{ color: C.greenDeep, fontWeight: 600 }}>ohabolana</strong>, le{" "}
            <strong style={{ color: C.redDeep, fontWeight: 600 }}>kabary</strong> et les{" "}
            <strong style={{ color: C.gold, fontWeight: 600 }}>fomba</strong>. Il écoute, conseille, protège — et te défend
            contre les arnaqueurs qui exploitent ta vulnérabilité.
          </p>

          {/* THE CHAT — central, prominent */}
          <CentralChat />

          {/* Bottom microcopy */}
          <p
            style={{
              fontSize: 13,
              color: C.textSoft,
              marginTop: 30,
              fontStyle: "italic",
              fontFamily: SERIF,
            }}
          >
            <span style={{ color: C.green, fontWeight: 700 }}>●</span> Gratuit, anonyme, sans inscription · Réponses en malgache et en français
          </p>
        </div>
      </section>

      {/* ─── OHABOLANA carousel ──────────────────────────────────────────────── */}
      <section id="ohabolana" style={{ padding: "100px 24px", position: "relative", zIndex: 1, background: `linear-gradient(180deg, ${C.white} 0%, ${C.greenSoft} 100%)` }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 50 }}>
            <div style={{ fontFamily: DISPLAY, fontSize: 11, fontWeight: 700, letterSpacing: 3, color: C.greenDeep, textTransform: "uppercase", marginBottom: 12 }}>
              Ohabolana — Proverbes
            </div>
            <h2 style={{ fontFamily: DISPLAY, fontSize: "clamp(2rem, 4.5vw, 3.4rem)", fontWeight: 600, color: C.text, margin: "0 0 14px", lineHeight: 1.15 }}>
              Mille ans de <em style={{ fontFamily: SERIF, fontStyle: "italic", color: C.greenDeep }}>sagesse</em>
              <br />
              en quelques mots.
            </h2>
          </div>

          <div
            key={currentOhabolana}
            style={{
              background: C.white,
              border: `1px solid ${C.border}`,
              borderRadius: 28,
              padding: "50px 48px",
              textAlign: "center",
              boxShadow: `0 30px 80px rgba(20,83,45,0.10)`,
              animation: "fadeRise 0.8s ease-out",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: -1,
                left: "20%",
                right: "20%",
                height: 3,
                background: `linear-gradient(90deg, transparent, ${C.green}, ${C.gold}, ${C.red}, transparent)`,
              }}
            />
            <p
              style={{
                fontFamily: SERIF,
                fontStyle: "italic",
                fontSize: "clamp(1.5rem, 3vw, 2.1rem)",
                lineHeight: 1.4,
                color: C.greenDeep,
                margin: "0 0 24px",
                fontWeight: 500,
              }}
            >
              « {OHABOLANA[currentOhabolana].mg} »
            </p>
            <p
              style={{
                fontFamily: SERIF,
                fontSize: "1.2rem",
                color: C.text,
                margin: "0 0 14px",
                fontWeight: 500,
              }}
            >
              {OHABOLANA[currentOhabolana].fr}
            </p>
            <p
              style={{
                fontFamily: SERIF,
                fontStyle: "italic",
                fontSize: "1rem",
                color: C.textMuted,
                margin: 0,
                lineHeight: 1.55,
                maxWidth: 540,
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              — {OHABOLANA[currentOhabolana].meaning}
            </p>
          </div>

          <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 28 }}>
            {OHABOLANA.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentOhabolana(i)}
                aria-label={`Ohabolana ${i + 1}`}
                style={{
                  width: i === currentOhabolana ? 28 : 8,
                  height: 8,
                  borderRadius: 4,
                  border: "none",
                  background: i === currentOhabolana ? C.greenDeep : C.border,
                  cursor: "pointer",
                  transition: "width 0.3s, background 0.3s",
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ─── 4 PILIERS CARDS ──────────────────────────────────────────────────── */}
      <section id="piliers" style={{ padding: "100px 24px", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{ fontFamily: DISPLAY, fontSize: 11, fontWeight: 700, letterSpacing: 3, color: C.red, textTransform: "uppercase", marginBottom: 12 }}>
              Quatre piliers
            </div>
            <h2 style={{ fontFamily: DISPLAY, fontSize: "clamp(2rem, 4.5vw, 3.2rem)", fontWeight: 600, color: C.text, margin: "0 0 14px", lineHeight: 1.15 }}>
              Ce sur quoi <em style={{ fontFamily: SERIF, fontStyle: "italic", color: C.redDeep }}>l&apos;Expert</em> te répond.
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 22 }}>
            {CHAPTERS.map((ch, i) => (
              <div
                key={ch.key}
                style={{
                  background: C.white,
                  border: `1px solid ${C.border}`,
                  borderRadius: 22,
                  padding: "36px 28px",
                  position: "relative",
                  overflow: "hidden",
                  cursor: "pointer",
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
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 16,
                    background: ch.bg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 22,
                  }}
                >
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

      {/* ─── ANTI-ARNAQUE MISSION ────────────────────────────────────────────── */}
      <section id="anti-arnaque" style={{ padding: "100px 24px", position: "relative", zIndex: 1, background: `linear-gradient(180deg, ${C.white} 0%, ${C.redSoft} 100%)` }}>
        <div style={{ maxWidth: 920, margin: "0 auto" }}>
          <div
            style={{
              background: C.white,
              border: `2px solid ${C.red}30`,
              borderRadius: 28,
              padding: "56px 48px",
              boxShadow: `0 30px 80px rgba(220,38,38,0.12)`,
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div style={{ position: "absolute", top: -60, right: -60, width: 200, height: 200, borderRadius: "50%", background: `radial-gradient(circle, ${C.redGlow} 0%, transparent 70%)`, pointerEvents: "none" }} />
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <Icon name="shield" color={C.red} size={36} />
              <div style={{ fontFamily: DISPLAY, fontSize: 11, fontWeight: 700, letterSpacing: 3, color: C.red, textTransform: "uppercase" }}>
                Mission anti-arnaque
              </div>
            </div>
            <h2 style={{ fontFamily: DISPLAY, fontSize: "clamp(1.8rem, 4vw, 2.6rem)", fontWeight: 600, color: C.text, margin: "0 0 18px", lineHeight: 1.2 }}>
              Trop de mpisikidy <em style={{ fontFamily: SERIF, fontStyle: "italic", color: C.redDeep }}>fictifs</em> exploitent la peur.
            </h2>
            <p style={{ fontFamily: SERIF, fontSize: "1.15rem", lineHeight: 1.7, color: C.textMuted, margin: "0 0 24px", fontStyle: "italic" }}>
              Quand quelqu&apos;un est malade, désespéré, ou cherche des réponses, certains profitent de la vulnérabilité
              avec des promesses creuses et des prix gonflés. iMahay offre une alternative : la <strong style={{ color: C.greenDeep }}>vraie</strong> sagesse
              ancestrale, sans paiement, sans manipulation.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginTop: 28 }}>
              {[
                { label: "Gratuit", color: C.green },
                { label: "Anonyme", color: C.gold },
                { label: "Sans promesses fausses", color: C.red },
                { label: "Conseils orientés", color: C.greenDeep },
              ].map((b) => (
                <div
                  key={b.label}
                  style={{
                    padding: "8px 16px",
                    borderRadius: 100,
                    background: `${b.color}15`,
                    border: `1px solid ${b.color}30`,
                    color: b.color,
                    fontSize: 13,
                    fontWeight: 600,
                    fontFamily: DISPLAY,
                  }}
                >
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
            maxWidth: 800,
            margin: "0 auto",
            padding: "60px 48px",
            background: `linear-gradient(135deg, ${C.greenDeep} 0%, ${C.red} 100%)`,
            borderRadius: 28,
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
            boxShadow: `0 40px 100px rgba(20,83,45,0.30)`,
          }}
        >
          <div style={{ position: "absolute", top: "-50%", left: "50%", width: "60%", height: "200%", background: `radial-gradient(ellipse at 50% 0%, ${C.goldGlow} 0%, transparent 65%)`, transform: "translateX(-50%)", pointerEvents: "none" }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <h2 style={{ fontFamily: DISPLAY, fontSize: "clamp(1.8rem, 4vw, 2.6rem)", fontWeight: 600, color: "#fff", margin: "0 0 18px", lineHeight: 1.2 }}>
              Mahaiza.{" "}
              <em style={{ fontFamily: SERIF, fontStyle: "italic", color: C.goldSoft, fontWeight: 600 }}>
                Sache. Comprends. Décide.
              </em>
            </h2>
            <p style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: "1.15rem", color: "rgba(255,255,255,0.9)", maxWidth: 480, margin: "0 auto 32px", lineHeight: 1.6 }}>
              L&apos;expert t&apos;attend. Aucune question n&apos;est trop simple, aucune ne mérite mépris.
            </p>
            <a
              href="#top"
              onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              style={{
                background: "#fff",
                color: C.greenDeep,
                border: "none",
                padding: "16px 36px",
                borderRadius: 100,
                fontSize: 15,
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "inherit",
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                textDecoration: "none",
                letterSpacing: 0.3,
                boxShadow: "0 12px 40px rgba(0,0,0,0.2)",
              }}
            >
              Anontaniana ny Expert ↑
            </a>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─────────────────────────────────────────────────────────── */}
      <footer style={{ padding: "50px 24px 30px", borderTop: `1px solid ${C.border}`, background: C.parchment }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", textAlign: "center" }}>
          <Wordmark size={20} />
          <p style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: "0.95rem", color: C.textMuted, maxWidth: 480, margin: "16px auto 18px" }}>
            « Ny fahalalana toy ny voantongon-tsofina, mitombo amin&apos;ny fihainoana. »
            <br />
            <span style={{ color: C.greenDeep, fontFamily: DISPLAY, fontSize: 11, fontStyle: "normal", letterSpacing: 2, fontWeight: 700 }}>
              Ohabolana malagasy
            </span>
          </p>
          <p style={{ fontSize: 12, color: C.textSoft, margin: 0 }}>
            © {new Date().getFullYear()} iMahay — La sagesse malgache à portée. Gratuit · Maimaim-poana.
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
        @keyframes auraRotate {
          0%, 100% { filter: hue-rotate(0deg); }
          50% { filter: hue-rotate(20deg); }
        }
        @keyframes fadeRise {
          0%   { opacity: 0; transform: translateY(24px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { animation: none !important; transition: none !important; }
        }
      `}</style>
    </main>
  );
}
