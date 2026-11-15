/* ============================================================
   书条 · v2 —— script.js
   纯原生，无依赖，无网络请求，无密钥
   ============================================================ */

/* ---------- 0. 像素海鸥：字符画即源码 ----------
   图例：o=描边 W=白 G=灰翅 e=瞳 k=橘 f=薯条 R=红盒 r=盒沿
        b=盒底 p=腮红 D=码头 B=码头缝
   想改海鸥长相，直接改下面的字符（每行 26 个字符） */
const PIX = [
  ".........oooooooo.........",
  "........oWWWWWWWo.........",
  ".......oWWGGGWWWWWo........",
  "......oWWWWWWWWWWWo.......",
  "......oWWWeeWWeeWWo.......",
  "......oWWWeeWWeeWWo.......",
  "......oWpWWkkkWWWpo.......",
  ".....oWWWWWWkWWWWWo.......",
  "..oGGoWWWWWWWWWWWWoGGo....",
  "..oGGoWWWWfWfWfWWWoGGo....",
  "..oGGoWWWWfWfWfWWWoGGo....",
  "..oGGoWWWrrrrrrrrWoGGo....",
  "..oGGoWWWRRRRRRRRWoGGo....",
  "..oGGoWWWRRRRRRRRWoGGo....",
  ".....oWWWRRRRRRRRWo........",
  ".....oWWWRRRRRRRRWo........",
  ".....oWWWbbbbbbbbo.........",
  ".....oooooooooooooo.......",
  "..........................",
  "DDDDDDDDDDDDDDDDDDDDDDDDDD",
  "DDDDDDDDBBDDDDDDDDBBDDDDDDBB"
];
const PALETTE = {
  o: "#172026", W: "#ffffff", G: "#c9d3d8", e: "#172026",
  k: "#f6a35c", f: "#ffc93c", R: "#e4572e", r: "#f0705a",
  b: "#b23e1e", p: "#f8a5a5", D: "#8a5a33", B: "#6b4222"
};

(function renderGull() {
  const slot = document.getElementById("gull-slot");
  if (!slot) return;
  /* 页面里已内联了弧度版海鸥（#gull）就不再渲染像素版；
     删掉 index.html 里那段内联 SVG，像素海鸥自动回来 */
  if (slot.querySelector("#gull")) return;

  /* 横向合并同色像素，减少 rect 数量 */
  let base = "", pupils = "";
  PIX.forEach(function (row, y) {
    let x = 0;
    while (x < 26) {
      const c = row[x];
      if (!c || c === "." ) { x++; continue; }
      let w = 1;
      while (row[x + w] === c) w++;
      const r = '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="1" fill="' + PALETTE[c] + '"/>';
      if (c === "e") pupils += r; else base += r;
      x += w;
    }
  });

  /* 闭眼时的眼皮线（在瞳孔消失的瞬间出现） */
  let lids = "";
  [[10, 5], [14, 5]].forEach(function (p) {
    lids += '<rect class="g-lid" x="' + p[0] + '" y="' + p[1] + '" width="2" height="1" fill="#172026"/>';
  });

  slot.innerHTML =
    '<svg id="gull" class="gull" viewBox="0 0 26 21" width="100%" shape-rendering="crispEdges" role="img" aria-label="像素海鸥抱着书条盒，点它">' +
    base +
    '<g class="g-pupil">' + pupils + "</g>" +
    lids +
    "</svg>";
  slot.style.maxWidth = "340px";
  slot.style.margin = "0 auto";
})();

/* ---------- 0.5 自绘海鲜线稿图标组 ----------
   统一 48×48 栅格、同笔宽；a1=金 a2=红 f1=金实心，随主题变色 */
