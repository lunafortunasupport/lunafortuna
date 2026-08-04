import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // پالت رسمی برند گاید LunaFortuna
        navy: {
          DEFAULT: "#152349", // سرمه‌ای — رنگ اصلی
          ink: "#0C1526",     // سرمه‌ای جوهری — متن روی زمینهٔ روشن
        },
        gold: "#9A7A43",       // طلایی آنتیک — لهجهٔ CTA
        champagne: "#C9A96A",  // شامپاینی — hover و لایه‌های ظریف
        cream: "#F5F1E8",      // کرم — پس‌زمینهٔ گرم
      },
      fontFamily: {
        sans: ["var(--font-vazir)", "system-ui", "sans-serif"],
        display: ["var(--font-playfair)", "serif"],
      },
      boxShadow: {
        gold: "0 8px 24px rgba(154,122,67,0.25)",
        card: "0 4px 24px rgba(12,21,38,0.08)",
      },
      borderRadius: {
        xl2: "22px",
      },
      keyframes: {
        slideUp: {
          from: { opacity: "0", transform: "translateY(26px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        spinSlow: {
          to: { transform: "rotate(360deg)" },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-14px)" },
        },
        pulseSoft: {
          "0%,100%": { opacity: "0.4", transform: "scale(1)" },
          "50%": { opacity: "0.8", transform: "scale(1.05)" },
        },
      },
      animation: {
        slideUp: "slideUp .8s ease forwards",
        fadeIn: "fadeIn .8s ease forwards",
        spinSlow: "spinSlow 22s linear infinite",
        spinRev: "spinSlow 30s linear infinite reverse",
        marquee: "marquee 32s linear infinite",
        float: "float 6s ease-in-out infinite",
        pulseSoft: "pulseSoft 5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
