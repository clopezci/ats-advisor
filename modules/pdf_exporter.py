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
# pdf_exporter.py - Exportación de resultados (PDF si hay ReportLab; si no, TXT)
# ==========================
# - Importación perezosa de reportlab (evita crash si no está instalado)
# - Fallback automático a .txt con contenido legible si falta reportlab
#
# Autor: Carlos Emilio López (Proyecto TFM)
# ===========================================

import datetime
from tkinter import filedialog, Tk

# ----------------------------------------------------
# Fallback TXT (si no hay reportlab)
# ----------------------------------------------------
def _exportar_txt(nombre_sugerido, resultado_dict):
    """Exporta un informe de texto plano (.txt) cuando reportlab no está disponible."""
    root = Tk()
    root.withdraw()
    try:
        nombre_archivo = (nombre_sugerido or "analisis_ats").replace(" ", "_").lower() + ".txt"

        ruta_salida = filedialog.asksaveasfilename(
            defaultextension=".txt",
            filetypes=[("Text files", "*.txt")],
            initialfile=nombre_archivo,
            title="Guardar análisis como TXT (ReportLab no instalado)"
        )
    finally:
        try:
            root.destroy()
        except Exception:
            pass

    if not ruta_salida:
        print("⚠️ Exportación cancelada por el usuario.")
        return None

    # Construimos el texto básico del informe
    lineas = []
    lineas.append("RESULTADO DEL ANÁLISIS CV VS OFERTA")
    lineas.append("Fecha: " + datetime.datetime.now().strftime("%Y-%m-%d %H:%M"))
    lineas.append("")
    total_pct = resultado_dict.get("total", 0)
    nivel = resultado_dict.get("nivel", "N/D")
    lineas.append(f"COINCIDENCIA TOTAL: {total_pct}%")
    lineas.append(f"Nivel de compatibilidad: {nivel}")
    lineas.append("")

    # Categorías
    lineas.append("RESULTADOS POR CATEGORÍA:")
    categorias = resultado_dict.get("categorias", {}) or {}
    for cat, datos in categorias.items():
        porcentaje = datos.get("porcentaje", 0)
        reconocidas = ", ".join(sorted(datos.get("reconocidas") or []))
        faltantes = ", ".join(sorted(datos.get("faltantes") or []))
        lineas.append(f"- {cat.capitalize()}: {porcentaje}%")
        if reconocidas:
            lineas.append(f"   ✅ Reconocidas: {reconocidas}")
        if faltantes:
            lineas.append(f"   🔍 Faltantes : {faltantes}")
        lineas.append("")
    lineas.append("")

    # Excluyentes
    reqs = resultado_dict.get("requisitos_excluyentes") or {}
    if reqs:
        lineas.append("REQUISITOS EXCLUYENTES DETECTADOS:")
        if reqs.get("cumple"):
            lineas.append("   ✅ Cumplidos:")
            for r in reqs["cumple"]:
                lineas.append(f"   - {r}")
        if reqs.get("no_cumple"):
            lineas.append("   ❌ No cumplidos (riesgo de exclusión):")
            for r in reqs["no_cumple"]:
                lineas.append(f"   - {r}")
        lineas.append("")

    # Sugerencias de mejora
    sugerencias = resultado_dict.get("sugerencias") or []
    if sugerencias:
        lineas.append("OPORTUNIDADES DE MEJORA:")
        lineas.append(", ".join(sorted(sugerencias)))
        lineas.append("")

    # Formación
    formacion = resultado_dict.get("sugerencias_formacion") or []
    if formacion:
        lineas.append("SUGERENCIAS DE FORMACIÓN:")
        for sf in formacion:
            lineas.append(f"- {sf}")
        lineas.append("")

    # Advertencia
    advert = resultado_dict.get("advertencia")
    if advert:
        lineas.append("ADVERTENCIA ÉTICA DETECTADA:")
        lineas.append(advert)
        lineas.append("")

    # Recomendaciones
    recs = resultado_dict.get("recomendaciones") or []
    lineas.append("RECOMENDACIONES ÉTICAS:")
    if recs:
        for rec in recs:
            lineas.append(f"- {rec}")
    else:
        lineas.append("- Sin recomendaciones adicionales.")
    lineas.append("")
    lineas.append("Análisis generado por ATS Advisor - Proyecto TFM")
    lineas.append("Universidad Internacional de Valencia (VIU)")
    lineas.append("© Carlos Emilio López - 2025")
    lineas.append("© clopezci@htmail.com")

    # Guardar archivo
    with open(ruta_salida, "w", encoding="utf-8", errors="ignore") as f:
        f.write("\n".join(lineas))

    print("ℹ️ ReportLab no estaba instalado. Se generó un TXT con el informe.")
    return ruta_salida

