import React from 'react';
import { ArrowLeft, ShieldCheck, Zap, Globe, Heart } from 'lucide-react';

interface AboutPageProps {
  onBack: () => void;
  logoSvg?: string;
}

export default function AboutPage({ onBack, logoSvg }: AboutPageProps) {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack}
              className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
              title="Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              {logoSvg ? (
                <div 
                  className="h-8 w-auto flex items-center"
                  dangerouslySetInnerHTML={{ __html: logoSvg }} 
                />
              ) : (
                <>
                  <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">S</div>
                  <span className="text-xl font-bold tracking-tight hidden sm:block">Simple Receipt Generator</span>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-black text-slate-900 mb-4">About Simple Receipt Generator</h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto">
            We believe that getting paid shouldn't be complicated. Our mission is to provide the simplest, fastest, and most accessible billing tool for small businesses and freelancers worldwide.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
          <div className="space-y-4">
            <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600">
              <Zap className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Our Philosophy</h2>
            <p className="text-slate-600 leading-relaxed">
              Most accounting software is bloated, expensive, and requires a steep learning curve. We stripped away everything except what you actually need: a way to create a professional PDF invoice or receipt in seconds.
            </p>
          </div>

          <div className="space-y-4">
            <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center text-green-600">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Privacy First</h2>
            <p className="text-slate-600 leading-relaxed">
              Your data is yours. We offer secure cloud storage (Supabase) so you can access your invoices from any device, protected by row-level security. You can also choose to work entirely locally in your browser for maximum privacy.
            </p>
          </div>

          <div className="space-y-4">
            <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600">
              <Globe className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Global Accessibility</h2>
            <p className="text-slate-600 leading-relaxed">
              Whether you're a market vendor in Lagos, a freelance designer in London, or a consultant in New York, our tool is designed to work for you with multi-currency support and flexible tax settings.
            </p>
          </div>

          <div className="space-y-4">
            <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center text-red-600">
              <Heart className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">100% Free</h2>
            <p className="text-slate-600 leading-relaxed">
              No subscriptions, no "pro" features, no watermarks. Simple Receipt Generator is a free utility for the global entrepreneurial community.
            </p>
          </div>
        </div>

        <div className="bg-slate-50 rounded-3xl p-8 md:p-12 text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left mt-8">
            <div>
              <div className="text-indigo-600 font-black text-3xl mb-2">01.</div>
              <h3 className="font-bold text-slate-900 mb-2">Enter Details</h3>
              <p className="text-sm text-slate-500">Fill in your business info, client details, and line items.</p>
            </div>
            <div>
              <div className="text-indigo-600 font-black text-3xl mb-2">02.</div>
              <h3 className="font-bold text-slate-900 mb-2">Preview</h3>
              <p className="text-sm text-slate-500">See your professional invoice update in real-time as you type.</p>
            </div>
            <div>
              <div className="text-indigo-600 font-black text-3xl mb-2">03.</div>
              <h3 className="font-bold text-slate-900 mb-2">Download</h3>
              <p className="text-sm text-slate-500">Click download to get a high-quality PDF ready to send.</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-slate-200 py-12 text-center flex flex-col items-center gap-6">
        <div className="flex flex-wrap justify-center gap-6">
          <button onClick={onBack} className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors">Home</button>
          <p className="text-sm font-medium text-slate-900">About Us</p>
          <a href="mailto:gomgomtechnologies@gmail.com" className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors">Contact</a>
        </div>
        <p className="text-slate-400 text-sm max-w-md">© 2026 Simple Receipt Generator. Built for the global small business community. We are dedicated to providing free, high-quality billing tools for entrepreneurs everywhere.</p>
        <a 
          href="mailto:gomgomtechnologies@gmail.com" 
          className="text-xs text-slate-400 hover:text-indigo-600 transition-colors"
        >
          gomgomtechnologies@gmail.com
        </a>
      </footer>
    </div>
  );
}
