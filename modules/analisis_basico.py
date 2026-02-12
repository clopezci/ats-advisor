# ==========================================================
#  ATS Advisor - Proyecto de Fin de Máster (TFM)
#  Universidad Internacional de Valencia (VIU)
#  Autor: Carlos Emilio López  (clopezci@hotmail.com)
#  Año: 2025-2026
# ----------------------------------------------------------
#  Descripción:
#  ATS Advisor es una herramienta educativa de código abierto
#  diseñada como proyecto académico de fin de máster. Evalúa
#  la compatibilidad entre una hoja de vida (CV) y una oferta
#  laboral, simulando el funcionamiento de un sistema ATS.
#
#  Propiedad Intelectual:
#  © 2025 Universidad Internacional de Valencia (VIU)
#  © 2025-2026 Carlos Emilio López
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
# analisis_basico.py - Motor de análisis (baseline estable + reglas externas)
# ==========================
import re
import unicodedata
import spacy

from modules import requisitos
from modules.requisitos import evaluate_requirements, learn_requirement
from modules.habilidades import (
    tech_skills, soft_skills, exp_terms,
    LEMA_A_PALABRA, construir_diccionario_lemas,
    VERBS_PERMITIDOS, _similarity_to_corpora as _sim_corpora,
    _skillness, _clean_chunk_text, HEAD_NOUNS,
    GENERIC_NOUNS, ABSTRACT_TERMS
)

# ----------------------------
# CARGA DE MODELO
# ----------------------------

try:
    nlp = spacy.load("es_core_news_lg")
except Exception:
    try:
        nlp = spacy.load("es_core_news_md")
        print("ℹ️ [analisis] Usando es_core_news_md (fallback).")
    except Exception:
        nlp = spacy.load("es_core_news_sm")
        print("ℹ️ [analisis] Usando es_core_news_sm (fallback sin vectores).")

# ----------------------------
# CONSTANTES / PARÁMETROS
# ----------------------------
STOPWORDS = set([
    "de","la","que","el","en","y","a","los","del","se","las","por","un","para","con","no","una",
    "su","al","es","lo","como","más","pero","sus","le","ya","o","este","sí","porque","esta",
    "entre","cuando","muy","sin","sobre","también","me","hasta","hay","donde","quien","desde",
    "todo","nos","durante","todos","uno","les","ni","cada","algo","otro","tanto","poco","mucho",
    "algún","alguna","cualquier","cualquiera","quienes","cuál","cuáles","cuyos","cuyas","tenido",
    "tiene","tenía","tenemos","tuvo","tuvieron","tener","haya","hubiera","fuera","ser","soy","era",
    "eres","sea","fui","fue","está","estaba","estuvo","estuve","estar","acerca","estamos",
    "esa","esas","eso","esos","mi","mis","tus","sus","nuestro","nuestra","nuestras"
])
VERBS_DESCARTADOS = {"ser","estar","tener","hacer","poder","deber","dar","trabajar","apoyar"}

SIM_THRESHOLD = 0.55
SIM_THRESHOLD_LOCAL = 0.80
SIM_MARGIN = 0.05

# ✅ Whitelist: tokens sueltos técnicos (tecnologías/herramientas)
WHITELIST_TECH_TOKENS = {
    "python","javascript","java","sql","aws","azure","gcp","sap","crm", "n8n","salesforce","hubspot",
    "okrs","okr","kpi","nps","sla","docker","kubernetes","react","nodejs","tableau","pandas",
    "git","linux","cloud","fintech","looker","studio","datastudio","etl","power","bi","tensorflow",
    "nube","ia","iot","ciberseguridad","seguridad","devops","powerbi", "airflow", "snowflake", 
    "hadoop", "spark", "scala", "ruby", "php", "angular","keras","pytorch","matlab","sas","mongodb",
    "tensorflow","nube","ia","iot","ciberseguridad","seguridad","devops","powerbi", "airflow", "snowflake",
    "RV","RA","realidad virtual","realidad aumentada","reaction","flutter","swift","kotlin",
    "django","flask","spring","laravel","symfony","wordpress","react","angular","vue","nextjs","nuxtjs",
    "zendesk","freshdesk","intercom", "regtech", "regulatory technology", "legaltech", "legal technology",
    "Sap","Oracle","Workday","ServiceNow","Jira","Confluence", "lean","six sigma","scrum","kanban",
    "S&OP","Kaizen","5S","just in time","JIT","total quality management","TQM",
    "lean manufacturing","manufactura esbelta","gestión de la cadena de suministro","supply chain management",
    "moodle", "tic", "tac", "tep", "lms", "e-learning", "elearning", "blackboard", "canvas", "schoology",
    "autocad","solidworks","revit","sketchup","archicad","vray","lumion",
    "sap","crm","looker","studio","datastudio","etl","powerbi","power bi",
    "photoshop","illustrator","indesign","premiere","lightroom","aftereffects",
    "aftereffects", "figma", "canva", "davinci", "resolve", "audition", "media", "encoder",
    
    #Creativo/audiovisual
    "adobe","final","cut","pro","audacity","gimp","blender","cinema","4d","autodesk","maya","photoshop",
    "lightroom","aftereffects","after","effects","illustrator","indesign","premiere","davinci","resolve",
    "audition","media","encoder", "figma", "canva"
}

# ❌ Negocio/operación sueltos
BUSINESS_SINGLETONS = {
    "cumplimiento","formacion","formación","gestion","gestión","operacion","operación","operaciones",
    "sistema","sistemas","tecnologia","tecnología","negocio","proyecto","proyectos","servicio","servicios",
    "vision","visión","direccion","dirección","proceso","procesos"
}

# ❌ Genéricos sueltos que NO cuentan como técnicas
TECH_GENERIC_BLOCK = {
    "cumplimiento","eficiencia","especializacion","especialización","formacion","formación",
    "gestion","gestión","innovacion","innovación","profesional","sistemas","soluciones",
    "tecnologia","tecnología","transformacion","transformación","calidad","datos","proceso",
    "procesos","digital","excelencia","ingenieria","ingeniería","ciencia","ciencias",
    "institucion","institución","fundacion","fundación","colombia"
}

