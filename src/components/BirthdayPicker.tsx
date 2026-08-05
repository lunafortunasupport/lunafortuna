"use client";

import { useState } from "react";

const fa = (n: number | string) => String(n).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[+d]);

// دو بخشِ شفاف برای تاریخ تولد: روز و ماه.
// کاربر می‌تواند از فهرست انتخاب کند یا عدد را تایپ کند.
// مقدار نهایی در یک input مخفی با نام "birthday" و فرمت «روز/ماه» ذخیره می‌شود
// تا با منطق موجود (isBirthdayToday و قیمت‌گذاری) سازگار بماند.
export default function BirthdayPicker({ defaultValue }: { defaultValue?: string | null }) {
  const [d, m] = (defaultValue || "").split("/");
  const [day, setDay] = useState(d && /^\d{1,2}$/.test(d) ? d : "");
  const [month, setMonth] = useState(m && /^\d{1,2}$/.test(m) ? m : "");

  // فقط عدد؛ روز ۱..۳۱، ماه ۱..۱۲
  const clampDay = (v: string) => {
    const n = v.replace(/\D/g, "").slice(0, 2);
    if (n === "") return "";
    return String(Math.min(31, Math.max(1, +n)));
  };
  const clampMonth = (v: string) => {
    const n = v.replace(/\D/g, "").slice(0, 2);
    if (n === "") return "";
    return String(Math.min(12, Math.max(1, +n)));
  };

  const value = day && month ? `${day}/${month}` : "";

  return (
    <div>
      <span className="mb-1.5 block text-xs font-medium text-navy/70">تاریخ تولد</span>
      <div className="flex gap-3">
        <label className="flex-1">
          <span className="mb-1 block text-[11px] text-navy/45">روز</span>
          <input
            list="bd-days"
            inputMode="numeric"
            value={day}
            onChange={(e) => setDay(clampDay(e.target.value))}
            placeholder="مثلاً ۱۵"
            dir="ltr"
            className="inp text-center"
          />
          <datalist id="bd-days">
            {Array.from({ length: 31 }, (_, i) => (
              <option key={i + 1} value={i + 1} label={fa(i + 1)} />
            ))}
          </datalist>
        </label>
        <label className="flex-1">
          <span className="mb-1 block text-[11px] text-navy/45">ماه</span>
          <input
            list="bd-months"
            inputMode="numeric"
            value={month}
            onChange={(e) => setMonth(clampMonth(e.target.value))}
            placeholder="مثلاً ۳"
            dir="ltr"
            className="inp text-center"
          />
          <datalist id="bd-months">
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1} label={fa(i + 1)} />
            ))}
          </datalist>
        </label>
      </div>
      <input type="hidden" name="birthday" value={value} />
      <span className="mt-1 block text-[11px] text-navy/40">
        روز و ماه تولدت را انتخاب کن یا عددش را بنویس — روز تولدت تخفیف ویژه می‌گیری.
      </span>
    </div>
  );
}
