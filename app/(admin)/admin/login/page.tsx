"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Eye, EyeOff, Loader2, Lock, User, AlertCircle } from "lucide-react";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (data.success) {
        window.location.href = "/admin";
        return; // keep the spinner while the dashboard loads
      }
      setError(data.message || "Invalid credentials");
    } catch (err) {
      console.log(err);
      setError("An error occurred during login");
    }
    setLoading(false);
  };

  const inputClass =
    "block w-full rounded-lg border border-gray-200 bg-gray-50/60 py-3 pl-11 pr-4 text-[15px] text-gray-900 placeholder-gray-400 transition-colors focus:border-primary focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10";

  return (
    <div className="flex min-h-screen bg-white">
      {/* Brand panel (desktop only) */}
      <div className="relative hidden w-1/2 overflow-hidden lg:block xl:w-[55%]">
        <Image src="/assets/images/hero-bg1.jpg" alt="" fill priority className="object-cover" sizes="55vw" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/75 to-[#0b1f4d]/90" />
        <div className="relative flex h-full flex-col justify-between p-12 text-white">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-white/70">Backend Console</span>
          <div className="max-w-md">
            <h1 className="text-4xl font-semibold leading-tight">Manage your website content in one place.</h1>
            <p className="mt-4 text-base leading-relaxed text-white/75">
              Update projects, services, news and pages securely from the Shapoorji Pallonji admin console.
            </p>
          </div>
          <span className="text-xs text-white/60">&copy; {new Date().getFullYear()} Shapoorji Pallonji</span>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex flex-1 items-center justify-center bg-gray-50 px-4 py-12 sm:px-8 lg:bg-white">
        <div className="w-full max-w-[400px] rounded-2xl bg-white p-8 shadow-[0_8px_30px_rgba(0,0,0,0.06)] sm:p-10 lg:shadow-none">
          <Image
            src="/assets/logos/final-sp-logo.png"
            alt="Shapoorji Pallonji"
            width={1522}
            height={897}
            className="h-auto w-[120px]"
            priority
          />

          <div className="mt-10">
            <h2 className="text-2xl font-semibold text-gray-900">Welcome back</h2>
            <p className="mt-1.5 text-sm text-gray-500">Sign in to continue to the admin console.</p>
          </div>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div
                role="alert"
                className="flex items-start gap-2.5 rounded-lg border border-red-100 bg-red-50 px-3.5 py-3 text-sm text-red-700"
              >
                <AlertCircle className="mt-px h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label htmlFor="username" className="mb-1.5 block text-sm font-medium text-gray-700">
                Username
              </label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-400" />
                <input
                  id="username"
                  type="text"
                  required
                  autoFocus
                  autoComplete="username"
                  className={inputClass}
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-400" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  className={`${inputClass} pr-11`}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-[15px] font-medium text-white shadow-sm transition-all hover:bg-primary/90 focus:outline-none focus:ring-4 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-gray-400 lg:hidden">
            &copy; {new Date().getFullYear()} Shapoorji Pallonji
          </p>
        </div>
      </div>
    </div>
  );
}
