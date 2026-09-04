import type { MetadataRoute } from "next";

// مانیفستِ PWA — تا سایت روی موبایل قابلِ «افزودن به صفحهٔ اصلی» باشد و برندینگ کامل شود.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "LunaFortuna — خرید از ترکیه",
    short_name: "LunaFortuna",
    description:
      "واسطهٔ مطمئن خرید از ترکیه برای ایران؛ قیمتِ شفاف به تومان، بررسیِ کیفیت و سایز پیش از ارسال.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    dir: "rtl",
    lang: "fa-IR",
    orientation: "portrait",
    background_color: "#0C1526", // navy-ink
    theme_color: "#152349", // navy
    icons: [
      { src: "/icon.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
