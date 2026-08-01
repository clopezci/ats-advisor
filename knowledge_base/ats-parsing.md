# Conocimiento ATS — parse y buenas prácticas

## Reglas generales
- Preferir una columna, tipografía estándar, PDF con texto seleccionable.
- Evitar tablas complejas, texto en imágenes, iconos que reemplazan palabras.
- Fechas consistentes (MM/AAAA).
- Logros cuantificados (%, dinero, tiempo, alcance).

## Por motor
### Workday
Sensibles a columnas y encabezados gráficos. Secciones claras.

### Greenhouse / Lever
Buen soporte de una columna; keywords en experiencia y skills.

### Taleo / SuccessFactors / SAP
Más estrictos con parse; evitar diseños creativos.

## Anti-trampas
No usar texto blanco, font 1px ni keyword stuffing. Los ATS modernos penalizan.

## Match semántico (ATSAdvisor)
Además de keywords exactas, el motor calcula solape bag-of-words (cosine) entre CV y oferta
y lo mezcla (~18%) con el score de cobertura. No sustituye embeddings vectoriales cloud,
pero reduce falsos negativos por sinónimos parciales y orden de palabras.

