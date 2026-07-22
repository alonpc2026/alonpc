import { useEffect, useState } from "react";

function User() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    language: "עברית",
  });

  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) {
      try {
        setUser({ ...user, ...JSON.parse(saved) });
      } catch {}
    }
    // eslint-disable-next-line
  }, []);

  const save = () => {
    localStorage.setItem("user", JSON.stringify(user));
    alert("הפרטים נשמרו בהצלחה");
  };

  return (
    <main className="pageContainer" dir="rtl">
      <section className="card" style={{maxWidth:700,margin:"20px auto",padding:24}}>
        <h1>👤 פרופיל משתמש</h1>

        <input
          placeholder="שם מלא"
          value={user.name}
          onChange={(e)=>setUser({...user,name:e.target.value})}
        />

        <input
          placeholder="אימייל"
          value={user.email}
          onChange={(e)=>setUser({...user,email:e.target.value})}
        />

        <input
          placeholder="טלפון"
          value={user.phone}
          onChange={(e)=>setUser({...user,phone:e.target.value})}
        />

        <select
          value={user.language}
          onChange={(e)=>setUser({...user,language:e.target.value})}
        >
          <option>עברית</option>
          <option>English</option>
          <option>Русский</option>
          <option>العربية</option>
          <option>አማርኛ</option>
        </select>

        <button onClick={save} style={{marginTop:20}}>
          💾 שמור
        </button>
      </section>
    </main>
  );
}

export default User;
