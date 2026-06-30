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
    const matchSearch = `${service.name} ${service.category}`
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchCategory =
      selectedCategory === "הכול" || service.category === selectedCategory;

    return matchSearch && matchCategory;
  });

  return (
    <div>
      <header className="top">
        <h1>ALONPC</h1>
        <h2>כל השירותים</h2>
      </header>

      <div className="searchBox">
        <input
          type="text"
          placeholder="חפש שירות..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="categoryBox">
        {categories.map((category) => (
          <button
            key={category}
            className={selectedCategory === category ? "activeCategory" : ""}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
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

export default Services;