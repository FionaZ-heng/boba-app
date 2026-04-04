import { useState, useEffect } from "react";

const SUPA_URL = "https://glwnffbfhnebdjgmjnyd.supabase.co";
const SUPA_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdsd25mZmJmaG5lYmRqZ21qbnlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUyNzU0NjIsImV4cCI6MjA5MDg1MTQ2Mn0.Yd5r7b_uxiuLS8A_Lk0uCRTgFGjZuSXed-J7XJbYHys";

const db = {
  async query(table, options = {}) {
    let url = `${SUPA_URL}/rest/v1/${table}?`;
    if (options.select) url += `select=${options.select}&`;
    if (options.filter) url += `${options.filter}&`;
    const res = await fetch(url, { headers: { "apikey": SUPA_KEY, "Authorization": `Bearer ${SUPA_KEY}` } });
    return options.single ? (d => Array.isArray(d) ? d[0] : d)(await res.json()) : res.json();
  },
  async insert(table, body) {
    const res = await fetch(`${SUPA_URL}/rest/v1/${table}`, {
      method: "POST",
      headers: { "apikey": SUPA_KEY, "Authorization": `Bearer ${SUPA_KEY}`, "Content-Type": "application/json", "Prefer": "return=representation" },
      body: JSON.stringify(body)
    });
    return res.json();
  },
  async update(table, filter, body) {
    const res = await fetch(`${SUPA_URL}/rest/v1/${table}?${filter}`, {
      method: "PATCH",
      headers: { "apikey": SUPA_KEY, "Authorization": `Bearer ${SUPA_KEY}`, "Content-Type": "application/json", "Prefer": "return=representation" },
      body: JSON.stringify(body)
    });
    return res.json();
  }
};

// ── i18n strings ───────────────────────────────────────
const T = {
  zh: {
    appName: "奶茶星球", appSub: "探索 · 分享 · 解锁每一杯美好",
    login: "登录", register: "注册", logout: "退出", loggingIn: "请稍候...",
    nickname: "昵称", avatar: "头像", username: "用户名", password: "密码",
    loginBtn: "🌸 登录", registerBtn: "✨ 注册",
    syncNote: "数据实时同步 · 多设备通用 ☁️",
    userNotFound: "用户不存在", wrongPw: "密码错误", fillAll: "请填写所有字段",
    userExists: "用户名已存在", registerFail: "注册失败，请重试",
    navHome: "发现", navMenu: "菜单", navFav: "收藏", navProfile: "我的",
    heroWelcome: "欢迎回来", heroTitle: "奶茶星球 🧋", heroSub: "已收录 5 大品牌",
    brandsLabel: "品牌总览", searchPlaceholder: "搜索奶茶名称…",
    totalBrands: "收录品牌", totalTeas: "总款数", totalUnlocked: "已解锁",
    brandsContinue: "持续增加中", teasSub: "各品牌合计", completePct: "完成度",
    unlocked: "已解锁", locked: "未解锁", favorites: "收藏",
    menuTitle: "菜单", menuCount: "款", menuUnlocked: "已解锁",
    allCat: "全部", searchMenu: "搜索名称、标签…",
    favTitle: "我的收藏", favEmpty: "还没有收藏，去菜单探索吧～",
    profileTitle: "我的", progressTitle: "各品牌解锁进度",
    tasteTitle: "我的口味偏好", reviewsTitle: "我的评价", noReviews: "还没有写过评价",
    back: "← 返回", mystery: "??? 神秘款", unlockHint: "探索更多来解锁 ✨",
    descTitle: "📝 口味描述", writeReview: "✍️ 写下你的评价", reviewPlaceholder: "这杯奶茶怎么样？",
    submitReview: "发布评价", myReviewTitle: "✅ 你的评价",
    allReviews: "💬 所有评价", noReviewsYet: "还没有人评价，来第一个吧！",
    addFav: "🤍 收藏", removeFav: "❤️ 已收藏",
    mysteryTitle: "🔒 神秘款式", mysteryHint: "解锁更多奶茶来揭晓！",
    loading: "加载中...", reviews: "条评价",
    viewAll: "查看全部 →", teas: "款",
  },
  en: {
    appName: "Boba Planet", appSub: "Explore · Share · Unlock Every Sip",
    login: "Login", register: "Sign Up", logout: "Logout", loggingIn: "Loading...",
    nickname: "Nickname", avatar: "Avatar", username: "Username", password: "Password",
    loginBtn: "🌸 Login", registerBtn: "✨ Sign Up",
    syncNote: "Synced in real-time · Works across devices ☁️",
    userNotFound: "User not found", wrongPw: "Wrong password", fillAll: "Please fill in all fields",
    userExists: "Username already taken", registerFail: "Registration failed, please retry",
    navHome: "Discover", navMenu: "Menu", navFav: "Favorites", navProfile: "Profile",
    heroWelcome: "Welcome back", heroTitle: "Boba Planet 🧋", heroSub: "5 Brands & Counting",
    brandsLabel: "Brand Overview", searchPlaceholder: "Search drinks…",
    totalBrands: "Brands", totalTeas: "Total Drinks", totalUnlocked: "Unlocked",
    brandsContinue: "More coming soon", teasSub: "Across all brands", completePct: "completion",
    unlocked: "Unlocked", locked: "Locked", favorites: "Favorites",
    menuTitle: "Menu", menuCount: "items", menuUnlocked: "unlocked",
    allCat: "All", searchMenu: "Search name or tag…",
    favTitle: "My Favorites", favEmpty: "No favorites yet — go explore the menu!",
    profileTitle: "Profile", progressTitle: "Unlock Progress by Brand",
    tasteTitle: "My Taste Preferences", reviewsTitle: "My Reviews", noReviews: "No reviews yet",
    back: "← Back", mystery: "??? Mystery", unlockHint: "Explore more to unlock ✨",
    descTitle: "📝 Description", writeReview: "✍️ Write a Review", reviewPlaceholder: "How was it?",
    submitReview: "Post Review", myReviewTitle: "✅ Your Review",
    allReviews: "💬 All Reviews", noReviewsYet: "No reviews yet — be the first!",
    addFav: "🤍 Save", removeFav: "❤️ Saved",
    mysteryTitle: "🔒 Mystery Drink", mysteryHint: "Unlock more drinks to reveal this one!",
    loading: "Loading...", reviews: "reviews",
    viewAll: "View all →", teas: "drinks",
  }
};

const C = {
  primary:"#D44C7A", primary50:"#E8829E", primaryBg:"#FDE8EE",
  yellow:"#F5B731", dark:"#1A1A2E", dark50:"#555566", dark25:"#AAAAAA",
  border:"#F0D0DA", bg:"#FDF6F8", white:"#FFFFFF",
};

const BRANDS = {
  heytea:    { name:"喜茶",    nameEN:"HEYTEA",     color:"#D44C7A", emoji:"🩷", bg:"#FDE8EE" },
  nayuki:    { name:"奈雪的茶", nameEN:"Nayuki",     color:"#7C3AED", emoji:"💜", bg:"#F3E8FF" },
  chabaidao: { name:"茶百道",  nameEN:"Chabaidao",  color:"#D97706", emoji:"🧡", bg:"#FEF3C7" },
  mixue:     { name:"蜜雪冰城", nameEN:"Mixue",      color:"#DC2626", emoji:"❤️", bg:"#FEE2E2" },
  gumig:     { name:"古茗",    nameEN:"Gumig",      color:"#059669", emoji:"💚", bg:"#D1FAE5" },
};

const getBrandName = (key, lang) => lang === "zh" ? BRANDS[key].name : BRANDS[key].nameEN;

