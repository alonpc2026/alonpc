import { useEffect, useState } from "react";

function Shop() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("הכול");

  useEffect(() => {
    fetch("http://localhost:3001/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error(err));
  }, []);

  const categories = [
    "הכול",
    ...new Set(products.map((product) => product.category)),
  ];

  const filteredProducts = products.filter((product) => {
    const text = `${product.name} ${product.category} ${product.brand || ""} ${product.description || ""}`.toLowerCase();

    const matchSearch = text.includes(search.toLowerCase());

    const matchCategory =
      selectedCategory === "הכול" ||
      product.category === selectedCategory;

    return matchSearch && matchCategory;
  });

  return (
    <div>
      <section className="heroBanner">
        <h2>🛒 חנות ALON PC</h2>
        <p>מחשבים • מדפסות • ציוד היקפי • ציוד נגישות</p>
      </section>

      <div className="searchBox">
        <input
          type="text"
          placeholder="🔍 חפש מוצר..."
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
        {filteredProducts.length === 0 && (
          <h3 style={{ color: "white", textAlign: "center" }}>
            עדיין אין מוצרים בחנות
          </h3>
        )}

        {filteredProducts.map((product) => (
          <div className="card" key={product._id}>
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                style={{
                  width: "100px",
                  height: "100px",
                  objectFit: "cover",
                  borderRadius: "16px",
                  background: "white",
                }}
              />
            ) : (
              <div style={{ fontSize: "50px" }}>🛒</div>
            )}

            <h3>{product.name}</h3>
            <p>{product.category}</p>

            {product.brand && <p>🏷️ {product.brand}</p>}

            <h2>₪{product.price}</h2>

            <small>מלאי: {product.stock}</small>

            {product.description && (
              <p style={{ fontSize: "15px" }}>{product.description}</p>
            )}

            <button>🛒 הוסף לעגלה</button>
          </div>
        ))}
      </main>
    </div>
  );
}

export default Shop;