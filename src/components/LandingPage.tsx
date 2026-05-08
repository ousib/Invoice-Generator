import React from 'react';
import { CheckCircle2, Zap, ShieldCheck, Globe, ArrowRight, ArrowLeft } from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
  onAbout: () => void;
  onPrivacy: () => void;
  onTerms: () => void;
  onContact: () => void;
  onBlog: () => void;
  onBlogWithPost: (slug: string) => void;
  logoSvg?: string;
}

export default function LandingPage({ 
  onStart, 
  onAbout, 
  onPrivacy, 
  onTerms, 
  onContact, 
  onBlog, 
  onBlogWithPost,
  logoSvg 
}: LandingPageProps) {
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
              onClick={onBlog}
              className="hidden md:block text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors"
            >
              Blog
            </button>
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
              Professional Invoicing for Modern Entrepreneurs
            </h2>
            <p className="mt-4 text-lg text-slate-600 max-w-3xl mx-auto">
              Our free receipt maker online is designed to help small businesses, freelancers, and contractors streamline their billing process. Professional invoices help you get paid faster and maintain healthy client relationships.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 mb-6">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Instant Generation</h3>
              <p className="text-slate-500 leading-relaxed">
                Create a professional receipt or invoice in under 60 seconds. Our simple invoice maker eliminates the learning curve of complex accounting software, allowing you to focus on growing your business.
              </p>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center text-green-600 mb-6">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Enterprise-Grade Security</h3>
              <p className="text-slate-500 leading-relaxed">
                Your privacy is our priority. We use secure cloud encryption and local storage options to ensure your sensitive business data stays private. No intrusive tracking, just a clean billing tool.
              </p>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600 mb-6">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Global Localization</h3>
              <p className="text-slate-500 leading-relaxed">
                Support for 100+ currencies and custom tax rates makes our online invoice generator perfect for international trade. Whether you're a local shop or a global agency, we've got you covered.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Features / Content Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full text-sm font-bold mb-6">
                <CheckCircle2 className="w-4 h-4" />
                Comprehensive Support
              </div>
              <h2 className="text-3xl font-black text-slate-900 mb-6 leading-tight">
                Designed for the Modern <span className="text-indigo-600">Entrepreneur</span>
              </h2>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                Whether you're a freelance graphic designer, a local handyman, or a growing consulting firm, our platform provides a robust set of features to handle your daily billing needs. We've optimized every part of the experience to ensure you spend less time on paperwork and more time doing what you love.
              </p>
              <ul className="space-y-4">
                {[
                  "Automatic tax calculations for any jurisdiction",
                  "Support for 100+ global currencies including USD, EUR, GBP, and NGN",
                  "Professional templates: Classic, Modern, and Minimalist",
                  "One-click PDF generation with high-quality vector rendering",
                  "Secure cloud sync to save your drafts and client history"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-700">
                    <div className="mt-1 w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                      <div className="w-2 h-2 bg-indigo-600 rounded-full" />
                    </div>
                    <span className="font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="order-1 lg:order-2 bg-slate-50 rounded-3xl p-10 border border-slate-200">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Why use a digital receipt maker?</h3>
              <p className="text-slate-500 mb-6 italic">
                "In today's digital economy, a professional invoice is more than just a payment request—it's a touchpoint for your brand. Using a digital generator ensures consistency, accuracy, and builds long-term trust with your clients."
              </p>
              <div className="space-y-4">
                <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                  <h4 className="font-bold text-slate-900 mb-1">Instant Accountability</h4>
                  <p className="text-sm text-slate-500">Provide clients with immediate proof of purchase, reducing disputes and improving customer satisfaction.</p>
                </div>
                <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                  <h4 className="font-bold text-slate-900 mb-1">Tax Readiness</h4>
                  <p className="text-sm text-slate-500">Easily organize your income records for quarterly or annual tax filings without digging through paper stacks.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">
            Frequently Asked Questions About Our Online Invoice Tool
          </h2>
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-2">Is this invoice generator really free to use?</h3>
              <p className="text-slate-600">
                Yes, Simple Receipt Generator is 100% free with no hidden charges. We believe that every small business deserves access to high-quality billing tools without a monthly subscription. You can download unlimited PDF invoices for free.
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-2">Do I need to sign up for an account?</h3>
              <p className="text-slate-600">
                No registration or sign-up is required to generate invoices. We value your time—just open the tool, enter your professional details, and generate your document. If you wish to save your history for later, we offer secure cloud sync options.
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-2">Can I create both receipts and invoices?</h3>
              <p className="text-slate-600">
                Absolutely! Our platform is a versatile receipt maker online. You can easily toggle between invoice and receipt modes. The generated PDF will adjust its layout and terminology to match the document type you choose.
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-2">Is my business data and client info secure?</h3>
              <p className="text-slate-600">
                Security is foundational to our service. We use encrypted connections and industry-standard security protocols to protect all data. We do not sell your data or use it for marketing. For maximum privacy, you can use the "Local Storage" mode to keep data strictly on your device.
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-2">How do I download my invoice as a PDF?</h3>
              <p className="text-slate-600">
                Once you finish entering your details in the editor, simply click the "Download PDF" button. Our system will generate a high-resolution, print-ready document formatted according to your chosen template.
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

      {/* Blog Preview Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
                Insights for Small Business Owners
              </h2>
              <p className="mt-4 text-lg text-slate-600">
                Learn from our expert guides on invoicing, accounting, and growth strategies.
              </p>
            </div>
            <button 
              onClick={onBlog}
              className="group flex items-center gap-2 text-indigo-600 font-bold hover:text-indigo-700 transition-colors"
            >
              View All Articles
              <ArrowLeft className="w-5 h-5 rotate-180 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div 
              onClick={() => onBlogWithPost('how-to-invoice-as-a-freelancer')}
              className="group cursor-pointer"
            >
              <div className="aspect-video rounded-2xl overflow-hidden mb-4 shadow-sm group-hover:shadow-lg transition-all">
                <img src="https://picsum.photos/seed/invoice/800/450" alt="Invoicing Guide" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-2">
                How to Invoice as a Freelancer: A Complete Guide
              </h3>
              <p className="text-slate-500 text-sm line-clamp-3">
                Mastering the art of invoicing is crucial for any freelancer. Learn the best practices to get paid on time, every time.
              </p>
            </div>
            <div 
              onClick={() => onBlogWithPost('tax-deductions-for-small-business-owners')}
              className="group cursor-pointer"
            >
              <div className="aspect-video rounded-2xl overflow-hidden mb-4 shadow-sm group-hover:shadow-lg transition-all">
                <img src="https://picsum.photos/seed/tax/800/450" alt="Tax Deductions" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-2">
                Common Tax Deductions for Small Business Owners
              </h3>
              <p className="text-slate-500 text-sm line-clamp-3">
                Are you missing out on tax savings? Discover the most common deductions that can help you keep more of your hard-earned money.
              </p>
            </div>
            <div 
              onClick={() => onBlogWithPost('essential-elements-of-a-professional-receipt')}
              className="group cursor-pointer"
            >
              <div className="aspect-video rounded-2xl overflow-hidden mb-4 shadow-sm group-hover:shadow-lg transition-all">
                <img src="https://picsum.photos/seed/receipt/800/450" alt="Professional Receipt" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-2">
                5 Essential Elements of a Professional Receipt
              </h3>
              <p className="text-slate-500 text-sm line-clamp-3">
                What makes a receipt professional? We break down the key components you need to include for legal and accounting purposes.
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
              href="mailto:simplereceiptgenerator@gmail.com" 
              className="text-xs text-slate-400 hover:text-indigo-600 transition-colors"
            >
              simplereceiptgenerator@gmail.com
            </a>
          </div>
          <div className="flex items-center gap-8">
            <button 
              onClick={onBlog}
              className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors"
            >
              Blog
            </button>
            <button 
              onClick={onAbout}
              className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors"
            >
              About Us
            </button>
            <button 
              onClick={onContact}
              className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors"
            >
              Contact
            </button>
            <button 
              onClick={onPrivacy}
              className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors"
            >
              Privacy Policy
            </button>
            <button 
              onClick={onTerms}
              className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors"
            >
              Terms
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
