// C:\alonpc\client\src\components\VisitorCounter.js

import { useEffect, useState } from "react";

const API_URL = "https://alonpc02026.onrender.com/api/visitors";

export default function VisitorCounter() {
  const [count, setCount] = useState(null);

  useEffect(() => {
    async function load() {
      const counted = sessionStorage.getItem("alonpcVisitorCounted");
      const res = await fetch(API_URL,{method: counted ? "GET":"POST"});
      const data = await res.json();
      setCount(data.count);
      if(!counted){
        sessionStorage.setItem("alonpcVisitorCounted","true");
      }
    }
    load();
  }, []);

  return (
    <div className="visitorCounter">
      👥 מספר המבקרים באתר:
      <h2>{count ?? "..."}</h2>
    </div>
  );
}
