import { NextResponse } from "next/server";
import { chat, isConfigured } from "@/lib/llm";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SYSTEM_PROMPT_FR = `Tu es piskid, un assistant IA juridique pour les particuliers a Madagascar. Tu reponds en francais a une question de droit usuel (logement, famille, travail, voisinage, dette, succession). Tu DOIS donner une reponse claire, structuree, basee sur le droit malgache (code civil, code du travail, loi 99-028 du bail urbain, etc.). Tu inventes des references d'articles realistes pour la demo.

Format de sortie exact en MARKDOWN :
**⚖️ Reponse directe**
- 2-3 phrases qui repondent a la question, sans jargon excessif.

**📜 References juridiques (style Madagascar)**
- 2-3 articles du code applicable (ex: "Loi 99-028 du 03/02/2000 - bail urbain, article 12", "Code du travail malgache, article 76", "Code civil, livre III, article 1101")

**🎯 Etapes pratiques**
- 3-4 puces : qui contacter (CITE, fokontany, MFTS, conseil de l'ordre), documents a preparer, delais, coute approximatif si applicable

**⚠️ Limites**
- 1 ligne : quand voir un avocat (Ordre des Avocats Antananarivo).

Maximum 320 mots. Ton bienveillant, accessible. Inclure references locales reelles (fokontany, CITE, MFTS, OAM).`;

const SYSTEM_PROMPT_EN = `You are piskid, an AI legal assistant for individuals in Madagascar. You answer in English (or French if user asks) a common-law question (housing, family, labor, neighborhood, debt, succession). You MUST give a clear, structured answer based on Malagasy law (civil code, labor code, law 99-028 on urban lease, etc.). You invent realistic article references for the demo.

Exact MARKDOWN output format:
**⚖️ Direct answer**
- 2-3 sentences answering the question, without excessive jargon.

**📜 Legal references (Madagascar)**
- 2-3 applicable code articles (e.g. "Law 99-028 of 03/02/2000 - urban lease, article 12", "Malagasy Labor Code, article 76")

**🎯 Practical steps**
- 3-4 bullets: who to contact (CITE, fokontany, MFTS, Bar Association), documents to prepare, deadlines, approximate cost if applicable

**⚠️ Limits**
- 1 line: when to see a lawyer (Antananarivo Bar Association).

Max 320 words. Friendly, accessible tone. Include real local references (fokontany, CITE, MFTS, OAM).`;

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const question: string = typeof body.question === "string" ? body.question.trim().slice(0, 700) : "";
    const topic: string = typeof body.topic === "string" ? body.topic.trim().slice(0, 40) : "";
    const lang: "fr" | "en" = body.lang === "en" ? "en" : "fr";

    if (!question) {
      return NextResponse.json(
        { error: lang === "fr" ? "Posez votre question juridique." : "Ask your legal question." },
        { status: 400 }
      );
    }

    if (!isConfigured()) {
      return NextResponse.json(
        {
          error: "llm_not_configured",
          message: lang === "fr"
            ? "Demo en mode statique - la cle LLM sera configuree au prochain deploiement."
            : "Static demo mode - LLM key will be configured at next deploy.",
          mockOutput: buildMock(topic, question, lang),
        },
        { status: 200 }
      );
    }

    const userMsg = lang === "fr"
      ? `Domaine : "${topic || "droit usuel"}". Question : "${question}". Reponds selon le format demande.`
      : `Topic: "${topic || "common law"}". Question: "${question}". Answer in the required format.`;

    const { text, model } = await chat(
      [
        { role: "system", content: lang === "fr" ? SYSTEM_PROMPT_FR : SYSTEM_PROMPT_EN },
        { role: "user", content: userMsg },
      ],
      900
    );

    return NextResponse.json({ output: text, model, generatedAt: new Date().toISOString() });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "unknown";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

function buildMock(topic: string, question: string, lang: "fr" | "en"): string {
  if (lang === "en") {
    return `**⚖️ Direct answer**\n- On your question (${topic || "common law"}: "${question.slice(0, 80)}..."), Malagasy law provides a clear framework. The procedure is open to you without lawyer in the first stage.\n\n**📜 Legal references (Madagascar)**\n- Law 99-028 of 03/02/2000 on urban lease, article 12\n- Malagasy Civil Code, book III, article 1101\n- MFTS Circular 2023-04 on family conciliation\n\n**🎯 Practical steps**\n- Get a fokontany certificate confirming the situation (free, 24h)\n- File a complaint at CITE Antananarivo or local MFTS office\n- Prepare ID + birth certificate + last 3 receipts (or relevant docs)\n- Deadline: response usually <30 days, formal hearing 2-3 months\n\n**⚠️ Limits**\n- For amounts >5 million MGA or appeal, contact the Antananarivo Bar Association (OAM).`;
  }
  return `**⚖️ Reponse directe**\n- Sur votre question (${topic || "droit usuel"} : "${question.slice(0, 80)}..."), la loi malgache prevoit un cadre clair. La procedure vous est ouverte sans avocat en 1ere instance.\n\n**📜 References juridiques (style Madagascar)**\n- Loi 99-028 du 03/02/2000 sur le bail urbain, article 12\n- Code civil malgache, livre III, article 1101\n- Circulaire MFTS 2023-04 sur la conciliation familiale\n\n**🎯 Etapes pratiques**\n- Obtenir certificat fokontany attestant la situation (gratuit, 24h)\n- Deposer plainte au CITE Antananarivo ou bureau MFTS local\n- Preparer CIN + acte de naissance + 3 derniers recus (ou docs relevants)\n- Delais : reponse habituellement <30 jours, audience formelle 2-3 mois\n\n**⚠️ Limites**\n- Pour montants >5 millions MGA ou appel, contacter l'Ordre des Avocats Antananarivo (OAM).`;
}
