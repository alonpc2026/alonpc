import { useEffect, useState } from "react";

function Documents() {
  const API = "http://localhost:3001/api/documents";

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

      if (Array.isArray(data)) {
        setDocuments(data);
      } else {
        setDocuments([]);
      }
    } catch (err) {
      console.error(err);
      setMessage("לא ניתן לטעון מסמכים כרגע");
    }
  };

  const filteredDocuments = documents.filter((doc) => {
    const text = `${doc.title || ""} ${doc.category || ""} ${doc.description || ""}`.toLowerCase();
    return text.includes(search.toLowerCase());
  });

  return (
    <div className="pageContainer">
      <h1>📄 מסמכים</h1>

      <input
        type="text"
        placeholder="חפש מסמך..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="searchInput"
      />

      {message && <p>{message}</p>}

      <div className="grid">
        {filteredDocuments.length === 0 ? (
          <p>אין מסמכים להצגה.</p>
        ) : (
          filteredDocuments.map((doc) => (
            <div className="card" key={doc._id}>
              <h3>{doc.title}</h3>

              <p>
                <strong>קטגוריה:</strong> {doc.category}
              </p>

              <p>{doc.description}</p>

              <a
                href={doc.fileUrl}
                target="_blank"
                rel="noreferrer"
              >
                <button>📥 פתח / הורד</button>
              </a>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Documents;