const ALL_MENU = [
  { id:101, brand:"heytea", category:"IN SEASON",  categoryEN:"In Season",   nameZH:"橘子冰茶",         name:"Very Tangerine Blast",               price:"S$6.82", tags:["绿茶","布丁","波波"], tagsEN:["Green Tea","Pudding","Boba"], desc:"鲜剥蜜橘配皇家碧螺绿茶，搭配桂花布丁和波波。", descEN:"Fresh peeled tangerine with Aqua Green tea, osmanthus pudding and boba." },
  { id:102, brand:"heytea", category:"清爽系列",    categoryEN:"Refreshing",  nameZH:"芒果西柚波波",     name:"Mango Grapefruit Pops",              price:"S$6.54", tags:["芒果","西柚","波波"], tagsEN:["Mango","Grapefruit","Boba"], desc:"新鲜芒果配碧螺绿茶与西柚果肉。", descEN:"Fresh mango with green tea and grapefruit pulp." },
  { id:103, brand:"heytea", category:"清爽系列",    categoryEN:"Refreshing",  nameZH:"芒果茶",           name:"Very Mango Tea",                     price:"S$7.98", tags:["芒果","绿茶"], tagsEN:["Mango","Green Tea"], desc:"时令芒果配清爽碧螺绿茶。", descEN:"Seasonal mango with refreshing Aqua Green tea." },
  { id:104, brand:"heytea", category:"清爽系列",    categoryEN:"Refreshing",  nameZH:"西柚爆爆",         name:"Very Grapefruit Boom",               price:"S$5.03", tags:["西柚","茉莉绿茶"], tagsEN:["Grapefruit","Jasmine Tea"], desc:"清爽西柚果肉配茉莉绿茶。", descEN:"Fresh grapefruit pulp with jasmine green tea." },
  { id:105, brand:"heytea", category:"清爽系列",    categoryEN:"Refreshing",  nameZH:"草莓蜜桃融合",     name:"Very Strawberry Peach Fusion",       price:"S$7.89", tags:["草莓","蜜桃"], tagsEN:["Strawberry","Peach"], desc:"草莓芝士与蜜桃芝士的梦幻融合。", descEN:"A dreamy fusion of strawberry and peach cheezo." },
  { id:106, brand:"heytea", category:"招牌系列",    categoryEN:"Signature",   nameZH:"多肉葡萄芝士",     name:"Very Grape Cheezo",                  price:"S$9.32", tags:["葡萄","芝士"], tagsEN:["Grape","Cheese"], desc:"2018年原创。手剥巨峰葡萄配优质绿茶。", descEN:"Original 2018. Hand-peeled Kyoho grapes with premium green tea." },
  { id:107, brand:"heytea", category:"招牌系列",    categoryEN:"Signature",   nameZH:"多肉芒果芝士",     name:"Mango Cheezo Original",              price:"S$9.32", tags:["芒果","芝士"], tagsEN:["Mango","Cheese"], desc:"2017年原创。时令芒果配碧螺绿茶与芝士。", descEN:"Original 2017. Seasonal mango with Aqua Green tea and cheezo." },
  { id:108, brand:"heytea", category:"醇厚系列",    categoryEN:"Comfort",     nameZH:"芝士黑糖波波鲜奶", name:"Roasted Brown BoBo Milk w/Cheezo",   price:"S$5.92", tags:["黑糖","波波","芝士"], tagsEN:["Brown Sugar","Boba","Cheese"], desc:"2012年原创。黑糖波波配鲜奶芝士。", descEN:"Original 2012. Brown sugar boba with fresh milk and cheezo." },
  { id:109, brand:"heytea", category:"醇厚系列",    categoryEN:"Comfort",     nameZH:"芋泥波波奶茶",     name:"Taro Bobo Milk Tea",                 price:"S$4.22", tags:["芋泥","波波"], tagsEN:["Taro","Boba"], desc:"芋泥+芋泥波波，纯芋泥爱好者必选。", descEN:"Taro paste + taro boba, a must for taro lovers." },
  { id:110, brand:"heytea", category:"经典系列",    categoryEN:"Classics",    nameZH:"芝士茉莉绿茶",     name:"Regal Aqua Green Jasmine Cheezo",    price:"S$3.85", tags:["绿茶","茉莉","芝士"], tagsEN:["Green Tea","Jasmine","Cheese"], desc:"2012年原创芝士茶。", descEN:"The original cheezo tea since 2012." },
  { id:111, brand:"heytea", category:"经典系列",    categoryEN:"Classics",    nameZH:"纯茉莉绿茶",       name:"Pure Regal Aqua Green Jasmine Tea",  price:"S$2.96", tags:["绿茶","茉莉"], tagsEN:["Green Tea","Jasmine"], desc:"优质绿茶，清爽茉莉香气。", descEN:"Premium green tea with refreshing jasmine aroma." },
  { id:112, brand:"heytea", category:"冰淇淋",      categoryEN:"Ice Cream",   nameZH:"波波圣代",         name:"BOBO SUNDAE",                        price:"S$4.30", tags:["冰淇淋","黑糖","波波"], tagsEN:["Ice Cream","Brown Sugar","Boba"], desc:"浓郁奶茶冰淇淋配黑糖波波。", descEN:"Rich milk tea ice cream with brown sugar boba." },
  { id:201, brand:"nayuki", category:"鲜果茶",      categoryEN:"Fresh Fruit", nameZH:"霸气草莓",         name:"Strawberry King",                    price:"¥29", tags:["草莓","芝士"], tagsEN:["Strawberry","Cheese"], desc:"超大颗新鲜草莓配盐焗芝士。", descEN:"Extra large fresh strawberries with salted cheezo." },
  { id:202, brand:"nayuki", category:"鲜果茶",      categoryEN:"Fresh Fruit", nameZH:"霸气芒果",         name:"Mango King",                         price:"¥29", tags:["芒果","芝士"], tagsEN:["Mango","Cheese"], desc:"新鲜芒果铺满杯口，配浓郁芝士奶盖。", descEN:"Fresh mango covering the cup with rich cheezo." },
  { id:203, brand:"nayuki", category:"鲜果茶",      categoryEN:"Fresh Fruit", nameZH:"霸气西柚",         name:"Grapefruit King",                    price:"¥26", tags:["西柚","绿茶"], tagsEN:["Grapefruit","Green Tea"], desc:"大量西柚果肉配清爽绿茶。", descEN:"Abundant grapefruit pulp with refreshing green tea." },
  { id:204, brand:"nayuki", category:"鲜果茶",      categoryEN:"Fresh Fruit", nameZH:"霸气葡萄",         name:"Grape King",                         price:"¥28", tags:["葡萄","绿茶"], tagsEN:["Grape","Green Tea"], desc:"鲜榨巨峰葡萄配绿茶，紫色梦幻。", descEN:"Freshly pressed Kyoho grape with green tea." },
  { id:205, brand:"nayuki", category:"奶茶",        categoryEN:"Milk Tea",    nameZH:"鸭屎香奶茶",       name:"Duck Poo Oolong Milk Tea",            price:"¥22", tags:["乌龙","鲜奶"], tagsEN:["Oolong","Fresh Milk"], desc:"凤凰单丛鸭屎香搭配新鲜牛奶。", descEN:"Phoenix Dan Cong oolong with fresh milk." },
  { id:206, brand:"nayuki", category:"奶茶",        categoryEN:"Milk Tea",    nameZH:"血糯米奶茶",       name:"Black Rice Milk Tea",                price:"¥24", tags:["糯米","红茶","鲜奶"], tagsEN:["Glutinous Rice","Black Tea","Fresh Milk"], desc:"软糯血糯米配浓郁奶茶。", descEN:"Soft black glutinous rice with rich milk tea." },
  { id:207, brand:"nayuki", category:"软欧包",      categoryEN:"Soft Bread",  nameZH:"霸气芋泥包",       name:"Taro Soft Bread",                    price:"¥18", tags:["芋泥","软欧包"], tagsEN:["Taro","Soft Bread"], desc:"满满芋泥馅料，柔软欧包。", descEN:"Generously filled taro paste in soft bread." },
  { id:208, brand:"nayuki", category:"软欧包",      categoryEN:"Soft Bread",  nameZH:"芝士肉松包",       name:"Cheese Pork Floss Bread",            price:"¥16", tags:["芝士","肉松","软欧包"], tagsEN:["Cheese","Pork Floss","Soft Bread"], desc:"香浓芝士配肉松，咸甜交织。", descEN:"Rich cheese with pork floss, sweet-savory blend." },
  { id:209, brand:"nayuki", category:"气泡茶",      categoryEN:"Sparkling",   nameZH:"草莓气泡茶",       name:"Strawberry Sparkling Tea",           price:"¥25", tags:["草莓","气泡"], tagsEN:["Strawberry","Sparkling"], desc:"新鲜草莓配气泡水，清爽起泡。", descEN:"Fresh strawberry with sparkling water." },
  { id:210, brand:"nayuki", category:"气泡茶",      categoryEN:"Sparkling",   nameZH:"葡萄气泡茶",       name:"Grape Sparkling Tea",                price:"¥25", tags:["葡萄","气泡"], tagsEN:["Grape","Sparkling"], desc:"葡萄汁与气泡的完美结合。", descEN:"Perfect fusion of grape juice and sparkling water." },
  { id:301, brand:"chabaidao", category:"招牌系列", categoryEN:"Signature",   nameZH:"杨枝甘露",         name:"Mango Pomelo Sago",                  price:"¥22", tags:["芒果","西柚","椰奶","西米"], tagsEN:["Mango","Pomelo","Coconut Milk","Sago"], desc:"港式经典，芒果+西柚+椰奶+西米。", descEN:"Hong Kong classic: mango, pomelo, coconut milk & sago." },
  { id:302, brand:"chabaidao", category:"招牌系列", categoryEN:"Signature",   nameZH:"黑糖珍珠奶茶",     name:"Brown Sugar Pearl Milk Tea",         price:"¥16", tags:["黑糖","珍珠","鲜奶"], tagsEN:["Brown Sugar","Pearl","Fresh Milk"], desc:"虎纹黑糖，Q弹珍珠，香浓鲜奶。", descEN:"Tiger-stripe brown sugar, chewy pearls, fresh milk." },
  { id:303, brand:"chabaidao", category:"招牌系列", categoryEN:"Signature",   nameZH:"芋圆奶茶",         name:"Taro Ball Milk Tea",                 price:"¥18", tags:["芋圆","奶茶"], tagsEN:["Taro Ball","Milk Tea"], desc:"手工芋圆Q弹有嚼劲，奶茶醇厚。", descEN:"Handmade chewy taro balls with rich milk tea." },
  { id:304, brand:"chabaidao", category:"鲜果茶",  categoryEN:"Fresh Fruit", nameZH:"满杯红柚",         name:"Full Cup Red Grapefruit",            price:"¥20", tags:["红柚","绿茶"], tagsEN:["Red Grapefruit","Green Tea"], desc:"满满红柚果肉，配清爽绿茶。", descEN:"Cup filled with red grapefruit pulp and green tea." },
  { id:305, brand:"chabaidao", category:"鲜果茶",  categoryEN:"Fresh Fruit", nameZH:"波波椰椰",         name:"BoBo Coconut",                       price:"¥19", tags:["椰果","波波","椰奶"], tagsEN:["Coconut Jelly","Boba","Coconut Milk"], desc:"双重波波加椰果，椰奶奶底。", descEN:"Double boba with coconut jelly and coconut milk base." },
  { id:306, brand:"chabaidao", category:"奶茶",    categoryEN:"Milk Tea",    nameZH:"茉莉奶绿",         name:"Jasmine Milk Green Tea",             price:"¥14", tags:["茉莉","绿茶","鲜奶"], tagsEN:["Jasmine","Green Tea","Fresh Milk"], desc:"清新茉莉花香，配绿茶与鲜奶。", descEN:"Fresh jasmine aroma with green tea and milk." },
  { id:307, brand:"chabaidao", category:"奶茶",    categoryEN:"Milk Tea",    nameZH:"乌龙拿铁",         name:"Oolong Latte",                       price:"¥17", tags:["乌龙","鲜奶"], tagsEN:["Oolong","Fresh Milk"], desc:"乌龙茶香配细腻鲜奶。", descEN:"Delicate oolong aroma paired with smooth fresh milk." },
  { id:308, brand:"chabaidao", category:"冰沙",    categoryEN:"Ice Blend",   nameZH:"芒果冰沙",         name:"Mango Ice Blend",                    price:"¥21", tags:["芒果","冰沙"], tagsEN:["Mango","Ice Blend"], desc:"新鲜芒果打成冰沙，夏天必喝。", descEN:"Fresh mango blended into a refreshing summer slush." },
  { id:401, brand:"mixue",  category:"招牌系列",   categoryEN:"Signature",   nameZH:"冰鲜柠檬水",       name:"Fresh Lemon Water",                  price:"¥4",  tags:["柠檬","气泡"], tagsEN:["Lemon","Sparkling"], desc:"超值经典，新鲜柠檬配气泡水。", descEN:"Classic value drink: fresh lemon with sparkling water." },
  { id:402, brand:"mixue",  category:"招牌系列",   categoryEN:"Signature",   nameZH:"草莓奶昔",         name:"Strawberry Milkshake",               price:"¥8",  tags:["草莓","奶昔"], tagsEN:["Strawberry","Milkshake"], desc:"浓郁草莓奶昔，甜蜜可爱。", descEN:"Rich strawberry milkshake, sweet and lovely." },
  { id:403, brand:"mixue",  category:"招牌系列",   categoryEN:"Signature",   nameZH:"满杯葡萄",         name:"Full Cup Grape",                     price:"¥10", tags:["葡萄","绿茶"], tagsEN:["Grape","Green Tea"], desc:"葡萄果汁满杯，配绿茶底。", descEN:"Cup full of grape juice on a green tea base." },
  { id:404, brand:"mixue",  category:"冰淇淋",     categoryEN:"Ice Cream",   nameZH:"经典甜筒",         name:"Classic Ice Cream Cone",             price:"¥2",  tags:["冰淇淋"], tagsEN:["Ice Cream"], desc:"蜜雪冰城招牌甜筒，两块钱的快乐！", descEN:"Mixue's iconic cone — happiness for ¥2!" },
  { id:405, brand:"mixue",  category:"奶茶",       categoryEN:"Milk Tea",    nameZH:"珍珠奶茶",         name:"Pearl Milk Tea",                     price:"¥7",  tags:["珍珠","奶茶"], tagsEN:["Pearl","Milk Tea"], desc:"经典珍珠奶茶，平价实惠。", descEN:"Classic pearl milk tea at an unbeatable price." },
  { id:406, brand:"mixue",  category:"奶茶",       categoryEN:"Milk Tea",    nameZH:"芋圆奶茶",         name:"Taro Ball Milk Tea",                 price:"¥9",  tags:["芋圆","奶茶"], tagsEN:["Taro Ball","Milk Tea"], desc:"软糯芋圆配香浓奶茶。", descEN:"Soft taro balls with rich milk tea." },
  { id:407, brand:"mixue",  category:"鲜果茶",     categoryEN:"Fresh Fruit", nameZH:"芒果茶",           name:"Mango Tea",                          price:"¥8",  tags:["芒果","绿茶"], tagsEN:["Mango","Green Tea"], desc:"新鲜芒果配绿茶。", descEN:"Fresh mango with green tea." },
  { id:408, brand:"mixue",  category:"鲜果茶",     categoryEN:"Fresh Fruit", nameZH:"西柚茉莉茶",       name:"Grapefruit Jasmine Tea",             price:"¥9",  tags:["西柚","茉莉绿茶"], tagsEN:["Grapefruit","Jasmine Tea"], desc:"西柚果肉配茉莉绿茶。", descEN:"Grapefruit pulp with jasmine green tea." },
  { id:501, brand:"gumig",  category:"招牌系列",   categoryEN:"Signature",   nameZH:"乌龙奶茶",         name:"Oolong Milk Tea",                    price:"¥13", tags:["乌龙","鲜奶"], tagsEN:["Oolong","Fresh Milk"], desc:"古茗经典乌龙奶茶，茶香浓郁。", descEN:"Gumig classic oolong milk tea, rich in tea aroma." },
  { id:502, brand:"gumig",  category:"招牌系列",   categoryEN:"Signature",   nameZH:"芋圆仙草冻",       name:"Taro Ball Grass Jelly",              price:"¥15", tags:["芋圆","仙草","奶茶"], tagsEN:["Taro Ball","Grass Jelly","Milk Tea"], desc:"手工芋圆配清凉仙草，消暑必选。", descEN:"Handmade taro balls with cooling grass jelly." },
  { id:503, brand:"gumig",  category:"鲜果茶",     categoryEN:"Fresh Fruit", nameZH:"椰椰芒芒",         name:"Coconut Mango",                      price:"¥16", tags:["椰果","芒果","绿茶"], tagsEN:["Coconut","Mango","Green Tea"], desc:"椰香与芒果的绝妙组合。", descEN:"A perfect combo of coconut and mango." },
  { id:504, brand:"gumig",  category:"鲜果茶",     categoryEN:"Fresh Fruit", nameZH:"杨梅冰茶",         name:"Bayberry Ice Tea",                   price:"¥17", tags:["杨梅","绿茶","气泡"], tagsEN:["Bayberry","Green Tea","Sparkling"], desc:"新鲜杨梅配冰凉绿茶，酸甜开胃。", descEN:"Fresh bayberry with iced green tea, sweet and tangy." },
  { id:505, brand:"gumig",  category:"奶茶",       categoryEN:"Milk Tea",    nameZH:"芝士乌龙",         name:"Cheese Oolong",                      price:"¥17", tags:["乌龙","芝士"], tagsEN:["Oolong","Cheese"], desc:"浓郁芝士奶盖配乌龙茶。", descEN:"Rich cheezo topping on oolong tea." },
  { id:506, brand:"gumig",  category:"奶茶",       categoryEN:"Milk Tea",    nameZH:"燕麦奶茶",         name:"Oat Milk Tea",                       price:"¥16", tags:["燕麦","奶茶"], tagsEN:["Oat","Milk Tea"], desc:"健康燕麦奶配浓郁茶底。", descEN:"Healthy oat milk with a rich tea base." },
  { id:507, brand:"gumig",  category:"特调",       categoryEN:"Specials",    nameZH:"古茗黑糖波波",     name:"Gumig Brown Sugar BoBo",             price:"¥18", tags:["黑糖","波波","鲜奶"], tagsEN:["Brown Sugar","Boba","Fresh Milk"], desc:"古茗版虎纹黑糖，波波粒粒饱满。", descEN:"Gumig's tiger-stripe brown sugar with plump boba." },
  { id:508, brand:"gumig",  category:"特调",       categoryEN:"Specials",    nameZH:"桂花乌龙冻",       name:"Osmanthus Oolong Jelly",             price:"¥19", tags:["桂花","乌龙","仙草"], tagsEN:["Osmanthus","Oolong","Grass Jelly"], desc:"桂花香配乌龙茶与仙草冻。", descEN:"Osmanthus fragrance with oolong and grass jelly." },
];

