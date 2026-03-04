# ==========================================================
#  ATS Advisor
# modules/donaciones.py - UI Donación (robusta: root propio + retorno seguro)
# ==========================================================

import os
import sys
import tkinter as tk
from tkinter import ttk

# Pillow recomendado para PNG complejos + resize
try:
    from PIL import Image, ImageTk  # type: ignore
    PIL_OK = True
except Exception:
    PIL_OK = False


def _base_dir():
    """
    Devuelve la carpeta base donde están los assets.

    """
    if getattr(sys, "frozen", False):
        exe_dir = os.path.dirname(sys.executable)

        # 1) assets junto al exe 
        if os.path.isdir(os.path.join(exe_dir, "assets")):
            return exe_dir

        # 2) assets dentro de _internal 
        if os.path.isdir(os.path.join(exe_dir, "_internal", "assets")):
            return os.path.join(exe_dir, "_internal")

        # 3) fallback: MEIPASS (onefile o casos especiales)
        if hasattr(sys, "_MEIPASS"):
            return sys._MEIPASS

        return exe_dir

    # desarrollo: carpeta raíz del proyecto 
    return os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))


def _asset_path(filename: str):
    
    return os.path.join(_base_dir(), "assets", "donacion", filename)


def _fmt_cop(n: int) -> str:
    try:
        s = f"{int(n):,}".replace(",", ".")
        return f"COP$ {s}"
    except Exception:
        return "COP$"


def _load_image(master, path: str, max_w: int, max_h: int):
    if not path or not os.path.exists(path):
        return None

    # 1) PIL con resize 
    if PIL_OK:
        try:
            img = Image.open(path)
            if img.mode not in ("RGB", "RGBA"):
                img = img.convert("RGBA")

            w, h = img.size
            scale = min(max_w / w, max_h / h, 1.0)
            nw, nh = int(w * scale), int(h * scale)
            if (nw, nh) != (w, h):
                img = img.resize((nw, nh), Image.LANCZOS)

            return ImageTk.PhotoImage(img, master=master)
        except Exception:
            pass

    # 2) Fallback Tk 
    try:
        return tk.PhotoImage(master=master, file=path)
    except Exception:
        return None


