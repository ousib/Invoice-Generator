import React from 'react';
import { ArrowLeft, Calendar, User, ArrowRight, BookOpen } from 'lucide-react';
import { motion } from 'motion/react';

interface BlogPageProps {
  onBack: () => void;
  onPostClick: (slug: string) => void;
}

export const BLOG_POSTS = [
  {
    slug: 'how-to-invoice-as-a-freelancer',
    title: 'How to Invoice as a Freelancer: A Complete Guide',
    excerpt: 'Mastering the art of invoicing is crucial for any freelancer. Learn the best practices to get paid on time, every time.',
    date: 'April 10, 2026',
    author: 'GomGom Team',
    category: 'Guides',
    image: 'https://picsum.photos/seed/invoice/800/450'
  },
  {
    slug: 'essential-elements-of-a-professional-receipt',
    title: '5 Essential Elements of a Professional Receipt',
    excerpt: 'What makes a receipt professional? We break down the key components you need to include for legal and accounting purposes.',
    date: 'April 5, 2026',
    author: 'GomGom Team',
    category: 'Business Tips',
    image: 'https://picsum.photos/seed/receipt/800/450'
  },
  {
    slug: 'tax-deductions-for-small-business-owners',
    title: 'Common Tax Deductions for Small Business Owners',
    excerpt: 'Are you missing out on tax savings? Discover the most common deductions that can help you keep more of your hard-earned money.',
    date: 'March 28, 2026',
    author: 'GomGom Team',
    category: 'Finance',
    image: 'https://picsum.photos/seed/tax/800/450'
  },
  {
    slug: 'why-digital-invoicing-is-better-than-paper',
    title: 'Why Digital Invoicing is Better Than Paper',
    excerpt: 'Still using paper invoices? Here are five reasons why switching to a digital invoice generator will save you time and money.',
    date: 'March 20, 2026',
    author: 'GomGom Team',
    category: 'Efficiency',
    image: 'https://picsum.photos/seed/digital/800/450'
  }
];

export default function BlogPage({ onBack, onPostClick }: BlogPageProps) {
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

      <main className="max-w-6xl mx-auto px-4 pt-32 pb-20">
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full text-sm font-bold mb-6"
          >
            <BookOpen className="w-4 h-4" />
            Resources & Guides
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black text-slate-900 mb-4"
          >
            Small Business Knowledge Base
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-slate-500 max-w-2xl mx-auto"
          >
            Expert advice, tips, and guides to help you manage your business finances and get paid faster.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {BLOG_POSTS.map((post, index) => (
            <motion.article 
              key={post.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden group hover:shadow-xl hover:shadow-indigo-500/5 transition-all cursor-pointer"
              onClick={() => onPostClick(post.slug)}
            >
              <div className="aspect-video overflow-hidden">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-8">
                <div className="flex items-center gap-4 text-xs font-bold text-indigo-600 uppercase tracking-widest mb-4">
                  <span>{post.category}</span>
                  <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                  <span className="text-slate-400">{post.date}</span>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-indigo-600 transition-colors">
                  {post.title}
                </h2>
                <p className="text-slate-500 leading-relaxed mb-6">
                  {post.excerpt}
                </p>
                <div className="flex items-center text-indigo-600 font-bold gap-2">
                  Read Full Article
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </main>
    </div>
  );
}
