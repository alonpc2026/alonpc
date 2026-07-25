import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

const API = "https://alonpc02026.onrender.com/api/services";

const emptyForm = {
  name: "",
  professionType: "",
  category: "",
  serviceType: "",
  businessName: "",
  logoUrl: "",
  websiteUrl: "",
  address: "",
  phone: "",
  acceptsWhatsApp: false,
  serviceCitiesText: "",
  description: "",
  email: "",
  hours: "",
  imageUrl: "",
  active: true,
};

function AdminServices() {
  const [services, setServices] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState("");
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const headers = useCallback(() => {
    const token = localStorage.getItem("token");

    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }, []);

  const loadServices = useCallback(async () => {
    setLoading(true);

    try {
      const response = await fetch(API);
      const data = await response.json().catch(() => []);

      if (!response.ok) {
        throw new Error(data.message || "לא ניתן לטעון את השירותים");
      }

      setServices(Array.isArray(data) ? data : []);
    } catch (error) {
      setServices([]);
      setMessage(`שגיאה בטעינה: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadServices();
  }, [loadServices]);

  const filteredServices = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return services;

    return services.filter((service) =>
      [
        service.name,
        service.professionType,
        service.category,
        service.serviceType,
        service.businessName,
        service.address,
        service.phone,
        ...(Array.isArray(service.serviceCities)
          ? service.serviceCities
          : []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
  }, [services, search]);

  const updateField = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId("");
  };

  const startEdit = (service) => {
    setEditingId(service._id);
    setForm({
      name: service.name || "",
      professionType: service.professionType || "",
      category: service.category || "",
      serviceType: service.serviceType || "",
      businessName: service.businessName || "",
      logoUrl: service.logoUrl || "",
      websiteUrl: service.websiteUrl || service.link || "",
      address: service.address || "",
      phone: service.phone || "",
      acceptsWhatsApp: Boolean(service.acceptsWhatsApp),
      serviceCitiesText: Array.isArray(service.serviceCities)
        ? service.serviceCities.join(", ")
        : service.city || "",
      description: service.description || "",
      email: service.email || "",
      hours: service.hours || "",
      imageUrl: service.imageUrl || "",
      active: service.active !== false,
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const buildPayload = () => {
    const cities = form.serviceCitiesText
      .split(",")
      .map((city) => city.trim())
      .filter(Boolean);

    return {
      name: form.name.trim(),
      professionType: form.professionType.trim(),
      category: form.category.trim(),
      serviceType: form.serviceType.trim(),
      businessName: form.businessName.trim(),
      logoUrl: form.logoUrl.trim(),
      websiteUrl: form.websiteUrl.trim(),
      link: form.websiteUrl.trim(),
      address: form.address.trim(),
      phone: form.phone.trim(),
      acceptsWhatsApp: form.acceptsWhatsApp,
      serviceCities: cities,
      city: cities[0] || "",
      description: form.description.trim(),
      email: form.email.trim(),
      hours: form.hours.trim(),
      imageUrl: form.imageUrl.trim(),
      active: form.active,
    };
  };

  const saveService = async (event) => {
    event.preventDefault();
    setMessage("");

    const payload = buildPayload();

    if (!payload.name || !payload.professionType || !payload.serviceType) {
      setMessage("חובה למלא שם שירות, סוג מקצוע וסוג שירות.");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(
        editingId ? `${API}/${editingId}` : API,
        {
          method: editingId ? "PUT" : "POST",
          headers: headers(),
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || "לא ניתן לשמור את השירות");
      }

      setMessage(editingId ? "השירות עודכן בהצלחה." : "השירות נוסף בהצלחה.");
      resetForm();
      await loadServices();
    } catch (error) {
      setMessage(`שגיאה בשמירה: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const removeService = async (service) => {
    if (!window.confirm(`למחוק את השירות "${service.name}"?`)) return;

    try {
      const response = await fetch(`${API}/${service._id}`, {
        method: "DELETE",
        headers: headers(),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || "לא ניתן למחוק את השירות");
      }

      setMessage("השירות נמחק בהצלחה.");
      await loadServices();
    } catch (error) {
      setMessage(`שגיאה במחיקה: ${error.message}`);
    }
  };

  const inputStyle = {
    width: "100%",
    minHeight: 46,
    padding: "10px 12px",
    border: "2px solid #cbd5e1",
    borderRadius: 10,
    fontSize: 17,
    boxSizing: "border-box",
  };

  const labelStyle = {
    display: "grid",
    gap: 7,
    fontWeight: 700,
  };

  return (
    <main dir="rtl" style={{ maxWidth: 1250, margin: "0 auto", padding: 20 }}>
      <section style={panelStyle}>
        <div style={topRowStyle}>
          <div>
            <h1 style={{ margin: 0 }}>ניהול שירותים</h1>
            <p>הוספה, עריכה ומחיקה של נותני שירות ועסקים.</p>
          </div>

          <Link to="/admin" style={backButtonStyle}>
            חזרה לפורטל הניהול
          </Link>
        </div>
      </section>

      <form onSubmit={saveService} style={panelStyle}>
        <h2>{editingId ? "עריכת שירות" : "הוספת שירות חדש"}</h2>

        <div style={formGridStyle}>
          <label style={labelStyle}>
            שם השירות *
            <input name="name" value={form.name} onChange={updateField} style={inputStyle} />
          </label>

          <label style={labelStyle}>
            סוג מקצוע *
            <input
              name="professionType"
              value={form.professionType}
              onChange={updateField}
              style={inputStyle}
              placeholder="למשל: טכנאי מחשבים"
            />
          </label>

          <label style={labelStyle}>
            קטגוריה
            <input name="category" value={form.category} onChange={updateField} style={inputStyle} />
          </label>

          <label style={labelStyle}>
            סוג שירות *
            <input
              name="serviceType"
              value={form.serviceType}
              onChange={updateField}
              style={inputStyle}
              placeholder="למשל: שירות בבית הלקוח"
            />
          </label>

          <label style={labelStyle}>
            שם העסק או החברה
            <input
              name="businessName"
              value={form.businessName}
              onChange={updateField}
              style={inputStyle}
            />
          </label>

          <label style={labelStyle}>
            טלפון
            <input name="phone" value={form.phone} onChange={updateField} style={inputStyle} />
          </label>

          <label style={labelStyle}>
            כתובת
            <input name="address" value={form.address} onChange={updateField} style={inputStyle} />
          </label>

          <label style={labelStyle}>
            ערים שבהן ניתן השירות
            <input
              name="serviceCitiesText"
              value={form.serviceCitiesText}
              onChange={updateField}
              style={inputStyle}
              placeholder="חיפה, נשר, קריות, טירת כרמל"
            />
          </label>

          <label style={labelStyle}>
            קישור ללוגו החברה
            <input
              type="url"
              name="logoUrl"
              value={form.logoUrl}
              onChange={updateField}
              style={inputStyle}
              placeholder="https://..."
            />
          </label>

          <label style={labelStyle}>
            קישור לאתר
            <input
              type="url"
              name="websiteUrl"
              value={form.websiteUrl}
              onChange={updateField}
              style={inputStyle}
              placeholder="https://..."
            />
          </label>

          <label style={labelStyle}>
            דוא"ל
            <input type="email" name="email" value={form.email} onChange={updateField} style={inputStyle} />
          </label>

          <label style={labelStyle}>
            שעות פעילות
            <input name="hours" value={form.hours} onChange={updateField} style={inputStyle} />
          </label>

          <label style={labelStyle}>
            קישור לתמונה נוספת
            <input
              type="url"
              name="imageUrl"
              value={form.imageUrl}
              onChange={updateField}
              style={inputStyle}
              placeholder="https://..."
            />
          </label>
        </div>

        <label style={{ ...labelStyle, marginTop: 16 }}>
          תיאור השירות
          <textarea
            name="description"
            value={form.description}
            onChange={updateField}
            style={{ ...inputStyle, minHeight: 130, resize: "vertical" }}
          />
        </label>

        <div style={{ display: "flex", gap: 24, flexWrap: "wrap", marginTop: 18 }}>
          <label style={{ fontWeight: 700 }}>
            <input
              type="checkbox"
              name="acceptsWhatsApp"
              checked={form.acceptsWhatsApp}
              onChange={updateField}
              style={{ marginLeft: 8, width: 20, height: 20 }}
            />
            מקבל WhatsApp: כן
          </label>

          <label style={{ fontWeight: 700 }}>
            <input
              type="checkbox"
              name="active"
              checked={form.active}
              onChange={updateField}
              style={{ marginLeft: 8, width: 20, height: 20 }}
            />
            שירות פעיל
          </label>
        </div>

        {message && <p style={messageStyle}>{message}</p>}

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 20 }}>
          <button type="submit" disabled={saving} style={saveButtonStyle}>
            {saving ? "שומר..." : editingId ? "שמור עדכון" : "הוסף שירות"}
          </button>

          {editingId && (
            <button type="button" onClick={resetForm} style={cancelButtonStyle}>
              ביטול עריכה
            </button>
          )}
        </div>
      </form>

      <section style={panelStyle}>
        <div style={topRowStyle}>
          <div>
            <h2 style={{ marginBottom: 4 }}>רשימת שירותים</h2>
            <span>{filteredServices.length} שירותים</span>
          </div>

          <label style={{ ...labelStyle, minWidth: 280 }}>
            חיפוש
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              style={inputStyle}
              placeholder="שם, מקצוע, עיר או טלפון"
            />
          </label>
        </div>

        {loading ? (
          <p>טוען שירותים...</p>
        ) : filteredServices.length === 0 ? (
          <p>לא נמצאו שירותים.</p>
        ) : (
          <div style={{ display: "grid", gap: 14, marginTop: 18 }}>
            {filteredServices.map((service) => (
              <article key={service._id} style={serviceCardStyle}>
                <div style={logoBoxStyle}>
                  {service.logoUrl || service.imageUrl ? (
                    <img
                      src={service.logoUrl || service.imageUrl}
                      alt={service.businessName || service.name}
                      style={{ width: "100%", height: "100%", objectFit: "contain" }}
                    />
                  ) : (
                    "🛎️"
                  )}
                </div>

                <div>
                  <h3 style={{ margin: "0 0 8px" }}>{service.name}</h3>
                  <p><strong>מקצוע:</strong> {service.professionType || "לא צוין"}</p>
                  <p><strong>סוג שירות:</strong> {service.serviceType || "לא צוין"}</p>
                  <p>
                    <strong>ערים:</strong>{" "}
                    {Array.isArray(service.serviceCities) && service.serviceCities.length
                      ? service.serviceCities.join(", ")
                      : service.city || "לא צוינו"}
                  </p>
                  <p><strong>WhatsApp:</strong> {service.acceptsWhatsApp ? "כן" : "לא"}</p>
                  <p><strong>מצב:</strong> {service.active !== false ? "פעיל" : "לא פעיל"}</p>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <button type="button" onClick={() => startEdit(service)} style={editButtonStyle}>
                    עריכה
                  </button>

                  <button type="button" onClick={() => removeService(service)} style={deleteButtonStyle}>
                    מחיקה
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

const panelStyle = {
  background: "#ffffff",
  borderRadius: 18,
  padding: 22,
  boxShadow: "0 6px 24px rgba(15, 23, 42, 0.12)",
  marginBottom: 24,
};

const topRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 14,
  flexWrap: "wrap",
};

const formGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
  gap: 16,
};

const backButtonStyle = {
  padding: "12px 18px",
  borderRadius: 10,
  background: "#334155",
  color: "white",
  textDecoration: "none",
  fontWeight: 700,
};

const messageStyle = {
  marginTop: 18,
  padding: 12,
  borderRadius: 10,
  background: "#f1f5f9",
  fontWeight: 700,
};

const saveButtonStyle = {
  minHeight: 48,
  padding: "10px 24px",
  border: 0,
  borderRadius: 10,
  background: "#15803d",
  color: "white",
  fontSize: 17,
  fontWeight: 700,
  cursor: "pointer",
};

const cancelButtonStyle = {
  ...saveButtonStyle,
  background: "#64748b",
};

const serviceCardStyle = {
  border: "2px solid #e2e8f0",
  borderRadius: 14,
  padding: 16,
  display: "grid",
  gridTemplateColumns: "90px minmax(0, 1fr) auto",
  gap: 16,
  alignItems: "center",
};

const logoBoxStyle = {
  width: 80,
  height: 80,
  borderRadius: 12,
  background: "#f1f5f9",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  overflow: "hidden",
  fontSize: 34,
};

const editButtonStyle = {
  padding: "10px 18px",
  border: 0,
  borderRadius: 9,
  background: "#1d4ed8",
  color: "white",
  fontWeight: 700,
  cursor: "pointer",
};

const deleteButtonStyle = {
  ...editButtonStyle,
  background: "#b91c1c",
};

export default AdminServices;
