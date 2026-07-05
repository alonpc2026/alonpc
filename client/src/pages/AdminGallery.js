import { useEffect, useState } from "react";

function AdminGallery() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [images, setImages] = useState([]);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("galleryImages")) || [];
    setImages(saved);
  }, []);

  if (!user || user.role !== "admin") {
    return (
      <section className="loginBox">
        <h2>🔐 אין הרשאה</h2>
        <p>רק מנהל יכול לנהל גלריית תמונות.</p>
      </section>
    );
  }

  const saveImages = (list) => {
    localStorage.setItem("galleryImages", JSON.stringify(list));
    setImages(list);
  };

  const addImage = () => {
    if (!title || !imageUrl) {
      setMessage("נא למלא שם תמונה וקישור תמונה");
      return;
    }

    const newImage = {
      title,
      category,
      imageUrl,
      createdAt: new Date().toLocaleString("he-IL"),
    };

    saveImages([...images, newImage]);
    setTitle("");
    setCategory("");
    setImageUrl("");
    setMessage("✅ התמונה נוספה לגלריה");
  };

  const deleteImage = (index) => {
    if (!window.confirm("למחוק תמונה?")) return;

    const list = images.filter((_, i) => i !== index);
    saveImages(list);
    setMessage("🗑️ התמונה נמחקה");
  };

  return (
    <section className="loginBox">
      <h2>🖼️ גלריית תמונות</h2>

      <input
        placeholder="שם תמונה"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        placeholder="קטגוריה לדוגמה: שירותים / חנות / יד שנייה"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />

      <input
        placeholder="קישור לתמונה / כתובת תמונה"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
      />

      <button onClick={addImage}>➕ הוסף תמונה</button>

      <p>{message}</p>

      <hr />

      {images.length === 0 && <p>אין תמונות בגלריה עדיין.</p>}

      {images.map((image, index) => (
        <div className="adminService" key={index}>
          <img
            src={image.imageUrl}
            alt={image.title}
            style={{
              width: "140px",
              height: "140px",
              objectFit: "cover",
              borderRadius: "14px",
              background: "#fff",
            }}
          />

          <h3>{image.title}</h3>
          <p>{image.category}</p>
          <small>{image.createdAt}</small>

          <br />
          <button onClick={() => deleteImage(index)}>🗑️ מחק</button>
        </div>
      ))}
    </section>
  );
}

export default AdminGallery;