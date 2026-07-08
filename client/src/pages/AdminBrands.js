import { useEffect, useState } from "react";

function AdminBrands() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [brands, setBrands] = useState([]);
  const [brand, setBrand] = useState("");
  const [editIndex, setEditIndex] = useState(-1);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const saved =
      JSON.parse(localStorage.getItem("brands")) || [
        "Lenovo",
        "Dell",
        "HP",
        "Asus",
        "Acer",
        "MSI",
        "Apple",
        "Samsung",
        "Canon",
        "Epson",
        "Brother",
        "Xiaomi",
      ];

    setBrands(saved);
  }, []);

  if (!user || user.role !== "admin") {
    return (
      <section className="loginBox">
        <h2>🔐 אין הרשאה</h2>
        <p>רק מנהל יכול לנהל מותגים.</p>
      </section>
    );
  }

  const saveBrands = (list) => {
    localStorage.setItem("brands", JSON.stringify(list));
    setBrands(list);
  };

  const addBrand = () => {
    if (!brand.trim()) {
      setMessage("יש להזין שם מותג");
      return;
    }

    if (editIndex >= 0) {
      const list = [...brands];
      list[editIndex] = brand;
      saveBrands(list);
      setMessage("✅ המותג עודכן");
      setEditIndex(-1);
    } else {
      saveBrands([...brands, brand]);
      setMessage("✅ המותג נוסף");
    }

    setBrand("");
  };

  const editBrand = (index) => {
    setEditIndex(index);
    setBrand(brands[index]);
  };

  const deleteBrand = (index) => {
    if (!window.confirm("למחוק מותג?")) return;

    const list = brands.filter((_, i) => i !== index);
    saveBrands(list);
    setMessage("🗑️ המותג נמחק");
  };

  return (
    <section className="loginBox">
      <h2>🏷️ ניהול מותגים</h2>

      <input
        placeholder="שם מותג"
        value={brand}
        onChange={(e) => setBrand(e.target.value)}
      />

      <button onClick={addBrand}>
        {editIndex >= 0 ? "💾 שמור" : "➕ הוסף מותג"}
      </button>

      {editIndex >= 0 && (
        <button
          onClick={() => {
            setEditIndex(-1);
            setBrand("");
          }}
        >
          ❌ ביטול
        </button>
      )}

      <p>{message}</p>

      <hr />

      {brands.map((item, index) => (
        <div className="adminService" key={index}>
          <strong>{item}</strong>

          <br />
          <br />

          <button onClick={() => editBrand(index)}>
            ✏️ ערוך
          </button>

          <button onClick={() => deleteBrand(index)}>
            🗑️ מחק
          </button>
        </div>
      ))}
    </section>
  );
}

export default AdminBrands;
