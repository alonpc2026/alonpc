import { useState } from "react";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const loginUser = () => {
    if (username === "korkusal" && password === "631892") {
      const adminUser = {
        name: "Alon Admin",
        email: "korkusal",
        role: "admin",
      };

      localStorage.setItem("user", JSON.stringify(adminUser));
      setMessage("התחברת כמנהל בהצלחה ✅");

      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 500);
    } else {
      setMessage("שם משתמש או סיסמה שגויים ❌");
    }
  };

  return (
    <section className="loginBox">
      <h2>🔐 כניסת מנהל</h2>

      <input
        placeholder="שם משתמש"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        type="password"
        placeholder="סיסמה"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={loginUser}>כניסה</button>

      <p>{message}</p>
    </section>
  );
}

export default Login;
