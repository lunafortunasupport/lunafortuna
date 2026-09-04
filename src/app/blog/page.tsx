import Link from "next/link";
import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import { BLOG_POSTS } from "@/lib/blogData";

export const metadata: Metadata = {
  title: "مجله | راهنمای خرید از ترکیه",
  description:
    "راهنماهای کاربردیِ خرید از ترکیه: سایزبندی، معرفیِ برندها، محاسبهٔ هزینه و خریدِ مطمئن از ترندیول — به زبانِ ساده.",
  alternates: { canonical: "/blog" },
};

function faDate(iso: string) {
  return new Intl.DateTimeFormat("fa-IR", { year: "numeric", month: "long", day: "numeric" }).format(
    new Date(iso),
  );
}

export default function BlogIndex() {
  const posts = [...BLOG_POSTS].sort((a, b) => +new Date(b.date) - +new Date(a.date));
  const [lead, ...rest] = posts;

  return (
    <>
      <PageHeader
        label="مجلهٔ لونافورتونا"
        title="راهنمای خرید از ترکیه، ساده و صادقانه"
        desc="هرچه لازم است بدانی تا مطمئن، شفاف و بدون ضرر از ترکیه خرید کنی — از سایزبندی تا هزینه‌ها و برندها."
        image="/images/editorial-duomo.jpg"
      />

      <div className="container-luna py-14 md:py-20">
        {/* مقالهٔ شاخص */}
        {lead && (
          <Link
            href={`/blog/${lead.slug}`}
            className="reveal group mb-12 grid overflow-hidden rounded-3xl border border-navy/10 bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-gold md:grid-cols-2"
          >
            <div className="relative aspect-[16/11] overflow-hidden md:aspect-auto">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={lead.cover}
                alt={lead.title}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <span className="absolute right-4 top-4 rounded-full bg-navy/85 px-3 py-1 text-[11px] tracking-widest text-champagne backdrop-blur-sm">
                {lead.tag}
              </span>
            </div>
            <div className="flex flex-col justify-center p-7 md:p-10">
              <div className="mb-3 text-[12px] text-navy/45">
                {faDate(lead.date)} · {lead.readingMinutes.toLocaleString("fa-IR")} دقیقه مطالعه
              </div>
              <h2 className="font-display text-[clamp(20px,2.6vw,30px)] font-black leading-tight text-navy transition-colors group-hover:text-gold">
                {lead.title}
              </h2>
              <p className="mt-4 text-[14px] leading-8 text-navy/65">{lead.excerpt}</p>
              <span className="mt-6 inline-flex items-center gap-1.5 text-[13px] font-bold text-gold">
                ادامهٔ مطلب
                <span className="transition-transform group-hover:-translate-x-1">←</span>
              </span>
            </div>
          </Link>
        )}

        {/* بقیهٔ مقاله‌ها */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((post, i) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="reveal group flex flex-col overflow-hidden rounded-2xl border border-navy/10 bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-gold/40 hover:shadow-gold"
              style={{ transitionDelay: `${(i % 3) * 60}ms` }}
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={post.cover}
                  alt={post.title}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <span className="absolute right-3 top-3 rounded-full bg-navy/85 px-2.5 py-1 text-[10px] tracking-widest text-champagne backdrop-blur-sm">
                  {post.tag}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <div className="mb-2 text-[11px] text-navy/40">
                  {faDate(post.date)} · {post.readingMinutes.toLocaleString("fa-IR")} دقیقه
                </div>
                <h3 className="font-display text-[17px] font-bold leading-snug text-navy transition-colors group-hover:text-gold">
                  {post.title}
                </h3>
                <p className="mt-2.5 line-clamp-3 text-[12.5px] leading-7 text-navy/60">{post.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
