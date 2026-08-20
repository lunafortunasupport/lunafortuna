import { getSettings } from "@/lib/settings";
import { parseJson } from "@/lib/util";
import { updateSettings } from "../../actions";

export const dynamic = "force-dynamic";

export default async function AdminSettings() {
  const s = await getSettings();
  const about = parseJson<{ intro?: string; story?: string; team?: { name: string; role: string; photoUrl?: string }[] }>(
    s.aboutContent,
    {}
  );
  const teamText = (about.team || []).map((m) => `${m.name} | ${m.role} | ${m.photoUrl || ""}`).join("\n");

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-3xl font-semibold text-navy">تنظیمات</h1>

      <form action={updateSettings} className="mt-6 space-y-6">
        {/* نرخ و کارمزد */}
        <Section title="نرخ لیر و کارمزد">
          <div className="grid grid-cols-2 gap-4">
            <Field label="نرخ صرافی لیر (تومان)">
              <input name="exchangeRate" defaultValue={s.exchangeRate} className="inp" dir="ltr" />
            </Field>
            <Field label="منبع نرخ">
              <select name="rateSource" defaultValue={s.rateSource} className="inp">
                <option value="manual">دستی</option>
                <option value="telegram">کانال تلگرام (خودکار)</option>
              </select>
            </Field>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Field label="کارمزد عادی">
              <input name="feeNormal" defaultValue={s.feeNormal} className="inp" dir="ltr" />
            </Field>
            <Field label="کارمزد نقره">
              <input name="feeSilver" defaultValue={s.feeSilver} className="inp" dir="ltr" />
            </Field>
            <Field label="کارمزد طلایی">
              <input name="feeGold" defaultValue={s.feeGold} className="inp" dir="ltr" />
            </Field>
            <Field label="کارمزد تولد">
              <input name="feeBirthday" defaultValue={s.feeBirthday} className="inp" dir="ltr" />
            </Field>
            <Field label="کارمزد معرف">
              <input name="feeReferral" defaultValue={s.feeReferral} className="inp" dir="ltr" />
            </Field>
          </div>
          <p className="text-[11px] text-navy/40">مثلاً ۰٫۱۵ یعنی ۱۵٪. کارمزد در نرخ تومان پنهان می‌ماند.</p>
        </Section>

        {/* کارگوی کاتالوگِ ترندیول */}
        <Section title="هزینهٔ کارگو — کاتالوگِ ترندیول">
          <Field label="برآوردِ هزینهٔ کارگوی داخلِ ترکیه (لیر)">
            <input name="cargoFeeEstimateTL" defaultValue={s.cargoFeeEstimateTL} className="inp" dir="ltr" />
          </Field>
          <p className="text-[11px] text-navy/40">
            وقتی محصولِ کاتالوگِ ترندیول کارگوی رایگان نداشته باشد، همین مبلغ (به لیر) به قیمتِ نهاییِ
            نمایش‌داده‌شده به مشتری اضافه می‌شود — با برچسبِ «برآوردی».
          </p>
        </Section>

        {/* کارت */}
        <Section title="اطلاعات پرداخت">
          <Field label="شماره کارت">
            <input name="cardNumber" defaultValue={s.cardNumber} className="inp" dir="ltr" />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="صاحب کارت">
              <input name="cardOwner" defaultValue={s.cardOwner} className="inp" />
            </Field>
            <Field label="بانک">
              <input name="cardBank" defaultValue={s.cardBank} className="inp" />
            </Field>
          </div>
        </Section>

        {/* ارتباط */}
        <Section title="اطلاعات تماس">
          <div className="grid grid-cols-2 gap-4">
            <Field label="ربات تلگرام (بدون @)">
              <input name="telegramBot" defaultValue={s.telegramBot} className="inp" dir="ltr" />
            </Field>
            <Field label="پشتیبانی تلگرام (بدون @)">
              <input name="telegramSupport" defaultValue={s.telegramSupport} className="inp" dir="ltr" />
            </Field>
            <Field label="اینستاگرام">
              <input name="instagram" defaultValue={s.instagram} className="inp" dir="ltr" />
            </Field>
            <Field label="تلفن">
              <input name="phone" defaultValue={s.phone} className="inp" dir="ltr" />
            </Field>
          </div>
        </Section>

        {/* درباره ما */}
        <Section title="دربارهٔ ما">
          <Field label="متن معرفی">
            <textarea name="aboutIntro" defaultValue={about.intro || ""} rows={3} className="inp resize-none" />
          </Field>
          <Field label="داستان برند">
            <textarea name="aboutStory" defaultValue={about.story || ""} rows={3} className="inp resize-none" />
          </Field>
          <Field label="اعضای تیم (هر خط: نام | نقش | لینک عکس)">
            <textarea name="aboutTeam" defaultValue={teamText} rows={4} className="inp resize-none" dir="ltr" />
          </Field>
        </Section>

        <button className="btn-gold">ذخیرهٔ تنظیمات</button>

        <style>{`.inp{width:100%;border-radius:.75rem;border:1px solid rgba(21,35,73,.15);background:#fff;padding:.65rem .9rem;font-size:.875rem;outline:none}.inp:focus{border-color:#9a7a43}`}</style>
      </form>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card-soft space-y-4 p-6">
      <h2 className="font-display text-lg font-semibold text-navy">{title}</h2>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-navy/70">{label}</span>
      {children}
    </label>
  );
}
