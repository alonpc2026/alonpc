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
      <header className="top">
        <h1>ALONPC</h1>
        <h2>מרכז שירותים לאנשים עם מוגבלויות</h2>
        <p>ברוכים הבאים למרכז השירותים של ALONPC</p>
      </header>

      <div className="searchBox">
        <input
          type="text"
          placeholder="חפש שירות..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <main className="grid">
        {filteredServices.map((service) => (
          <button
            className="card"
            key={service._id}
            onClick={() => navigate(`/service/${service._id}`)}
          >
            <div style={{ fontSize: "42px" }}>{service.icon}</div>
            <h3>{service.name}</h3>
            <p>{service.category}</p>
            <small>ℹ️ פרטים נוספים</small>
          </button>
        ))}
      </main>
    </div>
  );
}

export default Home;