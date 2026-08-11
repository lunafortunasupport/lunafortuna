import { chromium } from "playwright";
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce", isMobile: true, deviceScaleFactor: 1 });
const p = await ctx.newPage();
await p.goto("http://localhost:3000/", { waitUntil: "networkidle", timeout: 60000 });
await p.waitForTimeout(2000);
await p.screenshot({ path: "scripts/shots/home-mobile.png", fullPage: true });
await b.close(); console.log("ok");
