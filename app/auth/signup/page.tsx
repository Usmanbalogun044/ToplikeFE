"use client";

import Link from "next/link";
import { Mail, Lock, User } from "lucide-react";

export default function SignUpPage() {
  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-brand font-bold text-blue-600 mb-2">
          Create your account
        </h2>
        <p className="text-xs text-gray-500">
          Join thousands of users creating accounts today
        </p>
      </div>

      {/* Form */}
      <form className="space-y-4">
        
        {/* Name Input */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-600 ml-1">Name</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <User size={16} />
            </div>
            <input 
              type="text" 
              placeholder="Enter text" 
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            />
          </div>
        </div>

        {/* Email Input */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-600 ml-1">Email</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Mail size={16} />
            </div>
            <input 
              type="email" 
              placeholder="Enter text" 
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            />
          </div>
        </div>

        {/* Create Password */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-600 ml-1">Create password</label>
          <div className="relative">
             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Lock size={16} />
            </div>
            <input 
              type="password" 
              placeholder="Enter text" 
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            />
          </div>
        </div>

        {/* Confirm Password */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-600 ml-1">Confirm password</label>
          <div className="relative">
             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Lock size={16} />
            </div>
            <input 
              type="password" 
              placeholder="Enter text" 
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            />
          </div>
        </div>

        {/* Divider */}
        <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="flex-shrink-0 mx-4 text-xs text-gray-400">or</span>
            <div className="flex-grow border-t border-gray-200"></div>
        </div>

        {/* Google Button */}
        <button 
          type="button"
          className="w-full flex items-center justify-center gap-2 py-3 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          {/* Simple G Icon SVG */}
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Continue with Google
        </button>

        {/* Primary Button */}
        <button 
          type="submit"
          className="w-full py-3 rounded-lg bg-[#4006C7] text-white font-medium text-sm hover:opacity-90 transition-opacity mt-4"
        >
          Create account
        </button>

      </form>

      {/* Footer Link */}
      <p className="text-center text-xs text-gray-500 mt-6">
        Already have an account?{" "}
        <Link href="/auth/login" className="text-blue-600 font-semibold hover:underline">
          Sign in
        </Link>
      </p>

    </div>
  );
}