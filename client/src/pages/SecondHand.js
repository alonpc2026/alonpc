import { useEffect, useState } from "react";

function SecondHand() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("secondHandItems")) || [];
    setItems(saved);
  }, []);

  const filteredItems = items.filter((item) => {
    const text = `${item.name} ${item.category} ${item.condition} ${item.description || ""}`.toLowerCase();
    return text.includes(search.toLowerCase());
  });

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

      <main className="grid">
        {filteredItems.length === 0 && (
          <h3 style={{ color: "white", textAlign: "center" }}>
            עדיין אין מוצרים ביד השנייה
          </h3>
        )}

        {filteredItems.map((item, index) => (
          <div className="card" key={index}>
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
            <p>מצב: {item.condition}</p>
            <h2>₪{item.price}</h2>

            {item.description && (
              <p style={{ fontSize: "15px" }}>{item.description}</p>
            )}

            <a
              href="https://wa.me/972545221809"
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