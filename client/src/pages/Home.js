import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const [services, setServices] = useState([]);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:3001/api/services")
      .then((res) => res.json())
      .then((data) => setServices(data))
      .catch((err) => console.error(err));
  }, []);

  const filteredServices = services.filter((service) => {
    const text =
      `${service.name} ${service.category} ${service.description || ""}`.toLowerCase();

    return text.includes(search.toLowerCase());
  });

  return (
    <div>

      <section className="heroBanner">
        <h2>💻 ברוכים הבאים ל־ALON PC</h2>

        <p>
          מחשבים • מדפסות • תמיכה מרחוק • ציוד נגישות • חנות אלון
        </p>

        <button onClick={() => navigate("/services")}>
          🚀 לכל השירותים
        </button>
      </section>

      <div className="searchBox">
        <input
          type="text"
          placeholder="🔍 חפש שירות..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <main className="grid">

        {filteredServices.length === 0 && (
          <h3 style={{ textAlign: "center", width: "100%" }}>
            לא נמצאו שירותים
          </h3>
        )}

        {filteredServices.map((service) => (
          <button
            className="card"
            key={service._id}
            onClick={() => navigate(`/service/${service._id}`)}
          >
            {service.imageUrl ? (
              <img
                src={service.imageUrl}
                alt={service.name}
                style={{
                  width: "90px",
                  height: "90px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  background: "#ffffff",
                  marginBottom: "12px",
                }}
              />
            ) : (
              <div style={{ fontSize: "50px" }}>
                {service.icon}
              </div>
            )}

            <h3>{service.name}</h3>

            <p>{service.category}</p>

            {service.description && (
              <small
                style={{
                  display: "block",
                  marginTop: "8px",
                  color: "#f1f5f9",
                }}
              >
                {service.description}
              </small>
            )}

            <div
              style={{
                marginTop: "15px",
                fontWeight: "bold",
              }}
            >
              ℹ️ לחץ לצפייה בפרטים
            </div>

          </button>
        ))}

      </main>

    </div>
  );
}

export default Home;