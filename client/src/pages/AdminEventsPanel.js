import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./AdminEventsPanel.css";

const API_BASE =
  process.env.REACT_APP_API_BASE ||
  "https://alonpc02026.onrender.com/api";

const PERMANENT_API_BASE =
  process.env.REACT_APP_API_URL ||
  "https://alonpc02026.onrender.com";

const REGULAR_API = `${API_BASE}/events`;
const PERMANENT_API = `${PERMANENT_API_BASE}/api/permanent-events`;

const EMPTY_REGULAR = {
  title: "",
  startDate: "",
  endDate: "",
  startTime: "",
  endTime: "",
  allDay: false,
  city: "",
  location: "",
  description: "",
  website: "",
  imageUrl: "",
  active: true,
};

const EMPTY_PERMANENT = {
  name: "",
  city: "",
  address: "",
  openingHours: "",
  website: "",
  document: "",
  image: "",
  description: "",
  accessibility: "",
  languages: [],
  active: true,
};

const LANGUAGE_OPTIONS = [
  "עברית",
  "אנגלית",
  "רוסית",
  "ערבית",
  "אמהרית",
  "שפת הסימנים הישראלית",
];

function AdminEventsPanel() {
  const [type, setType] = useState("daily");
  const [regularEvents, setRegularEvents] = useState([]);
  const [permanentEvents, setPermanentEvents] = useState([]);
  const [regularForm, setRegularForm] = useState(EMPTY_REGULAR);
  const [permanentForm, setPermanentForm] = useState(EMPTY_PERMANENT);
  const [regularEditId, setRegularEditId] = useState("");
  const [permanentEditId, setPermanentEditId] = useState("");
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  async function readJson(response) {
    return response.json().catch(() => ({}));
  }

  async function loadRegular() {
    setLoading(true);
    try {
      const response = await fetch(REGULAR_API);
      const data = await readJson(response);
      if (!response.ok) throw new Error(data.message || "טעינת האירועים הרגילים נכשלה");
      setRegularEvents(Array.isArray(data) ? data : data.events || []);
      setMessage("");
    } catch (error) {
      setRegularEvents([]);
      setMessage(`❌ ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  async function loadPermanent() {
    setLoading(true);
    try {
      const response = await fetch(PERMANENT_API);
      const data = await readJson(response);
      if (!response.ok) throw new Error(data.message || "טעינת האירועים הקבועים נכשלה");
      setPermanentEvents(Array.isArray(data) ? data : []);
      setMessage("");
    } catch (error) {
      setPermanentEvents([]);
      setMessage(`❌ ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (type === "daily") loadRegular();
    else loadPermanent();
  }, [type]);

  const filteredRegular = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return regularEvents;
    return regularEvents.filter((item) =>
      `${item.title || ""} ${item.city || ""} ${item.location || ""} ${item.description || ""}`
        .toLowerCase()
        .includes(q)
    );
  }, [regularEvents, search]);

  const filteredPermanent = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return permanentEvents;
    return permanentEvents.filter((item) =>
      `${item.name || ""} ${item.city || ""} ${item.address || ""} ${item.description || ""} ${item.accessibility || ""}`
        .toLowerCase()
        .includes(q)
    );
  }, [permanentEvents, search]);

  function resetRegular() {
    setRegularEditId("");
    setRegularForm(EMPTY_REGULAR);
  }

  function resetPermanent() {
    setPermanentEditId("");
    setPermanentForm(EMPTY_PERMANENT);
  }

  function editRegular(item) {
    setRegularEditId(item._id);
    setRegularForm({
      title: item.title || "",
      startDate: item.startDate || item.date || "",
      endDate: item.endDate || item.startDate || item.date || "",
      startTime: item.startTime || item.time || "",
      endTime: item.endTime || "",
      allDay: item.allDay === true,
      city: item.city || "",
      location: item.location || "",
      description: item.description || "",
      website: item.website || "",
      imageUrl: item.imageUrl || "",
      active: item.active !== false,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function editPermanent(item) {
    setPermanentEditId(item._id);
    setPermanentForm({
      name: item.name || "",
      city: item.city || "",
      address: item.address || "",
      openingHours: item.openingHours || "",
      website: item.website || "",
      document: item.document || "",
      image: item.image || "",
      description: item.description || "",
      accessibility: item.accessibility || "",
      languages: Array.isArray(item.languages) ? item.languages : [],
      active: item.active !== false,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function saveRegular(event) {
    event.preventDefault();
    if (!regularForm.title.trim()) {
      setMessage("❌ חובה להזין שם אירוע");
      return;
    }
    if (!regularForm.startDate) {
      setMessage("❌ חובה להזין תאריך");
      return;
    }
    setSaving(true);
    try {
      const response = await fetch(
        regularEditId ? `${REGULAR_API}/${regularEditId}` : REGULAR_API,
        {
          method: regularEditId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...regularForm,
            date: regularForm.startDate,
            time: regularForm.allDay ? "" : regularForm.startTime,
          }),
        }
      );
      const data = await readJson(response);
      if (!response.ok) throw new Error(data.message || "שמירת האירוע נכשלה");
      setMessage(regularEditId ? "✅ האירוע עודכן" : "✅ האירוע נוסף");
      resetRegular();
      await loadRegular();
    } catch (error) {
      setMessage(`❌ ${error.message}`);
    } finally {
      setSaving(false);
    }
  }

  async function savePermanent(event) {
    event.preventDefault();
    if (!permanentForm.name.trim()) {
      setMessage("❌ חובה להזין שם מקום");
      return;
    }
    setSaving(true);
    try {
      const response = await fetch(
        permanentEditId ? `${PERMANENT_API}/${permanentEditId}` : PERMANENT_API,
        {
          method: permanentEditId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(permanentForm),
        }
      );
      const data = await readJson(response);
      if (!response.ok) throw new Error(data.message || "שמירת האירוע הקבוע נכשלה");
      setMessage(permanentEditId ? "✅ האירוע הקבוע עודכן" : "✅ האירוע הקבוע נוסף");
      resetPermanent();
      await loadPermanent();
    } catch (error) {
      setMessage(`❌ ${error.message}`);
    } finally {
      setSaving(false);
    }
  }

  async function removeRegular(item) {
    if (!window.confirm(`למחוק את "${item.title}"?`)) return;
    try {
      const response = await fetch(`${REGULAR_API}/${item._id}`, { method: "DELETE" });
      const data = await readJson(response);
      if (!response.ok) throw new Error(data.message || "מחיקת האירוע נכשלה");
      setMessage("🗑️ האירוע נמחק");
      await loadRegular();
    } catch (error) {
      setMessage(`❌ ${error.message}`);
    }
  }

  async function removePermanent(item) {
    if (!window.confirm(`למחוק את "${item.name}"?`)) return;
    try {
      const response = await fetch(`${PERMANENT_API}/${item._id}`, { method: "DELETE" });
      const data = await readJson(response);
      if (!response.ok) throw new Error(data.message || "מחיקת האירוע הקבוע נכשלה");
      setMessage("🗑️ האירוע הקבוע נמחק");
      await loadPermanent();
    } catch (error) {
      setMessage(`❌ ${error.message}`);
    }
  }

  function togglePermanentLanguage(language) {
    setPermanentForm((current) => ({
      ...current,
      languages: current.languages.includes(language)
        ? current.languages.filter((item) => item !== language)
        : [...current.languages, language],
    }));
  }

  return (
    <main className="aep-page" dir="rtl">
      <header className="aep-header">
        <div>
          <p>🔒 אזור מנהל</p>
          <h1>ניהול אירועים</h1>
          <span>בחר סוג אירוע: אירוע יומי / רגיל או אירוע קבוע.</span>
        </div>
        <Link to="/admin" className="aep-back">חזרה לפורטל הניהול</Link>
      </header>

      <section className="aep-type-panel" aria-label="בחירת סוג אירוע">
        <button
          type="button"
          className={type === "daily" ? "active" : ""}
          onClick={() => { setType("daily"); setSearch(""); setMessage(""); }}
        >
          📅 אירוע יומי / רגיל
        </button>

        <button
          type="button"
          className={type === "permanent" ? "active" : ""}
          onClick={() => { setType("permanent"); setSearch(""); setMessage(""); }}
        >
          📌 אירוע קבוע
        </button>
      </section>

      {message && <div className="aep-message">{message}</div>}

      {type === "daily" ? (
        <>
          <form className="aep-form" onSubmit={saveRegular}>
            <h2>{regularEditId ? "✏️ עריכת אירוע יומי" : "➕ הוספת אירוע יומי"}</h2>

            <div className="aep-grid">
              <label>שם האירוע *<input value={regularForm.title} onChange={(e) => setRegularForm((f) => ({ ...f, title: e.target.value }))} required /></label>
              <label>עיר<input value={regularForm.city} onChange={(e) => setRegularForm((f) => ({ ...f, city: e.target.value }))} /></label>
              <label>מקום<input value={regularForm.location} onChange={(e) => setRegularForm((f) => ({ ...f, location: e.target.value }))} /></label>
              <label>תאריך התחלה *<input type="date" value={regularForm.startDate} onChange={(e) => setRegularForm((f) => ({ ...f, startDate: e.target.value, endDate: f.endDate || e.target.value }))} required /></label>
              <label>תאריך סיום<input type="date" value={regularForm.endDate} onChange={(e) => setRegularForm((f) => ({ ...f, endDate: e.target.value }))} /></label>
              <label>שעת התחלה<input type="time" disabled={regularForm.allDay} value={regularForm.startTime} onChange={(e) => setRegularForm((f) => ({ ...f, startTime: e.target.value }))} /></label>
              <label>שעת סיום<input type="time" disabled={regularForm.allDay} value={regularForm.endTime} onChange={(e) => setRegularForm((f) => ({ ...f, endTime: e.target.value }))} /></label>

              <label className="aep-check">
                <input type="checkbox" checked={regularForm.allDay} onChange={(e) => setRegularForm((f) => ({ ...f, allDay: e.target.checked }))} />
                אירוע כל היום
              </label>

              <label className="aep-wide">תיאור<textarea rows="4" value={regularForm.description} onChange={(e) => setRegularForm((f) => ({ ...f, description: e.target.value }))} /></label>
              <label className="aep-wide">קישור לאתר<input type="url" value={regularForm.website} onChange={(e) => setRegularForm((f) => ({ ...f, website: e.target.value }))} placeholder="https://" /></label>
              <label className="aep-wide">קישור לתמונה<input type="url" value={regularForm.imageUrl} onChange={(e) => setRegularForm((f) => ({ ...f, imageUrl: e.target.value }))} placeholder="https://" /></label>

              <label className="aep-check">
                <input type="checkbox" checked={regularForm.active} onChange={(e) => setRegularForm((f) => ({ ...f, active: e.target.checked }))} />
                פעיל ומוצג באתר
              </label>
            </div>

            <div className="aep-actions">
              <button type="submit" disabled={saving}>{saving ? "שומר..." : regularEditId ? "💾 שמירת שינויים" : "➕ הוספת אירוע"}</button>
              {regularEditId && <button type="button" onClick={resetRegular}>ביטול עריכה</button>}
            </div>
          </form>

          <section className="aep-list">
            <div className="aep-search">
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="חיפוש אירוע יומי..." />
            </div>
            {loading && <p>טוען...</p>}

            <div className="aep-cards">
              {filteredRegular.map((item) => (
                <article key={item._id} className="aep-card">
                  {item.imageUrl && (
                    <img
                      className="aep-card-image"
                      src={item.imageUrl}
                      alt={item.title || "תמונת אירוע"}
                      loading="lazy"
                    />
                  )}
                  <h3>📅 {item.title}</h3>
                  <p><strong>תאריך:</strong> {item.startDate || item.date || ""}{item.endDate && item.endDate !== (item.startDate || item.date) ? ` – ${item.endDate}` : ""}</p>
                  {(item.startTime || item.time) && <p><strong>שעה:</strong> {item.startTime || item.time}</p>}
                  {(item.city || item.location) && <p><strong>מיקום:</strong> {[item.city, item.location].filter(Boolean).join(", ")}</p>}
                  {item.description && <p>{item.description}</p>}

                  <div className="aep-card-actions">
                    <button type="button" onClick={() => editRegular(item)}>✏️ עריכה</button>
                    <button type="button" className="danger" onClick={() => removeRegular(item)}>🗑️ מחיקה</button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </>
      ) : (
        <>
          <form className="aep-form" onSubmit={savePermanent}>
            <h2>{permanentEditId ? "✏️ עריכת אירוע קבוע" : "➕ הוספת אירוע קבוע"}</h2>

            <div className="aep-grid">
              <label>שם המקום / האירוע *<input value={permanentForm.name} onChange={(e) => setPermanentForm((f) => ({ ...f, name: e.target.value }))} required /></label>
              <label>עיר<input value={permanentForm.city} onChange={(e) => setPermanentForm((f) => ({ ...f, city: e.target.value }))} /></label>
              <label>כתובת<input value={permanentForm.address} onChange={(e) => setPermanentForm((f) => ({ ...f, address: e.target.value }))} /></label>
              <label>שעות פעילות<input value={permanentForm.openingHours} onChange={(e) => setPermanentForm((f) => ({ ...f, openingHours: e.target.value }))} /></label>
              <label className="aep-wide">קישור לאתר<input type="url" value={permanentForm.website} onChange={(e) => setPermanentForm((f) => ({ ...f, website: e.target.value }))} placeholder="https://" /></label>
              <label className="aep-wide">קישור למסמך / PDF<input type="url" value={permanentForm.document} onChange={(e) => setPermanentForm((f) => ({ ...f, document: e.target.value }))} placeholder="https://" /></label>
              <label className="aep-wide">קישור לתמונה<input type="url" value={permanentForm.image} onChange={(e) => setPermanentForm((f) => ({ ...f, image: e.target.value }))} placeholder="https://" /></label>
              <label className="aep-wide">תיאור<textarea rows="4" value={permanentForm.description} onChange={(e) => setPermanentForm((f) => ({ ...f, description: e.target.value }))} /></label>
              <label className="aep-wide">פרטי נגישות<textarea rows="3" value={permanentForm.accessibility} onChange={(e) => setPermanentForm((f) => ({ ...f, accessibility: e.target.value }))} /></label>
            </div>

            <fieldset className="aep-languages">
              <legend>שפות ונגישות תקשורתית</legend>
              {LANGUAGE_OPTIONS.map((language) => (
                <label key={language}>
                  <input type="checkbox" checked={permanentForm.languages.includes(language)} onChange={() => togglePermanentLanguage(language)} />
                  {language}
                </label>
              ))}
            </fieldset>

            <label className="aep-check aep-active-check">
              <input type="checkbox" checked={permanentForm.active} onChange={(e) => setPermanentForm((f) => ({ ...f, active: e.target.checked }))} />
              פעיל ומוצג באתר
            </label>

            <div className="aep-actions">
              <button type="submit" disabled={saving}>{saving ? "שומר..." : permanentEditId ? "💾 שמירת שינויים" : "➕ הוספת אירוע קבוע"}</button>
              {permanentEditId && <button type="button" onClick={resetPermanent}>ביטול עריכה</button>}
            </div>
          </form>

          <section className="aep-list">
            <div className="aep-search">
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="חיפוש אירוע קבוע..." />
            </div>
            {loading && <p>טוען...</p>}

            <div className="aep-cards">
              {filteredPermanent.map((item) => (
                <article key={item._id} className="aep-card">
                  {item.image && (
                    <img
                      className="aep-card-image"
                      src={item.image}
                      alt={item.name || "תמונת אירוע קבוע"}
                      loading="lazy"
                    />
                  )}
                  <h3>📌 {item.name}</h3>
                  {(item.city || item.address) && <p><strong>מיקום:</strong> {[item.city, item.address].filter(Boolean).join(", ")}</p>}
                  {item.openingHours && <p><strong>שעות:</strong> {item.openingHours}</p>}
                  {item.description && <p>{item.description}</p>}
                  {item.accessibility && <p><strong>נגישות:</strong> {item.accessibility}</p>}

                  <div className="aep-card-actions">
                    <button type="button" onClick={() => editPermanent(item)}>✏️ עריכה</button>
                    <button type="button" className="danger" onClick={() => removePermanent(item)}>🗑️ מחיקה</button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </>
      )}
    </main>
  );
}

export default AdminEventsPanel;
