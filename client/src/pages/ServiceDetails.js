import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function ServiceDetails() {
  const { id } = useParams();
  const [service, setService] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3001/api/services")
      .then((res) => res.json())
      .then((data) => {
        const found = data.find((item) => item._id === id);
        setService(found);
      })
      .catch((err) => console.error(err));
  }, [id]);

  if (!service) {
    return (
      <section className="loginBox">
        <h3>השירות לא נמצא</h3>
      </section>
    );
  }

  return (
    <section className="loginBox">
      <h2>{service.icon} {service.name}</h2>
      <h3>{service.category}</h3>

      {service.imageUrl && (
        <img
          src={service.imageUrl}
          alt={service.name}
          style={{ maxWidth: "220px", borderRadius: "14px" }}
        />
      )}

      {service.description && <p>📝 {service.description}</p>}
      {service.phone && <p>📞 {service.phone}</p>}
      {service.email && <p>✉️ {service.email}</p>}
      {service.address && <p>📍 {service.address}</p>}
      {service.hours && <p>🕒 {service.hours}</p>}

      {service.link && service.link !== "#" && (
        <button onClick={() => window.open(service.link, "_blank")}>
          🌐 פתח אתר שירות
        </button>
      )}
    </section>
  );
}

export default ServiceDetails;