const DEFAULT_UNLOCKED = [101,102,103,201,301,401,501];

function loadSession() { try { const s=localStorage.getItem("boba_session"); return s?JSON.parse(s):null; } catch { return null; } }
function saveSession(u) { try { u?localStorage.setItem("boba_session",JSON.stringify(u)):localStorage.removeItem("boba_session"); } catch {} }
function loadLang() { try { return localStorage.getItem("boba_lang")||"zh"; } catch { return "zh"; } }
function saveLang(l) { try { localStorage.setItem("boba_lang",l); } catch {} }

function Cup({ color="#D44C7A", size=80, unlocked=true, animate=false }) {
  const c = unlocked ? color : "#D1D5DB";
  return (
    <svg width={size} height={size*1.15} viewBox="0 0 90 104" style={animate?{animation:"bob 2.5s ease-in-out infinite"}:{}}>
      <style>{`@keyframes bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}`}</style>
      {unlocked&&<rect x="57" y="1" width="6" height="30" rx="3" fill="#A78BFA"/>}
      <ellipse cx="45" cy="101" rx="26" ry="3.5" fill="#0001"/>
      <path d="M16 34 L21 86 Q21 92 27 92 L63 92 Q69 92 69 86 L74 34 Z" fill={c}/>
      <ellipse cx="28" cy="60" rx="5" ry="13" fill="white" opacity="0.18" transform="rotate(-8,28,60)"/>
      <rect x="11" y="27" width="68" height="11" rx="5.5" fill={unlocked?"#FECDD3":"#E5E7EB"}/>
      <ellipse cx="45" cy="27" rx="34" ry="8" fill={unlocked?"#FFE4E6":"#F3F4F6"}/>
      {unlocked?(<>
        <circle cx="37" cy="62" r="3.5" fill="white" opacity="0.95"/>
        <circle cx="53" cy="62" r="3.5" fill="white" opacity="0.95"/>
        <circle cx="38" cy="62" r="1.8" fill="#3D1A2E"/>
        <circle cx="54" cy="62" r="1.8" fill="#3D1A2E"/>
        <circle cx="39" cy="61" r=".7" fill="white"/>
        <circle cx="55" cy="61" r=".7" fill="white"/>
        <path d="M38 71 Q45 77 52 71" stroke="#3D1A2E" strokeWidth="2" fill="none" strokeLinecap="round"/>
        <ellipse cx="32" cy="67" rx="4.5" ry="2.5" fill="#FCA5A5" opacity="0.5"/>
        <ellipse cx="58" cy="67" rx="4.5" ry="2.5" fill="#FCA5A5" opacity="0.5"/>
        {[[25,82],[34,85],[44,83],[54,85],[63,82]].map(([x,y],i)=>(
          <circle key={i} cx={x} cy={y} r="2.8" fill="white" opacity="0.28"/>
        ))}
      </>):<text x="45" y="73" textAnchor="middle" fontSize="22">🔒</text>}
    </svg>
  );
}