const SEA_ICONS = {
  anchor: '<circle cx="24" cy="9" r="3.2"/><path d="M24 12v24"/><path d="M16 19h16"/><path d="M9 27a15 15 0 0 0 30 0"/><path d="M9 27l-3 2M39 27l3 2"/>',
  squid:  '<path d="M24 7c-9 0-14 7-14 15 0 6 6 8 14 8s14-2 14-8c0-8-5-15-14-15z"/><path class="a2" d="M10 17l-5-3v9zM38 17l5-3v9"/><circle cx="19" cy="20" r="1.7" fill="currentColor" stroke="none"/><circle cx="29" cy="20" r="1.7" fill="currentColor" stroke="none"/><path d="M18 29c-1 6 1 9 3 11M24 30v12M30 29c1 6-1 9-3 11"/><circle class="f1" cx="21" cy="42" r="1.6"/><circle class="f1" cx="27" cy="42" r="1.6"/>',
  crab:   '<ellipse cx="24" cy="27" rx="10" ry="7"/><path class="a1" d="M14 22q-8-4-9 1t7 6M34 22q8-4 9 1t-7 6"/><path d="M20 20v-4M28 20v-4"/><circle cx="20" cy="14" r="1.9"/><circle cx="28" cy="14" r="1.9"/><circle cx="21" cy="26" r="1.4" fill="currentColor" stroke="none"/><circle cx="27" cy="26" r="1.4" fill="currentColor" stroke="none"/><path d="M21 30q3 2 6 0"/><path d="M13 30l-7 3M14 34l-7 5M35 30l7 3M34 34l7 5"/>',
  fish:   '<path d="M12 24c0-6 8-11 16-8 4 1 6 4 6 8s-2 7-6 8c-8 3-16-2-16-8z"/><path d="M34 24l8-6v12z"/><circle cx="17" cy="22" r="1.5" fill="currentColor" stroke="none"/><path class="a1" d="M22 17c-2 5-2 9 0 14"/><circle class="f1" cx="41" cy="11" r="1.8"/>',
  shell:  '<path d="M8 33a16 16 0 0 1 32 0z"/><path d="M24 33V18M24 33l-9-11M24 33l9-11M24 33L11 27M24 33l13-6"/><path class="a2" d="M8 34c2 3 4 3 6 0 2 3 4 3 6 0 2 3 4 3 6 0 2 3 4 3 6 0"/><circle class="f1" cx="24" cy="28" r="2.3"/>',
  shrimp: '<path d="M34 12C22 9 11 17 12 26c1 8 9 11 17 8 5-2 8-6 8-10"/><path d="M21 14c-1 4-1 8 1 11M28 12c-1 5-1 9 1 12M34 13c0 4 1 7 3 9"/><path class="a2" d="M34 12c5-2 9 0 11 4M34 12c3-4 8-6 12-5"/><path d="M12 26c-4 3-6 6-7 10 6 1 9 0 11-3"/><circle cx="32" cy="15" r="1.4" fill="currentColor" stroke="none"/><circle class="f1" cx="44" cy="17" r="1.6"/>',
  octopus:'<path d="M13 27c0-16 22-16 22 0v4c0 3-2 4-4 2 0 4-3 5-5 2 0 4-3 5-5 2-2 3-5 2-5-2-2 2-4 1-4-2z"/><circle cx="20" cy="22" r="1.7" fill="currentColor" stroke="none"/><circle cx="28" cy="22" r="1.7" fill="currentColor" stroke="none"/><path d="M22 26q2 2 4 0"/><path class="a1" d="M35 33c3 1 5 3 5 6"/>',
  lobster:'<path d="M24 19v18"/><path d="M19 37l5 7 5-7"/><path d="M21 24h6M21 29h6M21 34h6"/><path d="M19 19c-3 0-5 2-5 5h20c0-3-2-5-5-5z"/><path class="a2" d="M20 20c-2-8-6-12-11-14M28 20c2-8 6-12 11-14"/><path class="a1" d="M14 24c-6-3-11 0-10 5 1 5 7 6 11 3M34 24c6-3 11 0 10 5-1 5-7 6-11 3"/><path d="M16 31l-6 2M16 35l-6 4M32 31l6 2M32 35l6 4"/>'
};
(function renderSeaIcons() {
  document.querySelectorAll("[data-sea]").forEach(function (el) {
    const parts = SEA_ICONS[el.dataset.sea];
    if (!parts) return;
    el.innerHTML =
      '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">' +
      parts + "</svg>";
  });
})();

/* ---------- 1. 打字机：正在鼓捣：<什么> ---------- */
const WORDS = ["摄影", "剪辑", "绘画", "拼模型", "打羽毛球", "写作", "拆一切能拆的", "修一切想抢救的", "研究“这玩意咋做的”", "万物皆可鼓捣"];
const typed = document.getElementById("typed");
if (typed) {
  let wi = 0, ci = 0, deleting = false;
  (function step() {
    const w = WORDS[wi];
    if (!deleting) {
      ci++; typed.textContent = w.slice(0, ci);
      if (ci === w.length) { deleting = true; return setTimeout(step, 1500); }
      setTimeout(step, 110);
    } else {
      ci--; typed.textContent = w.slice(0, ci);
      if (ci === 0) { deleting = false; wi = (wi + 1) % WORDS.length; }
      setTimeout(step, 45);
    }
  })();
}

/* ---------- 2. 薯条雨 ---------- */
function burst(x, y, n) {
  n = n || 14;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  for (let i = 0; i < n; i++) {
    const fry = document.createElement("span");
    fry.className = "fry-rain";
    fry.textContent = "🍟";
    fry.style.left = x + "px";
    fry.style.top = y + "px";
    document.body.appendChild(fry);
    const dx = (Math.random() - 0.5) * 300;
    const dy = 150 + Math.random() * 300;
    const rot = Math.random() * 720 - 360;
    const anim = fry.animate(
      [
        { transform: "translate(-50%, -50%) rotate(0deg)", opacity: 1 },
        { transform: "translate(calc(-50% + " + dx + "px), calc(-50% + " + dy + "px)) rotate(" + rot + "deg)", opacity: 0 }
      ],
      { duration: 900 + Math.random() * 800, easing: "cubic-bezier(.2,.6,.3,1)" }
    );
    anim.onfinish = function () { fry.remove(); };
  }
}

