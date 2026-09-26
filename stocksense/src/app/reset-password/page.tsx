"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { KeyRound } from "lucide-react";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(""); setError("");
    const res = await fetch("/api/reset-password", {
      method: "POST",
      body: JSON.stringify({ action: "send_otp", email }),
      headers: { "Content-Type": "application/json" }
    });
    if (res.ok) {
      setStep(2);
      setMessage("OTP generated! (Check terminal console for the demo)");
    } else {
      setError("User not found.");
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(""); setError("");
    const res = await fetch("/api/reset-password", {
      method: "POST",
      body: JSON.stringify({ action: "reset", email, otp, newPassword }),
      headers: { "Content-Type": "application/json" }
    });
    if (res.ok) {
      router.push("/login?reset=success");
    } else {
      setError("Invalid OTP or error resetting password.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
            <KeyRound size={32} className="text-orange-500" />
          </div>
          <h1 className="text-3xl font-bold text-slate-800">Reset Password</h1>
          <p className="text-slate-500 text-center mt-2">Enter your email to receive a One-Time Password (OTP)</p>
        </div>

        {error && <div className="bg-red-50 text-red-500 p-3 rounded-lg mb-4 text-sm font-medium text-center">{error}</div>}
        {message && <div className="bg-green-50 text-green-600 p-3 rounded-lg mb-4 text-sm font-medium text-center">{message}</div>}

        {step === 1 ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
              <input 
                type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none" 
              />
            </div>
            <button type="submit" className="w-full bg-orange-500 text-white font-medium py-2 rounded-lg hover:bg-orange-600 transition-colors mt-4">
              Send OTP
            </button>
          </form>
        ) : (
          <form onSubmit={handleReset} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Enter OTP</label>
              <input 
                type="text" required value={otp} onChange={(e) => setOtp(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none tracking-widest text-center text-xl" 
                placeholder="------"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">New Password</label>
              <input 
                type="password" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none" 
              />
            </div>
            <button type="submit" className="w-full bg-orange-500 text-white font-medium py-2 rounded-lg hover:bg-orange-600 transition-colors mt-4">
              Reset Password
            </button>
          </form>
        )}

        <div className="text-center mt-6 text-sm text-slate-500">
          <Link href="/login" className="text-orange-500 font-medium hover:underline">&larr; Back to Login</Link>
        </div>
      </div>
    </div>
  );
}