function Stars({ val, onSet, size=14 }) {
  const [h,setH]=useState(0);
  return (
    <span style={{display:"flex",gap:1}}>
      {[1,2,3,4,5].map(i=>(
        <span key={i} onClick={()=>onSet&&onSet(i)}
          onMouseEnter={()=>onSet&&setH(i)} onMouseLeave={()=>onSet&&setH(0)}
          style={{fontSize:size,cursor:onSet?"pointer":"default",lineHeight:1,
            color:(onSet?(h||val):val)>=i?C.yellow:"#E5E7EB"}}>★</span>
      ))}
    </span>
  );
}

function PrimaryBtn({ children, onClick, color=C.primary, disabled=false, style={} }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      background:disabled?"#E5E7EB":`linear-gradient(135deg,${color},${color}cc)`,
      color:disabled?C.dark25:"white", border:"none", borderRadius:12,
      padding:"11px 24px", fontWeight:700, fontSize:14,
      cursor:disabled?"not-allowed":"pointer",
      boxShadow:disabled?"none":`0 4px 16px ${color}44`,
      transition:"transform .15s", ...style }}
      onMouseEnter={e=>!disabled&&(e.currentTarget.style.transform="translateY(-2px)")}
      onMouseLeave={e=>(e.currentTarget.style.transform="translateY(0)")}>
      {children}
    </button>
  );
}

// ── Language toggle button ─────────────────────────────
function LangToggle({ lang, setLang }) {
  return (
    <button onClick={()=>{ const n=lang==="zh"?"en":"zh"; setLang(n); saveLang(n); }}
      style={{ background: C.primaryBg, border: `1.5px solid ${C.border}`,
        borderRadius: 20, padding: "5px 14px", cursor: "pointer",
        fontWeight: 700, fontSize: 13, color: C.primary,
        display: "flex", alignItems: "center", gap: 6, transition: "all .2s" }}
      onMouseEnter={e=>e.currentTarget.style.background=C.primary50.replace("50","25")||"#f9d4e0"}
      onMouseLeave={e=>e.currentTarget.style.background=C.primaryBg}>
      🌐 {lang === "zh" ? "EN" : "中文"}
    </button>
  );
}

