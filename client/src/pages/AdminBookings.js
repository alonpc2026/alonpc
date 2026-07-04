import { useEffect, useState } from "react";

function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = () => {
    fetch("http://localhost:3001/api/bookings")
      .then((res) => res.json())
      .then((data) => setBookings(data))
      .catch(() => setMessage("שגיאה בטעינת הזמנות ❌"));
  };

  const updateStatus = async (id, status) => {
    const res = await fetch(`http://localhost:3001/api/bookings/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    if (res.ok) {
      setMessage("הסטטוס עודכן ✅");
      loadBookings();
    }
  };

  const deleteBooking = async (id) => {
    if (!window.confirm("למחוק הזמנה?")) return;

    const res = await fetch(`http://localhost:3001/api/bookings/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setMessage("ההזמנה נמחקה 🗑️");
      loadBookings();
    }
  };

  return (
    <section className="loginBox">
      <h2>📋 ניהול הזמנות שירות</h2>

      <p>{message}</p>

      {bookings.length === 0 && <p>אין הזמנות עדיין.</p>}

      {bookings.map((booking) => (
        <div className="adminService" key={booking._id}>
          <h3>👤 {booking.name}</h3>

          <p>📞 {booking.phone}</p>
          <p>📍 {booking.address}</p>
          <p>🛠️ {booking.serviceType}</p>
          <p>📅 {booking.preferredDate}</p>
          <p>🕒 {booking.preferredTime}</p>
          <p>📝 {booking.details}</p>

          <p>
            <strong>סטטוס:</strong> {booking.status}
          </p>

          <select
            value={booking.status}
            onChange={(e) => updateStatus(booking._id, e.target.value)}
          >
            <option value="חדש">חדש</option>
            <option value="בטיפול">בטיפול</option>
            <option value="הושלם">הושלם</option>
          </select>

          <br />

          <button onClick={() => deleteBooking(booking._id)}>
            🗑️ מחק הזמנה
          </button>
        </div>
      ))}
    </section>
  );
}

export default AdminBookings;