def _center(win: tk.Tk, w: int, h: int):
    win.update_idletasks()
    sw = win.winfo_screenwidth()
    sh = win.winfo_screenheight()
    x = max(0, (sw - w) // 2)
    y = max(0, (sh - h) // 2)
    win.geometry(f"{w}x{h}+{x}+{y}")


def mostrar_popup_donacion():
    """
    Ventana NO invasiva:
        - 3 opciones: Agua (5.000), Café (8.000), Otro valor
        - Dispensador + QR
        - Mensaje sutil (costos de APIs / continuidad)
        - Atribución/licencia
        
    """

    base = tk.Tk()
    base.withdraw()  # root oculto

    win = tk.Toplevel(base)
    win.title("Apoyo voluntario (donación simbólica)")
    win.resizable(True, True)

    # Tamaño suficiente para QR completos
    win.state("zoomed")  # Maximizar
    win.lift()
    win.attributes("-topmost", True)
    win.after(300, lambda: win.attributes("-topmost", False))

    # Estilo
    try:
        ttk.Style(win).theme_use("clam")
    except Exception:
        pass


    style = ttk.Style(win)
    style.configure("Card.TFrame", background="#f4f4f4")
    style.configure("Card.TLabel", background="#f4f4f4")
    style.configure("Title.TLabel", font=("Segoe UI", 12, "bold"))
    style.configure("Close.TButton", font=("Segoe UI", 11, "bold"))
    
    # Header: ético + sutil + “por qué”
    header_frame = ttk.Frame(win)
    header_frame.pack(fill="x", pady=(10, 6))

    header = ttk.Label(
        header_frame,
        text=(
            "Si este análisis fue útil para ti, puedes apoyar su evolución con una donación simbólica.\n"
            "La meta es convertir esta herramienta en una plataforma con IA capaz de optimizar hojas de vida\n"
            "y brindar orientación profesional avanzada (outplacement) para llegar a más personas.\n"
            "Las tecnologías de IA tienen costos operativos, y tu apoyo ayuda a sostener y expandir este proyecto.\n"
            "El uso actual es y seguirá siendo libre."
        ),
        justify="center",
        font=("Segoe UI", 11),
        anchor="center"
    )

    header.pack()

    # Frame principal con scroll
    canvas = tk.Canvas(win, highlightthickness=0)
    scrollbar = ttk.Scrollbar(win, orient="vertical", command=canvas.yview)
    scrollable_frame = ttk.Frame(canvas)

    scrollable_frame.bind(
        "<Configure>",
        lambda e: canvas.configure(scrollregion=canvas.bbox("all"))
    )

    # Crear ventana interna para el frame scrolleable
    inner_window = canvas.create_window((0, 0), window=scrollable_frame, anchor="n")

    canvas.configure(yscrollcommand=scrollbar.set)

    canvas.pack(side="left", fill="both", expand=True)
    scrollbar.pack(side="right", fill="y")

    # Forzar ancho del frame interno al ancho del canvas
    def _resize_scroll_frame(event):
        canvas.itemconfig(inner_window, width=event.width)

    canvas.bind("<Configure>", _resize_scroll_frame)

        # Scroll con rueda del mouse (Windows)
    def _on_mousewheel(event):
        canvas.yview_scroll(int(-1 * (event.delta / 120)), "units")

    canvas.bind_all("<MouseWheel>", _on_mousewheel)

    # Contenedor de las 3 columnas (centrado)
    content_wrapper = ttk.Frame(scrollable_frame)
    content_wrapper.pack(fill="x")

    cont = ttk.Frame(content_wrapper)
    cont.pack(padx=40, pady=(8, 20))

    for i in range(3):
        cont.columnconfigure(i, weight=1)


    # Paths
    p_agua = _asset_path("agua.png")
    p_cafe = _asset_path("cafe.png")
    p_qr_agua = _asset_path("qr_agua.png")
    p_qr_cafe = _asset_path("qr_cafe.png")
    p_qr_otro = _asset_path("qr_voluntario.png")

    # Tamaños controlados para que el QR quepa completo
    img_disp_agua = _load_image(win, p_agua, max_w=240, max_h=180)
    img_disp_cafe = _load_image(win, p_cafe, max_w=240, max_h=180)

    # QRs: más grandes para escaneo cómodo
    img_qr_agua = _load_image(win, p_qr_agua, max_w=240, max_h=240)
    img_qr_cafe = _load_image(win, p_qr_cafe, max_w=240, max_h=240)
    img_qr_otro = _load_image(win, p_qr_otro, max_w=240, max_h=240)

    # Mantener referencias
    win._imgs = [img_disp_agua, img_disp_cafe, img_qr_agua, img_qr_cafe, img_qr_otro]

    def _make_panel(parent, col: int, titulo: str, valor_texto: str, img_disp, img_qr):
        frame = ttk.Frame(parent, padding=15)
        frame.grid_propagate(False)
        frame.configure(style="Card.TFrame")
        
        frame.grid(row=0, column=col, padx=8, pady=6, sticky="n")

        ttk.Label(frame, text=titulo, font=("Segoe UI", 11, "bold")).pack(pady=(0, 6))
        ttk.Label(frame, text=valor_texto, font=("Segoe UI", 12)).pack(pady=(0, 8))

        if img_disp is not None:
            ttk.Label(frame, image=img_disp).pack(pady=(2, 6))
        else:
            ttk.Label(frame, text="(Imagen no cargó)", font=("Segoe UI", 9)).pack(pady=10)

        if img_qr is not None:
            ttk.Label(frame, text="Escanea el QR:", font=("Segoe UI", 10)).pack(pady=(6, 4))
            ttk.Label(frame, image=img_qr).pack(pady=(0, 6))
        else:
            ttk.Label(frame, text="(QR no cargó)", font=("Segoe UI", 9)).pack(pady=10)

    # Agua / Café 
    _make_panel(cont, 0, "Botella de agua", _fmt_cop(5000), img_disp_agua, img_qr_agua)
    _make_panel(cont, 1, "Café", _fmt_cop(8000), img_disp_cafe, img_qr_cafe)

    # Otro valor 
    frame_otro = ttk.Frame(cont, padding=10, relief="groove")
    frame_otro.grid(row=0, column=2, padx=8, pady=6, sticky="nsew")

    ttk.Label(frame_otro, text="Otro valor", font=("Segoe UI", 11, "bold")).pack(pady=(0, 6))
    ttk.Label(
        frame_otro,
        text="(Opcional) Elige el monto al momento de pagar.",
        font=("Segoe UI", 10)
    ).pack(pady=(0, 10))

    if img_qr_otro is not None:
        ttk.Label(frame_otro, text="Escanea el QR:", font=("Segoe UI", 10)).pack(pady=(6, 4))
        ttk.Label(frame_otro, image=img_qr_otro).pack(pady=(0, 6))
    else:
        ttk.Label(frame_otro, text="(QR opcional no cargó)", font=("Segoe UI", 9)).pack(pady=10)

    # Footer licencia 
    licencia_path = _asset_path("License.txt")
    footer_text = "Recurso gráfico: Designed by upklyak / Freepik."
    if os.path.exists(licencia_path):
        footer_text += "\nLicencia completa disponible en assets/donacion/License.txt"

    # Cerrar 
    def _cerrar():
        try:
            win.destroy()
        except Exception:
            pass
        try:
            base.quit()
        except Exception:
            pass

    # Footer + botón centrados dentro del área scrolleable
    footer_frame = ttk.Frame(scrollable_frame)
    footer_frame.pack(pady=(10, 20))

    footer = tk.Label(
        footer_frame,
        text=footer_text,
        font=("Segoe UI", 8),
        justify="center"
    )
    footer.pack(pady=(5, 10))

    ttk.Button(
        footer_frame,
        text="Cerrar y continuar",
        style="Close.TButton",
        command=_cerrar
    ).pack()

    win.protocol("WM_DELETE_WINDOW", _cerrar)

    # Modal ligera
    try:
        win.grab_set()
    except Exception:
        pass

    base.mainloop()

    try:
        base.destroy()
    except Exception:
        pass