function TeaCard({ t, unlocked, onView, onFav, isFav, lang }) {
  const brand = BRANDS[t.brand];
  const col = brand.color;
  const displayName = lang==="zh" ? t.nameZH : t.name;
  const displayTags = lang==="zh" ? t.tags : t.tagsEN;
  const displayBrand = getBrandName(t.brand, lang);
  return (
    <div onClick={()=>onView(t)} style={{background:C.white,borderRadius:20,overflow:"hidden",
      cursor:"pointer",border:`1px solid ${C.border}`,transition:"transform .2s,box-shadow .2s",
      boxShadow:"0 2px 12px #0008"}}
      onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.style.boxShadow=`0 12px 28px ${col}22`;}}
      onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="0 2px 12px #0008";}}>
      <div style={{background:unlocked?`linear-gradient(135deg,${col}22,${col}0A)`:"#F9FAFB",
        height:150,display:"flex",alignItems:"center",justifyContent:"center",position:"relative"}}>
        <Cup color={col} size={100} unlocked={unlocked} animate={unlocked}/>
        <span style={{position:"absolute",top:8,left:10,background:col,color:"white",
          fontSize:10,fontWeight:700,borderRadius:8,padding:"2px 8px"}}>{displayBrand}</span>
        {onFav&&unlocked&&(
          <button onClick={e=>{e.stopPropagation();onFav(t.id);}}
            style={{position:"absolute",top:8,right:10,background:"white",border:"none",
              borderRadius:"50%",width:30,height:30,fontSize:15,cursor:"pointer",
              boxShadow:"0 2px 8px #0001",display:"flex",alignItems:"center",justifyContent:"center"}}>
            {isFav?"❤️":"🤍"}
          </button>
        )}
        {!unlocked&&(
          <span style={{position:"absolute",bottom:8,left:"50%",transform:"translateX(-50%)",
            background:"#374151",color:"white",fontSize:10,fontWeight:700,
            borderRadius:8,padding:"2px 8px",whiteSpace:"nowrap"}}>🔒 {T[lang].locked}</span>
        )}
      </div>
      <div style={{padding:"12px 14px"}}>
        <div style={{fontSize:13,fontWeight:800,color:C.dark,marginBottom:1}}>{unlocked?displayName:T[lang].mystery}</div>
        <div style={{fontSize:11,color:C.dark50,marginBottom:6}}>{unlocked?(lang==="zh"?t.name:t.nameZH):T[lang].unlockHint}</div>
        {unlocked?(<>
          <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:8}}>
            {displayTags.slice(0,3).map(tag=>(
              <span key={tag} style={{background:brand.bg,color:col,fontSize:10,borderRadius:6,padding:"1px 7px",fontWeight:600}}>{tag}</span>
            ))}
          </div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <span style={{fontWeight:800,fontSize:16,color:col}}>{t.price}</span>
            <span style={{fontSize:10,color:C.dark25,background:"#F3F4F6",borderRadius:6,padding:"2px 7px"}}>
              {lang==="zh"?t.category:t.categoryEN}
            </span>
          </div>
        </>):<div style={{fontSize:12,color:C.dark25,fontStyle:"italic"}}>{T[lang].unlockHint}</div>}
      </div>
    </div>
  );
}

function ProgressBar({ value, max, color=C.primary }) {
  return (
    <div style={{background:"#F3F4F6",borderRadius:99,height:8,overflow:"hidden"}}>
      <div style={{background:`linear-gradient(90deg,${color},${color}99)`,
        height:"100%",width:`${Math.round(value/max*100)}%`,borderRadius:99,transition:"width .6s"}}/>
    </div>
  );
}

function Spinner({ lang="zh" }) {
  return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",padding:40,gap:12}}>
      <div style={{width:36,height:36,border:`4px solid ${C.primaryBg}`,
        borderTop:`4px solid ${C.primary}`,borderRadius:"50%",animation:"spin .8s linear infinite"}}/>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <span style={{color:C.dark50}}>{T[lang].loading}</span>
    </div>
  );
}

