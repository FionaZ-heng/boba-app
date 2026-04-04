import { useState, useEffect } from "react";

// ── Supabase config ────────────────────────────────────
const SUPA_URL = "https://glwnffbfhnebedjgmjnyd.supabase.co";
const SUPA_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdsd25mZmJmaG5lYmRqZ21qbnlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUyNzU0NjIsImV4cCI6MjA5MDg1MTQ2Mn0.Yd5r7b_uxiuLS8A_Lk0uCRTgFGjZuSXed-J7XJbYHys";

const db = {
  async query(table, options = {}) {
    let url = `${SUPA_URL}/rest/v1/${table}?`;
    if (options.select) url += `select=${options.select}&`;
    if (options.filter) url += `${options.filter}&`;
    if (options.single) url += `limit=1&`;
    const res = await fetch(url, {
      headers: {
        "apikey": SUPA_KEY,
        "Authorization": `Bearer ${SUPA_KEY}`,
        "Content-Type": "application/json",
      }
    });
    const data = await res.json();
    return options.single ? (Array.isArray(data) ? data[0] : data) : data;
  },
  async insert(table, body) {
    const res = await fetch(`${SUPA_URL}/rest/v1/${table}`, {
      method: "POST",
      headers: {
        "apikey": SUPA_KEY,
        "Authorization": `Bearer ${SUPA_KEY}`,
        "Content-Type": "application/json",
        "Prefer": "return=representation",
      },
      body: JSON.stringify(body)
    });
    return res.json();
  },
  async update(table, filter, body) {
    const res = await fetch(`${SUPA_URL}/rest/v1/${table}?${filter}`, {
      method: "PATCH",
      headers: {
        "apikey": SUPA_KEY,
        "Authorization": `Bearer ${SUPA_KEY}`,
        "Content-Type": "application/json",
        "Prefer": "return=representation",
      },
      body: JSON.stringify(body)
    });
    return res.json();
  }
};

// ── Design tokens ──────────────────────────────────────
const C = {
  primary:"#D44C7A", primary50:"#E8829E",
  primaryBg:"#FDE8EE", yellow:"#F5B731",
  dark:"#1A1A2E", dark50:"#555566", dark25:"#AAAAAA",
  border:"#F0D0DA", bg:"#FDF6F8", white:"#FFFFFF",
};

// ── Menu data ──────────────────────────────────────────
const HEYTEA_MENU = [
  { id:101, category:"IN SEASON",  name:"Very Tangerine Blast",              nameZH:"橘子冰茶",       price:"S$6.82", tags:["绿茶","布丁","波波"], emoji:"🍊", desc:"鲜剥蜜橘配皇家碧螺绿茶，搭配桂花布丁和波波。" },
  { id:102, category:"清爽系列",    name:"Mango Grapefruit Pops",             nameZH:"芒果西柚波波",   price:"S$6.54", tags:["芒果","西柚","波波"], emoji:"🥭", desc:"新鲜芒果配碧螺绿茶与西柚果肉，加脆波波。" },
  { id:103, category:"清爽系列",    name:"Very Mango Tea",                    nameZH:"芒果茶",         price:"S$7.98", tags:["芒果","绿茶"], emoji:"🥭", desc:"时令芒果配清爽碧螺绿茶，热带甜蜜体验。" },
  { id:104, category:"清爽系列",    name:"Very Grapefruit Boom",              nameZH:"西柚爆爆",       price:"S$5.03", tags:["西柚","茉莉绿茶"], emoji:"🍋", desc:"清爽西柚果肉配茉莉绿茶，沁人心脾。" },
  { id:105, category:"清爽系列",    name:"Very Strawberry Peach Fusion",      nameZH:"草莓蜜桃融合",   price:"S$7.89", tags:["草莓","蜜桃","绿茶"], emoji:"🍓", desc:"草莓芝士与蜜桃芝士的梦幻融合。" },
  { id:106, category:"清爽系列",    name:"Emblic Superfruit Refresher",       nameZH:"余甘超级水果茶", price:"S$7.71", tags:["余甘果","绿茶"], emoji:"🌿", desc:"七分甜三分酸，健康美味。" },
  { id:107, category:"招牌系列",    name:"Very Grape Cheezo",                 nameZH:"多肉葡萄芝士",   price:"S$9.32", tags:["葡萄","芝士","绿茶"], emoji:"🍇", desc:"2018年原创。手剥巨峰葡萄配优质绿茶。" },
  { id:108, category:"招牌系列",    name:"Grapefruit Boom (Original)",        nameZH:"原创西柚爆爆",   price:"S$6.19", tags:["西柚","茉莉绿茶"], emoji:"🍋", desc:"2016年原创。新鲜西柚果肉配茉莉绿茶。" },
  { id:109, category:"招牌系列",    name:"Very Mango Grapefruit Fusion",      nameZH:"芒果西柚融合",   price:"S$8.33", tags:["芒果","西柚","椰奶","波波"], emoji:"🥭", desc:"芒果+西柚+椰奶+绿茶+波波，夏日必喝。" },
  { id:110, category:"招牌系列",    name:"Mango Cheezo (Original)",           nameZH:"多肉芒果芝士",   price:"S$9.32", tags:["芒果","芝士","绿茶"], emoji:"🥭", desc:"2017年原创。时令芒果配碧螺绿茶与芝士。" },
  { id:111, category:"醇厚系列",    name:"Roasted Brown BoBo Milk w/Cheezo", nameZH:"芝士黑糖波波鲜奶",price:"S$5.92", tags:["黑糖","波波","芝士","鲜奶"], emoji:"🖤", desc:"2012年原创。黑糖波波配鲜奶芝士，浓郁醇厚。" },
  { id:112, category:"醇厚系列",    name:"Brown Bobo Milk",                   nameZH:"黑糖波波鲜奶",   price:"S$4.04", tags:["黑糖","波波","鲜奶"], emoji:"🥛", desc:"黑糖波波与优质鲜奶，丝滑浓醇。" },
  { id:113, category:"醇厚系列",    name:"Roasted Brown Bobo Milk Tea w/Cheezo",nameZH:"芝士黑糖波波奶茶",price:"S$6.47", tags:["红茶","黑糖","波波","芝士"], emoji:"🧋", desc:"红茶奶茶底配黑糖波波与芝士。" },
  { id:114, category:"醇厚系列",    name:"Taro Bobo Milk Tea",                nameZH:"芋泥波波奶茶",   price:"S$4.22", tags:["芋泥","波波","奶茶"], emoji:"🟣", desc:"芋泥+芋泥波波，纯芋泥爱好者必选。" },
  { id:115, category:"经典系列",    name:"Pure Aqua Green Jasmine Milk Tea",  nameZH:"纯茉莉绿奶茶",   price:"S$3.23", tags:["绿茶","茉莉","鲜奶","布丁"], emoji:"🍵", desc:"碧螺绿茶配鲜奶与桂花布丁。" },
  { id:116, category:"经典系列",    name:"Regal Aqua Green Jasmine Cheezo",   nameZH:"芝士茉莉绿茶",   price:"S$3.85", tags:["绿茶","茉莉","芝士"], emoji:"🍵", desc:"2012年原创芝士茶，世界各地茶叶精选。" },
  { id:117, category:"经典系列",    name:"Pure Regal Aqua Green Jasmine Tea", nameZH:"纯茉莉绿茶",     price:"S$2.96", tags:["绿茶","茉莉"], emoji:"🍵", desc:"优质绿茶，清爽茉莉香气，简单纯粹。" },
  { id:118, category:"冰淇淋",      name:"BOBO SUNDAE",                       nameZH:"波波圣代",       price:"S$4.30", tags:["冰淇淋","黑糖","波波"], emoji:"🍦", desc:"浓郁奶茶冰淇淋配黑糖波波。" },
];
const ALL_CATEGORIES = ["全部", ...new Set(HEYTEA_MENU.map(t => t.category))];
const ALL_TAGS = [...new Set(HEYTEA_MENU.flatMap(t => t.tags))];

