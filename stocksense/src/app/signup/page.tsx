"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PackageSearch } from "lucide-react";

export default function SignupPage() {
  const [loginId, setLoginId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== rePassword) {
      setError("Passwords do not match");
      return;
    }

    const res = await fetch("/api/signup", {
      method: "POST",
      body: JSON.stringify({ loginId, email, password }),
      headers: { "Content-Type": "application/json" }
    });

    if (res.ok) {
      router.push("/login");
    } else {
      const data = await res.json();
      setError(data.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 py-12">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
            <PackageSearch size={32} className="text-orange-500" />
          </div>
          <h1 className="text-3xl font-bold text-slate-800">StockSense</h1>
        </div>

        {error && <div className="bg-red-50 text-red-500 p-3 rounded-lg mb-4 text-sm font-medium text-center">{error}</div>}

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Enter Login Id</label>
            <input 
              type="text" 
              required 
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Enter Email Id</label>
            <input 
              type="email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Enter Password</label>
            <input 
              type="password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Re-Enter Password</label>
            <input 
              type="password" 
              required 
              value={rePassword}
              onChange={(e) => setRePassword(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none" 
            />
          </div>
          
          <button type="submit" className="w-full bg-orange-500 text-white font-medium py-2 rounded-lg hover:bg-orange-600 transition-colors mt-6 uppercase">
            SIGN UP
          </button>
        </form>

        <div className="text-center mt-6 text-sm text-slate-500">
          Already have an account? <Link href="/login" className="text-orange-500 font-medium hover:underline">Sign In</Link>
        </div>
      </div>
    </div>
  );
}
