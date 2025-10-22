# ATS Advisor

> Herramienta gratuita para comparar una hoja de vida (CV) con una oferta laboral, simulando el comportamiento de un sistema ATS (Applicant Tracking System).

[![Download](https://img.shields.io/badge/Download-Windows%20Installer-blue?logo=windows)](https://github.com/clopezci/ats-advisor/releases/download/v1.0.0/ATS-Advisor-Setup-v2.0.exe)
[![Release](https://img.shields.io/badge/Release-v1.0.0-brightgreen)](https://github.com/clopezci/ats-advisor/releases/tag/v1.0.0)

---

## 🚀 Descarga e instalación (Windows)

1. Descarga el instalador:  
   👉 **[ATS-Advisor-Setup-v2.0.exe](https://github.com/clopezci/ats-advisor/releases/download/v1.0.0/ATS-Advisor-Setup-v2.0.exe)**
2. Ejecuta el instalador (siguiente → siguiente).
3. Abre **ATS Advisor** desde el acceso directo del escritorio o menú inicio.

> **Nota:** la primera ejecución puede tardar unos segundos mientras se inicia el modelo de lenguaje de spaCy.

---

## 🧠 ¿Qué hace?

- Analiza CV (.pdf/.docx) vs. oferta (texto pegado) por **técnicas, blandas y experiencia**.  
- Detecta **requisitos excluyentes** (idiomas, profesión/títulos, sectores, años de experiencia, etc.).  
- Sugerencias de mejora y formación.  
- Exporta un informe **PDF/TXT** con los resultados.  
- **Autoaprende** términos nuevos del mercado (base local JSON).

---

## 📸 Uso rápido

1. Opción **1**: Cargar CV (se queda guardado para siguientes análisis).  
2. Opción **2**: Pegar texto de la oferta y analizar.  
3. (Opcional) Guardar informe **PDF/TXT**.  
4. (Opcional) Guardar conceptos detectados para mejorar análisis futuros.

---

## ⚠️ Alcance y aclaraciones

- Esta versión está optimizada para **ofertas en español** (modelo `es_core_news_lg`).  
- Si pegas una oferta en inglés, el sistema mostrará un aviso de idioma o resultados limitados.  
- Los análisis son heurísticos; **no reemplazan** procesos formales de selección.

---

## 📬 Autor y contacto

**Carlos Emilio López**  
Proyecto TFM – Máster en Gestión de Tecnologías de la Información (VIU)  
📧 clopezci@hotmail.com

---

## 📝 Licencia y uso académico

Este software se publica como **código abierto** con fines académicos y de demostración.  
© 2025 – Carlos Emilio López & Universidad Internacional de Valencia (VIU).  
Se permite su uso, mejora y redistribución citando la fuente original y manteniendo este aviso.

---

## 🛠️ Desarrolladores

- Código fuente: `main.py`, `modules/`  
- Reglas/autoaprendizaje en JSON:  
  - `modules/requirements_rules.json`  
  - `modules/requirements_learned.json`  
  - `modules/skills_custom.json`  
  - `modules/noise_terms.json`

### Estructura

├─ main.py
├─ run.bat
├─ modules/
│ ├─ analisis_basico.py
│ ├─ carga_archivos.py
│ ├─ habilidades.py
│ ├─ requisitos.py
│ ├─ pdf_exporter.py
│ ├─ requirements_rules.json
│ ├─ requirements_learned.json
│ ├─ skills_custom.json
│ └─ noise_terms.json

- Página de release: https://github.com/clopezci/ats-advisor/releases/tag/v1.0.0  
- Descarga directa del instalador:  
  https://github.com/clopezci/ats-advisor/releases/download/v1.0.0/ATS-Advisor-Setup-v2.0.exe
