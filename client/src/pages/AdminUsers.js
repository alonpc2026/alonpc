import { useEffect, useState } from "react";

function AdminUsers() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    name: "",
    username: "",
    role: "user",
  });

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("siteUsers")) || [
      {
        name: "Alon Admin",
        username: "korkusal",
        role: "admin",
      },
    ];

    setUsers(saved);
  }, []);

  if (!user || user.role !== "admin") {
    return (
      <section className="loginBox">
        <h2>🔐 אין הרשאה</h2>
        <p>רק מנהל יכול לנהל משתמשים.</p>
      </section>
    );
  }

  const saveUsers = (list) => {
    localStorage.setItem("siteUsers", JSON.stringify(list));
    setUsers(list);
  };

  const addUser = () => {
    if (!form.name || !form.username) {
      setMessage("נא למלא שם ושם משתמש");
      return;
    }

    saveUsers([...users, form]);

    setForm({
      name: "",
      username: "",
      role: "user",
    });

    setMessage("✅ משתמש נוסף");
  };

  const deleteUser = (index) => {
    if (!window.confirm("למחוק משתמש?")) return;

    const list = users.filter((_, i) => i !== index);
    saveUsers(list);
    setMessage("🗑️ משתמש נמחק");
  };

  return (
    <section className="loginBox">
      <h2>👥 ניהול משתמשים</h2>

      <input
        placeholder="שם מלא"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

      <input
        placeholder="שם משתמש"
        value={form.username}
        onChange={(e) => setForm({ ...form, username: e.target.value })}
      />

      <select
        value={form.role}
        onChange={(e) => setForm({ ...form, role: e.target.value })}
      >
        <option value="user">משתמש רגיל</option>
        <option value="admin">מנהל</option>
      </select>

      <button onClick={addUser}>➕ הוסף משתמש</button>

      <p>{message}</p>

      <hr />

      {users.map((item, index) => (
        <div className="adminService" key={index}>
          <h3>{item.name}</h3>
          <p>שם משתמש: {item.username}</p>
          <p>תפקיד: {item.role === "admin" ? "מנהל" : "משתמש רגיל"}</p>

          <button onClick={() => deleteUser(index)}>
            🗑️ מחק
          </button>
        </div>
      ))}
    </section>
  );
}

export default AdminUsers;
