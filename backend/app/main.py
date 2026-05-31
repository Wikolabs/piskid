"""piskid demo backend - production-ready POC.

In production: this service would route the question through a RAG over
Malagasy legal codes and official circulars, log consultations and let
the user escalate to a partnered lawyer. For the demo: the LLM produces
a structured answer with invented but realistic article references.
"""
from datetime import datetime, timezone
from typing import Literal

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from .llm import chat, is_configured

app = FastAPI(
    title="piskid Demo Backend",
    description="POC backend - Groq/Gemini LLM. No third-party connections.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

# -----------------------------------------------------------------------------
# Prompts
# -----------------------------------------------------------------------------
SYSTEM_PROMPT_FR = """Tu es piskid, un assistant IA juridique pour les particuliers a Madagascar. Tu reponds en francais a une question de droit usuel (logement, famille, travail, voisinage, dette, succession). Tu DOIS donner une reponse claire, structuree, basee sur le droit malgache (code civil, code du travail, loi 99-028 du bail urbain, etc.). Tu inventes des references d'articles realistes pour la demo.

Format de sortie exact en MARKDOWN :
**⚖️ Reponse directe**
- 2-3 phrases qui repondent a la question, sans jargon excessif.

**📜 References juridiques (style Madagascar)**
- 2-3 articles du code applicable (ex: "Loi 99-028 du 03/02/2000 - bail urbain, article 12", "Code du travail malgache, article 76", "Code civil, livre III, article 1101")

**🎯 Etapes pratiques**
- 3-4 puces : qui contacter (CITE, fokontany, MFTS, conseil de l'ordre), documents a preparer, delais, coute approximatif si applicable

**⚠️ Limites**
- 1 ligne : quand voir un avocat (Ordre des Avocats Antananarivo).

Maximum 320 mots. Ton bienveillant, accessible. Inclure references locales reelles (fokontany, CITE, MFTS, OAM)."""

SYSTEM_PROMPT_EN = """You are piskid, an AI legal assistant for individuals in Madagascar. You answer in English (or French if user asks) a common-law question (housing, family, labor, neighborhood, debt, succession). You MUST give a clear, structured answer based on Malagasy law (civil code, labor code, law 99-028 on urban lease, etc.). You invent realistic article references for the demo.

Exact MARKDOWN output format:
**⚖️ Direct answer**
- 2-3 sentences answering the question, without excessive jargon.

**📜 Legal references (Madagascar)**
- 2-3 applicable code articles (e.g. "Law 99-028 of 03/02/2000 - urban lease, article 12", "Malagasy Labor Code, article 76")

**🎯 Practical steps**
- 3-4 bullets: who to contact (CITE, fokontany, MFTS, Bar Association), documents to prepare, deadlines, approximate cost if applicable

**⚠️ Limits**
- 1 line: when to see a lawyer (Antananarivo Bar Association).

Max 320 words. Friendly, accessible tone. Include real local references (fokontany, CITE, MFTS, OAM)."""


# -----------------------------------------------------------------------------
# Models
# -----------------------------------------------------------------------------
class GenerateRequest(BaseModel):
    legal_question: str = Field(..., min_length=1, max_length=700)
    topic: str = Field("", max_length=40)
    lang: Literal["fr", "en"] = "fr"


class GenerateResponse(BaseModel):
    output: str
    model: str
    generated_at: str
    static_mode: bool = False


# -----------------------------------------------------------------------------
# Routes
# -----------------------------------------------------------------------------
@app.get("/health")
def health():
    return {
        "status": "ok",
        "service": "piskid-lp-backend",
        "llm_configured": is_configured(),
    }


@app.post("/process", response_model=GenerateResponse)
async def process(req: GenerateRequest) -> GenerateResponse:
    question = (req.legal_question or "").strip()[:700]
    topic = (req.topic or "").strip()[:40]
    if not question:
        raise HTTPException(status_code=400, detail="empty_question")

    now_iso = datetime.now(timezone.utc).isoformat()
    user_msg = (
        f'Domaine : "{topic or "droit usuel"}". Question : "{question}". Reponds selon le format demande.'
        if req.lang == "fr"
        else f'Topic: "{topic or "common law"}". Question: "{question}". Answer in the required format.'
    )

    if not is_configured():
        return GenerateResponse(
            output=_build_mock_brief(topic, question, req.lang),
            model="static-mock",
            generated_at=now_iso,
            static_mode=True,
        )

    try:
        text, model = await chat(
            [
                {"role": "system", "content": SYSTEM_PROMPT_FR if req.lang == "fr" else SYSTEM_PROMPT_EN},
                {"role": "user", "content": user_msg},
            ],
            max_tokens=900,
        )
    except Exception:
        return GenerateResponse(
            output=_build_mock_brief(topic, question, req.lang),
            model="static-mock",
            generated_at=now_iso,
            static_mode=True,
        )

    return GenerateResponse(output=text, model=model, generated_at=now_iso)


# -----------------------------------------------------------------------------
# Mock brief (used when no LLM key configured)
# -----------------------------------------------------------------------------
def _build_mock_brief(topic: str, question: str, lang: str) -> str:
    q_short = question[:80]
    if lang == "en":
        return (
            f"**⚖️ Direct answer**\n"
            f'- On your question ({topic or "common law"}: "{q_short}..."), Malagasy law provides a clear framework. The procedure is open to you without lawyer in the first stage.\n\n'
            f"**📜 Legal references (Madagascar)**\n"
            f"- Law 99-028 of 03/02/2000 on urban lease, article 12\n"
            f"- Malagasy Civil Code, book III, article 1101\n"
            f"- MFTS Circular 2023-04 on family conciliation\n\n"
            f"**🎯 Practical steps**\n"
            f"- Get a fokontany certificate confirming the situation (free, 24h)\n"
            f"- File a complaint at CITE Antananarivo or local MFTS office\n"
            f"- Prepare ID + birth certificate + last 3 receipts (or relevant docs)\n"
            f"- Deadline: response usually <30 days, formal hearing 2-3 months\n\n"
            f"**⚠️ Limits**\n"
            f"- For amounts >5 million MGA or appeal, contact the Antananarivo Bar Association (OAM)."
        )
    return (
        f"**⚖️ Reponse directe**\n"
        f'- Sur votre question ({topic or "droit usuel"} : "{q_short}..."), la loi malgache prevoit un cadre clair. La procedure vous est ouverte sans avocat en 1ere instance.\n\n'
        f"**📜 References juridiques (style Madagascar)**\n"
        f"- Loi 99-028 du 03/02/2000 sur le bail urbain, article 12\n"
        f"- Code civil malgache, livre III, article 1101\n"
        f"- Circulaire MFTS 2023-04 sur la conciliation familiale\n\n"
        f"**🎯 Etapes pratiques**\n"
        f"- Obtenir certificat fokontany attestant la situation (gratuit, 24h)\n"
        f"- Deposer plainte au CITE Antananarivo ou bureau MFTS local\n"
        f"- Preparer CIN + acte de naissance + 3 derniers recus (ou docs relevants)\n"
        f"- Delais : reponse habituellement <30 jours, audience formelle 2-3 mois\n\n"
        f"**⚠️ Limites**\n"
        f"- Pour montants >5 millions MGA ou appel, contacter l'Ordre des Avocats Antananarivo (OAM)."
    )
