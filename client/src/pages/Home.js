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
    const text = `${service.name} ${service.category}`.toLowerCase();
    return text.includes(search.toLowerCase());
  });

  return (
    <div>

      <section className="heroBanner">

        <h2>💻 ברוכים הבאים ל־ALON PC</h2>

        <p>
          מחשבים • מדפסות • רשתות • תמיכה מרחוק • חנות מחשבים • שירותי נגישות
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

        {filteredServices.map((service) => (

          <button
            key={service._id}
            className="card"
            onClick={() => navigate(`/service/${service._id}`)}
          >

            <div style={{ fontSize: "46px" }}>
              {service.icon}
            </div>

            <h3>{service.name}</h3>

            <p>{service.category}</p>

            <small>לחץ לצפייה בפרטים</small>

          </button>

        ))}

      </main>

    </div>
  );
}

export default Home;