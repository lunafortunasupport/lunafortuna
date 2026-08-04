export default function PageHeader({
  label,
  title,
  desc,
}: {
  label: string;
  title: string;
  desc?: string;
}) {
  return (
    <div className="border-b border-navy/10 bg-white">
      <div className="container-luna py-12 md:py-16">
        <span className="sec-label">{label}</span>
        <h1 className="mt-3 font-display text-3xl font-semibold text-navy md:text-5xl">{title}</h1>
        {desc && <p className="mt-4 max-w-2xl text-[14px] leading-8 text-navy/55">{desc}</p>}
      </div>
    </div>
  );
}
