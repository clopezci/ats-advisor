==========================================================
   ATS ADVISOR - PROYECTO TFM (CARLOS EMILIO LÓPEZ)
==========================================================

📘 UNIVERSIDAD INTERNACIONAL DE VALENCIA (VIU)
🎓 Trabajo Fin de Máster – Máster en Gestión de Tecnologías de la Información (2025)
👨‍💻 Autor: Carlos Emilio López
✉️ Correo de contacto: clopezci@hotmail.com
📁 Versión: V2 – Código Abierto Educativo
© 2025 Carlos Emilio López / Universidad Internacional de Valencia (VIU)

==========================================================
🧩 DESCRIPCIÓN GENERAL
----------------------------------------------------------
ATS Advisor es una herramienta de análisis semántico basada en procesamiento del lenguaje natural (NLP) con spaCy,
diseñada para evaluar la compatibilidad entre una hoja de vida (CV) y una oferta laboral,
simulando el funcionamiento de un sistema ATS (Applicant Tracking System).

El sistema fue desarrollado como proyecto académico del TFM, con el propósito de apoyar la empleabilidad mediante
tecnología de análisis de texto, ética y responsable.

Incluye:
✅ Análisis ponderado por categorías (técnicas, blandas y experiencia)
✅ Validación de requisitos excluyentes (idiomas, títulos, años, certificaciones, sectores)
✅ Autoaprendizaje adaptativo de nuevas habilidades detectadas en ofertas
✅ Exportación profesional a PDF o TXT
✅ Advertencias éticas y recomendaciones formativas
✅ Módulo de gestión de “ruido” (palabras irrelevantes o repetitivas)

==========================================================
📂 ESTRUCTURA DEL PROYECTO
----------------------------------------------------------
Ruta instalada:
#C:\Users\probook\OneDrive\Documentos\ProyectosSoftware\prototipo-empleabilidad
https://github.com/clopezci/ats-advisor/releases
Estructura esperada:

│
├── main.py
├── run.bat
├── README.txt
├── license.txt
└── modules\
    ├── __init__.py
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

==========================================================
💻 REQUISITOS DEL SISTEMA
----------------------------------------------------------
- Windows 10 u 11
- Python 3.10+ (recomendado vía Anaconda o Miniconda)
- Espacio libre mínimo: 250 MB
- Modelo spaCy: es_core_news_lg

Dependencias principales:
spacy
PyPDF2
python-docx
reportlab

Instalación rápida de dependencias: (escribir esto en el prompt de comandos)
pip install spacy PyPDF2 python-docx reportlab
python -m spacy download es_core_news_lg

==========================================================
▶️ MÉTODOS DE EJECUCIÓN
----------------------------------------------------------
Opción 1 – Entorno Python (modo desarrollo)
1. Abre Anaconda Prompt
2. Crea y activa el entorno:
   conda create -n ats-advisor python=3.10 -y
   conda activate ats-advisor
3. Instala dependencias
4. Ejecuta:
   python -X utf8 main.py

Opción 2 – Ejecución rápida (.bat)
1. Doble clic sobre run.bat
2. Espera que aparezca el menú principal
3. Sigue las opciones:
   1️⃣ Cargar CV (.pdf o .docx)
   2️⃣ Cargar texto de oferta y analizar
   3️⃣ Salir
   4️⃣ Gestionar “ruido” aprendido

Opción 3 – Versión V2 (.EXE)
El proyecto puede distribuirse en versión empaquetada (sin Python instalado) mediante PyInstaller e instalador Inno Setup.
Ruta del ejecutable de prueba local:
dist\ATS-Advisor\ATS-Advisor.exe

Nota: La versión descargable (V2) estará disponible en la sección “Releases” del repositorio cuando se publique.


==========================================================
🧮 FUNCIONALIDADES CLAVE
----------------------------------------------------------
- Análisis inteligente entre CV y oferta laboral.
- Identificación de títulos, idiomas, años de experiencia, certificaciones y sectores.
- Detección de exclusión automática (por falta de idioma, título o dominio).
- Mensajes de compatibilidad ponderada:
  🟢 Alta compatibilidad (>80%)
  🟡 Media compatibilidad (40–79%)
  🔴 Baja compatibilidad (<40%)
- Exportación profesional en PDF o TXT.
- Autoaprendizaje dinámico: registra nuevas habilidades emergentes.

==========================================================
📄 INFORME EXPORTADO
----------------------------------------------------------
El informe incluye:
- Porcentaje total de coincidencia
- Detalle por categoría
- Requisitos excluyentes cumplidos/no cumplidos
- Sugerencias formativas personalizadas
- Advertencias éticas y observaciones
- Recomendaciones finales

==========================================================
⚡ POSIBLES ERRORES Y SOLUCIONES
----------------------------------------------------------
“No se encuentra el modelo es_core_news_lg” → python -m spacy download es_core_news_lg
“El PDF no contiene texto” → Convertir a DOCX o usar OCR
“Falta la librería reportlab” → pip install reportlab
“Error al abrir ventana de selección” → Ejecutar desde consola con python -X utf8 main.py

==========================================================
⚖️ LICENCIA Y PROPIEDAD INTELECTUAL
----------------------------------------------------------
ATS Advisor es un proyecto de código abierto con fines educativos y de investigación.

Propiedad Intelectual:
© 2025 Carlos Emilio López
© 2025 Universidad Internacional de Valencia (VIU)

Licencia de uso:
Este software se distribuye bajo una Licencia Académica Abierta,
que permite su uso, copia y adaptación siempre que se reconozca la autoría.
Prohibida su comercialización sin autorización escrita.

==========================================================
⚠️ DESCARGO DE RESPONSABILIDAD
----------------------------------------------------------
El software se proporciona “tal cual”, sin garantía de precisión o idoneidad comercial.
Ni el autor ni la universidad son responsables de decisiones basadas en sus resultados.
Su uso es voluntario y exclusivamente con fines educativos o demostrativos.

==========================================================
🧠 CRÉDITOS Y CONTACTO
----------------------------------------------------------
Autor principal: Carlos Emilio López
Correo: clopezci@hotmail.com

Institución: Universidad Internacional de Valencia (VIU)
Máster en Gestión de Tecnologías de la Información

Proyecto académico TFM:
“Desarrollo de una herramienta semántica de apoyo a la empleabilidad mediante simulación de sistemas ATS”

Atribución recomendada:
“Basado en el proyecto ATS Advisor, desarrollado por Carlos Emilio López
(Trabajo Fin de Máster, Universidad Internacional de Valencia – VIU, 2025).”

==========================================================
🤝 CONTRIBUCIÓN Y CÓDIGO ABIERTO
----------------------------------------------------------
Este proyecto es de código abierto.
Los usuarios pueden mejorarlo, traducirlo o integrarlo con nuevas tecnologías,
manteniendo la referencia y autoría originales.

==========================================================
💬 MENSAJE FINAL
----------------------------------------------------------
ATS Advisor es una herramienta con propósito social, educativo y tecnológico.
Nació como proyecto académico para ayudar a las personas a mejorar su empleabilidad,
comprender cómo operan los sistemas ATS y promover el uso ético de la IA.

Carlos Emilio López – 2025
© Universidad Internacional de Valencia (VIU)
Contacto: clopezci@hotmail.com
“La tecnología con propósito humano transforma realidades.”
==========================================================