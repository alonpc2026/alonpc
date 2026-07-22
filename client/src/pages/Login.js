import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const loginUser = () => {
    if (username.trim() === "korkusal" && password === "631892") {
      localStorage.setItem(
        "user",
        JSON.stringify({
          name: "Alon Admin",
          email: "korkusal",
          role: "admin",
        })
      );

      setMessage("התחברת כמנהל בהצלחה ✅");

      setTimeout(() => {
        navigate("/dashboard");
      }, 500);
    } else {
      setMessage("שם משתמש או סיסמה שגויים ❌");
    }
  };

  return (
    <section className="loginBox">
      <h2>🔐 כניסת מנהל</h2>
      <p style={{textAlign:"center"}}>
        ברוכים הבאים למערכת הניהול של ALON PC
      </p>

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