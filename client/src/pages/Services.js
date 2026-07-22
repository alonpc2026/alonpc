import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Services() {
  const API = "https://alonpc02026.onrender.com/api/services";
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
      setServices(Array.isArray(data) ? data : []);
    } catch {
      setMessage("לא ניתן לטעון שירותים כרגע");
    }
  };

  const filteredServices = services.filter((service) => {
    const text = `${service.name} ${service.category} ${service.description || ""}`.toLowerCase();
    return text.includes(search.toLowerCase());
  });

  return (
    <div className="servicesPage" dir="rtl">
      <section className="heroBanner">
        <h2>🛎️ שירותים</h2>
        <p>כל השירותים, העסקים והסיוע במקום אחד</p>
      </section>

      <div className="searchBox">
        <input
          type="text"
          placeholder="🔍 חפש שירות..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {message && <p className="statusMessage">{message}</p>}

      <main className="grid">
        {filteredServices.map((service) => (
          <article className="card" key={service._id}>
            {service.imageUrl && (
              <img
                src={service.imageUrl}
                alt={service.name}
                style={{width:"100%",height:"180px",objectFit:"cover",borderRadius:"10px"}}
              />
            )}

            <h3>{service.icon || "🛎️"} {service.name}</h3>
            <p><b>{service.category}</b></p>
            <small>{service.description}</small>

            <button
              style={{marginTop:15}}
              onClick={() => navigate(`/service/${service._id}`)}
            >
              לפרטים נוספים
            </button>
          </article>
        ))}
      </main>
    </div>
  );
}

export default Services;
