import React from 'react';
import { ArrowLeft, FileText, Scale, ShieldAlert, HelpCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface TermsOfServiceProps {
  onBack: () => void;
}

export default function TermsOfService({ onBack }: TermsOfServiceProps) {
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
              <Scale className="w-6 h-6" />
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Terms of Service</h1>
            <p className="text-slate-500">Last updated: April 12, 2026</p>
          </div>

          <section className="space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-xl">
              <FileText className="w-5 h-5 text-indigo-600" />
              <h2>1. Acceptance of Terms</h2>
            </div>
            <p className="text-slate-600 leading-relaxed">
              By accessing and using Simple Receipt Generator ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service.
            </p>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-xl">
              <Scale className="w-5 h-5 text-indigo-600" />
              <h2>2. Use of the Service</h2>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Simple Receipt Generator provides a tool for creating invoices and receipts. You are responsible for the accuracy of the information you enter into the Service. We do not guarantee that the documents generated will meet specific legal or tax requirements in your jurisdiction.
            </p>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-xl">
              <ShieldAlert className="w-5 h-5 text-indigo-600" />
              <h2>3. Limitation of Liability</h2>
            </div>
            <p className="text-slate-600 leading-relaxed">
              The Service is provided "as is" without any warranties. Simple Receipt Generator and its creators shall not be liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use the Service.
            </p>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-xl">
              <HelpCircle className="w-5 h-5 text-indigo-600" />
              <h2>4. Intellectual Property</h2>
            </div>
            <p className="text-slate-600 leading-relaxed">
              The software, design, and content of Simple Receipt Generator are the property of GomGom Technologies and are protected by copyright and other intellectual property laws.
            </p>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-xl">
              <FileText className="w-5 h-5 text-indigo-600" />
              <h2>5. Changes to Terms</h2>
            </div>
            <p className="text-slate-600 leading-relaxed">
              We reserve the right to modify these Terms of Service at any time. Your continued use of the Service after any changes constitutes your acceptance of the new terms.
            </p>
          </section>

          <div className="pt-10 border-t border-slate-100">
            <p className="text-slate-400 text-sm italic">
              If you have any questions about these Terms, please contact us at <a href="mailto:simplereceiptgenerator@gmail.com" className="text-indigo-600 hover:underline">simplereceiptgenerator@gmail.com</a>.
            </p>
          </div>
        </motion.div>
      </main>

      <footer className="bg-white border-t border-slate-200 py-12 text-center flex flex-col items-center gap-6 no-print">
        <div className="flex flex-wrap justify-center gap-6">
          <button onClick={onBack} className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors">Home</button>
          <a href="mailto:simplereceiptgenerator@gmail.com" className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors">Contact</a>
          <button onClick={onBack} className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors">Privacy Policy</button>
        </div>
        <p className="text-slate-400 text-sm max-w-md">© 2026 Simple Receipt Generator. Terms and Conditions.</p>
      </footer>
    </div>
  );
}
