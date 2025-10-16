"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff } from "lucide-react";
import { AuthLayout } from "@/components/Shared/AuthLayout";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle sign in logic
    console.log({ email, password, rememberMe });
  };

  return (
    <AuthLayout>
      <div className="space-y-6 ">
        <div className="">
          <h1 className="text-4xl font-serif text-[#0F3D61]">Hello!</h1>
          <p className="text-base text-[#6C757D]">
            Access to manage your account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-base font-medium text-[#0F3D61]"
            >
              Email <span className="text-[#0F3D61]">*</span>
            </label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white border-[#484848] rounded-full px-4 h-[56px] placeholder:text-[#787878] text-[#0F3D61] text-base font-normal"
              required
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="password"
              className="text-base font-medium text-[#0F3D61]"
            >
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter Password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white border-[#484848] rounded-full px-4 h-[56px] placeholder:text-[#787878] text-[#0F3D61] text-base font-normal"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between space-y-6">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
              />
              <label
                htmlFor="remember"
                className="text-base text-[#0F3D61] cursor-pointer"
              >
                Remember Me
              </label>
            </div>
            <Link
              href="/forgot-password"
              className="text-base text-[#0F3D61] hover:underline"
            >
              Forget Password?
            </Link>
          </div>

          <div className="pt-6">
            <Button
              type="submit"
              className="w-full bg-[#0F3D61] hover:bg-[#0F3D61]/90 text-white rounded-full font-bold py-6 text-base "
            >
              Sign In
            </Button>
          </div>
        </form>

        {/* <p className="text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link href="/sign-up" className="text-[#0a3d62] font-medium hover:underline">
            Sign Up
          </Link>
        </p> */}
      </div>
    </AuthLayout>
  );
}
