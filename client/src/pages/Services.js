import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Services() {
  const [services, setServices] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("הכול");

  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:3001/api/services")
      .then((res) => res.json())
      .then((data) => setServices(data))
      .catch((err) => console.error(err));
  }, []);

  const categories = [
    "הכול",
    ...new Set(services.map((service) => service.category)),
  ];

  const filteredServices = services.filter((service) => {
    const text =
      `${service.name} ${service.category} ${service.description || ""}`.toLowerCase();

    const matchSearch = text.includes(search.toLowerCase());

    const matchCategory =
      selectedCategory === "הכול" ||
      service.category === selectedCategory;

    return matchSearch && matchCategory;
  });

  return (
    <div>

      <section className="heroBanner">
        <h2>🛎️ כל השירותים</h2>

        <p>
          חפש שירות, מוסד או ארגון בלחיצה אחת
        </p>
      </section>

      <div className="searchBox">
        <input
          type="text"
          placeholder="🔍 חפש שירות..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="categoryBox">
        {categories.map((category) => (
          <button
            key={category}
            className={
              selectedCategory === category
                ? "activeCategory"
                : ""
            }
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <main className="grid">

        {filteredServices.length === 0 && (
          <h3 style={{ textAlign: "center", color: "white" }}>
            לא נמצאו שירותים
          </h3>
        )}

        {filteredServices.map((service) => (
          <button
            className="card"
            key={service._id}
            onClick={() =>
              navigate(`/service/${service._id}`)
            }
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
                  background: "#fff",
                  marginBottom: "12px",
                }}
              />
            ) : (
              <div style={{ fontSize: "48px" }}>
                {service.icon}
              </div>
            )}

            <h3>{service.name}</h3>

            <p>{service.category}</p>

            <small>ℹ️ לחץ לצפייה בפרטים</small>

          </button>
        ))}

      </main>

    </div>
  );
}

export default Services;