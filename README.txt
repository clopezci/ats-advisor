==========================================================
ATS ADVISOR
==========================================================

Herramienta tecnológica de análisis y mejora de postulaciones laborales

Desarrollado por Carlos Emilio López
Versión: V2 – Edición Abierta
© 2025 Carlos Emilio López

Contacto: clopezci@hotmail.com

Repositorio oficial:
https://github.com/clopezci/ats-advisor/releases

🧩 DESCRIPCIÓN GENERAL

ATS Advisor es una herramienta de análisis semántico basada en procesamiento del lenguaje natural (NLP) con spaCy, diseñada para evaluar la compatibilidad entre una hoja de vida (CV) y una oferta laboral, simulando el funcionamiento de un sistema ATS (Applicant Tracking System).

Su propósito es mejorar la empleabilidad mediante tecnología accesible, análisis estructurado y recomendaciones éticas.

El proyecto fue desarrollado inicialmente en el contexto de un Trabajo Fin de Máster en Gestión de Tecnologías, y actualmente evoluciona como una iniciativa independiente con propósito educativo y social.

Incluye:

✅ Análisis ponderado por categorías (técnicas, blandas y experiencia)
✅ Validación de requisitos excluyentes (idiomas, títulos, años, certificaciones, sectores)
✅ Autoaprendizaje adaptativo de nuevas habilidades detectadas en ofertas
✅ Exportación profesional a PDF o TXT
✅ Advertencias éticas y recomendaciones formativas
✅ Módulo de gestión de “ruido” (palabras irrelevantes o repetitivas)

📂 ESTRUCTURA DEL PROYECTO

Estructura base:

│
├── main.py
├── run.bat
├── README.md
├── LICENSE
└── modules\
  ├── init.py
  ├── analisis_basico.py
  ├── carga_archivos.py
  ├── habilidades.py
  ├── pdf_exporter.py
  └── requisitos.py
│
├── requirements.txt
├── requirements_rules.json
├── skills_custom.json
├── noise_terms.json
└── requirements_learned.json

💻 REQUISITOS DEL SISTEMA

Windows 10 u 11

Python 3.10+

Espacio libre mínimo: 250 MB

Modelo spaCy: es_core_news_lg

Dependencias principales:

spacy
PyPDF2
python-docx
reportlab

Instalación rápida:

pip install spacy PyPDF2 python-docx reportlab
python -m spacy download es_core_news_lg

▶️ MÉTODOS DE EJECUCIÓN
Opción 1 – Entorno Python (modo desarrollo)

Crear entorno:
conda create -n ats-advisor python=3.10 -y
conda activate ats-advisor

Instalar dependencias

Ejecutar:
python -X utf8 main.py

Opción 2 – Ejecución rápida (.bat)

Doble clic sobre run.bat

Aparece el menú principal

Opciones disponibles:
1️⃣ Cargar CV (.pdf o .docx)
2️⃣ Cargar oferta laboral y analizar
3️⃣ Salir
4️⃣ Gestionar términos de “ruido” aprendidos

Opción 3 – Versión ejecutable (.EXE)

El proyecto puede distribuirse en versión empaquetada mediante PyInstaller e instalador Inno Setup, permitiendo su uso sin necesidad de instalar Python.

La versión descargable estará disponible en la sección “Releases” del repositorio oficial.

🧮 FUNCIONALIDADES CLAVE

Análisis estructurado entre CV y oferta laboral

Identificación de títulos, idiomas, años de experiencia, certificaciones y sectores

Detección de exclusión automática por incumplimiento de requisitos críticos

Clasificación de compatibilidad:
🟢 Alta (>80%)
🟡 Media (40–79%)
🔴 Baja (<40%)

Exportación profesional en PDF o TXT

Autoaprendizaje dinámico de nuevas habilidades detectadas

📄 INFORME EXPORTADO

El informe incluye:

Porcentaje total de coincidencia

Detalle por categoría

Requisitos excluyentes cumplidos / no cumplidos

Sugerencias formativas personalizadas

Advertencias éticas

Recomendaciones finales

⚡ POSIBLES ERRORES Y SOLUCIONES

“No se encuentra el modelo es_core_news_lg”
→ python -m spacy download es_core_news_lg

“El PDF no contiene texto”
→ Convertir a DOCX o aplicar OCR

“Falta la librería reportlab”
→ pip install reportlab

“Error al abrir ventana”
→ Ejecutar desde consola con python -X utf8 main.py

⚖️ LICENCIA Y PROPIEDAD INTELECTUAL

© 2025 Carlos Emilio López

ATS Advisor es un proyecto de código abierto con fines educativos, investigativos y de apoyo social.

Licencia:

Se permite el uso, copia y adaptación del software siempre que se reconozca la autoría original.
Cualquier uso comercial deberá contar con autorización expresa del autor.

(Esta licencia podrá evolucionar en futuras versiones según la estrategia del proyecto.)

⚠️ DESCARGO DE RESPONSABILIDAD

El software se proporciona “tal cual”, sin garantía de precisión absoluta o idoneidad para fines comerciales.

No reemplaza asesoría profesional en procesos de selección ni garantiza resultados laborales.

Su uso es voluntario y tiene fines educativos, informativos y de apoyo.

🤝 CONTRIBUCIÓN Y CÓDIGO ABIERTO

Este proyecto puede evolucionar mediante mejoras, traducciones o integración con nuevas tecnologías, siempre respetando la autoría original.
----------------------------------------------------------
🎨 ATRIBUCIÓN DE RECURSOS GRÁFICOS
----------------------------------------------------------

Algunas imágenes utilizadas en el módulo de donación fueron diseñadas por:

Designed by upklyak / Freepik

Se utilizan bajo los términos de licencia del proveedor.
El texto completo de la licencia se encuentra en:

assets/donacion/license.txt


💬 MENSAJE FINAL

ATS Advisor es una herramienta tecnológica con propósito social y educativo.

Su objetivo es democratizar el entendimiento de cómo funcionan los sistemas ATS, reducir la desinformación en procesos de selección y fomentar el uso ético de la inteligencia artificial aplicada a la empleabilidad.

Si esta herramienta te resultó útil, puedes apoyarla de forma voluntaria invitando una botella de agua o un café. Tu apoyo ayuda a mantener y mejorar el proyecto.

ATS Advisor se encuentra en una versión inicial funcional y en evolución continua. Aunque incorpora múltiples reglas, 
validaciones y aprendizaje adaptativo, es posible que no contemple todas las particularidades o variaciones existentes 
en las ofertas laborales reales. Si identificas algún caso específico que consideres relevante mejorar o incorporar en futuras versiones, 
puedes escribir al correo de contacto. Tu retroalimentación contribuye a fortalecer y ampliar el alcance de la herramienta.

Carlos Emilio López – 2026
“La tecnología con propósito humano transforma realidades.”