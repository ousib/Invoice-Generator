import React from 'react';
import { ArrowLeft, Calendar, User, Share2, Clock } from 'lucide-react';
import { motion } from 'motion/react';

interface BlogPostProps {
  slug: string;
  onBack: () => void;
}

const POST_CONTENT: Record<string, { title: string; date: string; author: string; category: string; content: React.ReactNode; image: string }> = {
  'how-to-invoice-as-a-freelancer': {
    title: 'How to Invoice as a Freelancer: A Complete Guide',
    date: 'April 10, 2026',
    author: 'GomGom Team',
    category: 'Guides',
    image: 'https://picsum.photos/seed/invoice/1200/600',
    content: (
      <div className="prose prose-slate max-w-none">
        <p className="lead text-xl text-slate-600 mb-8">
          Invoicing is one of the most critical parts of running a freelance business. It's how you get paid, but it's also a reflection of your professionalism.
        </p>
        <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">1. Include All Essential Information</h2>
        <p className="text-slate-600 mb-6">
          A professional invoice should always include:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-slate-600 mb-8">
          <li>Your business name and contact information</li>
          <li>The client's name and contact information</li>
          <li>A unique invoice number for tracking</li>
          <li>The date the invoice was issued</li>
          <li>The payment due date</li>
          <li>A detailed list of services or products provided</li>
          <li>The total amount due, including any taxes or discounts</li>
        </ul>
        <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">2. Set Clear Payment Terms</h2>
        <p className="text-slate-600 mb-6">
          Don't leave your clients guessing when they should pay you. Common payment terms include "Due on Receipt," "Net 15" (due in 15 days), or "Net 30." Setting these terms upfront helps manage your cash flow.
        </p>
        <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">3. Use a Professional Template</h2>
        <p className="text-slate-600 mb-6">
          Using a tool like Simple Receipt Generator ensures that your invoices look professional and are easy to read. A well-designed invoice builds trust and makes it more likely that your client will pay you promptly.
        </p>
      </div>
    )
  },
  'essential-elements-of-a-professional-receipt': {
    title: '5 Essential Elements of a Professional Receipt',
    date: 'April 5, 2026',
    author: 'GomGom Team',
    category: 'Business Tips',
    image: 'https://picsum.photos/seed/receipt/1200/600',
    content: (
      <div className="prose prose-slate max-w-none">
        <p className="lead text-xl text-slate-600 mb-8">
          While invoices request payment, receipts confirm that payment has been made. They are essential for both you and your customers for tax and accounting purposes.
        </p>
        <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">1. The Word "Receipt"</h2>
        <p className="text-slate-600 mb-6">
          It sounds simple, but clearly labeling the document as a "Receipt" or "Payment Confirmation" prevents confusion with an outstanding invoice.
        </p>
        <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">2. Date of Transaction</h2>
        <p className="text-slate-600 mb-6">
          The date the payment was actually received is crucial for bookkeeping. This might be different from the date the invoice was issued.
        </p>
        <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">3. Payment Method</h2>
        <p className="text-slate-600 mb-6">
          Indicating whether the payment was made via Credit Card, Bank Transfer, or Cash provides a clear audit trail.
        </p>
      </div>
    )
  },
  'tax-deductions-for-small-business-owners': {
    title: 'Common Tax Deductions for Small Business Owners',
    date: 'March 28, 2026',
    author: 'GomGom Team',
    category: 'Finance',
    image: 'https://picsum.photos/seed/tax/1200/600',
    content: (
      <div className="prose prose-slate max-w-none">
        <p className="lead text-xl text-slate-600 mb-8">
          Maximizing your tax deductions is one of the easiest ways to increase your business's profitability. Many small business owners leave money on the table by not claiming all eligible expenses.
        </p>
        <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">1. Home Office Deduction</h2>
        <p className="text-slate-600 mb-6">
          If you use a portion of your home exclusively for business, you may be able to deduct a percentage of your rent, mortgage interest, utilities, and insurance.
        </p>
        <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">2. Professional Services</h2>
        <p className="text-slate-600 mb-6">
          Fees paid to accountants, lawyers, and consultants are generally fully deductible business expenses.
        </p>
        <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">3. Software and Subscriptions</h2>
        <p className="text-slate-600 mb-6">
          The cost of software used for your business, including accounting tools and project management apps, is a valid deduction.
        </p>
      </div>
    )
  },
  'why-digital-invoicing-is-better-than-paper': {
    title: 'Why Digital Invoicing is Better Than Paper',
    date: 'March 20, 2026',
    author: 'GomGom Team',
    category: 'Efficiency',
    image: 'https://picsum.photos/seed/digital/1200/600',
    content: (
      <div className="prose prose-slate max-w-none">
        <p className="lead text-xl text-slate-600 mb-8">
          In an increasingly digital world, relying on paper invoices is not just slow—it's bad for business. Here's why you should make the switch today.
        </p>
        <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">1. Faster Payments</h2>
        <p className="text-slate-600 mb-6">
          Digital invoices can be sent instantly via email or messaging apps. The faster a client receives an invoice, the faster they can process and pay it.
        </p>
        <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">2. Better Organization</h2>
        <p className="text-slate-600 mb-6">
          Digital tools allow you to store and search your invoices easily. No more digging through filing cabinets to find a transaction from six months ago.
        </p>
        <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">3. Professionalism</h2>
        <p className="text-slate-600 mb-6">
          A clean, digital invoice generated from a template looks far more professional than a handwritten or manually typed document.
        </p>
      </div>
    )
  }
};

export default function BlogPost({ slug, onBack }: BlogPostProps) {
  const post = POST_CONTENT[slug];

  if (!post) return null;

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-slate-200 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </button>
          <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </nav>

      <main className="pt-32 pb-20">
        <article className="max-w-4xl mx-auto px-4">
          <header className="mb-12 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
              {post.category}
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-tight mb-8">
              {post.title}
            </h1>
            <div className="flex items-center justify-center gap-6 text-slate-500 font-medium">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                {post.author}
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {post.date}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                5 min read
              </div>
            </div>
          </header>

          <div className="rounded-3xl overflow-hidden mb-12 shadow-2xl shadow-indigo-500/10">
            <img 
              src={post.image} 
              alt={post.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="max-w-2xl mx-auto">
            {post.content}
          </div>
        </article>
      </main>
    </div>
  );
}
