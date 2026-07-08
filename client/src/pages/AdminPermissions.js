import { useEffect, useState } from "react";

const permissionOptions = [
  "מנהל מערכת",
  "מנהל שירותים",
  "מנהל חנות",
  "מנהל מוצרים",
  "מנהל הזמנות",
  "מנהל משתמשים",
  "מנהל שפות",
  "מנהל גלריה",
  "מנהל סטטיסטיקות",
  "משתמש רגיל",
];

function AdminPermissions() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [permissions, setPermissions] = useState([]);
  const [form, setForm] = useState({
    name: "",
    username: "",
    permission: "משתמש רגיל",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("permissions")) || [
      {
        name: "Alon Admin",
        username: "korkusal",
        permission: "מנהל מערכת",
      },
    ];

    setPermissions(saved);
  }, []);

  if (!user || user.role !== "admin") {
    return (
      <section className="loginBox">
        <h2>🔐 אין הרשאה</h2>
        <p>רק מנהל יכול לנהל הרשאות.</p>
      </section>
    );
  }

  const savePermissions = (list) => {
    localStorage.setItem("permissions", JSON.stringify(list));
    setPermissions(list);
  };

  const addPermission = () => {
    if (!form.name || !form.username) {
      setMessage("נא למלא שם ושם משתמש");
      return;
    }

    savePermissions([...permissions, form]);
    setForm({
      name: "",
      username: "",
      permission: "משתמש רגיל",
    });
    setMessage("✅ הרשאה נוספה");
  };

  const updatePermission = (index, permission) => {
    const list = [...permissions];
    list[index].permission = permission;
    savePermissions(list);
    setMessage("✅ ההרשאה עודכנה");
  };

  const deletePermission = (index) => {
    if (!window.confirm("למחוק הרשאה?")) return;

    const list = permissions.filter((_, i) => i !== index);
    savePermissions(list);
    setMessage("🗑️ הרשאה נמחקה");
  };

  return (
    <section className="loginBox">
      <h2>🔑 ניהול הרשאות</h2>

      <input
        placeholder="שם מלא"
        value={form.name}
        onChange={(e) =>
          setForm({
            ...form,
            name: e.target.value,
          })
        }
      />

      <input
        placeholder="שם משתמש"
        value={form.username}
        onChange={(e) =>
          setForm({
            ...form,
            username: e.target.value,
          })
        }
      />

      <select
        value={form.permission}
        onChange={(e) =>
          setForm({
            ...form,
            permission: e.target.value,
          })
        }
      >
        {permissionOptions.map((permission) => (
          <option key={permission} value={permission}>
            {permission}
          </option>
        ))}
      </select>

      <button onClick={addPermission}>➕ הוסף הרשאה</button>

      <p>{message}</p>

      <hr />

      {permissions.map((item, index) => (
        <div className="adminService" key={index}>
          <h3>{item.name}</h3>
          <p>שם משתמש: {item.username}</p>

          <select
            value={item.permission}
            onChange={(e) => updatePermission(index, e.target.value)}
          >
            {permissionOptions.map((permission) => (
              <option key={permission} value={permission}>
                {permission}
              </option>
            ))}
          </select>

          <br />

          <button onClick={() => deletePermission(index)}>
            🗑️ מחק הרשאה
          </button>
        </div>
      ))}
    </section>
  );
}

export default AdminPermissions;