// ── Cartoon Cup SVG ────────────────────────────────────
function Cup({ color = "#D44C7A", size = 80, unlocked = true, animate = false }) {
  const c = unlocked ? color : "#D1D5DB";
  return (
    <svg width={size} height={size * 1.15} viewBox="0 0 90 104"
      style={animate ? { animation: "bob 2.5s ease-in-out infinite" } : {}}>
      <style>{`@keyframes bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}`}</style>
      {unlocked && <rect x="57" y="1" width="6" height="30" rx="3" fill="#A78BFA" />}
      <ellipse cx="45" cy="101" rx="26" ry="3.5" fill="#0001" />
      <path d="M16 34 L21 86 Q21 92 27 92 L63 92 Q69 92 69 86 L74 34 Z" fill={c} />
      <ellipse cx="28" cy="60" rx="5" ry="13" fill="white" opacity="0.18" transform="rotate(-8,28,60)" />
      <rect x="11" y="27" width="68" height="11" rx="5.5" fill={unlocked ? "#FECDD3" : "#E5E7EB"} />
      <ellipse cx="45" cy="27" rx="34" ry="8" fill={unlocked ? "#FFE4E6" : "#F3F4F6"} />
      {unlocked ? (<>
        <circle cx="37" cy="62" r="3.5" fill="white" opacity="0.95" />
        <circle cx="53" cy="62" r="3.5" fill="white" opacity="0.95" />
        <circle cx="38" cy="62" r="1.8" fill="#3D1A2E" />
        <circle cx="54" cy="62" r="1.8" fill="#3D1A2E" />
        <circle cx="39" cy="61" r=".7" fill="white" />
        <circle cx="55" cy="61" r=".7" fill="white" />
        <path d="M38 71 Q45 77 52 71" stroke="#3D1A2E" strokeWidth="2" fill="none" strokeLinecap="round" />
        <ellipse cx="32" cy="67" rx="4.5" ry="2.5" fill="#FCA5A5" opacity="0.5" />
        <ellipse cx="58" cy="67" rx="4.5" ry="2.5" fill="#FCA5A5" opacity="0.5" />
        {[[25,82],[34,85],[44,83],[54,85],[63,82]].map(([x,y],i) => (
          <circle key={i} cx={x} cy={y} r="2.8" fill="white" opacity="0.28" />
        ))}
      </>) : <text x="45" y="73" textAnchor="middle" fontSize="22">🔒</text>}
    </svg>
  );
}

