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
# requisitos.py - Motor genérico de requisitos (reglas en JSON)  (v2: canonicalización de bullets)
# ==========================
import os, json, re, unicodedata
from typing import Optional, Dict, List

"""
BASE_DIR = os.path.dirname(__file__)
RULES_FILE = os.path.join(BASE_DIR, "requirements_rules.json")
LEARNED_FILE = os.path.join(BASE_DIR, "requirements_learned.json") autoaprendizaje
"""

# --- soporte paths para EXE (PyInstaller) + AppData ---
def _user_data_dir():
    try:
        import sys
        import os
        if getattr(sys, 'frozen', False):
            base = os.path.join(os.environ.get("APPDATA", os.path.expanduser("~")), "ATS-Advisor")
            os.makedirs(base, exist_ok=True)
            return base
    except Exception:
        pass
    # modo desarrollo: junto al archivo
    return os.path.dirname(__file__)

BASE_DIR = _user_data_dir()
RULES_FILE = os.path.join(BASE_DIR, "requirements_rules.json")
LEARNED_FILE = os.path.join(BASE_DIR, "requirements_learned.json")


# ----------------------------
# REGLAS POR DEFECTO (sin cambios de fondo)
# ----------------------------
DEFAULT_RULES = {
    "rules": [
        # ===== Idiomas =====
        {
            "id": "lang_english",
            "label": "Inglés requerido",
            "type": "language",
            "lang": "en",
            "trigger_any": ["inglés", "ingles", "english", "bilingüe", "bilingual"],
            "level_regex": r"\b([abc][12])\b|biling[uü]e|bilingual|fluido|avanzado",
            "level_synonyms": {
                "básico": "a2", "basico": "a2",
                "intermedio": "b1",
                "avanzado": "c1", "fluido": "c1",
                "bilingüe": "c1", "bilingue": "c1", "bilingual": "c1"
            }
        },
        {
            "id": "lang_portuguese",
            "label": "Portugués requerido",
            "type": "language",
            "lang": "pt",
            "trigger_any": ["portugués", "portugues", "portuguese", "bilingüe", "bilingual", "fluente", "avançado"],
            "level_regex": r"\b([abc][12])\b|fluente|avançado|avanzado|intermedi[oó]|básico|basico|biling[uü]e|bilingual",
            "level_synonyms": {
                "básico": "a2", "basico": "a2",
                "intermedio": "b1", "intermediario": "b1",
                "avanzado": "c1", "avançado": "c1", "fluente": "c1", "fluido": "c1",
                "bilingüe": "c1", "bilingue": "c1", "bilingual": "c1"
            }
        },
        {
            "id": "lang_german",
            "label": "Alemán requerido",
            "type": "language",
            "lang": "de",
            "trigger_any": ["alemán", "aleman", "deutsch", "german", "germany"],
            "level_regex": r"\b([abc][12])\b|fließend|fortgeschritten|mittelstufe|grundkenntnisse",
            "level_synonyms": {
                "grundkenntnisse": "a2", "mittelstufe": "b1",
                "fließend": "c1", "fortgeschritten": "c1"
            }
        },

        # ===== PROFESIÓN =====
        {
            "id": "prof_enfermeria",
            "label": "Título/Licencia en Enfermería requerido",
            "type": "profession",
            "trigger_any": [
                "enfermera jefe", "enfermera líder", "enfermera lider", "enfermera coordinadora",
                "enfermera", "enfermería", "enfermeria", "profesional de enfermería", "profesional de enfermeria"
            ],
            "cv_any": [
                "enfermera", "enfermería", "enfermeria", "colegio de enfermería",
                "licenciatura en enfermería", "rn "
            ]
        },

        # ===== Sectores =====
        {
            "id": "sector_manufactura",
            "label": "Experiencia en sector manufactura",
            "type": "sector",
            "trigger_any": ["manufactura", "manufacturero", "manufacturera", "manufacturing", "planta", "fábrica", "fabrica", "línea de producción", "linea de produccion"],
            "require_any":  ["manufactur", "planta", "fábric", "fabric", "línea de", "linea de"],
            "cv_any":       ["manufactura", "manufacturero", "planta", "producción", "produccion", "fábrica", "fabrica"]
        },
        {
            "id": "sector_agro",
            "label": "Experiencia en sector agroindustrial",
            "type": "sector",
            "trigger_any": ["agroindustrial", "agrícola", "agricola", "cultivo", "maquinaria agrícola", "maquinaria agricola", "fertilización", "fertilizacion", "aceite de palma"],
            "cv_any":      ["agroindustrial", "agrícola", "agricola", "cultivo", "maquinaria agrícola", "maquinaria agricola", "fertilización", "fertilizacion", "aceite de palma"]
        },
        {
            "id": "sector_salud",
            "label": "Experiencia en sector salud",
            "type": "sector",
            "trigger_any": ["sector salud", "hospital", "clínica", "clinica", "salud digital"],
            "cv_any":      ["hospital", "clínica", "clinica", "salud"]
        },
        {
            "id": "sector_salud_reforzado",
            "label": "Experiencia en sector salud",
            "type": "sector",
            "trigger_any": [
                "sector salud", "hospital", "clínica", "clinica", "ips", "salud pública", "salud publica",
                "salud digital", "ruta materno-perinatal", "cardiovascular metabólica", "cardiovascular metabolica", "rias"
            ],
            "cv_any": [
                "hospital", "clínica", "clinica", "ips", "salud pública", "salud publica", "salud"
            ]
        },
        {
            "id": "sector_financiero",
            "label": "Experiencia en sector financiero",
            "type": "sector",
            "trigger_any": ["sector financiero", "banca", "bancario", "entidad financiera", "servicios financieros"],
            "cv_any":      ["banca", "bancario", "entidad financiera", "sector financiero"]
        },
        {
            "id": "sector_tecnologia",
            "label": "Experiencia en sector tecnología",
            "type": "sector",
            "trigger_any": ["sector tecnología", "sector tecnologia", "software house", "empresa de software", "it services"],
            "cv_any":      ["software", "tecnología", "tecnologia", "it services"]
        },
        {
            "id": "sector_retail",
            "label": "Experiencia en sector retail / consumo masivo",
            "type": "sector",
            "trigger_any": ["sector retail", "retail", "consumo masivo", "gran consumo", "fmcg", "tienda por departamentos", "canal moderno", "canal tradicional"],
            "cv_any": ["retail", "consumo masivo", "gran consumo", "fmcg", "canal moderno", "canal tradicional"]
        },
        {
            "id": "sector_comercial_b2b",
            "label": "Experiencia en ventas B2B",
            "type": "sector",
            "trigger_any": ["ventas b2b", "comercial b2b", "negocios empresa a empresa"],
            "cv_any": ["b2b", "ventas b2b", "comercial b2b"]
        },
        {
            "id": "sector_comercial_b2c",
            "label": "Experiencia en ventas B2C",
            "type": "sector",
            "trigger_any": ["ventas b2c", "comercial b2c", "retail b2c"],
            "cv_any": ["b2c", "ventas b2c", "comercial b2c"]
        },
        {
            "id": "sector_produccion_planta",
            "label": "Experiencia en operaciones de planta de producción",
            "type": "sector",
            "trigger_any": ["producción", "produccion", "turnos", "línea de producción", "linea de produccion", "operaciones de planta"],
            "require_any": ["planta", "turnos", "línea de", "linea de"],
            "cv_any": ["planta", "producción", "produccion", "turnos", "línea de producción", "linea de produccion"]
        },
        {
            "id": "sector_logistica",
            "label": "Experiencia en logística y cadena de suministro",
            "type": "sector",
            "trigger_any": ["logística", "logistica", "supply chain", "cadena de suministro", "almacenamiento", "distribución", "distribucion", "inventarios", "centro de distribución", "centro de distribucion", "última milla", "ultima milla"],
            "cv_any": ["logística", "logistica", "supply chain", "cadena de suministro", "almacenamiento", "distribución", "distribucion", "inventarios"]
        },
        {
            "id": "sector_innovacion_id",
            "label": "Experiencia en innovación / I+D",
            "type": "sector",
            "trigger_any": ["i+d", "i + d", "investigación y desarrollo", "investigacion y desarrollo", "innovación", "innovacion", "laboratorio de innovación", "open innovation"],
            "cv_any": ["i+d", "investigación y desarrollo", "innovación", "innovacion", "open innovation"]
        },
        {
            "id": "sector_educacion",
            "label": "Experiencia en sector educación / edtech",
            "type": "sector",
            "trigger_any": ["sector educativo", "institución educativa", "institucion educativa", "universidad", "colegio", "edtech", "plataforma educativa"],
            "cv_any": ["universidad", "colegio", "sector educativo", "edtech", "plataforma educativa"]
        },
        {
            "id": "sector_publico",
            "label": "Experiencia en sector público",
            "type": "sector",
            "trigger_any": ["sector público", "sector publico", "entidad pública", "entidad publica", "gubernamental"],
            "cv_any": ["sector público", "sector publico", "entidad pública", "entidad publica"]
        },
        {
            "id": "sector_ong",
            "label": "Experiencia en organizaciones sin ánimo de lucro / ONG",
            "type": "sector",
            "trigger_any": ["ong", "organización sin ánimo de lucro", "organizacion sin animo de lucro", "fundación", "fundacion", "nonprofit"],
            "cv_any": ["ong", "fundación", "fundacion", "nonprofit"]
        },

        # ===== Conocimientos / Tools / Certificaciones (anclas) =====
        { "id": "kn_gestion_clinica", "label": "Conocimiento requerido: gestión clínica", "type": "knowledge",
          "trigger_any": ["gestión clínica", "gestion clinica"], "cv_any": ["gestión clínica", "gestion clinica"] },
        { "id": "kn_auditoria_salud", "label": "Conocimiento requerido: auditoría en salud", "type": "knowledge",
          "trigger_any": ["auditoría en salud", "auditoria en salud", "auditoría clínica", "auditoria clinica"],
          "cv_any": ["auditoría en salud", "auditoria en salud", "auditoría clínica", "auditoria clinica"] },
        { "id": "kn_normativa_salud", "label": "Conocimiento requerido: normativa en salud", "type": "knowledge",
          "trigger_any": ["normativa en salud", "normatividad en salud", "regulación sanitaria", "regulacion sanitaria"],
          "cv_any": ["normativa en salud", "normatividad en salud", "regulación sanitaria", "regulacion sanitaria"] },
        { "id": "kn_res_3280", "label": "Conocimiento requerido: Resolución 3280", "type": "knowledge",
          "trigger_any": ["resolución 3280", "resolucion 3280"], "cv_any": ["resolución 3280", "resolucion 3280"] },
        { "id": "kn_rias", "label": "Conocimiento requerido: RIAS (Rutas Integrales de Atención en Salud)", "type": "knowledge",
          "trigger_any": ["rias", "rutas integrales de atención en salud", "rutas integrales de atencion en salud"],
          "cv_any": ["rias", "ruta integral de atención", "ruta integral de atencion"] },
        { "id": "kn_pyp_pym", "label": "Conocimiento requerido: programas PyP / PyM", "type": "knowledge",
          "trigger_any": ["programas de pyp", "pyp", "pym"], "cv_any": ["pyp", "pym"] },

        # Finanzas / Corporativo
        { "id":"fin_finanzas_corporativas", "label":"Conocimiento requerido: finanzas corporativas", "type":"knowledge",
          "trigger_any":["finanzas corporativas"], "cv_any":["finanzas corporativas", "corporate finance", "modelación financiera", "modelacion financiera"] },
        { "id":"fin_niif_ifrs", "label":"Conocimiento requerido: NIIF / IFRS", "type":"knowledge",
          "trigger_any":["niif", "ifrs", "estados financieros", "consolidación", "consolidacion", "modelación financiera", "modelacion financiera", "presupuestos", "tesorería", "tesoreria", "flujo de caja"],
          "cv_any":["niif", "ifrs", "estados financieros", "consolidación", "consolidacion", "modelación financiera", "modelacion financiera", "presupuestos", "tesorería", "tesoreria", "flujo de caja"] },

        # Excel / SAP / Procesos financieros
        { "id":"tool_excel_avanzado", "label":"Conocimiento requerido: excel avanzado", "type":"tool",
          "trigger_any":["excel avanzado", "nivel avanzado en excel", "excel nivel avanzado"], "cv_any":["excel", "excel avanzado"] },
        { "id":"tool_sap", "label":"Conocimiento requerido: sap", "type":"tool",
          "trigger_any":["sap"], "cv_any":["sap"] },
        { "id":"proc_tesoreria", "label":"Conocimiento requerido: tesorería", "type":"process",
          "trigger_any":["tesorería", "tesoreria"], "cv_any":["tesorería", "tesoreria"] },
        { "id":"proc_flujo_caja", "label":"Conocimiento requerido: flujo de caja", "type":"process",
          "trigger_any":["flujo de caja"], "cv_any":["flujo de caja"] },
        { "id":"proc_liquidez", "label":"Conocimiento requerido: liquidez", "type":"process",
          "trigger_any":["liquidez"], "cv_any":["liquidez"] },
        { "id":"proc_control_interno", "label":"Conocimiento requerido: control interno", "type":"process",
          "trigger_any":["control interno", "controles internos"], "cv_any":["control interno", "controles internos"] },

        # Tecnología / DevOps / Agile / Proyectos (anclas útiles)
        { "id":"it_agile", "label":"Conocimiento requerido: metodologías ágiles", "type":"knowledge",
          "trigger_any":["metodologías ágiles","metodologias agiles","agile","scrum","kanban"],
          "cv_any":["metodologías ágiles","metodologias agiles","agile","scrum","kanban"] },
        { "id":"it_project_mgmt", "label":"Conocimiento requerido: gestión de proyectos", "type":"knowledge",
          "trigger_any":["gestión de proyectos","gestion de proyectos","project management","pm"],
          "cv_any":["gestión de proyectos","gestion de proyectos","project management"] },
        { "id":"it_okr", "label":"Conocimiento requerido: OKR", "type":"knowledge",
          "trigger_any":["okr","okrs"], "cv_any":["okr","okrs"] },
        { "id":"it_estrategia_tec", "label":"Conocimiento requerido: estrategia tecnológica", "type":"knowledge",
          "trigger_any":["estrategia tecnológica","estrategia tecnologica","technology strategy"],
          "cv_any":["estrategia tecnológica","estrategia tecnologica","technology strategy"] }
    ],

    # Experiencia mínima
    "experience_regex": r"(mín(?:imo)?\s*)?(\d+)\s*(?:\+|más\s+de\s+)?\s*(años|year[s]?)",

    # Prefijos de conocimiento
    "knowledge_prefixes": ["conocimiento en", "conocimientos en", "manejo de", "dominio de", "nivel avanzado en"],

    # Cabeceras típicas de secciones de conocimientos
    "knowledge_section_headers": [
        "conocimientos técnicos", "conocimientos tecnicos", "conocimientos",
        "habilidades técnicas", "habilidades tecnicas", "herramientas", "tecnologías", "tecnologias",
        "requerimientos", "otras habilidades"
        #podria incluirse Experiencia pero es muy genérico y puede dar falsos positivos
    ],

    # Marcadores de viñetas
    "bullet_markers": ["•","-","*","·"]
}

