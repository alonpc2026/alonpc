import { useEffect, useState } from "react";

function AdminServiceCategories() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("serviceCategories")) || [
      "בריאות",
      "מחשבים",
      "ממשלה",
      "תחבורה",
      "נגישות",
      "שיניים",
      "עמותות",
      "חירשים וכבדי שמיעה",
    ];

    setCategories(saved);
  }, []);

  if (!user || user.role !== "admin") {
    return (
      <section className="loginBox">
        <h2>🔐 אין הרשאה</h2>
        <p>רק מנהל יכול לנהל קטגוריות.</p>
      </section>
    );
  }

  const saveCategories = (list) => {
    localStorage.setItem("serviceCategories", JSON.stringify(list));
    setCategories(list);
  };

  const addCategory = () => {
    if (!newCategory.trim()) {
      setMessage("יש לרשום שם קטגוריה");
      return;
    }

    if (editId !== null) {
      const list = [...categories];
      list[editId] = newCategory;
      saveCategories(list);
      setEditId(null);
      setMessage("✅ הקטגוריה עודכנה");
    } else {
      saveCategories([...categories, newCategory]);
      setMessage("✅ הקטגוריה נוספה");
    }

    setNewCategory("");
  };

  const editCategory = (index) => {
    setEditId(index);
    setNewCategory(categories[index]);
  };

  const deleteCategory = (index) => {
    if (!window.confirm("למחוק קטגוריה?")) return;

    const list = categories.filter((_, i) => i !== index);
    saveCategories(list);
    setMessage("🗑️ הקטגוריה נמחקה");
  };

  return (
    <section className="loginBox">
      <h2>📂 ניהול קטגוריות שירותים</h2>

      <input
        type="text"
        placeholder="שם קטגוריה"
        value={newCategory}
        onChange={(e) => setNewCategory(e.target.value)}
      />

      <button onClick={addCategory}>
        {editId !== null ? "💾 שמור" : "➕ הוסף קטגוריה"}
      </button>

      {editId !== null && (
        <button
          onClick={() => {
            setEditId(null);
            setNewCategory("");
          }}
        >
          ❌ ביטול
        </button>
      )}

      <p>{message}</p>

      <hr />

      {categories.map((cat, index) => (
        <div
          key={index}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "10px",
            padding: "12px",
            background: "#f5f5f5",
            borderRadius: "10px",
          }}
        >
          <strong>{cat}</strong>

          <div>
            <button onClick={() => editCategory(index)}>✏️</button>

            <button
              onClick={() => deleteCategory(index)}
              style={{ marginLeft: "10px" }}
            >
              🗑️
            </button>
          </div>
        </div>
      ))}
    </section>
  );
}

export default AdminServiceCategories;