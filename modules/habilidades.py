# ==========================================================
#  ATS Advisor - Proyecto de Fin de Máster (TFM)
#  Universidad Internacional de Valencia (VIU)
#  Autor: Carlos Emilio López  (clopezci@hotmail.com)
#  Año: 2025
# ----------------------------------------------------------
#  Descripción:
#  ATS Advisor es una herramienta educativa de código abierto
#  diseñada como proyecto académico de fin de máster. Evalúa
#  la compatibilidad entre una hoja de vida (CV) y una oferta
#  laboral, simulando el funcionamiento de un sistema ATS.
#
#  Propiedad Intelectual:
#  © 2025 Universidad Internacional de Valencia (VIU)
#  © 2025 Carlos Emilio López
#  Licencia de uso: Código abierto con fines educativos,
#  investigación, y mejora libre bajo reconocimiento de autoría.
#
#  Descargo de responsabilidad:
#  Este software se proporciona "tal cual", sin garantía de
#  precisión o adecuación comercial. El autor y la universidad
#  no se hacen responsables del uso indebido ni de decisiones
#  tomadas con base en sus resultados. Los usuarios pueden
#  modificar y adaptar el código respetando la autoría original.
#
#  Contacto:
#  Carlos Emilio López - clopezci@hotmail.com
# ==========================================================


# ==========================
# habilidades.py - Detección y aprendizaje de skills
# (mejoras de robustez + detector de nuevas habilidades corregido)
# ==========================
import os
import json
import re
from math import exp
import spacy

# ----------------------------
# Carga robusta de spaCy (fallbacks)
# ----------------------------
try:
    nlp = spacy.load("es_core_news_lg")
except Exception:
    try:
        nlp = spacy.load("es_core_news_md")
        print("ℹ️ [habilidades] Usando es_core_news_md (fallback).")
    except Exception:
        nlp = spacy.load("es_core_news_sm")
        print("ℹ️ [habilidades] Usando es_core_news_sm (fallback sin vectores).")

# ----------------------------
# Stopwords locales
# ----------------------------
STOPWORDS = set([
    "de","la","que","el","en","y","a","los","del","se","las","por","un","para","con","no","una",
    "su","al","es","lo","como","más","pero","sus","le","ya","o","este","sí","porque","esta",
    "entre","cuando","muy","sin","sobre","también","me","hasta","hay","donde","quien","desde",
    "todo","nos","durante","todos","uno","les","ni","cada","algo","otro","tanto","poco","mucho",
    "algún","alguna","cualquier","cualquiera","quienes","cuál","cuáles","cuyos","cuyas","tenido",
    "tiene","tenía","tenemos","tuvo","tuvieron","tener","haya","hubiera","fuera","ser","soy","era",
    "eres","sea","fui","fue","está","estaba","estuvo","estuve","estar","acerca","estamos","esa",
    "esas","eso","esos","mi","mis","tus","sus","nuestro","nuestra","nuestras","vosotros","vosotras",
    "ellos","ellas","ustedes","usted","estos","estas","lo"
])

# ----------------------------
# Listas semilla (depuradas y extendidas)
# ----------------------------
tech_skills = [
    "python","javascript","java","sql","html","css","nodejs","react","aws","azure","gcp",
    "docker","kubernetes","git","linux","cloud","big data","etl","machine learning","devops",
    "iot","tensorflow","pandas","power bi","tableau","sap","ciberseguridad","arquitectura de datos",
    "nube","transformación digital","fintech","benchmarking","metodologías ágiles",
    "gobernanza de datos","gobierno de ti","estrategia tecnológica","planificación estratégica",
    "orquestación de proyectos",

    # Operaciones / negocio
    "gestion operativa","cumplimiento operativo","tasa de conversion","margen operativo",
    "economia unitaria","unit economics","kpi","okr","sla","nps","crm","salesforce",
    "hubspot","looker studio","data studio","google analytics",

    # Marketing/crecimiento
    "seo","sem","marketing digital","redes sociales","publicidad online","email marketing",
    "automatización de marketing","content marketing","gestión de campañas","análisis web",
    "optimización de conversiones","growth hacking","e-commerce","google ads","facebook ads",
    "linkedin ads","programmatic advertising","data driven marketing",

    # Salud digital / hospitalario
    "salud digital","informatica medica","informática médica","gestion clinica","gestión clínica",
    "interoperabilidad","telemedicina","historia clinica electronica","analitica en salud","analítica en salud",
    "seguridad de la informacion","seguridad de la información","proteccion de datos","protección de datos"
]

