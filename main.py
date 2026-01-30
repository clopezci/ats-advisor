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
# main.py - Interfaz principal del ATS Advisor (versión robusta + CV persistente)
# ==========================
# Permite:
#   1. Cargar un CV (.pdf/.docx)
#   2. Cargar oferta y analizar (ponderación por categorías + excluyentes)
#   3. Autoaprendizaje de nuevas skills
#   4. Exportar resultados a PDF
#
# Mejora 2025-10-21:
#   - Persistencia del CV: recuerda el último CV utilizado y pregunta si reutilizarlo.
#   - Flujo de reutilización: si el usuario no quiere reutilizar, puede cargar otro CV en el mismo paso.
#
# Autor: Carlos Emilio López (Proyecto TFM)
# ===========================================

import os
import json
import time
from modules import carga_archivos, analisis_basico, habilidades
from modules.analisis_basico import contiene_lista_sospechosa
from modules.pdf_exporter import exportar_resultado_pdf

# --- Helpers de estado (compatibles con ejecutable) ---
import os, json, sys

APP_VERSION = "V1.3 - Upd-1"


def _user_data_dir_main():
    try:
        if getattr(sys, "frozen", False):
            base = os.path.join(os.environ.get("APPDATA", os.path.expanduser("~")), "ATS-Advisor")
            os.makedirs(base, exist_ok=True)
            return base
    except Exception:
        pass
    # modo desarrollo: junto al main.py
    return os.path.dirname(__file__)

def _state_file_path():
    return os.path.join(_user_data_dir_main(), "last_state.json")

def _get_last_cv_path():
    p = _state_file_path()
    if os.path.exists(p):
        try:
            with open(p, "r", encoding="utf-8") as f:
                data = json.load(f)
            return (data or {}).get("last_cv_path") or ""
        except Exception:
            return ""
    return ""

def _set_last_cv_path(ruta_cv):
    try:
        with open(_state_file_path(), "w", encoding="utf-8") as f:
            json.dump({"last_cv_path": ruta_cv}, f, ensure_ascii=False, indent=2)
    except Exception:
        pass


# --- Detección simple de idioma (sin dependencias) ---
EN_HINT = {
    " the ", " and ", " with ", " for ", " of ", " to ", " in ",
    "experience", "years", "required", "responsibilities", "requirements",
    "skills", "english", "team", "management", "project", "role", "company"
}
ES_HINT = {
    " el ", " la ", " los ", " las ", " y ", " para ", " con ", " en ", " de ",
    "experiencia", "años", "requisitos", "responsabilidades", "habilidades",
    "equipo", "gestión", "gestion", "proyecto", "empresa", "español", "espanol"
}

def detect_lang_simple(text: str) -> str:
    t = f" { (text or '').lower() } "
    en = sum(1 for w in EN_HINT if w in t)
    es = sum(1 for w in ES_HINT if w in t) + (1 if any(ch in t for ch in "áéíóúñ") else 0)
    if en > es + 2:
        return "en"
    if es > en + 2:
        return "es"
    return "unknown"


# ----------------------------
# PERSISTENCIA SIMPLE (último CV usado)
# ----------------------------
BASE_DIR = os.path.dirname(__file__)
STATE_FILE = os.path.join(BASE_DIR, "last_state.json")

def _load_state() -> dict:
    try:
        if os.path.exists(STATE_FILE):
            with open(STATE_FILE, "r", encoding="utf-8") as f:
                data = json.load(f)
                return data if isinstance(data, dict) else {}
    except Exception:
        pass
    return {}

def _save_state(state: dict):
    try:
        with open(STATE_FILE, "w", encoding="utf-8") as f:
            json.dump(state or {}, f, ensure_ascii=False, indent=2)
    except Exception:
        pass

def _get_last_cv_path() -> str:
    st = _load_state()
    p = st.get("last_cv_path") or ""
    return p if (p and os.path.exists(p)) else ""

def _set_last_cv_path(path: str):
    st = _load_state()
    st["last_cv_path"] = path or ""
    _save_state(st)

# ----------------------------
# LIMPIAR CONSOLA
# ----------------------------
def limpiar_consola():
    """Limpia la pantalla de la consola (Windows/Linux/Mac)."""
    os.system('cls' if os.name == 'nt' else 'clear')

