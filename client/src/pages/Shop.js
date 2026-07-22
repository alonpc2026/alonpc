import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

const API = "https://alonpc02026.onrender.com/api/products";

function Shop() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [message, setMessage] = useState("טוען מוצרים...");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetch(API);

        if (!response.ok) {
          throw new Error("לא ניתן לקבל את המוצרים");
        }

        const data = await response.json();

        setProducts(Array.isArray(data) ? data : []);
        setMessage("");
      } catch (error) {
        setProducts([]);
        setMessage(`שגיאה בטעינת החנות: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const categories = useMemo(() => {
    return [
      ...new Set(
        products
          .map((product) => product.category)
          .filter(Boolean)
      ),
    ];
  }, [products]);

  const filteredProducts = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesCategory =
        !selectedCategory ||
        product.category === selectedCategory;

      const combinedText = [
        product.name,
        product.category,
        product.brand,
        product.description,
        product.condition,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !searchText || combinedText.includes(searchText);

      return matchesCategory && matchesSearch;
    });
  }, [products, search, selectedCategory]);

  const formatPrice = (price) => {
    const number = Number(price);

    if (!Number.isFinite(number)) {
      return price || "";
    }

    return number.toLocaleString("he-IL");
  };

  return (
    <main className="pageContainer" dir="rtl">
      <section className="heroBanner">
        <h1>🛒 החנות של אלון - ALON PC</h1>
        <p>
          מחשבים, ציוד טכנולוגי ומוצרים נגישים
        </p>
      </section>

      <section className="searchBox">
        <input
          type="search"
          placeholder="🔍 חיפוש מוצר..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </section>

      {categories.length > 0 && (
        <section className="governmentCategories">
          <button
            type="button"
            className={
              selectedCategory === ""
                ? "categoryButton active"
                : "categoryButton"
            }
            onClick={() => setSelectedCategory("")}
          >
            כל המוצרים
          </button>

          {categories.map((category) => (
            <button
              type="button"
              key={category}
              className={
                selectedCategory === category
                  ? "categoryButton active"
                  : "categoryButton"
              }
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </section>
      )}

      {loading && (
        <p className="statusMessage">
          טוען מוצרים...
        </p>
      )}

      {!loading && message && (
        <p className="statusMessage">{message}</p>
      )}

      {!loading &&
        !message &&
        filteredProducts.length === 0 && (
          <section className="emptyState">
            <h2>אין כרגע מוצרים להצגה</h2>
            <p>
              ניתן להוסיף מוצרים דרך פורטל הניהול.
            </p>
          </section>
        )}

      <section className="grid">
        {filteredProducts.map((product) => (
          <article className="card productCard" key={product._id}>
            <Link
              to={`/product/${product._id}`}
              className="productImageLink"
              aria-label={`פרטים על ${product.name}`}
            >
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.name || "תמונת מוצר"}
                  className="productImage"
                  loading="lazy"
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                    event.currentTarget.nextElementSibling.style.display =
                      "flex";
                  }}
                />
              ) : null}

              <div
                className="productImagePlaceholder"
                style={{
                  display: product.imageUrl ? "none" : "flex",
                }}
              >
                🖥️
              </div>
            </Link>

            <h2>{product.name}</h2>

            {product.category && (
              <p>
                <strong>קטגוריה:</strong>{" "}
                {product.category}
              </p>
            )}

            {product.brand && (
              <p>
                <strong>מותג:</strong> {product.brand}
              </p>
            )}

            {product.description && (
              <p className="productShortDescription">
                {product.description.length > 130
                  ? `${product.description.slice(0, 130)}...`
                  : product.description}
              </p>
            )}

            {product.price !== undefined &&
              product.price !== "" && (
                <p className="productPrice">
                  ₪{formatPrice(product.price)}
                </p>
              )}

            <Link
              to={`/product/${product._id}`}
              className="detailsButton"
            >
              🔎 פרטים נוספים
            </Link>
          </article>
        ))}
      </section>
    </main>
  );
}

export default Shop;