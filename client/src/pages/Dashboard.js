import { useEffect, useState } from "react";

function Dashboard() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/api/services")
      .then((res) => res.json())
      .then((data) => setServices(data))
      .catch((err) => console.error(err));
  }, []);

  const categories = [...new Set(services.map((s) => s.category))];

  return (
    <section className="loginBox">
      <h3>לוח בקרה ALONPC</h3>

      <div className="dashboardGrid">
        <div className="dashboardCard">📦 שירותים: {services.length}</div>
        <div className="dashboardCard">📂 קטגוריות: {categories.length}</div>
        <div className="dashboardCard">👤 משתמשים: בקרוב</div>
      </div>
    </section>
  );
}

export default Dashboard;