soft_skills = [
    "liderazgo","comunicacion","trabajo en equipo","resolucion de problemas","adaptabilidad",
    "creatividad","pensamiento critico","gestion del tiempo","empatia","colaboracion",
    "organizacion","negociacion","iniciativa","gestion del cambio","influencia",
    "orientacion a resultados","toma de decisiones","gestion de conflictos","motivacion",
    "planificacion","vision estrategica","pensamiento analitico","inteligencia emocional",
    "resiliencia","gestion de proyectos","orientacion al cliente","habilidades interpersonales",
    "gestion del estrés","ética profesional","mentoria","coaching","networking",
    "habilidades de presentacion","gestion de equipos","facilitacion","resolucion de conflictos",
    "orientacion a objetivos","gestion del conocimiento","cultura organizacional",
    "desarrollo de talento","gestion del desempeño","evaluacion de riesgos",
    "gestion de la innovacion","liderazgo de equipos","comunicacion efectiva",
    "negociacion avanzada","gestion del cambio organizacional","pensamiento estrategico"
]

exp_terms = [
    "liderar","coordinar","supervisar","gestionar","desarrollar","ejecutar","organizar","planificar",
    "estrategia","transformacion","analizar","evaluar","controlar","monitorear","optimizar",
    "formacion","coaching","administrar","orquestar","modelar","implementacion","gobernanza",
    "planificacion estrategica","gestion de proyectos","gestion de portafolio","innovacion tecnologica",
    "seguridad informatica","ciberseguridad","analitica de datos","inteligencia de negocios","big data",
    "computacion en la nube","transformacion digital","metodologias agiles","scrum","kanban","lean",
    "six sigma","gestion del cambio","gestion de riesgos","gestion de la calidad","mejora continua",
    "gestion del talento","desarrollo organizacional","gestion del conocimiento","gestion del desempeño",
    "evaluacion de proyectos","gestion financiera","analisis financiero","planificacion financiera",
    "control presupuestario","optimización de costos",

    # Operaciones rol
    "reclutar","formar","entrenar","asegurar","garantizar","consolidar","reportar",
    "supervisar ventas","mantener autonomia","tomar decisiones","resolver conflictos",
    "gestionar equipos","alcanzar objetivos","cumplir metas","liderar cambios","fomentar innovacion",
    "impulsar crecimiento"
]

# ----------------------------
# Diccionario de lemas
# ----------------------------
LEMA_A_PALABRA = {}

# --- Rutas amigables para ejecutable (PyInstaller) y desarrollo ---
def _user_data_dir():

    try:
        import sys
        if getattr(sys, 'frozen', False):
            base = os.path.join(os.environ.get("APPDATA", os.path.expanduser("~")), "ATS-Advisor")
            os.makedirs(base, exist_ok=True)
            return base
    except Exception:
        pass
    return os.path.dirname(__file__)

CUSTOM_SKILLS_FILE = os.path.join(_user_data_dir(), "skills_custom.json")
NOISE_DB_FILE = os.path.join(_user_data_dir(), "noise_terms.json")


def _dedupe(seq):
    return list(dict.fromkeys(seq))

