import React, { useState } from 'react';
import BrandLogo from '../components/BrandLogo';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

export default function LoginPage({ onLoginSuccess }) {
  const [email, setEmail] = useState('j.doe@waterwatch.org');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e?.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess();
    }, 600);
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-gradient-brand dark:bg-dark-bg px-margin-mobile md:px-margin-desktop py-12 overflow-hidden transition-colors duration-300">
      
      {/* Abstract Background Atmospheric Blobs */}
      <div className="absolute top-[-10%] left-[-5%] w-96 h-96 bg-primary-fixed/30 dark:bg-primary/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-60 pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-[-10%] right-[-5%] w-96 h-96 bg-secondary-fixed/40 dark:bg-secondary/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-60 pointer-events-none animate-pulse-slow" style={{ animationDelay: '1.5s' }} />

      {/* Main Glassmorphic Login Card */}
      <div className="w-full max-w-md glass-card rounded-2xl p-8 md:p-10 relative z-10 animate-pop-in">
        
        {/* Header with Small Static Brand Logo */}
        <div className="flex flex-col items-center mb-8">
          <BrandLogo size="large" showWordmark={true} className="mb-4" />
          <h1 className="font-bold text-2xl md:text-3xl text-on-surface dark:text-white text-center tracking-tight">
            Welcome Back
          </h1>
          <p className="text-sm md:text-base text-on-surface-variant dark:text-gray-300 mt-2 text-center">
            Access real-time water monitoring & satellite telemetry
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Email */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface dark:text-gray-200 mb-1.5" htmlFor="email">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-outline dark:text-gray-400">
                <Mail className="w-5 h-5" />
              </div>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="researcher@waterwatch.org"
                required
                className="block w-full pl-11 pr-4 py-3.5 border border-border-subtle dark:border-dark-border rounded-xl bg-surface-container-lowest dark:bg-dark-card text-on-surface dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm shadow-sm outline-none"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface dark:text-gray-200" htmlFor="password">
                Password
              </label>
              <a href="#forgot" onClick={(e) => { e.preventDefault(); alert("Demo mode: password is automatically populated."); }} className="text-xs font-semibold text-primary dark:text-primary-fixed hover:underline">
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-outline dark:text-gray-400">
                <Lock className="w-5 h-5" />
              </div>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="block w-full pl-11 pr-11 py-3.5 border border-border-subtle dark:border-dark-border rounded-xl bg-surface-container-lowest dark:bg-dark-card text-on-surface dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm shadow-sm outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-outline dark:text-gray-400 hover:text-on-surface dark:hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center">
            <input
              id="remember-me"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 text-primary focus:ring-primary border-border-subtle rounded cursor-pointer accent-primary"
            />
            <label htmlFor="remember-me" className="ml-2.5 block text-sm text-on-surface-variant dark:text-gray-300 cursor-pointer select-none">
              Remember credentials for 30 days
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center items-center py-3.5 px-4 rounded-xl shadow-md font-semibold text-base text-on-primary bg-primary hover:bg-primary-container active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 cursor-pointer"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Authenticating...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Log in to Dashboard
                <ArrowRight className="w-5 h-5" />
              </span>
            )}
          </button>
        </form>

        {/* Quick Demo Login Option */}
        <div className="mt-6 pt-5 border-t border-border-subtle dark:border-dark-border text-center">
          <button
            type="button"
            onClick={onLoginSuccess}
            className="w-full py-2.5 px-3 bg-surface-container-low dark:bg-dark-card hover:bg-surface-variant dark:hover:bg-gray-800 rounded-xl text-xs font-semibold text-primary dark:text-primary-fixed border border-border-subtle dark:border-dark-border transition-colors flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            Quick Demo Login (Dr. Jane Doe)
          </button>
          <p className="text-xs text-on-surface-variant dark:text-gray-400 mt-4">
            Need municipal or academic access? <a href="#request" onClick={(e) => { e.preventDefault(); alert("Access Request: Please contact support@aqua-ethic.org"); }} className="text-primary dark:text-primary-fixed font-semibold hover:underline">Request API Access</a>
          </p>
        </div>

      </div>
    </div>
  );
}
