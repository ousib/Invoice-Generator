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
        <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">4. Managing Your Invoicing Workflow</h2>
        <p className="text-slate-600 mb-6">
          Efficiency is key to maintaining a healthy business. We recommend setting aside a specific time each week to review pending invoices and send reminders for anything that's overdue. Using a digital generator like ours allows you to create professional documents on the fly, reducing administrative bloat and letting you focus on billable work.
        </p>
        <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">5. Professional Tracking</h2>
        <p className="text-slate-600 mb-6">
          Finally, always keep a record of your sent invoices and received payments. This isn't just about getting paid now; it's about having a clear financial history for tax time and long-term business planning. Professional tracking ensures you never miss a payment and can accurately report your income when it's time to file.
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
          While invoices request payment, receipts confirm that payment has been made. They are essential for both you and your customers for tax and accounting purposes. A clear receipt builds trust and provides legal protection for both parties.
        </p>
        <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">1. The Word "Receipt"</h2>
        <p className="text-slate-600 mb-6">
          It sounds simple, but clearly labeling the document as a "Receipt" or "Payment Confirmation" prevents confusion with an outstanding invoice. This clear designation is important for customer record-keeping and shows that the transaction is finalized.
        </p>
        <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">2. Date of Transaction</h2>
        <p className="text-slate-600 mb-6">
          The date the payment was actually received is crucial for bookkeeping. This might be different from the date the invoice was issued. Accurately recording this date helps in reconciling bank statements and staying organized for audit purposes.
        </p>
        <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">3. Detailed Itemization</h2>
        <p className="text-slate-600 mb-6">
          Just like an invoice, a receipt should list exactly what was paid for. Including quantity, unit price, and a brief description helps customers verify their purchase and assists businesses in inventory or service tracking.
        </p>
        <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">4. Payment Method Indicator</h2>
        <p className="text-slate-600 mb-6">
          Indicating whether the payment was made via Credit Card, Bank Transfer, or Cash provides a clear audit trail. It's helpful to include the last four digits of the card or a reference number for digital transfers to simplify future inquiries or refunds.
        </p>
        <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">5. Total Amount and Applied Taxes</h2>
        <p className="text-slate-600 mb-6">
          Be explicit about the final amount paid. If sales tax was applied, show the breakdown clearly. This is often a legal requirement and is always appreciated by clients who need to track their own tax deductions or business expenses.
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
          Maximizing your tax deductions is one of the easiest ways to increase your business's profitability. Many small business owners leave money on the table by not claiming all eligible expenses. Understanding these deductions is key to long-term financial health.
        </p>
        <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">1. Home Office Deduction</h2>
        <p className="text-slate-600 mb-6">
          If you use a portion of your home exclusively for business, you may be able to deduct a percentage of your rent, mortgage interest, utilities, and insurance. This "simplified method" or the actual expense method can save you thousands depending on your workspace size.
        </p>
        <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">2. Professional Services</h2>
        <p className="text-slate-600 mb-6">
          Fees paid to accountants, lawyers, and consultants are generally fully deductible business expenses. These professionals help you stay compliant and efficient, and the IRS recognizes their cost as a necessary part of doing business.
        </p>
        <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">3. Software and Subscriptions</h2>
        <p className="text-slate-600 mb-6">
          The cost of software used for your business, including accounting tools, project management apps, and specialized design software, is a valid deduction. This includes annual subscriptions and one-time licensing fees for tools essential to your workflow.
        </p>
        <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">4. Travel and Transportation</h2>
        <p className="text-slate-600 mb-6">
          Business-related travel, including airfare, hotels, and 50% of business meals, are often deductible. If you use your personal vehicle for business, you can choose to deduct the actual costs or use the standard mileage rate provided by the tax authorities.
        </p>
        <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">5. Marketing and Advertising</h2>
        <p className="text-slate-600 mb-6">
          Costs associated with promoting your business, such as social media ads, business cards, website hosting, and email marketing services, are fully deductible. Investing in your growth is encouraged by the tax code to help small businesses thrive.
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
          In an increasingly digital world, relying on paper invoices is not just slow—it's bad for business. Transitioning to a digital workflow can revolutionize your back-office efficiency and improve your relationship with modern clients.
        </p>
        <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">1. Faster Payments</h2>
        <p className="text-slate-600 mb-6">
          Digital invoices can be sent instantly via email or messaging apps. The faster a client receives an invoice, the faster they can process and pay it. Many digital tools also allow you to include direct "pay now" buttons, further shortening the payment cycle.
        </p>
        <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">2. Better Organization</h2>
        <p className="text-slate-600 mb-6">
          Digital tools allow you to store and search your invoices easily. No more digging through filing cabinets to find a transaction from six months ago. With everything stored in the cloud or on your drive, you have a searchable database of every cent you've billed.
        </p>
        <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">3. Professionalism and Branding</h2>
        <p className="text-slate-600 mb-6">
          A clean, digital invoice generated from a professional template looks far more professional than a handwritten or manually typed document. Consistency in branding across all your paperwork reinforces your identity as a high-quality service provider.
        </p>
        <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">4. Error Reduction</h2>
        <p className="text-slate-600 mb-6">
          Manual calculations are prone to human error. Digital generators calculate totals, taxes, and discounts automatically, ensuring that you never overcharge or undercharge a client due to a simple math mistake.
        </p>
        <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">5. Environmental and Cost Impact</h2>
        <p className="text-slate-600 mb-6">
          Going paperless isn't just good for the planet; it's good for your bank account. Eliminating the costs of paper, ink, envelopes, and postage adds up over time. It also saves the physical space required to store copies of every document you've ever issued.
        </p>
      </div>
    )
  },
  'international-invoicing-currency-guide': {
    title: 'International Invoicing: A Guide to Currencies and Exchange Rates',
    date: 'April 12, 2026',
    author: 'GomGom Team',
    category: 'Global Business',
    image: 'https://picsum.photos/seed/currency/1200/600',
    content: (
      <div className="prose prose-slate max-w-none">
        <p className="lead text-xl text-slate-600 mb-8">
          Billing clients across borders introduces complexities like currency conversion, exchange rate fluctuations, and international banking fees. Here is how to handle them professionally.
        </p>
        <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">1. Choose a Base Currency</h2>
        <p className="text-slate-600 mb-6">
          Decide whether you want to be paid in your local currency or the client's local currency. If you choose your local currency, the client bears the exchange rate risk. If you choose theirs, you do.
        </p>
        <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">2. Use Real-Time Exchange Rates</h2>
        <p className="text-slate-600 mb-6">
          When invoicing in a foreign currency, use the mid-market exchange rate at the time of invoicing. You can also add a small percentage (1-2%) to cover potential fluctuations before the payment arrives.
        </p>
        <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">3. Clarify Who Pays the Fees</h2>
        <p className="text-slate-600 mb-6">
          International wire transfers often incur fees from both the sending and receiving banks. Explicitly state in your contract or on the invoice that the client is responsible for all transaction fees.
        </p>
      </div>
    )
  },
  'understanding-payment-terms-net-30': {
    title: 'Understanding Payment Terms: Net 30 vs. Due on Receipt',
    date: 'April 14, 2026',
    author: 'GomGom Team',
    category: 'Finance',
    image: 'https://picsum.photos/seed/payment/1200/600',
    content: (
      <div className="prose prose-slate max-w-none">
        <p className="lead text-xl text-slate-600 mb-8">
          Your payment terms dictate when you get paid and how you manage your business's cash flow. Choosing the right terms is a balance between being client-friendly and protecting your own finances.
        </p>
        <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">1. Due on Receipt</h2>
        <p className="text-slate-600 mb-6">
          This is the most aggressive term, requiring the client to pay as soon as they receive the invoice. It's great for small projects or new clients where trust hasn't been established yet.
        </p>
        <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">2. Net 15 / Net 30</h2>
        <p className="text-slate-600 mb-6">
          "Net 30" means the payment is due 30 days after the invoice date. This is standard for larger corporations but can be difficult for freelancers who need more immediate cash flow.
        </p>
        <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">3. Milestone Payments</h2>
        <p className="text-slate-600 mb-6">
          For long-term projects, consider breaking the total cost into milestones (e.g., 30% upfront, 40% at midpoint, 30% on completion). This ensures you are paid for the work you've already done.
        </p>
      </div>
    )
  },
  'psychology-of-invoicing-custom-templates': {
    title: 'The Psychology of Invoicing: How Custom Templates Get You Paid Faster',
    date: 'April 15, 2026',
    author: 'GomGom Team',
    category: 'Business Strategy',
    image: 'https://picsum.photos/seed/psychology/1200/600',
    content: (
      <div className="prose prose-slate max-w-none">
        <p className="lead text-xl text-slate-600 mb-8">
          An invoice is more than just a request for money; it's a communication tool. The way you present that request can significantly influence how quickly a client responds and how they perceive your value.
        </p>
        <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">1. The Power of Professionalism</h2>
        <p className="text-slate-600 mb-6">
          A custom, well-designed invoice signals that you are a serious professional. When a client receives a polished document, it triggers a psychological response of respect. They are less likely to deprioritize a payment to someone who clearly takes their business operations seriously.
        </p>
        <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">2. Reducing Cognitive Friction</h2>
        <p className="text-slate-600 mb-6">
          Clarity is key. A custom template allows you to highlight the most important information—the total amount and the due date—using bold typography and strategic placement. By making it easy for the client to find what they need, you remove the "friction" that often leads to procrastination.
        </p>
        <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">3. Building Brand Trust</h2>
        <p className="text-slate-600 mb-6">
          Consistency builds trust. When your invoice matches the branding on your website and your emails, it reinforces your identity. This consistency makes the payment process feel like a natural, secure part of the relationship rather than a jarring administrative hurdle.
        </p>
        <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">4. The "Reciprocity" Effect</h2>
        <p className="text-slate-600 mb-6">
          Providing a clean, easy-to-read, and aesthetically pleasing document is a small act of service to your client's accounting department. This "gift" of clarity can trigger a subconscious desire to reciprocate by processing the payment faster.
        </p>
      </div>
    )
  },
  'legal-requirements-for-invoices-worldwide': {
    title: 'Legal Requirements for Invoices: A Worldwide Overview',
    date: 'April 18, 2026',
    author: 'GomGom Team',
    category: 'Legal',
    image: 'https://picsum.photos/seed/legalwide/1200/600',
    content: (
      <div className="prose prose-slate max-w-none">
        <p className="lead text-xl text-slate-600 mb-8">
          Invoicing isn't just about getting paid; it's also about staying compliant with local tax laws. Depending on where you and your clients are located, the requirements for a "valid" invoice can vary significantly.
        </p>
        <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">1. United States (IRS Requirements)</h2>
        <p className="text-slate-600 mb-6">
          In the US, the IRS is relatively flexible compared to other regions. However, for an invoice to be useful for tax deductions, it should clearly state the seller's name, the date, description of service, and the amount paid. If you're a freelancer, including your tax ID (EIN) is often requested by clients for their own records.
        </p>
        <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">2. European Union (VAT Compliance)</h2>
        <p className="text-slate-600 mb-6">
          The EU has strict rules, especially regarding Value Added Tax (VAT). Invoices must include a unique sequential number, the supplier's VAT identification number, the customer's VAT number (for B2B), the date of supply, and a detailed breakdown of the VAT rate applied to each item.
        </p>
        <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">3. United Kingdom (HMRC Rules)</h2>
        <p className="text-slate-600 mb-6">
          Similar to the EU, the UK requires specific details for VAT invoices. Even for non-VAT registered businesses, your invoice must clearly show your business name and address, the client's name and address, and a clear description of what they are being charged for.
        </p>
        <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">4. Australia and New Zealand (GST)</h2>
        <p className="text-slate-600 mb-6">
          In these regions, the document is often called a "Tax Invoice." It must clearly state the words "Tax Invoice," show the supplier's Australian Business Number (ABN) or NZ Business Number, and explicitly show the GST amount for each item.
        </p>
        <p className="text-slate-600 italic mt-8">
          Disclaimer: This guide is for informational purposes only and does not constitute legal or tax advice. Always consult with a qualified professional in your jurisdiction.
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
