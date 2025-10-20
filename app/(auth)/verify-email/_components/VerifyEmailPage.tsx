"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthLayout } from "@/components/Shared/AuthLayout";
import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

export default function VerifyEmailPage() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(300);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // 🧩 Paste Handler — handles full OTP paste
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").trim();
    if (!/^\d{6}$/.test(pasteData))
      return toast.error("Please paste a valid 6-digit OTP");

    const newOtp = pasteData.split("").slice(0, 6);
    setOtp(newOtp);

    // focus last field automatically
    inputRefs.current[5]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: { email: string; otp: string }) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/verify-email`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Invalid OTP");
      }
      return res.json();
    },
    onSuccess: () => {
      toast.success("Email verified successfully");
     router.push(`/reset-password?email=${encodeURIComponent(email || "")}`);
    },
    onError: (err: Error) => {
      toast.error(err.message || "Error verifying email");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Email not found");
      return;
    }
    mutate({ email, otp: otp.join("") });
  };

  const handleResend = () => {
    setTimer(59);
    setOtp(["", "", "", "", "", ""]);
    // Optionally call resend API
  };

  return (
    <AuthLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-serif text-[#0F3D61]">Verify Email</h1>
          <p className="text-base text-[#6C757D]">
            Enter the 6-digit code sent to your email
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex gap-3 justify-center">
            {otp.map((digit, index) => (
              <Input
                key={index}
                ref={(el: HTMLInputElement | null) => {
                  if (el !== null) {
                    inputRefs.current[index] = el;
                  }
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste} // ✅ added paste handler
                className="w-14 h-14 text-center !text-2xl border-2 border-[#484848] rounded-[10px] text-[#0F3D61] focus:ring-2 focus:ring-[#0F3D61] focus:border-[#0F3D61] font-bold"
              />
            ))}
          </div>

          <div className="flex justify-between">
            <div className="flex items-center justify-center gap-2 text-base text-[#6C757D]">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="12" r="10" strokeWidth="2" />
                <path strokeWidth="2" d="M12 6v6l4 2" />
              </svg>
              <span>
                {String(Math.floor(timer / 60)).padStart(2, "0")}:
                {String(timer % 60).padStart(2, "0")}
              </span>
            </div>

            <div className="text-center text-base text-[#6C757D]">
              Didn’t get a code?{" "}
              <button
                type="button"
                onClick={handleResend}
                className={`font-medium hover:underline ${
                  timer === 0
                    ? "text-[#0F3D61]"
                    : "text-[#0F3D61]/60 cursor-not-allowed"
                }`}
                disabled={timer > 0}
              >
                Resend
              </button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isPending || otp.some((digit) => !digit)}
            className="w-full bg-[#0F3D61] hover:bg-[#0F3D61]/90 text-white rounded-full font-bold py-6 text-base"
          >
            {isPending ? "Verifying..." : "Verify"}
          </Button>
        </form>
      </div>
    </AuthLayout>
  );
}
