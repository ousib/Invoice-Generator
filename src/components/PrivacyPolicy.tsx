import React from 'react';
import { ArrowLeft, ShieldCheck, Lock, Eye, FileText } from 'lucide-react';
import { motion } from 'motion/react';

interface PrivacyPolicyProps {
  onBack: () => void;
}

export default function PrivacyPolicy({ onBack }: PrivacyPolicyProps) {
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-slate-200 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 pt-32 pb-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-sm space-y-10"
        >
          <div className="space-y-4">
            <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Privacy Policy</h1>
            <p className="text-slate-500">Last updated: March 29, 2026</p>
          </div>

          <section className="space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-xl">
              <Lock className="w-5 h-5 text-indigo-600" />
              <h2>Data Collection & Storage</h2>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Simple Receipt Generator is designed with privacy as a priority. We do not store your invoice data on our servers. All information you enter (business details, client info, line items) is stored locally in your browser's memory (LocalStorage) so you can resume your work later. 
            </p>
            <p className="text-slate-600 leading-relaxed">
              When you generate a PDF, the conversion happens entirely within your browser. No data is transmitted to our backend for processing.
            </p>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-xl">
              <Eye className="w-5 h-5 text-indigo-600" />
              <h2>Third-Party Services</h2>
            </div>
            <p className="text-slate-600 leading-relaxed">
              We use Google AdSense to serve advertisements on our website. Google may use cookies to serve ads based on your prior visits to our website or other websites. Google's use of advertising cookies enables it and its partners to serve ads to you based on your visit to our sites and/or other sites on the Internet.
            </p>
            <p className="text-slate-600 leading-relaxed">
              You may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">Ads Settings</a>.
            </p>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-xl">
              <FileText className="w-5 h-5 text-indigo-600" />
              <h2>Cookies</h2>
            </div>
            <p className="text-slate-600 leading-relaxed">
              We use essential cookies to ensure the website functions correctly. Third-party vendors, including Google, use cookies to serve ads based on a user's prior visits to your website or other websites.
            </p>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-xl">
              <ShieldCheck className="w-5 h-5 text-indigo-600" />
              <h2>Consent</h2>
            </div>
            <p className="text-slate-600 leading-relaxed">
              By using our website, you hereby consent to our Privacy Policy and agree to its terms.
            </p>
          </section>

          <div className="pt-10 border-t border-slate-100">
            <p className="text-slate-400 text-sm italic">
              If you have any questions about our Privacy Policy, please contact us at simplereceiptgenerator@gmail.com.
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
