import { useEffect, useState } from "react";

function Documents() {
  const API = "https://alonpc-server.onrender.com/api/documents";

  const [documents, setDocuments] = useState([]);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      const res = await fetch(API);
      const data = await res.json();
      setDocuments(Array.isArray(data) ? data : []);
    } catch {
      setMessage("לא ניתן לטעון מסמכים כרגע");
    }
  };

  const filteredDocuments = documents.filter((doc) => {
    const text = `${doc.title || ""} ${doc.category || ""} ${doc.description || ""}`.toLowerCase();
    return text.includes(search.toLowerCase());
  });

  return (
    <div>
      <section className="heroBanner">
        <h2>📄 מסמכים להורדה</h2>
        <p>טפסים • מחירונים • מדריכים • קבצי מידע</p>
      </section>

      <div className="searchBox">
        <input
          type="text"
          placeholder="🔍 חפש מסמך..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {message && <p style={{ textAlign: "center", color: "white" }}>{message}</p>}

      <main className="grid">
        {filteredDocuments.length === 0 && !message && (
          <h3 style={{ color: "white", textAlign: "center" }}>
            אין מסמכים עדיין
          </h3>
        )}

        {filteredDocuments.map((doc) => (
          <div className="card" key={doc._id}>
            <h3>📄 {doc.title}</h3>
            <p>{doc.category}</p>
            <p>{doc.description}</p>

            <a href={doc.fileUrl} target="_blank" rel="noreferrer">
              <button>📂 פתח / הורד</button>
            </a>
          </div>
        ))}
      </main>
    </div>
  );
}

export default Documents;
