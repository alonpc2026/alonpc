import { useEffect, useState } from "react";

function Shop() {
  const API = "http://localhost:3001/api/products";
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const res = await fetch(API);
      const data = await res.json();
      setProducts(data);
    } catch {
      setMessage("לא ניתן לטעון מוצרים כרגע");
    }
  };

  const filteredProducts = products.filter((product) => {
    const text = `${product.name} ${product.category} ${product.brand} ${product.description || ""}`.toLowerCase();
    return text.includes(search.toLowerCase());
  });

  return (
    <div>
      <section className="heroBanner">
        <h2>🛍️ חנות אלון</h2>
        <p>מחשבים • מדפסות • ציוד היקפי • תוכנות • סטרימרים</p>
      </section>

      <div className="searchBox">
        <input
          type="text"
          placeholder="🔍 חפש מוצר..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {message && <p style={{ textAlign: "center", color: "white" }}>{message}</p>}

      <main className="grid">
        {filteredProducts.map((product) => (
          <div className="card" key={product._id}>
            <h3>{product.name}</h3>
            <p>{product.category}</p>
            <p>{product.brand}</p>
            <h2>₪{product.price}</h2>

            <a
              href={`https://wa.me/972545221809?text=${encodeURIComponent(
                `שלום אלון, אני מתעניין במוצר: ${product.name}`
              )}`}
              target="_blank"
              rel="noreferrer"
            >
              <button>💬 WhatsApp</button>
            </a>
          </div>
        ))}
      </main>
    </div>
  );
}

export default Shop;