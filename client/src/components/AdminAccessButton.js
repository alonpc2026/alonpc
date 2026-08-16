import { Link } from "react-router-dom";
import "./AdminAccessButton.css";

function readUser() {
  try {
    const value = localStorage.getItem("user");
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
}

export default function AdminAccessButton() {
  const user = readUser();
  const isAdmin = user?.role === "admin";

  return (
    <Link
      to={isAdmin ? "/admin/apps" : "/login"}
      className="apps-admin-access"
      title={isAdmin ? "ניהול אפליקציות" : "כניסת מנהל"}
    >
      {isAdmin ? "⚙️ ניהול אפליקציות" : "🔐 כניסת מנהל"}
    </Link>
  );
}