# ----------------------------
# MENÚ PRINCIPAL
# ----------------------------
def mostrar_menu():
    print("===============================================")
    print("   🧠 ANALIZADOR DE CV VS OFERTAS LABORALES   ")
    print(f"      ATS ADVISOR {APP_VERSION} - PROYECTO TFM (VIU 2025)")
    print("===============================================")
    print("   Desarrollado por Carlos Emilio López          ")
    print("   Contacto: clopezci@hotmail.com                ")
    print("-----------------------------------------------")
    print("   Este software es de código abierto, creado    ")
    print("   con fines académicos en la Universidad        ")
    print("   Internacional de Valencia (VIU).              ")
    print("   © 2025 Carlos Emilio López / VIU              ")
    print("   Uso educativo, libre y no comercial.          ")
    print("===============================================")
    print()
    print("1. Cargar hoja de vida (.pdf o .docx)")
    print("2. Cargar texto de la oferta y analizar")
    print("3. Salir")
    print("-----------------------------------------------")
    print("4. Gestionar 'ruido' aprendido (exclusiones)")
    print("===============================================")

# ----------------------------
# FLUJO PRINCIPAL DEL SISTEMA
# ----------------------------
def main():
    # Carga inicial del diccionario de lemas (incluye skills_custom.json si existe)
    try:
        habilidades.construir_diccionario_lemas()
    except Exception as e:
        print(f"ℹ️ Aviso: no se pudo construir el diccionario de lemas al inicio ({e}). Continuando...")

    # Ruta al archivo del CV para esta sesión (preferimos el recordado)
    ruta_cv = _get_last_cv_path() or None
    texto_oferta = None  # Texto de la oferta laboral cargada

    while True:
        limpiar_consola()
        mostrar_menu()
        opcion = input("Seleccione una opción (1-4): ").strip()

        # ----------------------------
        # Opción 1: Cargar CV
        # ----------------------------
        if opcion == "1":
            if ruta_cv and os.path.exists(ruta_cv):
                nombre_cv = os.path.basename(ruta_cv)
                usar_mismo = input(f"Ya hay un CV cargado: '{nombre_cv}'. ¿Deseas usar el mismo? (s/n): ").strip().lower()
                if usar_mismo == "s":
                    print(f"\n✅ Usando el CV previamente cargado: {nombre_cv}")
                    input("Presione Enter para volver al menú.")
                    continue
                else:
                    print("Selecciona un nuevo CV...")
            
            # Si no hay CV previo o el usuario quiere cargar otro
            ruta_cv = carga_archivos.cargar_cv()
            if ruta_cv:
                print(f"\n✅ CV cargado correctamente: {os.path.basename(ruta_cv)}")
            else:
                print("\n⚠️ No se cargó ningún archivo.")
            input("Presione Enter para volver al menú.")

        # ----------------------------
        # Opción 2: Cargar oferta y analizar
        # ----------------------------
        elif opcion == "2":
            """
            # A) Si ya tenemos CV (en memoria o recordado), preguntar si lo reutiliza
            if ruta_cv and os.path.exists(ruta_cv):
                nombre_cv = os.path.basename(ruta_cv)
                reuse = input(f"\n¿Deseas reutilizar el CV anterior \"{nombre_cv}\"? (s/n): ").strip().lower()
                if reuse == "n":
                    # Permitir cargar otro CV aquí mismo
                    nuevo_cv = carga_archivos.cargar_cv()
                    if nuevo_cv:
                        ruta_cv = nuevo_cv
                        _set_last_cv_path(ruta_cv)
                        print(f"✅ CV actualizado a: {os.path.basename(ruta_cv)}")
                    else:
                        print("⚠️ No se seleccionó un nuevo CV. Se usará el CV anterior.")
                else:
                    print(f"🔁 Usando CV recordado: {nombre_cv}")

            # B) Si NO hay CV, intentar recuperar del estado o forzar carga
            if not ruta_cv or not os.path.exists(ruta_cv):
                ruta_recordada = _get_last_cv_path()
                if ruta_recordada:
                    usar = input(f"\nSe encontró un CV anterior \"{os.path.basename(ruta_recordada)}\". ¿Usarlo? (s/n): ").strip().lower()
                    if usar == "s":
                        ruta_cv = ruta_recordada
                        print(f"🔁 Usando CV recordado: {os.path.basename(ruta_cv)}")
                    else:
                        ruta_cv = None

                if not ruta_cv:
                    print("⚠️ Primero debe cargar su hoja de vida.")
                    ruta_cv = carga_archivos.cargar_cv()
                    if ruta_cv:
                        _set_last_cv_path(ruta_cv)
                        print(f"✅ CV cargado y recordado: {os.path.basename(ruta_cv)}")
                    else:
                        input("⚠️ No se cargó ningún CV. Presione Enter para continuar...")
                        continue
"""
            # Cargar oferta
            texto_oferta = carga_archivos.cargar_oferta()
            if not texto_oferta:
                print("⚠️ No se cargó ninguna oferta.")
                input("Presione Enter para continuar...")
                continue

            print("\n✅ Oferta cargada correctamente.\nAnalizando coincidencias...\n")
            time.sleep(1)


            # --- Salvaguarda: asegurar CV antes de leerlo ---
            if not ruta_cv or not os.path.exists(ruta_cv):
                # Intentar recuperar del estado previo
                ruta_recordada = _get_last_cv_path()
                if ruta_recordada and os.path.exists(ruta_recordada):
                    usar = input(f"\nSe encontró un CV anterior \"{os.path.basename(ruta_recordada)}\". ¿Usarlo? (s/n): ").strip().lower()
                    if usar == "s":
                        ruta_cv = ruta_recordada
                        print(f"🔁 Usando CV recordado: {os.path.basename(ruta_cv)}")
                    else:
                        ruta_cv = None

                # Si aún no hay CV, forzar carga (una sola vez)
                if not ruta_cv:
                    print("⚠️ Para analizar la oferta necesitas cargar tu CV.")
                    nuevo_cv = carga_archivos.cargar_cv()
                    if nuevo_cv:
                        ruta_cv = nuevo_cv
                        _set_last_cv_path(ruta_cv)
                        print(f"✅ CV cargado y recordado: {os.path.basename(ruta_cv)}")
                    else:
                        print("❌ No se cargó ningún CV. Volviendo al menú...")
                        input("Presione Enter para continuar...")
                        continue



            # Chequeo de idioma de la oferta
            lang = detect_lang_simple(texto_oferta)
            if lang == "en":
                print("\n⚠️ Esta versión evalúa ofertas en español.")
                print("   Detecté que la oferta está en INGLÉS.")
                print("   Por favor traduce la oferta al español y vuelve a intentarlo.")
                input("\nPresione Enter para volver al menú...")
                continue

            # Leer CV como texto
            texto_cv = carga_archivos.leer_cv_como_texto(ruta_cv)
            if not texto_cv:
                print("❌ No fue posible leer su hoja de vida.")
                input("Presione Enter para continuar...")
                continue

            # Advertencia ética (umbral ajustado en analisis_basico.contiene_lista_sospechosa)
            try:
                if contiene_lista_sospechosa(texto_cv):
                    print("⚠️ Advertencia ética: Se detectaron secciones con alta densidad de palabras clave; los ATS reales podrían penalizarlas.")
                    print("👉 Recomendación: integra esas palabras en logros y responsabilidades reales.\n")
            except Exception:
                pass

            # Categorizar y analizar (manejo robusto de errores)
            try:
                cat_oferta = analisis_basico.categorizar_texto(texto_oferta)
                cat_cv = analisis_basico.categorizar_texto(texto_cv)

                resultado_dict = analisis_basico.mostrar_resultados(
                    cat_oferta, cat_cv, texto_cv, texto_oferta
                )
            except Exception as e:
                print(f"\n❌ Error durante el análisis: {e}")
                print("Sugerencias:")
                print("- Verifique que el modelo de spaCy esté instalado (es_core_news_lg/md/sm).")
                print("- Revise que el CV/Oferta no estén vacíos o corruptos.")
                input("\nPresione Enter para volver al menú...")
                continue

            # ----------------------------
            # AUTOAPRENDIZAJE DE NUEVAS SKILLS (insights de mercado)
            # ----------------------------
            try:
                nuevas_skills = habilidades.detectar_nuevas_habilidades(texto_oferta)
                nuevas_filtradas = [s for s in nuevas_skills if len(s) > 2]
            except Exception:
                nuevas_filtradas = []

            print("\n🔍 Conceptos relevantes (competencias y prácticas del rol)")
            print("   (se guardan SOLO en la base interna como 'pendiente'; NO se agregan a tu CV)")
            print("   (sirve para que el ATS reconozca mejor términos en futuras ofertas)")
            if nuevas_filtradas:
                print(", ".join(nuevas_filtradas))
                respuesta_skills = input("¿Deseas guardarlos en la base interna (pendiente)? (s/n): ").strip().lower()
                if respuesta_skills == 's':
                    try:
                        habilidades.guardar_skills_custom(nuevas_filtradas)
                        habilidades.construir_diccionario_lemas()
                        print("✅ Habilidades/Conceptos guardados.")
                    except Exception as e:
                        print(f"⚠️ No se pudieron guardar: {e}")
            else:
                print("   (no se detectaron nuevos conceptos en esta oferta)")

            # ----------------------------
            # EXPORTAR RESULTADOS A PDF
            # ----------------------------
            respuesta = input("\n💾 ¿Deseas guardar este análisis como PDF? (s/n): ").strip().lower()
            if respuesta == "s":
                nombre_archivo = input("📝 Ingresa un nombre para el archivo (sin extensión): ").strip()
                ruta = exportar_resultado_pdf(nombre_archivo, resultado_dict)
                if ruta:
                    print(f"\n✅ Archivo generado en: {ruta}")
                input("Presione Enter para continuar...")

            input("\nPresione Enter para volver al menú...")

        # ----------------------------
        # Opción 3: Salir
        # ----------------------------
        elif opcion == "3":
            print("Estamos encantados de poder ayudarte. "
                "Ayuda a otros compartiendo esta aplicación. "
                "¡Mucho éxito en tu búsqueda laboral! 🚀")
            # Mantener visible el mensaje antes de cerrar (10 s)
            for i in range(3, 0, -1):
                print(f"Esta ventana se cerrará en {i} s...  ", end="\r", flush=True)
                time.sleep(1)
            print("\n¡Hasta pronto!")
            break


        # ----------------------------
        # Opción 4: Gestionar "ruido" aprendido
        # ----------------------------
        elif opcion == "4":
            while True:
                os.system('cls' if os.name == 'nt' else 'clear')
                print("===============================================")
                print("   Gestión de 'ruido' aprendido (exclusiones)  ")
                print("===============================================")
                from modules.habilidades import (
                    list_noise_terms, get_noise_threshold, set_noise_threshold,
                    forget_noise_term, refresh_exclude_terms
                )
                print(f"Umbral actual de exclusión automática: {get_noise_threshold()} apariciones\n")
                print("1) Ver Top N términos de ruido")
                print("2) Cambiar umbral")
                print("3) Olvidar (eliminar) un término de ruido")
                print("4) Volver al menú principal")
                sub = input("\nSeleccione una opción (1-4): ").strip()

                if sub == "1":
                    try:
                        n = input("¿Cuántos términos mostrar? (ej. 50): ").strip() or "50"
                        top = list_noise_terms(int(n))
                        if not top:
                            print("\n( No hay términos de ruido registrados todavía )")
                        else:
                            print("\nTop términos de ruido (término → conteo):")
                            for t, c in top:
                                print(f" - {t} → {c}")
                    except Exception as e:
                        print(f"\n⚠️ No fue posible listar: {e}")
                    input("\nEnter para continuar...")

                elif sub == "2":
                    try:
                        nuevo = input("Nuevo umbral (mín. 1): ").strip()
                        set_noise_threshold(int(nuevo))
                        refresh_exclude_terms()
                        print("\n✅ Umbral actualizado y exclusiones refrescadas.")
                    except Exception as e:
                        print(f"\n⚠️ No fue posible actualizar el umbral: {e}")
                    input("\nEnter para continuar...")

                elif sub == "3":
                    term = input("Término exacto a olvidar (lowercase recomendado): ").strip().lower()
                    if not term:
                        print("\n⚠️ Término vacío.")
                    else:
                        ok = forget_noise_term(term)
                        if ok:
                            refresh_exclude_terms()
                            print("\n✅ Término eliminado y exclusiones refrescadas.")
                        else:
                            print("\n⚠️ No se encontró ese término en la base de ruido.")
                    input("\nEnter para continuar...")

                elif sub == "4":
                    break
                else:
                    print("❌ Opción inválida.")
                    input("Enter para continuar...")

        # Manejo de opción inválida
        else:
            print("❌ Opción inválida. Intente de nuevo.")
            input("Presione Enter para continuar...")

# ----------------------------
# EJECUCIÓN DIRECTA
# ----------------------------
if __name__ == "__main__":
    main()
