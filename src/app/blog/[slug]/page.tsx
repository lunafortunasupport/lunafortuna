import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { BLOG_POSTS, getPost } from "@/lib/blogData";

const SITE_URL = "https://lunafortuna.store";

export function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const post = getPost(params.slug);
  if (!post) return { title: "مقاله یافت نشد" };
  return {
    title: post.title,
    description: post.excerpt,
    keywords: post.keywords,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      publishedTime: post.date,
      modifiedTime: post.updated || post.date,
      images: [{ url: post.cover }],
    },
  };
}

function faDate(iso: string) {
  return new Intl.DateTimeFormat("fa-IR", { year: "numeric", month: "long", day: "numeric" }).format(
    new Date(iso),
  );
}

export default function BlogArticle({ params }: { params: { slug: string } }) {
  const post = getPost(params.slug);
  if (!post) notFound();

  const related = BLOG_POSTS.filter((p) => p.slug !== post.slug).slice(0, 3);

  // ── Article JSON-LD برای نتایجِ غنیِ گوگل ──
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: `${SITE_URL}${post.cover}`,
    datePublished: post.date,
    dateModified: post.updated || post.date,
    inLanguage: "fa-IR",
    author: { "@type": "Organization", name: "LunaFortuna" },
    publisher: {
      "@type": "Organization",
      name: "LunaFortuna",
      logo: { "@type": "ImageObject", url: `${SITE_URL}/icon.png` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}/blog/${post.slug}` },
  };

  // ── FAQPage JSON-LD (اگر مقاله پرسش‌وپاسخ داشت) ──
  const faqLd = post.faq?.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: post.faq.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      }
    : null;

  return (
    <article className="pb-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      {faqLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      )}

      {/* هیرویِ مقاله */}
      <header className="relative flex min-h-[320px] items-end overflow-hidden bg-navy sm:min-h-[420px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={post.cover} alt="" className="kenburns absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/80 to-navy/30" />
        <div className="container-luna relative w-full pb-10 pt-28">
          <div className="reveal max-w-3xl">
            <Link
              href="/blog"
              className="rise-up mb-5 inline-flex items-center gap-1.5 text-[12px] tracking-widest text-champagne/80 transition hover:text-champagne"
            >
              ← مجله
            </Link>
            <div className="rise-up mb-4 flex items-center gap-3 text-[12px] text-cream/60" style={{ transitionDelay: "40ms" }}>
              <span className="rounded-full border border-gold/35 bg-navy/30 px-3 py-1 tracking-widest text-champagne">
                {post.tag}
              </span>
              <span>{faDate(post.date)}</span>
              <span>·</span>
              <span>{post.readingMinutes.toLocaleString("fa-IR")} دقیقه مطالعه</span>
            </div>
            <h1
              className="rise-up font-display text-[clamp(24px,4.4vw,44px)] font-black leading-[1.2] text-cream"
              style={{ transitionDelay: "80ms" }}
            >
              {post.title}
            </h1>
          </div>
        </div>
      </header>

      {/* بدنهٔ مقاله */}
      <div className="container-luna">
        <div className="mx-auto max-w-3xl pt-12">
          <p className="reveal border-r-2 border-gold/50 pr-5 text-[16px] font-medium leading-9 text-navy/80">
            {post.intro}
          </p>

          <div className="mt-10 space-y-10">
            {post.sections.map((sec, i) => (
              <section key={i} className="reveal">
                {sec.h && (
                  <h2 className="mb-4 font-display text-[22px] font-bold text-navy">
                    <span className="ml-2 text-gold">✦</span>
                    {sec.h}
                  </h2>
                )}
                {sec.p?.map((para, j) => (
                  <p key={j} className="mb-4 text-[15px] leading-9 text-navy/72">
                    {para}
                  </p>
                ))}
                {sec.ul && (
                  <ul className="mt-2 space-y-2.5">
                    {sec.ul.map((li, j) => (
                      <li key={j} className="flex gap-3 text-[15px] leading-8 text-navy/72">
                        <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                        <span>{li}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>

          {/* پرسش‌های پرتکرار */}
          {post.faq?.length ? (
            <section className="reveal mt-14">
              <h2 className="mb-5 font-display text-[22px] font-bold text-navy">پرسش‌های پرتکرار</h2>
              <div className="space-y-3">
                {post.faq.map((f, i) => (
                  <details
                    key={i}
                    className="group rounded-2xl border border-navy/10 bg-white px-5 py-4 shadow-card open:border-gold/40"
                  >
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-bold text-navy">
                      {f.q}
                      <span className="text-gold transition-transform group-open:rotate-45">＋</span>
                    </summary>
                    <p className="mt-3 text-[14px] leading-8 text-navy/65">{f.a}</p>
                  </details>
                ))}
              </div>
            </section>
          ) : null}

          {/* دعوت به اقدام */}
          <div className="reveal mt-14 overflow-hidden rounded-3xl bg-navy px-7 py-10 text-center text-cream">
            <h3 className="font-display text-2xl font-bold">آمادهٔ خریدی؟</h3>
            <p className="mx-auto mt-3 max-w-md text-[14px] leading-8 text-cream/70">
              محصولت را در کاتالوگِ فارسی پیدا کن یا لینکِ ترکیه‌اش را برایمان بفرست — با قیمتِ شفاف و
              بررسیِ کیفیت.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link href="/catalog" className="btn-gold">
                دیدنِ فروشگاهِ ترکیه
              </Link>
              <Link
                href="/order"
                className="btn border border-champagne/50 px-7 text-cream hover:bg-champagne hover:text-navy-ink"
              >
                ثبتِ سفارش
              </Link>
            </div>
          </div>
        </div>

        {/* مقاله‌های مرتبط */}
        {related.length > 0 && (
          <div className="mx-auto mt-16 max-w-5xl border-t border-navy/10 pt-10">
            <h2 className="reveal mb-6 font-display text-xl font-bold text-navy">بیشتر بخوان</h2>
            <div className="grid gap-5 sm:grid-cols-3">
              {related.map((p) => (
                <Link
                  key={p.slug}
                  href={`/blog/${p.slug}`}
                  className="reveal group flex flex-col overflow-hidden rounded-2xl border border-navy/10 bg-white shadow-card transition hover:-translate-y-1 hover:border-gold/40"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.cover}
                      alt={p.title}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex-1 p-4">
                    <div className="mb-1.5 text-[10px] tracking-widest text-gold/80">{p.tag}</div>
                    <h3 className="font-display text-[14px] font-bold leading-snug text-navy transition-colors group-hover:text-gold">
                      {p.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
