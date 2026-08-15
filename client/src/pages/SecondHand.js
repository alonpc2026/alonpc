import { useEffect, useMemo, useState } from "react";
import "./SecondHand.css";

const API = (process.env.REACT_APP_API_BASE || "https://alonpc02026.onrender.com/api") + "/second-hand";
const WHATSAPP_NUMBER = "972545221809";
const CONDITIONS = ["כמו חדש","מצב טוב מאוד","מצב טוב","משומש","לחלקים"];

const formatPrice = (value) => {
  const n = Number(value);
  return Number.isFinite(n) ? n.toLocaleString("he-IL") : value || "0";
};

function SecondHand() {
  const [items,setItems] = useState([]);
  const [search,setSearch] = useState("");
  const [category,setCategory] = useState("");
  const [condition,setCondition] = useState("");
  const [sort,setSort] = useState("newest");
  const [loading,setLoading] = useState(true);
  const [message,setMessage] = useState("");

  useEffect(() => {
    let active = true;
    async function loadItems() {
      try {
        const response = await fetch(`${API}?active=true`);
        const data = await response.json().catch(() => []);
        if (!response.ok) throw new Error(data.message || "לא ניתן לטעון מוצרי יד שנייה");
        if (active) setItems(Array.isArray(data) ? data : []);
      } catch (error) {
        if (active) setMessage(error.message || "לא ניתן לטעון מוצרי יד שנייה כרגע");
      } finally {
        if (active) setLoading(false);
      }
    }
    loadItems();
    return () => { active = false; };
  }, []);

  const categories = useMemo(
    () => [...new Set(items.map(i => i.category).filter(Boolean))].sort((a,b)=>a.localeCompare(b,"he")),
    [items]
  );

  const conditions = useMemo(
    () => [...new Set([...CONDITIONS,...items.map(i=>i.condition).filter(Boolean)])],
    [items]
  );

  const filteredItems = useMemo(() => {
    const q = search.trim().toLowerCase();
    const result = items.filter((item) => {
      const text = [item.name,item.category,item.brand,item.model,item.condition,item.description]
        .filter(Boolean).join(" ").toLowerCase();
      return (!q || text.includes(q)) &&
        (!category || item.category === category) &&
        (!condition || item.condition === condition);
    });

    return [...result].sort((a,b) => {
      if (sort === "priceLow") return Number(a.price||0)-Number(b.price||0);
      if (sort === "priceHigh") return Number(b.price||0)-Number(a.price||0);
      if (sort === "name") return String(a.name||"").localeCompare(String(b.name||""),"he");
      return new Date(b.createdAt||0)-new Date(a.createdAt||0);
    });
  }, [items,search,category,condition,sort]);

  const resetFilters = () => {
    setSearch(""); setCategory(""); setCondition(""); setSort("newest");
  };

  const whatsappUrl = (item) => {
    const text = encodeURIComponent(
      `שלום אלון, אני מתעניין במוצר מלוח יד 2:\n${item.name}\nמחיר: ₪${formatPrice(item.price)}\nמצב: ${item.condition || "לא צוין"}`
    );
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
  };

  return (
    <main className="sh-page" dir="rtl">
      <section className="sh-hero">
        <div className="sh-hero-icon">♻️</div>
        <div>
          <h1>לוח יד 2 של ALONPC</h1>
          <p>מחשבים, מסכים, מדפסות, חלקים, ציוד היקפי ומוצרים משומשים במקום אחד.</p>
        </div>
      </section>

      <section className="sh-filters">
        <label className="sh-search"><span>חיפוש</span>
          <input type="search" value={search} onChange={e=>setSearch(e.target.value)}
            placeholder="🔎 שם מוצר, מותג או דגם..." />
        </label>

        <label><span>קטגוריה</span>
          <select value={category} onChange={e=>setCategory(e.target.value)}>
            <option value="">כל הקטגוריות</option>
            {categories.map(item=><option key={item}>{item}</option>)}
          </select>
        </label>

        <label><span>מצב</span>
          <select value={condition} onChange={e=>setCondition(e.target.value)}>
            <option value="">כל המצבים</option>
            {conditions.map(item=><option key={item}>{item}</option>)}
          </select>
        </label>

        <label><span>מיון</span>
          <select value={sort} onChange={e=>setSort(e.target.value)}>
            <option value="newest">החדשים ביותר</option>
            <option value="priceLow">מחיר מהנמוך לגבוה</option>
            <option value="priceHigh">מחיר מהגבוה לנמוך</option>
            <option value="name">לפי שם</option>
          </select>
        </label>

        <button type="button" className="sh-reset" onClick={resetFilters}>ניקוי סינון</button>
      </section>

      <section className="sh-summary">נמצאו <strong>{filteredItems.length}</strong> מוצרים</section>

      {loading && <p className="sh-status">טוען מוצרים...</p>}
      {!loading && message && <p className="sh-status error">{message}</p>}

      {!loading && !message && filteredItems.length === 0 && (
        <section className="sh-empty">
          <h2>אין כרגע מוצרים מתאימים</h2>
          <button type="button" onClick={resetFilters}>הצג הכל</button>
        </section>
      )}

      <section className="sh-grid">
        {filteredItems.map(item => (
          <article className={`sh-card ${item.featured ? "featured" : ""}`} key={item._id}>
            <div className="sh-image-wrap">
              {item.featured && <span className="sh-featured">⭐ מומלץ</span>}
              {item.imageUrl ? <img src={item.imageUrl} alt={item.name || "מוצר יד 2"} loading="lazy" /> : <div className="sh-image-placeholder">♻️</div>}
            </div>

            <div className="sh-card-body">
              <div className="sh-tags">
                {item.category && <span>{item.category}</span>}
                {item.condition && <span>{item.condition}</span>}
              </div>
              <h2>{item.name}</h2>
              {(item.brand || item.model) && <p className="sh-brand">{[item.brand,item.model].filter(Boolean).join(" • ")}</p>}
              {item.description && <p className="sh-description">{item.description}</p>}
              <div className="sh-price-row">
                <strong>₪{formatPrice(item.price)}</strong>
                {Number(item.oldPrice) > Number(item.price) && <del>₪{formatPrice(item.oldPrice)}</del>}
              </div>
              <div className="sh-card-actions">
                <a href={whatsappUrl(item)} target="_blank" rel="noreferrer" className="sh-whatsapp">💬 פנייה ב־WhatsApp</a>
                {item.websiteUrl && <a href={item.websiteUrl} target="_blank" rel="noreferrer" className="sh-more">🌐 פרטים נוספים</a>}
              </div>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}

export default SecondHand;
