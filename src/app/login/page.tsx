import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import AuthForm from "@/components/AuthForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "ورود / ثبت‌نام" };

export default async function LoginPage() {
  const user = await getCurrentUser();
  if (user) redirect("/account");

  return (
    <div className="container-luna flex min-h-[70vh] items-center justify-center py-12">
      <div className="w-full max-w-sm">
        <AuthForm />
      </div>
    </div>
  );
}
