import { chromium } from "playwright";
const b = await chromium.launch();
// reducedMotion → عناصرِ reveal بلافاصله دیده می‌شوند (طبق CSS ما) تا اسکرین‌شات کامل باشد
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce", deviceScaleFactor: 1 });
const p = await ctx.newPage();
await p.goto("http://localhost:3000/", { waitUntil: "networkidle", timeout: 60000 });
await p.waitForTimeout(3000);
await p.screenshot({ path: "scripts/shots/desktop-full.png", fullPage: true });
// موبایل
const ctxm = await b.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce", deviceScaleFactor: 1, isMobile: true });
const pm = await ctxm.newPage();
await pm.goto("http://localhost:3000/", { waitUntil: "networkidle", timeout: 60000 });
await pm.waitForTimeout(2500);
await pm.screenshot({ path: "scripts/shots/mobile-full.png", fullPage: true });
await b.close();
console.log("done");
