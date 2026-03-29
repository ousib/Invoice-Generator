import React from 'react';
import { CheckCircle2, Zap, ShieldCheck, Globe, ArrowRight } from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
  onAbout: () => void;
  onPrivacy: () => void;
  logoSvg?: string;
}

export default function LandingPage({ onStart, onAbout, onPrivacy, logoSvg }: LandingPageProps) {
  return (
    <div className="bg-white no-print">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {logoSvg ? (
              <div 
                className="h-8 w-auto flex items-center"
                dangerouslySetInnerHTML={{ __html: logoSvg }} 
              />
            ) : (
              <>
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">S</div>
                <span className="text-xl font-bold tracking-tight">Simple Receipt Generator</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-6">
            <button 
              onClick={onAbout}
              className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors"
            >
              About Us
            </button>
            <button 
              onClick={onStart}
              className="hidden sm:block px-5 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100"
            >
              Create Invoice
            </button>
          </div>
        </div>
      </nav>

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

      {/* SEO Content Section: How to Guide */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">
                How to Create a Professional Invoice in 4 Simple Steps
              </h2>
              <p className="text-lg text-slate-600 mb-8">
                Using our <span className="font-semibold text-indigo-600">free online invoice generator</span> is the fastest way to bill your clients. Follow these simple steps to create your first document:
              </p>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">1</div>
                  <div>
                    <h4 className="font-bold text-slate-900">Enter Your Business Details</h4>
                    <p className="text-slate-500">Add your business name, address, and contact info. You can even upload your logo for a professional look.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">2</div>
                  <div>
                    <h4 className="font-bold text-slate-900">Add Client Information</h4>
                    <p className="text-slate-500">Input your client's name and contact details so they know exactly who the invoice is for.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">3</div>
                  <div>
                    <h4 className="font-bold text-slate-900">List Items and Services</h4>
                    <p className="text-slate-500">Add line items for your products or services, including quantities and prices. Our tool calculates the totals automatically.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">4</div>
                  <div>
                    <h4 className="font-bold text-slate-900">Download and Send</h4>
                    <p className="text-slate-500">Click the download button to save your <span className="font-semibold text-indigo-600">PDF invoice</span>. It's ready to be emailed to your client instantly.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-200 rotate-2">
              <div className="space-y-4 opacity-50">
                <div className="h-4 bg-slate-100 rounded w-3/4"></div>
                <div className="h-4 bg-slate-100 rounded w-1/2"></div>
                <div className="border-t border-slate-100 pt-4 space-y-2">
                  <div className="h-3 bg-slate-50 rounded w-full"></div>
                  <div className="h-3 bg-slate-50 rounded w-full"></div>
                  <div className="h-3 bg-slate-50 rounded w-2/3"></div>
                </div>
                <div className="pt-8 flex justify-end">
                  <div className="h-10 w-32 bg-indigo-600 rounded-lg"></div>
                </div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white px-6 py-3 rounded-2xl shadow-2xl border border-indigo-100 text-indigo-600 font-bold flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Live Preview
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEO Content Section: Best Practices */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
              Invoicing Best Practices for Getting Paid Faster
            </h2>
            <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
              A professional <span className="font-semibold text-indigo-600">online receipt generator</span> is just the start. Follow these tips to optimize your billing process.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 rounded-3xl bg-white border border-slate-100 hover:border-indigo-100 transition-colors">
              <h3 className="text-xl font-bold text-slate-900 mb-4">1. Be Clear and Concise</h3>
              <p className="text-slate-500 leading-relaxed">
                Ensure your line items are easy to understand. Instead of "Consulting," use "SEO Strategy Consultation - 5 Hours." Clarity reduces questions and speeds up the payment process.
              </p>
            </div>
            <div className="p-8 rounded-3xl bg-white border border-slate-100 hover:border-indigo-100 transition-colors">
              <h3 className="text-xl font-bold text-slate-900 mb-4">2. Include Payment Terms</h3>
              <p className="text-slate-500 leading-relaxed">
                Specify your payment terms clearly. Whether it's "Due on Receipt" or "Net 30," setting expectations upfront prevents confusion and late payments.
              </p>
            </div>
            <div className="p-8 rounded-3xl bg-white border border-slate-100 hover:border-indigo-100 transition-colors">
              <h3 className="text-xl font-bold text-slate-900 mb-4">3. Send Invoices Promptly</h3>
              <p className="text-slate-500 leading-relaxed">
                The best time to send an invoice is immediately after the work is completed. Using a <span className="font-semibold text-indigo-600">simple invoice maker</span> allows you to do this in seconds while the value is fresh in the client's mind.
              </p>
            </div>
            <div className="p-8 rounded-3xl bg-white border border-slate-100 hover:border-indigo-100 transition-colors">
              <h3 className="text-xl font-bold text-slate-900 mb-4">4. Follow Up on Overdue Payments</h3>
              <p className="text-slate-500 leading-relaxed">
                Don't be afraid to send a polite reminder if a payment is late. Most clients simply forget, and a quick follow-up can resolve the issue quickly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SEO Content Section: Benefits */}
      <section className="py-24 bg-indigo-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold sm:text-4xl">
              Why Your Small Business Needs a Professional Receipt Maker
            </h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="space-y-4">
              <h4 className="text-xl font-bold text-indigo-300">Builds Trust</h4>
              <p className="text-indigo-100/70 leading-relaxed">
                A professional, well-formatted invoice signals to your clients that you are a serious business. It builds credibility and trust, making them more likely to work with you again.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="text-xl font-bold text-indigo-300">Improves Organization</h4>
              <p className="text-indigo-100/70 leading-relaxed">
                Keeping track of your billing is essential for tax purposes and financial health. Our <span className="font-semibold text-white">receipt maker online</span> helps you maintain a consistent record of all transactions.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="text-xl font-bold text-indigo-300">Legal Compliance</h4>
              <p className="text-indigo-100/70 leading-relaxed">
                Many regions require businesses to provide formal receipts for tax and accounting. Using a standardized template ensures you meet these requirements without the hassle.
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

      {/* Footer */}
      <footer className="py-12 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start gap-2">
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              © 2026 Simple Receipt Generator. All rights reserved.
            </div>
            <a 
              href="mailto:gomgomtechnologies@gmail.com" 
              className="text-xs text-slate-400 hover:text-indigo-600 transition-colors"
            >
              gomgomtechnologies@gmail.com
            </a>
          </div>
          <div className="flex items-center gap-8">
            <button 
              onClick={onAbout}
              className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors"
            >
              About Us
            </button>
            <button 
              onClick={onPrivacy}
              className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors"
            >
              Privacy Policy
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
