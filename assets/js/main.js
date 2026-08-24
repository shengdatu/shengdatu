/* ==========================================================================
   PawNest 站点主逻辑 / MAIN SCRIPT
   功能：语言自动切换 · 产品渲染 · 阶梯价计算 · 询盘暂存 · 表单提交 · UI 交互
   一般情况下你不需要修改这个文件。
   ========================================================================== */
(function () {
  "use strict";

  var C = window.SITE_CONFIG, D = window.I18N, P = window.PRODUCTS || [];
  var LANG_KEY = "pawnest_lang", CART_KEY = "pawnest_inquiry";

  /* ================= 1. 语言 ================= */
  // 规则：先看用户是否手动选过（localStorage）→ 否则看浏览器语言 →
  //      浏览器是中文才显示中文，其他所有语言（国外客户）一律显示英文
  function detectLang() {
    var saved = null;
    try { saved = localStorage.getItem(LANG_KEY); } catch (e) {}
    if (saved === "zh" || saved === "en") return saved;

    var q = new URLSearchParams(location.search).get("lang");   // 支持 ?lang=en 直接指定
    if (q === "zh" || q === "en") return q;

    var list = navigator.languages && navigator.languages.length
      ? navigator.languages : [navigator.language || navigator.userLanguage || "en"];
    for (var i = 0; i < list.length; i++) {
      var L = String(list[i]).toLowerCase();
      if (L.indexOf("zh") === 0) {
        // 港澳台与新加坡的繁体中文用户也归中文
        return "zh";
      }
      if (L.indexOf("en") === 0) return "en";
    }
    return "en";   // 默认英文
  }

  var LANG = detectLang();

  // 取文案，并把品牌名替换成 config 里的设置
  function t(key) {
    var e = D[key];
    if (!e) return key;
    var s = e[LANG] || e.en || "";
    return s.replace(/派巢宠物/g, C.brandZh).replace(/PawNest/g, C.brandEn);
  }
  window.t = t;

  function applyI18n() {
    document.documentElement.lang = (LANG === "zh") ? "zh-CN" : "en";
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var s = t(el.getAttribute("data-i18n"));
      if (/<[a-z][\s\S]*>/i.test(s)) el.innerHTML = s; else el.textContent = s;
    });
    document.querySelectorAll("[data-i18n-ph]").forEach(function (el) {
      el.setAttribute("placeholder", t(el.getAttribute("data-i18n-ph")));
    });
    var tk = document.body.getAttribute("data-title-key");
    if (tk) document.title = t(tk);
    document.querySelectorAll(".langsw button").forEach(function (b) {
      b.classList.toggle("is-on", b.getAttribute("data-lang") === LANG);
    });
  }

  function setLang(l) {
    if (l === LANG) return;
    LANG = l;
    try { localStorage.setItem(LANG_KEY, l); } catch (e) {}
    applyI18n(); renderAll(); syncBar();
  }

  /* ================= 2. 配置注入 ================= */
  function waLink(text) {
    return "https://wa.me/" + C.whatsapp + "?text=" + encodeURIComponent(text ||
      (LANG === "zh"
        ? "你好，我在你们的网站看到猫爬架，想了解批发价格。"
        : "Hello, I found your cat trees on your website and would like to know your wholesale prices."));
  }

  function payLink() {
    return C.paypalMeIsValid ? C.paypalMe : "https://www.paypal.com/myaccount/transfer/homepage/pay";
  }

  function injectConfig() {
    var map = {
      "cfg-brand":      LANG === "zh" ? C.brandZh : C.brandEn,
      "cfg-company":    LANG === "zh" ? C.companyZh : C.companyEn,
      "cfg-email":      C.email,
      "cfg-phone":      C.phone,
      "cfg-whatsapp":   C.whatsappDisplay,
      "cfg-wechat":     C.wechat || "—",
      "cfg-address":    LANG === "zh" ? C.addressZh : C.addressEn,
      "cfg-paypal":     C.paypalAccount,
      "cfg-moq":        String(C.moq),
      "cfg-leadtime":   LANG === "zh" ? C.leadTimeZh : C.leadTimeEn,
      "cfg-payment":    LANG === "zh" ? C.paymentZh : C.paymentEn,
      "cfg-priceterm":  C.priceTerm,
      "cfg-year":       String(new Date().getFullYear())
    };
    Object.keys(map).forEach(function (k) {
      document.querySelectorAll("." + k).forEach(function (el) { el.textContent = map[k]; });
    });
    document.querySelectorAll(".js-wa").forEach(function (a) { a.href = waLink(a.getAttribute("data-wa-text")); });
    document.querySelectorAll(".js-mail").forEach(function (a) { a.href = "mailto:" + C.email; });
    document.querySelectorAll(".js-tel").forEach(function (a) { a.href = "tel:" + C.phone.replace(/[^\d+]/g, ""); });
    document.querySelectorAll(".js-pay").forEach(function (a) { a.href = payLink(); a.target = "_blank"; a.rel = "noopener"; });
  }

  /* ================= 3. 价格 ================= */
  function money(n) { return C.currencySymbol + n.toFixed(2); }
  function tierPrice(base, i) { return base * C.tiers[i].discount; }
  function tierLabel(i) { return LANG === "zh" ? C.tiers[i].labelZh : C.tiers[i].labelEn; }
  function discText(i) {
    var d = Math.round((1 - C.tiers[i].discount) * 100);
    if (!d) return LANG === "zh" ? "基础价" : "Base price";
    return LANG === "zh" ? ("省 " + d + "%") : ("Save " + d + "%");
  }
  function typeLabel(ty) { return ty === "large" ? t("common.large") : t("common.small"); }
  function pName(p) { return LANG === "zh" ? p.nameZh : p.nameEn; }
  function imgTag(p, cls) {
    var ph = "assets/images/placeholder/" + p.code.replace(/\./g, "").toLowerCase() + ".svg";
    return '<img src="' + p.image + '" alt="' + pName(p).replace(/"/g, "") + ' ' + p.code +
      '" loading="lazy" onerror="this.onerror=null;this.src=\'' + ph + '\'"' + (cls ? ' class="' + cls + '"' : '') + '>';
  }

  /* ================= 4. 产品卡渲染 ================= */
  function card(p) {
    return '' +
      '<article class="pcard">' +
        '<div class="pcard__media">' + imgTag(p) +
          '<span class="pcard__code">' + p.code + '</span>' +
          '<span class="pcard__tags">' +
            '<span class="tag tag--type">' + typeLabel(p.type) + '</span>' +
            (p.hot ? '<span class="tag tag--hot">' + t("common.hot") + '</span>' : '') +
          '</span>' +
        '</div>' +
        '<div class="pcard__body">' +
          '<h3 class="pcard__name">' + pName(p) + '</h3>' +
          '<p class="pcard__spec"><b>' + t("common.size") + '：</b>' + p.size +
            ' &nbsp;·&nbsp; <b>' + t("common.weight") + '：</b>' + p.weight + '</p>' +
          '<div class="pcard__price">' +
            '<div class="pcard__from">' + tierLabel(0) + '</div>' +
            '<div class="pcard__num">' + money(p.basePrice) + '<small>' + t("common.perPiece") + '</small></div>' +
            '<div class="pcard__disc">' + tierLabel(1) + ' → ' + money(tierPrice(p.basePrice, 1)) + '（' + discText(1) + '）</div>' +
            '<div class="pcard__btns">' +
              '<button class="btn btn--primary btn--sm js-add" data-code="' + p.code + '">' + t("common.addToInquiry") + '</button>' +
              '<a class="btn btn--ghost btn--sm js-wa" data-wa-text="' + waText(p) + '" target="_blank" rel="noopener">WhatsApp</a>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</article>';
  }

  function waText(p) {
    return (LANG === "zh"
      ? "你好，我想询价：" + p.code + " " + p.nameZh + "（" + p.size + "）。请报 200 件与 500 件的价格。"
      : "Hello, I would like a quote for " + p.code + " " + p.nameEn + " (" + p.size +
        "). Please quote for 200 pcs and 500 pcs.").replace(/"/g, "&quot;");
  }

  function row(p) {
    var tiers = C.tiers.map(function (tr, i) {
      return '<div' + (i === 1 ? ' class="is-best"' : '') + '>' +
        '<span>' + tierLabel(i) + '</span>' +
        '<b>' + money(tierPrice(p.basePrice, i)) + '</b>' +
        '<span style="color:var(--green);font-weight:700">' + discText(i) + '</span></div>';
    }).join("");

    var feats = (LANG === "zh" ? p.features.zh : p.features.en)
      .map(function (f) { return "<li>" + f + "</li>"; }).join("");

    return '' +
      '<article class="prow" data-type="' + p.type + '" id="' + p.code.replace(/\./g, "").toLowerCase() + '">' +
        '<div class="prow__media">' + imgTag(p) + '</div>' +
        '<div class="prow__body">' +
          '<div class="prow__head">' +
            '<span class="prow__code">' + p.code + '</span>' +
            '<span class="tag tag--type">' + typeLabel(p.type) + '</span>' +
            (p.hot ? '<span class="tag tag--hot">' + t("common.hot") + '</span>' : '') +
          '</div>' +
          '<h3 class="prow__name">' + pName(p) + '</h3>' +
          '<table class="spectable"><tbody>' +
            '<tr><th>' + t("common.size") + '</th><td>' + p.size + '</td></tr>' +
            '<tr><th>' + t("common.weight") + '</th><td>' + p.weight + '</td></tr>' +
            '<tr><th>' + t("common.material") + '</th><td>' + (LANG === "zh" ? p.material.zh : p.material.en) + '</td></tr>' +
            '<tr><th>' + t("common.carton") + '</th><td>' + p.carton + '</td></tr>' +
            '<tr><th>' + t("common.container") + '</th><td>20GP: ' + p.qty20gp + ' pcs &nbsp;·&nbsp; 40HQ: ' + p.qty40hq + ' pcs</td></tr>' +
          '</tbody></table>' +
          '<ul class="feat">' + feats + '</ul>' +
          '<div class="prow__foot">' +
            '<div><div style="font-size:.78rem;color:var(--ink-3);font-weight:650;margin-bottom:6px">' +
              t("common.priceTiers") + ' · ' + C.priceTerm + '</div>' +
              '<div class="tierbox">' + tiers + '</div></div>' +
            '<div class="btn-row">' +
              '<button class="btn btn--primary js-add" data-code="' + p.code + '">' + t("common.addToInquiry") + '</button>' +
              '<a class="btn btn--wa js-wa" data-wa-text="' + waText(p) + '" target="_blank" rel="noopener">' +
                waIcon(16) + t("common.whatsapp") + '</a>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</article>';
  }

  function waIcon(s) {
    return '<svg width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="currentColor">' +
      '<path d="M17.5 14.4c-.3-.2-1.8-.9-2.1-1-.3-.1-.5-.2-.7.1-.2.3-.7 1-.9 1.2-.2.2-.3.2-.6.1-.3-.2-1.2-.5-2.3-1.5-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6l.5-.6c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5 0-.2-.7-1.7-.9-2.3-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4s1 2.8 1.2 3c.1.2 1.9 3 4.7 4.2 2.3 1 2.8.8 3.3.7.5 0 1.6-.6 1.8-1.3.2-.6.2-1.2.2-1.3-.1-.1-.3-.2-.6-.4z"/>' +
      '<path d="M12 2C6.5 2 2 6.5 2 12c0 1.8.5 3.4 1.3 4.9L2 22l5.3-1.3c1.4.8 3 1.2 4.7 1.2 5.5 0 10-4.5 10-10S17.5 2 12 2zm0 18.2c-1.6 0-3-.4-4.3-1.2l-.3-.2-3.1.8.8-3-.2-.3C4.3 15 3.8 13.6 3.8 12 3.8 7.5 7.5 3.8 12 3.8S20.2 7.5 20.2 12 16.5 20.2 12 20.2z"/></svg>';
  }

  /* ================= 5. 阶梯价总表 ================= */
  function priceTable() {
    var box = document.getElementById("tierTable");
    if (!box) return;
    var large = P.filter(function (p) { return p.type === "large"; });
    var small = P.filter(function (p) { return p.type === "small"; });
    var minL = Math.min.apply(null, large.map(function (p) { return p.basePrice; }));
    var minS = Math.min.apply(null, small.map(function (p) { return p.basePrice; }));

    var rows = C.tiers.map(function (tr, i) {
      var d = Math.round((1 - tr.discount) * 100);
      return '<tr' + (i > 0 ? ' class="is-hl"' : '') + '>' +
        '<td><b>' + tierLabel(i) + '</b></td>' +
        '<td>' + (d ? (LANG === "zh" ? (d + "% OFF") : (d + "% OFF")) : (LANG === "zh" ? "基础价" : "Base")) + '</td>' +
        '<td>' + (LANG === "zh" ? "低至 " : "from ") + '<b>' + money(tierPrice(minL, i)) + '</b>' + t("common.perPiece") + '</td>' +
        '<td>' + (LANG === "zh" ? "低至 " : "from ") + '<b>' + money(tierPrice(minS, i)) + '</b>' + t("common.perPiece") + '</td>' +
        '</tr>';
    }).join("");

    box.innerHTML = '<table class="data"><thead><tr>' +
      '<th>' + t("home.tierCol1") + '</th><th>' + t("home.tierCol2") + '</th>' +
      '<th>' + t("home.tierCol3") + '</th><th>' + t("home.tierCol4") + '</th>' +
      '</tr></thead><tbody>' + rows + '</tbody></table>';
  }

  /* ================= 6. 询盘暂存 ================= */
  function getCart() {
    try { return JSON.parse(localStorage.getItem(CART_KEY) || "[]"); } catch (e) { return []; }
  }
  function setCart(a) {
    try { localStorage.setItem(CART_KEY, JSON.stringify(a)); } catch (e) {}
    syncBar();
  }
  function addCart(code) {
    var a = getCart();
    if (a.indexOf(code) < 0) a.push(code);
    setCart(a);
  }
  function syncBar() {
    var bar = document.getElementById("inqBar");
    var a = getCart();
    if (bar) {
      bar.classList.toggle("is-show", a.length > 0);
      var el = document.getElementById("inqList");
      if (el) el.innerHTML = t("prod.inquiryBar") + ' <b>' + a.join("、") + '</b>（' + a.length + ' ' + t("prod.item") + '）';
      var go = document.getElementById("inqGo"), cl = document.getElementById("inqClear");
      if (go) go.textContent = t("prod.goInquiry");
      if (cl) cl.textContent = t("prod.clear");
    }
    // 联系页：把暂存的编号自动填入表单
    var f = document.getElementById("fItems");
    if (f && !f.value && a.length) {
      f.value = a.map(function (c) { return c + " × ____ pcs"; }).join(", ");
    }
  }

  /* ================= 7. 询盘表单 ================= */
  function buildText(d) {
    var L = ["===== " + (LANG === "zh" ? "批发询盘" : "WHOLESALE INQUIRY") + " =====",
      (LANG === "zh" ? "公司" : "Company") + ": " + d.company,
      (LANG === "zh" ? "联系人" : "Contact") + ": " + d.name,
      (LANG === "zh" ? "邮箱" : "Email") + ": " + d.email,
      "WhatsApp/Tel: " + d.phone,
      (LANG === "zh" ? "国家" : "Country") + ": " + d.country,
      (LANG === "zh" ? "目的港" : "Destination Port") + ": " + d.port,
      (LANG === "zh" ? "客户类型" : "Buyer Type") + ": " + d.btype,
      (LANG === "zh" ? "意向产品编号" : "Item Codes") + ": " + d.items,
      (LANG === "zh" ? "预计总数量" : "Total Qty") + ": " + d.qty + " pcs",
      "",
      (LANG === "zh" ? "详细需求" : "Requirements") + ":",
      d.msg || "-",
      "",
      "-- " + (LANG === "zh" ? "来自网站询盘表单" : "Sent from website inquiry form") + " --"];
    return L.join("\n");
  }

  function initForm() {
    var form = document.getElementById("inqForm");
    if (!form) return;
    var msgBox = document.getElementById("formMsg");

    function collect() {
      var g = function (id) { var e = document.getElementById(id); return e ? e.value.trim() : ""; };
      var sel = document.getElementById("fType");
      return {
        name: g("fName"), company: g("fCompany"), email: g("fEmail"), phone: g("fPhone"),
        country: g("fCountry"), port: g("fPort"), items: g("fItems"), qty: g("fQty"),
        btype: sel ? sel.options[sel.selectedIndex].text : "", msg: g("fMsg")
      };
    }

    function validate() {
      var ok = true;
      ["fName", "fEmail", "fItems"].forEach(function (id) {
        var e = document.getElementById(id);
        if (!e) return;
        var bad = !e.value.trim() || (id === "fEmail" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.value.trim()));
        e.classList.toggle("is-err", bad);
        if (bad) ok = false;
      });
      if (!ok) show("is-err", t("contact.required"));
      return ok;
    }
    function show(cls, text) {
      if (!msgBox) return;
      msgBox.className = "formmsg " + cls;
      msgBox.textContent = text;
      msgBox.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    // 主提交
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      if (!validate()) return;
      var d = collect(), body = buildText(d);
      var subject = (LANG === "zh" ? "批发询盘 - " : "Wholesale Inquiry - ") + (d.company || d.name) +
        " - " + (d.items || "");

      if (C.formMode === "formspree" && C.formspreeId && C.formspreeId !== "your_form_id") {
        var fd = new FormData();
        fd.append("_subject", subject);
        fd.append("email", d.email);
        fd.append("message", body);
        Object.keys(d).forEach(function (k) { fd.append(k, d[k]); });
        fetch("https://formspree.io/f/" + C.formspreeId, {
          method: "POST", body: fd, headers: { Accept: "application/json" }
        }).then(function (r) {
          if (r.ok) { show("is-ok", t("contact.okSent")); form.reset(); setCart([]); }
          else show("is-err", t("contact.errSent"));
        }).catch(function () { show("is-err", t("contact.errSent")); });
      } else {
        window.location.href = "mailto:" + C.email + "?subject=" + encodeURIComponent(subject) +
          "&body=" + encodeURIComponent(body);
        show("is-ok", t("contact.okMail"));
      }
    });

    // WhatsApp 发送同一份询盘
    var waBtn = document.getElementById("sendWa");
    if (waBtn) waBtn.addEventListener("click", function () {
      if (!validate()) return;
      window.open(waLink(buildText(collect())), "_blank");
    });
  }

  /* ================= 8. UI 交互 ================= */
  function initUI() {
    var burger = document.getElementById("burger"), nav = document.getElementById("nav");
    if (burger && nav) burger.addEventListener("click", function () { nav.classList.toggle("is-open"); });

    document.querySelectorAll(".langsw button").forEach(function (b) {
      b.addEventListener("click", function () { setLang(b.getAttribute("data-lang")); });
    });

    var top = document.getElementById("toTop");
    if (top) {
      top.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });
      window.addEventListener("scroll", function () {
        top.classList.toggle("is-show", window.scrollY > 500);
      }, { passive: true });
    }

    // 加入询盘（事件委托，动态卡片也生效）
    document.addEventListener("click", function (e) {
      var b = e.target.closest(".js-add");
      if (b) {
        addCart(b.getAttribute("data-code"));
        var old = b.textContent;
        b.textContent = t("common.added");
        b.disabled = true;
        setTimeout(function () { b.textContent = old; b.disabled = false; }, 1400);
      }
      var cp = e.target.closest(".js-copy");
      if (cp) {
        var txt = cp.getAttribute("data-copy");
        navigator.clipboard && navigator.clipboard.writeText(txt);
        var o = cp.textContent; cp.textContent = t("common.copied");
        setTimeout(function () { cp.textContent = o; }, 1400);
      }
    });

    var clear = document.getElementById("inqClear");
    if (clear) clear.addEventListener("click", function () { setCart([]); });

    // 筛选
    document.querySelectorAll(".filters button").forEach(function (b) {
      b.addEventListener("click", function () {
        document.querySelectorAll(".filters button").forEach(function (x) { x.classList.remove("is-on"); });
        b.classList.add("is-on");
        var f = b.getAttribute("data-filter");
        document.querySelectorAll(".prow").forEach(function (r) {
          r.style.display = (f === "all" || r.getAttribute("data-type") === f) ? "" : "none";
        });
      });
    });

    // 高亮当前导航
    var page = document.body.getAttribute("data-page");
    document.querySelectorAll(".nav a[data-nav]").forEach(function (a) {
      a.classList.toggle("is-active", a.getAttribute("data-nav") === page);
    });
  }

  /* ================= 9. 渲染入口 ================= */
  function renderAll() {
    injectConfig();

    var hot = document.getElementById("hotGrid");
    if (hot) hot.innerHTML = P.filter(function (p) { return p.hot; }).slice(0, 4).map(card).join("");

    var all = document.getElementById("allProducts");
    if (all) {
      all.innerHTML = P.map(row).join("");
      var on = document.querySelector(".filters button.is-on");
      if (on && on.getAttribute("data-filter") !== "all") {
        var f = on.getAttribute("data-filter");
        document.querySelectorAll(".prow").forEach(function (r) {
          r.style.display = (r.getAttribute("data-type") === f) ? "" : "none";
        });
      }
    }

    priceTable();
    injectConfig();   // 再跑一次，给新渲染出来的按钮加链接
  }

  /* ================= 10. 启动 ================= */
  document.addEventListener("DOMContentLoaded", function () {
    applyI18n();
    renderAll();
    initUI();
    initForm();
    syncBar();
  });
})();
