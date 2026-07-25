import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

const API = "https://alonpc02026.onrender.com/api/services";

function normalizePhone(phone) {
  return String(phone || "").replace(/[^\d+]/g, "");
}

function buildWhatsAppLink(phone, name) {
  let cleanPhone = normalizePhone(phone);

  if (cleanPhone.startsWith("0")) {
    cleanPhone = `972${cleanPhone.slice(1)}`;
  }

  cleanPhone = cleanPhone.replace(/^\+/, "");

  const text = encodeURIComponent(
    `שלום, אני פונה דרך אתר ALONPC בנוגע לשירות: ${name}`
  );

  return `https://wa.me/${cleanPhone}?text=${text}`;
}

function Services() {
  const { dir, localize } = useLanguage();

  const [services, setServices] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedProfession, setSelectedProfession] = useState("");
  const [selectedServiceType, setSelectedServiceType] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadServices() {
      try {
        setLoading(true);
        setErrorMessage("");

        const response = await fetch(API, {
          signal: controller.signal,
        });

        const data = await response.json().catch(() => []);

        if (!response.ok) {
          throw new Error(
            data.message || "לא ניתן לטעון את השירותים"
          );
        }

        const activeServices = Array.isArray(data)
          ? data.filter((service) => service.active !== false)
          : [];

        setServices(activeServices);
      } catch (error) {
        if (error.name === "AbortError") {
          return;
        }

        console.error("Load services error:", error);
        setServices([]);
        setErrorMessage("לא ניתן לטעון את השירותים כרגע.");
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadServices();

    return () => controller.abort();
  }, []);

  const cities = useMemo(() => {
    const allCities = services.flatMap((service) => {
      if (
        Array.isArray(service.serviceCities) &&
        service.serviceCities.length > 0
      ) {
        return service.serviceCities;
      }

      return service.city ? [service.city] : [];
    });

    return [...new Set(allCities.filter(Boolean))].sort((a, b) =>
      a.localeCompare(b, "he")
    );
  }, [services]);

  const professions = useMemo(() => {
    const values = services
      .map((service) => service.professionType)
      .filter(Boolean);

    return [...new Set(values)].sort((a, b) =>
      a.localeCompare(b, "he")
    );
  }, [services]);

  const serviceTypes = useMemo(() => {
    const values = services
      .map((service) => service.serviceType)
      .filter(Boolean);

    return [...new Set(values)].sort((a, b) =>
      a.localeCompare(b, "he")
    );
  }, [services]);

  const filteredServices = useMemo(() => {
    const query = search.trim().toLowerCase();

    return services.filter((service) => {
      const serviceCities =
        Array.isArray(service.serviceCities) &&
        service.serviceCities.length > 0
          ? service.serviceCities
          : service.city
            ? [service.city]
            : [];

      const searchableText = [
        service.name,
        service.businessName,
        service.professionType,
        service.serviceType,
        service.category,
        service.description,
        service.address,
        service.phone,
        ...serviceCities,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !query || searchableText.includes(query);

      const matchesCity =
        !selectedCity || serviceCities.includes(selectedCity);

      const matchesProfession =
        !selectedProfession ||
        service.professionType === selectedProfession;

      const matchesServiceType =
        !selectedServiceType ||
        service.serviceType === selectedServiceType;

      return (
        matchesSearch &&
        matchesCity &&
        matchesProfession &&
        matchesServiceType
      );
    });
  }, [
    services,
    search,
    selectedCity,
    selectedProfession,
    selectedServiceType,
  ]);

  const clearFilters = () => {
    setSearch("");
    setSelectedCity("");
    setSelectedProfession("");
    setSelectedServiceType("");
  };

  return (
    <main
      dir={dir}
      style={{
        maxWidth: 1300,
        margin: "0 auto",
        padding: "24px 16px 40px",
      }}
    >
      <section style={styles.hero}>
        <h1 style={styles.heroTitle}>
          מאגר שירותים נגישים
        </h1>

        <p style={styles.heroText}>
          חיפוש נותני שירות, עסקים ואנשי מקצוע לפי מקצוע,
          סוג שירות ועיר.
        </p>
      </section>

      <section
        aria-label="סינון שירותים"
        style={styles.filtersPanel}
      >
        <div style={styles.filtersGrid}>
          <label style={styles.label}>
            חיפוש חופשי

            <input
              type="search"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="שם עסק, מקצוע, עיר או טלפון"
              style={styles.field}
            />
          </label>

          <label style={styles.label}>
            עיר

            <select
              value={selectedCity}
              onChange={(event) =>
                setSelectedCity(event.target.value)
              }
              style={styles.field}
            >
              <option value="">כל הערים</option>

              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </label>

          <label style={styles.label}>
            סוג מקצוע

            <select
              value={selectedProfession}
              onChange={(event) =>
                setSelectedProfession(event.target.value)
              }
              style={styles.field}
            >
              <option value="">כל המקצועות</option>

              {professions.map((profession) => (
                <option
                  key={profession}
                  value={profession}
                >
                  {profession}
                </option>
              ))}
            </select>
          </label>

          <label style={styles.label}>
            סוג שירות

            <select
              value={selectedServiceType}
              onChange={(event) =>
                setSelectedServiceType(event.target.value)
              }
              style={styles.field}
            >
              <option value="">כל סוגי השירות</option>

              {serviceTypes.map((serviceType) => (
                <option
                  key={serviceType}
                  value={serviceType}
                >
                  {serviceType}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div style={styles.filtersBottom}>
          <strong>
            נמצאו {filteredServices.length} שירותים
          </strong>

          <button
            type="button"
            onClick={clearFilters}
            style={styles.clearButton}
          >
            ניקוי סינון
          </button>
        </div>
      </section>

      {loading ? (
        <section style={styles.status}>
          <h2>טוען שירותים...</h2>
        </section>
      ) : errorMessage ? (
        <section style={styles.status}>
          <h2>{errorMessage}</h2>
        </section>
      ) : filteredServices.length === 0 ? (
        <section style={styles.status}>
          <h2>לא נמצאו שירותים מתאימים</h2>

          <p>
            אפשר לשנות את החיפוש או לנקות את הסינון.
          </p>
        </section>
      ) : (
        <section
          aria-label="רשימת שירותים"
          style={styles.servicesGrid}
        >
          {filteredServices.map((service) => {
            const name =
              localize(service, "name") ||
              service.name ||
              "שירות";

            const businessName =
              localize(service, "businessName") ||
              service.businessName ||
              "";

            const description =
              localize(service, "description") ||
              service.description ||
              "";

            const professionType =
              localize(service, "professionType") ||
              service.professionType ||
              "";

            const serviceType =
              localize(service, "serviceType") ||
              service.serviceType ||
              "";

            const address =
              localize(service, "address") ||
              service.address ||
              "";

            const serviceCities =
              Array.isArray(service.serviceCities) &&
              service.serviceCities.length > 0
                ? service.serviceCities
                : service.city
                  ? [service.city]
                  : [];

            const logoUrl =
              service.logoUrl ||
              service.imageUrl ||
              "";

            const websiteUrl =
              service.websiteUrl ||
              service.link ||
              "";

            return (
              <article
                key={service._id}
                style={styles.serviceCard}
              >
                <div style={styles.logoBox}>
                  {logoUrl ? (
                    <img
                      src={logoUrl}
                      alt={businessName || name}
                      style={styles.logoImage}
                    />
                  ) : (
                    <span style={{ fontSize: 58 }}>
                      🛎️
                    </span>
                  )}
                </div>

                <h2 style={styles.cardTitle}>
                  {name}
                </h2>

                {businessName && (
                  <p style={styles.businessName}>
                    {businessName}
                  </p>
                )}

                {professionType && (
                  <p style={styles.infoLine}>
                    🧰 <strong>סוג מקצוע:</strong>{" "}
                    {professionType}
                  </p>
                )}

                {serviceType && (
                  <p style={styles.infoLine}>
                    🛎️ <strong>סוג שירות:</strong>{" "}
                    {serviceType}
                  </p>
                )}

                {address && (
                  <p style={styles.infoLine}>
                    📍 <strong>כתובת:</strong>{" "}
                    {address}
                  </p>
                )}

                {serviceCities.length > 0 && (
                  <p style={styles.infoLine}>
                    🏙️ <strong>ערי שירות:</strong>{" "}
                    {serviceCities.join(", ")}
                  </p>
                )}

                {service.phone && (
                  <p style={styles.infoLine}>
                    📞 <strong>טלפון:</strong>{" "}
                    {service.phone}
                  </p>
                )}

                <p style={styles.infoLine}>
                  🟢 <strong>WhatsApp:</strong>{" "}
                  {service.acceptsWhatsApp ? "כן" : "לא"}
                </p>

                {description && (
                  <p style={styles.description}>
                    {description.length > 170
                      ? `${description.slice(0, 170)}...`
                      : description}
                  </p>
                )}

                <div style={styles.actions}>
                  <Link
                    to={`/service/${service._id}`}
                    style={styles.detailsButton}
                  >
                    פרטים מלאים
                  </Link>

                  {service.phone && (
                    <a
                      href={`tel:${service.phone}`}
                      style={styles.callButton}
                    >
                      התקשר
                    </a>
                  )}

                  {service.acceptsWhatsApp &&
                    service.phone && (
                      <a
                        href={buildWhatsAppLink(
                          service.phone,
                          name
                        )}
                        target="_blank"
                        rel="noreferrer"
                        style={styles.whatsappButton}
                      >
                        WhatsApp
                      </a>
                    )}

                  {websiteUrl && (
                    <a
                      href={websiteUrl}
                      target="_blank"
                      rel="noreferrer"
                      style={styles.websiteButton}
                    >
                      אתר העסק
                    </a>
                  )}
                </div>
              </article>
            );
          })}
        </section>
      )}
    </main>
  );
}

const baseButton = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 44,
  padding: "9px 15px",
  borderRadius: 10,
  color: "white",
  textDecoration: "none",
  fontWeight: 800,
};

const styles = {
  hero: {
    background:
      "linear-gradient(135deg, #0f766e 0%, #2563eb 100%)",
    color: "white",
    borderRadius: 22,
    padding: "30px 24px",
    marginBottom: 24,
    boxShadow:
      "0 12px 30px rgba(15, 118, 110, 0.22)",
  },

  heroTitle: {
    margin: "0 0 10px",
    fontSize: "clamp(30px, 5vw, 48px)",
  },

  heroText: {
    margin: 0,
    fontSize: 19,
    lineHeight: 1.7,
  },

  filtersPanel: {
    background: "#ffffff",
    borderRadius: 18,
    padding: 20,
    marginBottom: 24,
    boxShadow:
      "0 6px 24px rgba(15, 23, 42, 0.10)",
  },

  filtersGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 14,
  },

  label: {
    display: "grid",
    gap: 7,
    fontWeight: 800,
    fontSize: 16,
  },

  field: {
    width: "100%",
    minHeight: 48,
    padding: "10px 12px",
    border: "2px solid #cbd5e1",
    borderRadius: 10,
    fontSize: 17,
    background: "white",
    boxSizing: "border-box",
  },

  filtersBottom: {
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
    alignItems: "center",
    flexWrap: "wrap",
    marginTop: 18,
  },

  clearButton: {
    border: 0,
    borderRadius: 10,
    padding: "11px 18px",
    background: "#475569",
    color: "white",
    fontSize: 16,
    fontWeight: 700,
    cursor: "pointer",
  },

  status: {
    background: "#ffffff",
    borderRadius: 18,
    padding: 30,
    textAlign: "center",
    boxShadow:
      "0 6px 22px rgba(15, 23, 42, 0.10)",
  },

  servicesGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(300px, 1fr))",
    gap: 20,
  },

  serviceCard: {
    background: "#ffffff",
    borderRadius: 18,
    padding: 18,
    boxShadow:
      "0 6px 22px rgba(15, 23, 42, 0.10)",
    border: "2px solid #e2e8f0",
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },

  logoBox: {
    width: "100%",
    height: 180,
    borderRadius: 14,
    background: "#f8fafc",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },

  logoImage: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },

  cardTitle: {
    margin: "0 0 6px",
    fontSize: 25,
  },

  businessName: {
    margin: "0 0 8px",
    fontWeight: 800,
    color: "#0f766e",
  },

  infoLine: {
    margin: 0,
    lineHeight: 1.6,
  },

  description: {
    margin: 0,
    lineHeight: 1.7,
    color: "#334155",
  },

  actions: {
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
    marginTop: "auto",
    paddingTop: 8,
  },

  detailsButton: {
    ...baseButton,
    background: "#1d4ed8",
  },

  callButton: {
    ...baseButton,
    background: "#0f766e",
  },

  whatsappButton: {
    ...baseButton,
    background: "#15803d",
  },

  websiteButton: {
    ...baseButton,
    background: "#7c3aed",
  },
};

export default Services;