function Stars({ val, onSet, size = 14 }) {
  const [h, setH] = useState(0);
  return (
    <span style={{ display: "flex", gap: 1 }}>
      {[1,2,3,4,5].map(i => (
        <span key={i} onClick={() => onSet && onSet(i)}
          onMouseEnter={() => onSet && setH(i)} onMouseLeave={() => onSet && setH(0)}
          style={{ fontSize: size, cursor: onSet ? "pointer" : "default", lineHeight: 1,
            color: (onSet ? (h || val) : val) >= i ? C.yellow : "#E5E7EB" }}>★</span>
      ))}
    </span>
  );
}

function BtnPrimary({ children, onClick, style = {}, disabled = false }) {
  return (
    <button onClick={onClick} disabled={disabled}
      style={{ background: disabled ? "#E5E7EB" : `linear-gradient(135deg,${C.primary},${C.primary50})`,
        color: disabled ? C.dark25 : "white", border: "none", borderRadius: 12,
        padding: "11px 24px", fontWeight: 700, fontSize: 14, cursor: disabled ? "not-allowed" : "pointer",
        boxShadow: disabled ? "none" : `0 4px 16px ${C.primary}44`,
        transition: "transform .15s", ...style }}
      onMouseEnter={e => !disabled && (e.currentTarget.style.transform = "translateY(-2px)")}
      onMouseLeave={e => (e.currentTarget.style.transform = "translateY(0)")}>
      {children}
    </button>
  );
}

