import React, { useEffect, useState } from 'react';
import './AccessibilityPanel.css';

const LABELS = {
 he: ['׳ ׳’׳™׳©׳•׳×','׳ ׳™׳’׳•׳“׳™׳•׳× ׳’׳‘׳•׳”׳”','׳˜׳§׳¡׳˜ ׳’׳“׳•׳','׳”׳₪׳—׳×׳× ׳×׳ ׳•׳¢׳”','׳”׳§׳¨׳׳” ׳§׳•׳׳™׳×','׳¦׳׳™׳׳™ ׳ ׳™׳•׳•׳˜','׳”׳§׳¨׳ ׳›׳•׳×׳¨׳×','׳¢׳¦׳•׳¨ ׳”׳§׳¨׳׳”','׳¡׳’׳•׳¨'],
 en: ['Accessibility','High contrast','Large text','Reduce motion','Voice reading','Navigation sounds','Read heading','Stop reading','Close'],
 ru: ['׀”׀¾ׁׁ‚ׁƒ׀¿׀½׀¾ׁׁ‚ׁ','׀’ׁ‹ׁ׀¾׀÷׀°ׁ ׀÷׀¾׀½ׁ‚ׁ€׀°ׁׁ‚׀½׀¾ׁׁ‚ׁ','׀ׁ€ׁƒ׀¿׀½ׁ‹׀¹ ׁ‚׀µ׀÷ׁׁ‚','׀׀µ׀½ׁׁˆ׀µ ׀°׀½׀¸׀¼׀°ׁ†׀¸׀¸','׀׀·׀²ׁƒׁ‡׀¸׀²׀°׀½׀¸׀µ','׀—׀²ׁƒ׀÷׀¸ ׀½׀°׀²׀¸׀³׀°ׁ†׀¸׀¸','׀ׁ€׀¾ׁ‡׀¸ׁ‚׀°ׁ‚ׁ ׀·׀°׀³׀¾׀»׀¾׀²׀¾׀÷','׀ׁׁ‚׀°׀½׀¾׀²׀¸ׁ‚ׁ ׁ‡ׁ‚׀µ׀½׀¸׀µ','׀—׀°׀÷ׁ€ׁ‹ׁ‚ׁ'],
 ar: ['״¥…ƒ״§†״© ״§„ˆ״µˆ„','״×״¨״§† ״¹״§„','†״µ ƒ״¨״±','״×‚„„ ״§„״­״±ƒ״©','״§„‚״±״§״¡״© ״§„״µˆ״×״©','״£״µˆ״§״× ״§„״×†‚„','״§‚״±״£ ״§„״¹†ˆ״§†','״¥‚״§ ״§„‚״±״§״¡״©','״¥״÷„״§‚']
};
const VOICES = {he:'he-IL',en:'en-US',ru:'ru-RU',ar:'ar-SA'};
function getSaved() {try {return JSON.parse(localStorage.getItem('alonpc-accessibility') || '{}');} catch {return {};}}
export default function AccessibilityPanel() {
 const [open,setOpen]=useState(false);
 const [settings,setSettings]=useState(getSaved);
 const [lang,setLang]=useState('he');
 useEffect(()=>{
   const update=()=>{const v=(document.documentElement.lang || 'he').slice(0,2);setLang(LABELS[v]?v:'he');};
   update();const observer=new MutationObserver(update);observer.observe(document.documentElement,{attributes:true,attributeFilter:['lang']});return ()=>observer.disconnect();
 },[]);
 useEffect(()=>{
  document.documentElement.classList.toggle('alonpc-high-contrast',!!settings.contrast);
  document.documentElement.classList.toggle('alonpc-large-text',!!settings.large);
  document.documentElement.classList.toggle('alonpc-reduced-motion',!!settings.motion);
  try{localStorage.setItem('alonpc-accessibility',JSON.stringify(settings));}catch{}
 },[settings]);
 const txt=LABELS[lang];
 const toggle=k=>setSettings(p=>({...p,[k]:!p[k]}));
 const beep=()=>{if(!settings.sounds)return;try{const A=window.AudioContext||window.webkitAudioContext;if(!A)return;const ctx=new A();const osc=ctx.createOscillator(),gain=ctx.createGain();osc.frequency.value=540;gain.gain.value=.025;osc.connect(gain);gain.connect(ctx.destination);osc.start();osc.stop(ctx.currentTime+.07);osc.onended=()=>ctx.close();}catch{}};
 const read=()=>{if(!window.speechSynthesis)return;window.speechSynthesis.cancel();const heading=document.querySelector('main h1, h1, main h2');const msg=new SpeechSynthesisUtterance(heading?.textContent?.trim()||document.title||'ALONPC');msg.lang=VOICES[lang];msg.rate=.85;window.speechSynthesis.speak(msg);};
 return <div className="alonpc-a11y" dir={lang==='ar'||lang==='he'?'rtl':'ltr'}>
  <button type="button" className="alonpc-a11y-launch" onClick={()=>{beep();setOpen(!open);}} aria-label={txt[0]} aria-expanded={open} aria-controls="alonpc-a11y-panel">ג™¿ {txt[0]}</button>
  {open&&<section id="alonpc-a11y-panel" className="alonpc-a11y-panel" aria-label={txt[0]}>
    <div className="alonpc-a11y-heading"><strong>{txt[0]}</strong><button type="button" onClick={()=>setOpen(false)} aria-label={txt[8]}>ג•</button></div>
    {['contrast','large','motion','voice','sounds'].map((key,i)=><label key={key}><input type="checkbox" checked={!!settings[key]} onChange={()=>{beep();toggle(key);}} />{txt[i+1]}</label>)}
    <div className="alonpc-a11y-actions"><button type="button" onClick={()=>{beep();read();}}>{txt[6]}</button><button type="button" onClick={()=>window.speechSynthesis?.cancel()}>{txt[7]}</button></div>
    <small>NVDA ֲ· VoiceOver ֲ· TalkBack</small>
  </section>}
 </div>;
}

