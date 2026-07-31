"use client";

type SpeakButtonProps = {
  text: string;
  label?: string;
};

export function SpeakButton({ text, label = "Escuchar" }: SpeakButtonProps) {
  const speak = () => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "es-CO";
    window.speechSynthesis.speak(utter);
  };

  return (
    <button type="button" className="icon-btn" onClick={speak} aria-label={label} title={label}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M11 5L6 9H3v6h3l5 4V5zM16.5 12a2.5 2.5 0 00-1.5-2.3v4.6A2.5 2.5 0 0016.5 12z"
          fill="currentColor"
        />
        <path
          d="M14.5 7.05a5.5 5.5 0 010 9.9"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    </button>
  );
}
