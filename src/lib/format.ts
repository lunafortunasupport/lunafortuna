// ابزارهای فرمت فارسی

export function toFa(n: number | string): string {
  return String(n).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);
}

export function faNumber(n: number): string {
  return n.toLocaleString("fa-IR");
}

export function formatToman(n: number): string {
  return `${n.toLocaleString("fa-IR")} تومان`;
}

export function formatLir(n: number): string {
  return `${n.toLocaleString("fa-IR")} لیر`;
}
