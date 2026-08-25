const API = "https://alonpc02026.onrender.com/api/usage-stats";

export function trackVisitOncePerSession() {
  try {
    if (sessionStorage.getItem("alonpcDailyStatsVisit")) return;
    sessionStorage.setItem("alonpcDailyStatsVisit", "1");
    fetch(`${API}/track`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventType: "visit", key: "site", label: "כניסה לאתר" }),
      keepalive: true
    }).catch(() => {});
  } catch (_) {}
}

export function trackButtonClick(key, label) {
  fetch(`${API}/track`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ eventType: "click", key, label }),
    keepalive: true
  }).catch(() => {});
}
