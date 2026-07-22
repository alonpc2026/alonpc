import React, { useEffect, useState } from "react";
import "./AccessibilityMenu.css";

export default function AccessibilityMenu() {
  const [open, setOpen] = useState(false);
  const [fontSize, setFontSize] = useState(100);
  const [highContrast, setHighContrast] = useState(false);
  const [grayscale, setGrayscale] = useState(false);
  const [underlineLinks, setUnderlineLinks] = useState(false);
  const [readableFont, setReadableFont] = useState(false);

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}%`;
    document.body.classList.toggle("accessibility-high-contrast", highContrast);
    document.body.classList.toggle("accessibility-grayscale", grayscale);
    document.body.classList.toggle("accessibility-underline-links", underlineLinks);
    document.body.classList.toggle("accessibility-readable-font", readableFont);
  }, [fontSize, highContrast, grayscale, underlineLinks, readableFont]);

  const resetAccessibility = () => {
    setFontSize(100);
    setHighContrast(false);
    setGrayscale(false);
    setUnderlineLinks(false);
    setReadableFont(false);
  };

  return (
    <div className="accessibility-wrapper" dir="rtl">
      <button
        type="button"
        className="accessibility-floating-button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-controls="accessibility-panel"
        aria-label="פתיחת תפריט נגישות"
      >
        ♿
      </button>

      {open && (
        <section id="accessibility-panel" className="accessibility-panel">
          <div className="accessibility-panel__header">
            <h2>תפריט נגישות</h2>
            <button
              type="button"
              className="accessibility-close"
              onClick={() => setOpen(false)}
              aria-label="סגירת תפריט נגישות"
            >
              ✕
            </button>
          </div>

          <div className="accessibility-font-controls">
            <button type="button" onClick={() => setFontSize((size) => Math.min(size + 10, 150))}>
              הגדלת טקסט
            </button>
            <button type="button" onClick={() => setFontSize((size) => Math.max(size - 10, 80))}>
              הקטנת טקסט
            </button>
          </div>

          <button type="button" className={highContrast ? "active" : ""} onClick={() => setHighContrast((value) => !value)}>
            ניגודיות גבוהה
          </button>

          <button type="button" className={grayscale ? "active" : ""} onClick={() => setGrayscale((value) => !value)}>
            גווני אפור
          </button>

          <button type="button" className={underlineLinks ? "active" : ""} onClick={() => setUnderlineLinks((value) => !value)}>
            הדגשת קישורים
          </button>

          <button type="button" className={readableFont ? "active" : ""} onClick={() => setReadableFont((value) => !value)}>
            גופן קריא
          </button>

          <button type="button" className="accessibility-reset" onClick={resetAccessibility}>
            איפוס נגישות
          </button>
        </section>
      )}
    </div>
  );
}
