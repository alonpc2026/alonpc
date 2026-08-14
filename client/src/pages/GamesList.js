import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import "./GamesList.css";

const API_BASE =
  process.env.REACT_APP_API_BASE ||
  "https://alonpc02026.onrender.com/api";

const LABELS = {
  computer: { he:"משחקים למחשב", en:"Computer Games", ru:"Игры для компьютера", ar:"ألعاب الكمبيوتر", am:"የኮምፒውተር ጨዋታዎች" },
  android: { he:"משחקים לאנדרואיד", en:"Android Games", ru:"Игры для Android", ar:"ألعاب Android", am:"የAndroid ጨዋታዎች" },
  apple: { he:"משחקים לאפל", en:"Apple Games", ru:"Игры для Apple", ar:"ألعاب Apple", am:"የApple ጨዋታዎች" },
  tv: { he:"משחקים לטלוויזיה חכמה", en:"Smart TV Games", ru:"Игры для Smart TV", ar:"ألعاب التلفزيون الذكي", am:"የSmart TV ጨዋታዎች" },
};

const TEXT = {
  he:{ search:"חיפוש משחק...", loading:"טוען משחקים...", empty:"עדיין אין משחקים בקטגוריה זו.", open:"פתיחת המשחק", back:"חזרה לכל המשחקים" },
  en:{ search:"Search games...", loading:"Loading games...", empty:"No games in this category yet.", open:"Open game", back:"Back to all games" },
  ru:{ search:"Поиск игры...", loading:"Загрузка игр...", empty:"В этой категории пока нет игр.", open:"Открыть игру", back:"Назад ко всем играм" },
  ar:{ search:"بحث عن لعبة...", loading:"جارٍ تحميل الألعاب...", empty:"لا توجد ألعاب في هذه الفئة بعد.", open:"فتح اللعبة", back:"العودة إلى جميع الألعاب" },
  am:{ search:"ጨዋታ ፈልግ...", loading:"ጨዋታዎች በመጫን ላይ...", empty:"በዚህ ምድብ ጨዋታዎች ገና የሉም።", open:"ጨዋታውን ክፈት", back:"ወደ ሁሉም ጨዋታዎች ተመለስ" },
};

export default function GamesList() {
  const { type } = useParams();
  const { language, dir } = useLanguage();
  const t = TEXT[language] || TEXT.he;
  const title = LABELS[type]?.[language] || LABELS[type]?.he || "Games";
  const [games, setGames] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      try {
        const r = await fetch(`${API_BASE}/games?type=${encodeURIComponent(type)}`);
        const d = await r.json().catch(() => []);
        if (!r.ok) throw new Error(d?.message || "Load failed");
        if (active) {
          setGames(Array.isArray(d) ? d : d.games || []);
          setMessage("");
        }
      } catch (e) {
        if (active) {
          setGames([]);
          setMessage(e.message);
        }
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => { active = false; };
  }, [type]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return games;
    return games.filter((g) =>
      `${g.name || ""} ${g.description || ""} ${g.platform || ""}`.toLowerCase().includes(q)
    );
  }, [games, search]);

  return (
    <main className="games-list-page" dir={dir}>
      <section className="games-list-hero">
        <h1>🎮 {title}</h1>
      </section>

      <div className="games-list-tools">
        <input value={search} onChange={(e)=>setSearch(e.target.value)} placeholder={t.search} />
        <Link to="/games">{t.back}</Link>
      </div>

      {loading && <p className="games-list-status">{t.loading}</p>}
      {message && <p className="games-list-status">{message}</p>}
      {!loading && !message && filtered.length === 0 && <p className="games-list-status">{t.empty}</p>}

      <section className="games-list-grid">
        {filtered.map((game) => (
          <article className="game-item-card" key={game._id}>
            {game.imageUrl ? <img src={game.imageUrl} alt={game.name || ""} /> : <div className="game-item-placeholder">🎮</div>}
            <h2>{game.name}</h2>
            {game.platform && <strong>{game.platform}</strong>}
            {game.description && <p>{game.description}</p>}
            {game.url && <a href={game.url} target="_blank" rel="noopener noreferrer">{t.open}</a>}
          </article>
        ))}
      </section>
    </main>
  );
}