/* ---------- 3. 点海鸥：掉薯条 + 冒话泡（事件委托，SVG 是动态生成的） ---------- */
const GULL_LINES = ["书条！", "嘎嘎！", "来点？", "走，去码头！", "知识炸成薯条！", "薯条——啊不，书条！", "代言人在线", "今日渔获：满筐！"];
document.addEventListener("click", function (e) {
  const gull = e.target.closest("#gull");
  if (!gull) return;
  burst(e.clientX, e.clientY, 12);
  const bubble = document.getElementById("bubble");
  if (bubble) {
    bubble.textContent = GULL_LINES[Math.floor(Math.random() * GULL_LINES.length)];
    bubble.classList.remove("show");
    void bubble.offsetWidth;
    bubble.classList.add("show");
  }
});

/* ---------- 4. 彩蛋：点导航 logo 漏薯条 ---------- */
const logo = document.getElementById("logo");
if (logo) {
  logo.addEventListener("click", function () {
    const r = logo.getBoundingClientRect();
    burst(r.left + r.width / 2, r.bottom, 6);
    console.log("%c🍟 书条君：来都来了，整点书条再走？（注意：书条君是他自称，全网使用人数目前为 1）", "font-size:14px;font-weight:bold;color:#E4572E;");
  });
}

/* ---------- 5. 联系页：复制邮箱 + 投喂 ---------- */
const copyBtn = document.getElementById("copyEmail");
if (copyBtn) {
  copyBtn.addEventListener("click", function () {
    const email = copyBtn.dataset.email;
    function ok() {
      const old = copyBtn.textContent;
      copyBtn.textContent = "已复制 ✔";
      setTimeout(function () { copyBtn.textContent = old; }, 1600);
    }
    function fallback() {
      const ta = document.createElement("textarea");
      ta.value = email;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand("copy"); ok(); } catch (e) {}
      ta.remove();
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(email).then(ok).catch(fallback);
    } else fallback();
  });
}
const feedBtn = document.getElementById("feedBtn");
if (feedBtn) {
  feedBtn.addEventListener("click", function () {
    const r = feedBtn.getBoundingClientRect();
    burst(r.left + r.width / 2, r.top, 26);
  });
}

/* ---------- 6. 鼓捣签：抽一个今日建议 ---------- */
const DOODLES = [
  "把抽屉里最神秘的那把线理一遍",
  "给手机里吃灰的照片做一次断舍离",
  "搜一个“XX 是怎么做出来的”并看到停不下来",
  "用没试过的软件做一个丑但能用的东西",
  "把坏了很久的小玩意拆开看看遗言",
  "复刻一道只在梦里吃过的菜",
  "给某个爱好写 50 字的安利文案",
  "拍 3 张今天光影最好的角落",
  "把一个想法画成火柴人也算数",
  "学一个新快捷键并强迫自己用一天",
  "给未来的自己鼓捣一个小脚本",
  "去码头整点书条（正经建议）"
];
const doodleBtn = document.getElementById("doodleBtn");
const doodleOut = document.getElementById("doodleOut");
if (doodleBtn && doodleOut) {
  doodleBtn.addEventListener("click", function () {
    doodleOut.textContent = "🍟 今日宜：" + DOODLES[Math.floor(Math.random() * DOODLES.length)];
    doodleOut.classList.remove("pop");
    void doodleOut.offsetWidth;
    doodleOut.classList.add("pop");
    const r = doodleBtn.getBoundingClientRect();
    burst(r.left + r.width / 2, r.top, 6);
  });
}

/* ---------- 7. 日间 / 夜间模式切换 ----------
   初始值由各页面 <head> 内联脚本决定（本地记忆 > 系统偏好） */
(function themeToggle() {
  const btn = document.getElementById("themeBtn");
  if (!btn) return;
  const isDay = () => document.documentElement.dataset.theme === "day";
  const label = () => { btn.textContent = isDay() ? "🌙 夜间" : "☀️ 日间"; };
  label();
  btn.addEventListener("click", function () {
    const next = isDay() ? "night" : "day";
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem("gull-theme", next); } catch (e) {}
    label();
    const r = btn.getBoundingClientRect();
    burst(r.left + r.width / 2, r.bottom, 8);
  });
})();

/* ---------- 8. 滚动显现 ---------- */
const revealEls = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) { en.target.classList.add("visible"); io.unobserve(en.target); }
    });
  }, { threshold: 0.12 });
  revealEls.forEach(function (el) { io.observe(el); });
} else {
  revealEls.forEach(function (el) { el.classList.add("visible"); });
}
