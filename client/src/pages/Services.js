import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

const API = "https://alonpc02026.onrender.com/api/services";
const WHATSAPP = "972545221809";

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

        if (response.ok) {
          const item = await response.json();
          setService(item);
          return;
        }

        const allResponse = await fetch(API, {
          signal: controller.signal,
        });

        const data = await allResponse.json().catch(() => []);
        const found = Array.isArray(data)
          ? data.find((item) => String(item._id) === String(id))
          : null;

        setService(found || null);
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
  const city = localize(service, "city");
  const hours = localize(service, "hours");
  const businessName = localize(service, "businessName");

  const whatsappText = encodeURIComponent(
    `${name} - ${t("servicesDetails")}`
  );

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
        {service.imageUrl && (
          <img
            src={service.imageUrl}
            alt={name}
            style={{
              width: "100%",
              maxHeight: 420,
              objectFit: "cover",
              borderRadius: 18,
            }}
          />
        )}

        <h1>{name}</h1>

        {category && <h3>{category}</h3>}
        {businessName && <p><strong>{businessName}</strong></p>}
        {description && <p>{description}</p>}

        {(address || city) && (
          <p>
            📍 <strong>{t("address")}:</strong>{" "}
            {[address, city].filter(Boolean).join(", ")}
          </p>
        )}

        {service.phone && (
          <p>
            📞 <strong>{t("phone")}:</strong> {service.phone}
          </p>
        )}

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
              style={{
                border: 0,
                borderRadius: 16,
              }}
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
            <a href={`tel:${service.phone}`}>
              📞 {t("call")}
            </a>
          )}

          <a
            href={`https://wa.me/${WHATSAPP}?text=${whatsappText}`}
            target="_blank"
            rel="noreferrer"
          >
            🟢 {t("whatsapp")}
          </a>

          {service.link && (
            <a
              href={service.link}
              target="_blank"
              rel="noreferrer"
            >
              🌐 {t("website")}
            </a>
          )}

          <Link to="/services">
            ⬅ {t("backToServices")}
          </Link>
        </div>
      </article>
    </main>
  );
}

export default ServiceDetails;
