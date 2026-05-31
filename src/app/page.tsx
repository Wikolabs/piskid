"use client";

import PiskidChat from "./PiskidChat";

export default function HomePage() {
  const bg = "#04080F";
  const bg2 = "#070D1B";
  const card = "rgba(255,255,255,0.04)";
  const border = "rgba(255,255,255,0.09)";
  const gold = "#D4AF37";
  const goldDim = "rgba(212,175,55,0.1)";
  const goldBorder = "rgba(212,175,55,0.28)";
  const txt1 = "#F0EDE6";
  const txt2 = "#8B9DB5";
  const txt3 = "#3C5068";
  const purple = "#A78BFA";
  const purpleDim = "rgba(167,139,250,0.1)";
  const purpleBorder = "rgba(167,139,250,0.28)";

  const topics = [
    { icon: "💔", title: "Amour et famille", desc: "Difficultés relationnelles, rupture, conflits familiaux, mariage" },
    { icon: "💰", title: "Argent et finances", desc: "Dettes, épargne, mauvaise gestion, investissements à Madagascar" },
    { icon: "🚀", title: "Projets et carrière", desc: "Projet qui échoue, recherche d'emploi, entrepreneuriat, reconversion" },
    { icon: "🌍", title: "Opportunités à Mada", desc: "Unipod, Maison du Numérique, JCI, Join Scout, BNI Madagascar" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: bg, color: txt1 }}>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body { -webkit-font-smoothing: antialiased; overflow-x: hidden; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulseDot { 0%,100%{ opacity:1; transform:scale(1); } 50%{ opacity:.4; transform:scale(1.6); } }
        .wk-card { transition: background .3s, border-color .3s, transform .35s cubic-bezier(.34,1.2,.64,1); }
        .wk-card:hover { background: rgba(255,255,255,0.07) !important; border-color: rgba(167,139,250,0.4) !important; transform: translateY(-6px) !important; }
        .wk-btn { transition: opacity .2s, transform .2s, box-shadow .2s; }
        .wk-btn:hover { opacity:.9; transform:translateY(-2px); box-shadow:0 12px 32px rgba(212,175,55,.18); }
        .wk-wa { transition: opacity .2s, transform .2s; }
        .wk-wa:hover { opacity:.9; transform:translateY(-2px); }
        @media(max-width:640px){ .wk-hero-title{ font-size:2.2rem!important; } }
      `}</style>

      {/* NAVBAR */}
      <nav style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(4,8,15,0.88)", backdropFilter: "blur(20px)", borderBottom: `1px solid ${border}`, padding: "0 40px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <span style={{ fontSize: "1.35rem" }}>🔮</span>
          <span style={{ fontSize: 20, fontWeight: 800, color: purple, letterSpacing: "-0.02em" }}>piskid.com</span>
        </div>
        <span style={{ fontSize: "0.85rem", color: txt3, fontStyle: "italic" }}>Votre mpisikidy IA</span>
      </nav>

      {/* HERO */}
      <section style={{ padding: "80px 40px 48px", textAlign: "center", maxWidth: 860, margin: "0 auto", position: "relative" }}>
        <div style={{ position: "absolute", top: -60, left: "50%", transform: "translateX(-50%)", width: 700, height: 500, background: "radial-gradient(ellipse at 50% 30%, rgba(167,139,250,0.08) 0%, transparent 60%)", pointerEvents: "none" }} />
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 24, background: purpleDim, border: `1px solid ${purpleBorder}`, borderRadius: 100, padding: "6px 18px", animation: "fadeUp .5s ease both" }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: purple, display: "inline-block", animation: "pulseDot 2s ease-in-out infinite" }} />
          <span style={{ color: purple, fontSize: 11.5, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase" }}>Conseils IA gratuits · Pour tous les Malgaches</span>
        </div>
        <h1 className="wk-hero-title" style={{ fontSize: "clamp(2.4rem,5.5vw,4rem)", fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.03em", marginBottom: 20, fontFamily: "'Instrument Serif',Georgia,serif", animation: "fadeUp .5s .08s ease both" }}>
          <span style={{ display: "block", color: txt1 }}>Votre mpisikidy IA,</span>
          <span style={{ display: "block", color: purple, fontStyle: "italic" }}>sans arnaque.</span>
        </h1>
        <p style={{ fontSize: "1.05rem", color: txt2, maxWidth: 580, margin: "0 auto 0", lineHeight: 1.72, animation: "fadeUp .5s .16s ease both" }}>
          Piskid utilise l'IA et des données réelles pour vous conseiller sur votre vie — amour, argent, carrière — gratuitement. Fini les faux pasteurs et devins indiens.
        </p>
      </section>

      {/* CHAT SECTION */}
      <section id="chat" style={{ width: "100%", maxWidth: "72rem", margin: "0 auto", padding: "2rem 1.5rem 5rem" }}>
        <PiskidChat />
      </section>

      {/* TOPICS */}
      <section style={{ maxWidth: "60rem", margin: "0 auto", padding: "0 1.5rem 5rem" }}>
        <div style={{ textAlign: "center", marginBottom: 44 }}>
          <p style={{ fontSize: "0.68rem", color: gold, letterSpacing: "3px", textTransform: "uppercase", fontWeight: 700, marginBottom: 14 }}>Domaines d'analyse</p>
          <h2 style={{ fontSize: "clamp(1.6rem,3vw,2.4rem)", fontWeight: 700, color: txt1, fontFamily: "'Instrument Serif',Georgia,serif", letterSpacing: "-0.02em" }}>
            Ce que Piskid <em style={{ fontStyle: "italic", color: purple }}>analyse pour vous</em>
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.25rem" }}>
          {topics.map((topic, i) => (
            <div key={topic.title} className="wk-card" style={{ background: card, border: `1px solid ${border}`, borderRadius: 20, padding: "1.5rem", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,transparent,${i % 2 === 0 ? purple : gold},transparent)`, opacity: 0.6 }} />
              <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>{topic.icon}</div>
              <h3 style={{ fontWeight: 700, fontSize: "1rem", color: purple, marginBottom: "0.4rem" }}>{topic.title}</h3>
              <p style={{ fontSize: "0.875rem", color: txt2, lineHeight: 1.6, margin: 0 }}>{topic.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section id="cta" style={{ padding: "0 40px 100px", maxWidth: 860, margin: "0 auto" }}>
        <div style={{ background: card, border: `1px solid ${goldBorder}`, borderRadius: 24, padding: "64px 48px", textAlign: "center", backgroundImage: `radial-gradient(ellipse at 50% 0%, ${goldDim} 0%, transparent 65%)` }}>
          <p style={{ fontSize: "0.68rem", color: gold, letterSpacing: "3px", textTransform: "uppercase", fontWeight: 700, marginBottom: 16 }}>Contact</p>
          <h2 style={{ fontSize: "clamp(1.8rem,3.5vw,2.6rem)", fontWeight: 700, color: txt1, marginBottom: 14, letterSpacing: "-0.02em", fontFamily: "'Instrument Serif',Georgia,serif" }}>
            Une question sur Piskid ?
          </h2>
          <p style={{ color: txt2, fontSize: "1rem", marginBottom: 36, lineHeight: 1.7 }}>
            L'équipe Wikolabs vous répond par WhatsApp ou vous pouvez réserver un créneau pour en discuter.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
            <button
              data-cal-link="wikolabs-team/30min"
              data-cal-namespace="wk30min"
              data-cal-config='{"layout":"month_view"}'
              className="wk-btn"
              style={{ background: gold, color: "#04080F", border: "none", borderRadius: 10, padding: "14px 28px", fontWeight: 700, fontSize: 15, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, fontFamily: "inherit" }}
            >
              📅 Réserver un créneau
            </button>
            <a
              href="https://wa.me/261386626100?text=Bonjour%2C%20je%20souhaite%20discuter%20de%20piskid.com%20avec%20Wikolabs."
              target="_blank"
              rel="noopener noreferrer"
              className="wk-wa"
              style={{ background: "#25d366", color: "#fff", borderRadius: 10, padding: "14px 28px", fontWeight: 700, fontSize: 15, textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }}
            >
              💬 WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: `1px solid ${border}`, padding: "32px 40px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
          <div>
            <span style={{ fontWeight: 800, fontSize: 17, color: purple }}>piskid<span style={{ color: gold }}>.com</span></span>
            <span style={{ display: "block", fontSize: 12, color: txt3, marginTop: 3 }}>Conseil gratuit pour tous les Malgaches</span>
          </div>
          <p style={{ fontSize: 13, color: txt3 }}>© 2026 Piskid — Un service <a href="https://wikolabs.com" style={{ color: txt2, textDecoration: "none" }}>Wikolabs</a></p>
          <a href="mailto:team@wikolabs.com" style={{ color: txt3, fontSize: 13, textDecoration: "none" }}>team@wikolabs.com</a>
        </div>
      </footer>
    </div>
  );
}