# Frases técnicas frecuentes (señales fuertes, multi-palabra)
WHITELIST_TECH_PHRASES = {
    # TI / gestión / innovación
    "seguridad de la informacion","seguridad de la información",
    "proteccion de datos","protección de datos",
    "gobierno de ti",
    "arquitectura tecnologica","arquitectura tecnológica",
    "arquitectura tecnologica y digital","arquitectura tecnológica y digital",
    "transformacion digital","transformación digital",
    "automatizacion de procesos","automatización de procesos",
    "cumplimiento de sla",
    "continuidad del negocio","recuperacion ante desastres","recuperación ante desastres",
    "gestion de riesgos tecnologicos","gestión de riesgos tecnológicos",
    "metodologias agiles","metodologías ágiles",
    "gestion de proyectos","gestión de proyectos",
    "orquestacion de proyectos","orquestación de proyectos",
    "estrategia tecnologica","estrategia tecnológica",
    "innovacion","innovación",
    "okr","okrs","recursos educativos digitales",
    "herramientas de inteligencia artificial aplicadas a la educación",
    "inteligencia artificial aplicada a la educación",
    "plataforma moodle"


    # Creativo/audiovisual
    "adobe creative suite","produccion audiovisual","producción audiovisual",
    "edicion de video","edición de video","retoque fotografico","retoque fotográfico",
    "fotografia profesional","fotografía profesional",
    "composicion fotografica","composición fotográfica",
    "manejo de camara","manejo de cámara","iluminacion","iluminación",
    "diseno grafico","diseño gráfico","motion graphics"
}



# 🔎 Cabeceras/secciones típicas
SECTION_HEADERS = (
    "mision del cargo","misión del cargo",
    "responsabilidades principales","responsabilidades",
    "requisitos","requerimientos","perfil","sobre nosotros"
)

# ----------------------------
# LIMPIEZA / NORMALIZACIÓN
# ----------------------------
def limpiar_texto(texto):
    texto = (texto or "").lower()
    texto = ''.join(c for c in unicodedata.normalize('NFD', texto)
                    if unicodedata.category(c) != 'Mn')
    texto = re.sub(r'[^\w\s]', '', texto)
    return texto

def contiene_lista_sospechosa(texto):
    """
    Dispara si:
    - Hay ≥2 líneas con viñeta y densidad ≥6 términos del diccionario, o
    - Hay ≥3 líneas consecutivas (aunque sin viñeta) con densidad ≥8.
    """
    if not texto:
        return False

    lines = texto.splitlines()
    bullet = tuple("•-*·")

    # contadores
    bul_dense = 0
    consec_dense = 0

    for raw in lines:
        ln = raw.strip()
        if not ln:
            consec_dense = 0
            continue

        # densidad por lemas
        tokens = [t.lemma_.lower() for t in nlp(limpiar_texto(ln)) if t.is_alpha]
        dense = sum(1 for w in tokens if w in LEMA_A_PALABRA)

        # caso bullet
        if ln[:1] in bullet and dense >= 7:
            bul_dense += 1
            if bul_dense >= 3:
                return True

        # caso consecutivo sin bullet
        if dense >= 9:
            consec_dense += 1
            if consec_dense >= 4:
                return True
        else:
            consec_dense = 0

    return False

LIGATURES = {"\ufb01": "fi", "\ufb02": "fl"}
ALIAS_REGEX = [
    (r"(?i)fin[\-\s]?tech", "fintech"),
    (r"(?i)ciber[\-\s]?seguridad", "ciberseguridad"),
    (r"(?i)big[\-\s]?data", "big data"),
    (r"(?i)machine[\-\s]?learning", "machine learning"),
    (r"(?i)\bservicio\s+sla\b", "cumplimiento de sla"),
    (r"(?i)\bacuerdos?\s+de\s+servicio\b", "cumplimiento de sla"),
    (r"(?i)\bproject\s+management\b", "gestión de proyectos"),
    (r"(?i)\bagile\b", "metodologías ágiles"),

]
def normalizar_para_nlp(texto: str) -> str:
    """
    Normaliza texto para análisis:
    - NFKC (caracteres “raros” → normales)
    - Sustituye NBSP/guiones suaves/zero-width por espacio
    - Colapsa múltiple espacio
    - Aplica alias (fin-tech → fintech, etc.)
    """
    texto = texto or ""
    # Normalización de compatibilidad (acentos/ligaduras invisibles coherentes)
    texto = unicodedata.normalize("NFKC", texto)

    # Espacios y guiones invisibles → espacio normal
    texto = (texto
             .replace("\u00A0", " ")   # NBSP
             .replace("\u2007", " ")   # Figure space
             .replace("\u202F", " ")   # Narrow NBSP
             .replace("\u200B", " ")   # Zero width space
             .replace("\u200C", " ")
             .replace("\u200D", " ")
             .replace("\u2060", " ")
             .replace("\u2011", "-")   # Non-breaking hyphen → hyphen normal
    )

    # Slashes pegados → separar
    texto = texto.replace("/", " / ")

    # Aplicar alias específicos
    for patron, repl in ALIAS_REGEX:
        texto = re.sub(patron, repl, texto)

    # Colapsar múltiple espacio
    texto = re.sub(r"\s+", " ", texto).strip()
    return texto


def _contains_phrase(texto: str, frase: str) -> bool:
    """
    Busca una 'frase' dentro de 'texto' tolerando NBSP, saltos, guiones invisibles,
    y puntuación intermedia. Convierte la frase en un patrón \W+ entre tokens.
    """
    if not texto or not frase:
        return False
    # Ambos ya deberían venir normalizados con normalizar_para_nlp
    tokens = [re.escape(t) for t in frase.strip().split()]
    if not tokens:
        return False
    patron = r"\b" + r"\W+".join(tokens) + r"\b"
    return re.search(patron, texto, flags=re.IGNORECASE) is not None


# ----------------------------
# VALIDACIÓN ACADÉMICA ROBUSTA (para requisitos tipo "ingeniería..., informática o afines", "MBA o afines")
# ----------------------------

ACADEMIC_TRIGGER = {
    "estudios", "profesional", "pregrado", "grado", "ingenieria", "ingeniería",
    "informatica", "informática", "especializacion", "especialización",
    "maestria", "maestría", "master", "máster", "mba", "posgrado", "postgrado"
}

# Equivalencias escalables: cada clave representa un "concepto" y lista variantes aceptables en CV
ACADEMIC_EQUIV = {
    
    "ingenieria de sistemas": {
        "ingenieria de sistemas", "ingeniería de sistemas",
        "ingeniero de sistemas", "ingeniera de sistemas",
        "ingeniero sistemas", "ingeniera sistemas",
        "ingenieria sistemas", "ingeniería sistemas",
        "ing de sistemas", "ing. de sistemas",
        "ing sistemas", "ing. sistemas",
        "ing en sistemas", "ing. en sistemas",
        "sistemas"  # (lo dejamos porque en este caso lo usan como afín típico)
    },

    "informatica": {
        "informatica", "informática",
        # Afines que deben aceptar cuando piden "informática o afines"
        "ingenieria de sistemas", "ingeniería de sistemas",
        "ingeniero de sistemas", "ingeniera de sistemas",
        "ingeniero sistemas", "ingeniera sistemas",
        "ing de sistemas", "ing. de sistemas",
        "ing sistemas", "ing. sistemas",
        "sistemas",
        # otros afines típicos
        "ingenieria de software", "ingeniería de software",
        "ingenieria informatica", "ingeniería informática"
    },

    "mba": {
        "mba", "master en administracion", "máster en administración",
        "maestria en administracion", "maestría en administración",
        "master of business administration"
    },
    "arquitectura empresarial": {"arquitectura empresarial"},
    "transformacion digital": {"transformacion digital", "transformación digital"},
    "gestion de proyectos": {"gestion de proyectos", "gestión de proyectos", "project management"},
    "sistemas de informacion": {"sistemas de informacion", "sistemas de información"},
}

