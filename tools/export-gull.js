/* 从 script.js 提取像素图与配色，导出独立的 gull.svg + 字符画源文件 gull-map.txt
   用法：node tools/export-gull.js */
const fs = require("fs");
const path = require("path");

const src = fs.readFileSync(path.join(__dirname, "..", "script.js"), "utf8");

const pixMatch = src.match(/const PIX = \[([\s\S]*?)\];/);
const palMatch = src.match(/const PALETTE = \{([\s\S]*?)\};/);
if (!pixMatch || !palMatch) { console.error("没找到 PIX / PALETTE"); process.exit(1); }

const PIX = eval("[" + pixMatch[1] + "]");
const PALETTE = eval("({" + palMatch[1] + "})");

const W = 26, H = PIX.length, S = 12; // 每个像素放大 12 倍

let rects = "";
PIX.forEach(function (row, y) {
  let x = 0;
  while (x < row.length) {
    const c = row[x];
    if (!c || c === ".") { x++; continue; }
    let w = 1;
    while (row[x + w] === c) w++;
    rects += '  <rect x="' + x + '" y="' + y + '" width="' + w + '" height="1" fill="' + (PALETTE[c] || "#000") + '"/>\n';
    x += w;
  }
});

const svg =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + W + " " + H + '" width="' + W * S + '" height="' + H * S + '" shape-rendering="crispEdges">\n' +
  "  <desc>像素海鸥 · 书条君的形象代言人（不是本人）· 由 tools/export-gull.js 从 script.js 导出</desc>\n" +
  rects + "</svg>\n";

const mapTxt =
  "像素海鸥字符画源文件（与 script.js 中 PIX 数组保持一致）\n" +
  "图例：o=描边 W=白 G=灰翅 e=瞳孔 k=嘴 f=薯条 R=红盒 r=盒沿 b=盒底 p=腮红 D=码头 B=码头缝\n\n" +
  PIX.join("\n") + "\n";

const outDir = path.join(__dirname, "..", "pixel-gull");
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "gull.svg"), svg);
fs.writeFileSync(path.join(outDir, "gull-map.txt"), mapTxt);
console.log("已导出 pixel-gull/gull.svg (" + W * S + "x" + H * S + ") 与 gull-map.txt");
