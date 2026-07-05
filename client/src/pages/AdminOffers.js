import { useEffect, useState } from "react";

function AdminOffers() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [offers, setOffers] = useState([]);
  const [title, setTitle] = useState("");
  const [product, setProduct] = useState("");
  const [oldPrice, setOldPrice] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("offers")) || [];
    setOffers(saved);
  }, []);

  if (!user || user.role !== "admin") {
    return (
      <section className="loginBox">
        <h2>🔐 אין הרשאה</h2>
        <p>רק מנהל יכול לנהל מבצעים.</p>
      </section>
    );
  }

  const saveOffers = (list) => {
    localStorage.setItem("offers", JSON.stringify(list));
    setOffers(list);
  };

  const addOffer = () => {
    if (!title || !newPrice) {
      setMessage("נא למלא שם מבצע ומחיר");
      return;
    }

    const list = [
      ...offers,
      {
        title,
        product,
        oldPrice,
        newPrice,
      },
    ];

    saveOffers(list);

    setTitle("");
    setProduct("");
    setOldPrice("");
    setNewPrice("");

    setMessage("✅ המבצע נוסף");
  };

  const deleteOffer = (index) => {
    if (!window.confirm("למחוק מבצע?")) return;

    const list = offers.filter((_, i) => i !== index);
    saveOffers(list);
  };

  return (
    <section className="loginBox">
      <h2>💰 ניהול מבצעים</h2>

      <input
        placeholder="שם המבצע"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        placeholder="שם המוצר"
        value={product}
        onChange={(e) => setProduct(e.target.value)}
      />

      <input
        placeholder="מחיר רגיל"
        value={oldPrice}
        onChange={(e) => setOldPrice(e.target.value)}
      />

      <input
        placeholder="מחיר מבצע"
        value={newPrice}
        onChange={(e) => setNewPrice(e.target.value)}
      />

      <button onClick={addOffer}>➕ הוסף מבצע</button>

      <p>{message}</p>

      <hr />

      {offers.map((offer, index) => (
        <div key={index} className="adminService">
          <h3>{offer.title}</h3>

          <p>מוצר: {offer.product}</p>

          <p>
            ₪{offer.oldPrice} → ₪{offer.newPrice}
          </p>

          <button onClick={() => deleteOffer(index)}>
            🗑️ מחק
          </button>
        </div>
      ))}
    </section>
  );
}

export default AdminOffers;