def _norm_acad(x: str) -> str:
    return normalizar_para_nlp((x or "").lower())

def _split_academic_options(core: str) -> list:
    """
    Convierte: "ingeniería de sistemas, informática o afines"
    en opciones: ["ingeniería de sistemas", "informática"]
    """
    c = _norm_acad(core)
    c = re.sub(r"\b(o\s+afines|y\s+afines|afines)\b", "", c).strip()
    # separadores típicos
    parts = re.split(r"[;,/]| y | e | o ", c)
    opts = []
    for p in parts:
        p = p.strip()
        if len(p) >= 3:
            opts.append(p)
            # quitar duplicados manteniendo orden
            out = []
            seen = set()
            for o in opts:
                if o not in seen:
                    out.append(o)
                    seen.add(o)
            return out

def _cv_has_any(cv_norm: str, patterns: set) -> bool:
    """
    Busca variantes en el CV normalizado. Usa contains_phrase para tolerancia a saltos/puntuación.
    """
    if not cv_norm:
        return False
    for p in patterns:
        if _contains_phrase(cv_norm, _norm_acad(p)):
            return True
    return False

def _cumple_requisito_academico(tag: str, texto_cv: str) -> bool:
    """
    Decide si un tag de requisitos 'duros' realmente se cumple por formación (estudios),
    usando equivalencias y opciones tipo "X, Y o afines".
    """
    if not tag or not texto_cv:
        return False

    tag_norm = _norm_acad(tag)
    cv_norm  = _norm_acad(texto_cv)

    # Solo aplicar si el tag parece académico
    if not any(k in tag_norm for k in ACADEMIC_TRIGGER):
        return False

    # Extraer "core" después de ":" si existe
    core = tag_norm.split(":", 1)[1].strip() if ":" in tag_norm else tag_norm

    # 1) Si el core contiene opciones ("..., ... o afines"), evaluamos por opciones
    opciones = _split_academic_options(core)
    if opciones:
        for opt in opciones:
            # Si opt coincide con una clave del diccionario, usamos su set de equivalencias
            key = opt
            if key in ACADEMIC_EQUIV:
                if _cv_has_any(cv_norm, ACADEMIC_EQUIV[key]):
                    return True
                else:
                    # Si no está mapeado, intentamos búsqueda literal tolerante
                    if _contains_phrase(cv_norm, opt):
                        return True

                    # 2) Fallback: si menciona una clave del diccionario dentro del core
                    for key, variants in ACADEMIC_EQUIV.items():
                        if key in core:
                            if _cv_has_any(cv_norm, variants):
                                return True

                            return False



# ----------------------------
# CATEGORIZACIÓN
# ----------------------------
def _categoria_por_similitud(texto_skill: str):
    """
    1) Si está EXACTO en nuestras listas, devuelve esa categoría (prioridad).
    2) Si no, usa similitud a corpus.
    """
    t = (texto_skill or "").strip().lower()
    if not t:
        return None

    if t in tech_skills:
        return "tecnicas"
    if t in soft_skills:
        return "blandas"
    if t in exp_terms:
        return "experiencia"

    if _sim_corpora(t) < SIM_THRESHOLD:
        return None

    docs = {
        "tecnicas": " ".join(sorted(set(tech_skills))),
        "blandas": " ".join(sorted(set(soft_skills))),
        "experiencia": " ".join(sorted(set(exp_terms))),
    }
    best_cat, best_sim = None, 0.0
    d = nlp(t)
    if not getattr(d, "vector_norm", 0.0):
        return None
    for cat, corpus in docs.items():
        cdoc = nlp(corpus)
        if not getattr(cdoc, "vector_norm", 0.0):
            continue
        s = d.similarity(cdoc)
        if s > best_sim:
            best_sim, best_cat = s, cat
    return best_cat

def es_skill_valida_token(t):
    if not t.is_alpha:
        return False
    lemma = t.lemma_.lower()
    if lemma in STOPWORDS:
        return False
    if t.pos_ in {"PRON","DET","ADV","AUX","PART","SCONJ","CCONJ","INTJ","NUM","SYM","PUNCT","SPACE"}:
        return False
    if t.pos_ == "VERB":
        if lemma in VERBS_DESCARTADOS:
            return False
        if lemma not in VERBS_PERMITIDOS:
            return False
    elif t.pos_ not in {"NOUN","PROPN"}:
        return False
    if len(t.text) < 3:
        return False
    if lemma in GENERIC_NOUNS or lemma in ABSTRACT_TERMS:
        return False
    return True

def es_skill_valida_string(s: str) -> bool:
    s = (s or "").strip()
    if not s:
        return False
    d = nlp(s)
    if not d or len(d) == 0:
        return False
    return es_skill_valida_token(d[0])

