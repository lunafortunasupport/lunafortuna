export function parseJson<T>(s: string | null | undefined, fallback: T): T {
  if (!s) return fallback;
  try {
    return JSON.parse(s) as T;
  } catch {
    return fallback;
  }
}

export function shortId(): string {
  return Date.now().toString().slice(-6);
}

export const GROUP_LABELS: Record<string, string> = {
  multi: "فروشگاه‌های چندبرندی",
  clothing: "پوشاک",
  sports: "ورزشی",
  shoes: "کفش",
  beauty: "آرایشی و بهداشتی",
  home: "خانه و آشپزخانه",
  kids: "کودک و نوزاد",
};
