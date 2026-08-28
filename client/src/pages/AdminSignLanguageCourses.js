import { useEffect, useState } from "react";

const API =
  "https://alonpc02026.onrender.com/api/sign-language-courses";

const EMPTY = {
  name: "",
  category: "",
  city: "חיפה",
  location: "",
  address: "",
  date: "",
  startTime: "",
  endTime: "",
  capacity: "",
  remainingPlaces: "",
  imageUrl: "",
  registrationUrl: "",
  phone: "",
  description: "",
  active: true,
};

export default function AdminSignLanguageCourses() {
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState("");
  const [message, setMessage] = useState("");

  async function loadCourses() {
    try {
      const response = await fetch(API);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "לא ניתן לטעון קורסים");
      }

      setCourses(Array.isArray(data) ? data : []);
    } catch (error) {
      setMessage("❌ " + error.message);
    }
  }

  useEffect(() => {
    loadCourses();
  }, []);

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setForm((old) => ({
      ...old,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");

    const body = {
      ...form,
      capacity: Number(form.capacity || 0),
      remainingPlaces: Number(form.remainingPlaces || 0),
    };

    try {
      const response = await fetch(
        editingId ? `${API}/${editingId}` : API,
        {
          method: editingId ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "לא ניתן לשמור");
      }

      setMessage(
        editingId
          ? "✅ הקורס עודכן בהצלחה"
          : "✅ הקורס נוסף בהצלחה"
      );

      setForm(EMPTY);
      setEditingId("");
      loadCourses();
    } catch (error) {
      setMessage("❌ " + error.message);
    }
  }

  function editCourse(course) {
    setEditingId(course._id);

    setForm({
      ...EMPTY,
      ...course,
      capacity: course.capacity ?? "",
      remainingPlaces: course.remainingPlaces ?? "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function deleteCourse(id) {
    if (!window.confirm("האם למחוק את הקורס?")) {
      return;
    }

    await fetch(`${API}/${id}`, {
      method: "DELETE",
    });

    loadCourses();
  }

  return (
    <main
      dir="rtl"
      style={{
        maxWidth: "1100px",
        margin: "0 auto",
        padding: "20px",
      }}
    >
      <h1>🤟 ניהול קורס שפת סימנים ישראלי</h1>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "15px",
          padding: "20px",
          border: "3px solid #4676a8",
          borderRadius: "15px",
        }}
      >
        <label>
          שם הקורס *
          <input
            required
            name="name"
            value={form.name}
            onChange={handleChange}
          />
        </label>

        <label>
          קטגוריה
          <input
            name="category"
            value={form.category}
            onChange={handleChange}
            placeholder="מתחילים / מתקדמים / הרצאה"
          />
        </label>

        <label>
          עיר *
          <input
            required
            name="city"
            value={form.city}
            onChange={handleChange}
            list="course-cities"
          />

          <datalist id="course-cities">
            <option value="חיפה" />
            <option value="תל אביב" />
            <option value="ירושלים" />
          </datalist>
        </label>

        <label>
          מיקום הקורס / שם המקום *
          <input
            required
            name="location"
            value={form.location}
            onChange={handleChange}
          />
        </label>

        <label>
          כתובת
          <input
            name="address"
            value={form.address}
            onChange={handleChange}
          />
        </label>

        <label>
          תאריך / מועד ההרצאה *
          <input
            required
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
          />
        </label>

        <label>
          שעת התחלה *
          <input
            required
            type="time"
            name="startTime"
            value={form.startTime}
            onChange={handleChange}
          />
        </label>

        <label>
          שעת סיום
          <input
            type="time"
            name="endTime"
            value={form.endTime}
            onChange={handleChange}
          />
        </label>

        <label>
          כמות אנשים / מקומות כוללת
          <input
            type="number"
            min="0"
            name="capacity"
            value={form.capacity}
            onChange={handleChange}
          />
        </label>

        <label>
          כמה מקומות נשארו
          <input
            type="number"
            min="0"
            name="remainingPlaces"
            value={form.remainingPlaces}
            onChange={handleChange}
          />
        </label>

        <label>
          טלפון
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
          />
        </label>

        <label>
          קישור לתמונת הקורס
          <input
            type="url"
            name="imageUrl"
            value={form.imageUrl}
            onChange={handleChange}
            placeholder="https://"
          />
        </label>

        {form.imageUrl && (
          <div style={{gridColumn:"1 / -1",border:"2px dashed #4676a8",borderRadius:"14px",padding:"12px",textAlign:"center"}}>
            <strong>תצוגה מקדימה של תמונת הקורס</strong>
            <br />
            <img
              src={form.imageUrl}
              alt="תצוגה מקדימה של הקורס"
              style={{width:"100%",maxWidth:"520px",maxHeight:"340px",objectFit:"contain",marginTop:"10px",borderRadius:"12px"}}
            />
          </div>
        )}

        <label>
          קישור להרשמה / מידע
          <input
            type="url"
            name="registrationUrl"
            value={form.registrationUrl}
            onChange={handleChange}
            placeholder="https://"
          />
        </label>

        <label
          style={{
            gridColumn: "1 / -1",
          }}
        >
          תיאור
          <textarea
            rows="5"
            name="description"
            value={form.description}
            onChange={handleChange}
          />
        </label>

        <label>
          <input
            type="checkbox"
            name="active"
            checked={form.active}
            onChange={handleChange}
          />
          {" "}פעיל ומוצג באתר
        </label>

        <div
          style={{
            gridColumn: "1 / -1",
          }}
        >
          <button type="submit">
            {editingId
              ? "💾 שמור שינויים"
              : "➕ הוסף קורס"}
          </button>
        </div>
      </form>

      {message && (
        <h3>{message}</h3>
      )}

      <hr />

      <h2>כל הקורסים</h2>

      {courses.length === 0 && (
        <p>אין עדיין קורסים.</p>
      )}

      {courses.map((course) => (
        <article
          key={course._id}
          style={{
            border: "2px solid #4676a8",
            borderRadius: "12px",
            padding: "15px",
            marginBottom: "12px",
          }}
        >
          {course.imageUrl && (
            <img
              src={course.imageUrl}
              alt={course.name}
              style={{width:"100%",maxWidth:"450px",maxHeight:"300px",objectFit:"contain",borderRadius:"12px",marginBottom:"12px"}}
            />
          )}

          <h3>{course.name}</h3>

          <p>
            📍 {course.city} — {course.location}
          </p>

          <p>
            📅 {course.date}
          </p>

          <p>
            🕒 {course.startTime}
            {course.endTime
              ? ` - ${course.endTime}`
              : ""}
          </p>

          <p>
            👥 נשארו{" "}
            <strong>
              {course.remainingPlaces ?? 0}
            </strong>{" "}
            מתוך{" "}
            <strong>
              {course.capacity ?? 0}
            </strong>
          </p>

          <button
            type="button"
            onClick={() => editCourse(course)}
          >
            ✏️ עריכה
          </button>

          {" "}

          <button
            type="button"
            onClick={() =>
              deleteCourse(course._id)
            }
          >
            🗑️ מחיקה
          </button>
        </article>
      ))}
    </main>
  );
}