function TeaCard({ t, unlocked, onView, onFav, isFav }) {
  const cols = ["#D44C7A","#7C3AED","#059669","#D97706","#2563EB","#DB2777"];
  const col = cols[t.id % cols.length];
  return (
    <div onClick={() => onView(t)}
      style={{ background: C.white, borderRadius: 20, overflow: "hidden", cursor: "pointer",
        border: `1px solid ${C.border}`, transition: "transform .2s,box-shadow .2s",
        boxShadow: "0 2px 12px #D44C7A0D" }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 28px #D44C7A20"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 12px #D44C7A0D"; }}>
      <div style={{ background: unlocked ? `linear-gradient(135deg,${col}22,${col}0A)` : "#F9FAFB",
        height: 150, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
        <Cup color={col} size={100} unlocked={unlocked} animate={unlocked} />
        {onFav && unlocked && (
          <button onClick={e => { e.stopPropagation(); onFav(t.id); }}
            style={{ position: "absolute", top: 8, right: 10, background: "white", border: "none",
              borderRadius: "50%", width: 30, height: 30, fontSize: 15, cursor: "pointer",
              boxShadow: "0 2px 8px #0001", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {isFav ? "❤️" : "🤍"}
          </button>
        )}
        {!unlocked && (
          <span style={{ position: "absolute", bottom: 8, left: "50%", transform: "translateX(-50%)",
            background: "#374151", color: "white", fontSize: 10, fontWeight: 700,
            borderRadius: 8, padding: "2px 8px", whiteSpace: "nowrap" }}>🔒 未解锁</span>
        )}
      </div>
      <div style={{ padding: "12px 14px" }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: C.dark, marginBottom: 1 }}>
          {unlocked ? t.nameZH : "??? 神秘款"}
        </div>
        <div style={{ fontSize: 11, color: C.dark50, marginBottom: 6 }}>
          {unlocked ? t.name : "解锁后查看"}
        </div>
        {unlocked ? (<>
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 8 }}>
            {t.tags.slice(0, 3).map(tag => (
              <span key={tag} style={{ background: C.primaryBg, color: C.primary,
                fontSize: 10, borderRadius: 6, padding: "1px 7px", fontWeight: 600 }}>{tag}</span>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontWeight: 800, fontSize: 16, color: C.primary }}>{t.price}</span>
            <span style={{ fontSize: 10, color: C.dark25, background: "#F3F4F6", borderRadius: 6, padding: "2px 7px" }}>{t.category}</span>
          </div>
        </>) : <div style={{ fontSize: 12, color: C.dark25, fontStyle: "italic" }}>探索更多来解锁 ✨</div>}
      </div>
    </div>
  );
}

function ProgressBar({ value, max }) {
  const pct = Math.round((value / max) * 100);
  return (
    <div style={{ background: "#F3F4F6", borderRadius: 99, height: 10, overflow: "hidden" }}>
      <div style={{ background: `linear-gradient(90deg,${C.primary},${C.primary50})`,
        height: "100%", width: `${pct}%`, borderRadius: 99, transition: "width .6s ease" }} />
    </div>
  );
}

function Spinner() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", minHeight: "60vh", gap: 16 }}>
      <div style={{ width: 48, height: 48, border: `4px solid ${C.primaryBg}`,
        borderTop: `4px solid ${C.primary}`, borderRadius: "50%",
        animation: "spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div style={{ color: C.dark50, fontSize: 15 }}>加载中...</div>
    </div>
  );
}

// ══════════════════════════════════════════════════════
export default function App() {
  const [curUser, setCurUser] = useState(null); // full user object
  const [authMode, setAuthMode] = useState("login");
  const [authForm, setAuthForm] = useState({ user: "", pw: "", name: "", avatar: "🐰" });
  const [authErr, setAuthErr] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [page, setPage] = useState("home");
  const [detail, setDetail] = useState(null);
  const [catF, setCatF] = useState("全部");
  const [search, setSearch] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(0);
  const [reviews, setReviews] = useState([]); // all reviews from DB
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [allUsers, setAllUsers] = useState([]); // for leaderboard

  // Load session from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("boba_session");
    if (saved) {
      try {
        const u = JSON.parse(saved);
        // re-fetch latest user data from DB
        db.query("users", { filter: `username=eq.${u.username}`, single: true })
          .then(fresh => { if (fresh && fresh.username) { setCurUser(fresh); localStorage.setItem("boba_session", JSON.stringify(fresh)); }
            else localStorage.removeItem("boba_session"); });
      } catch { localStorage.removeItem("boba_session"); }
    }
  }, []);

  // Load reviews when detail opens
  useEffect(() => {
    if (!detail) return;
    setReviewsLoading(true);
    db.query("reviews", { filter: `tea_id=eq.${detail.id}`, select: "*" })
      .then(data => { setReviews(Array.isArray(data) ? data : []); setReviewsLoading(false); });
  }, [detail]);

  const saveSession = (u) => {
    if (u) localStorage.setItem("boba_session", JSON.stringify(u));
    else localStorage.removeItem("boba_session");
  };

  const login = async () => {
    setAuthLoading(true); setAuthErr("");
    const user = await db.query("users", { filter: `username=eq.${authForm.user}`, single: true });
    if (!user || !user.username) { setAuthErr("用户不存在"); setAuthLoading(false); return; }
    if (user.password !== authForm.pw) { setAuthErr("密码错误"); setAuthLoading(false); return; }
    setCurUser(user); saveSession(user); setPage("home"); setAuthLoading(false);
  };

  const register = async () => {
    if (!authForm.user || !authForm.pw || !authForm.name) { setAuthErr("请填写所有字段"); return; }
    setAuthLoading(true); setAuthErr("");
    const existing = await db.query("users", { filter: `username=eq.${authForm.user}`, single: true });
    if (existing && existing.username) { setAuthErr("用户名已存在"); setAuthLoading(false); return; }
    const result = await db.insert("users", {
      username: authForm.user, password: authForm.pw,
      name: authForm.name, avatar: authForm.avatar,
      fav_tags: [], unlocked: [101, 102, 103], favorites: []
    });
    const newUser = Array.isArray(result) ? result[0] : result;
    if (!newUser || !newUser.username) { setAuthErr("注册失败，请重试"); setAuthLoading(false); return; }
    setCurUser(newUser); saveSession(newUser); setPage("home"); setAuthLoading(false);
  };

  const logout = () => { setCurUser(null); saveSession(null); setPage("home"); };

  const updateUser = async (fields) => {
    const updated = await db.update("users", `username=eq.${curUser.username}`, fields);
    const u = Array.isArray(updated) ? updated[0] : updated;
    if (u && u.username) { setCurUser(u); saveSession(u); }
  };

  const toggleFav = async (id) => {
    const favs = curUser.favorites || [];
    const next = favs.includes(id) ? favs.filter(x => x !== id) : [...favs, id];
    await updateUser({ favorites: next });
  };

  const toggleTag = async (tag) => {
    const tags = curUser.fav_tags || [];
    const next = tags.includes(tag) ? tags.filter(x => x !== tag) : [...tags, tag];
    await updateUser({ fav_tags: next });
  };

  const submitReview = async (teaId) => {
    if (!reviewRating || !reviewText.trim()) return;
    await db.insert("reviews", {
      username: curUser.username, tea_id: teaId,
      rating: reviewRating, text: reviewText
    });
    // reload reviews
    const data = await db.query("reviews", { filter: `tea_id=eq.${teaId}`, select: "*" });
    setReviews(Array.isArray(data) ? data : []);
    setReviewText(""); setReviewRating(0);
  };

  const isUnlocked = id => curUser?.unlocked?.includes(id);
  const isFav = id => curUser?.favorites?.includes(id);
  const total = HEYTEA_MENU.length;
  const unlockedCount = curUser ? HEYTEA_MENU.filter(t => isUnlocked(t.id)).length : 0;

  const filtered = HEYTEA_MENU.filter(t => {
    const c = catF === "全部" || t.category === catF;
    const s = !search || t.nameZH.includes(search) || t.name.toLowerCase().includes(search.toLowerCase()) || t.tags.some(tg => tg.includes(search));
    return c && s;
  });

  const navItems = [{k:"home",ic:"🏠",lb:"发现"},{k:"menu",ic:"🧋",lb:"菜单"},{k:"favorites",ic:"❤️",lb:"收藏"},{k:"profile",ic:"👤",lb:"我的"}];

  // ── AUTH PAGE ──────────────────────────────────────
  if (!curUser) return (
    <div style={{ minHeight: "100vh", background: `linear-gradient(135deg,${C.primaryBg},#F3E8FF)`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'PingFang SC',sans-serif", padding: 20 }}>
      <div style={{ background: C.white, borderRadius: 28, padding: "40px 36px", width: "100%", maxWidth: 420,
        boxShadow: "0 24px 64px #D44C7A22" }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <Cup color={C.primary} size={90} unlocked animate />
          <div style={{ fontSize: 28, fontWeight: 900, color: C.primary, marginTop: 4 }}>奶茶星球</div>
          <div style={{ color: C.dark50, fontSize: 13, marginTop: 4 }}>探索 · 分享 · 解锁每一杯美好</div>
        </div>
        <div style={{ display: "flex", background: C.primaryBg, borderRadius: 14, padding: 4, marginBottom: 22 }}>
          {[["login","登录"],["register","注册"]].map(([m,lb]) => (
            <button key={m} onClick={() => { setAuthMode(m); setAuthErr(""); }}
              style={{ flex: 1, border: "none", borderRadius: 12, padding: "9px 0", fontWeight: 700,
                fontSize: 14, cursor: "pointer", transition: "all .2s",
                background: authMode === m ? C.white : "transparent",
                color: authMode === m ? C.primary : C.dark50,
                boxShadow: authMode === m ? "0 2px 8px #D44C7A22" : "none" }}>{lb}</button>
          ))}
        </div>
        {authMode === "register" && <>
          <label style={lbS}>昵称</label>
          <input style={inS} placeholder="你的昵称" value={authForm.name}
            onChange={e => setAuthForm(f => ({...f, name: e.target.value}))} />
          <label style={lbS}>头像</label>
          <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
            {["🐰","🐱","🐻","🦊","🐼","🌸","🦋","🍓"].map(av => (
              <span key={av} onClick={() => setAuthForm(f => ({...f, avatar: av}))}
                style={{ fontSize: 22, cursor: "pointer", borderRadius: 10, padding: "4px 5px",
                  border: `2px solid ${authForm.avatar === av ? C.primary : "transparent"}`,
                  background: authForm.avatar === av ? C.primaryBg : "transparent" }}>{av}</span>
            ))}
          </div>
        </>}
        <label style={lbS}>用户名</label>
        <input style={inS} placeholder="用户名" value={authForm.user}
          onChange={e => setAuthForm(f => ({...f, user: e.target.value}))} />
        <label style={lbS}>密码</label>
        <input style={inS} type="password" placeholder="密码" value={authForm.pw}
          onChange={e => setAuthForm(f => ({...f, pw: e.target.value}))} />
        {authErr && <div style={{ color: C.primary, fontSize: 13, background: C.primaryBg,
          borderRadius: 10, padding: "8px 12px", marginBottom: 14, textAlign: "center" }}>{authErr}</div>}
        <BtnPrimary onClick={authMode === "login" ? login : register}
          disabled={authLoading} style={{ width: "100%", padding: 14 }}>
          {authLoading ? "请稍候..." : authMode === "login" ? "🌸 登录" : "✨ 注册"}
        </BtnPrimary>
        <div style={{ textAlign: "center", marginTop: 14, fontSize: 12, color: C.dark25 }}>
          数据实时同步 · 多设备通用 ☁️
        </div>
      </div>
    </div>
  );

  // ── DETAIL PAGE ────────────────────────────────────
  if (detail) {
    const t = detail; const ul = isUnlocked(t.id);
    const col = ["#D44C7A","#7C3AED","#059669","#D97706","#2563EB","#DB2777"][t.id % 6];
    const myReview = reviews.find(r => r.username === curUser.username);
    const avgRating = reviews.length ? (reviews.reduce((s,r) => s + r.rating, 0) / reviews.length).toFixed(1) : null;
    return (
      <div style={{ fontFamily: "'PingFang SC',sans-serif", minHeight: "100vh", background: C.bg }}>
        <div style={{ background: `linear-gradient(135deg,${col}33,${col}11)`, padding: "28px 28px 32px" }}>
          <button onClick={() => setDetail(null)}
            style={{ background: "white", border: "none", borderRadius: 12, padding: "8px 16px",
              fontSize: 14, fontWeight: 600, color: C.dark, cursor: "pointer", marginBottom: 20,
              boxShadow: "0 2px 8px #0001" }}>← 返回</button>
          <div style={{ display: "flex", gap: 28, alignItems: "center", flexWrap: "wrap" }}>
            <Cup color={col} size={130} unlocked={ul} animate={ul} />
            <div style={{ flex: 1, minWidth: 220 }}>
              {ul ? (<>
                <div style={{ fontSize: 11, fontWeight: 700, color: col, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>{t.category} · 喜茶</div>
                <div style={{ fontSize: 28, fontWeight: 900, color: C.dark, marginBottom: 2 }}>{t.nameZH}</div>
                <div style={{ fontSize: 15, color: C.dark50, marginBottom: 10 }}>{t.name}</div>
                {avgRating && (
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                    <Stars val={Math.round(avgRating)} size={16} />
                    <span style={{ fontWeight: 700, color: C.dark }}>{avgRating}</span>
                    <span style={{ color: C.dark50, fontSize: 13 }}>({reviews.length}条评价)</span>
                  </div>
                )}
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
                  {t.tags.map(tag => (
                    <span key={tag} style={{ background: C.primaryBg, color: C.primary, fontSize: 13, borderRadius: 10, padding: "4px 12px", fontWeight: 600 }}>{tag}</span>
                  ))}
                </div>
                <div style={{ fontSize: 30, fontWeight: 900, color: C.primary, marginBottom: 16 }}>{t.price}</div>
                <BtnPrimary onClick={() => toggleFav(t.id)}>
                  {isFav(t.id) ? "❤️ 已收藏" : "🤍 收藏"}
                </BtnPrimary>
              </>) : (
                <div>
                  <div style={{ fontSize: 28, fontWeight: 900, color: C.dark25, marginBottom: 8 }}>🔒 神秘款式</div>
                  <div style={{ color: C.dark50 }}>解锁更多奶茶来揭晓！</div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div style={{ padding: "24px 28px", maxWidth: 800, margin: "0 auto" }}>
          {ul && <>
            <div style={{ background: C.white, borderRadius: 20, padding: 20, marginBottom: 20,
              boxShadow: "0 2px 12px #D44C7A0D", borderLeft: `4px solid ${col}` }}>
              <div style={{ fontWeight: 700, color: C.dark, marginBottom: 6 }}>📝 口味描述</div>
              <div style={{ color: C.dark50, lineHeight: 1.7, fontSize: 14 }}>{t.desc}</div>
            </div>
            {/* Write review */}
            {!myReview ? (
              <div style={{ background: C.white, borderRadius: 20, padding: 20, marginBottom: 20,
                boxShadow: "0 2px 12px #D44C7A0D" }}>
                <div style={{ fontWeight: 700, color: C.dark, marginBottom: 12, fontSize: 16 }}>✍️ 写下你的评价</div>
                <Stars val={reviewRating} onSet={setReviewRating} size={28} />
                <textarea value={reviewText} onChange={e => setReviewText(e.target.value)}
                  placeholder="这杯奶茶怎么样？" rows={3}
                  style={{ width: "100%", border: `1.5px solid ${C.border}`, borderRadius: 12,
                    padding: 12, fontSize: 14, resize: "none", fontFamily: "inherit",
                    color: C.dark, outline: "none", boxSizing: "border-box", marginTop: 10 }} />
                <BtnPrimary onClick={() => submitReview(t.id)} style={{ marginTop: 12 }}>发布评价</BtnPrimary>
              </div>
            ) : (
              <div style={{ background: C.primaryBg, borderRadius: 20, padding: 20, marginBottom: 20,
                border: `1.5px solid ${C.border}` }}>
                <div style={{ fontWeight: 700, color: C.primary, marginBottom: 6 }}>✅ 你的评价</div>
                <Stars val={myReview.rating} />
                <div style={{ color: C.dark, margin: "8px 0 4px", lineHeight: 1.6 }}>{myReview.text}</div>
              </div>
            )}
            {/* All reviews */}
            <div style={{ background: C.white, borderRadius: 20, padding: 20, boxShadow: "0 2px 12px #D44C7A0D" }}>
              <div style={{ fontWeight: 700, color: C.dark, marginBottom: 12, fontSize: 16 }}>
                💬 所有评价 {reviews.length > 0 && <span style={{ fontSize: 13, color: C.dark50, fontWeight: 500 }}>({reviews.length}条)</span>}
              </div>
              {reviewsLoading ? <Spinner /> : reviews.length === 0 ? (
                <div style={{ color: C.dark25, fontSize: 14 }}>还没有人评价，来第一个吧！</div>
              ) : reviews.map((r, i) => (
                <div key={i} style={{ borderTop: i > 0 ? `1px solid ${C.border}` : "none", paddingTop: i > 0 ? 12 : 0, marginTop: i > 0 ? 12 : 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                    <span style={{ fontWeight: 700, color: C.dark }}>{r.username}</span>
                    <Stars val={r.rating} size={13} />
                  </div>
                  <div style={{ color: C.dark50, fontSize: 14, lineHeight: 1.5 }}>{r.text}</div>
                  <div style={{ fontSize: 11, color: C.dark25, marginTop: 4 }}>
                    {new Date(r.created_at).toLocaleDateString("zh-CN")}
                  </div>
                </div>
              ))}
            </div>
          </>}
        </div>
      </div>
    );
  }

  // ── MAIN LAYOUT ────────────────────────────────────
  return (
    <div style={{ fontFamily: "'PingFang SC',sans-serif", minHeight: "100vh", background: C.bg }}>
      <nav style={{ background: C.white, borderBottom: `1px solid ${C.border}`, padding: "0 32px",
        display: "flex", alignItems: "center", justifyContent: "space-between", height: 62,
        position: "sticky", top: 0, zIndex: 100, boxShadow: "0 2px 10px #D44C7A08" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Cup color={C.primary} size={32} unlocked />
          <span style={{ fontWeight: 900, fontSize: 18, color: C.primary }}>奶茶星球</span>
        </div>
        <div style={{ display: "flex", gap: 2 }}>
          {navItems.map(({ k, ic, lb }) => (
            <button key={k} onClick={() => setPage(k)}
              style={{ background: page === k ? C.primaryBg : "transparent", border: "none",
                borderRadius: 10, padding: "7px 14px", fontWeight: page === k ? 700 : 500,
                fontSize: 14, cursor: "pointer", color: page === k ? C.primary : C.dark50, transition: "all .2s" }}>
              {ic} {lb}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 20 }}>{curUser.avatar}</span>
          <span style={{ fontWeight: 600, color: C.dark, fontSize: 14 }}>{curUser.name}</span>
          <button onClick={logout} style={{ background: C.primaryBg, border: "none", borderRadius: 10,
            padding: "5px 12px", fontSize: 13, color: C.primary, fontWeight: 600, cursor: "pointer" }}>退出</button>
        </div>
      </nav>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 24px" }}>

        {/* HOME */}
        {page === "home" && <>
          <div style={{ background: `linear-gradient(135deg,${C.primary},${C.primary50})`,
            borderRadius: 28, padding: "40px 48px", marginBottom: 36,
            display: "flex", justifyContent: "space-between", alignItems: "center", overflow: "hidden", position: "relative" }}>
            <div style={{ zIndex: 2 }}>
              <div style={{ color: "white", opacity: .8, fontSize: 13, marginBottom: 6 }}>欢迎回来 {curUser.avatar} {curUser.name}！</div>
              <div style={{ color: "white", fontSize: 34, fontWeight: 900, lineHeight: 1.2, marginBottom: 20 }}>喜茶菜单<br />全攻略 🧋</div>
              <div style={{ display: "flex", background: "white", borderRadius: 14, padding: "10px 16px",
                gap: 8, alignItems: "center", maxWidth: 340, boxShadow: "0 4px 16px #0002" }}>
                <span>🔍</span>
                <input value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="搜索中英文名、标签…"
                  style={{ border: "none", outline: "none", flex: 1, fontSize: 14, color: C.dark, fontFamily: "inherit" }}
                  onFocus={() => setPage("menu")} />
              </div>
            </div>
            <div style={{ display: "flex" }}>
              {[C.primary50, "#7C3AED", "#059669"].map((c, i) => (
                <div key={i} style={{ marginLeft: i ? -25 : 0, zIndex: 3 - i }}>
                  <Cup color={c} size={110} unlocked animate />
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 32 }}>
            {[
              { label: "菜单总款数", val: total, icon: "🧋", color: C.primary, sub: "喜茶全系列" },
              { label: "已解锁", val: unlockedCount, icon: "✅", color: "#059669", sub: `${Math.round(unlockedCount / total * 100)}% 完成度` },
              { label: "未解锁", val: total - unlockedCount, icon: "🔒", color: "#6B7280", sub: "还在等你探索" },
            ].map(({ label, val, icon, color, sub }) => (
              <div key={label} style={{ background: C.white, borderRadius: 20, padding: "20px 22px",
                boxShadow: "0 2px 12px #D44C7A0D", border: `1px solid ${C.border}` }}>
                <div style={{ fontSize: 28 }}>{icon}</div>
                <div style={{ fontSize: 34, fontWeight: 900, color, marginTop: 4 }}>{val}</div>
                <div style={{ fontWeight: 700, color: C.dark, fontSize: 14 }}>{label}</div>
                <div style={{ color: C.dark25, fontSize: 12, marginTop: 2 }}>{sub}</div>
              </div>
            ))}
          </div>

          <div style={{ background: C.white, borderRadius: 20, padding: "20px 24px", marginBottom: 32,
            boxShadow: "0 2px 12px #D44C7A0D", border: `1px solid ${C.border}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
              <span style={{ fontWeight: 700, color: C.dark }}>🗺️ 探索进度</span>
              <span style={{ fontWeight: 700, color: C.primary }}>{unlockedCount}/{total}</span>
            </div>
            <ProgressBar value={unlockedCount} max={total} />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, flexWrap: "wrap", gap: 8 }}>
              {ALL_CATEGORIES.filter(c => c !== "全部").map(cat => {
                const ct = HEYTEA_MENU.filter(t => t.category === cat).length;
                const cu = HEYTEA_MENU.filter(t => t.category === cat && isUnlocked(t.id)).length;
                return (
                  <div key={cat} style={{ textAlign: "center", fontSize: 12 }}>
                    <div style={{ fontWeight: 700, color: cu === ct ? C.primary : C.dark50 }}>{cu}/{ct}</div>
                    <div style={{ color: C.dark25 }}>{cat}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {ALL_CATEGORIES.filter(c => c !== "全部").map(cat => {
            const catTeas = HEYTEA_MENU.filter(t => t.category === cat);
            const cu = catTeas.filter(t => isUnlocked(t.id)).length;
            return (
              <div key={cat} style={{ marginBottom: 32 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                  <div style={{ fontWeight: 800, fontSize: 17, color: C.dark }}>{cat}
                    <span style={{ marginLeft: 8, fontSize: 13, fontWeight: 500, color: C.dark50 }}>({cu}/{catTeas.length} 已解锁)</span>
                  </div>
                  <button onClick={() => { setCatF(cat); setPage("menu"); }}
                    style={{ background: C.primaryBg, border: "none", borderRadius: 10, padding: "5px 12px",
                      fontSize: 13, color: C.primary, fontWeight: 600, cursor: "pointer" }}>查看全部 →</button>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))", gap: 14 }}>
                  {catTeas.map(t => (
                    <TeaCard key={t.id} t={t} unlocked={isUnlocked(t.id)}
                      onView={setDetail} onFav={toggleFav} isFav={isFav(t.id)} />
                  ))}
                </div>
              </div>
            );
          })}
        </>}

        {/* MENU */}
        {page === "menu" && <>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h2 style={{ margin: 0, fontSize: 24, fontWeight: 900, color: C.dark }}>
              🧋 喜茶菜单
              <span style={{ fontSize: 14, fontWeight: 500, color: C.dark50, marginLeft: 10 }}>
                共 {filtered.length} 款 · {filtered.filter(t => isUnlocked(t.id)).length} 已解锁
              </span>
            </h2>
          </div>
          <div style={{ background: C.white, borderRadius: 14, padding: "10px 16px",
            display: "flex", gap: 8, alignItems: "center", marginBottom: 16, border: `1.5px solid ${C.border}` }}>
            <span>🔍</span>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="搜索名称、标签…"
              style={{ border: "none", outline: "none", flex: 1, fontSize: 14, color: C.dark, fontFamily: "inherit" }} />
            {search && <button onClick={() => setSearch("")}
              style={{ background: "none", border: "none", cursor: "pointer", color: C.dark25, fontSize: 16 }}>✕</button>}
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
            {ALL_CATEGORIES.map(c => (
              <button key={c} onClick={() => setCatF(c)}
                style={{ border: "none", borderRadius: 99, padding: "7px 16px", fontSize: 13, fontWeight: 600,
                  cursor: "pointer", transition: "all .2s",
                  background: catF === c ? C.primary : C.primaryBg, color: catF === c ? C.white : C.primary }}>
                {c}
                {c !== "全部" && <span style={{ marginLeft: 5, opacity: .7, fontSize: 11 }}>
                  ({HEYTEA_MENU.filter(t => t.category === c && isUnlocked(t.id)).length}/{HEYTEA_MENU.filter(t => t.category === c).length})
                </span>}
              </button>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(190px,1fr))", gap: 16 }}>
            {filtered.map(t => (
              <TeaCard key={t.id} t={t} unlocked={isUnlocked(t.id)}
                onView={setDetail} onFav={toggleFav} isFav={isFav(t.id)} />
            ))}
          </div>
        </>}

        {/* FAVORITES */}
        {page === "favorites" && <>
          <h2 style={{ margin: "0 0 24px", fontSize: 24, fontWeight: 900, color: C.dark }}>❤️ 我的收藏</h2>
          {!curUser.favorites?.length
            ? <div style={{ textAlign: "center", padding: 64, color: C.dark25 }}>
                <div style={{ fontSize: 48, marginBottom: 8 }}>🧋</div>
                <div>还没有收藏，去菜单探索吧～</div>
              </div>
            : <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(190px,1fr))", gap: 16 }}>
                {curUser.favorites.map(id => { const t = HEYTEA_MENU.find(x => x.id === id); return t && (
                  <TeaCard key={id} t={t} unlocked={isUnlocked(id)} onView={setDetail} onFav={toggleFav} isFav={true} />
                ); })}
              </div>
          }
        </>}

        {/* PROFILE */}
        {page === "profile" && (
          <div style={{ maxWidth: 700, margin: "0 auto" }}>
            <div style={{ background: `linear-gradient(135deg,${C.primary},${C.primary50})`,
              borderRadius: 24, padding: "36px 40px", marginBottom: 24, display: "flex", alignItems: "center", gap: 24 }}>
              <div style={{ fontSize: 68 }}>{curUser.avatar}</div>
              <div>
                <div style={{ color: "white", fontWeight: 900, fontSize: 24 }}>{curUser.name}</div>
                <div style={{ color: "white", opacity: .75, marginBottom: 14, fontSize: 13 }}>@{curUser.username}</div>
                <div style={{ display: "flex", gap: 28 }}>
                  {[["解锁", unlockedCount], ["收藏", curUser.favorites?.length || 0]].map(([lb, v]) => (
                    <div key={lb} style={{ color: "white", textAlign: "center" }}>
                      <div style={{ fontWeight: 900, fontSize: 22 }}>{v}</div>
                      <div style={{ opacity: .75, fontSize: 12 }}>{lb}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div style={{ background: C.white, borderRadius: 20, padding: 22, marginBottom: 20, boxShadow: "0 2px 12px #D44C7A0D" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontWeight: 700, color: C.dark }}>🗺️ 喜茶解锁进度</span>
                <span style={{ color: C.primary, fontWeight: 700 }}>{unlockedCount}/{total}</span>
              </div>
              <ProgressBar value={unlockedCount} max={total} />
            </div>
            <div style={{ background: C.white, borderRadius: 20, padding: 22, marginBottom: 20, boxShadow: "0 2px 12px #D44C7A0D" }}>
              <div style={{ fontWeight: 700, color: C.dark, marginBottom: 10 }}>🏷️ 我的口味偏好</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {ALL_TAGS.map(tag => {
                  const sel = curUser.fav_tags?.includes(tag);
                  return (
                    <button key={tag} onClick={() => toggleTag(tag)}
                      style={{ border: "none", borderRadius: 99, padding: "6px 14px", fontSize: 13, fontWeight: 600,
                        cursor: "pointer", background: sel ? C.primary : C.primaryBg, color: sel ? C.white : C.primary }}>
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>
            <div style={{ textAlign: "center" }}>
              <button onClick={logout} style={{ background: C.primaryBg, border: "none", borderRadius: 12,
                padding: "10px 24px", color: C.primary, fontWeight: 700, fontSize: 14, cursor: "pointer" }}>退出登录</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const lbS = { display: "block", fontSize: 13, fontWeight: 600, color: C.dark50, marginBottom: 5 };
const inS = { display: "block", width: "100%", border: `1.5px solid #F0D0DA`, borderRadius: 12,
  padding: "10px 14px", fontSize: 14, outline: "none", boxSizing: "border-box",
  color: "#1A1A2E", fontFamily: "inherit", marginBottom: 14 };