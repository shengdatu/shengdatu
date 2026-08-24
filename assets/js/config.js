/* ==========================================================================
   站点全局配置 —— 只需要改这一个文件，全站生效
   SITE CONFIG —— Edit THIS FILE ONLY, changes apply to the whole website
   ==========================================================================
   【重要】把下面带 ★ 的项改成你自己的真实信息即可。
   [IMPORTANT] Replace every value marked with ★ with your real information.
   ========================================================================== */

window.SITE_CONFIG = {

  /* ---------- 1. 品牌信息 / Brand ---------- */
  brandZh: "盛达途宠物",              // ★ 中文品牌名
  brandEn: "PawNest",               // ★ 英文品牌名
  companyZh: "湖北盛达途国际贸易有限公司",   // ★ 中文公司全称
  companyEn: "PawNest Pet Products Co., Ltd.", // ★ 英文公司全称

  /* ---------- 2. 联系方式 / Contact ---------- */
  // ★ WhatsApp 号码：必须是国际格式，只留数字，不要 + 号、空格、横线
  //   例：中国手机 13812345678 → "8613812345678"（86 是中国国码）
  whatsapp: "8613800000000",
  whatsappDisplay: "+86 138 0000 0000",   // ★ 页面上显示的号码样式

  email: "sales@pawnest-example.com",     // ★ 收询盘的邮箱（务必改成你能收到邮件的邮箱）
  phone: "+86 138 0000 0000",             // ★ 电话
  wechat: "pawnest_sales",                // ★ 微信号（可留空 ""）

  addressZh: "中国 浙江省 金华市 义乌国际商贸城 XX 栋 XX 号",   // ★ 中文地址
  addressEn: "No.XX, Building XX, Yiwu International Trade City, Jinhua, Zhejiang, China", // ★ 英文地址

  /* ---------- 3. PayPal 收款 / PayPal ---------- */
  // 你提供的收款账户
  paypalAccount: "hoangkyshsj67@gmail.com",
  // paypal.me 链接。
  // 【注意】paypal.me 后面接的是 PayPal「用户名」，不是邮箱。
  //  请登录 paypal.me 设置一个用户名（例如 pawnest），然后把下面改成 "https://paypal.me/pawnest"
  //  在你设置好之前，网站会自动改用「邮箱转账指引」，客户依然可以付款到你的邮箱账户。
  paypalMe: "https://paypal.me/hoangkyshsj67@gmail.com",
  paypalMeIsValid: false,   // 设置好正式 paypal.me 用户名后，把这里改成 true

  /* ---------- 4. 询盘表单接收方式 / Inquiry form ---------- */
  // 默认 "mailto"：无需任何注册，客户点提交后自动打开他的邮件客户端，内容已填好。
  // 推荐 "formspree"：免费注册 https://formspree.io ，拿到表单 ID 填到下面，
  //   询盘会直接进你的邮箱，客户无需自己的邮箱客户端（体验最好）。
  formMode: "mailto",              // "mailto" 或 "formspree"
  formspreeId: "your_form_id",     // ★ 用 formspree 时填，例如 "xldeqvpk"

  /* ---------- 5. 批发规则 / Wholesale rules ---------- */
  moq: 200,                 // 起订量（件）
  mixMinPerModel: 50,       // 混批时单款最少件数
  tiers: [
    { min: 200,  max: 499,  discount: 1.00, labelZh: "200 - 499 件",   labelEn: "200 - 499 pcs"  },
    { min: 500,  max: 999,  discount: 0.90, labelZh: "500 - 999 件",   labelEn: "500 - 999 pcs"  },
    { min: 1000, max: null, discount: 0.85, labelZh: "1000 件以上",     labelEn: "1000+ pcs"      }
  ],
  currency: "USD",
  currencySymbol: "$",
  priceTerm: "FOB Ningbo/Shanghai",

  leadTimeZh: "15 - 25 天",
  leadTimeEn: "15 - 25 days",
  paymentZh: "30% 定金 + 70% 见提单副本付款 / 或 PayPal 全额",
  paymentEn: "30% deposit + 70% against B/L copy / or full payment via PayPal",

  /* ---------- 6. 上线后的网址（做 SEO 用，可暂时留空）---------- */
  siteUrl: ""   // 例："https://yourname.github.io/pawnest-wholesale/"
};
