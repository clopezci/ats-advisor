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
# analisis_basico.py - Motor de análisis (baseline estable + reglas externas)
# ==========================
import re
import unicodedata
import spacy

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
    "python","javascript","java","sql","aws","azure","gcp","sap","crm","salesforce","hubspot",
    "okrs","okr","kpi","nps","sla","docker","kubernetes","react","nodejs","tableau","pandas",
    "git","linux","cloud","fintech","looker","studio","datastudio","etl","power","bi","tensorflow",
    "nube","ia","iot","ciberseguridad","seguridad","devops","powerbi",
    "photoshop","illustrator","indesign","premiere","lightroom","after","effects",
    "aftereffects","figma","canva","davinci","resolve","audition","media","encoder"
    
    #Creativo/audiovisual
    "adobe","final","cut","pro","audacity","gimp","blender","cinema","4d","autodesk","maya","photoshop",
    "lightroom","aftereffects","after","effects","illustrator","indesign","premiere","davinci","resolve",
    "audition","media","encoder"
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
    "okr","okrs",

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
        if len(frase.split()) <= 1:
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

    # ---- DEPURACIÓN FINAL: Técnicas (solo compuestos o tokens válidos) ----
    def _es_tecnologia_valida_unitaria(t: str) -> bool:
        t = (t or "").strip().lower()
        if t in TECH_GENERIC_BLOCK:
            return False
        if t in WHITELIST_TECH_TOKENS:
            return True
        if t in tech_skills:
            return True
        return False

    depuradas = set()
    for k in categorias["tecnicas"]:
        kt = k.strip().lower()
        if " " in kt or "-" in kt:
            depuradas.add(kt)
        elif _es_tecnologia_valida_unitaria(kt):
            depuradas.add(kt)
    categorias["tecnicas"] = depuradas

    return categorias

# ----------------------------
# REQUISITOS EXCLUYENTES (delegado a reglas externas)
# ----------------------------
def detectar_requisitos_excluyentes_inteligente(texto_oferta, texto_cv):
    """
    Usa el motor de reglas JSON (requirements_rules.json).
    Además, registra aprendizaje ligero en requirements_learned.json.
    Incluye un parche para falsos positivos de 'sector manufactura'.
    """
    res = evaluate_requirements(texto_oferta, texto_cv)

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
                res["no_cumple"] = [x for x in res["no_cumple"] if x.lower() not in manuf_labels]
                res["alerta"] = bool(res["no_cumple"])
    except Exception:
        pass

    return res

# ----------------------------
# VALIDACIÓN PARA SUGERENCIAS FORMATIVAS
# ----------------------------
def _term_formativo_valido(t):
    t = (t or "").strip().lower()
    if not t or len(t) < 3:
        return False
    if re.fullmatch(r"[a-záéíóúñü\s\-/\.]+", t) is None:
        return False
    if (t in GENERIC_NOUNS) or (t in ABSTRACT_TERMS):
        return False
    return _skillness(t) >= SIM_THRESHOLD

