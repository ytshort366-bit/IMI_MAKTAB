import { useState, useEffect, useRef, useCallback } from "react";

/* ═══════════════════════════════════════════════════════════════
   GLOBAL STYLES
═══════════════════════════════════════════════════════════════ */
const GS = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Exo+2:wght@300;400;500;600;700;800&family=Noto+Sans:wght@300;400;500;600&display=swap');
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
    html{scroll-behavior:smooth;}
    body{font-family:'Noto Sans',sans-serif;background:#F4F6FA;color:#1A2340;}
    ::-webkit-scrollbar{width:5px;}
    ::-webkit-scrollbar-thumb{background:#0052CC;border-radius:3px;}
    @keyframes fadeUp{from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);}}
    @keyframes scaleIn{from{opacity:0;transform:scale(.93) translateY(18px);}to{opacity:1;transform:scale(1) translateY(0);}}
    @keyframes pulse{0%,100%{transform:scale(1);}50%{transform:scale(1.28);}}
    @keyframes slideIn{from{opacity:0;transform:translateX(24px);}to{opacity:1;transform:translateX(0);}}
    .fade-up{animation:fadeUp .45s ease both;}
    .scale-in{animation:scaleIn .3s ease both;}
    .slide-in{animation:slideIn .35s ease both;}
    .heart-pulse{animation:pulse .35s ease;}
    input,textarea,select{font-family:'Noto Sans',sans-serif;}
    a{text-decoration:none;}
  `}</style>
);

/* ═══════════════════════════════════════════════════════════════
   TOKENS
═══════════════════════════════════════════════════════════════ */
const C = {
  bd:"#003087", bm:"#0052CC", bl:"#0070E0", ba:"#00A3E0",
  gold:"#F5A623", gl:"#F4F6FA", gm:"#E2E8F0", gt:"#64748B", td:"#1A2340",
  green:"#10b981", red:"#ef4444", purple:"#8b5cf6", orange:"#f59e0b",
};
const GRADS = [
  "linear-gradient(135deg,#003087,#0070E0)",
  "linear-gradient(135deg,#92400e,#f59e0b)",
  "linear-gradient(135deg,#065f46,#10b981)",
  "linear-gradient(135deg,#4c1d95,#8b5cf6)",
  "linear-gradient(135deg,#9f1239,#e11d48)",
  "linear-gradient(135deg,#0c4a6e,#0284c7)",
];
const CAT_CFG = {
  yangilik:{ label:"Yangilik",  bg:"#dbeafe", color:"#1d4ed8", icon:"📰" },
  elon:    { label:"E'lon",     bg:"#fef3c7", color:"#d97706", icon:"📢" },
  tadbir:  { label:"Tadbir",    bg:"#d1fae5", color:"#065f46", icon:"🎭" },
};
const ROLE_CFG = {
  student: { label:"O'quvchi",   bg:"#dbeafe", color:"#1d4ed8" },
  parent:  { label:"Ota-ona",    bg:"#fce7f3", color:"#9d174d" },
  teacher: { label:"O'qituvchi", bg:"#d1fae5", color:"#065f46" },
  admin:   { label:"Admin",      bg:"#fee2e2", color:"#dc2626" },
};
const AVATAR_COLORS = ["#6366f1","#ec4899","#14b8a6","#f59e0b","#ef4444","#8b5cf6","#0ea5e9","#22c55e"];

/* ═══════════════════════════════════════════════════════════════
   SEED DATA
═══════════════════════════════════════════════════════════════ */
const INIT_NEWS = [
  { id:1, title:"Yangi o'quv yili tantanali boshlanadi",  body:"2025-2026 o'quv yili tantanali ravishda boshlandi. Barcha o'quvchilar va o'qituvchilar uchun bayram marosimi tashkil etildi. Bu yilgi marosimda maktab direktori barcha ishtirokchilarga tabrik so'zladi va yangi o'quv yilida yuqori natijalarga erishish uchun mo'ljallangan rejalar bilan tanishtirdi.", cat:"tadbir", emoji:"🎓", date:"2025-09-02", likes:[], comments:[], views:124 },
  { id:2, title:"Olimpiada g'oliblarimiz mukofotlandi",    body:"Respublika matematika olimpiadasida maktabimiz o'quvchilari 3 ta oltin, 5 ta kumush va 7 ta bronza medal qo'lga kiritdi. G'oliblar viloyat hokimi tomonidan maxsus mukofotlar bilan taqdirlandi.", cat:"yangilik", emoji:"🏆", date:"2025-11-15", likes:[], comments:[], views:210 },
  { id:3, title:"Ota-onalar majlisi e'loni",               body:"Kelgusi oy ota-onalar majlisi o'tkaziladi. Barcha ota-onalarni ishtirok etishga taklif qilamiz. Majlisda o'quvchilarning akademik ko'rsatkichlari, tartib-intizom va kelgusi tadbirlar muhokama qilinadi.", cat:"elon", emoji:"📢", date:"2025-12-01", likes:[], comments:[], views:89 },
  { id:4, title:"Sport musobaqalari natijalari",           body:"Maktabimiz futbol jamoasi tuman chempionatida birinchi o'rinni egalladi! O'quvchilarimiz sport ruhi va jamoaviy o'yin bilan barcha raqiblarini mag'lub etdi.", cat:"yangilik", emoji:"⚽", date:"2026-01-10", likes:[], comments:[], views:156 },
  { id:5, title:"Yangi kutubxona ochildi",                 body:"Maktabimizda zamonaviy kutubxona va o'qish zali ochildi. 5000 dan ortiq kitob, elektron resurslar va qulay o'rganish muhiti yaratildi.", cat:"tadbir", emoji:"📚", date:"2026-02-14", likes:[], comments:[], views:201 },
];


/* ═══════════════════════════════════════════════════════════════
   DARS JADVALI SEED DATA
═══════════════════════════════════════════════════════════════ */
const DAYS = ["Dushanba","Seshanba","Chorshanba","Payshanba","Juma","Shanba"];
const INIT_SCHEDULE = [
  { day:"Dushanba",    lessons:[{t:"08:00",sub:"Matematika",room:"201",teacher:"N.Toshmatov"},{t:"09:00",sub:"O'zbek tili",room:"105",teacher:"Z.Xoliqova"},{t:"10:00",sub:"Tarix",room:"301",teacher:"B.Normatov"},{t:"11:00",sub:"Fizika",room:"214",teacher:"D.Yusupov"},{t:"12:00",sub:"Informatika",room:"Lab-1",teacher:"A.Rahimov"}]},
  { day:"Seshanba",    lessons:[{t:"08:00",sub:"Biologiya",room:"302",teacher:"M.Hasanova"},{t:"09:00",sub:"Kimyo",room:"Lab-2",teacher:"F.Tursunov"},{t:"10:00",sub:"Matematika",room:"201",teacher:"N.Toshmatov"},{t:"11:00",sub:"Ingliz tili",room:"108",teacher:"G.Mirzayeva"},{t:"12:00",sub:"Jismoniy",room:"Sport",teacher:"K.Xasanov"}]},
  { day:"Chorshanba",  lessons:[{t:"08:00",sub:"Fizika",room:"214",teacher:"D.Yusupov"},{t:"09:00",sub:"Tarix",room:"301",teacher:"B.Normatov"},{t:"10:00",sub:"O'zbek adabiyoti",room:"105",teacher:"Z.Xoliqova"},{t:"11:00",sub:"Matematika",room:"201",teacher:"N.Toshmatov"},{t:"12:00",sub:"Informatika",room:"Lab-1",teacher:"A.Rahimov"}]},
  { day:"Payshanba",   lessons:[{t:"08:00",sub:"Kimyo",room:"Lab-2",teacher:"F.Tursunov"},{t:"09:00",sub:"Ingliz tili",room:"108",teacher:"G.Mirzayeva"},{t:"10:00",sub:"Biologiya",room:"302",teacher:"M.Hasanova"},{t:"11:00",sub:"Geografiya",room:"303",teacher:"S.Alieva"},{t:"12:00",sub:"Musiqiy san'at",room:"115",teacher:"R.Nazarov"}]},
  { day:"Juma",        lessons:[{t:"08:00",sub:"O'zbek tili",room:"105",teacher:"Z.Xoliqova"},{t:"09:00",sub:"Matematika",room:"201",teacher:"N.Toshmatov"},{t:"10:00",sub:"Fizika",room:"214",teacher:"D.Yusupov"},{t:"11:00",sub:"Tarix",room:"301",teacher:"B.Normatov"},{t:"12:00",sub:"Sinf soati",room:"105",teacher:"Z.Xoliqova"}]},
  { day:"Shanba",      lessons:[{t:"08:00",sub:"Ingliz tili",room:"108",teacher:"G.Mirzayeva"},{t:"09:00",sub:"Matematika",room:"201",teacher:"N.Toshmatov"},{t:"10:00",sub:"Jismoniy",room:"Sport",teacher:"K.Xasanov"},{t:"11:00",sub:"Informatika",room:"Lab-1",teacher:"A.Rahimov"}]},
];

const SUBJECT_COLORS = {
  "Matematika":  { bg:"#dbeafe", color:"#1d4ed8", icon:"📐" },
  "O'zbek tili": { bg:"#d1fae5", color:"#065f46", icon:"📝" },
  "O'zbek adabiyoti":{ bg:"#d1fae5", color:"#065f46", icon:"📖" },
  "Tarix":       { bg:"#fef3c7", color:"#92400e", icon:"🏛️" },
  "Fizika":      { bg:"#ede9fe", color:"#5b21b6", icon:"⚛️" },
  "Informatika": { bg:"#cffafe", color:"#0e7490", icon:"💻" },
  "Biologiya":   { bg:"#dcfce7", color:"#15803d", icon:"🌿" },
  "Kimyo":       { bg:"#fce7f3", color:"#9d174d", icon:"🧪" },
  "Ingliz tili": { bg:"#fef9c3", color:"#854d0e", icon:"🇬🇧" },
  "Jismoniy":    { bg:"#fee2e2", color:"#991b1b", icon:"⚽" },
  "Geografiya":  { bg:"#e0f2fe", color:"#075985", icon:"🌍" },
  "Musiqiy san\'at":{ bg:"#fdf4ff", color:"#7e22ce", icon:"🎵" },
  "Sinf soati":  { bg:"#f0fdf4", color:"#166534", icon:"🏫" },
};
const getSC = (sub) => SUBJECT_COLORS[sub] || { bg:"#f1f5f9", color:"#475569", icon:"📚" };

/* ═══════════════════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════════════════ */
const avatarColor = (name) => AVATAR_COLORS[(name||"").charCodeAt(0) % AVATAR_COLORS.length];
const initials    = (u) => u ? `${(u.first||"")[0]||""}${(u.last||"")[0]||""}`.toUpperCase() : "?";
const timeAgo = (dateStr) => {
  const d = new Date(dateStr), now = new Date(), diff = (now - d) / 1000;
  if (diff < 60)    return "Hozirgina";
  if (diff < 3600)  return `${Math.floor(diff/60)} daqiqa oldin`;
  if (diff < 86400) return `${Math.floor(diff/3600)} soat oldin`;
  return `${Math.floor(diff/86400)} kun oldin`;
};

/* ═══════════════════════════════════════════════════════════════
   REUSABLE PRIMITIVES
═══════════════════════════════════════════════════════════════ */
const Inp = ({ label, ...p }) => (
  <div style={{ marginBottom:16 }}>
    {label && <label style={{ display:"block", fontSize:12, fontWeight:600, color:C.td, marginBottom:5, letterSpacing:".3px" }}>{label}</label>}
    <input {...p} style={{ width:"100%", padding:"11px 14px", border:`1.5px solid ${C.gm}`, borderRadius:8, fontSize:14, color:C.td, background:C.gl, outline:"none", transition:".2s", ...p.style }}
      onFocus={e=>{ e.target.style.borderColor=C.bm; e.target.style.background="#fff"; e.target.style.boxShadow=`0 0 0 3px rgba(0,82,204,.1)`; }}
      onBlur={e =>{ e.target.style.borderColor=C.gm; e.target.style.background=C.gl;  e.target.style.boxShadow="none"; }}
    />
  </div>
);
const Tex = ({ label, ...p }) => (
  <div style={{ marginBottom:16 }}>
    {label && <label style={{ display:"block", fontSize:12, fontWeight:600, color:C.td, marginBottom:5 }}>{label}</label>}
    <textarea {...p} style={{ width:"100%", padding:"11px 14px", border:`1.5px solid ${C.gm}`, borderRadius:8, fontSize:14, color:C.td, background:C.gl, resize:"vertical", minHeight:90, outline:"none", transition:".2s", ...p.style }}
      onFocus={e=>{ e.target.style.borderColor=C.bm; e.target.style.background="#fff"; }}
      onBlur={e =>{ e.target.style.borderColor=C.gm; e.target.style.background=C.gl;  }}
    />
  </div>
);
const Sel = ({ label, children, ...p }) => (
  <div style={{ marginBottom:16 }}>
    {label && <label style={{ display:"block", fontSize:12, fontWeight:600, color:C.td, marginBottom:5 }}>{label}</label>}
    <select {...p} style={{ width:"100%", padding:"11px 14px", border:`1.5px solid ${C.gm}`, borderRadius:8, fontSize:14, color:C.td, background:C.gl, cursor:"pointer", outline:"none", ...p.style }}>{children}</select>
  </div>
);
const OkMsg = ({ show, children }) => show
  ? <div style={{ background:"linear-gradient(135deg,#ecfdf5,#d1fae5)", border:"1.5px solid #6ee7b7", borderRadius:8, padding:"12px 16px", fontSize:13, color:"#065f46", marginBottom:14, fontWeight:600, textAlign:"center" }}>{children}</div>
  : null;
const Card = ({ children, style }) => (
  <div style={{ background:"#fff", borderRadius:14, padding:24, boxShadow:`0 4px 24px rgba(0,48,135,.1)`, border:`1px solid ${C.gm}`, ...style }}>{children}</div>
);
const Btn = ({ children, variant="primary", small, style, ...p }) => {
  const vs = {
    primary:{ background:`linear-gradient(135deg,${C.bd},${C.bm})`, color:"#fff", border:"none", boxShadow:`0 3px 12px rgba(0,48,135,.3)` },
    success:{ background:"linear-gradient(135deg,#16a34a,#22c55e)", color:"#fff", border:"none", boxShadow:"0 3px 12px rgba(22,163,74,.3)" },
    danger: { background:"#fee2e2", color:"#dc2626", border:"1px solid #fca5a5" },
    ghost:  { background:"transparent", color:C.bm, border:`1.5px solid ${C.bm}` },
    gold:   { background:C.gold, color:C.bd, border:"none", boxShadow:`0 3px 12px rgba(245,166,35,.35)` },
  };
  return (
    <button {...p} style={{ ...vs[variant], padding:small?"6px 14px":"11px 22px", borderRadius:8, fontSize:small?12:14, fontWeight:700, cursor:"pointer", fontFamily:"'Exo 2',sans-serif", transition:".2s", ...style }}
      onMouseEnter={e=>e.currentTarget.style.opacity=".85"}
      onMouseLeave={e=>e.currentTarget.style.opacity="1"}
    >{children}</button>
  );
};
const Avatar = ({ user, size=36 }) => (
  <div style={{ width:size, height:size, borderRadius:"50%", background:avatarColor(user?.first||"A"), display:"flex", alignItems:"center", justifyContent:"center", fontSize:size*.38, fontWeight:700, color:"#fff", flexShrink:0, border:"2px solid rgba(255,255,255,.5)" }}>
    {initials(user)}
  </div>
);
const Badge = ({ cfg }) => cfg
  ? <span style={{ display:"inline-flex", alignItems:"center", gap:3, fontSize:10, fontWeight:700, padding:"2px 9px", borderRadius:20, background:cfg.bg, color:cfg.color }}>{cfg.icon||""} {cfg.label}</span>
  : null;

/* ═══════════════════════════════════════════════════════════════
   HEADER
═══════════════════════════════════════════════════════════════ */
const Header = ({ user, notifications, onLogin, onSignup, onProfile, onLogout, onAdminOpen, onNotifOpen, onScheduleOpen }) => {
  const [lang, setLang] = useState("UZ");
  const [ddOpen, setDdOpen] = useState(false);
  const ddRef = useRef();
  const unread = notifications.filter(n=>!n.read).length;

  useEffect(() => {
    const h = e => { if (ddRef.current && !ddRef.current.contains(e.target)) setDdOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  return (
    <header style={{ background:`linear-gradient(135deg,${C.bd} 0%,${C.bm} 60%,${C.bl} 100%)`, position:"sticky", top:0, zIndex:900, boxShadow:"0 2px 16px rgba(0,0,0,.25)" }}>
      <div style={{ background:"rgba(0,0,0,.15)", padding:"5px 0", fontSize:12, color:"rgba(255,255,255,.75)", borderBottom:"1px solid rgba(255,255,255,.1)" }}>
        <div style={{ maxWidth:1200, margin:"0 auto", padding:"0 24px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <span>📍 Toshkent shahar, O'zbekiston</span>
          <div style={{ display:"flex", gap:4 }}>
            {["UZ","RU","EN"].map(l=>(
              <button key={l} onClick={()=>setLang(l)} style={{ background:lang===l?"rgba(255,255,255,.2)":"none", border:"1px solid rgba(255,255,255,.3)", color:lang===l?"#fff":"rgba(255,255,255,.8)", padding:"2px 9px", borderRadius:3, cursor:"pointer", fontSize:11 }}>{l}</button>
            ))}
          </div>
        </div>
      </div>
      <div style={{ maxWidth:1200, margin:"0 auto", padding:"12px 24px", display:"flex", alignItems:"center", justifyContent:"space-between", gap:12, flexWrap:"wrap" }}>
        <a href="#" style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ width:48, height:48, background:"linear-gradient(135deg,#fff,#e8f0ff)", borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", fontSize:26, boxShadow:"0 2px 8px rgba(0,0,0,.2)", flexShrink:0 }}>🏫</div>
          <div>
            <div style={{ fontFamily:"'Exo 2',sans-serif", fontSize:19, fontWeight:800, color:"#fff", lineHeight:1.1 }}>MAKTAB PORTALI</div>
            <div style={{ fontSize:11, color:"rgba(255,255,255,.7)", letterSpacing:".4px" }}>Ta'lim muassasasi axborot tizimi</div>
          </div>
        </a>
        <nav style={{ display:"flex", gap:2 }}>
          {[["#news","Yangiliklar"],["#about","Maktab haqida"],["#services","Xizmatlar"],["#contact","Aloqa"]].map(([h,l])=>(
            <a key={h} href={h} style={{ color:"rgba(255,255,255,.9)", fontSize:13, fontWeight:500, padding:"7px 13px", borderRadius:6, transition:".2s" }}
              onMouseEnter={e=>e.target.style.background="rgba(255,255,255,.15)"}
              onMouseLeave={e=>e.target.style.background="none"}
            >{l}</a>
          ))}
          <button onClick={onScheduleOpen} style={{ color:"rgba(255,255,255,.9)", background:"rgba(255,255,255,.12)", border:"1px solid rgba(255,255,255,.25)", fontSize:13, fontWeight:600, padding:"7px 13px", borderRadius:6, cursor:"pointer", transition:".2s" }}
            onMouseEnter={e=>e.target.style.background="rgba(255,255,255,.22)"}
            onMouseLeave={e=>e.target.style.background="rgba(255,255,255,.12)"}
          >📅 Jadval</button>
        </nav>
        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
          {user ? (
            <>
              <button onClick={onNotifOpen} style={{ position:"relative", background:"rgba(255,255,255,.15)", border:"1px solid rgba(255,255,255,.3)", color:"#fff", width:38, height:38, borderRadius:8, cursor:"pointer", fontSize:18, display:"flex", alignItems:"center", justifyContent:"center" }}>
                🔔
                {unread>0 && <span style={{ position:"absolute", top:-4, right:-4, background:"#ef4444", color:"#fff", fontSize:9, fontWeight:700, borderRadius:"50%", width:16, height:16, display:"flex", alignItems:"center", justifyContent:"center", border:"2px solid #0052CC" }}>{unread}</span>}
              </button>
              <div ref={ddRef} style={{ position:"relative" }}>
                <button onClick={()=>setDdOpen(v=>!v)} style={{ display:"flex", alignItems:"center", gap:8, background:"rgba(255,255,255,.15)", border:"1px solid rgba(255,255,255,.3)", borderRadius:8, padding:"5px 12px 5px 6px", cursor:"pointer", color:"#fff" }}>
                  <Avatar user={user} size={28}/>
                  <span style={{ fontSize:13, fontWeight:600, fontFamily:"'Exo 2',sans-serif" }}>{user.first}</span>
                  <span style={{ fontSize:10 }}>{ddOpen?"▲":"▼"}</span>
                </button>
                {ddOpen && (
                  <div className="scale-in" style={{ position:"absolute", right:0, top:"calc(100% + 8px)", background:"#fff", borderRadius:12, boxShadow:"0 8px 32px rgba(0,0,0,.15)", minWidth:200, zIndex:999, overflow:"hidden", border:`1px solid ${C.gm}` }}>
                    <div style={{ padding:"13px 15px", borderBottom:`1px solid ${C.gm}`, background:C.gl }}>
                      <div style={{ fontWeight:700, fontSize:14, color:C.td }}>{user.first} {user.last}</div>
                      <div style={{ fontSize:12, color:C.gt }}>{user.email}</div>
                      <Badge cfg={ROLE_CFG[user.role]}/>
                    </div>
                    {[
                      ["👤 Profil", onProfile],
                      ...(user.role==="admin"?[["🛡️ Admin panel", onAdminOpen]]:[]),
                    ].map(([label,fn])=>(
                      <button key={label} onClick={()=>{ setDdOpen(false); fn(); }} style={{ width:"100%", padding:"11px 15px", background:"none", border:"none", cursor:"pointer", textAlign:"left", fontSize:13, fontWeight:500, color:C.td, transition:".15s" }}
                        onMouseEnter={e=>e.target.style.background=C.gl}
                        onMouseLeave={e=>e.target.style.background="none"}
                      >{label}</button>
                    ))}
                    <button onClick={()=>{ setDdOpen(false); onLogout(); }} style={{ width:"100%", padding:"11px 15px", background:"none", border:"none", borderTop:`1px solid ${C.gm}`, cursor:"pointer", textAlign:"left", fontSize:13, fontWeight:600, color:"#ef4444" }}
                      onMouseEnter={e=>e.target.style.background="#fff5f5"}
                      onMouseLeave={e=>e.target.style.background="none"}
                    >🚪 Chiqish</button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <button onClick={onLogin} style={{ background:"rgba(255,255,255,.15)", color:"#fff", border:"1px solid rgba(255,255,255,.4)", padding:"8px 18px", borderRadius:7, fontSize:13, fontWeight:600, cursor:"pointer" }}>Kirish</button>
              <Btn variant="gold" onClick={onSignup} style={{ padding:"8px 18px", fontSize:13 }}>Ro'yxatdan o'tish</Btn>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

/* ═══════════════════════════════════════════════════════════════
   HERO
═══════════════════════════════════════════════════════════════ */
const Hero = ({ user, onSignup }) => (
  <section style={{ background:`linear-gradient(135deg,${C.bd} 0%,#00317a 40%,#00509e 100%)`, padding:"64px 24px 80px", position:"relative", overflow:"hidden" }}>
    <div style={{ position:"absolute", top:-60, right:-60, width:400, height:400, background:"radial-gradient(circle,rgba(0,163,224,.15) 0%,transparent 70%)", borderRadius:"50%", pointerEvents:"none" }}/>
    <div style={{ maxWidth:1200, margin:"0 auto", display:"grid", gridTemplateColumns:"1fr 1fr", gap:48, alignItems:"center", position:"relative", zIndex:1 }} className="fade-up">
      <div>
        <h2 style={{ fontFamily:"'Exo 2',sans-serif", fontSize:40, fontWeight:800, color:"#fff", lineHeight:1.15, marginBottom:16 }}>
          Zamonaviy ta'lim<br/><span style={{ color:C.gold }}>— kelajak poydevori</span>
        </h2>
        <p style={{ color:"rgba(255,255,255,.75)", fontSize:16, lineHeight:1.7, marginBottom:32 }}>
          Maktab portali orqali o'quvchilar, o'qituvchilar va ota-onalar uchun barcha muhim ma'lumotlar bir joyda.
        </p>
        <div style={{ display:"flex", gap:14, flexWrap:"wrap" }}>
          {!user && <Btn variant="gold" onClick={onSignup} style={{ padding:"13px 30px", fontSize:15 }}>Ro'yxatdan o'ting</Btn>}
          <a href="#news" style={{ background:"rgba(255,255,255,.12)", color:"#fff", padding:"13px 30px", borderRadius:8, fontSize:15, fontWeight:600, border:"1px solid rgba(255,255,255,.3)", display:"inline-block" }}>Yangiliklar →</a>
        </div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14 }}>
        {[["1200+","O'quvchilar"],["85","O'qituvchilar"],["42","Sinflar"],["98%","Sifat"],["15+","Olimpiadachilar"],["2009","Tashkil yili"]].map(([n,l],i)=>(
          <div key={i} style={{ background:"rgba(255,255,255,.1)", border:"1px solid rgba(255,255,255,.15)", borderRadius:12, padding:"18px 12px", textAlign:"center", transition:".25s", cursor:"default" }}
            onMouseEnter={e=>{ e.currentTarget.style.background="rgba(255,255,255,.18)"; e.currentTarget.style.transform="translateY(-3px)"; }}
            onMouseLeave={e=>{ e.currentTarget.style.background="rgba(255,255,255,.1)";  e.currentTarget.style.transform="none"; }}
          >
            <div style={{ fontFamily:"'Exo 2',sans-serif", fontSize:28, fontWeight:800, color:C.gold }}>{n}</div>
            <div style={{ fontSize:11, color:"rgba(255,255,255,.7)", marginTop:4 }}>{l}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ═══════════════════════════════════════════════════════════════
   QUICK LINKS
═══════════════════════════════════════════════════════════════ */
const QuickLinks = ({ onQuickAction }) => (
  <section id="services" style={{ background:`linear-gradient(135deg,${C.bd},#00509e)`, padding:"48px 0" }}>
    <div style={{ maxWidth:1200, margin:"0 auto", padding:"0 24px" }}>
      <div style={{ fontFamily:"'Exo 2',sans-serif", fontSize:22, fontWeight:700, color:"#fff", marginBottom:24, textAlign:"center" }}>Tezkor havolalar</div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14 }}>
        {[["📊","Elektron jurnal","Baholar va davomatlar"],["📅","Dars jadvali","Haftalik jadval"],["📚","Kutubxona","Elektron darsliklar"],["💬","Xabarlar","O'qituvchi bilan aloqa"]].map(([ic,l,d],i)=>(
          <div key={i} onClick={()=>onQuickAction(i)} style={{ background:"rgba(255,255,255,.1)", border:"1px solid rgba(255,255,255,.2)", borderRadius:12, padding:"22px 14px", textAlign:"center", cursor:"pointer", transition:".25s" }}
            onMouseEnter={e=>{ e.currentTarget.style.background="rgba(255,255,255,.2)"; e.currentTarget.style.transform="translateY(-3px)"; }}
            onMouseLeave={e=>{ e.currentTarget.style.background="rgba(255,255,255,.1)"; e.currentTarget.style.transform="none"; }}
          >
            <div style={{ fontSize:34, marginBottom:10 }}>{ic}</div>
            <div style={{ color:"#fff", fontSize:14, fontWeight:600, fontFamily:"'Exo 2',sans-serif" }}>{l}</div>
            <div style={{ color:"rgba(255,255,255,.6)", fontSize:11, marginTop:3 }}>{d}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ═══════════════════════════════════════════════════════════════
   NEWS CARD
═══════════════════════════════════════════════════════════════ */
const NewsCard = ({ item, index, user, onLike, onBookmark, onOpen, bookmarks }) => {
  const cat = CAT_CFG[item.cat]||CAT_CFG.yangilik;
  const liked      = user && item.likes.includes(user.email);
  const bookmarked = user && bookmarks.includes(item.id);
  const [heartAnim, setHeartAnim] = useState(false);

  const handleLike = (e) => {
    e.stopPropagation();
    if (!user) return;
    if (!liked) { setHeartAnim(true); setTimeout(()=>setHeartAnim(false),400); }
    onLike(item.id);
  };

  return (
    <div style={{ background:"#fff", borderRadius:14, overflow:"hidden", boxShadow:`0 4px 20px rgba(0,48,135,.1)`, transition:".25s", border:`1px solid ${C.gm}`, display:"flex", flexDirection:"column" }}
      onMouseEnter={e=>{ e.currentTarget.style.boxShadow=`0 8px 36px rgba(0,48,135,.18)`; e.currentTarget.style.transform="translateY(-4px)"; }}
      onMouseLeave={e=>{ e.currentTarget.style.boxShadow=`0 4px 20px rgba(0,48,135,.1)`;  e.currentTarget.style.transform="none"; }}
    >
      <div onClick={()=>onOpen(item)} style={{ height:176, background:GRADS[index%GRADS.length], display:"flex", alignItems:"center", justifyContent:"center", fontSize:50, position:"relative", cursor:"pointer" }}>
        {item.emoji}
        <span style={{ position:"absolute", top:10, left:10, background:C.gold, color:C.bd, fontSize:10, fontWeight:700, padding:"3px 10px", borderRadius:20 }}>{cat.label}</span>
        <span style={{ position:"absolute", top:10, right:10, background:"rgba(0,0,0,.35)", color:"#fff", fontSize:10, padding:"3px 8px", borderRadius:20 }}>👁 {item.views}</span>
      </div>
      <div onClick={()=>onOpen(item)} style={{ padding:"16px 16px 10px", flex:1, cursor:"pointer" }}>
        <div style={{ fontSize:11, color:C.gt, marginBottom:6 }}>📅 {item.date}</div>
        <div style={{ fontFamily:"'Exo 2',sans-serif", fontSize:15, fontWeight:700, color:C.td, lineHeight:1.4, marginBottom:7 }}>{item.title}</div>
        <div style={{ fontSize:13, color:C.gt, lineHeight:1.6 }}>{item.body.substring(0,100)}...</div>
      </div>
      <div style={{ padding:"10px 16px 14px", display:"flex", alignItems:"center", gap:6, borderTop:`1px solid ${C.gm}` }}>
        <button onClick={handleLike} className={heartAnim?"heart-pulse":""} style={{ display:"flex", alignItems:"center", gap:5, background:liked?"#fee2e2":"transparent", border:liked?"1px solid #fca5a5":`1px solid ${C.gm}`, color:liked?"#ef4444":C.gt, padding:"5px 11px", borderRadius:20, cursor:user?"pointer":"not-allowed", fontSize:12, fontWeight:600, transition:".2s" }}
          title={!user?"Layk bosish uchun kiring":""}
        >{liked?"❤️":"🤍"} {item.likes.length}</button>
        <button onClick={e=>{ e.stopPropagation(); onOpen(item); }} style={{ display:"flex", alignItems:"center", gap:5, background:"transparent", border:`1px solid ${C.gm}`, color:C.gt, padding:"5px 11px", borderRadius:20, cursor:"pointer", fontSize:12, fontWeight:600 }}>
          💬 {item.comments.length}
        </button>
        <div style={{ flex:1 }}/>
        <button onClick={e=>{ e.stopPropagation(); user&&onBookmark(item.id); }} style={{ background:bookmarked?"#fef3c7":"transparent", border:bookmarked?"1px solid #fde68a":`1px solid ${C.gm}`, color:bookmarked?"#d97706":C.gt, padding:"5px 10px", borderRadius:20, cursor:user?"pointer":"not-allowed", fontSize:13, transition:".2s" }}
          title={!user?"Saqlash uchun kiring":""}
        >{bookmarked?"🔖":"🏷️"}</button>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   NEWS DETAIL MODAL
═══════════════════════════════════════════════════════════════ */
const NewsModal = ({ item, user, onClose, onLike, onBookmark, onAddComment, bookmarks }) => {
  const [comment, setComment] = useState("");
  if (!item) return null;
  const liked      = user && item.likes.includes(user.email);
  const bookmarked = user && bookmarks.includes(item.id);
  const cat = CAT_CFG[item.cat]||CAT_CFG.yangilik;

  const submit = () => {
    if (!comment.trim()||!user) return;
    onAddComment(item.id, comment.trim());
    setComment("");
  };

  return (
    <div onClick={e=>e.target===e.currentTarget&&onClose()} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.6)", zIndex:1100, display:"flex", alignItems:"center", justifyContent:"center", backdropFilter:"blur(4px)", padding:16 }}>
      <div className="scale-in" style={{ background:"#fff", borderRadius:18, width:"100%", maxWidth:640, maxHeight:"90vh", overflow:"hidden", display:"flex", flexDirection:"column", boxShadow:"0 24px 80px rgba(0,0,0,.3)" }}>
        <div style={{ height:200, background:GRADS[item.id%GRADS.length], display:"flex", alignItems:"center", justifyContent:"center", fontSize:64, position:"relative", flexShrink:0 }}>
          {item.emoji}
          <button onClick={onClose} style={{ position:"absolute", top:12, right:12, background:"rgba(0,0,0,.4)", border:"none", width:32, height:32, borderRadius:"50%", color:"#fff", cursor:"pointer", fontSize:16 }}>✕</button>
          <span style={{ position:"absolute", top:12, left:12, background:C.gold, color:C.bd, fontSize:11, fontWeight:700, padding:"3px 12px", borderRadius:20 }}>{cat.label}</span>
        </div>
        <div style={{ overflowY:"auto", padding:28, flex:1 }}>
          <div style={{ fontSize:12, color:C.gt, marginBottom:8 }}>📅 {item.date} · 👁 {item.views} ko'rish</div>
          <h2 style={{ fontFamily:"'Exo 2',sans-serif", fontSize:22, fontWeight:800, color:C.td, marginBottom:14, lineHeight:1.35 }}>{item.title}</h2>
          <p style={{ fontSize:15, color:"#334155", lineHeight:1.8, marginBottom:20 }}>{item.body}</p>
          <div style={{ display:"flex", gap:10, marginBottom:24 }}>
            <button onClick={()=>user&&onLike(item.id)} style={{ display:"flex", alignItems:"center", gap:6, background:liked?"#fee2e2":"transparent", border:liked?"1px solid #fca5a5":`1.5px solid ${C.gm}`, color:liked?"#ef4444":C.gt, padding:"8px 18px", borderRadius:22, cursor:user?"pointer":"not-allowed", fontSize:13, fontWeight:600 }}>
              {liked?"❤️":"🤍"} {item.likes.length} Layk
            </button>
            <button onClick={()=>user&&onBookmark(item.id)} style={{ display:"flex", alignItems:"center", gap:6, background:bookmarked?"#fef3c7":"transparent", border:bookmarked?"1px solid #fde68a":`1.5px solid ${C.gm}`, color:bookmarked?"#d97706":C.gt, padding:"8px 18px", borderRadius:22, cursor:user?"pointer":"not-allowed", fontSize:13, fontWeight:600 }}>
              {bookmarked?"🔖":"🏷️"} Saqlash
            </button>
          </div>
          <div style={{ fontFamily:"'Exo 2',sans-serif", fontWeight:700, fontSize:16, color:C.td, marginBottom:14 }}>💬 Izohlar ({item.comments.length})</div>
          {item.comments.length===0 && <p style={{ color:C.gt, fontSize:13, marginBottom:14 }}>Hali izoh yo'q. Birinchi bo'ling!</p>}
          {item.comments.map((c,i)=>(
            <div key={i} style={{ display:"flex", gap:10, marginBottom:14 }}>
              <Avatar user={c.user} size={34}/>
              <div style={{ background:C.gl, borderRadius:10, padding:"10px 14px", flex:1 }}>
                <div style={{ fontWeight:600, fontSize:13, color:C.td, marginBottom:3 }}>{c.user.first} {c.user.last} <span style={{ fontWeight:400, color:C.gt, fontSize:11 }}>· {timeAgo(c.date)}</span></div>
                <div style={{ fontSize:13, color:"#334155" }}>{c.text}</div>
              </div>
            </div>
          ))}
          {user ? (
            <div style={{ display:"flex", gap:10, marginTop:14 }}>
              <Avatar user={user} size={34}/>
              <div style={{ flex:1, display:"flex", gap:8 }}>
                <input value={comment} onChange={e=>setComment(e.target.value)} onKeyDown={e=>e.key==="Enter"&&submit()} placeholder="Izoh yozing..." style={{ flex:1, padding:"10px 14px", border:`1.5px solid ${C.gm}`, borderRadius:10, fontSize:13, outline:"none", background:C.gl }}
                  onFocus={e=>{ e.target.style.borderColor=C.bm; e.target.style.background="#fff"; }}
                  onBlur={e =>{ e.target.style.borderColor=C.gm; e.target.style.background=C.gl; }}
                />
                <Btn onClick={submit} style={{ padding:"10px 16px", fontSize:13 }}>Yuborish</Btn>
              </div>
            </div>
          ) : (
            <div style={{ background:C.gl, borderRadius:10, padding:"12px 16px", fontSize:13, color:C.gt, textAlign:"center" }}>Izoh qoldirish uchun <strong style={{ color:C.bm }}>tizimga kiring</strong></div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   NEWS SECTION
═══════════════════════════════════════════════════════════════ */
const NewsSection = ({ news, user, onLike, onBookmark, onComment, onView, bookmarks }) => {
  const [active, setActive] = useState(null);
  const [filter, setFilter] = useState("barchasi");

  const filtered = filter==="barchasi" ? news : news.filter(n=>n.cat===filter);

  const openNews = (item) => {
    onView(item.id);
    setActive(item);
  };

  return (
    <section id="news" style={{ maxWidth:1200, margin:"0 auto", padding:"60px 24px" }}>
      <div style={{ fontFamily:"'Exo 2',sans-serif", fontSize:28, fontWeight:700, color:C.bd, marginBottom:6 }}>So'nggi yangiliklar</div>
      <div style={{ color:C.gt, fontSize:14, marginBottom:10 }}>Maktab hayotidagi muhim voqealar va e'lonlar</div>
      <div style={{ width:52, height:4, background:`linear-gradient(90deg,${C.bm},${C.ba})`, borderRadius:2, marginBottom:26 }}/>
      <div style={{ display:"flex", gap:8, marginBottom:26, flexWrap:"wrap" }}>
        {[["barchasi","Barchasi","🗂️"],["yangilik","Yangiliklar","📰"],["elon","E'lonlar","📢"],["tadbir","Tadbirlar","🎭"]].map(([v,l,ic])=>(
          <button key={v} onClick={()=>setFilter(v)} style={{ background:filter===v?C.bm:"#fff", color:filter===v?"#fff":C.gt, border:`1.5px solid ${filter===v?C.bm:C.gm}`, padding:"7px 16px", borderRadius:22, fontSize:13, fontWeight:600, cursor:"pointer", transition:".2s" }}>
            {ic} {l}
          </button>
        ))}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:22 }}>
        {filtered.map((item,i)=>(
          <NewsCard key={item.id} item={item} index={i} user={user} onLike={onLike} onBookmark={onBookmark} onOpen={openNews} bookmarks={bookmarks}/>
        ))}
      </div>
      {active && (
        <NewsModal
          item={news.find(n=>n.id===active.id)||active}
          user={user}
          onClose={()=>setActive(null)}
          onLike={id=>{ onLike(id); setActive(news.find(n=>n.id===id)||active); }}
          onBookmark={onBookmark}
          onAddComment={(id,text)=>{ onComment(id,text); setActive(news.find(n=>n.id===id)||active); }}
          bookmarks={bookmarks}
        />
      )}
    </section>
  );
};

/* ═══════════════════════════════════════════════════════════════
   PROFILE PAGE
═══════════════════════════════════════════════════════════════ */
const ProfilePage = ({ user, news, bookmarks, onUpdateUser, onClose }) => {
  const [tab,      setTab]      = useState("info");
  const [editMode, setEditMode] = useState(false);
  const [form,     setForm]     = useState({ first:user.first, last:user.last, email:user.email, phone:user.phone||"", bio:user.bio||"", school:user.school||"", grade:user.grade||"" });
  const [pwForm,   setPwForm]   = useState({ old:"", newP:"", conf:"" });
  const [ok,       setOk]       = useState("");
  const [err,      setErr]      = useState("");

  const savedNews    = news.filter(n=>bookmarks.includes(n.id));
  const likedNews    = news.filter(n=>n.likes.includes(user.email));
  const myComments   = news.flatMap(n=>n.comments.filter(c=>c.user.email===user.email).map(c=>({ ...c, newsTitle:n.title })));

  const saveInfo = () => {
    if (!form.first||!form.last||!form.email) return setErr("Asosiy maydonlarni to'ldiring.");
    onUpdateUser({ ...user, ...form });
    setEditMode(false); setErr("");
    setOk("✅ Ma'lumotlar saqlandi!"); setTimeout(()=>setOk(""),3000);
  };
  const changePw = () => {
    setErr("");
    if (!pwForm.old||!pwForm.newP) return setErr("Barcha maydonlarni to'ldiring.");
    if (pwForm.old!==user.pass)    return setErr("Eski parol noto'g'ri!");
    if (pwForm.newP.length<6)      return setErr("Yangi parol kamida 6 ta belgi.");
    if (pwForm.newP!==pwForm.conf) return setErr("Parollar mos emas!");
    onUpdateUser({ ...user, pass:pwForm.newP });
    setPwForm({ old:"", newP:"", conf:"" });
    setOk("✅ Parol o'zgartirildi!"); setTimeout(()=>setOk(""),3000);
  };

  const TABS = [["info","👤 Ma'lumotlar"],["activity","📊 Faollik"],["saved","🔖 Saqlangan"],["liked","❤️ Yoqtirilgan"],["comments","💬 Izohlarim"],["security","🔒 Xavfsizlik"]];

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.55)", zIndex:1000, display:"flex", alignItems:"flex-start", justifyContent:"center", backdropFilter:"blur(4px)", overflowY:"auto", padding:"32px 16px" }}>
      <div className="scale-in" style={{ background:"#fff", borderRadius:20, width:"100%", maxWidth:880, boxShadow:"0 24px 80px rgba(0,0,0,.25)", overflow:"hidden", marginBottom:32 }}>
        {/* Banner */}
        <div style={{ background:`linear-gradient(135deg,${C.bd},${C.bm})`, padding:"28px 28px 0", position:"relative" }}>
          <button onClick={onClose} style={{ position:"absolute", top:14, right:14, background:"rgba(255,255,255,.2)", border:"none", color:"#fff", width:32, height:32, borderRadius:"50%", cursor:"pointer", fontSize:16 }}>✕</button>
          <div style={{ display:"flex", alignItems:"flex-end", gap:18, flexWrap:"wrap" }}>
            <div style={{ width:78, height:78, borderRadius:"50%", background:avatarColor(user.first), display:"flex", alignItems:"center", justifyContent:"center", fontSize:30, fontWeight:700, color:"#fff", border:"4px solid rgba(255,255,255,.3)", flexShrink:0 }}>{initials(user)}</div>
            <div style={{ paddingBottom:14 }}>
              <div style={{ fontFamily:"'Exo 2',sans-serif", fontSize:22, fontWeight:800, color:"#fff" }}>{user.first} {user.last}</div>
              <div style={{ fontSize:13, color:"rgba(255,255,255,.7)", marginTop:2 }}>{user.email}</div>
              <Badge cfg={ROLE_CFG[user.role]}/>
            </div>
            <div style={{ flex:1 }}/>
            <div style={{ display:"flex", gap:22, paddingBottom:14, flexWrap:"wrap" }}>
              {[["❤️",likedNews.length,"Yoqtirish"],["💬",myComments.length,"Izoh"],["🔖",savedNews.length,"Saqlangan"]].map(([ic,n,l])=>(
                <div key={l} style={{ textAlign:"center" }}>
                  <div style={{ fontFamily:"'Exo 2',sans-serif", fontSize:20, fontWeight:800, color:C.gold }}>{ic} {n}</div>
                  <div style={{ fontSize:11, color:"rgba(255,255,255,.6)" }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display:"flex", gap:0, marginTop:8, borderTop:"1px solid rgba(255,255,255,.15)", flexWrap:"wrap" }}>
            {TABS.map(([v,l])=>(
              <button key={v} onClick={()=>setTab(v)} style={{ background:"none", border:"none", color:tab===v?"#fff":"rgba(255,255,255,.55)", padding:"12px 15px", fontSize:13, fontWeight:tab===v?700:500, cursor:"pointer", borderBottom:tab===v?`3px solid ${C.gold}`:"3px solid transparent", transition:".2s" }}>{l}</button>
            ))}
          </div>
        </div>

        <div style={{ padding:28 }}>
          <OkMsg show={!!ok}>{ok}</OkMsg>
          {err && <div style={{ background:"#fee2e2", border:"1.5px solid #fca5a5", borderRadius:8, padding:"10px 14px", fontSize:13, color:"#dc2626", marginBottom:14, fontWeight:600 }}>⚠️ {err}</div>}

          {/* INFO */}
          {tab==="info" && (
            <div>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18 }}>
                <div style={{ fontFamily:"'Exo 2',sans-serif", fontSize:18, fontWeight:700, color:C.td }}>Shaxsiy ma'lumotlar</div>
                <Btn variant={editMode?"ghost":"primary"} small onClick={()=>{ setEditMode(v=>!v); setErr(""); }}>
                  {editMode?"❌ Bekor qilish":"✏️ Tahrirlash"}
                </Btn>
              </div>
              {editMode ? (
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 20px" }}>
                  <Inp label="ISM"      value={form.first}  onChange={e=>setForm(f=>({...f,first:e.target.value}))}/>
                  <Inp label="FAMILIYA" value={form.last}   onChange={e=>setForm(f=>({...f,last:e.target.value}))}/>
                  <Inp label="EMAIL" type="email" value={form.email}  onChange={e=>setForm(f=>({...f,email:e.target.value}))}/>
                  <Inp label="TELEFON"  value={form.phone}  onChange={e=>setForm(f=>({...f,phone:e.target.value}))} placeholder="+998 90 123 45 67"/>
                  <Inp label="MAKTAB"   value={form.school} onChange={e=>setForm(f=>({...f,school:e.target.value}))} placeholder="Maktab nomi"/>
                  <Inp label="SINF"     value={form.grade}  onChange={e=>setForm(f=>({...f,grade:e.target.value}))} placeholder="9-A"/>
                  <div style={{ gridColumn:"1/-1" }}>
                    <Tex label="BIO" value={form.bio} onChange={e=>setForm(f=>({...f,bio:e.target.value}))} placeholder="O'zingiz haqida..." style={{ minHeight:80 }}/>
                  </div>
                  <div style={{ gridColumn:"1/-1" }}><Btn onClick={saveInfo}>💾 Saqlash</Btn></div>
                </div>
              ) : (
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                  {[["👤 Ism","first"],["👥 Familiya","last"],["✉️ Email","email"],["📞 Telefon","phone"],["🏫 Maktab","school"],["📚 Sinf","grade"]].map(([l,k])=>(
                    <div key={k} style={{ background:C.gl, borderRadius:10, padding:"13px 15px" }}>
                      <div style={{ fontSize:11, color:C.gt, marginBottom:3 }}>{l}</div>
                      <div style={{ fontSize:14, fontWeight:600, color:C.td }}>{user[k]||<span style={{ color:C.gt, fontStyle:"italic" }}>Ko'rsatilmagan</span>}</div>
                    </div>
                  ))}
                  {user.bio && (
                    <div style={{ gridColumn:"1/-1", background:C.gl, borderRadius:10, padding:"13px 15px" }}>
                      <div style={{ fontSize:11, color:C.gt, marginBottom:3 }}>📝 Bio</div>
                      <div style={{ fontSize:14, color:C.td }}>{user.bio}</div>
                    </div>
                  )}
                  <div style={{ background:C.gl, borderRadius:10, padding:"13px 15px" }}>
                    <div style={{ fontSize:11, color:C.gt, marginBottom:3 }}>📅 Ro'yxat sanasi</div>
                    <div style={{ fontSize:14, fontWeight:600, color:C.td }}>{user.date}</div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ACTIVITY */}
          {tab==="activity" && (
            <div>
              <div style={{ fontFamily:"'Exo 2',sans-serif", fontSize:18, fontWeight:700, color:C.td, marginBottom:18 }}>Faollik statistikasi</div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14, marginBottom:22 }}>
                {[["❤️",likedNews.length,"Yoqtirish","#fee2e2","#ef4444"],["💬",myComments.length,"Izoh","#dbeafe","#1d4ed8"],["🔖",savedNews.length,"Saqlangan","#fef3c7","#d97706"]].map(([ic,n,l,bg,cl])=>(
                  <div key={l} style={{ background:bg, borderRadius:12, padding:18, textAlign:"center" }}>
                    <div style={{ fontSize:34, marginBottom:4 }}>{ic}</div>
                    <div style={{ fontFamily:"'Exo 2',sans-serif", fontSize:26, fontWeight:800, color:cl }}>{n}</div>
                    <div style={{ fontSize:13, color:cl, fontWeight:600 }}>{l}</div>
                  </div>
                ))}
              </div>
              <div style={{ background:C.gl, borderRadius:12, padding:18 }}>
                <div style={{ fontWeight:700, fontSize:14, color:C.td, marginBottom:12 }}>So'nggi faolliklar</div>
                {[...likedNews.map(n=>({ type:"like", date:n.date, text:`"${n.title.substring(0,35)}..." ga layk bosdingiz` })),
                  ...myComments.map(c=>({ type:"comment", date:c.date, text:`"${c.newsTitle.substring(0,35)}..." ga izoh yozdingiz` }))
                ].sort((a,b)=>new Date(b.date)-new Date(a.date)).slice(0,8).map((a,i)=>(
                  <div key={i} style={{ display:"flex", gap:12, alignItems:"center", padding:"9px 0", borderBottom:i<7?`1px solid ${C.gm}`:"none" }}>
                    <span style={{ fontSize:18 }}>{a.type==="like"?"❤️":"💬"}</span>
                    <div style={{ flex:1, fontSize:13, color:C.td }}>{a.text}</div>
                    <span style={{ fontSize:11, color:C.gt, whiteSpace:"nowrap" }}>{a.date}</span>
                  </div>
                ))}
                {likedNews.length===0&&myComments.length===0&&<p style={{ color:C.gt, fontSize:13, textAlign:"center" }}>Hali hech qanday faollik yo'q</p>}
              </div>
            </div>
          )}

          {/* SAVED */}
          {tab==="saved" && (
            <div>
              <div style={{ fontFamily:"'Exo 2',sans-serif", fontSize:18, fontWeight:700, color:C.td, marginBottom:18 }}>🔖 Saqlangan yangiliklar ({savedNews.length})</div>
              {savedNews.length===0
                ? <div style={{ textAlign:"center", padding:"40px 0", color:C.gt }}><div style={{ fontSize:48, marginBottom:12 }}>🏷️</div>Hali saqlangan yangiliklaringiz yo'q</div>
                : <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                    {savedNews.map((n,i)=>(
                      <div key={n.id} style={{ display:"flex", gap:14, background:C.gl, borderRadius:12, padding:14, border:`1px solid ${C.gm}` }}>
                        <div style={{ width:52, height:52, borderRadius:10, background:GRADS[i%GRADS.length], display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, flexShrink:0 }}>{n.emoji}</div>
                        <div style={{ flex:1 }}>
                          <div style={{ fontWeight:700, fontSize:14, color:C.td, marginBottom:3 }}>{n.title}</div>
                          <div style={{ fontSize:12, color:C.gt }}>{n.body.substring(0,80)}...</div>
                          <div style={{ fontSize:11, color:C.gt, marginTop:5 }}>📅 {n.date} · ❤️ {n.likes.length} · 💬 {n.comments.length}</div>
                        </div>
                        <Badge cfg={CAT_CFG[n.cat]}/>
                      </div>
                    ))}
                  </div>}
            </div>
          )}

          {/* LIKED */}
          {tab==="liked" && (
            <div>
              <div style={{ fontFamily:"'Exo 2',sans-serif", fontSize:18, fontWeight:700, color:C.td, marginBottom:18 }}>❤️ Yoqtirgan yangiliklar ({likedNews.length})</div>
              {likedNews.length===0
                ? <div style={{ textAlign:"center", padding:"40px 0", color:C.gt }}><div style={{ fontSize:48, marginBottom:12 }}>🤍</div>Hali yoqtirgan yangiliklaringiz yo'q</div>
                : <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                    {likedNews.map((n,i)=>(
                      <div key={n.id} style={{ display:"flex", gap:14, background:"#fff5f5", borderRadius:12, padding:14, border:"1px solid #fca5a5" }}>
                        <div style={{ width:52, height:52, borderRadius:10, background:GRADS[i%GRADS.length], display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, flexShrink:0 }}>{n.emoji}</div>
                        <div style={{ flex:1 }}>
                          <div style={{ fontWeight:700, fontSize:14, color:C.td, marginBottom:3 }}>{n.title}</div>
                          <div style={{ fontSize:12, color:C.gt }}>{n.body.substring(0,80)}...</div>
                          <div style={{ fontSize:11, color:C.gt, marginTop:5 }}>📅 {n.date} · ❤️ {n.likes.length}</div>
                        </div>
                      </div>
                    ))}
                  </div>}
            </div>
          )}

          {/* COMMENTS */}
          {tab==="comments" && (
            <div>
              <div style={{ fontFamily:"'Exo 2',sans-serif", fontSize:18, fontWeight:700, color:C.td, marginBottom:18 }}>💬 Mening izohlarim ({myComments.length})</div>
              {myComments.length===0
                ? <div style={{ textAlign:"center", padding:"40px 0", color:C.gt }}><div style={{ fontSize:48, marginBottom:12 }}>💬</div>Hali izoh yozmadingiz</div>
                : <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                    {myComments.map((c,i)=>(
                      <div key={i} style={{ background:C.gl, borderRadius:12, padding:14, border:`1px solid ${C.gm}` }}>
                        <div style={{ fontSize:11, color:C.bm, fontWeight:600, marginBottom:6 }}>📰 {c.newsTitle}</div>
                        <div style={{ fontSize:14, color:C.td, marginBottom:5 }}>{c.text}</div>
                        <div style={{ fontSize:11, color:C.gt }}>{timeAgo(c.date)}</div>
                      </div>
                    ))}
                  </div>}
            </div>
          )}

          {/* SECURITY */}
          {tab==="security" && (
            <div style={{ maxWidth:440 }}>
              <div style={{ fontFamily:"'Exo 2',sans-serif", fontSize:18, fontWeight:700, color:C.td, marginBottom:18 }}>🔒 Parolni o'zgartirish</div>
              <Inp label="ESKI PAROL" type="password" value={pwForm.old} onChange={e=>setPwForm(f=>({...f,old:e.target.value}))} placeholder="••••••••"/>
              <Inp label="YANGI PAROL" type="password" value={pwForm.newP} onChange={e=>setPwForm(f=>({...f,newP:e.target.value}))} placeholder="Kamida 6 belgi"/>
              <Inp label="TASDIQLANG" type="password" value={pwForm.conf} onChange={e=>setPwForm(f=>({...f,conf:e.target.value}))} placeholder="Qayta kiriting"/>
              <Btn onClick={changePw}>🔒 Parolni yangilash</Btn>
              <div style={{ marginTop:20, background:"#fef3c7", border:"1px solid #fde68a", borderRadius:10, padding:"13px 15px", fontSize:13, color:"#92400e" }}>
                ⚠️ <strong>Eslatma:</strong> Parolingizni hech kim bilan ulashmang.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   NOTIFICATIONS PANEL
═══════════════════════════════════════════════════════════════ */
const NotifPanel = ({ notifications, onRead, onClose }) => (
  <div onClick={e=>e.target===e.currentTarget&&onClose()} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.4)", zIndex:1200, display:"flex", justifyContent:"flex-end" }}>
    <div className="slide-in" style={{ background:"#fff", width:360, height:"100%", boxShadow:"-8px 0 40px rgba(0,0,0,.15)", display:"flex", flexDirection:"column" }}>
      <div style={{ background:`linear-gradient(135deg,${C.bd},${C.bm})`, padding:"18px 18px 15px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ fontFamily:"'Exo 2',sans-serif", fontSize:16, fontWeight:700, color:"#fff" }}>🔔 Bildirishnomalar</div>
        <button onClick={onClose} style={{ background:"rgba(255,255,255,.2)", border:"none", color:"#fff", width:30, height:30, borderRadius:"50%", cursor:"pointer", fontSize:16 }}>✕</button>
      </div>
      <div style={{ flex:1, overflowY:"auto" }}>
        {notifications.length===0
          ? <div style={{ textAlign:"center", padding:"40px 20px", color:C.gt }}><div style={{ fontSize:42, marginBottom:10 }}>🔕</div>Bildirishnomalar yo'q</div>
          : notifications.map((n,i)=>(
            <div key={i} onClick={()=>onRead(i)} style={{ padding:"13px 16px", borderBottom:`1px solid ${C.gm}`, background:n.read?"#fff":C.gl, cursor:"pointer", transition:".15s" }}
              onMouseEnter={e=>e.currentTarget.style.background="#f0f5ff"}
              onMouseLeave={e=>e.currentTarget.style.background=n.read?"#fff":C.gl}
            >
              <div style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
                <span style={{ fontSize:20 }}>{n.icon||"🔔"}</span>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, fontWeight:n.read?500:700, color:C.td, marginBottom:2 }}>{n.text}</div>
                  <div style={{ fontSize:11, color:C.gt }}>{n.time}</div>
                </div>
                {!n.read && <span style={{ width:8, height:8, borderRadius:"50%", background:C.bm, display:"block", marginTop:4, flexShrink:0 }}/>}
              </div>
            </div>
          ))
        }
      </div>
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════════════════
   AUTH MODAL
═══════════════════════════════════════════════════════════════ */
const AuthModal = ({ open, tab, users, onClose, onSwitch, onLoginOk, onAddUser }) => {
  const [u, setU] = useState(""); const [p, setP] = useState("");
  const [f, setF] = useState(""); const [l, setL] = useState("");
  const [em, setEm] = useState(""); const [pw, setPw] = useState("");
  const [role, setRole] = useState("student");
  const [ok,  setOk]  = useState(false);
  const [err, setErr] = useState("");

  if (!open) return null;

  const login = () => {
    setErr("");
    if (!u||!p) return setErr("Login va parolni kiriting.");
    if (u==="admin"&&p==="admin123") {
      setOk(true);
      const adm = { first:"Admin", last:"", email:"admin@maktab.uz", pass:"admin123", role:"admin", date:new Date().toLocaleDateString("uz-UZ"), phone:"", bio:"", school:"", grade:"" };
      setTimeout(()=>{ setOk(false); onClose(); onLoginOk(adm); }, 800);
      return;
    }
    const found = users.find(x=>(x.email===u||`${x.first} ${x.last}`===u)&&x.pass===p);
    if (!found) return setErr("Login yoki parol noto'g'ri!");
    setOk(true); setTimeout(()=>{ setOk(false); onClose(); onLoginOk(found); }, 800);
  };

  const signup = () => {
    setErr("");
    if (!f||!l||!em||!pw) return setErr("Barcha maydonlarni to'ldiring.");
    if (pw.length<6) return setErr("Parol kamida 6 ta belgi.");
    if (users.find(x=>x.email===em)) return setErr("Bu email allaqachon ro'yxatdan o'tgan!");
    const nu = { first:f, last:l, email:em, pass:pw, role, date:new Date().toLocaleDateString("uz-UZ"), phone:"", bio:"", school:"", grade:"" };
    onAddUser(nu);
    setOk(true); setTimeout(()=>{ setOk(false); onSwitch("login"); }, 1200);
    setF(""); setL(""); setEm(""); setPw(""); setRole("student");
  };

  return (
    <div onClick={e=>e.target===e.currentTarget&&onClose()} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.55)", zIndex:1050, display:"flex", alignItems:"center", justifyContent:"center", backdropFilter:"blur(4px)", padding:16 }}>
      <div className="scale-in" style={{ background:"#fff", borderRadius:18, width:"100%", maxWidth:440, padding:34, position:"relative", boxShadow:"0 24px 80px rgba(0,0,0,.3)" }}>
        <button onClick={onClose} style={{ position:"absolute", top:13, right:13, background:C.gl, border:"none", width:30, height:30, borderRadius:"50%", fontSize:15, cursor:"pointer", color:C.gt }}>✕</button>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:20 }}>
          <div style={{ width:34, height:34, background:`linear-gradient(135deg,${C.bd},${C.ba})`, borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", fontSize:17 }}>🏫</div>
          <span style={{ fontFamily:"'Exo 2',sans-serif", fontSize:15, fontWeight:700, color:C.bd }}>Maktab Portali</span>
        </div>
        <div style={{ display:"flex", background:C.gl, borderRadius:10, padding:4, gap:4, marginBottom:22 }}>
          {["login","signup"].map(t=>(
            <button key={t} onClick={()=>{ onSwitch(t); setErr(""); }} style={{ flex:1, padding:9, border:"none", borderRadius:7, fontSize:13, fontWeight:600, cursor:"pointer", transition:".2s", background:tab===t?"#fff":"none", color:tab===t?C.bd:C.gt, boxShadow:tab===t?"0 2px 8px rgba(0,0,0,.1)":"none" }}>
              {t==="login"?"Kirish":"Ro'yxatdan o'tish"}
            </button>
          ))}
        </div>
        {err && <div style={{ background:"#fee2e2", border:"1.5px solid #fca5a5", borderRadius:8, padding:"9px 13px", fontSize:13, color:"#dc2626", marginBottom:12, fontWeight:600 }}>⚠️ {err}</div>}
        <OkMsg show={ok}>{tab==="login"?"✅ Muvaffaqiyatli kirdingiz!":"🎉 Ro'yxatdan o'tish yakunlandi!"}</OkMsg>
        {tab==="login" ? (
          <>
            <h2 style={{ fontFamily:"'Exo 2',sans-serif", fontSize:22, fontWeight:800, color:C.td, marginBottom:3 }}>Xush kelibsiz! 👋</h2>
            <p style={{ fontSize:13, color:C.gt, marginBottom:20 }}>Tizimga kirish uchun ma'lumotlarni kiriting</p>
            <Inp label="LOGIN / EMAIL" value={u} onChange={e=>setU(e.target.value)} placeholder="email yoki login"/>
            <Inp label="PAROL" type="password" value={p} onChange={e=>setP(e.target.value)} placeholder="••••••••"/>
            <Btn style={{ width:"100%", padding:14, fontSize:15 }} onClick={login}>Kirish</Btn>
            <div style={{ textAlign:"center", marginTop:12, fontSize:12, color:C.gt }}>Admin: <b>admin</b> / <b>admin123</b></div>
          </>
        ) : (
          <>
            <h2 style={{ fontFamily:"'Exo 2',sans-serif", fontSize:22, fontWeight:800, color:C.td, marginBottom:3 }}>Hisob yarating ✨</h2>
            <p style={{ fontSize:13, color:C.gt, marginBottom:20 }}>Yangi hisob ochish uchun to'ldiring</p>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 14px" }}>
              <Inp label="ISM"      value={f}  onChange={e=>setF(e.target.value)}  placeholder="Ismingiz"/>
              <Inp label="FAMILIYA" value={l}  onChange={e=>setL(e.target.value)}  placeholder="Familiyangiz"/>
            </div>
            <Inp label="EMAIL" type="email" value={em} onChange={e=>setEm(e.target.value)} placeholder="email@maktab.uz"/>
            <Inp label="PAROL" type="password" value={pw} onChange={e=>setPw(e.target.value)} placeholder="Kamida 6 ta belgi"/>
            <Sel label="ROL" value={role} onChange={e=>setRole(e.target.value)}>
              <option value="student">👨‍🎓 O'quvchi</option>
              <option value="parent">👨‍👩‍👧 Ota-ona</option>
              <option value="teacher">👨‍🏫 O'qituvchi</option>
            </Sel>
            <Btn style={{ width:"100%", padding:14, fontSize:15 }} onClick={signup}>Ro'yxatdan o'tish</Btn>
          </>
        )}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   ADMIN SUPPORT PANEL (inside admin)
═══════════════════════════════════════════════════════════════ */
const AdminSupportPanel = ({ chats, onReply }) => {
  const [selUser, setSelUser] = useState(null);
  const [reply, setReply] = useState("");
  const endRef = useRef(null);

  const thread = selUser ? chats.find(c=>c.userId===selUser) : null;
  const unreadTotal = chats.reduce((s,c)=>s+c.messages.filter(m=>m.from==="user"&&!m.read).length, 0);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior:"smooth" });
  }, [thread?.messages?.length, selUser]);

  const sendReply = () => {
    if (!reply.trim() || !selUser) return;
    onReply(selUser, reply.trim());
    setReply("");
  };

  return (
    <div style={{ display:"grid", gridTemplateColumns:"280px 1fr", gap:20, height:580 }}>
      {/* User list */}
      <Card style={{ padding:0, overflow:"hidden", display:"flex", flexDirection:"column" }}>
        <div style={{ padding:"14px 16px", borderBottom:`1px solid ${C.gm}`, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div style={{ fontWeight:700, fontSize:14, color:C.td }}>💬 Chatlar</div>
          {unreadTotal>0 && <span style={{ background:"#ef4444", color:"#fff", fontSize:11, fontWeight:700, padding:"2px 8px", borderRadius:20 }}>{unreadTotal} yangi</span>}
        </div>
        <div style={{ overflowY:"auto", flex:1 }}>
          {chats.length===0 && <div style={{ padding:20, textAlign:"center", color:C.gt, fontSize:13 }}>Hali xabar yo'q</div>}
          {chats.map(c => {
            const last = c.messages[c.messages.length-1];
            const unread = c.messages.filter(m=>m.from==="user"&&!m.read).length;
            return (
              <div key={c.userId} onClick={()=>setSelUser(c.userId)} style={{ padding:"12px 16px", cursor:"pointer", borderBottom:`1px solid ${C.gm}`, background:selUser===c.userId?"#eff6ff":"#fff", transition:".15s" }}
                onMouseEnter={e=>{ if(selUser!==c.userId) e.currentTarget.style.background=C.gl; }}
                onMouseLeave={e=>{ if(selUser!==c.userId) e.currentTarget.style.background="#fff"; }}
              >
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                  <div style={{ fontWeight:unread>0?700:500, fontSize:13, color:C.td }}>{c.userName}</div>
                  {unread>0 && <span style={{ background:C.bm, color:"#fff", fontSize:9, fontWeight:700, padding:"2px 6px", borderRadius:20 }}>{unread}</span>}
                </div>
                <div style={{ fontSize:11, color:C.gt, marginTop:3, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                  {last ? `${last.from==="admin"?"Siz: ":""}${last.text}` : "Xabar yo'q"}
                </div>
                {last && <div style={{ fontSize:10, color:C.gt, marginTop:2 }}>{last.time}</div>}
              </div>
            );
          })}
        </div>
      </Card>

      {/* Chat window */}
      {selUser && thread ? (
        <Card style={{ padding:0, overflow:"hidden", display:"flex", flexDirection:"column" }}>
          <div style={{ padding:"13px 18px", borderBottom:`1px solid ${C.gm}`, background:C.gl, display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:34, height:34, borderRadius:"50%", background:avatarColor(thread.userName), display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:700, fontSize:14 }}>
              {thread.userName.charAt(0).toUpperCase()}
            </div>
            <div>
              <div style={{ fontWeight:700, fontSize:14, color:C.td }}>{thread.userName}</div>
              <div style={{ fontSize:11, color:C.gt }}>{thread.userId} · {thread.messages.length} xabar</div>
            </div>
          </div>
          <div style={{ flex:1, overflowY:"auto", padding:16, display:"flex", flexDirection:"column", gap:8, background:"#f8fafc" }}>
            {thread.messages.map((m,i)=>(
              <div key={i} style={{ display:"flex", flexDirection:"column", alignItems:m.from==="admin"?"flex-end":"flex-start" }}>
                <div style={{ maxWidth:"75%", padding:"9px 13px", borderRadius:m.from==="admin"?"14px 14px 4px 14px":"14px 14px 14px 4px", background:m.from==="admin"?C.bm:"#fff", color:m.from==="admin"?"#fff":C.td, fontSize:13, border:m.from==="admin"?"none":`1px solid ${C.gm}`, boxShadow:"0 1px 4px rgba(0,0,0,.07)" }}>
                  {m.text}
                </div>
                <div style={{ fontSize:10, color:C.gt, marginTop:2, paddingLeft:4, paddingRight:4 }}>
                  {m.from==="admin"?"Admin · ":""}{m.time}
                </div>
              </div>
            ))}
            <div ref={endRef}/>
          </div>
          <div style={{ padding:"12px 14px", borderTop:`1px solid ${C.gm}`, display:"flex", gap:8, background:"#fff" }}>
            <input value={reply} onChange={e=>setReply(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendReply()} placeholder="Javob yozing..." style={{ flex:1, padding:"9px 12px", border:`1.5px solid ${C.gm}`, borderRadius:10, fontSize:13, outline:"none" }}
              onFocus={e=>e.target.style.borderColor=C.bm}
              onBlur={e=>e.target.style.borderColor=C.gm}
            />
            <button onClick={sendReply} style={{ background:C.bm, color:"#fff", border:"none", padding:"9px 18px", borderRadius:10, cursor:"pointer", fontSize:13, fontWeight:700 }}>Yuborish ➤</button>
          </div>
        </Card>
      ) : (
        <Card style={{ display:"flex", alignItems:"center", justifyContent:"center" }}>
          <div style={{ textAlign:"center", color:C.gt }}>
            <div style={{ fontSize:48, marginBottom:12 }}>💬</div>
            <div style={{ fontSize:15, fontWeight:600 }}>Chat tanlang</div>
            <div style={{ fontSize:13, marginTop:4 }}>Chap tomondagi ro'yxatdan foydalanuvchi tanlang</div>
          </div>
        </Card>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   ADMIN PANEL
═══════════════════════════════════════════════════════════════ */
const AdminPanel = ({ news, users, chats, schedule, onAdd, onDel, onReplySupport, onUpdateSchedule, onExit }) => {
  const [title, setTitle] = useState(""); const [body2, setBody] = useState("");
  const [cat,   setCat]   = useState("yangilik"); const [emoji, setEmoji] = useState("📰");
  const [ok,    setOk]    = useState(false);
  const [aTab,  setATab]  = useState("news");

  const add = () => {
    if (!title||!body2) return alert("Sarlavha va matnni kiriting.");
    onAdd({ title, body:body2, cat, emoji:emoji||"📰" });
    setTitle(""); setBody(""); setOk(true); setTimeout(()=>setOk(false),2500);
  };

  return (
    <div style={{ position:"fixed", inset:0, background:C.gl, zIndex:2000, overflowY:"auto" }}>
      <div style={{ background:`linear-gradient(135deg,${C.bd},${C.bm})`, position:"sticky", top:0, zIndex:10, boxShadow:"0 2px 12px rgba(0,0,0,.2)" }}>
        <div style={{ maxWidth:1280, margin:"0 auto", padding:"13px 28px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div style={{ fontFamily:"'Exo 2',sans-serif", fontSize:19, fontWeight:800, color:"#fff", display:"flex", alignItems:"center", gap:10 }}>
            🛡️ Admin Panel
            <span style={{ background:C.gold, color:C.bd, fontSize:10, fontWeight:700, padding:"2px 10px", borderRadius:20 }}>ADMIN</span>
          </div>
          <button onClick={onExit} style={{ background:"rgba(255,255,255,.15)", color:"#fff", border:"1px solid rgba(255,255,255,.3)", padding:"8px 18px", borderRadius:7, fontSize:13, fontWeight:600, cursor:"pointer" }}>← Saytga qaytish</button>
        </div>
      </div>
      <div style={{ maxWidth:1280, margin:"0 auto", padding:"26px 24px" }}>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginBottom:28 }}>
          {[[news.length,"Yangiliklar","📰",C.bm],[users.length,"Foydalanuvchilar","👥",C.orange],[news.reduce((s,n)=>s+n.likes.length,0),"Jami layklar","❤️",C.red],[news.reduce((s,n)=>s+n.comments.length,0),"Jami izohlar","💬",C.green]].map(([v,l,ic,bc],i)=>(
            <div key={i} style={{ background:"#fff", borderRadius:12, padding:20, boxShadow:`0 4px 20px rgba(0,48,135,.1)`, borderLeft:`4px solid ${bc}` }}>
              <div style={{ float:"right", fontSize:24 }}>{ic}</div>
              <div style={{ fontFamily:"'Exo 2',sans-serif", fontSize:28, fontWeight:800, color:C.bd }}>{v}</div>
              <div style={{ fontSize:13, color:C.gt, marginTop:2 }}>{l}</div>
            </div>
          ))}
        </div>
        <div style={{ display:"flex", gap:8, marginBottom:22, flexWrap:"wrap" }}>
          {[["news","📰 Yangiliklar"],["users","👥 Foydalanuvchilar"],["schedule","📅 Dars Jadvali"],["support","💬 Support"],["stats","📊 Statistika"]].map(([v,l])=>(
            <button key={v} onClick={()=>setATab(v)} style={{ background:aTab===v?C.bm:"#fff", color:aTab===v?"#fff":C.gt, border:`1.5px solid ${aTab===v?C.bm:C.gm}`, padding:"9px 20px", borderRadius:22, fontSize:13, fontWeight:600, cursor:"pointer", transition:".2s" }}>{l}</button>
          ))}
        </div>

        {aTab==="news" && (
          <div style={{ display:"grid", gridTemplateColumns:"2fr 1.2fr", gap:22 }}>
            <div>
              <Card style={{ marginBottom:20 }}>
                <div style={{ fontFamily:"'Exo 2',sans-serif", fontSize:17, fontWeight:700, color:C.td, marginBottom:16 }}>📝 Yangilik qo'shish</div>
                <Inp label="SARLAVHA" value={title} onChange={e=>setTitle(e.target.value)} placeholder="Sarlavha..."/>
                <Sel label="KATEGORIYA" value={cat} onChange={e=>setCat(e.target.value)}>
                  <option value="yangilik">📰 Yangilik</option>
                  <option value="elon">📢 E'lon</option>
                  <option value="tadbir">🎭 Tadbir</option>
                </Sel>
                <Tex label="MATN" value={body2} onChange={e=>setBody(e.target.value)} placeholder="Yangilik matni..."/>
                <div style={{ display:"flex", gap:12, alignItems:"flex-end" }}>
                  <div style={{ width:120 }}><Inp label="EMOJI" value={emoji} onChange={e=>setEmoji(e.target.value)}/></div>
                  <Btn variant="success" onClick={add} style={{ marginBottom:16 }}>➕ Qo'shish</Btn>
                </div>
                <OkMsg show={ok}>✅ Yangilik qo'shildi!</OkMsg>
              </Card>
              <Card>
                <div style={{ fontFamily:"'Exo 2',sans-serif", fontSize:17, fontWeight:700, color:C.td, marginBottom:16 }}>📋 Yangiliklar ({news.length})</div>
                <div style={{ display:"flex", flexDirection:"column", gap:10, maxHeight:460, overflowY:"auto" }}>
                  {news.map(n=>{
                    const cc = CAT_CFG[n.cat]||CAT_CFG.yangilik;
                    return (
                      <div key={n.id} style={{ background:C.gl, borderRadius:10, padding:12, border:`1px solid ${C.gm}` }}>
                        <div style={{ display:"flex", justifyContent:"space-between", gap:8 }}>
                          <div style={{ flex:1 }}>
                            <div style={{ fontWeight:700, fontSize:13, color:C.td }}>{n.emoji} {n.title}</div>
                            <div style={{ display:"flex", gap:8, marginTop:5, flexWrap:"wrap", alignItems:"center" }}>
                              <Badge cfg={cc}/>
                              <span style={{ fontSize:11, color:C.gt }}>❤️{n.likes.length} · 💬{n.comments.length} · 👁{n.views}</span>
                            </div>
                          </div>
                          <div style={{ display:"flex", flexDirection:"column", gap:4, alignItems:"flex-end" }}>
                            <span style={{ fontSize:11, color:C.gt }}>{n.date}</span>
                            <Btn variant="danger" small onClick={()=>onDel(n.id)}>🗑</Btn>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </div>
            <Card>
              <div style={{ fontFamily:"'Exo 2',sans-serif", fontSize:17, fontWeight:700, color:C.td, marginBottom:16 }}>🔥 Top yangiliklar</div>
              {[...news].sort((a,b)=>b.likes.length-a.likes.length).slice(0,6).map((n,i)=>(
                <div key={n.id} style={{ display:"flex", gap:10, padding:"9px 0", borderBottom:i<5?`1px solid ${C.gm}`:"none", alignItems:"center" }}>
                  <span style={{ fontFamily:"'Exo 2',sans-serif", fontWeight:800, fontSize:16, color:i<3?C.gold:C.gt, minWidth:22 }}>#{i+1}</span>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13, fontWeight:600, color:C.td }}>{n.emoji} {n.title.substring(0,36)}...</div>
                    <div style={{ fontSize:11, color:C.gt }}>❤️{n.likes.length} · 💬{n.comments.length}</div>
                  </div>
                </div>
              ))}
            </Card>
          </div>
        )}

        {aTab==="users" && (
          <Card>
            <div style={{ fontFamily:"'Exo 2',sans-serif", fontSize:17, fontWeight:700, color:C.td, marginBottom:16 }}>👥 Foydalanuvchilar ({users.length})</div>
            <table style={{ width:"100%", borderCollapse:"collapse" }}>
              <thead><tr>{["Ism","Email","Rol","Sana","Faollik"].map(h=><th key={h} style={{ background:C.gl, padding:"9px 13px", fontSize:12, fontWeight:600, color:C.gt, textAlign:"left" }}>{h}</th>)}</tr></thead>
              <tbody>
                {users.length===0
                  ? <tr><td colSpan={5} style={{ textAlign:"center", color:C.gt, padding:18 }}>Foydalanuvchilar yo'q</td></tr>
                  : users.map((u,i)=>{
                    const rc = ROLE_CFG[u.role]||ROLE_CFG.student;
                    const uLikes    = news.reduce((s,n)=>s+(n.likes.includes(u.email)?1:0),0);
                    const uComments = news.reduce((s,n)=>s+n.comments.filter(c=>c.user.email===u.email).length,0);
                    return (
                      <tr key={i}>
                        <td style={{ padding:"10px 13px", fontSize:13, borderBottom:`1px solid ${C.gm}` }}><strong>{u.first} {u.last}</strong></td>
                        <td style={{ padding:"10px 13px", fontSize:12, color:C.gt, borderBottom:`1px solid ${C.gm}` }}>{u.email}</td>
                        <td style={{ padding:"10px 13px", borderBottom:`1px solid ${C.gm}` }}><span style={{ fontSize:10, fontWeight:700, padding:"2px 9px", borderRadius:20, background:rc.bg, color:rc.color }}>{rc.label}</span></td>
                        <td style={{ padding:"10px 13px", fontSize:11, color:C.gt, borderBottom:`1px solid ${C.gm}` }}>{u.date}</td>
                        <td style={{ padding:"10px 13px", fontSize:12, color:C.gt, borderBottom:`1px solid ${C.gm}` }}>❤️{uLikes} · 💬{uComments}</td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </Card>
        )}


        {aTab==="schedule" && (
          <div>
            <Card style={{ marginBottom:20 }}>
              <div style={{ fontFamily:"'Exo 2',sans-serif", fontSize:17, fontWeight:700, color:C.td, marginBottom:6 }}>📅 Dars jadvali boshqaruvi</div>
              <div style={{ fontSize:13, color:C.gt, marginBottom:16 }}>Jadvallarni ko'rish va tahrirlash uchun <strong style={{color:C.bm}}>Dars Jadvali</strong> modal oynasini ishlating.</div>
              <Btn onClick={()=>alert("Jadval modali asosiy sahifada ham ko'rinadi. Admin rejimida u yerdan tahrirlay olasiz.")} variant="ghost" style={{ fontSize:13 }}>📅 Jadval ko'rish (asosiy saytda)</Btn>
            </Card>
            {DAYS.map((day,di) => {
              const d = schedule[di] || { day, lessons:[] };
              return (
                <Card key={day} style={{ marginBottom:14 }}>
                  <div style={{ fontFamily:"'Exo 2',sans-serif", fontSize:16, fontWeight:700, color:C.td, marginBottom:12 }}>{day} — {d.lessons.length} ta dars</div>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                    {d.lessons.map((l,i) => {
                      const sc = getSC(l.sub);
                      return (
                        <div key={i} style={{ background:sc.bg, border:`1px solid ${sc.color}33`, borderRadius:8, padding:"7px 12px", fontSize:12 }}>
                          <span style={{ fontWeight:700, color:sc.color }}>{l.t}</span> · {sc.icon} {l.sub} · {l.room}-xona
                        </div>
                      );
                    })}
                    {d.lessons.length===0 && <span style={{ fontSize:13, color:C.gt }}>Dars yo'q</span>}
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {aTab==="support" && (
          <AdminSupportPanel chats={chats} onReply={onReplySupport}/>
        )}

        {aTab==="stats" && (
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
            <Card>
              <div style={{ fontFamily:"'Exo 2',sans-serif", fontSize:17, fontWeight:700, color:C.td, marginBottom:16 }}>📈 Ko'rsatkichlar</div>
              {[["Bugungi tashrif","248","👁"],["Haftalik o'quvchilar","1,024","👥"],["Faol o'qituvchilar","72","👨‍🏫"],["Yangi xabarlar","12","💬"],["Jami ko'rishlar",news.reduce((s,n)=>s+n.views,0),"📊"],["O'rtacha layk",news.length?(news.reduce((s,n)=>s+n.likes.length,0)/news.length).toFixed(1):"0","❤️"]].map(([l,v,ic])=>(
                <div key={l} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"11px 0", borderBottom:`1px solid ${C.gm}` }}>
                  <span style={{ fontSize:13, color:C.gt }}>{ic} {l}</span>
                  <strong style={{ fontSize:15, color:C.bd, fontFamily:"'Exo 2',sans-serif" }}>{v}</strong>
                </div>
              ))}
            </Card>
            <Card>
              <div style={{ fontFamily:"'Exo 2',sans-serif", fontSize:17, fontWeight:700, color:C.td, marginBottom:16 }}>🗂️ Kategoriyalar</div>
              {Object.entries(CAT_CFG).map(([key,cfg])=>{
                const count = news.filter(n=>n.cat===key).length;
                const pct = news.length ? Math.round(count/news.length*100) : 0;
                return (
                  <div key={key} style={{ marginBottom:16 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                      <span style={{ fontSize:13, fontWeight:600, color:C.td }}>{cfg.icon} {cfg.label}</span>
                      <span style={{ fontSize:13, color:C.gt }}>{count} ta ({pct}%)</span>
                    </div>
                    <div style={{ background:C.gm, borderRadius:20, height:8, overflow:"hidden" }}>
                      <div style={{ height:"100%", width:`${pct}%`, background:C.bm, borderRadius:20, transition:".5s" }}/>
                    </div>
                  </div>
                );
              })}
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};


/* ═══════════════════════════════════════════════════════════════
   DARS JADVALI MODALI / SAHIFASI
═══════════════════════════════════════════════════════════════ */
const ScheduleModal = ({ schedule, onClose, onUpdateSchedule, isAdmin }) => {
  const today = new Date().getDay(); // 0=Sun,1=Mon...6=Sat
  const todayIdx = today === 0 ? 4 : Math.min(today - 1, 5); // clamp to 0-5
  const [selDay, setSelDay] = useState(todayIdx);
  const [editMode, setEditMode] = useState(false);
  const [editSched, setEditSched] = useState(schedule);
  const [form, setForm] = useState({ t:"", sub:"", room:"", teacher:"" });

  const dayData = editSched[selDay] || { day:DAYS[selDay], lessons:[] };

  const addLesson = () => {
    if (!form.t || !form.sub) return;
    const updated = editSched.map((d,i) => i===selDay
      ? { ...d, lessons:[...d.lessons, form].sort((a,b)=>a.t.localeCompare(b.t)) }
      : d
    );
    setEditSched(updated);
    setForm({ t:"", sub:"", room:"", teacher:"" });
  };

  const removeLesson = (li) => {
    const updated = editSched.map((d,i) => i===selDay
      ? { ...d, lessons:d.lessons.filter((_,idx)=>idx!==li) }
      : d
    );
    setEditSched(updated);
  };

  const save = () => {
    onUpdateSchedule(editSched);
    setEditMode(false);
  };

  return (
    <div onClick={e=>e.target===e.currentTarget&&onClose()} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.6)", zIndex:1500, display:"flex", alignItems:"center", justifyContent:"center", backdropFilter:"blur(4px)", padding:16 }}>
      <div className="scale-in" style={{ background:"#fff", borderRadius:18, width:"100%", maxWidth:860, maxHeight:"92vh", overflow:"hidden", display:"flex", flexDirection:"column", boxShadow:"0 24px 80px rgba(0,0,0,.3)" }}>
        {/* Header */}
        <div style={{ background:`linear-gradient(135deg,${C.bd},${C.bm})`, padding:"20px 24px", display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0 }}>
          <div>
            <div style={{ fontFamily:"'Exo 2',sans-serif", fontSize:20, fontWeight:800, color:"#fff" }}>📅 Dars Jadvali</div>
            <div style={{ fontSize:12, color:"rgba(255,255,255,.7)", marginTop:2 }}>2025-2026 o'quv yili</div>
          </div>
          <div style={{ display:"flex", gap:8 }}>
            {isAdmin && (
              editMode
                ? <>
                    <button onClick={save} style={{ background:"#22c55e", color:"#fff", border:"none", padding:"7px 16px", borderRadius:7, fontSize:13, fontWeight:700, cursor:"pointer" }}>💾 Saqlash</button>
                    <button onClick={()=>{ setEditSched(schedule); setEditMode(false); }} style={{ background:"rgba(255,255,255,.2)", color:"#fff", border:"1px solid rgba(255,255,255,.3)", padding:"7px 16px", borderRadius:7, fontSize:13, cursor:"pointer" }}>Bekor</button>
                  </>
                : <button onClick={()=>setEditMode(true)} style={{ background:"rgba(255,255,255,.2)", color:"#fff", border:"1px solid rgba(255,255,255,.3)", padding:"7px 16px", borderRadius:7, fontSize:13, fontWeight:600, cursor:"pointer" }}>✏️ Tahrirlash</button>
            )}
            <button onClick={onClose} style={{ background:"rgba(255,255,255,.2)", border:"none", color:"#fff", width:32, height:32, borderRadius:"50%", cursor:"pointer", fontSize:16 }}>✕</button>
          </div>
        </div>
        {/* Day tabs */}
        <div style={{ display:"flex", overflowX:"auto", borderBottom:`1px solid ${C.gm}`, flexShrink:0, background:"#fff" }}>
          {DAYS.map((d,i) => (
            <button key={d} onClick={()=>setSelDay(i)} style={{ padding:"12px 20px", border:"none", borderBottom:selDay===i?`3px solid ${C.bm}`:"3px solid transparent", background:"none", color:selDay===i?C.bm:C.gt, fontWeight:selDay===i?700:500, fontSize:14, cursor:"pointer", whiteSpace:"nowrap", transition:".2s" }}>
              {d}
              {i===todayIdx && <span style={{ marginLeft:5, background:"#22c55e", color:"#fff", fontSize:9, padding:"1px 6px", borderRadius:10, fontWeight:700 }}>bugun</span>}
            </button>
          ))}
        </div>
        {/* Lessons */}
        <div style={{ overflowY:"auto", padding:24, flex:1 }}>
          {dayData.lessons.length === 0 && !editMode && (
            <div style={{ textAlign:"center", padding:"40px 0", color:C.gt }}>
              <div style={{ fontSize:48, marginBottom:12 }}>🎉</div>
              <div style={{ fontSize:16, fontWeight:600 }}>Bu kuni dars yo'q!</div>
            </div>
          )}
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {dayData.lessons.map((l,i)=>{
              const sc = getSC(l.sub);
              return (
                <div key={i} style={{ display:"flex", gap:14, alignItems:"center", background:sc.bg, border:`1px solid ${sc.color}22`, borderRadius:12, padding:"14px 18px" }}>
                  <div style={{ textAlign:"center", minWidth:52 }}>
                    <div style={{ fontFamily:"'Exo 2',sans-serif", fontSize:16, fontWeight:800, color:sc.color }}>{l.t}</div>
                    <div style={{ fontSize:10, color:sc.color, opacity:.7 }}>{i+1}-dars</div>
                  </div>
                  <div style={{ fontSize:24 }}>{getSC(l.sub).icon}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontFamily:"'Exo 2',sans-serif", fontSize:15, fontWeight:700, color:C.td }}>{l.sub}</div>
                    <div style={{ fontSize:12, color:C.gt, marginTop:2 }}>👨‍🏫 {l.teacher} · 🏛️ {l.room}-xona</div>
                  </div>
                  <span style={{ fontSize:11, fontWeight:700, padding:"3px 10px", borderRadius:20, background:"rgba(255,255,255,.6)", color:sc.color }}>{l.room}</span>
                  {editMode && (
                    <button onClick={()=>removeLesson(i)} style={{ background:"#fee2e2", color:"#dc2626", border:"1px solid #fca5a5", width:28, height:28, borderRadius:"50%", cursor:"pointer", fontSize:13, display:"flex", alignItems:"center", justifyContent:"center" }}>✕</button>
                  )}
                </div>
              );
            })}
          </div>
          {/* Add lesson form (admin only, edit mode) */}
          {editMode && isAdmin && (
            <div style={{ marginTop:20, background:C.gl, borderRadius:12, padding:18, border:`1px dashed ${C.bm}` }}>
              <div style={{ fontWeight:700, fontSize:14, color:C.td, marginBottom:14 }}>➕ Yangi dars qo'shish</div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 2fr 1fr 2fr", gap:10 }}>
                <Inp label="VAQT" value={form.t} onChange={e=>setForm(f=>({...f,t:e.target.value}))} placeholder="08:00"/>
                <Inp label="FAN" value={form.sub} onChange={e=>setForm(f=>({...f,sub:e.target.value}))} placeholder="Matematika"/>
                <Inp label="XONA" value={form.room} onChange={e=>setForm(f=>({...f,room:e.target.value}))} placeholder="201"/>
                <Inp label="O'QITUVCHI" value={form.teacher} onChange={e=>setForm(f=>({...f,teacher:e.target.value}))} placeholder="Familiya I.O."/>
              </div>
              <Btn variant="success" onClick={addLesson} small>➕ Qo'shish</Btn>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   SUPPORT WIDGET  (floating chat bubble)
═══════════════════════════════════════════════════════════════ */
const SupportWidget = ({ user, chats, onSendMsg, onClose, open, onOpen }) => {
  const [text, setText] = useState("");
  const messagesEndRef = useRef(null);

  // Get this user's chat thread
  const myThread = user
    ? (chats.find(c => c.userId === user.email) || { messages:[], userId:user.email, userName:`${user.first} ${user.last}` })
    : null;

  useEffect(() => {
    if (open && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior:"smooth" });
    }
  }, [open, myThread?.messages?.length]);

  const send = () => {
    if (!text.trim() || !user) return;
    onSendMsg(user.email, `${user.first} ${user.last}`, text.trim(), "user");
    setText("");
  };

  const unreadCount = myThread ? myThread.messages.filter(m=>m.from==="admin"&&!m.read).length : 0;

  return (
    <>
      {/* Floating button */}
      <button onClick={open?onClose:onOpen} style={{ position:"fixed", bottom:24, right:24, width:56, height:56, borderRadius:"50%", background:`linear-gradient(135deg,${C.bm},${C.ba})`, border:"none", cursor:"pointer", boxShadow:"0 4px 20px rgba(0,82,204,.4)", zIndex:7000, display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, transition:".3s", transform:open?"scale(0.9)":"scale(1)" }}>
        {open ? "✕" : "💬"}
        {!open && unreadCount > 0 && (
          <span style={{ position:"absolute", top:-2, right:-2, background:"#ef4444", color:"#fff", fontSize:10, fontWeight:700, borderRadius:"50%", width:18, height:18, display:"flex", alignItems:"center", justifyContent:"center", border:"2px solid #fff" }}>{unreadCount}</span>
        )}
      </button>

      {/* Chat window */}
      {open && (
        <div className="scale-in" style={{ position:"fixed", bottom:92, right:24, width:340, maxHeight:480, background:"#fff", borderRadius:16, boxShadow:"0 8px 40px rgba(0,0,0,.2)", zIndex:7000, display:"flex", flexDirection:"column", border:`1px solid ${C.gm}`, overflow:"hidden" }}>
          {/* Header */}
          <div style={{ background:`linear-gradient(135deg,${C.bd},${C.bm})`, padding:"14px 16px", flexShrink:0 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ width:36, height:36, borderRadius:"50%", background:"rgba(255,255,255,.2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>🛡️</div>
              <div>
                <div style={{ fontFamily:"'Exo 2',sans-serif", fontWeight:700, color:"#fff", fontSize:14 }}>Maktab Supporti</div>
                <div style={{ fontSize:11, color:"rgba(255,255,255,.7)" }}>🟢 Onlayn · Odatda 1 soat ichida javob</div>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex:1, overflowY:"auto", padding:14, display:"flex", flexDirection:"column", gap:8, background:"#f8fafc" }}>
            {!user ? (
              <div style={{ textAlign:"center", padding:"30px 16px" }}>
                <div style={{ fontSize:40, marginBottom:10 }}>🔒</div>
                <div style={{ fontSize:13, color:C.gt }}>Support bilan suhbatlashish uchun <strong style={{color:C.bm}}>tizimga kiring</strong></div>
              </div>
            ) : myThread && myThread.messages.length === 0 ? (
              <div style={{ textAlign:"center", padding:"20px 12px" }}>
                <div style={{ fontSize:36, marginBottom:8 }}>👋</div>
                <div style={{ fontSize:13, color:C.gt, lineHeight:1.6 }}>Salom! Qanday yordam kerak? Savol yoki muammoingizni yozing, tez javob beramiz.</div>
              </div>
            ) : (
              myThread?.messages?.map((m,i) => (
                <div key={i} style={{ display:"flex", flexDirection:"column", alignItems:m.from==="user"?"flex-end":"flex-start" }}>
                  <div style={{ maxWidth:"80%", padding:"9px 13px", borderRadius:m.from==="user"?"14px 14px 4px 14px":"14px 14px 14px 4px", background:m.from==="user"?C.bm:"#fff", color:m.from==="user"?"#fff":C.td, fontSize:13, boxShadow:"0 1px 4px rgba(0,0,0,.08)", border:m.from==="user"?"none":`1px solid ${C.gm}` }}>
                    {m.text}
                  </div>
                  <div style={{ fontSize:10, color:C.gt, marginTop:3, paddingLeft:4, paddingRight:4 }}>{m.time}</div>
                </div>
              ))
            )}
            <div ref={messagesEndRef}/>
          </div>

          {/* Input */}
          {user && (
            <div style={{ padding:"10px 12px", borderTop:`1px solid ${C.gm}`, display:"flex", gap:8, flexShrink:0, background:"#fff" }}>
              <input value={text} onChange={e=>setText(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Xabar yozing..." style={{ flex:1, padding:"9px 12px", border:`1.5px solid ${C.gm}`, borderRadius:10, fontSize:13, outline:"none", background:C.gl }}
                onFocus={e=>{ e.target.style.borderColor=C.bm; e.target.style.background="#fff"; }}
                onBlur={e =>{ e.target.style.borderColor=C.gm; e.target.style.background=C.gl; }}
              />
              <button onClick={send} style={{ background:C.bm, color:"#fff", border:"none", width:38, height:38, borderRadius:10, cursor:"pointer", fontSize:16, display:"flex", alignItems:"center", justifyContent:"center" }}>➤</button>
            </div>
          )}
        </div>
      )}
    </>
  );
};

/* ═══════════════════════════════════════════════════════════════
   FOOTER
═══════════════════════════════════════════════════════════════ */
const Footer = () => (
  <footer id="contact" style={{ background:C.td, color:"rgba(255,255,255,.7)", padding:"44px 24px 22px" }}>
    <div style={{ maxWidth:1200, margin:"0 auto", display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr", gap:32, marginBottom:32 }}>
      <div>
        <h3 style={{ fontFamily:"'Exo 2',sans-serif", fontSize:16, fontWeight:700, color:"#fff", marginBottom:10 }}>🏫 Maktab Portali</h3>
        <p style={{ fontSize:13, lineHeight:1.7, color:"rgba(255,255,255,.5)" }}>Ta'lim muassasasining rasmiy axborot portali. Zamonaviy raqamli xizmatlar.</p>
      </div>
      {[["Havolalar",["Bosh sahifa","Yangiliklar","Dars jadvali","E-jurnal"]],
        ["Ma'lumot",["Maktab haqida","Rahbariyat","O'qituvchilar","Kutubxona"]],
        ["Aloqa",["📞 +998 71 XXX XX XX","✉️ info@maktab.uz","📍 Toshkent"]]
      ].map(([t,ls])=>(
        <div key={t}>
          <h4 style={{ fontFamily:"'Exo 2',sans-serif", fontSize:13, fontWeight:700, color:"#fff", marginBottom:11 }}>{t}</h4>
          {ls.map(l=><a key={l} href="#" style={{ display:"block", color:"rgba(255,255,255,.5)", fontSize:13, marginBottom:7, transition:".2s" }}
            onMouseEnter={e=>e.target.style.color=C.gold}
            onMouseLeave={e=>e.target.style.color="rgba(255,255,255,.5)"}
          >{l}</a>)}
        </div>
      ))}
    </div>
    <div style={{ borderTop:"1px solid rgba(255,255,255,.1)", paddingTop:16, display:"flex", justifyContent:"space-between", fontSize:12, color:"rgba(255,255,255,.3)" }}>
      <span>© 2025 Maktab Portali. Barcha huquqlar himoyalangan.</span>
      <span>portal.piima.uz asosida</span>
    </div>
  </footer>
);

/* ═══════════════════════════════════════════════════════════════
   STORAGE HELPERS  (localStorage — Netlify va barcha brauzerda ishlaydi)
═══════════════════════════════════════════════════════════════ */
const STORE_KEY = "maktab:appstate";

function loadState() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (_) { return null; }
}

function saveState(state) {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(state));
  } catch (_) {}
}

/* ═══════════════════════════════════════════════════════════════
   DEFAULT NOTIFS
═══════════════════════════════════════════════════════════════ */
const DEFAULT_NOTIFS = [
  { icon:"🏫", text:"Maktab portaliga xush kelibsiz!", time:"Hozirgina", read:false },
  { icon:"📢", text:"Yangi e'lonlar qo'shildi", time:"1 soat oldin", read:false },
  { icon:"🏆", text:"Olimpiada g'oliblarimiz mukofotlandi", time:"2 kun oldin", read:true },
];

/* ═══════════════════════════════════════════════════════════════
   LOADING SCREEN
═══════════════════════════════════════════════════════════════ */
const LoadingScreen = () => (
  <div style={{ position:"fixed", inset:0, background:`linear-gradient(135deg,${C.bd},${C.bm})`, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", zIndex:9999 }}>
    <div style={{ fontSize:64, marginBottom:24, animation:"spin 1.5s linear infinite" }}>🏫</div>
    <div style={{ fontFamily:"'Exo 2',sans-serif", fontSize:22, fontWeight:800, color:"#fff", marginBottom:10 }}>MAKTAB PORTALI</div>
    <div style={{ color:"rgba(255,255,255,.7)", fontSize:14, marginBottom:28 }}>Ma'lumotlar yuklanmoqda...</div>
    <div style={{ width:200, height:4, background:"rgba(255,255,255,.2)", borderRadius:20, overflow:"hidden" }}>
      <div style={{ height:"100%", background:C.gold, borderRadius:20, animation:"loadBar 1.2s ease-in-out infinite alternate" }}/>
    </div>
    <style>{`
      @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
      @keyframes loadBar { from{width:20%} to{width:90%} }
    `}</style>
  </div>
);

/* ═══════════════════════════════════════════════════════════════
   ROOT APP
═══════════════════════════════════════════════════════════════ */
export default function App() {
  /* ── Core state ── */
  const [ready,     setReady]     = useState(false);   // storage loaded?
  const [news,      setNews]      = useState(INIT_NEWS);
  const [users,     setUsers]     = useState([]);
  const [nextId,    setNextId]    = useState(6);
  const [user,      setUser]      = useState(null);
  const [bookmarks, setBookmarks]   = useState([]);
  const [notifs,    setNotifs]     = useState(DEFAULT_NOTIFS);
  const [schedule,  setSchedule]   = useState(INIT_SCHEDULE);
  const [chats,     setChats]      = useState([]);
  const [supportOpen, setSupportOpen] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);

  /* ── UI state (not persisted) ── */
  const [modal,     setModal]     = useState(null);
  const [adminOpen, setAdminOpen] = useState(false);
  const [profOpen,  setProfOpen]  = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  /* ── LOAD from storage on first mount (sync localStorage) ── */
  useEffect(() => {
    const saved = loadState();
    if (saved) {
      if (saved.news)      setNews(saved.news);
      if (saved.users)     setUsers(saved.users);
      if (saved.nextId)    setNextId(saved.nextId);
      if (saved.user)      setUser(saved.user);
      if (saved.bookmarks) setBookmarks(saved.bookmarks);
      if (saved.notifs)    setNotifs(saved.notifs);
    }
    setReady(true);
  }, []);

  /* ── SAVE to storage whenever any important state changes ── */
  // Debounce: wait 600ms after last change before saving
  const saveTimer = useRef(null);
  useEffect(() => {
    if (!ready) return; // Don't save before initial load finishes
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      saveState({ news, users, nextId, user, bookmarks, notifs, schedule, chats });
    }, 600);
    return () => clearTimeout(saveTimer.current);
  }, [news, users, nextId, user, bookmarks, notifs, schedule, chats, ready]);

  /* ── Notification helper ── */
  const addNotif = useCallback((icon, text) => {
    setNotifs(prev => [{ icon, text, time: "Hozirgina", read: false }, ...prev.slice(0, 49)]);
  }, []);

  /* ── Support / Schedule / Chat Handlers ── */
  const handleSendSupportMsg = (userId, userName, text, from) => {
    setChats(prev => {
      const exists = prev.find(c=>c.userId===userId);
      const msg = { text, from, time: new Date().toLocaleTimeString("uz-UZ",{hour:"2-digit",minute:"2-digit"}), read:false };
      if (exists) {
        return prev.map(c=>c.userId===userId ? { ...c, messages:[...c.messages, msg] } : c);
      }
      return [...prev, { userId, userName, messages:[msg] }];
    });
  };

  const handleAdminReply = (userId, text) => {
    setChats(prev => prev.map(c => {
      if (c.userId !== userId) return c;
      const msg = { text, from:"admin", time: new Date().toLocaleTimeString("uz-UZ",{hour:"2-digit",minute:"2-digit"}), read:false };
      // mark user messages as read
      const updated = c.messages.map(m=>m.from==="user"?{...m,read:true}:m);
      return { ...c, messages:[...updated, msg] };
    }));
  };

  const handleUpdateSchedule = (newSched) => {
    setSchedule(newSched);
    addNotif("📅", "Dars jadvali yangilandi");
  };

  /* ── Handlers ── */
  const handleLogin = (loggedUser) => {
    setUser(loggedUser);
    // Ensure user is in users list (skip admin)
    if (loggedUser.role !== "admin") {
      setUsers(prev => prev.find(u => u.email === loggedUser.email)
        ? prev.map(u => u.email === loggedUser.email ? loggedUser : u)
        : [...prev, loggedUser]
      );
    }
    addNotif("👋", `Xush kelibsiz, ${loggedUser.first}!`);
    if (loggedUser.role === "admin") setAdminOpen(true);
  };

  const handleLogout = () => {
    setUser(null);
    setBookmarks([]);
    setAdminOpen(false);
    setProfOpen(false);
    // Save immediately on logout so session is cleared
    saveState({ news, users, nextId, user: null, bookmarks: [], notifs, schedule, chats });
  };

  const handleUpdateUser = (updated) => {
    setUser(updated);
    setUsers(prev => prev.map(u => u.email === updated.email ? updated : u));
  };

  const handleLike = (id) => {
    if (!user) return;
    setNews(prev => prev.map(n => {
      if (n.id !== id) return n;
      const liked = n.likes.includes(user.email);
      if (!liked) addNotif("❤️", `"${n.title.substring(0,28)}..." yoqtirdingiz`);
      return { ...n, likes: liked ? n.likes.filter(e => e !== user.email) : [...n.likes, user.email] };
    }));
  };

  const handleBookmark = (id) => {
    if (!user) return;
    setBookmarks(prev => {
      const has = prev.includes(id);
      if (!has) {
        const n = news.find(x => x.id === id);
        addNotif("🔖", `"${n?.title?.substring(0,28)}..." saqlandi`);
      }
      return has ? prev.filter(b => b !== id) : [...prev, id];
    });
  };

  const handleComment = (id, text) => {
    if (!user) return;
    setNews(prev => prev.map(n => {
      if (n.id !== id) return n;
      return { ...n, comments: [...n.comments, { user, text, date: new Date().toISOString() }] };
    }));
    addNotif("💬", "Izohingiz qo'shildi");
  };

  const handleView = (id) => {
    setNews(prev => prev.map(n => n.id === id ? { ...n, views: n.views + 1 } : n));
  };

  const handleAddNews = (item) => {
    const today = new Date().toISOString().split("T")[0];
    setNews(prev => [{ id: nextId, ...item, date: today, likes: [], comments: [], views: 0 }, ...prev]);
    setNextId(n => n + 1);
    addNotif("📰", `Yangi "${CAT_CFG[item.cat]?.label||item.cat}" qo'shildi`);
  };

  const handleDeleteNews = (id) => setNews(prev => prev.filter(n => n.id !== id));

  const handleAddUser = (newUser) => {
    setUsers(prev => [...prev, newUser]);
  };

  const readNotif = (i) => setNotifs(prev => prev.map((n, idx) => idx === i ? { ...n, read: true } : n));

  /* ── Render ── */
  if (!ready) return <><GS/><LoadingScreen/></>;

  return (
    <>
      <GS/>
      {/* Tiny "saved" indicator */}
      <div style={{ position:"fixed", bottom:16, right:16, zIndex:8000, display:"flex", flexDirection:"column", gap:8, pointerEvents:"none" }}>
        <div style={{ background:"rgba(0,48,135,.85)", color:"#fff", fontSize:11, padding:"5px 12px", borderRadius:20, backdropFilter:"blur(6px)", fontWeight:500 }}>
          💾 Ma'lumotlar avtomatik saqlanadi
        </div>
      </div>

      {adminOpen ? (
        <AdminPanel
          news={news} users={users} chats={chats} schedule={schedule}
          onAdd={handleAddNews} onDel={handleDeleteNews}
          onReplySupport={handleAdminReply} onUpdateSchedule={handleUpdateSchedule}
          onExit={() => setAdminOpen(false)}
        />
      ) : (
        <>
          <Header
            user={user}
            notifications={notifs}
            onLogin={() => setModal("login")}
            onSignup={() => setModal("signup")}
            onProfile={() => setProfOpen(true)}
            onLogout={handleLogout}
            onAdminOpen={() => setAdminOpen(true)}
            onNotifOpen={() => setNotifOpen(true)}
            onScheduleOpen={() => setScheduleOpen(true)}
          />
          <Hero user={user} onSignup={() => setModal("signup")}/>
          <QuickLinks onQuickAction={(i) => {
            if (i===1) { setScheduleOpen(true); }
            else if (i===3) { if (!user) setModal("login"); else setSupportOpen(v=>!v); }
            else { if (!user) setModal("login"); }
          }}/>
          <NewsSection
            news={news}
            user={user}
            onLike={handleLike}
            onBookmark={handleBookmark}
            onComment={handleComment}
            onView={handleView}
            bookmarks={bookmarks}
          />
          <section id="about" style={{ background:`linear-gradient(135deg,${C.bd},#00509e)`, padding:"60px 24px", textAlign:"center" }}>
            <div style={{ maxWidth:700, margin:"0 auto" }}>
              <div style={{ fontSize:48, marginBottom:14 }}>🏫</div>
              <h2 style={{ fontFamily:"'Exo 2',sans-serif", fontSize:30, fontWeight:800, color:"#fff", marginBottom:14 }}>Maktabimiz haqida</h2>
              <p style={{ color:"rgba(255,255,255,.8)", fontSize:16, lineHeight:1.8 }}>Bizning maktab 2009 yilda tashkil etilgan bo'lib, bugungi kunda 1200 dan ortiq o'quvchi va 85 nafar malakali o'qituvchiga ega. Zamonaviy ta'lim metodlari va texnologiyalardan foydalanib, o'quvchilarimizni kelajakka tayyorlaymiz.</p>
            </div>
          </section>
          <Footer/>

          <AuthModal
            open={!!modal} tab={modal} users={users}
            onClose={() => setModal(null)} onSwitch={setModal}
            onLoginOk={handleLogin} onAddUser={handleAddUser}
          />
          {profOpen && user && (
            <ProfilePage
              user={user} news={news} bookmarks={bookmarks}
              onUpdateUser={handleUpdateUser}
              onClose={() => setProfOpen(false)}
            />
          )}
          {notifOpen && (
            <NotifPanel notifications={notifs} onRead={readNotif} onClose={() => setNotifOpen(false)}/>
          )}
          {scheduleOpen && (
            <ScheduleModal
              schedule={schedule}
              isAdmin={user?.role==="admin"}
              onClose={() => setScheduleOpen(false)}
              onUpdateSchedule={handleUpdateSchedule}
            />
          )}
          <SupportWidget
            user={user}
            chats={chats}
            open={supportOpen}
            onOpen={() => setSupportOpen(true)}
            onClose={() => setSupportOpen(false)}
            onSendMsg={handleSendSupportMsg}
          />
        </>
      )}
    </>
  );
}