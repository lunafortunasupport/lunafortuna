// اسکرولِ مرحله‌به‌مرحله با حرکتِ عادی؛ اثباتِ نبودِ بخشِ خالی.
import { chromium } from "playwright";
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1440, height: 820 } }); // بدون reducedMotion → reveal واقعی
const p = await ctx.newPage();
await p.goto("http://localhost:3000/", { waitUntil: "networkidle", timeout: 60000 });
await p.waitForTimeout(1500);
const total = await p.evaluate(() => document.body.scrollHeight);
let i = 0;
for (let y = 0; y < total; y += 720) {
  await p.evaluate((yy) => window.scrollTo({ top: yy, behavior: "instant" }), y);
  await p.waitForTimeout(700); // فرصت به reveal
  await p.screenshot({ path: `scripts/shots/scroll-${String(i).padStart(2,"0")}.png` });
  i++;
}
await b.close();
console.log("frames:", i);
