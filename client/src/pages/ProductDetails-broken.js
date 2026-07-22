import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const API = "https://alonpc02026.onrender.com/api/products";
const WHATSAPP_NUMBER = "972545221809";

function ProductDetails() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        setMessage("");

        /*
          כרגע השרת מחזיר את רשימת כל המוצרים.
          לכן טוענים את הרשימה ומחפשים את המוצר לפי המזהה.
        */
        const response = await fetch(API);

        if (!response.ok) {
          throw new Error("לא ניתן לטעון את המוצרים");
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("התקבל מידע לא תקין מהשרת");
        }

        const selectedProduct = data.find(
          (item) => String(item._id) === String(id)
        );

        if (!selectedProduct) {
          setMessage("המוצר המבוקש לא נמצא.");
          setProduct(null);
          return;
        }

        setProduct(selectedProduct);
      } catch (error) {
        console.error("Product loading error:", error);
        setMessage(
          "לא הצלחנו לטעון את פרטי המוצר. נסה לרענן את הדף."
        );
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  const formatPrice = (price) => {
    if (price === undefined || price === null || price === "") {
      return "";
    }

    const number = Number(price);

    if (!Number.isFinite(number)) {
      return String(price);
    }

    return number.toLocaleString("he-IL");
  };

  const getVideoUrl = () => {
    if (!product) return "";

    return (
      product.videoUrl ||
      product.youtubeUrl ||
      product.videoLink ||
      product.video ||
      ""
    );
  };

  const getWebsiteUrl = () => {
    if (!product) return "";

    return (
      product.websiteUrl ||
      product.productUrl ||    const cleanUrl = String(url).trim();

    if (
      cleanUrl.startsWith("http://") ||
      cleanUrl.startsWith("https://")
    ) {
      return cleanUrl;
    }

    return `https://${cleanUrl}`;
  };

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return "";

    try {
      const cleanUrl = normalizeExternalUrl(url);
      const parsedUrl = new URL(cleanUrl);
      let videoId = "";

      if (parsedUrl.hostname.includes("youtu.be")) {
        videoId = parsedUrl.pathname.replace("/", "").split("/")[0];
      } else if (parsedUrl.hostname.includes("youtube.com")) {
        if (parsedUrl.pathname.startsWith("/shorts/")) {
          videoId = parsedUrl.pathname.split("/shorts/")[1]?.split("/")[0];
        } else if (parsedUrl.pathname.startsWith("/embed/")) {
          videoId = parsedUrl.pathname.split("/embed/")[1]?.split("/")[0];
        } else {
          videoId = parsedUrl.searchParams.get("v");
        }
      }

      if (!videoId) return "";

      return `https://www.youtube.com/embed/${videoId}`;
    } catch {
      return "";
    }
  };

  const createWhatsAppMessage = () => {
    if (!product) return "";

    const productPage = window.location.href;

    return encodeURIComponent(
      `שלום אלון, אני מעוניין לקבל מידע על המוצר:\n` +
        `${product.name || "מוצר מהחנות"}\n` +
        `${
          product.price !== undefined &&
          product.price !== null &&
          product.price !== ""
            ? `מחיר: ₪${formatPrice(product.price)}\n`
            : ""
        }` +
        `קישור למוצר: ${productPage}`
    );
  };

  const videoUrl = getVideoUrl();
  const youtubeEmbedUrl = getYouTubeEmbedUrl(videoUrl);
  const websiteUrl = normalizeExternalUrl(getWebsiteUrl());

  if (loading) {
    return (
      <main className="pageContainer" dir="rtl">
        <section className="card">
          <h1>🖥️ פרטי המוצר</h1>
          <p className="statusMessage">טוען את פרטי המוצר...</p>
        </section>
      </main>
    );
  }

  if (message || !product) {
    return (
      <main className="pageContainer" dir="rtl">
        <section className="card">
          <h1>🖥️ פרטי המוצר</h1>
          <p className="statusMessage">
            {message || "המוצר לא נמצא."}
          </p>

          <Link to="/shop" className="detailsButton">
            ⬅ חזרה לחנות
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="pageContainer" dir="rtl">
      <section
        className="card"                marginBottom: "12px",
                borderRadius: "12px",
                textAlign: "center",
                textDecoration: "none",
                fontSize: "20px",
                fontWeight: "bold",
                background: "#1769aa",
                color: "#ffffff",
              }}
            >
              📞 054-5221809
            </a>

            {websiteUrl && (
              <a
                href={websiteUrl}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "block",
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "15px",
                  marginBottom: "12px",
                  borderRadius: "12px",
                  textAlign: "center",
                  textDecoration: "none",
                  fontSize: "18px",
                  fontWeight: "bold",
                  background: "#eeeeee",
                  color: "#111111",
                }}
              >
                🌐 מעבר לקישור המוצר
              </a>
            )}
          </div>
        </div>

        {/* תיאור המוצר */}
        {product.description && (
          <section
            style={{
              marginTop: "30px",
              paddingTop: "20px",
              borderTop: "1px solid #cccccc",
            }}
          >
            <h2>📝 תיאור המוצר</h2>

            <p
              style={{
                whiteSpace: "pre-line",
                lineHeight: 1.8,
                fontSize: "18px",
              }}
            >
              {product.description}
            </p>
          </section>
        )}

        {/* מפרט טכני */}
        {(product.specifications ||
          product.specification ||
          product.technicalDetails) && (
          <section
            style={{
              marginTop: "25px",
              paddingTop: "20px",
              borderTop: "1px solid #cccccc",
            }}
          >
            <h2>⚙️ מפרט טכני</h2>

            <p
              style={{
                whiteSpace: "pre-line",
                lineHeight: 1.8,
                fontSize: "18px",
              }}
            >
              {product.specifications ||
                product.specification ||
                product.technicalDetails}
            </p>
          </section>
        )}

        {/* סרטון YouTube */}
        {youtubeEmbedUrl && (
          <section
            style={{
              marginTop: "25px",
              paddingTop: "20px",
              borderTop: "1px solid #cccccc",
            }}
          >
            <h2>🎥 סרטון המוצר</h2>            <div
              style={{
                position: "relative",
                width: "100%",
                paddingTop: "56.25%",
                overflow: "hidden",
                borderRadius: "16px",
                background: "#000000",
              }}
            >
              <iframe
                src={youtubeEmbedUrl}
                title={`סרטון ${product.name || "המוצר"}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  width: "100%",
                  height: "100%",
                  border: 0,
                }}
              />
            </div>
          </section>
        )}

        {/* קישור לסרטון שאינו YouTube */}
        {videoUrl && !youtubeEmbedUrl && (
          <section
            style={{
              marginTop: "25px",
              paddingTop: "20px",
              borderTop: "1px solid #cccccc",
            }}
          >
            <h2>🎥 סרטון המוצר</h2>

            <a
              href={normalizeExternalUrl(videoUrl)}
              target="_blank"
              rel="noreferrer"
              className="detailsButton"
              style={{
                display: "inline-block",
                padding: "14px 22px",
                fontSize: "18px",
              }}
            >
              ▶ פתיחת הסרטון
            </a>
          </section>
        )}

        {/* גלריית תמונות */}
        {Array.isArray(product.gallery) &&
          product.gallery.filter(Boolean).length > 0 && (
            <section
              style={{
                marginTop: "25px",                paddingTop: "20px",
                borderTop: "1px solid #cccccc",
              }}
            >
              <h2>📷 תמונות נוספות</h2>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(180px, 1fr))",
                  gap: "16px",
                }}
              >
                {product.gallery.filter(Boolean).map((image, index) => (
                  <img
                    key={`${image}-${index}`}
                    src={image}
                    alt={`${product.name || "המוצר"} ${index + 1}`}
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    style={{
                      width: "100%",
                      height: "210px",
                      objectFit: "contain",
                      background: "#ffffff",
                      borderRadius: "14px",
                    }}
                  />
                ))}
              </div>
            </section>
          )}

        <div
          style={{
            marginTop: "30px",
            paddingTop: "20px",
            borderTop: "1px solid #cccccc",
          }}
        >
          <Link
            to="/shop"
            className="detailsButton"
            style={{
              display: "inline-block",
              padding: "14px 22px",
              textDecoration: "none",
              fontSize: "18px",
            }}
          >
            ⬅ חזרה לחנות
          </Link>
        </div>      </section>
    </main>
  );
}

export default ProductDetails;