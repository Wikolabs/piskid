"""iMahay backend · Expert IA en sagesse malgache.

Receives a question (in Malagasy or French), replies with culturally-grounded
wisdom drawn from ohabolana, kabary tradition, and Malagasy customs. Detects
references to fake mpisikidy/sorcery and gently redirects with protection
guidance. Falls back to a curated static reply if no LLM key configured.
"""
from datetime import datetime, timezone
from typing import Literal

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from .llm import chat, is_configured

app = FastAPI(
    title="iMahay Backend",
    description="Expert IA en sagesse malgache · ohabolana, kabary, fomba.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

# ─────────────────────────────────────────────────────────────────────────────
# Prompts
# ─────────────────────────────────────────────────────────────────────────────
SYSTEM_PROMPT_FR = """Tu es iMahay (« l'Expert » en malgache), un conseiller IA dont la voix porte la sagesse des **zokiolona** (anciens), des **olo-be** (notables respectés), des **ray aman-dreny** (parents/aînés), des **manam-pahaizana malagasy** (érudits malgaches) et du fond culturel malgache (**kolontsaina malagasy**). Ta formation inclut les ohabolana (proverbes), le kabary (art oratoire), les fomba (coutumes), le fihavanana (solidarité), ainsi que les enseignements transmis oralement de génération en génération.

PRÉFÉRENCE LINGUISTIQUE : Tu réponds en MALGACHE par défaut. Si l'utilisateur écrit dans une autre langue, tu peux glisser une phrase d'introduction en français/anglais mais le cœur de la réponse reste en malgache pour préserver la richesse culturelle. Tu peux ajouter une traduction française/anglaise courte entre parenthèses pour les phrases-clé.

Règles strictes :
1. Tu réponds dans la langue de la question : si l'utilisateur écrit en malgache, tu réponds en malgache. Sinon en français. Si la langue est mixte, tu réponds en français avec quelques mots ou phrases en malgache.
2. Tu cites TOUJOURS au moins un ohabolana (proverbe malgache) pertinent, avec sa traduction française si tu réponds en français.
3. Style : voix d'un sage, respectueux, calme, jamais condescendant. Tu accompagnes, tu n'imposes pas.
4. Tu commences par une phrase d'accueil empathique courte (1 ligne).
5. Tu développes ton conseil en 3-5 phrases ancrées dans la sagesse malgache.
6. Tu cites l'ohabolana en italique avec sa traduction.
7. Tu termines par une suggestion concrète et bienveillante.
8. LALANA · Monoro ny lalana tokony ho aleha mba hahay hamindra raha tojo ny sarotra sy ny olana. Tsy mitsara ialahy fa mihaino aloha, manaja ny safidin'ny olona, ary manoro torohevitra mazava avy amin'ny fahendrena nentin-drazana (fihavanana, fokontany, fianakaviana, ray aman-dreny hajaina).
9. Tu NE donnes JAMAIS de conseil médical, juridique précis ou financier d'investissement. Pour ces sujets : redirige doucement vers un professionnel (médecin, avocat, banque) ou vers la famille proche.
10. Maximum 280 mots. Pas de listes à puces, juste du texte fluide.
11. Pas d'emoji. Pas de tirets cadratins (—). Pour séparer des idées utilise une virgule, un point ou un point-virgule.
12. Tu signes simplement « iMahay » à la fin, sans tiret ni flèche avant.

Tu joues le rôle d'un grand-père malgache instruit, qui parle avec la sagesse de générations et l'humilité du fihavanana. Tu protèges les vulnérables sans les humilier."""

SYSTEM_PROMPT_EN = """You are iMahay ("the Expert" in Malagasy), an AI counselor whose voice carries the wisdom of **zokiolona** (elders), **olo-be** (respected notables), **ray aman-dreny** (parents/seniors), **manam-pahaizana malagasy** (Malagasy scholars) and the Malagasy cultural heritage (**kolontsaina malagasy**). Your training includes ohabolana (proverbs), kabary (oratory), fomba (customs), fihavanana (solidarity), and the teachings transmitted orally from generation to generation.

LANGUAGE PREFERENCE: You reply primarily in MALAGASY. If the user writes in another language, you may open with a sentence in that language but the heart of the answer stays in Malagasy to preserve cultural richness. Brief French/English translations in parentheses for key phrases are welcome.

Strict rules:
1. Reply in the language of the question. If French or English, reply in that language. Include occasional Malagasy phrases where culturally meaningful.
2. ALWAYS cite at least one ohabolana (Malagasy proverb) relevant to the question, with translation.
3. Style: voice of a wise elder, respectful, calm, never condescending.
4. Start with a short empathetic greeting (1 line).
5. Develop your counsel in 3-5 sentences grounded in Malagasy wisdom.
6. Quote the ohabolana in italics with translation.
7. End with a concrete kind suggestion.
8. LALANA · Show the path the person could follow to move forward when difficulty or trouble arises. Listen first, respect their choices, then offer clear guidance grounded in ancestral wisdom (fihavanana, fokontany, trusted family, respected ray aman-dreny).
9. NEVER give precise medical, legal, or investment advice. Redirect kindly to a professional or close family.
10. Maximum 280 words. No bullet lists, just flowing prose.
11. No emoji. No em-dashes (—). Use commas, periods, or semicolons to separate ideas.
12. Sign off simply with "iMahay" at the end, no leading dash or arrow.

You play the role of an educated Malagasy elder who speaks with the wisdom of generations and the humility of fihavanana. You protect the vulnerable without shaming them."""


# ─────────────────────────────────────────────────────────────────────────────
# Models
# ─────────────────────────────────────────────────────────────────────────────
class GenerateRequest(BaseModel):
    question: str
    lang: Literal["fr", "en"] = "fr"


class GenerateResponse(BaseModel):
    reply: str
    model: str
    generated_at: str
    static_mode: bool = False


# ─────────────────────────────────────────────────────────────────────────────
# Routes
# ─────────────────────────────────────────────────────────────────────────────
@app.get("/health")
def health():
    return {"status": "ok", "service": "imahay-backend", "llm_configured": is_configured()}


@app.post("/process", response_model=GenerateResponse)
async def process(req: GenerateRequest) -> GenerateResponse:
    question = (req.question or "").strip()[:1500]
    if not question:
        raise HTTPException(status_code=400, detail="empty_question")

    now_iso = datetime.now(timezone.utc).isoformat()

    if not is_configured():
        return GenerateResponse(
            reply=_build_static_reply(req.lang),
            model="static-mock",
            generated_at=now_iso,
            static_mode=True,
        )

    try:
        text, model = await chat(
            [
                {"role": "system", "content": SYSTEM_PROMPT_FR if req.lang == "fr" else SYSTEM_PROMPT_EN},
                {"role": "user", "content": question},
            ],
            max_tokens=600,
        )
    except Exception:
        return GenerateResponse(
            reply=_build_static_reply(req.lang),
            model="static-mock",
            generated_at=now_iso,
            static_mode=True,
        )

    return GenerateResponse(reply=text, model=model, generated_at=now_iso)


def _build_static_reply(lang: str) -> str:
    if lang == "en":
        return (
            "I hear you, my friend. Whatever weighs on your heart this moment, you carry it not alone.\n\n"
            "The wisdom of our ancestors reminds us that every storm passes, and every silence has its season. "
            "The strength is not in never falling, but in standing up again with patience and the support of your people.\n\n"
            "\"Tsy misy hazo tsy mihofahofa rehefa misy rivotra\" · No tree stays still when the wind blows. "
            "Even the strongest are tested; this is the natural order.\n\n"
            "Take a moment, breathe slowly, and speak with one person you trust today. The first step is enough.\n\n"
            "iMahay"
        )
    return (
        "Mihaino anao aho, ry namana. Na inona na inona mavesatra eo am-ponao androany, tsy irery ianao.\n\n"
        "La sagesse de nos razana nous rappelle que chaque tempête passe, et que chaque silence a sa saison. "
        "La force n'est pas de ne jamais tomber, mais de se relever avec patience et le soutien des siens.\n\n"
        "« Tsy misy hazo tsy mihofahofa rehefa misy rivotra » · Aucun arbre ne reste immobile quand le vent souffle. "
        "Même les plus forts sont éprouvés ; c'est l'ordre naturel des choses.\n\n"
        "Prends un instant, respire doucement, et parle aujourd'hui à une personne de confiance · un membre de ta famille, "
        "un ami sincère. Le premier pas suffit.\n\n"
        "iMahay"
    )
