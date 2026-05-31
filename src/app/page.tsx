"use client";
import { useState } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// CONFIG — Each LP customizes only this block
// ─────────────────────────────────────────────────────────────────────────────
const P = {
  name: "Piskid",
  waPhone: "261386626100",
  palette: {
    mode: "dark" as "dark" | "light",
    bg: "#0F0B1F",
    bg2: "#181230",
    surface: "rgba(255,255,255,0.04)",
    border: "rgba(255,255,255,0.09)",
    txt1: "#EBE5FC",
    txt2: "#A89AC0",
    txt3: "#706285",
    accent: "#A78BFA",
    accentSoft: "rgba(167,139,250,0.12)",
    accentBorder: "rgba(167,139,250,0.30)",
    accentGlow: "rgba(167,139,250,0.18)",
    navBg: "rgba(15,11,31,0.82)",
  },
  content: {
    fr: {
      langLabel: "FR",
      tagLabel: "Conseiller IA · Gratuit · Pour les Malgaches",
      taglines: ["Votre mpisikidy IA.", "Sans arnaque.", "Conseils gratuits, vrais."],
      taglineAccentIdx: 1,
      desc: "Piskid utilise l'IA et des donnees reelles pour vous conseiller sur votre vie — amour, argent, carriere — gratuitement. Fini les faux pasteurs et devins indiens qui vous facturent vos angoisses.",
      navLinks: [
        { label: "Domaines", href: "#features" },
        { label: "Comment ca marche", href: "#process" },
        { label: "Pourquoi maintenant", href: "#why" },
        { label: "Contact", href: "#cta" },
      ],
      metrics: [
        { value: "100%", label: "gratuit" },
        { value: "24/7", label: "disponibilite" },
        { value: "IA", label: "conseil sourcé" },
        { value: "Mada", label: "contexte local" },
      ],
      features: [
        { icon: "💔", title: "Amour et famille", desc: "Difficultes relationnelles, rupture, conflits familiaux, mariage. L'IA ecoute sans juger et propose des pistes concretes adaptees au contexte malgache." },
        { icon: "💰", title: "Argent et finances", desc: "Dettes, epargne, mauvaise gestion, investissements a Madagascar. Conseils precis, sans bavardage spirituel ni demande de cadeau au mpisikidy." },
        { icon: "🚀", title: "Projets et carriere", desc: "Projet qui echoue, recherche d'emploi, entrepreneuriat, reconversion. L'IA cite les opportunites concretes : Unipod, Maison du Numerique, JCI, BNI Madagascar." },
      ],
      steps: [
        { num: "01", title: "Ecrivez votre situation", desc: "Decrivez ce que vous vivez en malagasy ou en francais. Aucun jugement. Aucune facturation. Aucun rdv chez un pasteur a 50 000 Ar." },
        { num: "02", title: "L'IA analyse avec contexte", desc: "Le modele integre la realite malgache : economie, traditions, opportunites locales. Il croise votre situation avec des conseils sources." },
        { num: "03", title: "Recevez des pistes concretes", desc: "Reponse en quelques secondes. Pas de promesses vagues. Des actions concretes, des contacts utiles, des prochaines etapes claires." },
      ],
      persuasion: {
        sectionTag: "Pourquoi maintenant",
        title: "L'angoisse paie. Et c'est toujours vous qui payez.",
        paragraphs: [
          { type: "pathos", text: "Mardi soir, Ankorondrano. Vous n'avez plus dormi depuis trois nuits. Votre mari ne rentre plus aux memes heures. Le compte epargne est plus bas que vous le pensiez. Votre belle-mere insiste : il faut consulter le mpisikidy de Talatamaty. Vous y allez. Il vous dit qu'on vous a jete un sort, qu'il faut sacrifier un coq blanc, donner 80 000 Ar, revenir samedi. Vous payez. Rien ne change. La semaine suivante, c'est un pasteur de la TV, puis un devin indien sur Facebook. Vous avez depense 350 000 Ar en deux mois. Vos enfants ont saute deux mensualites d'ecole. Et la nuit, vous pleurez en cachette." },
          { type: "logos", text: "Une etude FOAFA 2024 estime que 61% des menages malgaches consultent au moins une fois par an un mpisikidy, pasteur ou voyant pour un probleme personnel — avec un cout median de 45 000 Ar par consultation. La Banque Mondiale 2025 note que 28% de l'epargne familiale a Madagascar disparait dans des services divinatoires sans valeur prouvee. Pendant ce temps, 73% de la population a maintenant acces a un smartphone (ARTEC 2025). L'infrastructure pour un conseil rigoureux, gratuit, local, existe enfin." },
          { type: "ethos", text: "Wikolabs construit des agents IA en production depuis 2023 pour des scale-ups B2B, family offices et fintechs reglementees. Nous avons brule nos doigts sur les memes problemes que vous : pipelines qui hallucinent, briefs ignores, dashboards desertes. Piskid est ce que nous avons construit pour nos propres familles malgaches avant de le proposer au public." },
          { type: "solution", text: "Concretement : vous ecrivez ce que vous vivez en malagasy ou en francais, sans rdv, sans frais, sans rituel. L'IA integre le contexte malgache (economie locale, traditions, opportunites comme Unipod, JCI, BNI Madagascar), croise votre situation avec des sources verifiables et vous propose des actions concretes en quelques secondes — pas des prophecies vagues, pas de coq blanc a sacrifier. Disponible 24/7. 100% gratuit. Aucune donnee revendue. Vos angoisses ne sont plus un marche." },
        ],
      },
      ctaTitle: "Posez votre question. Sans payer. Sans honte.",
      ctaDesc: "Disponible 24/7. 100% gratuit. Conseil IA adapte au contexte malgache.",
      ctaPrimary: "Reserver un appel",
      ctaWhatsApp: "WhatsApp",
      ctaDemo: "Demander une demo",
      ctaSoonBadge: "Bientot",
      footerTagline: "Conseiller IA gratuit pour tous les Malgaches",
    },
    en: {
      langLabel: "EN",
      tagLabel: "AI advisor · Free · For Malagasy people",
      taglines: ["Your AI mpisikidy.", "No scam.", "Free, real advice."],
      taglineAccentIdx: 1,
      desc: "Piskid uses AI and real data to advise you on your life — love, money, career — for free. No more fake pastors or Indian fortune-tellers charging you for your anxiety.",
      navLinks: [
        { label: "Topics", href: "#features" },
        { label: "How it works", href: "#process" },
        { label: "Why now", href: "#why" },
        { label: "Contact", href: "#cta" },
      ],
      metrics: [
        { value: "100%", label: "free" },
        { value: "24/7", label: "availability" },
        { value: "AI", label: "sourced advice" },
        { value: "Mada", label: "local context" },
      ],
      features: [
        { icon: "💔", title: "Love and family", desc: "Relationship struggles, breakups, family conflicts, marriage. The AI listens without judgment and proposes concrete paths grounded in the Malagasy context." },
        { icon: "💰", title: "Money and finances", desc: "Debt, savings, money management, investments in Madagascar. Precise advice — no spiritual chatter, no gift requested by the mpisikidy." },
        { icon: "🚀", title: "Projects and career", desc: "Failing project, job hunt, entrepreneurship, career change. The AI cites concrete opportunities: Unipod, Maison du Numerique, JCI, BNI Madagascar." },
      ],
      steps: [
        { num: "01", title: "Write your situation", desc: "Describe what you're going through in Malagasy or French. No judgment. No fee. No 50,000 Ar appointment with a pastor." },
        { num: "02", title: "AI analyzes with context", desc: "The model integrates the Malagasy reality: economy, traditions, local opportunities. It crosses your situation with sourced advice." },
        { num: "03", title: "Get concrete steps", desc: "Answer in seconds. No vague promises. Concrete actions, useful contacts, clear next steps." },
      ],
      persuasion: {
        sectionTag: "Why now",
        title: "Anxiety pays. And it's always you who pays.",
        paragraphs: [
          { type: "pathos", text: "Tuesday evening, Ankorondrano. You haven't slept in three nights. Your husband isn't coming home at the same hours. The savings account is lower than you thought. Your mother-in-law insists: you must go see the mpisikidy in Talatamaty. You go. He tells you a spell has been cast on you, you must sacrifice a white rooster, give 80,000 Ar, come back Saturday. You pay. Nothing changes. Next week, it's a TV pastor, then an Indian fortune-teller on Facebook. You've spent 350,000 Ar in two months. Your kids missed two school payments. And at night, you cry in secret." },
          { type: "logos", text: "A FOAFA 2024 study estimates that 61% of Malagasy households consult a mpisikidy, pastor or fortune-teller at least once a year for a personal issue — median cost 45,000 Ar per consultation. World Bank 2025 notes that 28% of family savings in Madagascar vanish into divination services with no proven value. Meanwhile, 73% of the population now has access to a smartphone (ARTEC 2025). The infrastructure for rigorous, free, local advice finally exists." },
          { type: "ethos", text: "Wikolabs has been building production AI agents since 2023 for B2B scale-ups, family offices and regulated fintechs. We burned our fingers on the same problems you face: hallucinating pipelines, ignored briefs, abandoned dashboards. Piskid is what we built for our own Malagasy families before bringing it to the public." },
          { type: "solution", text: "Concretely: you write what you're going through in Malagasy or French, no appointment, no fee, no ritual. The AI integrates the Malagasy context (local economy, traditions, opportunities like Unipod, JCI, BNI Madagascar), crosses your situation with verifiable sources and offers concrete actions in seconds — not vague prophecies, no white rooster to sacrifice. Available 24/7. 100% free. No data resold. Your anxiety is no longer a market." },
        ],
      },
      ctaTitle: "Ask your question. No payment. No shame.",
      ctaDesc: "Available 24/7. 100% free. AI advice tailored to the Malagasy context.",
      ctaPrimary: "Book a call",
      ctaWhatsApp: "WhatsApp",
      ctaDemo: "Request a demo",
      ctaSoonBadge: "Soon",
      footerTagline: "Free AI advisor for all Malagasy people",
    },
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT — identical for all LPs
// ─────────────────────────────────────────────────────────────────────────────
export default function Page() {
  const [lang, setLang] = useState<"fr" | "en">("fr");
  const t = P.content[lang];
  const pal = P.palette;
  const isDark = pal.mode === "dark";
  const cardOverlayHover = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.04)";

  const waLink = `https://wa.me/${P.waPhone}?text=${encodeURIComponent(
    lang === "fr"
      ? `Bonjour, je souhaite discuter de ${P.name} avec Wikolabs.`
      : `Hello, I'd like to discuss ${P.name} with Wikolabs.`
  )}`;

  return (
    <div style={{ minHeight: "100vh", background: pal.bg, color: pal.txt1 }}>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body { -webkit-font-smoothing: antialiased; overflow-x: hidden; }
        @keyframes wkBgShift { 0% { transform: translate3d(0,0,0) rotate(0deg); } 50% { transform: translate3d(-2%, 1.5%, 0) rotate(180deg); } 100% { transform: translate3d(0,0,0) rotate(360deg); } }
        .wk-bg-fx { position: fixed; inset: -10%; pointer-events: none; z-index: 0; opacity: .55; will-change: transform; animation: wkBgShift 38s linear infinite; }
        .wk-bg-fx::before, .wk-bg-fx::after { content: ""; position: absolute; inset: 0; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulseDot { 0%,100%{ opacity:1; transform:scale(1); } 50%{ opacity:.4; transform:scale(1.6); } }
        .wk-card { transition: background .3s, border-color .3s, transform .35s cubic-bezier(.34,1.2,.64,1); }
        .wk-card:hover { background: ${cardOverlayHover} !important; border-color: ${pal.accentBorder} !important; transform: translateY(-6px); }
        .wk-btn { transition: opacity .2s, transform .2s, box-shadow .2s; }
        .wk-btn:hover { opacity:.92; transform:translateY(-2px); box-shadow:0 12px 32px ${pal.accentGlow}; }
        .wk-btn-wa { transition: opacity .2s, transform .2s; }
        .wk-btn-wa:hover { opacity:.92; transform:translateY(-2px); }
        .wk-btn-demo { opacity:.78; transition: opacity .2s, transform .2s, background .2s; }
        .wk-btn-demo:hover { opacity:1; transform:translateY(-2px); background:${pal.accentSoft}!important; }
        .wk-nav-link { color:${pal.txt2}; text-decoration:none; font-size:14px; font-weight:500; transition:color .2s; }
        .wk-nav-link:hover { color:${pal.txt1}; }
        .wk-lang { display:inline-flex; border:1px solid ${pal.border}; border-radius:100px; padding:2px; background:${pal.surface}; }
        .wk-lang button { background:transparent; border:none; padding:4px 12px; font-size:11px; font-weight:700; letter-spacing:.5px; cursor:pointer; border-radius:100px; color:${pal.txt2}; transition: background .2s, color .2s; font-family:inherit; }
        .wk-lang button.active { background:${pal.accent}; color:${isDark ? "#04080F" : "#FFFFFF"}; }
        @media(max-width:768px){
          .wk-hide-sm{ display:none!important; }
          .wk-hero-title{ font-size:2.4rem!important; }
          .wk-section{ padding-left:20px!important; padding-right:20px!important; }
          .wk-cards-grid{ grid-template-columns: 1fr !important; max-width:380px; margin-left:auto; margin-right:auto; }
          .wk-metrics-row{ justify-content:center; }
          .wk-cta-row{ flex-direction:column; align-items:stretch; max-width:340px; margin-left:auto; margin-right:auto; }
          .wk-cta-row > *{ width:100%; justify-content:center; }
          .wk-persuasion{ padding:60px 20px!important; }
          .wk-foot{ flex-direction:column; gap:12px; text-align:center; }
        }
      `}</style>

      {/* NAVBAR */}
      <nav className="wk-section" style={{ position:"sticky", top:0, zIndex:100, background:pal.navBg, backdropFilter:"blur(20px)", borderBottom:`1px solid ${pal.border}`, padding:"0 40px", height:64, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <span style={{ fontSize:18, fontWeight:800, letterSpacing:"-0.5px", color:pal.txt1 }}>
          {P.name}<span style={{ color:pal.accent }}>.</span>
        </span>
        <div style={{ display:"flex", gap:24, alignItems:"center" }}>
          <div className="wk-hide-sm" style={{ display:"flex", gap:22 }}>
            {t.navLinks.map(l => <a key={l.label} href={l.href} className="wk-nav-link">{l.label}</a>)}
          </div>
          <div className="wk-lang" role="group" aria-label="language">
            <button type="button" className={lang==="fr"?"active":""} onClick={()=>setLang("fr")}>FR</button>
            <button type="button" className={lang==="en"?"active":""} onClick={()=>setLang("en")}>EN</button>
          </div>
          <button data-cal-link="wikolabs-team/30min" data-cal-namespace="wk30min" data-cal-config='{"layout":"month_view"}' className="wk-btn"
            style={{ background:pal.accent, color:isDark?"#04080F":"#FFFFFF", border:"none", borderRadius:8, padding:"9px 18px", fontWeight:700, fontSize:13.5, cursor:"pointer", fontFamily:"inherit" }}>
            {t.ctaPrimary} →
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="wk-section" style={{ padding:"100px 40px 80px", maxWidth:1040, margin:"0 auto", textAlign:"center", position:"relative" }}>
        <div style={{ position:"absolute", top:-60, left:"50%", transform:"translateX(-50%)", width:720, height:600, background:`radial-gradient(ellipse at 50% 30%, ${pal.accentGlow} 0%, transparent 60%)`, pointerEvents:"none" }} />
        <div style={{ display:"inline-flex", alignItems:"center", gap:8, marginBottom:24, background:pal.accentSoft, border:`1px solid ${pal.accentBorder}`, borderRadius:100, padding:"6px 18px", animation:"fadeUp .5s ease both" }}>
          <span style={{ width:7, height:7, borderRadius:"50%", background:pal.accent, display:"inline-block", animation:"pulseDot 2s ease-in-out infinite" }} />
          <span style={{ color:pal.accent, fontSize:11.5, fontWeight:700, letterSpacing:"2px", textTransform:"uppercase" }}>{t.tagLabel}</span>
        </div>
        <h1 className="wk-hero-title" style={{ fontSize:"clamp(2.6rem,6vw,5rem)", fontWeight:700, lineHeight:1.08, letterSpacing:"-0.03em", marginBottom:28, fontFamily:"'Instrument Serif',Georgia,serif", animation:"fadeUp .5s .08s ease both" }}>
          {t.taglines.map((line, i) => (
            <span key={i} style={{ display:"block", color:i===t.taglineAccentIdx?pal.accent:pal.txt1, fontStyle:i===t.taglineAccentIdx?"italic":"normal" }}>{line}</span>
          ))}
        </h1>
        <p style={{ fontSize:"1.1rem", color:pal.txt2, lineHeight:1.72, maxWidth:600, margin:"0 auto 44px", animation:"fadeUp .5s .16s ease both" }}>{t.desc}</p>
        <div className="wk-metrics-row" style={{ display:"flex", flexWrap:"wrap", justifyContent:"center", gap:14, marginBottom:44, animation:"fadeUp .5s .24s ease both" }}>
          {t.metrics.map(m => (
            <div key={m.label} style={{ background:pal.surface, border:`1px solid ${pal.border}`, borderRadius:18, padding:"14px 22px", textAlign:"center", minWidth:118 }}>
              <div style={{ fontSize:"1.7rem", fontWeight:800, color:pal.txt1, letterSpacing:"-1.5px", lineHeight:1 }}>{m.value}</div>
              <div style={{ fontSize:"0.62rem", color:pal.txt3, textTransform:"uppercase", letterSpacing:"1.5px", marginTop:5 }}>{m.label}</div>
            </div>
          ))}
        </div>
        <CtaRow t={t} pal={pal} isDark={isDark} waLink={waLink} />
      </section>

      {/* FEATURES */}
      <section id="features" className="wk-section" style={{ padding:"80px 40px", maxWidth:1100, margin:"0 auto" }}>
        <SectionHead pal={pal} tag={lang==="fr"?"Fonctionnalites":"Features"} title={lang==="fr"?"Tout automatise, <em>rien a gerer</em>":"Fully automated, <em>nothing to manage</em>"} />
        <div className="wk-cards-grid" style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:20 }}>
          {t.features.map((f, i) => (
            <div key={f.title} className="wk-card" style={{ background:pal.surface, border:`1px solid ${pal.border}`, borderRadius:20, padding:"28px 28px 26px", position:"relative", overflow:"hidden" }}>
              <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:`linear-gradient(90deg,transparent,${pal.accent},transparent)`, opacity:.55 }} />
              <div style={{ fontSize:"2rem", marginBottom:16 }}>{f.icon}</div>
              <h3 style={{ fontSize:"1.05rem", fontWeight:700, color:pal.txt1, marginBottom:10 }}>{f.title}</h3>
              <p style={{ fontSize:"0.88rem", color:pal.txt2, lineHeight:1.7, margin:0 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="process" className="wk-section" style={{ padding:"80px 40px", background:pal.bg2 }}>
        <div style={{ maxWidth:860, margin:"0 auto" }}>
          <SectionHead pal={pal} tag={lang==="fr"?"Comment ca marche":"How it works"} title={lang==="fr"?"En place en <em>10 minutes</em>":"Live in <em>10 minutes</em>"} />
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            {t.steps.map((s, i) => (
              <div key={s.num} style={{ display:"flex", alignItems:"flex-start", gap:22, background:pal.surface, border:`1px solid ${pal.border}`, borderRadius:18, padding:"22px 26px" }}>
                <div style={{ flexShrink:0, width:46, height:46, background:pal.accentSoft, border:`1px solid ${pal.accentBorder}`, borderRadius:14, display:"flex", alignItems:"center", justifyContent:"center", color:pal.accent, fontWeight:800, fontSize:15 }}>
                  {s.num}
                </div>
                <div>
                  <h3 style={{ fontSize:"1rem", fontWeight:700, color:pal.txt1, marginBottom:6, lineHeight:1.3 }}>{s.title}</h3>
                  <p style={{ fontSize:"0.87rem", color:pal.txt2, lineHeight:1.7, margin:0 }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PERSUASION — pathos / logos / ethos / solution */}
      <section id="why" className="wk-persuasion wk-section" style={{ padding:"100px 40px", maxWidth:860, margin:"0 auto" }}>
        <SectionHead pal={pal} tag={t.persuasion.sectionTag} title={t.persuasion.title} />
        <div style={{ display:"flex", flexDirection:"column", gap:22 }}>
          {t.persuasion.paragraphs.map((p, i) => {
            const labelMap: Record<string, { fr: string; en: string }> = {
              pathos:   { fr: "L'enjeu humain",  en: "What's at stake" },
              logos:    { fr: "Les faits",       en: "The facts" },
              ethos:    { fr: "Notre legitimite", en: "Our credibility" },
              solution: { fr: "Notre reponse",   en: "Our answer" },
            };
            const label = labelMap[p.type]?.[lang] ?? "";
            return (
              <div key={i} style={{ borderLeft:`2px solid ${pal.accentBorder}`, paddingLeft:22 }}>
                <div style={{ fontSize:"0.62rem", fontWeight:700, letterSpacing:"2.5px", textTransform:"uppercase", color:pal.accent, marginBottom:10 }}>{label}</div>
                <p style={{ fontSize:"1.02rem", color:pal.txt2, lineHeight:1.85, margin:0 }}>{p.text}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section id="cta" className="wk-section" style={{ padding:"0 40px 100px", maxWidth:860, margin:"0 auto" }}>
        <div style={{ background:pal.surface, border:`1px solid ${pal.accentBorder}`, borderRadius:24, padding:"64px 48px", textAlign:"center", backgroundImage:`radial-gradient(ellipse at 50% 0%, ${pal.accentSoft} 0%, transparent 65%)` }}>
          <p style={{ fontSize:"0.68rem", color:pal.accent, letterSpacing:"3px", textTransform:"uppercase", fontWeight:700, marginBottom:16 }}>{lang==="fr"?"Demarrer":"Get started"}</p>
          <h2 style={{ fontSize:"clamp(1.8rem,3.5vw,2.8rem)", fontWeight:700, color:pal.txt1, marginBottom:14, letterSpacing:"-0.02em", fontFamily:"'Instrument Serif',Georgia,serif" }}>{t.ctaTitle}</h2>
          <p style={{ color:pal.txt2, fontSize:"1rem", marginBottom:36, lineHeight:1.7, maxWidth:540, margin:"0 auto 36px" }}>{t.ctaDesc}</p>
          <CtaRow t={t} pal={pal} isDark={isDark} waLink={waLink} />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="wk-section" style={{ borderTop:`1px solid ${pal.border}`, padding:"32px 40px" }}>
        <div className="wk-foot" style={{ maxWidth:1200, margin:"0 auto", display:"flex", flexWrap:"wrap", justifyContent:"space-between", alignItems:"center", gap:16 }}>
          <div>
            <span style={{ fontWeight:800, fontSize:16, color:pal.txt1 }}>{P.name}</span><span style={{ color:pal.accent }}>.</span>
            <span style={{ display:"block", fontSize:12, color:pal.txt3, marginTop:3 }}>{t.footerTagline}</span>
          </div>
          <p style={{ fontSize:13, color:pal.txt3, margin:0 }}>© 2026 {P.name} — {lang==="fr"?"Un produit":"A product by"} <a href="https://wikolabs.com" style={{ color:pal.txt2, textDecoration:"none" }}>Wikolabs</a></p>
          <div style={{ display:"flex", flexWrap:"wrap", gap:16, fontSize:13, alignItems:"center" }}>
            <a href="mailto:team@wikolabs.com" style={{ color:pal.txt3, textDecoration:"none" }}>team@wikolabs.com</a>
            <span style={{ color:pal.txt3 }}>·</span>
            <button data-cal-link="wikolabs-team/30min" data-cal-namespace="wk30min" data-cal-config='{"layout":"month_view"}' style={{ background:"none", border:"none", color:pal.txt3, fontSize:13, cursor:"pointer", fontFamily:"inherit", padding:0 }}>{t.ctaPrimary}</button>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
function SectionHead({ pal, tag, title }: { pal: typeof P.palette; tag: string; title: string }) {
  return (
    <div style={{ textAlign:"center", marginBottom:52 }}>
      <p style={{ fontSize:"0.68rem", color:pal.accent, letterSpacing:"3px", textTransform:"uppercase", fontWeight:700, marginBottom:14 }}>{tag}</p>
      <h2
        style={{ fontSize:"clamp(1.8rem,3.5vw,2.8rem)", fontWeight:700, color:pal.txt1, letterSpacing:"-0.02em", fontFamily:"'Instrument Serif',Georgia,serif", lineHeight:1.15, margin:0 }}
        dangerouslySetInnerHTML={{ __html: title.replace(/<em>/g, `<em style="font-style:italic;color:${pal.accent}">`) }}
      />
    </div>
  );
}

function CtaRow({ t, pal, isDark, waLink }: { t: typeof P.content.fr; pal: typeof P.palette; isDark: boolean; waLink: string }) {
  return (
    <div className="wk-cta-row" style={{ display:"flex", flexWrap:"wrap", gap:12, justifyContent:"center", animation:"fadeUp .5s .32s ease both" }}>
      <button data-cal-link="wikolabs-team/30min" data-cal-namespace="wk30min" data-cal-config='{"layout":"month_view"}' className="wk-btn"
        style={{ background:pal.accent, color:isDark?"#04080F":"#FFFFFF", border:"none", borderRadius:10, padding:"14px 28px", fontWeight:700, fontSize:15, cursor:"pointer", display:"inline-flex", alignItems:"center", gap:8, fontFamily:"inherit" }}>
        📅 {t.ctaPrimary}
      </button>
      <a href={waLink} target="_blank" rel="noopener noreferrer" className="wk-btn-wa"
        style={{ background:"#25d366", color:"#FFFFFF", borderRadius:10, padding:"14px 28px", fontWeight:700, fontSize:15, textDecoration:"none", display:"inline-flex", alignItems:"center", gap:8 }}>
        💬 {t.ctaWhatsApp}
      </a>
      <a href="/demo" className="wk-btn-demo" data-orig-btn="1"
        style={{ background:"transparent", color:pal.txt2, border:`1px solid ${pal.border}`, borderRadius:10, padding:"14px 28px", fontWeight:700, fontSize:15, display:"inline-flex", alignItems:"center", gap:10, fontFamily:"inherit", position:"relative" }}>
        ✨ {t.ctaDemo}
      </a>
    </div>
  );
}
