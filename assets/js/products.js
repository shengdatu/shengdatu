/* ==========================================================================
   产品数据 / PRODUCT DATA
   ==========================================================================
   每个产品有唯一编号 NO.x，客户按编号下单。
   Each product has a unique code NO.x so buyers can order by code.

   【怎么改产品】
   1) 改文字：直接改下面的 nameZh / nameEn / size / material 等
   2) 改图片：把你的图片命名成 no1.jpg、no2.jpg …… 放进
      assets/images/products/ 文件夹即可自动显示（无需改代码）
      支持 .jpg，如果你用 png，把下面的 image 字段后缀改成 .png
   3) 加产品：复制一整段 { ... } 粘贴在后面，改 code 为 "NO.9" 并递增
   4) 删产品：删掉整段 { ... }
   ========================================================================== */

window.PRODUCTS = [
  {
    code: "NO.1",
    type: "large",                       // large = 大款 / small = 小款
    image: "assets/images/products/no1.jpg",
    nameZh: "豪华五层猫爬架 · 通天柱款",
    nameEn: "Deluxe 5-Level Cat Tree with Floor-to-Ceiling Post",
    size: "60 × 45 × 165 cm",
    weight: "12.5 kg",
    material: { zh: "刨花板 + 短毛绒 + 天然剑麻绳", en: "Particle board + short plush + natural sisal rope" },
    features: {
      zh: ["双层猫窝 + 吊床", "3 根剑麻抓柱", "顶层观景平台", "承重 25kg，多猫家庭适用"],
      en: ["Double condo + hammock", "3 sisal scratching posts", "Top-level lookout platform", "25kg load capacity, multi-cat use"]
    },
    basePrice: 32.80,                    // 200-499 件单价（USD）
    carton: "1 pc/carton, 62×47×28 cm",
    qty20gp: 210, qty40hq: 520,
    hot: true
  },
  {
    code: "NO.2",
    type: "large",
    image: "assets/images/products/no2.jpg",
    nameZh: "多猫别墅猫爬架 · 双窝落地式",
    nameEn: "Multi-Cat Villa Cat Tower · Twin Condo",
    size: "70 × 50 × 150 cm",
    weight: "11.8 kg",
    material: { zh: "E1 级刨花板 + 长毛绒 + 剑麻", en: "E1 particle board + long plush + sisal" },
    features: {
      zh: ["2 个封闭猫窝", "宽体防倒底座", "可拆洗垫子", "适合 2-3 只成猫"],
      en: ["2 enclosed condos", "Wide anti-tip base", "Removable washable cushions", "Fits 2-3 adult cats"]
    },
    basePrice: 29.50,
    carton: "1 pc/carton, 72×52×26 cm",
    qty20gp: 230, qty40hq: 570,
    hot: true
  },
  {
    code: "NO.3",
    type: "large",
    image: "assets/images/products/no3.jpg",
    nameZh: "全剑麻通天柱猫爬架 · 加高款",
    nameEn: "Full-Sisal Tall Cat Tree · Extra Height",
    size: "55 × 55 × 180 cm",
    weight: "14.2 kg",
    material: { zh: "实木框架 + 全包剑麻 + 短毛绒", en: "Solid wood frame + full sisal wrap + short plush" },
    features: {
      zh: ["180cm 加高设计", "全柱剑麻包裹，耐抓耐磨", "顶部大平台", "可加装天花板支撑"],
      en: ["180cm extra-tall design", "Full sisal-wrapped posts, extra durable", "Large top platform", "Optional ceiling brace"]
    },
    basePrice: 38.90,
    carton: "1 pc/carton, 58×58×30 cm",
    qty20gp: 180, qty40hq: 450,
    hot: false
  },
  {
    code: "NO.4",
    type: "large",
    image: "assets/images/products/no4.jpg",
    nameZh: "转角大型猫爬架 · 带隧道",
    nameEn: "Corner Large Cat Tree with Tunnel",
    size: "80 × 55 × 170 cm",
    weight: "15.0 kg",
    material: { zh: "刨花板 + 珊瑚绒 + 剑麻绳", en: "Particle board + coral fleece + sisal rope" },
    features: {
      zh: ["猫隧道 + 吊床 + 双窝", "转角设计省空间", "4 根抓柱", "承重 30kg"],
      en: ["Cat tunnel + hammock + twin condo", "Space-saving corner design", "4 scratching posts", "30kg load capacity"]
    },
    basePrice: 42.60,
    carton: "1 pc/carton, 82×57×30 cm",
    qty20gp: 150, qty40hq: 380,
    hot: false
  },
  {
    code: "NO.5",
    type: "small",
    image: "assets/images/products/no5.jpg",
    nameZh: "三层小型猫爬架 · 入门爆款",
    nameEn: "3-Level Small Cat Tree · Best Seller",
    size: "40 × 40 × 90 cm",
    weight: "5.6 kg",
    material: { zh: "刨花板 + 短毛绒 + 剑麻", en: "Particle board + short plush + sisal" },
    features: {
      zh: ["三层结构，占地小", "1 个猫窝 + 1 个平台", "组装简单，5 分钟完成", "适合公寓、单猫家庭"],
      en: ["3 levels, small footprint", "1 condo + 1 platform", "Easy 5-minute assembly", "Ideal for apartments / single cat"]
    },
    basePrice: 14.80,
    carton: "2 pcs/carton, 42×42×22 cm",
    qty20gp: 620, qty40hq: 1540,
    hot: true
  },
  {
    code: "NO.6",
    type: "small",
    image: "assets/images/products/no6.jpg",
    nameZh: "单窝猫抓柱 · 剑麻立柱款",
    nameEn: "Single Condo Scratching Post",
    size: "38 × 38 × 75 cm",
    weight: "4.5 kg",
    material: { zh: "刨花板 + 短毛绒 + 天然剑麻", en: "Particle board + short plush + natural sisal" },
    features: {
      zh: ["1 个猫窝 + 顶部平台", "整柱剑麻，磨爪首选", "轻便易搬动", "亚马逊热销尺寸"],
      en: ["1 condo + top platform", "Full sisal post, great for claws", "Lightweight & portable", "Popular Amazon size"]
    },
    basePrice: 11.90,
    carton: "2 pcs/carton, 40×40×20 cm",
    qty20gp: 720, qty40hq: 1800,
    hot: false
  },
  {
    code: "NO.7",
    type: "small",
    image: "assets/images/products/no7.jpg",
    nameZh: "迷你四层猫爬架 · 带吊床",
    nameEn: "Mini 4-Level Cat Tree with Hammock",
    size: "45 × 35 × 100 cm",
    weight: "6.8 kg",
    material: { zh: "刨花板 + 长毛绒 + 剑麻绳", en: "Particle board + long plush + sisal rope" },
    features: {
      zh: ["四层错落布局", "帆布吊床", "2 根抓柱", "性价比高，适合商超渠道"],
      en: ["4 staggered levels", "Canvas hammock", "2 scratching posts", "Great value for retail channels"]
    },
    basePrice: 17.50,
    carton: "2 pcs/carton, 47×37×24 cm",
    qty20gp: 520, qty40hq: 1300,
    hot: true
  },
  {
    code: "NO.8",
    type: "small",
    image: "assets/images/products/no8.jpg",
    nameZh: "桌面／窗台小猫架 · 双层款",
    nameEn: "Desktop / Windowsill 2-Level Cat Perch",
    size: "35 × 30 × 60 cm",
    weight: "3.2 kg",
    material: { zh: "刨花板 + 珊瑚绒 + 剑麻", en: "Particle board + coral fleece + sisal" },
    features: {
      zh: ["双层紧凑设计", "可放窗台／桌面", "拆装方便，运费低", "促销引流款"],
      en: ["Compact 2-level design", "Fits windowsill / desktop", "Easy assembly, low freight", "Ideal promo / traffic item"]
    },
    basePrice: 9.60,
    carton: "4 pcs/carton, 37×32×22 cm",
    qty20gp: 1100, qty40hq: 2750,
    hot: false
  }
];
