import React, { useEffect, useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import "./AccessibilityPanel.css";

const LABELS = {
  he: ["נגישות", "ניגודיות גבוהה", "טקסט גדול", "הפחתת תנועה", "צלילי ניווט", "הקרא כותרת", "עצור הקראה", "סגור"],
  en: ["Accessibility", "High contrast", "Large text", "Reduce motion", "Navigation sounds", "Read heading", "Stop reading", "Close"],
  ru: ["Доступность", "Высокая контрастность", "Крупный текст", "Уменьшить движение", "Звуки навигации", "Прочитать заголовок", "Остановить чтение", "Закрыть"],
  ar: ["إمكانية الوصول", "تباين عالٍ", "نص كبير", "تقليل الحركة", "أصوات التنقل", "اقرأ العنوان", "إيقاف القراءة", "إغلاق"],
  am: ["ተደራሽነት", "ከፍተኛ ንፅፅር", "ትልቅ ጽሑፍ", "እንቅስቃሴን ቀንስ", "የአሰሳ ድምፆች", "ርዕሱን አንብብ", "ንባብ አቁም", "ዝጋ"],
  fr: ["Accessibilité", "Contraste élevé", "Texte agrandi", "Réduire les animations", "Sons de navigation", "Lire le titre", "Arrêter la lecture", "Fermer"],
  fil: ["Accessibility", "Mataas na contrast", "Malaking teksto", "Bawasan ang galaw", "Tunog sa pag-navigate", "Basahin ang pamagat", "Itigil ang pagbasa", "Isara"],
  hi: ["सुगम्यता", "उच्च कंट्रास्ट", "बड़ा पाठ", "गति कम करें", "नेविगेशन ध्वनि", "शीर्षक पढ़ें", "पढ़ना रोकें", "बंद करें"]
};
const VOICES = { he: "he-IL", en: "en-US", ru: "ru-RU", ar: "ar-SA", am: "am-ET", fr: "fr-FR", fil: "fil-PH", hi: "hi-IN" };
function getSaved() {
  try { return JSON.parse(localStorage.getItem("alonpc-accessibility") || "{}"); }
  catch { return {}; }
}
export default function AccessibilityPanel() {
  const { language } = useLanguage();
  const lang = LABELS[language] ? language : "he";
  const txt = LABELS[lang];
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState(getSaved);
  useEffect(() => {
    document.documentElement.classList.toggle("alonpc-high-contrast", !!settings.contrast);
    document.documentElement.classList.toggle("alonpc-large-text", !!settings.large);
    document.documentElement.classList.toggle("alonpc-reduced-motion", !!settings.motion);
    try { localStorage.setItem("alonpc-accessibility", JSON.stringify(settings)); } catch {}
  }, [settings]);
  const toggle = key => setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  const beep = () => {
    if (!settings.sounds) return;
    try {
      const Audio = window.AudioContext || window.webkitAudioContext;
      if (!Audio) return;
      const ctx = new Audio();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.value = 540;
      gain.gain.value = 0.025;
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.07);
      osc.onended = () => ctx.close();
    } catch {}
  };
  const read = () => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const heading = document.querySelector("main h1, h1, main h2");
    const msg = new SpeechSynthesisUtterance(heading?.textContent?.trim() || document.title || "ALONPC");
    msg.lang = VOICES[lang];
    msg.rate = 0.85;
    window.speechSynthesis.speak(msg);
  };
  return (
    <div className="alonpc-a11y" dir={["he", "ar"].includes(lang) ? "rtl" : "ltr"} lang={lang}>
      <button type="button" className="alonpc-a11y-launch" onClick={() => { beep(); setOpen(!open); }} aria-label={txt[0]} aria-expanded={open} aria-controls="alonpc-a11y-panel">
        <span aria-hidden="true">♿</span> {txt[0]}
      </button>
      {open && <section id="alonpc-a11y-panel" className="alonpc-a11y-panel" aria-label={txt[0]}>
        <div className="alonpc-a11y-heading">
          <strong>{txt[0]}</strong>
          <button type="button" onClick={() => setOpen(false)} aria-label={txt[7]}>✕</button>
        </div>
        {["contrast", "large", "motion", "sounds"].map((key, i) => (
          <label key={key}><input type="checkbox" checked={!!settings[key]} onChange={() => { beep(); toggle(key); }} />{txt[i + 1]}</label>
        ))}
        <div className="alonpc-a11y-actions">
          <button type="button" onClick={() => { beep(); read(); }}>{txt[5]}</button>
          <button type="button" onClick={() => window.speechSynthesis?.cancel()}>{txt[6]}</button>
        </div>
        <small>NVDA · VoiceOver · TalkBack</small>
      </section>}
    </div>
  );
}
