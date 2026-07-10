import { useEffect, useState } from "react";

function SecondHand() {
  const API = "https://alonpc02026.onrender.com/api/second-hand";

  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const res = await fetch(API);
      const data = await res.json();
      setItems(data);
    } catch {
      setMessage("לא ניתן לטעון מוצרי יד שנייה כרגע");
    }
  };

  const filteredItems = items.filter((item) => {
    const text = `${item.name} ${item.category} ${item.brand} ${item.condition} ${item.description || ""}`.toLowerCase();
    return text.includes(search.toLowerCase());
  });

  const whatsappText = (item) => {
    return encodeURIComponent(
      `שלום אלון, אני מתעניין במוצר יד שנייה:\n\n${item.name}\nמחיר: ₪${item.price}\nמצב: ${item.condition}`
    );
  };

  return (
    <div>
      <section className="heroBanner">
        <h2>♻️ היד השנייה של אלון</h2>
        <p>מחשבים • מסכים • מדפסות • חלקים • ציוד היקפי • מציאות במחירים טובים</p>
      </section>

      <div className="searchBox">
        <input
          type="text"
          placeholder="🔍 חפש מוצר יד שנייה..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {message && (
        <p style={{ textAlign: "center", color: "white", fontWeight: "bold" }}>
          {message}
        </p>
      )}

      <main className="grid">
        {filteredItems.length === 0 && !message && (
          <h3 style={{ color: "white", textAlign: "center" }}>
            עדיין אין מוצרים ביד השנייה
          </h3>
        )}

        {filteredItems.map((item) => (
          <div className="card" key={item._id}>
            {item.imageUrl ? (
              <img
                src={item.imageUrl}
                alt={item.name}
                style={{
                  width: "120px",
                  height: "120px",
                  objectFit: "cover",
                  borderRadius: "16px",
                  background: "white",
                }}
              />
            ) : (
              <div style={{ fontSize: "55px" }}>♻️</div>
            )}

            <h3>{item.name}</h3>
            <p>{item.category}</p>
            {item.brand && <p>מותג: {item.brand}</p>}
            <p>מצב: {item.condition}</p>
            <h2>₪{item.price}</h2>

            {item.description && (
              <p style={{ fontSize: "15px" }}>{item.description}</p>
            )}

            <a
              href={`https://wa.me/972545221809?text=${whatsappText(item)}`}
              target="_blank"
              rel="noreferrer"
            >
              <button>💬 שאל על המוצר</button>
            </a>
          </div>
        ))}
      </main>
    </div>
  );
}

export default SecondHand;
