import React from 'react';
import { CheckCircle2, Zap, ShieldCheck, Globe, ArrowRight } from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
  logoSvg?: string;
}

export default function LandingPage({ onStart, logoSvg }: LandingPageProps) {
  return (
    <div className="bg-white no-print">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-24 lg:pt-32 lg:pb-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            {logoSvg && (
              <div 
                className="h-16 w-auto flex justify-center mb-8"
                dangerouslySetInnerHTML={{ __html: logoSvg }} 
              />
            )}
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl lg:text-7xl">
              Free Online <span className="text-indigo-600">Invoice Generator</span> <br className="hidden sm:block" />
              for Small Businesses
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-xl text-slate-500">
              Create professional invoices and receipts in seconds. No login required. No hidden fees. Just simple, fast, and free billing for entrepreneurs globally.
            </p>
            <div className="mt-10 flex justify-center gap-4">
              <button
                onClick={onStart}
                className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-bold rounded-2xl text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
              >
                Create Invoice Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </button>
            </div>
            <div className="mt-8 flex items-center justify-center gap-6 text-sm font-medium text-slate-400">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                No Account Needed
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                PDF Download
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                100% Free
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative Background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-400 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-400 rounded-full blur-3xl" />
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
              The Simple Invoice Maker for Small Business
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Everything you need to get paid faster, without the complexity of accounting software.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 mb-6">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Lightning Fast</h3>
              <p className="text-slate-500 leading-relaxed">
                Generate a professional receipt or invoice in under 60 seconds. Our intuitive editor is built for speed and efficiency.
              </p>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center text-green-600 mb-6">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Privacy First</h3>
              <p className="text-slate-500 leading-relaxed">
                We don't store your business or client data on our servers. Your information stays in your browser until you download the PDF.
              </p>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600 mb-6">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Global Ready</h3>
              <p className="text-slate-500 leading-relaxed">
                Whether you're in Lagos, Nairobi, London, or New York, our currency selector and tax support have you covered.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Is this invoice generator really free?</h3>
              <p className="text-slate-600">
                Yes, Simple Receipt Generator is 100% free to use. There are no subscription fees, no "pro" versions, and no watermarks on your downloaded PDFs.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Do I need to create an account?</h3>
              <p className="text-slate-600">
                No account is required. We built this for speed. Just open the app, fill in your details, and download your invoice.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Can I use this for receipts?</h3>
              <p className="text-slate-600">
                Absolutely! You can toggle between "Invoice" and "Receipt" modes with a single click. The layout adjusts automatically to suit your needs.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Is my data secure?</h3>
              <p className="text-slate-600">
                Since we don't require a login and don't store your data on our servers, your business information is as secure as your own device.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-indigo-600">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-8">
            Ready to create your professional invoice?
          </h2>
          <button
            onClick={onStart}
            className="inline-flex items-center px-10 py-4 border border-transparent text-xl font-bold rounded-2xl text-indigo-600 bg-white hover:bg-slate-50 transition-all shadow-xl"
          >
            Start Generating Now
          </button>
        </div>
      </section>
    </div>
  );
}