def categorizar_texto(texto):
    categorias = {"tecnicas": set(), "blandas": set(), "experiencia": set()}
    texto = normalizar_para_nlp(texto)

    # 🔎 Filtrar cabeceras que contaminan los chunks
    lineas_filtradas = []
    for l in (texto or "").splitlines():
        low = (l or "").strip().lower()
        if any(low.startswith(h) for h in SECTION_HEADERS):
            if ":" in l:
                pos = l.index(":")
                resto = l[pos+1:].strip()
                if resto:
                    lineas_filtradas.append(resto)
            continue
        lineas_filtradas.append(l)
    texto_filtrado = "\n".join(lineas_filtradas)

    doc = nlp(texto_filtrado)

    # 0) Detección textual conservadora (solo FRASES whitelist) usando patrón tolerante
    scan_text = normalizar_para_nlp(texto_filtrado.lower())
    
    # 0.b) Detección literal para tokens técnicos (incluye alfanuméricos)
    TOKENS_TECNICOS_LITERALES = {"python", "sql", "aws", "azure", "gcp", "n8n", "salesforce", 
                                 "hubspot", "docker", "kubernetes", "react", "nodejs", "tableau", 
                                 "pandas","moodle", "tic", "tac", "tep", "lms", "e-learning", 
                                 "elearning", "blackboard", "canvas", "schoology",}

    for tok in TOKENS_TECNICOS_LITERALES:
        if re.search(rf"\b{re.escape(tok)}\b", scan_text, flags=re.IGNORECASE):
            categorias["tecnicas"].add(tok)


    
    for fr in WHITELIST_TECH_PHRASES:
        if _contains_phrase(scan_text, fr):
            categorias["tecnicas"].add(fr)


    # 1) FRASES COMPUESTAS (preferidas)
    DOMAIN_TECH_HINT = re.compile(
        r"\b(finanza[s]?|proyect|estrateg|okr|agile|scrum|kanban|bi|anal[íi]tic|analytics?)\b",
        flags=re.IGNORECASE
    )
    DOMAIN_EXP_HINT = re.compile(
        r"\b(liderar|gestionar|coordinar|planificar|dirigir|supervisar|orquestar)\b",
        flags=re.IGNORECASE
    )

    for chunk in doc.noun_chunks:
        frase = _clean_chunk_text(chunk.text)
        frase = re.sub(r"[^a-záéíóúñü\s\-]", "", frase.lower()).strip()
        if not frase:
            continue

        tokens_simple = frase.split()

        # --- FILTROS ANTIRRUIDO PARA FRASES DE LA OFERTA (no son habilidades) ---

        # 1) Muy cortas o muy largas → casi siempre ruido
        if len(tokens_simple) <= 1 or len(tokens_simple) > 8:
            continue

        # 2) Pronombres posesivos: "nuestro equipo global", "nuestros usuarios", "su equipo"
        if re.search(r"\b(nuestro|nuestra|nuestros|nuestras|su|sus)\b", frase):
            continue

        # 3) Frases que empiezan con conectores tipo "a través de..."
        if frase.startswith(("a través", "através", "atraves", "traves de")):
            continue

        # 4) Cuantificadores genéricos al inicio: "varios proyectos", "varias tareas"
        if tokens_simple[0] in {"varios", "varias"}:
            continue

        head = chunk.root.lemma_.lower()
        if head not in HEAD_NOUNS:
            continue

        if _skillness(frase) >= SIM_THRESHOLD:
            cat = _categoria_por_similitud(frase)

            # --- Guardarraíl de dominio para evitar falsos 'blandas' ---
            if cat == "blandas":
                if DOMAIN_TECH_HINT.search(frase):
                    cat = "tecnicas"
                elif DOMAIN_EXP_HINT.search(frase):
                    cat = "experiencia"

            if cat:
                categorias[cat].add(frase)



    # 2) TOKENS (controlado)
    proto_docs = {
        "tecnicas": nlp(" ".join(sorted(set(tech_skills)))) if tech_skills else None,
        "blandas": nlp(" ".join(sorted(set(soft_skills)))) if soft_skills else None,
        "experiencia": nlp(" ".join(sorted(set(exp_terms)))) if exp_terms else None,
    }

    for token in doc:
        if not es_skill_valida_token(token):
            continue
        lemma = token.lemma_.lower()

        # Bloqueo temprano de genéricos/contexto
        if lemma in TECH_GENERIC_BLOCK:
            continue

        # Ruta estable por diccionario (lema -> formas)
        posibles = LEMA_A_PALABRA.get(lemma, [])
        if posibles:
            for palabra in posibles:
                if _sim_corpora(palabra) >= SIM_THRESHOLD:
                    if palabra in tech_skills:
                        categorias["tecnicas"].add(palabra)
                    elif palabra in soft_skills:
                        categorias["blandas"].add(palabra)
                    elif palabra in exp_terms:
                        categorias["experiencia"].add(palabra)
            continue

        if not token.has_vector or getattr(token, "vector_norm", 0.0) == 0.0:
            continue

        mejor_cat, mejor_score = None, 0.0
        segundo_mejor = 0.0
        for cat, dref in proto_docs.items():
            if dref is None or getattr(dref, "vector_norm", 0.0) == 0.0:
                continue
            s = token.similarity(dref)
            if s > mejor_score:
                segundo_mejor = mejor_score
                mejor_score, mejor_cat = s, cat
            elif s > segundo_mejor:
                segundo_mejor = s

        if mejor_cat and (mejor_score >= SIM_THRESHOLD_LOCAL) and ((mejor_score - segundo_mejor) >= SIM_MARGIN):
            if mejor_cat == "tecnicas":
                if lemma in TECH_GENERIC_BLOCK:
                    continue
                if lemma in BUSINESS_SINGLETONS:
                    continue
                if lemma in WHITELIST_TECH_TOKENS:
                    categorias["tecnicas"].add(lemma)
                    continue
                if token.pos_ == "PROPN":
                    categorias["tecnicas"].add(lemma)
                    continue
                if mejor_score >= 0.90:
                    categorias["tecnicas"].add(lemma)
                    continue
            else:
                categorias[mejor_cat].add(lemma)

 
    # ---- DEPURACIÓN FINAL: Técnicas (robusta ante caracteres invisibles / puntuación) ----
    def _norm_token_skill(x: str) -> str:
        x = normalizar_para_nlp((x or "").lower())
        # quitar basura alrededor pero conservar letras/números/guion
        x = re.sub(r"[^\w\-]+", "", x, flags=re.UNICODE)
        return x.strip()

    def _es_tecnologia_valida_unitaria(t: str) -> bool:
        t = _norm_token_skill(t)
        if not t:
            return False
        if t in TECH_GENERIC_BLOCK:
            return False
        if t in WHITELIST_TECH_TOKENS:
            return True
        if t in tech_skills:
            return True
        return False

    depuradas = set()
    # iteramos sobre una COPIA para evitar efectos por reasignación
    for k in (categorias.get("tecnicas") or set()):
        kt_raw = (k or "").strip()
        kt = normalizar_para_nlp(kt_raw.lower())

        # si es frase o contiene guion, se conserva “como frase”
        if " " in kt or "-" in kt:
            depuradas.add(kt)
            continue

        # si es token unitario, normalizamos fuerte (n8n, n8n. n8n\u200b etc funcionen)
        kt_unit = _norm_token_skill(kt)
        if _es_tecnologia_valida_unitaria(kt_unit):
            depuradas.add(kt_unit)
            
            
    # ✅ asignación UNA sola vez, al final
    categorias["tecnicas"] = depuradas


    # ---- DEPURACIÓN FINAL: Blandas (eliminar frases claramente contextuales) ----
    dep_blandas = set()
    for k in categorias["blandas"]:
        kl = (k or "").strip().lower()
        # Frases narrativas / de contexto que no son competencias
        if "traves de un equipo" in kl or "través de un equipo" in kl:
            continue
        if kl.startswith(("a través de", "através de", "atraves de")):
            continue
        dep_blandas.add(kl)
    categorias["blandas"] = dep_blandas

    return categorias