def construir_diccionario_lemas():
    global tech_skills, soft_skills, exp_terms

    if os.path.exists(CUSTOM_SKILLS_FILE):
        with open(CUSTOM_SKILLS_FILE, "r", encoding="utf-8") as f:
            try:
                loaded = json.load(f)
            except json.JSONDecodeError:
                loaded = {"tecnicas": [], "blandas": [], "experiencia": [], "pendiente": []}
                print("⚠️ [habilidades] skills_custom.json corrupto. Reinicializado.")

        # Migración lista → diccionario (si aplica)
        if isinstance(loaded, list):
            loaded = {"tecnicas": [s.lower().strip() for s in loaded if isinstance(s, str)],
                      "blandas": [], "experiencia": [], "pendiente": []}
            print("⚠️ [habilidades] Migración automática: lista → diccionario.")

        # Evitar duplicados entre listas
        for key in ["tecnicas", "blandas", "experiencia", "pendiente"]:
            if isinstance(loaded.get(key), list):
                loaded[key] = sorted(set(s.strip().lower() for s in loaded[key] if s.strip()))

        tech_skills.extend(loaded.get("tecnicas", []))
        soft_skills.extend(loaded.get("blandas", []))
        exp_terms.extend(loaded.get("experiencia", []))

        with open(CUSTOM_SKILLS_FILE, "w", encoding="utf-8") as fw:
            json.dump(loaded, fw, ensure_ascii=False, indent=2)

        print("📥 [habilidades] Skills personalizadas cargadas.")

    tech_skills[:] = _dedupe(tech_skills)
    soft_skills[:] = _dedupe(soft_skills)
    exp_terms[:]   = _dedupe(exp_terms)

    LEMA_A_PALABRA.clear()
    all_terms = tech_skills + soft_skills + exp_terms
    if all_terms:
        doc = nlp(". ".join(all_terms))
        for token in doc:
            if token.is_alpha:
                lema = token.lemma_.lower()
                palabra = token.text.lower()
                LEMA_A_PALABRA.setdefault(lema, set()).add(palabra)
    for term in all_terms:
        t = term.strip().lower()
        if t:
            LEMA_A_PALABRA.setdefault(t, set()).add(t)

# ============================
# Ruido dinámico (autoaprendizaje)
# ============================
# NOISE_DB_FILE = os.path.join(os.path.dirname(__file__), "noise_terms.json")

def _load_noise_db():
    if os.path.exists(NOISE_DB_FILE):
        try:
            with open(NOISE_DB_FILE, "r", encoding="utf-8") as f:
                data = json.load(f)
                if isinstance(data, dict):
                    # normalizar a conteos int
                    return {k: int(v) for k, v in data.items()}
        except Exception:
            pass
    return {}

