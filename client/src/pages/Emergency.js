import { useLanguage } from "../context/LanguageContext";
import "./Emergency.css";

const T={
he:{title:"חירום",subtitle:"מספרי חירום בישראל",warning:"במקרה חירום אמיתי פנו מיד לשירות החירום המתאים.",police:"משטרה",fire:"כבאות והצלה",mada:"מגן דוד אדום",call:"חיוג"},
en:{title:"Emergency",subtitle:"Emergency numbers in Israel",warning:"In a real emergency, contact the appropriate emergency service immediately.",police:"Police",fire:"Fire and Rescue",mada:"Magen David Adom",call:"Call"},
ru:{title:"Экстренная помощь",subtitle:"Экстренные номера в Израиле",warning:"В экстренной ситуации немедленно обратитесь в соответствующую службу.",police:"Полиция",fire:"Пожарно-спасательная служба",mada:"Маген Давид Адом",call:"Позвонить"},
ar:{title:"الطوارئ",subtitle:"أرقام الطوارئ في إسرائيل",warning:"في حالة طوارئ حقيقية، اتصل فورًا بخدمة الطوارئ المناسبة.",police:"الشرطة",fire:"الإطفاء والإنقاذ",mada:"نجمة داود الحمراء",call:"اتصال"},
am:{title:"ድንገተኛ አደጋ",subtitle:"በእስራኤል የድንገተኛ አደጋ ቁጥሮች",warning:"በእውነተኛ ድንገተኛ አደጋ ጊዜ ተገቢውን የአደጋ ጊዜ አገልግሎት ወዲያውኑ ያነጋግሩ።",police:"ፖሊስ",fire:"እሳትና ማዳን",mada:"ማጌን ዳቪድ አዶም",call:"ይደውሉ"}
};
const S=[{key:"police",icon:"👮",number:"100",c:"police"},{key:"mada",icon:"🚑",number:"101",c:"mada"},{key:"fire",icon:"🚒",number:"102",c:"fire"}];
export default function Emergency(){const {language,dir}=useLanguage();const t=T[language]||T.he;return <main className="emergency-page" dir={dir}><header className="emergency-hero"><span>🚨</span><div><h1>{t.title}</h1><p>{t.subtitle}</p></div></header><div className="emergency-warning">{t.warning}</div><section className="emergency-grid">{S.map(s=><article className={`emergency-card emergency-card--${s.c}`} key={s.key}><span className="emergency-card-icon">{s.icon}</span><h2>{t[s.key]}</h2><strong>{s.number}</strong><a href={`tel:${s.number}`}>📞 {t.call} {s.number}</a></article>)}</section></main>}
