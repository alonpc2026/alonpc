import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "./Cart.css";

const WHATSAPP_NUMBER = "972545221809";

function Cart() {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    clearCart,
    total,
  } = useCart();

  const formatPrice = (price) =>
    Number(price || 0).toLocaleString("he-IL");

  const sendOrder = () => {
    const lines = [
      "שלום אלון, אני רוצה להזמין את המוצרים הבאים:",
      "",
      ...cartItems.map(
        (item, index) =>
          `${index + 1}. ${item.name} — כמות ${
            item.quantity
          } — ₪${formatPrice(
            Number(item.price || 0) * Number(item.quantity || 1)
          )}`
      ),
      "",
      `סה״כ: ₪${formatPrice(total)}`,
    ];

    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
        lines.join("\n")
      )}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <main className="cart-page" dir="rtl">
      <section className="cart-header">
        <h1>🛒 סל הקניות</h1>
        <Link to="/shop">המשך קנייה</Link>
      </section>

      {cartItems.length === 0 ? (
        <section className="cart-empty">
          <h2>העגלה ריקה</h2>
          <p>אפשר לבחור מוצרים מהחנות.</p>
          <Link to="/shop">מעבר לחנות</Link>
        </section>
      ) : (
        <>
          <section className="cart-list">
            {cartItems.map((item) => (
              <article className="cart-item" key={item._id}>
                <div className="cart-item-image">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.name} />
                  ) : (
                    <span>🖥️</span>
                  )}
                </div>

                <div className="cart-item-info">
                  <h2>{item.name}</h2>
                  <p>₪{formatPrice(item.price)}</p>

                  <label>
                    כמות
                    <input
                      type="number"
                      min="1"
                      max={Number(item.stock || 99)}
                      value={item.quantity}
                      onChange={(event) =>
                        updateQuantity(
                          item._id,
                          event.target.value
                        )
                      }
                    />
                  </label>
                </div>

                <div className="cart-item-total">
                  <strong>
                    ₪
                    {formatPrice(
                      Number(item.price || 0) *
                        Number(item.quantity || 1)
                    )}
                  </strong>

                  <button
                    type="button"
                    onClick={() => removeFromCart(item._id)}
                  >
                    הסר
                  </button>
                </div>
              </article>
            ))}
          </section>

          <section className="cart-summary">
            <h2>סה״כ: ₪{formatPrice(total)}</h2>

            <div>
              <button type="button" onClick={clearCart}>
                נקה עגלה
              </button>

              <button
                type="button"
                className="cart-whatsapp"
                onClick={sendOrder}
              >
                שלח הזמנה ב־WhatsApp
              </button>
            </div>
          </section>
        </>
      )}
    </main>
  );
}

export default Cart;
