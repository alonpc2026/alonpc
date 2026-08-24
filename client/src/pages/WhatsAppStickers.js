import { useEffect, useMemo, useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import "./WhatsAppStickers.css";

const API = "https://alonpc02026.onrender.com/api/whatsapp-stickers";

const TEXT = {
  he: {
    title: "גלריית מדבקות WhatsApp",
    subtitle: "מדבקות מוכנות לפי קטגוריה",
    all: "כל הקטגוריות",
    whatsapp: "שלח ל־WhatsApp",
    download: "הורד מדבקה",
    copy: "העתק קישור",
    copied: "הקישור הועתק",
    openImage: "פתח תמונה",
    loading: "אנא המתן לטעינת המדבקות...",
    noItems: "אין כרגע מדבקות בקטגוריה הזו.",
    preparing: "מכין את המדבקה לשיתוף...",
    shareSuccess: "המדבקה נפתחה בחלון השיתוף.",
    shareFallback: "הדפדפן לא מאפשר לשלוח תמונה ישירות. המדבקה הורדה למכשיר ו־WhatsApp ייפתח לצירוף ידני.",
    shareCancelled: "השיתוף בוטל.",
    shareFailed: "לא ניתן לשתף את המדבקה. אפשר להוריד אותה ולצרף ידנית ב־WhatsApp."
  },
  en: {
    title: "WhatsApp Sticker Gallery",
    subtitle: "Ready-made stickers by category",
    all: "All categories",
    whatsapp: "Send to WhatsApp",
    download: "Download sticker",
    copy: "Copy link",
    copied: "Link copied",
    openImage: "Open image",
    loading: "Please wait while the stickers are loading...",
    noItems: "No stickers in this category yet.",
    preparing: "Preparing the sticker for sharing...",
    shareSuccess: "The sticker opened in the share panel.",
    shareFallback: "Your browser cannot send the image directly. The sticker was downloaded and WhatsApp will open so you can attach it manually.",
    shareCancelled: "Sharing was cancelled.",
    shareFailed: "The sticker could not be shared. Download it and attach it manually in WhatsApp."
  },
  ru: {
    title: "Галерея стикеров WhatsApp",
    subtitle: "Готовые стикеры по категориям",
    all: "Все категории",
    whatsapp: "Отправить в WhatsApp",
    download: "Скачать стикер",
    copy: "Скопировать ссылку",
    copied: "Ссылка скопирована",
    openImage: "Открыть изображение",
    loading: "Пожалуйста, подождите, стикеры загружаются...",
    noItems: "В этой категории пока нет стикеров.",
    preparing: "Подготовка стикера к отправке...",
    shareSuccess: "Стикер открыт в меню отправки.",
    shareFallback: "Браузер не может отправить изображение напрямую. Стикер скачан, а WhatsApp откроется для ручного прикрепления.",
    shareCancelled: "Отправка отменена.",
    shareFailed: "Не удалось поделиться стикером. Скачайте его и прикрепите вручную в WhatsApp."
  },
  ar: {
    title: "معرض ملصقات WhatsApp",
    subtitle: "ملصقات جاهزة حسب الفئة",
    all: "كل الفئات",
    whatsapp: "إرسال إلى WhatsApp",
    download: "تنزيل الملصق",
    copy: "نسخ الرابط",
    copied: "تم نسخ الرابط",
    openImage: "فتح الصورة",
    loading: "يرجى الانتظار أثناء تحميل الملصقات...",
    noItems: "لا توجد ملصقات في هذه الفئة حاليًا.",
    preparing: "جارٍ تجهيز الملصق للمشاركة...",
    shareSuccess: "تم فتح الملصق في نافذة المشاركة.",
    shareFallback: "المتصفح لا يسمح بإرسال الصورة مباشرة. تم تنزيل الملصق وسيتم فتح WhatsApp لإرفاقه يدويًا.",
    shareCancelled: "تم إلغاء المشاركة.",
    shareFailed: "تعذرت مشاركة الملصق. نزّله ثم أرفقه يدويًا في WhatsApp."
  },
  am: {
    title: "የWhatsApp ስቲከር ማዕከል",
    subtitle: "በምድብ የተዘጋጁ ስቲከሮች",
    all: "ሁሉም ምድቦች",
    whatsapp: "ወደ WhatsApp ላክ",
    download: "ስቲከር አውርድ",
    copy: "አገናኝ ቅዳ",
    copied: "አገናኙ ተቀድቷል",
    openImage: "ምስል ክፈት",
    loading: "እባክዎ ስቲከሮቹ እስኪጫኑ ድረስ ይጠብቁ...",
    noItems: "በዚህ ምድብ ስቲከር የለም።",
    preparing: "ስቲከሩ ለመጋራት እየተዘጋጀ ነው...",
    shareSuccess: "ስቲከሩ በማጋሪያ መስኮት ተከፍቷል።",
    shareFallback: "አሳሹ ምስሉን በቀጥታ መላክ አይችልም። ስቲከሩ ወርዷል፣ WhatsApp ይከፈታል።",
    shareCancelled: "ማጋራት ተሰርዟል።",
    shareFailed: "ስቲከሩን ማጋራት አልተቻለም። አውርደው በWhatsApp በእጅ ያያይዙት።"
  },
  fr: {
    title: "Galerie de stickers WhatsApp",
    subtitle: "Stickers prêts par catégorie",
    all: "Toutes les catégories",
    whatsapp: "Envoyer vers WhatsApp",
    download: "Télécharger le sticker",
    copy: "Copier le lien",
    copied: "Lien copié",
    openImage: "Ouvrir l’image",
    loading: "Veuillez patienter pendant le chargement des stickers...",
    noItems: "Aucun sticker dans cette catégorie.",
    preparing: "Préparation du sticker pour le partage...",
    shareSuccess: "Le sticker a été ouvert dans le panneau de partage.",
    shareFallback: "Le navigateur ne peut pas envoyer l’image directement. Le sticker a été téléchargé et WhatsApp va s’ouvrir pour l’ajouter manuellement.",
    shareCancelled: "Le partage a été annulé.",
    shareFailed: "Impossible de partager le sticker. Téléchargez-le puis joignez-le manuellement dans WhatsApp."
  },
  fil: {
    title: "WhatsApp Sticker Gallery",
    subtitle: "Handang stickers ayon sa kategorya",
    all: "Lahat ng kategorya",
    whatsapp: "Ipadala sa WhatsApp",
    download: "I-download ang sticker",
    copy: "Kopyahin ang link",
    copied: "Nakopya ang link",
    openImage: "Buksan ang larawan",
    loading: "Mangyaring maghintay habang nilo-load ang mga sticker...",
    noItems: "Wala pang sticker sa kategoryang ito.",
    preparing: "Inihahanda ang sticker para sa pag-share...",
    shareSuccess: "Binuksan ang sticker sa share panel.",
    shareFallback: "Hindi kayang ipadala ng browser ang larawan nang direkta. Na-download ang sticker at bubuksan ang WhatsApp para ma-attach mo ito.",
    shareCancelled: "Kinansela ang pag-share.",
    shareFailed: "Hindi ma-share ang sticker. I-download ito at i-attach nang manu-mano sa WhatsApp."
  },
  hi: {
    title: "WhatsApp स्टिकर गैलरी",
    subtitle: "श्रेणी के अनुसार तैयार स्टिकर",
    all: "सभी श्रेणियाँ",
    whatsapp: "WhatsApp पर भेजें",
    download: "स्टिकर डाउनलोड करें",
    copy: "लिंक कॉपी करें",
    copied: "लिंक कॉपी हो गया",
    openImage: "चित्र खोलें",
    loading: "कृपया स्टिकर लोड होने तक प्रतीक्षा करें...",
    noItems: "इस श्रेणी में अभी कोई स्टिकर नहीं है।",
    preparing: "स्टिकर साझा करने के लिए तैयार किया जा रहा है...",
    shareSuccess: "स्टिकर शेयर पैनल में खुल गया।",
    shareFallback: "ब्राउज़र चित्र सीधे नहीं भेज सकता। स्टिकर डाउनलोड हो गया है और WhatsApp खुलेगा ताकि आप इसे मैन्युअल रूप से जोड़ सकें।",
    shareCancelled: "साझा करना रद्द कर दिया गया।",
    shareFailed: "स्टिकर साझा नहीं हो सका। इसे डाउनलोड करें और WhatsApp में मैन्युअल रूप से जोड़ें।"
  }
};

function safeFileName(value = "sticker") {
  return String(value || "sticker")
    .replace(/[\\/:*?"<>|]+/g, "-")
    .replace(/\s+/g, " ")
    .trim() || "sticker";
}

function extensionForMime(mime = "") {
  if (mime.includes("webp")) return "webp";
  if (mime.includes("jpeg") || mime.includes("jpg")) return "jpg";
  if (mime.includes("gif")) return "gif";
  return "png";
}

async function imageUrlToFile(imageUrl, title) {
  if (!imageUrl) return null;

  if (imageUrl.startsWith("data:image/")) {
    const match = imageUrl.match(/^data:([^;]+);base64,(.+)$/);
    if (!match) return null;

    const mime = match[1];
    const binary = atob(match[2]);
    const bytes = new Uint8Array(binary.length);

    for (let i = 0; i < binary.length; i += 1) {
      bytes[i] = binary.charCodeAt(i);
    }

    return new File(
      [bytes],
      `${safeFileName(title)}.${extensionForMime(mime)}`,
      { type: mime }
    );
  }

  const response = await fetch(imageUrl);
  if (!response.ok) throw new Error("image-fetch-failed");

  const blob = await response.blob();
  const mime = blob.type || "image/png";

  return new File(
    [blob],
    `${safeFileName(title)}.${extensionForMime(mime)}`,
    { type: mime }
  );
}

function downloadFile(file) {
  const url = URL.createObjectURL(file);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = file.name;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}

export default function WhatsAppStickers() {
  const { language, dir } = useLanguage();
  const text = TEXT[language] || TEXT.he;

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("");
  const [copiedId, setCopiedId] = useState("");
  const [status, setStatus] = useState("");
  const [busyId, setBusyId] = useState("");

  useEffect(() => {
    let active = true;

    setLoading(true);

    fetch(API)
      .then((r) => r.json())
      .then((data) => {
        if (active) setItems(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (active) setItems([]);
      })
      .finally(() => {
        if (active) setLoading(false);
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
    } catch {
      setStatus(text.shareFailed);
    }
  }

  async function downloadSticker(item) {
    try {
      setBusyId(item._id);
      setStatus(text.preparing);

      const file = await imageUrlToFile(item.stickerImageUrl, item.title);
      if (!file) throw new Error("file-not-created");

      downloadFile(file);
      setStatus("");
    } catch {
      setStatus(text.shareFailed);
    } finally {
      setBusyId("");
    }
  }

  async function shareSticker(item) {
    const caption = item.whatsappText || item.description || item.title || "";

    try {
      setBusyId(item._id);
      setStatus(text.preparing);

      const file = await imageUrlToFile(item.stickerImageUrl, item.title);
      if (!file) throw new Error("file-not-created");

      const canShareFile =
        typeof navigator.share === "function" &&
        (
          typeof navigator.canShare !== "function" ||
          navigator.canShare({ files: [file] })
        );

      if (canShareFile) {
        try {
          await navigator.share({
            title: item.title || "WhatsApp Sticker",
            text: caption,
            files: [file]
          });
          setStatus(text.shareSuccess);
          return;
        } catch (error) {
          if (error?.name === "AbortError") {
            setStatus(text.shareCancelled);
            return;
          }
        }
      }

      downloadFile(file);
      setStatus(text.shareFallback);

      window.open(
        `https://wa.me/?text=${encodeURIComponent(caption)}`,
        "_blank",
        "noopener,noreferrer"
      );
    } catch {
      setStatus(text.shareFailed);
    } finally {
      setBusyId("");
    }
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

      {status && (
        <section className="wa-stickers-status" role="status">
          {status}
        </section>
      )}

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

      {loading && (
        <section className="wa-stickers-empty" role="status">
          ⏳ {text.loading}
        </section>
      )}

      {!loading && filtered.length === 0 && (
        <section className="wa-stickers-empty">{text.noItems}</section>
      )}

      {!loading && <section className="wa-stickers-grid">
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
              <img
                src={item.stickerImageUrl}
                alt={item.description || item.title}
                loading="lazy"
              />
            </div>

            {item.description && <p>{item.description}</p>}

            <div className="wa-sticker-actions">
              <button
                type="button"
                disabled={busyId === item._id}
                onClick={() => shareSticker(item)}
              >
                💬 {busyId === item._id ? text.preparing : text.whatsapp}
              </button>

              <button
                type="button"
                className="download"
                disabled={busyId === item._id}
                onClick={() => downloadSticker(item)}
              >
                ⬇️ {text.download}
              </button>

              <button
                type="button"
                className="secondary"
                onClick={() => copySticker(item)}
              >
                📋 {copiedId === item._id ? text.copied : text.copy}
              </button>

              <a
                href={item.stickerImageUrl}
                target="_blank"
                rel="noreferrer"
              >
                🖼️ {text.openImage}
              </a>
            </div>
          </article>
        ))}
      </section>}
    </main>
  );
}
