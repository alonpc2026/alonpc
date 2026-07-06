import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const API = "http://localhost:3001/api/services";

  const [services, setServices] = useState([]);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const res = await fetch(API);
      const data = await res.json();

      if (Array.isArray(data)) {
        setServices(data);
      } else if (Array.isArray(data.services)) {
        setServices(data.services);
      } else if (Array.isArray(data.data)) {
        setServices(data.data);
      } else {
        setServices([]);
      }
    } catch {
      setMessage("לא ניתן לטעון שירותים כרגע");
      setServices([]);
    }
  };

  const filteredServices = services.filter((service) => {
    const text = `${service.name || ""} ${service.category || ""} ${
      service.description || ""
    }`.toLowerCase();

    return text.includes(search.toLowerCase());
  });

  return (
    <div>
      <section className="heroBanner">
        <h2>💻 ברוכים הבאים ל־ALON PC</h2>
        <p>מחשבים • מדפסות • תמיכה מרחוק • ציוד נגישות • חנות אלון</p>

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

      {message && (
        <p style={{ textAlign: "center", color: "white" }}>{message}</p>
      )}

      <main className="grid">
        {filteredServices.length === 0 && !message && (
          <h3 style={{ color: "white", textAlign: "center" }}>
            אין שירותים עדיין
          </h3>
        )}

        {filteredServices.map((service) => (
          <button
            className="card"
            key={service._id}
            onClick={() => navigate(`/service/${service._id}`)}
          >
            <h3>
              {service.icon || "🛎️"} {service.name}
            </h3>
            <p>{service.category}</p>
            <small>{service.description}</small>
          </button>
        ))}
      </main>
    </div>
  );
}

export default Home;