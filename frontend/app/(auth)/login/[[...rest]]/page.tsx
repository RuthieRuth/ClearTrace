import { SignIn } from "@clerk/nextjs";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Link href="/" className="mb-4 border rounded-xl px-3 py-1">← Back to home</Link>
      <SignIn fallbackRedirectUrl="/dashboard" />
    </div>
  );
}
