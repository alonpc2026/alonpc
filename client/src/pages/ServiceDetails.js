import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function ServiceDetails() {
  const { id } = useParams();
  const [service, setService] = useState(null);

  useEffect(() => {
    fetch("https://alonpc-server.onrender.com/api/services")
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

  const openMap = () => {
    if (service.address) {
      window.open(
        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          service.address
        )}`,
        "_blank"
      );
    }
  };

  return (
    <section className="loginBox">
      {service.imageUrl ? (
        <img
          src={service.imageUrl}
          alt={service.name}
          style={{
            width: "180px",
            height: "180px",
            objectFit: "cover",
            borderRadius: "50%",
            display: "block",
            margin: "0 auto 20px",
            background: "white",
          }}
        />
      ) : (
        <div style={{ fontSize: "70px", textAlign: "center" }}>
          {service.icon}
        </div>
      )}

      <h2>{service.name}</h2>
      <h3>{service.category}</h3>

      {service.description && <p>📝 {service.description}</p>}
      {service.phone && <p>📞 {service.phone}</p>}
      {service.email && <p>✉️ {service.email}</p>}
      {service.address && <p>📍 {service.address}</p>}
      {service.hours && <p>🕒 {service.hours}</p>}

      <div>
        {service.phone && (
          <button onClick={() => (window.location.href = `tel:${service.phone}`)}>
            📞 התקשר
          </button>
        )}

        {service.email && (
          <button
            onClick={() =>
              (window.location.href = `mailto:${service.email}`)
            }
          >
            ✉️ שלח אימייל
          </button>
        )}

        {service.link && service.link !== "#" && (
          <button onClick={() => window.open(service.link, "_blank")}>
            🌐 פתח אתר
          </button>
        )}

        {service.address && (
          <button onClick={openMap}>
            📍 נווט
          </button>
        )}
      </div>
    </section>
  );
}

export default ServiceDetails;
