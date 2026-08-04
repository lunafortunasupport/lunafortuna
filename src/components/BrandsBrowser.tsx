"use client";

import { useMemo, useState } from "react";
import BrandCard, { BrandLite } from "./BrandCard";
import { GROUP_LABELS } from "@/lib/util";

export default function BrandsBrowser({ brands, initialGroup = "all" }: { brands: BrandLite[]; initialGroup?: string }) {
  const [group, setGroup] = useState<string>(initialGroup);
  const [q, setQ] = useState("");

  const groups = useMemo(() => {
    const set = new Set(brands.map((b) => b.group));
    return ["all", ...Array.from(set)];
  }, [brands]);

  const filtered = useMemo(() => {
    return brands.filter((b) => {
      const okGroup = group === "all" || b.group === group;
      const okQ = !q || b.name.toLowerCase().includes(q.toLowerCase()) || (b.domain || "").includes(q.toLowerCase());
      return okGroup && okQ;
    });
  }, [brands, group, q]);

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {groups.map((g) => (
            <button
              key={g}
              onClick={() => setGroup(g)}
              className={`rounded-full px-4 py-2 text-[13px] transition ${
                group === g
                  ? "bg-navy text-cream"
                  : "border border-navy/15 text-navy/70 hover:border-gold hover:text-gold"
              }`}
            >
              {g === "all" ? "همه" : GROUP_LABELS[g] || g}
            </button>
          ))}
        </div>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="جستجوی برند…"
          className="w-full rounded-full border border-navy/15 bg-white px-5 py-2.5 text-sm outline-none focus:border-gold sm:w-64"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="py-16 text-center text-navy/50">برندی پیدا نشد.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
          {filtered.map((b) => (
            <BrandCard key={b.slug} brand={b} />
          ))}
        </div>
      )}
    </div>
  );
}