# ----------------------------
# REQUISITOS EXCLUYENTES (delegado a reglas externas)
# ----------------------------
def detectar_requisitos_excluyentes_inteligente(texto_oferta, texto_cv):
    """
    Usa el motor de reglas JSON (requirements_rules.json).
    Además, registra aprendizaje ligero en requirements_learned.json.
    Incluye parches para falsos positivos de 'sector manufactura'
    y para requisitos libres demasiado verborrágicos.
    """
    res = evaluate_requirements(texto_oferta, texto_cv)
    
    
    print("DEBUG: entré a detectar_requisitos_excluyentes_inteligente")
    print("DEBUG res.no_cumple =", (res.get("no_cumple") if res else None))

    
    
    # --- Parche robusto: equivalencias académicas NO deben excluir si el CV las cumple ---
    def _norm_acad(s: str) -> str:
        # limpiar_texto() baja a minúsculas, quita tildes y signos.
        return limpiar_texto(normalizar_para_nlp(s or ""))

    ACADEMIC_EQUIV = {
        "informatica": {
            "ingenieria de sistemas", "ingeniería de sistemas",
            "ingenieria informatica", "ingeniería informática",
            "ciencias de la computacion", "ciencias de la computación",
            "computacion", "computación",
            "sistemas de informacion", "sistemas de información",
            "ingenieria de software", "ingeniería de software",
            "ingeniero de sistemas", "ingeniera de sistemas",
            "ingeniero sistemas", "ingeniera sistemas",
            "ing de sistemas", "ing. de sistemas",
            "ing sistemas", "ing. sistemas",
            "ing en sistemas", "ing. en sistemas",
            "sistemas","especialista", "especialización"

        },
        "mba": {
            "mba", "maestria", "maestría", "master en administracion", "máster en administración",
            "maestria en administracion", "maestría en administración",
            "master of business administration"
        }
    }

    def _cumple_academico_por_equivalencia(tag: str, cv_text: str) -> bool:
        t = _norm_acad(tag)
        cvn = _norm_acad(cv_text)

        core = t.split(":", 1)[1].strip() if ":" in t else t

        if "informat" in core:
            return any(_contains_phrase(cvn, _norm_acad(v)) for v in ACADEMIC_EQUIV["informatica"])

        if "mba" in core:
            return any(_contains_phrase(cvn, _norm_acad(v)) for v in ACADEMIC_EQUIV["mba"])

        return False

    # ✅ Parche académico (APLICA cambios al final del loop, no dentro)
    try:
        if res and res.get("no_cumple"):
            nuevos_duros = []
            movidos_a_soft = list(res.get("no_cumple_soft") or [])

            for tag in (res.get("no_cumple") or []):
                if _cumple_academico_por_equivalencia(tag, texto_cv):
                    continue
                nuevos_duros.append(tag)

            # ✅ Estas asignaciones van FUERA del for (se aplican una sola vez)
            res["no_cumple"] = nuevos_duros
            res["no_cumple_soft"] = movidos_a_soft
            res["alerta"] = bool(nuevos_duros)

            print("DEBUG parche académico aplicado. no_cumple:", res.get("no_cumple"))
            print("DEBUG parche académico aplicado. no_cumple_soft:", res.get("no_cumple_soft"))
            
    except Exception as e:
        print("DEBUG parche académico error:", e)

    

    # Aprendizaje de etiquetas fallidas
    try:
        if res and res.get("no_cumple"):
            for tag in res["no_cumple"]:
                learn_requirement(tag, inc=1)
    except Exception:
        pass

    # Parche: manufactura solo si hay evidencia clara en la oferta
    try:
        if res and res.get("no_cumple"):
            oferta_low = (texto_oferta or "").lower()
            manuf_labels = {"experiencia en sector manufactura"}
            has_strong_signal = bool(re.search(r"manufactur|planta|f[aá]bric", oferta_low))
            if not has_strong_signal:
                res["no_cumple"] = [x for x in res["no_cumple"]
                                    if x.lower() not in manuf_labels]
                res["alerta"] = bool(res["no_cumple"])
    except Exception:
        pass

    # Parche genérico: requisitos tipo "Conocimiento requerido: <frase muy larga>"
    # se consideran "blandos" (no excluyentes). Los guardamos aparte.
    try:
        if res and res.get("no_cumple"):
            duros = []
            suaves = []
            for tag in res["no_cumple"]:
                txt = (tag or "").strip().lower()
                if txt.startswith("conocimiento requerido:"):
                    core = txt.split(":", 1)[1].strip() if ":" in txt else txt
                    # Si el "core" tiene más de 4 palabras, probablemente es
                    # una frase libre auto-detectada, NO un requisito duro.
                    if len(core.split()) > 4:
                        suaves.append(tag)
                        continue
                duros.append(tag)

            # Guardamos por si en el futuro los quieres mostrar en otro sitio
            res["no_cumple_soft"] = (res.get("no_cumple_soft") or []) + suaves
            res["no_cumple"] = duros
            res["alerta"] = bool(duros)
            
    except Exception:
        pass
            
    # --- Parche: NO aceptar requisitos que no estén realmente en el texto de la oferta ---
    # Esto evita "fantasmas" (ej: banca personal) que pueden venir de reglas aprendidas o genéricas.
    try:
        if res and (res.get("no_cumple") or res.get("no_cumple_soft")):
            oferta_norm = normalizar_para_nlp((texto_oferta or "").lower())

            def _core(txt: str) -> str:
                t = (txt or "").strip()
                if ":" in t:
                    t = t.split(":", 1)[1].strip()
                return normalizar_para_nlp(t.lower())

            def _esta_en_oferta(core: str) -> bool:
                # Tolerante: busca la frase "core" dentro de la oferta, soportando espacios/puntuación/saltos
                return bool(core) and _contains_phrase(oferta_norm, core)

            nuevos_duros = []
            movidos_a_soft = list(res.get("no_cumple_soft") or [])

            for tag in (res.get("no_cumple") or []):
                core = _core(tag)

                # Si no aparece en la oferta, NO puede ser requisito duro.
                if not _esta_en_oferta(core):
                    movidos_a_soft.append(tag)
                else:
                    nuevos_duros.append(tag)

            res["no_cumple"] = nuevos_duros
            res["no_cumple_soft"] = movidos_a_soft
            res["alerta"] = bool(nuevos_duros)

    except Exception:
        pass
    
    
    return res


# ----------------------------
# VALIDACIÓN PARA SUGERENCIAS FORMATIVAS
# ----------------------------


def _term_formativo_valido(t):
    t = (t or "").strip().lower()
    if not t or len(t) < 2:
        return False

    # ✅ Si está en whitelist técnica, SIEMPRE es válido como "faltante formativo"
    t_norm = normalizar_para_nlp(t)
    t_unit = re.sub(r"[^\w\-]+", "", t_norm, flags=re.UNICODE).strip()

    if t_unit in WHITELIST_TECH_TOKENS:
        return True

    # ✅ Aceptar tokens alfanuméricos típicos de tecnología: n8n, gpt4, 3cx, etc.
    # (letras/números/guion/punto/slash/espacios)
    if re.fullmatch(r"[a-z0-9áéíóúñü\s\-/\.]+", t_norm) is None:
        return False

    if (t_norm in GENERIC_NOUNS) or (t_norm in ABSTRACT_TERMS):
        return False

    return _skillness(t_norm) >= SIM_THRESHOLD


