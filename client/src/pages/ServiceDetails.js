import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

const API = "https://alonpc02026.onrender.com/api/services";

function normalizeVideoUrl(url) {
  if (!url) return "";

  if (url.includes("watch?v=")) {
    return url.replace("watch?v=", "embed/");
  }

  if (url.includes("youtu.be/")) {
    return url.replace("youtu.be/", "www.youtube.com/embed/");
  }

  return url;
}

function normalizePhone(phone) {
  return String(phone || "").replace(/[^\d+]/g, "");
}

function buildWhatsAppLink(phone, text) {
  let cleanPhone = normalizePhone(phone);

  if (cleanPhone.startsWith("0")) {
    cleanPhone = `972${cleanPhone.slice(1)}`;
  }

  cleanPhone = cleanPhone.replace(/^\+/, "");

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}

function ServiceDetails() {
  const { id } = useParams();
  const { dir, language, localize, t } = useLanguage();

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function loadService() {
      try {
        setLoading(true);
        setLoadFailed(false);

        const response = await fetch(`${API}/${id}`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Service not found");
        }

        const item = await response.json();
        setService(item);
      } catch (error) {
        if (error.name === "AbortError") return;

        console.error("Load service error:", error);
        setService(null);
        setLoadFailed(true);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadService();

    return () => controller.abort();
  }, [id, language]);

  const video = useMemo(() => {
    if (!service) return "";

    return normalizeVideoUrl(
      service.videoUrl ||
        service.youtubeUrl ||
        service.videoLink ||
        service.video ||
        ""
    );
  }, [service]);

  if (loading) {
    return (
      <main className="pageContainer" dir={dir}>
        <p>{t("loading")}</p>
      </main>
    );
  }

  if (!service || loadFailed) {
    return (
      <main className="pageContainer" dir={dir}>
        <h2>{t("serviceNotFound")}</h2>
        <Link to="/services">⬅ {t("backToServices")}</Link>
      </main>
    );
  }

  const name = localize(service, "name");
  const category = localize(service, "category");
  const description = localize(service, "description");
  const address = localize(service, "address");
  const hours = localize(service, "hours");
  const businessName = localize(service, "businessName");

  const professionType =
    localize(service, "professionType") || service.professionType || "";

  const serviceType =
    localize(service, "serviceType") || service.serviceType || "";

  const cities =
    Array.isArray(service.serviceCities) && service.serviceCities.length
      ? service.serviceCities
      : service.city
        ? [service.city]
        : [];

  const websiteUrl = service.websiteUrl || service.link || "";
  const logoUrl = service.logoUrl || service.imageUrl || "";
  const whatsappText = `${name} - בקשת פרטים על השירות`;

  return (
    <main className="pageContainer" dir={dir}>
      <article
        className="card"
        style={{
          maxWidth: 900,
          margin: "20px auto",
          padding: 24,
        }}
      >
        {logoUrl && (
          <img
            src={logoUrl}
            alt={businessName || name}
            style={{
              width: "100%",
              maxHeight: 320,
              objectFit: "contain",
              borderRadius: 18,
              background: "#ffffff",
            }}
          />
        )}

        <h1>{name}</h1>

        {businessName && (
          <p>
            <strong>{businessName}</strong>
          </p>
        )}

        {professionType && (
          <p>
            🧰 <strong>סוג מקצוע:</strong> {professionType}
          </p>
        )}

        {serviceType && (
          <p>
            🛎️ <strong>סוג שירות:</strong> {serviceType}
          </p>
        )}

        {category && (
          <p>
            🗂️ <strong>קטגוריה:</strong> {category}
          </p>
        )}

        {description && <p>{description}</p>}

        {address && (
          <p>
            📍 <strong>{t("address")}:</strong> {address}
          </p>
        )}

        {cities.length > 0 && (
          <p>
            🏙️ <strong>ערים שבהן ניתן השירות:</strong> {cities.join(", ")}
          </p>
        )}

        {service.phone && (
          <p>
            📞 <strong>{t("phone")}:</strong> {service.phone}
          </p>
        )}

        <p>
          🟢 <strong>מקבל WhatsApp:</strong>{" "}
          {service.acceptsWhatsApp ? "כן" : "לא"}
        </p>

        {service.email && (
          <p>
            ✉️ <strong>{t("email")}:</strong> {service.email}
          </p>
        )}

        {hours && (
          <p>
            🕒 <strong>{t("hours")}:</strong> {hours}
          </p>
        )}

        {video && (
          <>
            <h2>🎥 {t("video")}</h2>

            <iframe
              title={t("video")}
              src={video}
              width="100%"
              height="450"
              style={{ border: 0, borderRadius: 16 }}
              allowFullScreen
            />
          </>
        )}

        <div
          style={{
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
            marginTop: 25,
          }}
        >
          {service.phone && (
            <a href={`tel:${service.phone}`}>📞 {t("call")}</a>
          )}

          {service.acceptsWhatsApp && service.phone && (
            <a
              href={buildWhatsAppLink(service.phone, whatsappText)}
              target="_blank"
              rel="noreferrer"
            >
              🟢 {t("whatsapp")}
            </a>
          )}

          {websiteUrl && (
            <a href={websiteUrl} target="_blank" rel="noreferrer">
              🌐 {t("website")}
            </a>
          )}

          <Link to="/services">⬅ {t("backToServices")}</Link>
        </div>
      </article>
    </main>
  );
}

export default ServiceDetails;
