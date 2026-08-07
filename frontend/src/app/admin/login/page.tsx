"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, User, Lock, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { API_BASE_URL } from "@/utils/api";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Authentication failed");
      }

      // Save token to localStorage
      localStorage.setItem("la_school_token", data.token);
      localStorage.setItem("la_school_username", data.username);
      
      // Redirect to admin dashboard
      router.push("/admin/dashboard");
    } catch (err: any) {
      setError(err.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-light flex flex-col justify-center items-center px-6 py-12 relative overflow-hidden">
      
      {/* Absolute Decorative Blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/5 rounded-full filter blur-3xl pointer-events-none" />

      {/* Back button */}
      <div className="absolute top-6 left-6 z-10">
        <Link 
          href="/" 
          className="font-nav text-xs font-semibold uppercase tracking-wider text-gray-500 hover:text-primary flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Website
        </Link>
      </div>

      <div className="relative z-10 w-full max-w-md bg-white border border-gray-100 rounded-3xl p-8 sm:p-10 shadow-xl">
        
        {/* Crest & Title */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-gray-900 leading-tight">Staff Portal</h1>
          <p className="font-body text-xs text-gray-400 mt-1 uppercase tracking-wider">CMS Authentication Desk</p>
        </div>

        {error && (
          <div className="mb-6 bg-primary/5 border border-primary/20 text-primary text-xs font-body p-4 rounded-xl text-center">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          {/* Username */}
          <div className="flex flex-col gap-1.5">
            <label className="font-nav text-xs font-bold uppercase tracking-wider text-gray-500">Username</label>
            <div className="flex items-center bg-bg-light border border-gray-100 focus-within:border-primary transition-colors rounded-xl px-3.5">
              <User className="w-4 h-4 text-gray-400 mr-2" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-transparent outline-none py-3.5 text-sm text-gray-800 placeholder-gray-400"
                placeholder="Enter staff username"
              />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label className="font-nav text-xs font-bold uppercase tracking-wider text-gray-500">Password</label>
            <div className="flex items-center bg-bg-light border border-gray-100 focus-within:border-primary transition-colors rounded-xl px-3.5">
              <Lock className="w-4 h-4 text-gray-400 mr-2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent outline-none py-3.5 text-sm text-gray-800 placeholder-gray-400"
                placeholder="Enter staff password"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full font-nav text-sm font-semibold uppercase tracking-wider bg-primary hover:bg-primary/95 disabled:bg-primary/50 text-white py-4 rounded-xl shadow-lg shadow-primary/20 transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              "Access Dashboard"
            )}
          </button>
        </form>

      </div>
    </div>
  );
}