# ----------------------------------------------------
# Exportación principal (PDF si hay reportlab)
# ----------------------------------------------------
def exportar_resultado_pdf(nombre_sugerido, resultado_dict):
    """
    Exporta los resultados del análisis a PDF; si falta ReportLab,
    ofrece fallback a TXT automáticamente.
    """
    # Intento de importación perezosa de reportlab
    try:
        from reportlab.lib.pagesizes import letter
        from reportlab.platypus import (
            SimpleDocTemplate, Paragraph, Spacer, ListFlowable, ListItem
        )
        from reportlab.lib.styles import getSampleStyleSheet
        from reportlab.lib.enums import TA_LEFT
    except ImportError:
        print("⚠️ Falta la librería 'reportlab'. Se usará un informe .txt como fallback.")
        return _exportar_txt(nombre_sugerido, resultado_dict)

    # Si sí hay reportlab, generamos PDF normal
    root = Tk()
    root.withdraw()
    try:
        nombre_archivo = (nombre_sugerido or "analisis_ats").replace(" ", "_").lower() + ".pdf"

        ruta_salida = filedialog.asksaveasfilename(
            defaultextension=".pdf",
            filetypes=[("PDF files", "*.pdf")],
            initialfile=nombre_archivo,
            title="Guardar análisis como PDF"
        )
    finally:
        try:
            root.destroy()
        except Exception:
            pass

    if not ruta_salida:
        print("⚠️ Exportación cancelada por el usuario.")
        return None

    # --- Estilos ---
    styles = getSampleStyleSheet()
    style_normal = styles["Normal"]
    style_normal.fontSize = 10
    style_normal.leading = 14

    style_title = styles["Heading1"]
    style_title.alignment = TA_LEFT
    style_title.fontSize = 14
    style_title.leading = 18

    style_subtitle = styles["Heading2"]
    style_subtitle.fontSize = 12
    style_subtitle.leading = 16

    # --- Documento ---
    doc = SimpleDocTemplate(
        ruta_salida,
        pagesize=letter,
        rightMargin=50,
        leftMargin=50,
        topMargin=50,
        bottomMargin=50
    )

    elements = []

    # Encabezado
    elements.append(Paragraph("📄 RESULTADO DEL ANÁLISIS CV VS OFERTA", style_title))
    elements.append(Paragraph("Fecha: " + datetime.datetime.now().strftime("%Y-%m-%d %H:%M"), style_normal))
    elements.append(Spacer(1, 12))

    # Resumen
    total_pct = resultado_dict.get("total", 0)
    nivel = resultado_dict.get("nivel", "N/D")
    elements.append(Paragraph(f"COINCIDENCIA TOTAL: {total_pct}%", style_subtitle))
    elements.append(Paragraph("Nivel de compatibilidad: " + (nivel or "N/D"), style_normal))
    elements.append(Spacer(1, 12))

    # Categorías
    elements.append(Paragraph("📊 Resultados por categoría:", style_subtitle))
    categorias = resultado_dict.get("categorias", {}) or {}
    for cat, datos in categorias.items():
        porcentaje = datos.get("porcentaje", 0)
        reconocidas = datos.get("reconocidas", []) or []
        faltantes = datos.get("faltantes", []) or []

        elements.append(Paragraph(f"- {cat.capitalize()}: {porcentaje}%", style_normal))
        if reconocidas:
            elements.append(Paragraph(f"   ✅ Reconocidas: {', '.join(sorted(reconocidas))}", style_normal))
        if faltantes:
            elements.append(Paragraph(f"   🔍 Faltantes : {', '.join(sorted(faltantes))}", style_normal))
        elements.append(Spacer(1, 6))
    elements.append(Spacer(1, 12))

    # Requisitos excluyentes
    reqs = resultado_dict.get("requisitos_excluyentes")
    if reqs:
        elements.append(Paragraph("📌 Requisitos excluyentes detectados:", style_subtitle))
        if reqs.get("cumple"):
            items = [ListItem(Paragraph(r, style_normal)) for r in reqs["cumple"]]
            elements.append(Paragraph("   ✅ Cumplidos:", style_normal))
            elements.append(ListFlowable(items, bulletType="bullet"))
        if reqs.get("no_cumple"):
            items = [ListItem(Paragraph(r, style_normal)) for r in reqs["no_cumple"]]
            elements.append(Paragraph("   ❌ No cumplidos (riesgo de exclusión):", style_normal))
            elements.append(ListFlowable(items, bulletType="bullet"))
        elements.append(Spacer(1, 12))

    # Oportunidades de mejora
    sugerencias = resultado_dict.get("sugerencias") or []
    if sugerencias:
        elements.append(Paragraph("💡 Oportunidades de mejora:", style_subtitle))
        elements.append(Paragraph(", ".join(sorted(sugerencias)), style_normal))
        elements.append(Spacer(1, 12))

    # Formación
    formacion = resultado_dict.get("sugerencias_formacion") or []
    if formacion:
        elements.append(Paragraph("🎓 Sugerencias de formación:", style_subtitle))
        items = [ListItem(Paragraph(sf, style_normal)) for sf in formacion]
        elements.append(ListFlowable(items, bulletType="bullet"))
        elements.append(Spacer(1, 12))

    # Advertencia ética
    advert = resultado_dict.get("advertencia")
    if advert:
        elements.append(Paragraph("⚠️ Advertencia ética detectada:", style_subtitle))
        elements.append(Paragraph(advert, style_normal))
        elements.append(Spacer(1, 12))

    # Recomendaciones
    recs = resultado_dict.get("recomendaciones") or []
    elements.append(Paragraph("📝 Recomendaciones éticas:", style_subtitle))
    if recs:
        items = [ListItem(Paragraph(rec, style_normal)) for rec in recs]
        elements.append(ListFlowable(items, bulletType="bullet"))
    else:
        elements.append(Paragraph("Sin recomendaciones adicionales.", style_normal))
    elements.append(Spacer(1, 20))

    # Pie
    elements.append(Paragraph("Análisis generado por ATS Advisor - Proyecto TFM", style_normal))
    elements.append(Paragraph("© Carlos Emilio López - 2025, clopezci@hotmail.com", style_normal))

    # Construcción
    doc.build(elements)

    return ruta_salida