def _save_noise_db(data: dict):
    try:
        with open(NOISE_DB_FILE, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
    except Exception:
        pass

def _noise_mark(term: str, inc: int = 1):
    term = (term or "").strip().lower()
    if not term:
        return
    data = _load_noise_db()
    data[term] = int(data.get(term, 0)) + inc
    _save_noise_db(data)

def dynamic_exclude_terms(threshold: int = 4) -> set:
    """Devuelve términos que han aparecido como 'ruido' al menos 'threshold' veces."""
    data = _load_noise_db()
    return {t for t, c in data.items() if int(c) >= int(threshold)}

# ===== API pública para gestionar ruido desde el menú =====
NOISE_THRESHOLD = 4  # umbral por defecto

def get_noise_threshold() -> int:
    return int(NOISE_THRESHOLD)

def set_noise_threshold(n: int):
    global NOISE_THRESHOLD
    try:
        NOISE_THRESHOLD = max(1, int(n))
    except Exception:
        NOISE_THRESHOLD = 4

def list_noise_terms(top_n: int = 50):
    """Devuelve lista [(termino, conteo), ...] ordenada por conteo desc."""
    data = _load_noise_db()
    orden = sorted(data.items(), key=lambda x: x[1], reverse=True)
    return orden[:max(1, int(top_n))]

""" se inhabilita para activar la opcion nueva en empaquetado ejecutable
def forget_noise_term(term: str):
    Elimina un término específico del registro de ruido.
    term = (term or "").strip().lower()
    if not term:
        return False
    data = _load_noise_db()
    if term in data:
        del data
        data = _load_noise_db()  # asegurar recarga limpia
        # reescritura sin term
        data = _load_noise_db()
        with open(NOISE_DB_FILE, "r", encoding="utf-8") as f:
            try:
                data = json.load(f)
            except Exception:
                data = {}
        if term in data:
            del data[term]
        _save_noise_db(data)
        return True
    return False
"""

def forget_noise_term(term: str):
    """Elimina un término específico del registro de ruido."""
    term = (term or "").strip().lower()
    if not term:
        return False
    data = _load_noise_db()
    if term in data:
        del data[term]
        _save_noise_db(data)
        return True
    return False


def refresh_exclude_terms():
    """
    Fusiona EXCLUDE_TERMS con los aprendidos dinámicamente según NOISE_THRESHOLD.
    Llamar cuando cambie el umbral o se 'olvide' algún término.
    """
    try:
        learned = dynamic_exclude_terms(threshold=get_noise_threshold())
        EXCLUDE_TERMS.update(learned)
    except Exception:
        pass

# ----------------------------
# Similitud y patrones
# ----------------------------
SIM_THRESHOLD = 0.55

VERBS_PERMITIDOS = {
    "liderar","gestionar","implementar","orquestar","planificar","optimizar",
    "analizar","modelar","supervisar","coordinar","desarrollar","evaluar","monitorear"
}
VERBS_DESCARTADOS = {"ser","estar","tener","hacer","poder","deber","dar","trabajar","apoyar"}

HEAD_NOUNS = {
    "gestion","estrategia","innovacion","proyecto","proyectos","portafolio","arquitectura",
    "analitica","modelo","modelacion","planificacion","gobernanza","gobierno","transformacion",
    "seguridad","ciberseguridad","datos","tecnologia","finanzas","fintech","metodologias","okr",
    "operacion","operaciones","cumplimiento","conversion","margen","servicio","servicios",
    "reclutamiento","formacion","ventas","kpi","sla","nps","economia","economics","partners",
    "equipo","asistencia","puntualidad","crm","clinica","clínica","interoperabilidad","logistica",
    "cadena","suministro","calidad","auditoria","auditoría"
}

GENERIC_NOUNS = {
    "base","clave","nivel","requisitos","persona","empresa","compania","compañia",
    "area","areas","sectores","sector","resultado","experiencia","objetivos",
    "cambio","negocio","vision","visión","direccion","dirección","compañía","retorno",
    "candidato","candidatos","perfil","habilidades","capacidad","capacidades","funcion","función",
    "responsabilidad","responsabilidades","actividad","actividades","tarea","tareas","labor","labores",
    "desempeño","desempeno","rendimiento","potencial","oportunidad","oportunidades","desarrollo",
    "crecimiento","avance","mejora","mejoras","impacto","iniciativa","motivacion","motivación",
    "valores","valor","etica","ética","visionario","visionaria","visionarios","visionarias","lider","líder",
    "lideres","líderes","compromiso","compromisos","desafio","desafío","desafios","desafíos","principales",
    "responsable","responsables"
}
ABSTRACT_TERMS = {
    "conocimiento","control","estrategica","estratégica","proceso","competencia","habilidad",
    "organizacion","entorno","cultura","flexibilidad","sesgo","sesgos","tecnico","técnico","técnicos",
    "área","áreas","rol","roles","potencial","potenciales","cualidad","cualidades","virtud","virtudes",
    "dote","dotes","talento","talentos","carrera","carreras","trayectoria","trayectorias","vocacion",
    "vocación","vocaciones","pasion","pasión","pasiones","entusiasmo","entusiasmos"
}

DETERMINERS = {"la","el","los","las","esta","este","estos","estas","una","un"}
PREP_EXCLUDE = {"con","sin","para","por","en","de","del","al","sobre","entre","desde","hacia",
                "hasta","bajo","tras","segun","según","durante","mediante","excepto","salvo","como"}

# Patrones útiles para “X de Y”, “orquestación”, etc.
PATTERNS = [
    re.compile(r"^(gesti[oó]n|an[aá]lisis|implementaci[oó]n|modelaci[oó]n|planificaci[oó]n)\s+de\s+[\w\sáéíóúñü\-]+$"),
    re.compile(r"^planificaci[oó]n estrat[eé]gica$"),
    re.compile(r"^metodolog[ií]as?\s+a[g|j]iles$"),
    re.compile(r"^orquestaci[oó]n(\s+de\s+[\w\sáéíóúñü\-]+)?$"),
    re.compile(r"^(innovaci[oó]n|estrategia)\s+(tecnol[oó]gica)$"),
]

def _build_category_docs():
    corpora = {
        "tecnicas": " ".join(sorted(set(tech_skills))),
        "blandas": " ".join(sorted(set(soft_skills))),
        "experiencia": " ".join(sorted(set(exp_terms))),
    }
    docs = {}
    for k, text in corpora.items():
        d = nlp(text) if text.strip() else None
        docs[k] = d if d is not None and getattr(d, "vector_norm", 0.0) else None
    return docs

_CATEGORY_DOCS = _build_category_docs()

def _similarity_to_corpora(text: str) -> float:
    d = nlp(text)
    if not getattr(d, "vector_norm", 0.0):
        return 0.0
    best = 0.0
    for ref in _CATEGORY_DOCS.values():
        if ref is None or getattr(ref, "vector_norm", 0.0) == 0.0:
            continue
        s = d.similarity(ref)
        if s > best:
            best = s
    return best

def _pasa_filtro_pos(tok) -> bool:
    if not tok.is_alpha:
        return False
    lem = tok.lemma_.lower()
    if lem in STOPWORDS:
        _noise_mark(lem)
        return False
    if tok.pos_ in {"NOUN","PROPN"}:
        _noise_mark(lem)
        return True
    if tok.pos_ == "VERB":
        if lem in VERBS_DESCARTADOS:
            _noise_mark(lem)
            return False
        return lem in VERBS_PERMITIDOS
    return False

def _matches_patterns(frase: str) -> bool:
    for p in PATTERNS:
        if p.match(frase):
            return True
    return False

def _head_is_professional(chunk) -> bool:
    head = chunk.root.lemma_.lower()
    return head in HEAD_NOUNS

def _is_generic_noun(word: str) -> bool:
    return word in GENERIC_NOUNS

def _clean_chunk_text(txt: str) -> str:
    parts = txt.strip().lower().split()
    while parts and parts[0] in DETERMINERS:
        parts = parts[1:]
    return " ".join(parts)

def _skillness(frase_o_lemma: str) -> float:
    txt = _clean_chunk_text((frase_o_lemma or "").strip().lower())

    if txt in {"cumplimiento","operacion","operaciones","gestion","servicio","servicios"}:
        return 0.0
    if not txt:
        return 0.0
    for pfx in PREP_EXCLUDE:
        if txt.startswith(pfx + " "):
            if not _matches_patterns(txt):
                return 0.0
    doc = nlp(txt)
    if not doc:
        return 0.0

    sim = _similarity_to_corpora(txt)
    is_chunk = 1.0 if len(txt.split()) > 1 else 0.0
    pat = 1.0 if _matches_patterns(txt) else 0.0

    head_bonus = 0.0
    chunks = list(doc.noun_chunks)
    if chunks:
        for ch in chunks:
            if _head_is_professional(ch):
                head_bonus = 1.0
                break

    generic_penalty = 0.0
    for w in doc:
        wl = w.lemma_.lower()
        if w.pos_ == "NOUN":
            if _is_generic_noun(wl) or wl in ABSTRACT_TERMS:
                generic_penalty += 1.0

    score_raw = (1.4 * sim) + (0.6 * is_chunk) + (0.9 * pat) + (0.6 * head_bonus) - (1.2 * generic_penalty)
    return 1.0 / (1.0 + exp(-score_raw))

# ----------------------------
# Autoaprendizaje (guardar skills)
# ----------------------------
def guardar_skills_custom(nuevas_skills):
    SCHEMA_KEYS = ["tecnicas","blandas","experiencia","pendiente"]

    if os.path.exists(CUSTOM_SKILLS_FILE):
        with open(CUSTOM_SKILLS_FILE, "r", encoding="utf-8") as f:
            try:
                loaded = json.load(f)
            except json.JSONDecodeError:
                loaded = {k: [] for k in SCHEMA_KEYS}
                print("⚠️ [habilidades] skills_custom.json corrupto. Reinicializado.")
    else:
        loaded = {k: [] for k in SCHEMA_KEYS}

    if isinstance(loaded, list):
        data = {k: [] for k in SCHEMA_KEYS}
        data["tecnicas"] = [s.lower().strip() for s in loaded if isinstance(s, str)]
        print("⚠️ [habilidades] Migración automática: lista → diccionario.")
    else:
        data = {k: loaded.get(k, []) for k in SCHEMA_KEYS}

    from modules.analisis_basico import categorizar_texto, normalizar_para_nlp

    for skill in nuevas_skills:
        skill_norm = normalizar_para_nlp(skill).lower().strip()
        if not skill_norm:
            continue
        if len(skill_norm.split()) > 6:
            continue
        if _skillness(skill_norm) < SIM_THRESHOLD:
            continue

        # Política conservadora: todo va a "pendiente"
        if skill_norm not in data["pendiente"]:
            data["pendiente"].append(skill_norm)

        # Intento de clasificación para apoyar revisión posterior
        cats = categorizar_texto(skill_norm)
        asignada = False
        for cat, valores in cats.items():
            if valores:
                if skill_norm not in data[cat]:
                    data[cat].append(skill_norm)
                asignada = True
                break
        if not asignada:
            if skill_norm not in data["pendiente"]:
                data["pendiente"].append(skill_norm)

    with open(CUSTOM_SKILLS_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    global _CATEGORY_DOCS
    _CATEGORY_DOCS = _build_category_docs()

    print("💾 [habilidades] Skills nuevas (aprendizaje) guardadas y listas para próximos análisis.")

# ----------------------------
# Clasificar una skill por similitud
# ----------------------------
def clasificar_skill(skill):
    doc_skill = nlp(skill)
    if not getattr(doc_skill, "vector_norm", 0.0):
        return "tecnicas"
    categorias = {
        "tecnicas": " ".join(sorted(set(tech_skills))),
        "blandas": " ".join(sorted(set(soft_skills))),
        "experiencia": " ".join(sorted(set(exp_terms))),
    }
    mejor_cat, mejor_score = None, 0.0
    for cat, corpus in categorias.items():
        if not corpus.strip():
            continue
        doc_lista = nlp(corpus)
        if not getattr(doc_lista, "vector_norm", 0.0):
            continue
        s = doc_skill.similarity(doc_lista)
        if s > mejor_score:
            mejor_score, mejor_cat = s, cat
    return mejor_cat or "tecnicas"

# ----------------------------
# Detección de nuevas habilidades (Conceptos relevantes) — Corregido
# ----------------------------

# Ruido típico de ofertas (no son skills)
NOISE_PHRASES = {
    "sobre nosotros","acerca del empleo","acerca de","somos","estamos contratando",
    "híbrido","hibrido","excelentes beneficios","proceso de selección","postúlate","postulate",
    "nuestro equipo","nuestra empresa","nuestras soluciones","zona estratégica","retos estratégicos",
    "limpiafy"  # ejemplo del caso reportado
}

# Palabras comunes de sección/marketing para filtrar
SECTION_PREFIXES = ("sobre ", "acerca ", "estamos ", "somos ", "todo ", "en ", "por ", "del ", "como ")

def _is_noise_phrase_local(frase: str) -> bool:
    f = (frase or "").strip().lower()
    if not f:
        return True
    for p in NOISE_PHRASES:
        if p in f:
            return True
    # dinámicos
    try:
        learned = dynamic_exclude_terms(threshold=4)
        for p in learned:
            if p in f:
                return True
    except Exception:
        pass
    return False

EXCLUDE_TERMS = set({
    # (igual que antes) — términos contextuales, comerciales y geográficos
    "postulate","postúlate","postulacion","postulación","postular","postula",
    "busqueda","búsqueda","buscar","fortalezca","fortalecer","envia","envía",
    "enviar","aplica","aplicar","aplicacion","aplicación","oportunidad","reto",
    "proximo","próximo","gran","equipo","empresa","compañía","compania","laboral",
    "profesional","profesionales","puesto","vacante","vacantes","trabajo","empleo",
    "oferta","ofertas","carrera","carreras","trayectoria","trayectorias","postulantes",
    "postulante","seleccion","selección","contratacion","contratación","contratar",
    "reclutamiento","reclutador","reclutadores","rrhh","rr.hh","humano","humanos",
    "recursos","talento","talentos","humana","humanas","cv","hoja de vida","curriculum",
    "currículum","perfil","perfiles","laborales","profesionalismo","empleabilidad",
    "empleable","empleables","mercado","mercados","laborales","oportunidades",
    "desarrollo","crecimiento","mejora","mejoras","impacto","iniciativa","valores","valor",
    "medellin","medellín","bogota","cali","bucaramanga","barranquilla","cartagena","latam",
    "presencial","hibrido","híbrido","sobre","acerca","nosotros","startup","domesticos",
    "domésticos","servicios","sector","transicion","transición","plataforma","diaria","todo",
    "mes","porcentaje","dias","día","servicio","asistencia","carga","operativa","operativos",
    "operativo","administrativa","administrativo","administrativos","soporte","soportes",
    "tecnico","técnico","técnicos","área","áreas","ceo","acerca del empleo","acerca del trabajo","oferta laboral","vacante",
    "excelentes beneficios","zona estratégica","gran escala","reto estratégico",
    "contrato","a término indefinido","salario","beneficios","ubicación",
    "nuestro equipo","nuestra empresa","nuestros clientes","nuestras soluciones",
    "profesional apasionado","profesional apasionado por la tecnologia","profesional apasionado por la tecnología",
    "soluciones tecnologicas","soluciones tecnológicas",
    "institucion","institución","fundacion","fundación","colombia"
})

# Fusión con dinámicos aprendidos
try:
    EXCLUDE_TERMS |= dynamic_exclude_terms(threshold=NOISE_THRESHOLD)
except Exception:
    pass

def _normalize_local_alias(texto: str) -> str:
    _ALIAS_REGEX_LOCAL = [
        (r"(?i)fin[\-\s]?tech", "fintech"),
        (r"(?i)ciber[\-\s]?seguridad", "ciberseguridad"),
        (r"(?i)big[\-\s]?data", "big data"),
        (r"(?i)machine[\-\s]?learning", "machine learning"),
        (r"(?i)\bservicio\s+sla\b", "cumplimiento de sla"),
        (r"(?i)\bacuerdos?\s+de\s+servicio\b", "cumplimiento de sla"),
    ]
    t = texto or ""
    for patron, repl in _ALIAS_REGEX_LOCAL:
        t = re.sub(patron, repl, t)
    return t

def detectar_nuevas_habilidades(texto_oferta, umbral_longitud=4, top_k=12):
    """
    Extrae candidatos de "nuevas habilidades" desde el texto de la oferta.
    Corregido el orden de evaluación y endurecido el filtro de ruido.
    """
    if not texto_oferta:
        return []

    texto_norm = _normalize_local_alias(texto_oferta.lower())
    doc = nlp(texto_norm)
    candidatos = {}

    # 1) Frases nominales (compuestos útiles)
    for chunk in doc.noun_chunks:
        frase = _clean_chunk_text(chunk.text.strip().lower())
        frase = re.sub(r"[^a-záéíóúñü\s\-]", "", frase)

        # descartar frases contextuales sin valor competencial
        if frase.startswith(SECTION_PREFIXES):
            _noise_mark(frase)
            continue
        if _is_noise_phrase_local(frase):
            _noise_mark(frase)
            continue

        tokens_simple = frase.split()
        if len(tokens_simple) < 2 or len(tokens_simple) > 8:
            continue

        # Estructura básica aceptable
        passes_structure = (" de " in frase or " en " in frase or "-" in frase or _matches_patterns(frase))

        # Score preliminar
        score_preview = _skillness(frase)

        # Permitir compuestos útiles aunque no tengan 'de/en' si:
        # - el head noun es profesional o
        # - el score preliminar es alto
        head_ok = False
        try:
            # Analizar de nuevo para obtener head noun
            doc_tmp = nlp(frase)
            for ch in doc_tmp.noun_chunks:
                if _head_is_professional(ch):
                    head_ok = True
                    break
        except Exception:
            pass

        if not (passes_structure or head_ok or score_preview >= (SIM_THRESHOLD + 0.20)):
            _noise_mark(frase)
            continue

        # tokens validados
        toks_validos = [t for t in nlp(frase) if t.is_alpha and t.lemma_.lower() not in STOPWORDS]
        if not toks_validos:
            continue

        # Score definitivo (ligeramente más estricto que preview)
        score = _skillness(frase)
        if score >= (SIM_THRESHOLD + 0.10):
            candidatos[frase] = score

    # 2) Fallback: bigramas con buen "skillness"
    if not candidatos:
        bigrams = re.findall(r"\b([a-záéíóúñü]+(?:\s+[a-záéíóúñü]+))\b", texto_norm)
        for bg in bigrams:
            bg = bg.strip()
            if len(bg.split()) != 2:
                continue
            # evitar que ambos sean stopwords o ruido
            w1, w2 = bg.split()
            if w1 in STOPWORDS and w2 in STOPWORDS:
                continue
            if _is_noise_phrase_local(bg):
                continue
            s = _skillness(bg)
            if s >= (SIM_THRESHOLD + 0.25):
                candidatos[bg] = s

    # 3) Orden y top-k
    ordenados = sorted(candidatos.items(), key=lambda x: x[1], reverse=True)
    # Anotar ruido leído (para transparencia; el contador ya se actualizó arriba)
    _ = dynamic_exclude_terms(threshold=999999)  # dummy read
    print("ℹ️ Ruido registrado/actualizado para exclusión dinámica.")

    return [c for c, _ in ordenados[:top_k]]