# ---------------- utils json ----------------
def _norm(s: str) -> str:
    return (s or "").strip().lower()

def _load_json(path: str, default):
    if os.path.exists(path):
        try:
            with open(path, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            pass
    try:
        with open(path, "w", encoding="utf-8") as f:
            json.dump(default, f, ensure_ascii=False, indent=2)
    except Exception:
        pass
    return default

def _save_json(path: str, data):
    try:
        with open(path, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
    except Exception:
        pass

# --- Helpers para idiomas (nivel CEFR y sinónimos) ---
def extract_level(text: str, lvl_regex: Optional[str], synonyms: Optional[Dict[str, str]]) -> Optional[str]:
    text = (text or "").lower()
    m = re.search(r"\b([abc][12])\b", text)
    if m:
        return m.group(1).lower()
    for syn, cefr in (synonyms or {}).items():
        if syn in text:
            return cefr
    if lvl_regex:
        m2 = re.search(lvl_regex, text)
        if m2:
            g = m2.group(0).lower()
            m3 = re.search(r"\b([abc][12])\b", g)
            if m3:
                return m3.group(1).lower()
            for syn, cefr in (synonyms or {}).items():
                if syn in g:
                    return cefr
    return None

def compare_levels(cv_level: Optional[str], req_level: Optional[str]) -> bool:
    CEFR_ORDER = {"a1":1, "a2":2, "b1":3, "b2":4, "c1":5, "c2":6}
    if not req_level:
        return bool(cv_level)
    if not cv_level:
        return False
    return CEFR_ORDER.get(cv_level, 0) >= CEFR_ORDER.get(req_level, 0)

# ---- Detección de "mínimo N años en [dominio]" ----
# Mapeo de dominios → lista de anclas que buscaremos en la oferta y en el CV
DOMAIN_SYNONYMS = {
    "mercadeo/marketing": ["mercadeo", "marketing", "market", "branding"],
    "comercial/ventas": ["comercial", "ventas", "sales", "vendedor"],
    "logística/cadena de suministro": ["logística", "logistica", "supply chain", "cadena de suministro", "inventarios", "distribución", "distribucion"],
    "tecnología/it": ["tecnologia", "tecnología", "it", "software", "desarrollo", "sistemas"],
    "salud": ["salud", "hospital", "clínica", "clinica", "ips"],
    "financiero": ["finanzas", "financiero", "banca", "bancario", "tesorería", "tesoreria", "contabilidad", "niif", "ifrs"],
    "servicios compartidos (ssc)": ["servicios compartidos", "shared services", "ssc"],
    "óptico/óptica": ["óptica", "optica", "óptico", "optico", "optometría", "optometria"]
}

# Regex amplio: captura "mínimo|min" + años + (opcional) texto cercano que indica dominio
REX_EXP_DOMAIN = re.compile(
    r"(?:mín(?:imo)?|min\.?)\s*(\d+)\s*(?:\+|más\s+de\s+)?\s*(?:años|year[s]?)"
    r"(?:[^a-záéíóúñü]{0,20}(?:en|liderando|gestionando|dirigiendo)\s+([a-záéíóúñü\s]{3,70}))?",
    flags=re.IGNORECASE
)

def _find_experience_domains(texto_oferta: str):
    """
    Devuelve lista de tuplas (years:int, domain_label:str) si se detecta 'mínimo N años' y dominio.
    Si no hay dominio claro, devuelve lista vacía (dejamos el chequeo genérico como está).
    """
    res = []
    if not texto_oferta:
        return res
    t = (texto_oferta or "").lower()
    for m in REX_EXP_DOMAIN.finditer(t):
        try:
            years = int(m.group(1))
        except Exception:
            continue
        dom_text = (m.group(2) or "").strip().lower()
        if not dom_text:
            # sin dominio explícito, ignoramos (se mantiene el chequeo genérico existente)
            continue
        # Elegimos el domain_label por coincidencia de anclas
        best_label = None
        best_hits = 0
        for label, anchors in DOMAIN_SYNONYMS.items():
            hits = sum(1 for a in anchors if a in dom_text)
            if hits > best_hits:
                best_hits = hits
                best_label = label
        if best_label and best_hits > 0:
            res.append((years, best_label))
    return res

def _cv_mentions_domain(cv_low: str, domain_label: str) -> bool:
    """¿El CV menciona alguna ancla del dominio? (tolerante)"""
    anchors = DOMAIN_SYNONYMS.get(domain_label, [])
    return any(a in cv_low for a in anchors)


def load_rules():
    data = _load_json(RULES_FILE, DEFAULT_RULES)
    if "rules" not in data or not isinstance(data["rules"], list):
        data["rules"] = DEFAULT_RULES["rules"]

    rules = data.get("rules", [])

    # --- Helper interno: asegurar regla por id (si no existe, agregarla) ---
    def _ensure_rule(rule_dict: dict):
        rid = rule_dict.get("id")
        if not rid:
            return
        for r in rules:
            if r.get("id") == rid:
                # merge campos faltantes sin sobreescribir los existentes
                for k, v in rule_dict.items():
                    if k not in r:
                        r[k] = v
                return
        rules.append(rule_dict)

    # --- PATCH A: normalizar Inglés (por si el JSON externo está incompleto) ---
    try:
        _ensure_rule({
            "id": "lang_english",
            "label": "Inglés requerido",
            "type": "language",
            "lang": "en",
            "trigger_any": ["inglés", "ingles", "english", "bilingüe", "bilingual"],
            "level_regex": r"\b([abc][12])\b|biling[uü]e|bilingual|fluido|avanzado",
            "level_synonyms": {
                "básico": "a2", "basico": "a2",
                "intermedio": "b1",
                "avanzado": "c1", "fluido": "c1",
                "bilingüe": "c1", "bilingue": "c1", "bilingual": "c1"
            }
        })
    except Exception:
        pass

    # --- PATCH B: profesiones obligatorias (inyectar si faltan) ---
    try:
        # 1) MÉDICO / MÉDICO GENERAL
        _ensure_rule({
            "id": "prof_medico_general",
            "label": "Título/Licencia en Medicina (Médico/Médico General) requerido",
            "type": "profession",
            # activadores en la oferta (al menos uno debe aparecer)
            "trigger_any": [
                "médico general", "medico general",
                "médico", "medico",              # ojo: muy común en las ofertas
                "atención en consulta externa", "consulta externa"
            ],
            # (opcional) si se quiere evitar falsos positivos con "médico" genérico,
            # puede exigirse una de estas evidencias fuertes en texto de la oferta:
            "require_any": [
                "médico general", "medico general", "consulta externa", "ips", "hospital", "clínica", "clinica"
            ],
            # anclas a buscar en el CV
            "cv_any": [
                "médico", "medico", "médico general", "medico general",
                "medicina", "md", "tarjeta profesional", "registro médico", "registro medico"
            ]
        })
    except Exception:
        pass


    # --- PATCH C: Visitador médico dermatológico y conocimientos asociados ---
    try:
        # Rol/experiencia: Visitador médico (dermatología/estética)
        _ensure_rule({
            "id": "role_visitador_medico_derma",
            "label": "Experiencia como Visitador Médico (dermatología/estética) requerida",
            "type": "role",  # el motor lo tratará como genérico (sector/knowledge/role)
            "trigger_any": [
                "visitador médico", "visitador medico", "visita médica", "visita medica",
                "representante de ventas médicas", "representante de ventas medicas",
                "asesor científico", "asesor cientifico",
                "dermatólogo", "dermatologa", "dermatólogos", "dermatologos", "dermatología", "dermatologia",
                "médicos estéticos", "medicos esteticos",
                "cirujanos plásticos", "cirujanos plasticos"
            ],
            # Para evitar falsos positivos, exigimos que en la oferta aparezca también
            # al menos una ancla fuerte de este dominio (derma/estética/plástica)
            "require_any": [
                "dermat", "estétic", "estetic", "plástic", "plastic"
            ],
            # Evidencia a buscar en el CV
            "cv_any": [
                "visitador médico", "visitador medico", "visita médica", "visita medica",
                "dermatología", "dermatologia", "dermatólogo", "dermatologa", "dermatolog",
                "estética", "estetica", "medicina estética", "medicina estetica",
                "cirugía plástica", "cirugia plastica"
            ]
        })

        # Conocimiento: tratamientos despigmentantes e inyectables
        _ensure_rule({
            "id": "derma_despigmentantes_inyectables",
            "label": "Conocimiento requerido: tratamientos despigmentantes e inyectables",
            "type": "knowledge",
            "trigger_any": [
                "despigmentantes",
                "inyectables",
                "toxina botulínica", "toxina botulinica", "botox",
                "ácido hialurónico", "acido hialuronico",
                "mesoterapia", "biostimuladores", "bioestimuladores",
                "peelings", "peeling"
            ],
            "cv_any": [
                "despigmentantes",
                "inyectables",
                "toxina botulínica", "toxina botulinica", "botox",
                "ácido hialurónico", "acido hialuronico",
                "mesoterapia", "biostimuladores", "bioestimuladores",
                "peelings", "peeling"
            ]
        })
    except Exception:
        pass

    
        # --- PATCH D: Comercial/Ventas (B2B, B2C, venta consultiva, scoring, portafolio PyME/Empresarial) ---
    try:
        # Rol/Dominio comercial de base (si falta, lo añadimos o reforzamos)
        _ensure_rule({
            "id": "sector_comercial_b2b",
            "label": "Experiencia en ventas B2B",
            "type": "sector",
            "trigger_any": ["ventas b2b", "comercial b2b", "negocios empresa a empresa", "b2b"],
            "cv_any": ["b2b", "ventas b2b", "comercial b2b", "negocios empresa a empresa"]
        })
        _ensure_rule({
            "id": "sector_comercial_b2c",
            "label": "Experiencia en ventas B2C",
            "type": "sector",
            "trigger_any": ["ventas b2c", "comercial b2c", "retail b2c", "b2c"],
            "cv_any": ["b2c", "ventas b2c", "comercial b2c", "retail b2c"]
        })

        # Técnicas de venta consultiva
        _ensure_rule({
            "id": "sales_venta_consultiva",
            "label": "Conocimiento requerido: técnicas de venta consultiva",
            "type": "knowledge",
            "trigger_any": [
                "venta consultiva", "técnicas de venta consultiva", "tecnicas de venta consultiva",
                "consultative selling", "solution selling", "spin selling"
            ],
            "cv_any": [
                "venta consultiva", "consultative selling", "solution selling", "spin selling"
            ]
        })

        # Scoring y plataformas (riesgo/crédito scoring, plataformas de originación)
        _ensure_rule({
            "id": "sales_scoring_plataformas",
            "label": "Conocimiento requerido: scoring y plataformas comerciales/crediticias",
            "type": "knowledge",
            "trigger_any": [
                "scoring", "score crediticio", "score de riesgo", "plataformas de originación",
                "originación digital", "originacion digital", "motor de decisiones", "decision engine"
            ],
            "cv_any": [
                "scoring", "score crediticio", "score de riesgo", "originación", "originacion",
                "motor de decisiones", "decision engine"
            ]
        })

        # Portafolio PyME / Empresarial / Banca Personal (venta de productos)
        _ensure_rule({
            "id": "sales_portafolio_pyme",
            "label": "Conocimiento requerido: portafolio PyME/Empresarial",
            "type": "knowledge",
            "trigger_any": [
                "pyme", "pymes", "portafolio pyme", "segmento pyme", "empresarial", "banca empresarial",
                "segmento empresarial", "smb", "sme"
            ],
            "cv_any": [
                "pyme", "pymes", "empresarial", "banca empresarial", "smb", "sme"
            ]
        })
        _ensure_rule({
            "id": "sales_banca_personal",
            "label": "Conocimiento requerido: portafolio banca personal/particular",
            "type": "knowledge",
            "trigger_any": [
                "banca personal", "banca de personas", "retail banking", "particular", "consumo"
            ],
            "cv_any": [
                "banca personal", "retail banking", "particular", "consumo"
            ]
        })

        # Pipeline / Forecast (ya tienes una similar; reforzamos si faltara)
        _ensure_rule({
            "id": "sales_crm_pipeline_forecast",
            "label": "Conocimiento requerido: CRM / Pipeline / Forecast",
            "type": "tool",
            "trigger_any": [
                "crm", "pipeline", "forecast", "embudo de ventas", "salesforce", "hubspot"
            ],
            "cv_any": [
                "crm", "pipeline", "forecast", "embudo de ventas", "salesforce", "hubspot"
            ]
        })
    except Exception:
        pass


    # --- PATCH E: Centros de Servicios Compartidos (SSC) ---
    try:
        # Sector/rol: experiencia en SSC
        _ensure_rule({
            "id": "sector_ssc",
            "label": "Experiencia en centros de servicios compartidos (SSC)",
            "type": "sector",
            "trigger_any": [
                "centros de servicios compartidos", "centro de servicios compartidos",
                "servicios compartidos", "shared services", "shared services center", "ssc"
            ],
            # Requerimos evidencia clara en la oferta para evitar falsos positivos
            "require_any": [
                "servicios compartidos", "shared services", "ssc"
            ],
            "cv_any": [
                "servicios compartidos", "shared services", "ssc",
                "centro de servicios compartidos", "centros de servicios compartidos",
                "shared services center"
            ]
        })

        # (Opcional) Procesos típicos de SSC (si quieres ser más estricto en conocimientos)
        _ensure_rule({
            "id": "ssc_procesos_tipicos",
            "label": "Conocimiento requerido: procesos típicos de SSC (finanzas/contabilidad/tesorería/procure-to-pay/order-to-cash)",
            "type": "knowledge",
            "trigger_any": [
                "procure to pay", "purchase to pay", "p2p",
                "order to cash", "o2c",
                "record to report", "r2r",
                "cierre contable", "shared services finance", "shared services accounting",
                "ar", "ap", "cuentas por cobrar", "cuentas por pagar",
                "centro de servicios compartidos"
            ],
            "cv_any": [
                "procure to pay", "purchase to pay", "p2p",
                "order to cash", "o2c",
                "record to report", "r2r",
                "cierre contable", "shared services", "ssc",
                "ar", "ap", "cuentas por cobrar", "cuentas por pagar"
            ]
        })
    except Exception:
        pass

        # --- PATCH F: Título requerido en Mercadeo/Administración/Economía/Ing. Industrial ---
    try:
        _ensure_rule({
            "id": "degree_mercadeo_o_afines",
            "label": "Título requerido: Profesional en Mercadeo/Administración/Economía/Ingeniería Industrial (o afines)",
            "type": "degree",  # se procesa como genérico (igual que knowledge/sector/tool)
            "trigger_any": [
                "profesional en mercadeo",
                "profesional en marketing",
                "profesional en administración",
                "profesional en administracion",
                "profesional en economía",
                "profesional en economia",
                "profesional en ingeniería industrial",
                "profesional en ingenieria industrial",
                "carreras afines en mercadeo",
                "carreras afines a mercadeo"
            ],
            "cv_any": [
                "mercadeo", "marketing",
                "administración", "administracion",
                "economía", "economia",
                "ingeniería industrial", "ingenieria industrial"
            ]
        })
    except Exception:
        pass


    # --- PATCH G: Refuerzo explícito para Enfermería (por si alguna versión del JSON no lo trae completo) ---
    try:
        _ensure_rule({
            "id": "prof_enfermeria",
            "label": "Título/Licencia en Enfermería requerido",
            "type": "profession",
            "trigger_any": [
                "enfermera jefe", "enfermera líder", "enfermera lider", "enfermera coordinadora",
                "enfermera", "enfermería", "enfermeria", "profesional de enfermería", "profesional de enfermeria"
            ],
            "cv_any": [
                "enfermera", "enfermería", "enfermeria", "colegio de enfermería",
                "licenciatura en enfermería", "rn "
            ]
        })
    except Exception:
        pass


        # Opcional: Posgrados/Conocimientos de enfermería
    try:
        _ensure_rule({
            "id": "pos_auditoria_salud_enf",
            "label": "Conocimiento requerido: Auditoría en Salud / Salud Pública / Epidemiología",
            "type": "knowledge",
            "trigger_any": [
                "posgrado en auditoría en salud", "posgrado en auditoria en salud",
                "salud pública", "salud publica",
                "epidemiología", "epidemiologia"
            ],
            "cv_any": [
                "auditoría en salud", "auditoria en salud",
                "salud pública", "salud publica",
                "epidemiología", "epidemiologia"
            ]
        })
    except Exception:
        pass



        # 2) OPTOMETRÍA / OPTÓMETRA
        _ensure_rule({
            "id": "prof_optometria",
            "label": "Título/Licencia en Optometría (Optómetra) requerido",
            "type": "profession",
            "trigger_any": [
                "optometría", "optometria",
                "optómetra", "optometra",
                "profesional en optometría", "profesional en optometria"
            ],
            "cv_any": [
                "optometría", "optometria",
                "optómetra", "optometra",
                "licenciatura en optometría", "licenciatura en optometria"
            ]
        })

        # 3) ENFERMERÍA (refuerzo explícito)
        _ensure_rule({
            "id": "prof_enfermeria",
            "label": "Título/Licencia en Enfermería requerido",
            "type": "profession",
            "trigger_any": [
                "enfermera jefe", "enfermera líder", "enfermera lider", "enfermera coordinadora",
                "enfermera", "enfermería", "enfermeria", "profesional de enfermería", "profesional de enfermeria"
            ],
            "cv_any": [
                "enfermera", "enfermería", "enfermeria", "colegio de enfermería",
                "licenciatura en enfermería", "rn "
            ]
        })
    except Exception:
        pass

    data["rules"] = rules
    return data



def save_rules(data):
    _save_json(RULES_FILE, data)

def learn_requirement(phrase: str, inc: int = 1):
    phrase = _norm(phrase)
    if not phrase or len(phrase) < 3:
        return
    learned = _load_json(LEARNED_FILE, {})
    learned[phrase] = int(learned.get(phrase, 0)) + int(inc)
    _save_json(LEARNED_FILE, learned)

# ---------- Canonicalización de bullets / frases libres ----------
_CANON_MAP = [
    # (si contiene TODOS estos términos) -> etiqueta corta
    (("orquest", "proyecto"), "orquestación de proyectos"),
    (("gestión", "proyecto"), "gestión de proyectos"),
    (("gestion", "proyecto"), "gestión de proyectos"),
    (("project", "management"), "gestión de proyectos"),
    (("metodolog", "ágil"), "metodologías ágiles"),
    (("metodolog", "agil"), "metodologías ágiles"),
    (("scrum",), "metodologías ágiles"),
    (("kanban",), "metodologías ágiles"),
    (("okr",), "okr"),
    (("okrs",), "okr"),
    (("estrateg", "tecnolog"), "estrategia tecnológica"),
    (("reporte", "estratég"), "reporte estratégico"),
    (("reporte", "estrateg"), "reporte estratégico"),
]

_SEP_CUT = r"[:;\.\-–—]"

def _nfkc(s: str) -> str:
    return unicodedata.normalize("NFKC", s or "")

def _canonicalize_requirement(area_raw: str) -> str:
    """
    Reduce un bullet/frase a una etiqueta corta estable:
    - NFKC + lower
    - recorta por ':' ';' '.' (tomamos la primera cláusula informativa)
    - aplica mapa de patrones (_CANON_MAP)
    - si queda muy largo, intenta acortar a 4-5 palabras significativas
    """
    t = _nfkc(area_raw).strip().lower()
    if not t:
        return ""

    # Recorte por separadores para evitar "frases kilométricas"
    parts = re.split(_SEP_CUT, t, maxsplit=1)
    t = parts[0].strip() if parts else t

    # Intento de mapeo por patrones
    for must_have, label in _CANON_MAP:
        if all(k in t for k in must_have):
            return label

    # Último recurso: quedarnos con 4-5 palabras significativas (quitando stopwords simples)
    stop = {"de","la","el","las","los","y","en","con","para","del","al","por","un","una","lo","a"}
    toks = [w for w in re.findall(r"[a-záéíóúñü]+", t) if w not in stop]
    # Intenta pares útiles
    if len(toks) >= 2:
        short = " ".join(toks[:5])
        return short
    return t[:60]

def _cv_contains(cv_low: str, tag: str) -> bool:
    """
    Búsqueda tolerante: exige que al menos 2 tokens de la etiqueta estén en el CV,
    o que la etiqueta completa aparezca (tras normalización).
    """
    tag = (tag or "").strip().lower()
    if not tag:
        return False
    if tag in cv_low:
        return True
    toks = [w for w in re.findall(r"[a-záéíóúñü]+", tag) if len(w) >= 3]
    hits = sum(1 for w in toks if w in cv_low)
    return hits >= 2

# ---------------- evaluación principal ----------------
def evaluate_requirements(texto_oferta: str, texto_cv: str):
    """Evalúa requisitos usando reglas JSON. Devuelve dict {cumple, no_cumple, alerta}."""
    oferta = _nfkc(texto_oferta or "").lower()
    cv = _nfkc(texto_cv or "").lower()
    cfg = load_rules()
    rules = cfg.get("rules", [])

    cumple: List[str] = []
    no_cumple: List[str] = []

    def any_in(text, terms):
        return any((_nfkc(t).lower() in text) for t in (terms or []))

    # --- HOTFIX mercadeo/marketing: "Mínimo X años ... mercadeo/marketing" ---
    # Motivo: hay ofertas que redactan la experiencia mínima en una sola frase;
    # este hotfix dispara exclusión si el CV no evidencia dominio + experiencia.
    try:
        m_mkt = re.search(r"(?:mínimo|minimo)\s*(\d+)\s*años[^.\n]*\b(mercadeo|marketing)\b", oferta, flags=re.IGNORECASE)
        if m_mkt:
            years_req = int(m_mkt.group(1))
            cv_has_domain = re.search(r"\b(mercadeo|marketing)\b", cv, flags=re.IGNORECASE)
            cv_has_years = re.search(r"(\d+)\s*años|\bexperienci[ae]\b", cv, flags=re.IGNORECASE)
            if not (cv_has_domain and cv_has_years):
                no_cumple.append(f"Experiencia mínima requerida: {years_req} años en mercadeo/marketing")
    except Exception:
        pass

    # --- Refuerzo "Nivel Educativo: Profesional en Mercadeo/Administración/Economía/Ing. Industrial" ---
    # Dispara exclusión si el CV no tiene ninguna de estas carreras (detección simple por palabras ancla).
    try:
        educ_line = re.search(r"nivel\s+educativo\s*:\s*([^.\n]+)", oferta, flags=re.IGNORECASE)
        if educ_line:
            educ_text = educ_line.group(1)
            triggers = [
                "profesional en mercadeo", "profesional en marketing",
                "profesional en administración", "profesional en administracion",
                "profesional en economía", "profesional en economia",
                "profesional en ingeniería industrial", "profesional en ingenieria industrial",
                "carreras afines"
            ]
            if any(t in educ_text for t in triggers):
                cv_any = [
                    "mercadeo", "marketing",
                    "administración", "administracion",
                    "economía", "economia",
                    "ingeniería industrial", "ingenieria industrial"
                ]
                if not any(k in cv for k in cv_any):
                    no_cumple.append("Título requerido: Profesional en Mercadeo/Administración/Economía/Ingeniería Industrial (o afines)")
    except Exception:
        pass    


    # --- HOTFIX ENFERMERÍA (profesión/título requerido) ---
    # Si la oferta menciona cargo/rol de enfermería y el CV no lo evidencia, excluye explícitamente.
    try:
        nurse_triggers = [
            "enfermera jefe", "enfermera líder", "enfermera lider", "enfermera coordinadora",
            "enfermera", "enfermero", "enfermería", "enfermeria",
            "profesional de enfermería", "profesional de enfermeria"
        ]
        oferta_pide_enfermeria = any(t in oferta for t in nurse_triggers) or bool(
            re.search(r"\benfermer[oa]s?\b|\benfermer[ií]a\b", oferta, flags=re.IGNORECASE)
        )

        if oferta_pide_enfermeria:
            nurse_cv_any = [
                "enfermera", "enfermero", "enfermería", "enfermeria",
                "licenciatura en enfermería", "licenciatura en enfermeria",
                "colegio de enfermería", "colegio de enfermeria",
                "rn "  # Registered Nurse (si aparece en CV importado)
            ]
            cv_evidencia_enfermeria = any(k in cv for k in nurse_cv_any) or bool(
                re.search(r"\benfermer[oa]s?\b|\benfermer[ií]a\b", cv, flags=re.IGNORECASE)
            )
            if not cv_evidencia_enfermeria:
                no_cumple.append("Título/Licencia en Enfermería requerido")
    except Exception:
        pass


    # --- Refuerzo específico: Requerimientos con posgrado en Salud (sobre base ENFERMERÍA) ---
    try:
        # Detecta frases del tipo: "Enfermera Jefe con posgrado en Auditoría en Salud / Salud Pública / Epidemiología"
        req_line = re.search(r"requerimientos\s*([\s\S]+?)\n\n", texto_oferta, flags=re.IGNORECASE)
        req_block = req_line.group(1).lower() if req_line else oferta  # usa todo si no aislamos el bloque
        if ("enfermera" in req_block or re.search(r"\benfermer[oa]\b", req_block)) and (
            "auditoría en salud" in req_block or "auditoria en salud" in req_block
            or "salud pública" in req_block or "salud publica" in req_block
            or "epidemiología" in req_block or "epidemiologia" in req_block
        ):
            # Ya habrá caído el conocimiento de auditoría; aquí reforzamos la profesión si falta en CV:
            if not (re.search(r"\benfermer[oa]s?\b|\benfermer[ií]a\b", cv, flags=re.IGNORECASE) or
                    any(k in cv for k in ["licenciatura en enfermería", "licenciatura en enfermeria",
                                          "colegio de enfermería", "colegio de enfermeria", " rn "])):
                if "Título/Licencia en Enfermería requerido" not in no_cumple:
                    no_cumple.append("Título/Licencia en Enfermería requerido")
    except Exception:
        pass


    # --- HOTFIX DOMINIOS CON EXPERIENCIA MÍNIMA (Comercial, RRHH, Auditoría, Logística/SC, Analítica/BI/Datos) ---
    # Si la oferta exige X años en un dominio y el CV no lo evidencia, excluye.
    # Además: para Comercial, si el cargo es explícito (Gerente/Director Comercial) pero el CV no evidencia dominio, también excluye.
    try:
        domains = [
            {
                "label": "área comercial/ventas",
                "offer_patterns": [
                    r"\b(gerente|director|jefe)\s+comercial\b", r"\bcomercial(es)?\b", r"\bventas?\b",
                    r"\bt[eé]cnicas\s+de\s+venta\b", r"\bventa\s+consultiva\b", r"\bpipeline\b", r"\bembudo\b"
                ],
                "cv_patterns": [
                    r"\bcomercial(es)?\b", r"\bventas?\b", r"\bventa\s+consultiva\b", r"\bcrm\b",
                    r"\bpipeline\b", r"\bembudo\b", r"\bforecast\b", r"\bcuota(s)?\b"
                ],
                "strong_role_only": True  # además del chequeo con años, dispara si hay rol fuerte sin evidencias
            },
            {
                "label": "recursos humanos",
                "offer_patterns": [
                    r"\brecursos\s+humanos\b", r"\brrhh\b", r"\btalento\s+humano\b",
                    r"\bgesti[oó]n\s+humana\b", r"\bselecci[oó]n\b", r"\breclutamiento\b"
                ],
                "cv_patterns": [
                    r"\brecursos\s+humanos\b", r"\brrhh\b", r"\btalento\s+humano\b",
                    r"\bselecci[oó]n\b", r"\breclutamiento\b", r"\bgesti[oó]n\s+humana\b"
                ],
                "strong_role_only": False
            },
            {
                "label": "auditoría",
                "offer_patterns": [
                    r"\bauditor[ií]a\b", r"\bauditor(es)?\b", r"\baudit\b"
                ],
                "cv_patterns": [
                    r"\bauditor[ií]a\b", r"\bauditor(es)?\b", r"\bcontrol\s+interno\b",
                    r"\briesgos?\b", r"\bniif\b", r"\bifrs\b"
                ],
                "strong_role_only": False
            },
            {
                "label": "logística/cadena de suministro",
                "offer_patterns": [
                    r"\blog[ií]stic[ao]\b", r"\bsupply\s*chain\b", r"\bcadena\s+de\s+suministro\b",
                    r"\balmac[eé]n\b", r"\binventari[oa]s\b", r"\bdistribuci[oó]n\b",
                    r"\bcentros?\s+de\s+distribuci[oó]n\b"
                ],
                "cv_patterns": [
                    r"\blog[ií]stic[ao]\b", r"\bsupply\s*chain\b", r"\bcadena\s+de\s+suministro\b",
                    r"\bwms\b", r"\btms\b", r"\binventari[oa]s\b", r"\bdistribuci[oó]n\b"
                ],
                "strong_role_only": False
            },
            {
                "label": "analítica/BI/datos",
                "offer_patterns": [
                    r"\banal[ií]tic[ao]\b", r"\banalytics\b", r"\bbusiness\s+intelligence\b", r"\bbi\b",
                    r"\bdatos\b", r"\bdata\b", r"\bpower\s*bi\b", r"\btableau\b", r"\blooker\b", r"\betl\b"
                ],
                "cv_patterns": [
                    r"\banal[ií]tic[ao]\b", r"\banalytics\b", r"\bbusiness\s+intelligence\b", r"\bbi\b",
                    r"\bdatos\b", r"\bdata\b", r"\bsql\b", r"\bpython\b", r"\bpower\s*bi\b", r"\btableau\b",
                    r"\blooker\b", r"\betl\b"
                ],
                "strong_role_only": False
            },
        ]

        oferta_low = oferta  # ya viene normalizada a minúsculas por _norm()
        # 1) Reglas con años de experiencia (mínimo/al menos/experiencia de X años ...)
        for d in domains:
            # ¿La oferta menciona este dominio?
            offer_mentions = any(re.search(p, oferta_low, flags=re.IGNORECASE) for p in d["offer_patterns"])
            if not offer_mentions:
                continue

            # ¿Indica años mínimos?
            m_years = re.search(
                r"(?:m[ií]n(?:imo)?|al\s+menos|experiencia\s+de)\s*(\d+)\s*a[nñ]os",
                oferta_low, flags=re.IGNORECASE
            )

            if m_years:
                years_req = int(m_years.group(1))
                # Evidencia en CV
                cv_has_domain = any(re.search(p, cv, flags=re.IGNORECASE) for p in d["cv_patterns"])
                cv_has_years  = re.search(r"(\d+)\s*a[nñ]os|\bexperienci[ae]\b", cv, flags=re.IGNORECASE)
                if not (cv_has_domain and cv_has_years):
                    no_cumple.append(f"Experiencia mínima requerida: {years_req} años en {d['label']}")
            else:
                # 2) Solo para Comercial: si hay rol fuerte (Gerente/Director/Jefe Comercial) y CV no evidencia dominio
                if d.get("strong_role_only"):
                    strong_role = re.search(r"\b(gerente|director|jefe)\s+comercial\b", oferta_low, flags=re.IGNORECASE)
                    if strong_role:
                        cv_has_domain = any(re.search(p, cv, flags=re.IGNORECASE) for p in d["cv_patterns"])
                        if not cv_has_domain:
                            no_cumple.append("Experiencia requerida en área comercial/ventas no evidenciada")
    except Exception:
        pass



    # 1) Experiencia mínima (con dominio)
    rex = cfg.get("experience_regex")
    if rex:
        # Dominio: mapeo de palabras clave → etiqueta amigable
        domain_map = [
            (r"(servicios\s+compartidos|shared\s+services|ssc)", "servicios compartidos (ssc)"),
            (r"(mercadeo|marketing)", "mercadeo/marketing"),
            (r"(comercial|ventas)", "área comercial/ventas"),
            (r"(log[ií]stic[ao]|supply\s+chain|cadena\s+de\s+suministro)", "logística/cadena de suministro"),
            (r"(sector\s+salud|hospital|cl[ií]nica|ips)", "sector salud"),
            (r"(financier[oa]|banca|entidad\s+financiera)", "sector financiero"),
        ]

        lines = oferta.splitlines() or [oferta]
        extracted_domain = None
        required_years = None

        # Busca 'Mínimo X años...' en cada línea, sin sensibilidad a mayúsculas
        for raw in lines:
            low = raw.lower()
            m = re.search(rex, low, flags=re.IGNORECASE)
            if not m:
                continue
            try:
                years = int(m.group(2))
            except Exception:
                continue

            # intenta atar el dominio usando el resto de la línea
            dom = None
            for pat, label in domain_map:
                if re.search(pat, low, flags=re.IGNORECASE):
                    dom = label
                    break

            if dom:
                extracted_domain = dom
                required_years = years
                break

        if extracted_domain and required_years is not None:
            # Evidencia de dominio + experiencia en CV
            dom_hint = any(re.search(pat, cv, flags=re.IGNORECASE)
                           for pat, label in domain_map if label == extracted_domain)
            has_years = bool(re.search(r"(\d+)\s*años|\bexperienci[ae]\b", cv, flags=re.IGNORECASE))
            if not (dom_hint and has_years):
                no_cumple.append(f"Experiencia mínima requerida: {required_years} años en {extracted_domain}")
        else:
            # sin dominio explícito; usa el comportamiento general
            m = re.search(rex, oferta, flags=re.IGNORECASE)
            if m:
                try:
                    years = int(m.group(2))
                    if not re.search(r"(\d+\s*años)|\bexperienci[ae]\b", cv, flags=re.IGNORECASE):
                        no_cumple.append(f"Experiencia mínima requerida: {years} años")
                except Exception:
                    pass


    # 1.b) Experiencia mínima por dominio (mercadeo, comercial, logística, etc.)
    try:
        exp_domains = _find_experience_domains(oferta)
        for years, dom_label in exp_domains:
            if not _cv_mentions_domain(cv, dom_label):
                no_cumple.append(f"Experiencia mínima requerida: {years} años en {dom_label}")
    except Exception:
        pass

    try:
    # Dispara si la oferta exige "Profesional en Mercadeo/Administración/Economía/Ing. Industrial"
        degree_triggers = [
            "profesional en mercadeo", "profesional en marketing",
            "profesional en administración", "profesional en administracion",
            "profesional en economía", "profesional en economia",
            "profesional en ingeniería industrial", "profesional en ingenieria industrial",
        ]
        degree_cv_any = [
            "mercadeo", "marketing",
            "administración", "administracion",
            "economía", "economia",
            "ingeniería industrial", "ingenieria industrial"
        ]
        oferta_has_degree = any(t in oferta for t in degree_triggers)
        if oferta_has_degree:
            if not any(k in cv for k in degree_cv_any):
                no_cumple.append("Título requerido: Profesional en Mercadeo/Administración/Economía/Ingeniería Industrial (o afines)")
    except Exception:
        pass

    # 2) Reglas declarativas (idiomas/sectores/herramientas/conocimiento/profesión)
    for rule in rules:
        rtype = rule.get("type")
        trig = [ _nfkc(x).lower() for x in rule.get("trigger_any", []) ]
        cv_need = [ _nfkc(x).lower() for x in rule.get("cv_any", []) ]

        # ¿La oferta pide esto?
        if not trig or not any_in(oferta, trig):
            continue

        # Evidencia fuerte opcional (evita falsos positivos)
        require_any = [ _nfkc(x).lower() for x in rule.get("require_any", []) ]
        if require_any and not any_in(oferta, require_any):
            continue

        # ===== Idiomas =====
        if rtype == "language":
            lvl_regex = rule.get("level_regex")
            lvl_syn   = rule.get("level_synonyms") or {}

            req_level = extract_level(oferta, lvl_regex, lvl_syn)
            cv_mentions = any_in(cv, trig)
            cv_level    = extract_level(cv, lvl_regex, lvl_syn) if cv_mentions else None

            if not cv_mentions:
                no_cumple.append(f"{rule.get('label')}")
            else:
                if not compare_levels(cv_level, req_level):
                    base = (rule.get('label') or "Idioma requerido").split()[0]
                    if req_level:
                        no_cumple.append(f"{base} nivel {req_level.upper()} requerido")
                    else:
                        no_cumple.append(f"Nivel de {base.lower()} no evidenciado")
            continue

        # ===== Profesión =====
        if rtype == "profession":
            if not any_in(cv, cv_need):
                no_cumple.append(rule["label"])
            continue

        # ===== Sectores / Conocimientos / Herramientas / Certs =====
        if not any_in(cv, cv_need):
            no_cumple.append(rule["label"])

    # 3) Captura libre: viñetas/prefijos → CANONICALIZACIÓN
    prefixes = [ _nfkc(p).lower() for p in (cfg.get("knowledge_prefixes", []) or []) ]
    headers  = [ _nfkc(h).lower() for h in (cfg.get("knowledge_section_headers", []) or []) ]
    bullets  = cfg.get("bullet_markers", ["•","-","*","·"])

    if prefixes:
        lines = oferta.splitlines()
        extracted = []

        # 3a) Líneas que empiezan por prefijo
        for l in lines:
            low = _nfkc(l.strip().strip("•-*· ")).lower()
            for p in prefixes:
                if low.startswith(p + " "):
                    body = low[len(p)+1:].strip(" .:;")
                    if body:
                        extracted.append(body)
                    break

        # 3b) Viñetas bajo cabeceras (solo cabeceras de conocimiento, NUNCA “responsabilidades”)
        for i, raw in enumerate(lines):
            low = _nfkc(raw.strip().strip(":")).lower()
            if any(h in low for h in headers):
                j = i + 1
                while j < len(lines):
                    t = lines[j].rstrip()
                    if not t:
                        break
                    if any(h in _nfkc(t).lower() for h in headers):
                        break
                    if t and (t[0:1] in bullets):
                        token = _nfkc(t.lstrip("".join(bullets)).strip(" .:;")).lower()
                        if token:
                            extracted.append(token)
                    else:
                        # si deja de haber viñetas, detenemos el bloque
                        if len(t.split()) < 2:
                            break
                    j += 1

        # Canonicalizar y validar
        canon = []
        for area in extracted:
            short = _canonicalize_requirement(area)
            # filtrar ruido genérico demasiado corto/largo
            if not short or len(short) < 3:
                continue
            if len(short.split()) > 7:
                short = " ".join(short.split()[:7])
            canon.append(short)

        # chequeo en CV (tolerante)
        for tag in canon:
            if not _cv_contains(cv, tag):
                no_cumple.append(f"Conocimiento requerido: {tag}")

    alerta = True if no_cumple else False
    if not alerta:
        cumple.append("Cumple con requisitos básicos del cargo")

    # aprendizaje: incrementa contador por cada etiqueta incumplida
    try:
        for tag in no_cumple:
            learn_requirement(tag, 1)
    except Exception:
        pass

    return {"cumple": cumple, "no_cumple": no_cumple, "alerta": alerta}
