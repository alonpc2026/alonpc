import { useEffect, useMemo, useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import "./WhatsAppStickers.css";

const API = "https://alonpc02026.onrender.com/api/whatsapp-stickers";

const TEXT = {
  he: {
    title: "גלריית מדבקות WhatsApp",
    subtitle: "מדבקות מוכנות לפי קטגוריה",
    all: "כל הקטגוריות",
    copy: "העתק קישור למדבקה",
    copied: "הקישור הועתק",
    whatsapp: "שלח ל־WhatsApp שלי",
    openImage: "פתח תמונה",
    noItems: "אין כרגע מדבקות בקטגוריה הזו."
  },
  en: {
    title: "WhatsApp Sticker Gallery",
    subtitle: "Ready-made stickers by category",
    all: "All categories",
    copy: "Copy sticker link",
    copied: "Link copied",
    whatsapp: "Send to my WhatsApp",
    openImage: "Open image",
    noItems: "No stickers in this category yet."
  },
  ru: {
    title: "Галерея стикеров WhatsApp",
    subtitle: "Готовые стикеры по категориям",
    all: "Все категории",
    copy: "Скопировать ссылку",
    copied: "Ссылка скопирована",
    whatsapp: "Отправить в мой WhatsApp",
    openImage: "Открыть изображение",
    noItems: "В этой категории пока нет стикеров."
  },
  ar: {
    title: "معرض ملصقات WhatsApp",
    subtitle: "ملصقات جاهزة حسب الفئة",
    all: "كل الفئات",
    copy: "نسخ رابط الملصق",
    copied: "تم نسخ الرابط",
    whatsapp: "إرسال إلى WhatsApp الخاص بي",
    openImage: "فتح الصورة",
    noItems: "لا توجد ملصقات في هذه الفئة حاليًا."
  },
  am: {
    title: "የWhatsApp ስቲከር ማዕከል",
    subtitle: "በምድብ የተዘጋጁ ስቲከሮች",
    all: "ሁሉም ምድቦች",
    copy: "የስቲከር አገናኝ ቅዳ",
    copied: "አገናኙ ተቀድቷል",
    whatsapp: "ወደ WhatsApp ላክ",
    openImage: "ምስል ክፈት",
    noItems: "በዚህ ምድብ ስቲከር የለም።"
  },
  fr: {
    title: "Galerie de stickers WhatsApp",
    subtitle: "Stickers prêts par catégorie",
    all: "Toutes les catégories",
    copy: "Copier le lien du sticker",
    copied: "Lien copié",
    whatsapp: "Envoyer vers mon WhatsApp",
    openImage: "Ouvrir l’image",
    noItems: "Aucun sticker dans cette catégorie."
  },
  fil: {
    title: "WhatsApp Sticker Gallery",
    subtitle: "Handang stickers ayon sa kategorya",
    all: "Lahat ng kategorya",
    copy: "Kopyahin ang sticker link",
    copied: "Nakopya ang link",
    whatsapp: "Ipadala sa WhatsApp ko",
    openImage: "Buksan ang larawan",
    noItems: "Wala pang sticker sa kategoryang ito."
  },
  hi: {
    title: "WhatsApp स्टिकर गैलरी",
    subtitle: "श्रेणी के अनुसार तैयार स्टिकर",
    all: "सभी श्रेणियाँ",
    copy: "स्टिकर लिंक कॉपी करें",
    copied: "लिंक कॉपी हो गया",
    whatsapp: "मेरे WhatsApp पर भेजें",
    openImage: "चित्र खोलें",
    noItems: "इस श्रेणी में अभी कोई स्टिकर नहीं है।"
  }
};

export default function WhatsAppStickers() {
  const { language, dir } = useLanguage();
  const text = TEXT[language] || TEXT.he;

  const [items, setItems] = useState([]);
  const [category, setCategory] = useState("");
  const [copiedId, setCopiedId] = useState("");

  useEffect(() => {
    let active = true;

    fetch(API)
      .then((r) => r.json())
      .then((data) => {
        if (active) setItems(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (active) setItems([]);
      });

    return () => { active = false; };
  }, []);

  const categories = useMemo(
    () => [...new Set(items.map((item) => item.category).filter(Boolean))],
    [items]
  );

  const filtered = useMemo(
    () => category ? items.filter((item) => item.category === category) : items,
    [items, category]
  );

  async function copySticker(item) {
    try {
      await navigator.clipboard.writeText(item.stickerImageUrl);
      setCopiedId(item._id);
      setTimeout(() => setCopiedId(""), 1800);
    } catch {}
  }

  function sendToWhatsApp(item) {
    const message = [
      item.whatsappText || item.description || item.title,
      item.stickerImageUrl
    ].filter(Boolean).join("\n");

    window.open(
      `https://wa.me/?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer"
    );
  }

  return (
    <main className="wa-stickers-page" dir={dir}>
      <header className="wa-stickers-hero">
        <span>💬</span>
        <div>
          <h1>{text.title}</h1>
          <p>{text.subtitle}</p>
        </div>
      </header>

      <section className="wa-stickers-categories">
        <button
          type="button"
          className={!category ? "active" : ""}
          onClick={() => setCategory("")}
        >
          {text.all}
        </button>

        {categories.map((name) => (
          <button
            type="button"
            key={name}
            className={category === name ? "active" : ""}
            onClick={() => setCategory(name)}
          >
            {name}
          </button>
        ))}
      </section>

      {filtered.length === 0 && (
        <section className="wa-stickers-empty">{text.noItems}</section>
      )}

      <section className="wa-stickers-grid">
        {filtered.map((item) => (
          <article className="wa-sticker-card" key={item._id}>
            <div className="wa-sticker-card-head">
              {item.iconImageUrl ? (
                <img src={item.iconImageUrl} alt="" className="wa-sticker-icon" />
              ) : (
                <span className="wa-sticker-icon-fallback">💬</span>
              )}

              <div>
                <h2>{item.title}</h2>
                {item.category && <small>{item.category}</small>}
              </div>
            </div>

            <div className="wa-sticker-image-wrap">
              <img src={item.stickerImageUrl} alt={item.description || item.title} />
            </div>

            {item.description && <p>{item.description}</p>}

            <div className="wa-sticker-actions">
              <button type="button" onClick={() => sendToWhatsApp(item)}>
                💬 {text.whatsapp}
              </button>

              <button type="button" className="secondary" onClick={() => copySticker(item)}>
                📋 {copiedId === item._id ? text.copied : text.copy}
              </button>

              <a href={item.stickerImageUrl} target="_blank" rel="noreferrer">
                🖼️ {text.openImage}
              </a>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