export default function App() {
  const [lang, setLang] = useState(()=>loadLang());
  const t = T[lang];
  const [curUser,setCurUserState]=useState(null);
  const [pageLoading,setPageLoading]=useState(true);
  const [authMode,setAuthMode]=useState("login");
  const [authForm,setAuthForm]=useState({user:"",pw:"",name:"",avatar:"🐰"});
  const [authErr,setAuthErr]=useState("");
  const [authLoading,setAuthLoading]=useState(false);
  const [page,setPage]=useState("home");
  const [activeBrand,setActiveBrand]=useState("heytea");
  const [catF,setCatF]=useState("全部");
  const [search,setSearch]=useState("");
  const [detail,setDetail]=useState(null);
  const [reviews,setReviews]=useState([]);
  const [reviewText,setReviewText]=useState("");
  const [reviewRating,setReviewRating]=useState(0);

  useEffect(()=>{
    const saved=loadSession();
    if(saved){
      db.query("users",{filter:`username=eq.${saved.username}`,single:true})
        .then(u=>{ if(u?.username){setCurUserState(u);saveSession(u);} else saveSession(null); })
        .finally(()=>setPageLoading(false));
    } else setPageLoading(false);
  },[]);

  useEffect(()=>{
    if(!detail) return;
    db.query("reviews",{filter:`tea_id=eq.${detail.id}`,select:"*"}).then(d=>setReviews(Array.isArray(d)?d:[]));
  },[detail]);

  // Reset category filter label when lang changes
  useEffect(()=>{ setCatF(lang==="zh"?"全部":"All"); },[lang]);

  const setCurUser=u=>{setCurUserState(u);saveSession(u);};
  const login=async()=>{
    setAuthLoading(true);setAuthErr("");
    const u=await db.query("users",{filter:`username=eq.${authForm.user}`,single:true});
    if(!u?.username){setAuthErr(t.userNotFound);setAuthLoading(false);return;}
    if(u.password!==authForm.pw){setAuthErr(t.wrongPw);setAuthLoading(false);return;}
    setCurUser(u);setPage("home");setAuthLoading(false);
  };
  const register=async()=>{
    if(!authForm.user||!authForm.pw||!authForm.name){setAuthErr(t.fillAll);return;}
    setAuthLoading(true);setAuthErr("");
    const ex=await db.query("users",{filter:`username=eq.${authForm.user}`,single:true});
    if(ex?.username){setAuthErr(t.userExists);setAuthLoading(false);return;}
    const res=await db.insert("users",{username:authForm.user,password:authForm.pw,
      name:authForm.name,avatar:authForm.avatar,fav_tags:[],unlocked:DEFAULT_UNLOCKED,favorites:[]});
    const nu=Array.isArray(res)?res[0]:res;
    if(!nu?.username){setAuthErr(t.registerFail);setAuthLoading(false);return;}
    setCurUser(nu);setPage("home");setAuthLoading(false);
  };
  const logout=()=>{setCurUser(null);setPage("home");};
  const updateUser=async(fields)=>{
    const res=await db.update("users",`username=eq.${curUser.username}`,fields);
    const u=Array.isArray(res)?res[0]:res;
    if(u?.username) setCurUser(u);
  };
  const toggleFav=async id=>{
    const f=curUser.favorites||[];
    await updateUser({favorites:f.includes(id)?f.filter(x=>x!==id):[...f,id]});
  };
  const submitReview=async teaId=>{
    if(!reviewRating||!reviewText.trim()) return;
    await db.insert("reviews",{username:curUser.username,tea_id:teaId,rating:reviewRating,text:reviewText});
    const d=await db.query("reviews",{filter:`tea_id=eq.${teaId}`,select:"*"});
    setReviews(Array.isArray(d)?d:[]);
    setReviewText("");setReviewRating(0);
  };

  const isUnlocked=id=>curUser?.unlocked?.includes(id);
  const isFav=id=>curUser?.favorites?.includes(id);
  const totalAll=ALL_MENU.length;
  const unlockedAll=curUser?ALL_MENU.filter(x=>isUnlocked(x.id)).length:0;
  const brandMenu=ALL_MENU.filter(x=>x.brand===activeBrand);
  const allCatLabel = lang==="zh"?"全部":"All";
  const brandCats=[allCatLabel,...new Set(brandMenu.map(x=>lang==="zh"?x.category:x.categoryEN))];
  const filtered=brandMenu.filter(x=>{
    const c=catF===allCatLabel||(lang==="zh"?x.category:x.categoryEN)===catF;
    const s=!search||x.nameZH.includes(search)||x.name.toLowerCase().includes(search.toLowerCase());
    return c&&s;
  });

  const navItems=[
    {k:"home",ic:"🏠",lb:t.navHome},{k:"menu",ic:"🧋",lb:t.navMenu},
    {k:"favorites",ic:"❤️",lb:t.navFav},{k:"profile",ic:"👤",lb:t.navProfile}
  ];

  if(pageLoading) return <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:C.bg}}><Spinner lang={lang}/></div>;

  // ── AUTH ───────────────────────────────────────────
  if(!curUser) return (
    <div style={{minHeight:"100vh",background:`linear-gradient(135deg,${C.primaryBg},#F3E8FF)`,
      display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'PingFang SC',sans-serif",padding:20}}>
      {/* lang toggle top right */}
      <div style={{position:"fixed",top:16,right:20}}>
        <LangToggle lang={lang} setLang={setLang}/>
      </div>
      <div style={{background:C.white,borderRadius:28,padding:"40px 36px",width:"100%",maxWidth:420,boxShadow:"0 24px 64px #D44C7A22"}}>
        <div style={{textAlign:"center",marginBottom:28}}>
          <Cup color={C.primary} size={90} unlocked animate/>
          <div style={{fontSize:28,fontWeight:900,color:C.primary,marginTop:4}}>{t.appName}</div>
          <div style={{color:C.dark50,fontSize:13,marginTop:4}}>{t.appSub}</div>
          <div style={{display:"flex",gap:6,justifyContent:"center",marginTop:12,flexWrap:"wrap"}}>
            {Object.values(BRANDS).map(b=>(
              <span key={b.name} style={{background:b.bg,color:b.color,fontSize:12,fontWeight:700,borderRadius:99,padding:"3px 10px"}}>{b.emoji} {lang==="zh"?b.name:b.nameEN}</span>
            ))}
          </div>
        </div>
        <div style={{display:"flex",background:C.primaryBg,borderRadius:14,padding:4,marginBottom:22}}>
          {[["login",t.login],["register",t.register]].map(([m,lb])=>(
            <button key={m} onClick={()=>{setAuthMode(m);setAuthErr("");}}
              style={{flex:1,border:"none",borderRadius:12,padding:"9px 0",fontWeight:700,fontSize:14,cursor:"pointer",
                background:authMode===m?C.white:"transparent",color:authMode===m?C.primary:C.dark50,
                boxShadow:authMode===m?"0 2px 8px #D44C7A22":"none"}}>{lb}</button>
          ))}
        </div>
        {authMode==="register"&&<>
          <label style={lbS}>{t.nickname}</label>
          <input style={inS} placeholder={t.nickname} value={authForm.name} onChange={e=>setAuthForm(f=>({...f,name:e.target.value}))}/>
          <label style={lbS}>{t.avatar}</label>
          <div style={{display:"flex",gap:8,marginBottom:14}}>
            {["🐰","🐱","🐻","🦊","🐼","🌸","🦋","🍓"].map(av=>(
              <span key={av} onClick={()=>setAuthForm(f=>({...f,avatar:av}))}
                style={{fontSize:22,cursor:"pointer",borderRadius:10,padding:"4px 5px",
                  border:`2px solid ${authForm.avatar===av?C.primary:"transparent"}`,
                  background:authForm.avatar===av?C.primaryBg:"transparent"}}>{av}</span>
            ))}
          </div>
        </>}
        <label style={lbS}>{t.username}</label>
        <input style={inS} placeholder={t.username} value={authForm.user} onChange={e=>setAuthForm(f=>({...f,user:e.target.value}))}/>
        <label style={lbS}>{t.password}</label>
        <input style={inS} type="password" placeholder={t.password} value={authForm.pw} onChange={e=>setAuthForm(f=>({...f,pw:e.target.value}))}/>
        {authErr&&<div style={{color:C.primary,fontSize:13,background:C.primaryBg,borderRadius:10,padding:"8px 12px",marginBottom:14,textAlign:"center"}}>{authErr}</div>}
        <PrimaryBtn onClick={authMode==="login"?login:register} disabled={authLoading} style={{width:"100%",padding:14}}>
          {authLoading?t.loggingIn:authMode==="login"?t.loginBtn:t.registerBtn}
        </PrimaryBtn>
        <div style={{textAlign:"center",marginTop:14,fontSize:12,color:C.dark25}}>{t.syncNote}</div>
      </div>
    </div>
  );

  // ── DETAIL ─────────────────────────────────────────
  if(detail){
    const item=detail; const ul=isUnlocked(item.id);
    const brand=BRANDS[item.brand]; const col=brand.color;
    const myR=reviews.find(r=>r.username===curUser.username);
    const avg=reviews.length?(reviews.reduce((s,r)=>s+r.rating,0)/reviews.length).toFixed(1):null;
    const displayName=lang==="zh"?item.nameZH:item.name;
    const displayTags=lang==="zh"?item.tags:item.tagsEN;

    const displayDesc=lang==="zh"?item.desc:item.descEN;
    return (
      <div style={{fontFamily:"'PingFang SC',sans-serif",minHeight:"100vh",background:C.bg}}>
        <div style={{background:`linear-gradient(135deg,${col}33,${col}11)`,padding:"28px 28px 32px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
            <button onClick={()=>setDetail(null)}
              style={{background:"white",border:"none",borderRadius:12,padding:"8px 16px",
                fontSize:14,fontWeight:600,color:C.dark,cursor:"pointer",boxShadow:"0 2px 8px #0001"}}>{t.back}</button>
            <LangToggle lang={lang} setLang={setLang}/>
          </div>
          <div style={{display:"flex",gap:28,alignItems:"center",flexWrap:"wrap"}}>
            <Cup color={col} size={130} unlocked={ul} animate={ul}/>
            <div style={{flex:1,minWidth:220}}>
              {ul?(<>
                <div style={{display:"inline-block",background:col,color:"white",fontSize:12,fontWeight:700,borderRadius:10,padding:"3px 12px",marginBottom:8}}>
                  {brand.emoji} {getBrandName(item.brand,lang)}
                </div>
                <div style={{fontSize:28,fontWeight:900,color:C.dark,marginBottom:2}}>{displayName}</div>
                <div style={{fontSize:15,color:C.dark50,marginBottom:10}}>{lang==="zh"?item.name:item.nameZH}</div>
                {avg&&<div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
                  <Stars val={Math.round(avg)} size={16}/><span style={{fontWeight:700}}>{avg}</span>
                  <span style={{color:C.dark50,fontSize:13}}>({reviews.length} {t.reviews})</span>
                </div>}
                <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:14}}>
                  {displayTags.map(tag=><span key={tag} style={{background:brand.bg,color:col,fontSize:13,borderRadius:10,padding:"4px 12px",fontWeight:600}}>{tag}</span>)}
                </div>
                <div style={{fontSize:30,fontWeight:900,color:col,marginBottom:16}}>{item.price}</div>
                <PrimaryBtn color={col} onClick={()=>toggleFav(item.id)}>{isFav(item.id)?t.removeFav:t.addFav}</PrimaryBtn>
              </>):(
                <div>
                  <div style={{fontSize:28,fontWeight:900,color:C.dark25,marginBottom:8}}>{t.mysteryTitle}</div>
                  <div style={{color:C.dark50}}>{t.mysteryHint}</div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div style={{padding:"24px 28px",maxWidth:800,margin:"0 auto"}}>
          {ul&&<>
            <div style={{background:C.white,borderRadius:20,padding:20,marginBottom:20,boxShadow:"0 2px 12px #0008",borderLeft:`4px solid ${col}`}}>
              <div style={{fontWeight:700,color:C.dark,marginBottom:6}}>{t.descTitle}</div>
              <div style={{color:C.dark50,lineHeight:1.7,fontSize:14}}>{displayDesc}</div>
            </div>
            {!myR?(
              <div style={{background:C.white,borderRadius:20,padding:20,marginBottom:20,boxShadow:"0 2px 12px #0008"}}>
                <div style={{fontWeight:700,color:C.dark,marginBottom:12,fontSize:16}}>{t.writeReview}</div>
                <Stars val={reviewRating} onSet={setReviewRating} size={28}/>
                <textarea value={reviewText} onChange={e=>setReviewText(e.target.value)}
                  placeholder={t.reviewPlaceholder} rows={3}
                  style={{width:"100%",border:`1.5px solid ${C.border}`,borderRadius:12,padding:12,
                    fontSize:14,resize:"none",fontFamily:"inherit",color:C.dark,outline:"none",
                    boxSizing:"border-box",marginTop:10}}/>
                <PrimaryBtn color={col} onClick={()=>submitReview(item.id)} style={{marginTop:12}}>{t.submitReview}</PrimaryBtn>
              </div>
            ):(
              <div style={{background:brand.bg,borderRadius:20,padding:20,marginBottom:20,border:`1.5px solid ${col}33`}}>
                <div style={{fontWeight:700,color:col,marginBottom:6}}>{t.myReviewTitle}</div>
                <Stars val={myR.rating}/>
                <div style={{color:C.dark,margin:"8px 0 4px"}}>{myR.text}</div>
              </div>
            )}
            <div style={{background:C.white,borderRadius:20,padding:20,boxShadow:"0 2px 12px #0008"}}>
              <div style={{fontWeight:700,color:C.dark,marginBottom:12,fontSize:16}}>
                {t.allReviews} {reviews.length>0&&<span style={{fontSize:13,color:C.dark50,fontWeight:500}}>({reviews.length} {t.reviews})</span>}
              </div>
              {reviews.length===0?<div style={{color:C.dark25,fontSize:14}}>{t.noReviewsYet}</div>
                :reviews.map((r,i)=>(
                  <div key={i} style={{borderTop:i>0?`1px solid ${C.border}`:"none",paddingTop:i>0?12:0,marginTop:i>0?12:0}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                      <span style={{fontWeight:700,color:C.dark}}>{r.username}</span>
                      <Stars val={r.rating} size={13}/>
                    </div>
                    <div style={{color:C.dark50,fontSize:14}}>{r.text}</div>
                    <div style={{fontSize:11,color:C.dark25,marginTop:4}}>{new Date(r.created_at).toLocaleDateString(lang==="zh"?"zh-CN":"en-US")}</div>
                  </div>
                ))}
            </div>
          </>}
        </div>
      </div>
    );
  }

  // ── MAIN ───────────────────────────────────────────
  return (
    <div style={{fontFamily:"'PingFang SC',sans-serif",minHeight:"100vh",background:C.bg}}>
      <nav style={{background:C.white,borderBottom:`1px solid ${C.border}`,padding:"0 24px",
        display:"flex",alignItems:"center",justifyContent:"space-between",height:62,
        position:"sticky",top:0,zIndex:100,boxShadow:"0 2px 10px #D44C7A08"}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <Cup color={C.primary} size={32} unlocked/>
          <span style={{fontWeight:900,fontSize:18,color:C.primary}}>{t.appName}</span>
        </div>
        <div style={{display:"flex",gap:2}}>
          {navItems.map(({k,ic,lb})=>(
            <button key={k} onClick={()=>setPage(k)}
              style={{background:page===k?C.primaryBg:"transparent",border:"none",borderRadius:10,
                padding:"7px 12px",fontWeight:page===k?700:500,fontSize:14,cursor:"pointer",
                color:page===k?C.primary:C.dark50,transition:"all .2s"}}>{ic} {lb}</button>
          ))}
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          {/* 🌐 Language toggle */}
          <LangToggle lang={lang} setLang={setLang}/>
          <span style={{fontSize:20}}>{curUser.avatar}</span>
          <span style={{fontWeight:600,color:C.dark,fontSize:14}}>{curUser.name}</span>
          <button onClick={logout} style={{background:C.primaryBg,border:"none",borderRadius:10,
            padding:"5px 12px",fontSize:13,color:C.primary,fontWeight:600,cursor:"pointer"}}>{t.logout}</button>
        </div>
      </nav>

      <div style={{maxWidth:1200,margin:"0 auto",padding:"28px 24px"}}>

        {page==="home"&&<>
          <div style={{background:`linear-gradient(135deg,${C.primary},${C.primary50})`,
            borderRadius:28,padding:"40px 48px",marginBottom:32,
            display:"flex",justifyContent:"space-between",alignItems:"center",overflow:"hidden"}}>
            <div style={{zIndex:2}}>
              <div style={{color:"white",opacity:.8,fontSize:13,marginBottom:6}}>{t.heroWelcome} {curUser.avatar} {curUser.name}！</div>
              <div style={{color:"white",fontSize:32,fontWeight:900,lineHeight:1.2,marginBottom:8}}>{t.heroTitle}</div>
              <div style={{color:"white",opacity:.85,fontSize:14,marginBottom:20}}>{t.heroSub} · {totalAll} {t.menuCount}</div>
              <div style={{display:"flex",background:"white",borderRadius:14,padding:"10px 16px",
                gap:8,alignItems:"center",maxWidth:340,boxShadow:"0 4px 16px #0002"}}>
                <span>🔍</span>
                <input value={search} onChange={e=>setSearch(e.target.value)} placeholder={t.searchPlaceholder}
                  style={{border:"none",outline:"none",flex:1,fontSize:14,color:C.dark,fontFamily:"inherit"}}
                  onFocus={()=>setPage("menu")}/>
              </div>
            </div>
            <div style={{display:"flex"}}>
              {Object.values(BRANDS).slice(0,3).map((b,i)=>(
                <div key={b.name} style={{marginLeft:i?-28:0,zIndex:3-i}}>
                  <Cup color={b.color} size={105} unlocked animate/>
                </div>
              ))}
            </div>
          </div>

          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16,marginBottom:28}}>
            {[
              {label:t.totalBrands, val:Object.keys(BRANDS).length, icon:"🏪", color:C.primary, sub:t.brandsContinue},
              {label:t.totalTeas,   val:totalAll,                    icon:"🧋", color:"#7C3AED",  sub:t.teasSub},
              {label:t.totalUnlocked,val:unlockedAll,                icon:"✅", color:"#059669",  sub:`${Math.round(unlockedAll/totalAll*100)}% ${t.completePct}`},
            ].map(({label,val,icon,color,sub})=>(
              <div key={label} style={{background:C.white,borderRadius:20,padding:"18px 20px",
                boxShadow:"0 2px 12px #0008",border:`1px solid ${C.border}`}}>
                <div style={{fontSize:26}}>{icon}</div>
                <div style={{fontSize:32,fontWeight:900,color,marginTop:2}}>{val}</div>
                <div style={{fontWeight:700,color:C.dark,fontSize:14}}>{label}</div>
                <div style={{color:C.dark25,fontSize:12,marginTop:1}}>{sub}</div>
              </div>
            ))}
          </div>

          <div style={{fontWeight:800,fontSize:18,color:C.dark,marginBottom:16}}>{t.brandsLabel}</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))",gap:16,marginBottom:32}}>
            {Object.entries(BRANDS).map(([key,b])=>{
              const bMenu=ALL_MENU.filter(x=>x.brand===key);
              const bU=bMenu.filter(x=>isUnlocked(x.id)).length;
              return (
                <div key={key} onClick={()=>{setActiveBrand(key);setCatF(allCatLabel);setPage("menu");}}
                  style={{background:C.white,borderRadius:20,padding:"18px 20px",cursor:"pointer",
                    border:`1.5px solid ${b.color}22`,transition:"transform .2s,box-shadow .2s",boxShadow:"0 2px 12px #0008"}}
                  onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow=`0 10px 24px ${b.color}22`;}}
                  onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="0 2px 12px #0008";}}>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
                    <div style={{display:"flex",alignItems:"center",gap:10}}>
                      <div style={{background:b.bg,borderRadius:14,width:44,height:44,
                        display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>{b.emoji}</div>
                      <div>
                        <div style={{fontWeight:800,fontSize:16,color:C.dark}}>{getBrandName(key,lang)}</div>
                        <div style={{fontSize:12,color:C.dark50}}>{lang==="zh"?b.nameEN:b.name}</div>
                      </div>
                    </div>
                    <div style={{textAlign:"right"}}>
                      <div style={{fontWeight:700,color:b.color,fontSize:18}}>{bU}/{bMenu.length}</div>
                      <div style={{fontSize:11,color:C.dark25}}>{t.unlocked}</div>
                    </div>
                  </div>
                  <ProgressBar value={bU} max={bMenu.length} color={b.color}/>
                  <div style={{marginTop:8,fontSize:12,color:C.dark50}}>
                    {bMenu.slice(0,3).map(x=>lang==="zh"?x.nameZH:x.name).join("  ·  ")} ...
                  </div>
                </div>
              );
            })}
          </div>
        </>}

        {page==="menu"&&<>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
            <h2 style={{margin:0,fontSize:24,fontWeight:900,color:C.dark}}>
              🧋 {t.menuTitle}
              <span style={{fontSize:14,fontWeight:500,color:C.dark50,marginLeft:10}}>
                {filtered.length} {t.menuCount} · {filtered.filter(x=>isUnlocked(x.id)).length} {t.menuUnlocked}
              </span>
            </h2>
          </div>
          <div style={{display:"flex",gap:8,marginBottom:20,overflowX:"auto",paddingBottom:4,scrollbarWidth:"none"}}>
            {Object.entries(BRANDS).map(([key,b])=>(
              <button key={key} onClick={()=>{setActiveBrand(key);setCatF(allCatLabel);}}
                style={{display:"flex",alignItems:"center",gap:6,whiteSpace:"nowrap",border:"none",
                  borderRadius:14,padding:"10px 18px",fontWeight:700,fontSize:14,cursor:"pointer",flexShrink:0,
                  background:activeBrand===key?b.color:b.bg,color:activeBrand===key?"white":b.color,
                  boxShadow:activeBrand===key?`0 4px 16px ${b.color}44`:"none"}}>
                {b.emoji} {getBrandName(key,lang)}
                <span style={{fontSize:11,opacity:.75}}>
                  ({ALL_MENU.filter(x=>x.brand===key&&isUnlocked(x.id)).length}/{ALL_MENU.filter(x=>x.brand===key).length})
                </span>
              </button>
            ))}
          </div>
          <div style={{display:"flex",gap:12,marginBottom:16,flexWrap:"wrap",alignItems:"center"}}>
            <div style={{display:"flex",background:C.white,borderRadius:14,padding:"8px 14px",
              gap:8,alignItems:"center",flex:1,minWidth:200,border:`1.5px solid ${C.border}`}}>
              <span>🔍</span>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder={t.searchMenu}
                style={{border:"none",outline:"none",flex:1,fontSize:14,color:C.dark,fontFamily:"inherit"}}/>
              {search&&<button onClick={()=>setSearch("")} style={{background:"none",border:"none",cursor:"pointer",color:C.dark25,fontSize:16}}>✕</button>}
            </div>
          </div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:20}}>
            {brandCats.map(c=>{
              const bc=BRANDS[activeBrand];
              return (
                <button key={c} onClick={()=>setCatF(c)}
                  style={{border:"none",borderRadius:99,padding:"6px 14px",fontSize:13,fontWeight:600,cursor:"pointer",
                    background:catF===c?bc.color:bc.bg,color:catF===c?"white":bc.color}}>{c}</button>
              );
            })}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(190px,1fr))",gap:16}}>
            {filtered.map(x=>(
              <TeaCard key={x.id} t={x} unlocked={isUnlocked(x.id)} onView={setDetail}
                onFav={toggleFav} isFav={isFav(x.id)} lang={lang}/>
            ))}
          </div>
        </>}

        {page==="favorites"&&<>
          <h2 style={{margin:"0 0 24px",fontSize:24,fontWeight:900,color:C.dark}}>❤️ {t.favTitle}</h2>
          {!curUser.favorites?.length
            ?<div style={{textAlign:"center",padding:64,color:C.dark25}}>
              <div style={{fontSize:48,marginBottom:8}}>🧋</div><div>{t.favEmpty}</div>
            </div>
            :<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(190px,1fr))",gap:16}}>
              {curUser.favorites.map(id=>{const x=ALL_MENU.find(m=>m.id===id);return x&&(
                <TeaCard key={id} t={x} unlocked={isUnlocked(id)} onView={setDetail}
                  onFav={toggleFav} isFav={true} lang={lang}/>
              );})}
            </div>
          }
        </>}

        {page==="profile"&&(
          <div style={{maxWidth:700,margin:"0 auto"}}>
            <div style={{background:`linear-gradient(135deg,${C.primary},${C.primary50})`,
              borderRadius:24,padding:"36px 40px",marginBottom:24,display:"flex",alignItems:"center",gap:24}}>
              <div style={{fontSize:68}}>{curUser.avatar}</div>
              <div>
                <div style={{color:"white",fontWeight:900,fontSize:24}}>{curUser.name}</div>
                <div style={{color:"white",opacity:.75,marginBottom:14,fontSize:13}}>@{curUser.username}</div>
                <div style={{display:"flex",gap:28}}>
                  {[[t.unlocked,unlockedAll],[t.favorites,curUser.favorites?.length||0]].map(([lb,v])=>(
                    <div key={lb} style={{color:"white",textAlign:"center"}}>
                      <div style={{fontWeight:900,fontSize:22}}>{v}</div>
                      <div style={{opacity:.75,fontSize:12}}>{lb}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div style={{background:C.white,borderRadius:20,padding:22,marginBottom:20,boxShadow:"0 2px 12px #0008"}}>
              <div style={{fontWeight:700,color:C.dark,marginBottom:14}}>{t.progressTitle}</div>
              {Object.entries(BRANDS).map(([key,b])=>{
                const bMenu=ALL_MENU.filter(x=>x.brand===key);
                const bU=bMenu.filter(x=>isUnlocked(x.id)).length;
                return (
                  <div key={key} style={{marginBottom:14}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                      <span style={{fontWeight:600,color:C.dark,fontSize:14}}>{b.emoji} {getBrandName(key,lang)}</span>
                      <span style={{color:b.color,fontWeight:700,fontSize:14}}>{bU}/{bMenu.length}</span>
                    </div>
                    <ProgressBar value={bU} max={bMenu.length} color={b.color}/>
                  </div>
                );
              })}
            </div>
            <div style={{textAlign:"center"}}>
              <button onClick={logout} style={{background:C.primaryBg,border:"none",borderRadius:12,
                padding:"10px 24px",color:C.primary,fontWeight:700,fontSize:14,cursor:"pointer"}}>{t.logout}</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const lbS={display:"block",fontSize:13,fontWeight:600,color:C.dark50,marginBottom:5};
const inS={display:"block",width:"100%",border:`1.5px solid #F0D0DA`,borderRadius:12,
  padding:"10px 14px",fontSize:14,outline:"none",boxSizing:"border-box",color:"#1A1A2E",fontFamily:"inherit",marginBottom:14};