# ----------------------------
# DESALINEACIÓN GLOBAL (independiente de reglas)
# ----------------------------
def _perfil_desalineado(cat_oferta, cat_cv,
                        min_items=5,
                        tech_ratio_min=0.20,
                        exp_ratio_min=0.20):
    of_tech = cat_oferta.get("tecnicas", set()) or set()
    cv_tech = cat_cv.get("tecnicas", set()) or set()
    of_exp  = cat_oferta.get("experiencia", set()) or set()
    cv_exp  = cat_cv.get("experiencia", set()) or set()

    inter_tech = of_tech & cv_tech
    inter_exp  = of_exp & cv_exp

    tech_req = len(of_tech)
    exp_req  = len(of_exp)

    tech_ratio = (len(inter_tech) / tech_req) if tech_req else 1.0
    exp_ratio  = (len(inter_exp)  / exp_req)  if exp_req  else 1.0

    razones = []
    if tech_req >= min_items and tech_ratio < tech_ratio_min:
        faltantes = sorted(of_tech - cv_tech)
        top = ", ".join(list(faltantes)[:5]) if faltantes else "técnicas clave no presentes"
        razones.append(f"Técnicas de la oferta casi no coinciden con tu CV (coincidencia {tech_ratio:.0%}). Faltan: {top}")
    if exp_req >= min_items and exp_ratio < exp_ratio_min:
        faltantes = sorted(of_exp - cv_exp)
        top = ", ".join(list(faltantes)[:5]) if faltantes else "áreas de experiencia clave no presentes"
        razones.append(f"Experiencia solicitada casi no coincide con tu CV (coincidencia {exp_ratio:.0%}). Faltan: {top}")

    desalineado = len(razones) > 0
    resumen = {
        "tech_req": tech_req, "tech_hit": len(inter_tech), "tech_ratio": round(tech_ratio, 3),
        "exp_req": exp_req,   "exp_hit": len(inter_exp),   "exp_ratio": round(exp_ratio, 3)
    }
    return desalineado, razones, resumen

# ----------------------------
# MATCHING SEMÁNTICO SUAVE
# ----------------------------

VERB_EQUIV = {
    "implementar": {"implementacion", "implementé", "implementación", "implantacion", "implantación", "ejecucion", "ejecución"},
    "analizar": {"analisis", "analicé", "análisis", "analitica", "analítica", "diagnostico", "diagnóstico", "evaluacion", "evaluación"},
    "evaluar": {"evaluacion", "evalué", "evaluación", "valoracion", "valoración", "medicion", "medición", "assessment"},
    "liderar": {"liderazgo", "lideré", "liderar", "dirigir", "supervisar", "coordinar", "gestionar", "orquestar"},
    "gestionar": {"gestión", "gestioné", "gestionar", "dirigir", "supervisar", "coordinar", "liderar", "orquestar"},
    "coordinar": {"coordinar", "coordiné", "coordinación", "gestionar", "dirigir", "supervisar", "liderar", "orquestar"},
    "planificar": {"planificar", "planifiqué", "planificacion", "planificación", "organizar", "programar", "dirigir", "gestionar", "liderar"},
    "dirigir": {"dirigí", "liderar", "gestionar", "supervisar", "coordinar", "orquestar"},
    "supervisar": {"supervisar", "supervisé", "supervisión", "liderar", "dirigir", "gestionar", "coordinar", "orquestar"},
    "orquestar": {"orquestar", "orquesté", "orquestación", "liderar", "dirigir", "gestionar", "supervisar", "coordinar"},
    "desarrollar": {"desarrollo", "desarrollé", "desarrollar", "crear", "construir", "generar", "implementar"},
    "construir": {"construir", 	"construí"	,	"construcción"	,	"desarrollado"	,	"creado"	,	"generado"	,	"implementado"}
}

# ---- Equivalencias bidireccionales (para que "liderazgo" ↔ "liderar") ----
def _build_equiv_bidir(equiv: dict) -> dict:
    bidir = {k: set(v) for k, v in equiv.items()}
    for k, vs in equiv.items():
        for v in vs:
            bidir.setdefault(v, set()).add(k)
            # También conectamos entre sí los sinónimos del mismo grupo
            bidir[v].update(vs)
    return bidir

EQUIV_BIDIR = _build_equiv_bidir(VERB_EQUIV)


def _soft_match(oferta_items: set,
                cv_items: set,
                texto_cv: str = "",
                texto_oferta: str = "",
                sim_thresh: float = 0.82):
    """
    Matching suave entre skills de la oferta y del CV:
    1) Coincidencia exacta entre items de las categorías.
    2) Coincidencia por lemas / similitud semántica (spaCy).
    3) si la frase de la oferta aparece literalmente en el texto del CV
       (con tolerancia a espacios, signos y saltos), se considera reconocida
       aunque no haya caído como skill categorizada en el CV.
    """
    reconocidas = set()
    faltantes = set()

    # Normalizamos el texto completo del CV una sola vez
    cv_norm = normalizar_para_nlp((texto_cv or "").lower())

    # spaCy del CV una sola vez: lemas y texto
    cv_doc = nlp(cv_norm) if cv_norm else None
    cv_lemmas = set()
    if cv_doc is not None:
        cv_lemmas = {t.lemma_.lower() for t in cv_doc if t.is_alpha}


    for o in (oferta_items or set()):
        o_norm = (o or "").strip().lower()
        
        # Normalizar equivalencias: si el término de oferta es "liderazgo", lo pasamos a su forma lema si existe
        try:
            o_doc_tmp = nlp(o_norm)
            if o_doc_tmp and o_doc_tmp[0].is_alpha:
                o_lemma_tmp = o_doc_tmp[0].lemma_.lower()
                # Si el lemma existe en nuestro mapa bidireccional, mantenemos lemma como llave de comparación
                if o_lemma_tmp in EQUIV_BIDIR:
                    o_norm = o_lemma_tmp
        except Exception:
            pass

        
        if not o_norm:
            continue

        matched = False

        # 1) Fallback textual GENERAL: si la frase de la oferta está en el CV, se da por válida
        if cv_norm and _contains_phrase(cv_norm, o_norm):
            matched = True
        else:
            # 2) Matching contra las skills categorizadas del CV
            try:
                doc_o = nlp(o_norm)
            except Exception:
                doc_o = None

            # 1.b) Fallback por lema y equivalencias (especialmente útil para VERBOS)
            # Si o_norm es una sola palabra (tipo "analizar") lo tratamos como posible verbo/acción.
            if (not matched) and (cv_doc is not None) and (len(o_norm.split()) <= 3):
                try:
                    o_doc = nlp(o_norm)
                    if o_doc and o_doc[0].is_alpha:
                        o_lemma = o_doc[0].lemma_.lower()

                        # a) mismo lema presente en CV (ej: oferta "evaluar", CV "evalué")
                        if o_lemma in cv_lemmas:
                            matched = True
                        else:
                            # b) equivalencias manuales verbo->sustantivo/variantes
                            equivs = EQUIV_BIDIR.get(o_lemma, set())
                            if any(e in cv_norm for e in equivs):
                                matched = True
                except Exception:
                    pass



            for c in (cv_items or set()):
                c_norm = (c or "").strip().lower()
                
                try:
                    c_doc_tmp = nlp(c_norm)
                    if c_doc_tmp and c_doc_tmp[0].is_alpha:
                        c_lemma_tmp = c_doc_tmp[0].lemma_.lower()
                        if c_lemma_tmp in EQUIV_BIDIR:
                            c_norm = c_lemma_tmp
                except Exception:
                    pass

                
                if not c_norm:
                    continue

                # 2.a) Igualdad exacta de string
                if o_norm == c_norm:
                    matched = True
                    break

                # 2.b) Coincidencia por lema dentro de la frase de la oferta
                if doc_o is not None:
                    if any(tok.lemma_.lower() == c_norm for tok in doc_o if tok.is_alpha):
                        matched = True
                        break

                # 2.c) Similitud semántica spaCy (vectores)
                if doc_o is not None:
                    doc_c = nlp(c_norm)
                    if getattr(doc_o, "vector_norm", 0.0) and getattr(doc_c, "vector_norm", 0.0):
                        if doc_o.similarity(doc_c) >= sim_thresh:
                            matched = True
                            break

        if matched:
            reconocidas.add(o)
        else:
            faltantes.add(o)

    return reconocidas, faltantes