# ----------------------------
# DESALINEACIÓN GLOBAL (independiente de reglas)
# ----------------------------
def _perfil_desalineado(cat_oferta, cat_cv,
                        min_items=3,
                        tech_ratio_min=0.25,
                        exp_ratio_min=0.25):
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
def _soft_match(oferta_items: set, cv_items: set, sim_thresh: float = 0.82):
    reconocidas = set()
    faltantes = set()

    for o in (oferta_items or set()):
        o_norm = (o or "").strip().lower()
        if not o_norm:
            continue
        try:
            doc_o = nlp(o_norm)
        except Exception:
            doc_o = None

        matched = False
        for c in (cv_items or set()):
            c_norm = (c or "").strip().lower()
            if not c_norm:
                continue
            if o_norm == c_norm:
                matched = True
                break
            if doc_o is not None:
                if any(tok.lemma_.lower() == c_norm for tok in doc_o if tok.is_alpha):
                    matched = True
                    break
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
    requisitos = detectar_requisitos_excluyentes_inteligente(texto_oferta, texto_cv) if texto_oferta else None
    if requisitos and requisitos["alerta"]:
        print("\n📋 Evaluación inicial: El perfil no cumple con requisitos clave de la oferta.")
        print("Por tanto, el sistema ATS marcaría la aplicación como 'No considerada automáticamente'.")
        for r in requisitos["no_cumple"]:
            print(f"   ❌ {r}")
    elif requisitos:
        print("\n✅ Cumples con los requisitos principales de la oferta.")

    # --- Desalineación de dominio (si no hubo exclusión dura)
    desalineacion = {"activo": False, "razones": [], "resumen": {}}
    if not (requisitos and requisitos["alerta"]):
        desalineado, razones, resumen = _perfil_desalineado(cat_oferta, cat_cv)
        if desalineado:
            desalineacion = {"activo": True, "razones": razones, "resumen": resumen}
            print("\n🚫 RESULTADO: Perfil no alineado con la oferta (desajuste de dominio).")
            for rz in razones:
                print(f"   ❌ {rz}")
            try:
                from modules.requisitos import learn_requirement
                learn_requirement(f"Desajuste de dominio (tech={resumen['tech_ratio']}, exp={resumen['exp_ratio']})")
            except Exception:
                pass

    # 2) Coincidencia ponderada (con matching semántico)
    total_numerador = 0.0
    total_denominador = 0.0
    for cat, peso in pesos.items():
        oferta_set = cat_oferta[cat]
        cv_set     = cat_cv[cat]
        den = len(oferta_set)

        if den > 0:
            coincidencias, faltantes_raw = _soft_match(oferta_set, cv_set, sim_thresh=0.82)
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

    if total_denominador > 0:
        total = total_numerador / total_denominador
    else:
        total = 1.0

    total_pct = round(total * 100, 2)

    # 3) Impresión
    print("\n======================================")
    print(f"COINCIDENCIA PONDERADA TOTAL: {total_pct:.2f}%")
    if requisitos and requisitos["alerta"]:
        print("\n🚫 RESULTADO: Descartado por requisitos excluyentes.")
        for r in requisitos["no_cumple"]:
            print(f"   ❌ {r}")
        print("❌ Aunque por habilidades tu CV tendría un "
              f"{total_pct:.2f}% de coincidencia, NO pasarías los filtros ATS "
              "porque no cumples requisitos excluyentes.")
    else:
        print("🟢 Alta probabilidad de pasar el filtro ATS" if total_pct >= 70 else
              "🟡 Posible aceptación, pero puede mejorar" if total_pct >= 50 else
              "🔴 Baja probabilidad de pasar el filtro ATS")

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

    # 5) Sugerencias formativas
    sugerencias_formacion = []
    for cat, d in detalles_categorias.items():
        falt = d["faltantes"]
        if not falt:
            continue
        if cat == "tecnicas":
            sugerencias_formacion += [f"Curso especializado en {s}" for s in falt]
        elif cat == "blandas":
            sugerencias_formacion += [f"Taller de {s}" for s in falt]
        else:
            sugerencias_formacion += [f"Capacitación en {s}" for s in falt]

    if sugerencias_formacion:
        print("\n🎓 Sugerencias de formación:")
        for sf in sugerencias_formacion:
            print(f"- {sf}")

    return {
        "total": total_pct,
        "nivel": "Excluido" if (requisitos and requisitos["alerta"]) else (
                 "🟢 Alta" if total_pct >= 70 else "🟡 Media" if total_pct >= 50 else "🔴 Baja"),
        "categorias": detalles_categorias,
        "sugerencias": sorted(set(sugerencias)),
        "advertencia": advertencia,
        "requisitos_excluyentes": requisitos,
        "recomendaciones": recomendaciones,
        "sugerencias_formacion": sugerencias_formacion,
        "desalineacion": desalineacion
    }

# Inicializar mapeo de lemas al cargar
construir_diccionario_lemas()
