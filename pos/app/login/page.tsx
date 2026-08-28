"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Store } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { user, loading, signIn } = useAuth();
  const [email, setEmail] = useState("demo@smartretail.local");
  const [password, setPassword] = useState("demo123");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) router.replace("/pos");
  }, [loading, router, user]);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await signIn(email, password);
      router.replace("/pos");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to sign in");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 p-4 dark:bg-slate-950">
      <section className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl dark:bg-slate-900">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-600 text-white"><Store /></div>
          <div><h1 className="text-xl font-bold">Smart Retail</h1><p className="text-sm text-slate-500">Point of sale</p></div>
        </div>
        <h2 className="text-2xl font-semibold">Sign in</h2>
        <p className="mt-1 text-sm text-slate-500">Use any email and a six-character password for local access.</p>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <label className="block text-sm font-medium">Email<input value={email} onChange={(event) => setEmail(event.target.value)} type="email" required className="input-field mt-1" /></label>
          <label className="block text-sm font-medium">Password<input value={password} onChange={(event) => setPassword(event.target.value)} type="password" minLength={6} required className="input-field mt-1" /></label>
          {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
          <button type="submit" disabled={submitting} className="btn-primary w-full">{submitting ? "Signing in..." : "Open POS"}</button>
        </form>
      </section>
    </main>
  );
}
