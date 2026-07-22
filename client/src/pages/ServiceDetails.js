import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const WHATSAPP = "972545221809";

function ServiceDetails() {
  const { id } = useParams();
  const [service, setService] = useState(null);

  useEffect(() => {
    fetch("https://alonpc02026.onrender.com/api/services")
      .then((r) => r.json())
      .then((data) => {
        const found = data.find((item) => String(item._id) === String(id));
        setService(found || null);
      })
      .catch(console.error);
  }, [id]);

  if (!service) {
    return (
      <main className="pageContainer" dir="rtl">
        <h2>השירות לא נמצא</h2>
        <Link to="/services">⬅ חזרה לשירותים</Link>
      </main>
    );
  }

  const video =
    service.videoUrl ||
    service.youtubeUrl ||
    service.videoLink ||
    service.video ||
    "";

  const embed = video.includes("watch?v=")
    ? video.replace("watch?v=", "embed/")
    : video;

  return (
    <main className="pageContainer" dir="rtl">
      <div className="card" style={{maxWidth:900,margin:"20px auto",padding:24}}>
        {service.imageUrl && (
          <img
            src={service.imageUrl}
            alt={service.name}
            style={{width:"100%",maxHeight:420,objectFit:"cover",borderRadius:18}}
          />
        )}

        <h1>{service.name}</h1>
        <h3>{service.category}</h3>

        {service.description && <p>{service.description}</p>}
        {service.address && <p>📍 {service.address}</p>}
        {service.phone && <p>📞 {service.phone}</p>}
        {service.email && <p>✉️ {service.email}</p>}
        {service.hours && <p>🕒 {service.hours}</p>}

        {embed && (
          <>
            <h2>🎥 סרטון</h2>
            <iframe
              title="video"
              src={embed}
              width="100%"
              height="450"
              style={{border:0,borderRadius:16}}
              allowFullScreen
            />
          </>
        )}

        <div style={{display:"flex",gap:12,flexWrap:"wrap",marginTop:25}}>
          {service.phone && (
            <a href={`tel:${service.phone}`}>📞 התקשר</a>
          )}

          <a
            href={`https://wa.me/${WHATSAPP}`}
            target="_blank"
            rel="noreferrer"
          >
            🟢 WhatsApp
          </a>

          {service.link && (
            <a href={service.link} target="_blank" rel="noreferrer">
              🌐 אתר
            </a>
          )}

          <Link to="/services">⬅ חזרה לשירותים</Link>
        </div>
      </div>
    </main>
  );
}

export default ServiceDetails;