# ----------------------------
# MOSTRAR RESULTADOS
# ----------------------------
def mostrar_resultados(cat_oferta, cat_cv, texto_cv, texto_oferta=""):
    pesos = {"tecnicas": 0.5, "experiencia": 0.3, "blandas": 0.2}
    sugerencias = []
    detalles_categorias = {}

    # 1) Requisitos excluyentes
    """requisitos = detectar_requisitos_excluyentes_inteligente(texto_oferta, texto_cv) if texto_oferta else None
    if requisitos and requisitos["alerta"]:
        print("\n📋 Evaluación inicial: El perfil no cumple con requisitos clave de la oferta.")
        print("Por tanto, el sistema ATS marcaría la aplicación como 'No considerada automáticamente'.")
        for r in requisitos["no_cumple"]:
            print(f"   ❌ {r}")
    elif requisitos:
        print("\n✅ Cumples con los requisitos principales de la oferta.")
"""
    # 1) Requisitos excluyentes (todavía sin imprimir, se ajustan después)
    requisitos = detectar_requisitos_excluyentes_inteligente(texto_oferta, texto_cv) if texto_oferta else None


    # --- Desalineación de dominio (si no hubo exclusión dura)
    # Se calcula aquí, pero se decide mostrar DESPUÉS, para evitar contradicciones
    desalineacion = {"activo": False, "razones": [], "resumen": {}}
    if not (requisitos and requisitos["alerta"]):
        desalineado, razones, resumen = _perfil_desalineado(cat_oferta, cat_cv)
        if desalineado:
            desalineacion = {"activo": True, "razones": razones, "resumen": resumen}

        #    print("\n🚫 RESULTADO: Perfil no alineado con la oferta (desajuste de dominio).")
        #    for rz in razones:
        #        print(f"   ❌ {rz}")
        #    try:
        #        from modules.requisitos import learn_requirement
        #        learn_requirement(f"Desajuste de dominio (tech={resumen['tech_ratio']}, exp={resumen['exp_ratio']})")
        #    except Exception:
        #        pass
            

    # 2) Coincidencia ponderada (con matching semántico)
    total_numerador = 0.0
    total_denominador = 0.0
    for cat, peso in pesos.items():
        oferta_set = cat_oferta[cat]
        cv_set     = cat_cv[cat]
        den = len(oferta_set)

        if den > 0:
            coincidencias, faltantes_raw = _soft_match(
                oferta_set,
                cv_set,
                texto_cv=texto_cv,
                texto_oferta=texto_oferta,
                sim_thresh=0.82
            )
            porcentaje = len(coincidencias) / den
            total_numerador += porcentaje * peso
            total_denominador += peso
        else:
            coincidencias = set()
            faltantes_raw = set()
            porcentaje = None


        # Faltantes formativos
        faltantes_scored = []
        for f in (faltantes_raw or set()):
            if _term_formativo_valido(f):
                faltantes_scored.append((f, _sim_corpora(f)))
        faltantes_scored.sort(key=lambda x: x[1], reverse=True)
        faltantes_top = [f for f, _ in faltantes_scored[:5]]

        detalles_categorias[cat] = {
            "porcentaje": None if porcentaje is None else round(porcentaje * 100, 1),
            "reconocidas": sorted(coincidencias),
            "faltantes": faltantes_top,
            "sin_reqs": (den == 0)
        }
        sugerencias.extend(faltantes_top)


    # --- Reconciliar requisitos excluyentes vs habilidades ya reconocidas ---
    # Si una habilidad se reconoce en el matching semántico (p.ej. "metodologías ágiles"),
    # no tiene sentido seguir marcándola como "no cumplida" en requisitos.
    if requisitos:
        # Conjunto de todas las skills reconocidas (técnicas, experiencia, blandas)
        reconocidas_all = set()
        for d in detalles_categorias.values():
            for s in d.get("reconocidas", []):
                if s:
                    reconocidas_all.add(s.strip().lower())

        if requisitos.get("no_cumple"):
            filtrados = []
            for tag in requisitos["no_cumple"]:
                txt = (tag or "").strip().lower()
                skip = False
                for sk in reconocidas_all:
                    if sk and sk in txt:
                        # Ejemplo: tag = "Conocimiento requerido: metodologías ágiles"
                        #          sk  = "metodologías ágiles"
                        # Ya fue reconocida, no la tratamos como incumplida.
                        skip = True
                        break
                if not skip:
                    filtrados.append(tag)
            requisitos["no_cumple"] = filtrados
            requisitos["alerta"] = bool(filtrados)



    # 3) Impresión
    # detectar si la oferta no tiene skills estructuradas
    oferta_sin_skills = all(
        (detalles_categorias[cat]["sin_reqs"] for cat in detalles_categorias)
    )

    # Score por habilidades:
    # - si no hay skills en la oferta => NO evaluable (N/A), no lo inflamos a 100%
    if oferta_sin_skills:
        score_habilidades = 0.0
        score_habilidades_label = "N/A (oferta sin skills explícitas detectables)"
    else:
        # aquí se calcula el score real
        total = total_numerador / total_denominador if total_denominador > 0 else 0.0
        score_habilidades = round(total * 100, 2)
        score_habilidades_label = f"{score_habilidades:.2f}%"

    # Score ATS final:
    # - Si hay requisitos excluyentes DUROS incumplidos => NO elegible (0.0)
    # - Si no, score ATS = score habilidades
    ats_excluido = bool(requisitos and requisitos.get("alerta") and (requisitos.get("no_cumple") or []))
    score_ats = 0.0 if ats_excluido else score_habilidades

    print("\n======================================")

    if oferta_sin_skills:
        print("ℹ️ Nota: No se detectaron requerimientos estructurados (skills) en la oferta;")
        print("   el análisis se apoya principalmente en requisitos/exclusiones y lectura humana.")

    print(f"COINCIDENCIA POR HABILIDADES: {score_habilidades_label}")

    print(
        f"SCORE ATS FINAL (ELEGIBILIDAD): {score_ats:.2f}%"
        + ("  → NO ELEGIBLE (requisitos excluyentes)" if ats_excluido else "")
    )

    if ats_excluido:
        print("\n🚫 RESULTADO: Descartado por requisitos excluyentes (DUROS).")
        for r in (requisitos.get("no_cumple") or []):
            print(f"   ❌ {r}")

        # ✅ ESTE PRINT VA FUERA DEL FOR (solo una vez)
        print(
            "❌ Aunque tu SCORE HABILIDADES es "
            f"{score_habilidades:.2f}% tu SCORE ATS FINAL es {score_ats:.2f}%. "
            "Un ATS real podría descartarte por no cumplir requisitos excluyentes básicos del cargo."
        )

    else:
        # Si la oferta no tiene skills, no calificamos “alta/media/baja” porque no es evaluable
        if oferta_sin_skills:
            print("🟡 Resultado: No evaluable por skills (oferta poco estructurada).")
            print("   Recomendación: interpretar manualmente requisitos, experiencia y evidencias del CV.")
        else:
            print(
                "🟢 Alta probabilidad de pasar el filtro ATS" if score_ats >= 70 else
                "🟡 Posible aceptación, pero puede mejorar" if score_ats >= 50 else
                "🔴 Baja probabilidad de pasar el filtro ATS"
            )

            # Mostrar desalineación SOLO si el match global NO es alto
            if desalineacion.get("activo") and score_ats < 70:
                print("\n🚫 RESULTADO: Perfil no alineado con la oferta (desajuste de dominio).")
                for rz in desalineacion.get("razones", []):
                    print(f"   ❌ {rz}")

                    # ✅ TRY FUERA DEL FOR (una sola vez)
                    try:
                        resumen = desalineacion.get("resumen", {}) or {}
                        learn_requirement(
                            f"Desajuste de dominio (tech={resumen.get('tech_ratio')}, exp={resumen.get('exp_ratio')})"
                        )
                    except Exception:
                        pass

    # ✅ Todo esto debe ejecutarse SIEMPRE, por eso va fuera del if/else anterior
    print("\n📊 Detalle por categoría:")
    for cat, d in detalles_categorias.items():
        if d.get("sin_reqs"):
            print(f"- {cat.capitalize():<12}: — (sin requerimientos explícitos)")
        else:
            print(f"- {cat.capitalize():<12}: {d['porcentaje']:>5.1f}%")
        if d["reconocidas"]:
            print(f"   ✅ Reconocidas: {', '.join(d['reconocidas'])}")
        if d["faltantes"]:
            print(f"   🔍 Faltantes  : {', '.join(d['faltantes'])}")

    print("\n👤 Reclutador humano vs 🤖 ATS")
    if ats_excluido:
        print("🤖 ATS: te descartaría automáticamente por no cumplir requisitos excluyentes.")
        print("👤 Reclutador: podría revisarte si el rol lo permite (excepción),")
        print("   pero normalmente pedirá evidencias claras o eliminará el descarte solo si son negociables.")
    else:
        print("🤖 ATS: probablemente te dejaría pasar a la siguiente fase (pre-filtro).")
        print("👤 Reclutador: revisaría evidencias, logros cuantificados y ajuste al contexto del rol.")


    # 4) Advertencias y recomendaciones
    advertencia = None
    try:
        if contiene_lista_sospechosa(texto_cv):
            advertencia = "Tu CV contiene listas de palabras clave que podrían ser penalizadas."
    except Exception:
        pass

    recomendaciones = [
        "Incluye palabras clave solo si puedes respaldarlas.",
        "Evita listas sueltas, intégralas en logros.",
        "Sé honesto con tus competencias."
    ]

    # 5) Sugerencias formativas (desde faltantes por categoría)
    sugerencias_formacion = []
    for cat, d in detalles_categorias.items():
        falt = d.get("faltantes", [])
        if not falt:
            continue
        if cat == "tecnicas":
            sugerencias_formacion += [f"Curso especializado en {s}" for s in falt]
        elif cat == "blandas":
            sugerencias_formacion += [f"Taller de {s}" for s in falt]
        else:
            sugerencias_formacion += [f"Capacitación en {s}" for s in falt]

    # 5.b) Formación prioritaria desde requisitos excluyentes (si existen)
    formacion_prioritaria = []
    formacion_deseable = []

    if ats_excluido and requisitos:
        for r in (requisitos.get("no_cumple") or []):
            core = r.split(":", 1)[1].strip() if ":" in r else r.strip()
            formacion_prioritaria.append(f"Curso/lectura guiada en {core}")

        print("\n🎯 Formación prioritaria (requisitos excluyentes detectados):")
        for fp in formacion_prioritaria:
            print(f"- {fp}")

    # 5.c) Formación deseable (no excluyente) desde no_cumple_soft
    formacion_deseable = []
    if requisitos and requisitos.get("no_cumple_soft"):
        for r in requisitos["no_cumple_soft"]:
            core = r.split(":", 1)[1].strip() if ":" in r else r.strip()
            formacion_deseable.append(f"Curso sugerido (deseable) en {core}")

        print("\n✨ Formación deseable (nice to have):")
        for fd in formacion_deseable:
            print(f"- {fd}")


    if sugerencias_formacion:
        print("\n🎓 Sugerencias de formación:")
        for sf in sugerencias_formacion:
            print(f"- {sf}")


    return {
        "total": score_habilidades,   # score por skills
        "score_ats": score_ats,       # score final considerando requisitos excluyentes
        "nivel": "Excluido" if ats_excluido else (
            "🟢 Alta" if score_ats >= 70 else "🟡 Media" if score_ats >= 50 else "🔴 Baja"),
        "categorias": detalles_categorias,
        "sugerencias": sorted(set(sugerencias)),
        "advertencia": advertencia,
        "requisitos_excluyentes": requisitos,
        "recomendaciones": recomendaciones,
        "sugerencias_formacion": sugerencias_formacion,
        "formacion_prioritaria": formacion_prioritaria,
        "formacion_deseable": formacion_deseable,
        "desalineacion": desalineacion
            
    }
    

# Inicializar mapeo de lemas al cargar
construir_diccionario_lemas()
