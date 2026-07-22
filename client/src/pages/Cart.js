import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

function Cart() {
  const {
    cart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    totalItems,
    totalPrice,
  } = useCart();

  const formatPrice = (price) => {
    const number = Number(price || 0);

    if (!Number.isFinite(number)) {
      return "0";
    }

    return number.toLocaleString("he-IL");
  };

  if (cart.length === 0) {
    return (
      <main className="pageContainer" dir="rtl">
        <section
          className="card"
          style={{
            maxWidth: "900px",
            margin: "0 auto",
            padding: "30px",
            textAlign: "center",
          }}
        >
          <h1>🛒 עגלת הקניות</h1>

          <div
            style={{
              fontSize: "90px",
              marginTop: "20px",
              marginBottom: "20px",
            }}
          >
            🛒
          </div>

          <h2>העגלה שלך עדיין ריקה</h2>

          <p style={{ fontSize: "18px", lineHeight: 1.7 }}>
            ניתן להיכנס לחנות, לבחור מוצר ולהוסיף אותו לעגלת הקניות.
          </p>

          <Link
            to="/shop"
            className="detailsButton"
            style={{
              display: "inline-block",
              marginTop: "20px",
              padding: "15px 25px",
              textDecoration: "none",
              fontSize: "20px",
              fontWeight: "bold",
            }}
          >
            🛍️ מעבר לחנות
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="pageContainer" dir="rtl">
      <section
        className="card"
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "24px",
        }}
      >
        <h1 style={{ textAlign: "center", marginTop: 0 }}>
          🛒 עגלת הקניות
        </h1>

        <p
          style={{
            textAlign: "center",
            fontSize: "18px",
            marginBottom: "25px",
          }}
        >
          מספר פריטים בעגלה: <strong>{totalItems}</strong>
        </p>

        <div
          style={{
            display: "grid",
            gap: "18px",
          }}
        >
          {cart.map((item) => {
            const itemTotal =
              Number(item.price || 0) * Number(item.quantity || 1);

            return (
              <article
                key={item._id}
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "minmax(120px, 170px) minmax(220px, 1fr)",
                  gap: "20px",
                  alignItems: "center",
                  border: "1px solid #dddddd",
                  borderRadius: "16px",
                  padding: "16px",
                  background: "#ffffff",
                }}
              >
                <div>
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.name || "תמונת מוצר"}
                      referrerPolicy="no-referrer"
                      style={{
                        width: "100%",
                        height: "150px",
                        objectFit: "contain",
                        borderRadius: "12px",
                        background: "#f7f7f7",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "100%",
                        height: "150px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "12px",
                        background: "#f1f1f1",
                        fontSize: "70px",
                      }}
                    >
                      🖥️
                    </div>
                  )}
                </div>

                <div>
                  <h2 style={{ marginTop: 0 }}>
                    {item.name || "מוצר ללא שם"}
                  </h2>

                  {item.model && (
                    <p>
                      <strong>דגם:</strong> {item.model}
                    </p>
                  )}

                  <p style={{ fontSize: "19px" }}>
                    <strong>מחיר ליחידה:</strong>{" "}
                    ₪{formatPrice(item.price)}
                  </p>

                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      alignItems: "center",
                      gap: "10px",
                      marginTop: "15px",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => increaseQuantity(item._id)}
                      aria-label={`הגדלת כמות של ${item.name}`}
                      style={{
                        minWidth: "48px",
                        minHeight: "44px",
                        border: "none",
                        borderRadius: "10px",
                        fontSize: "24px",
                        fontWeight: "bold",
                        cursor: "pointer",
                        background: "#d8f3dc",
                      }}
                    >
                      +
                    </button>

                    <span
                      style={{
                        minWidth: "55px",
                        textAlign: "center",
                        fontSize: "22px",
                        fontWeight: "bold",
                      }}
                    >
                      {item.quantity}
                    </span>

                    <button
                      type="button"
                      onClick={() => decreaseQuantity(item._id)}
                      aria-label={`הקטנת כמות של ${item.name}`}
                      style={{
                        minWidth: "48px",
                        minHeight: "44px",
                        border: "none",
                        borderRadius: "10px",
                        fontSize: "24px",
                        fontWeight: "bold",
                        cursor: "pointer",
                        background: "#fff3bf",
                      }}
                    >
                      −
                    </button>

                    <button
                      type="button"
                      onClick={() => removeFromCart(item._id)}
                      style={{
                        minHeight: "44px",
                        padding: "8px 16px",
                        border: "none",
                        borderRadius: "10px",
                        fontSize: "17px",
                        fontWeight: "bold",
                        cursor: "pointer",
                        background: "#ffd6d6",
                      }}
                    >
                      🗑️ מחיקה
                    </button>
                  </div>

                  <p
                    style={{
                      marginTop: "18px",
                      marginBottom: 0,
                      fontSize: "21px",
                    }}
                  >
                    <strong>סה״כ למוצר:</strong>{" "}
                    ₪{formatPrice(itemTotal)}
                  </p>
                </div>
              </article>
            );
          })}
        </div>

        <section
          style={{
            marginTop: "28px",
            padding: "22px",
            borderRadius: "16px",
            background: "#f4f7fb",
          }}
        >
          <h2 style={{ marginTop: 0 }}>סיכום עגלה</h2>

          <p style={{ fontSize: "20px" }}>
            מספר פריטים: <strong>{totalItems}</strong>
          </p>

          <p style={{ fontSize: "28px", marginBottom: "20px" }}>
            מחיר כולל: <strong>₪{formatPrice(totalPrice)}</strong>
          </p>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "12px",
            }}
          >
            <button
              type="button"
              onClick={() => {
                const approved = window.confirm(
                  "האם למחוק את כל המוצרים מהעגלה?"
                );

                if (approved) {
                  clearCart();
                }
              }}
              style={{
                padding: "14px 20px",
                border: "none",
                borderRadius: "12px",
                fontSize: "18px",
                fontWeight: "bold",
                cursor: "pointer",
                background: "#ffd6d6",
              }}
            >
              🗑️ ריקון העגלה
            </button>

            <Link
              to="/shop"
              style={{
                padding: "14px 20px",
                borderRadius: "12px",
                textDecoration: "none",
                fontSize: "18px",
                fontWeight: "bold",
                background: "#e2e8f0",
                color: "#111111",
              }}
            >
              🛍️ המשך קנייה
            </Link>

            <button
              type="button"
              onClick={() =>
                alert(
                  "עמוד התשלום יתווסף בשלב הבא. לאחר מכן נחבר את UPAY."
                )
              }
              style={{
                padding: "14px 24px",
                border: "none",
                borderRadius: "12px",
                fontSize: "19px",
                fontWeight: "bold",
                cursor: "pointer",
                background: "#25a244",
                color: "#ffffff",
              }}
            >
              💳 מעבר לתשלום
            </button>
          </div>
        </section>
      </section>
    </main>
  );
}

export default Cart;