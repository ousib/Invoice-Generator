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
              <h2>Data Collection & Privacy</h2>
            </div>
            <p className="text-slate-600 leading-relaxed">
              At Simple Receipt Generator, accessible from simplifiedreceiptgenerator.com, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by Simple Receipt Generator and how we use it.
            </p>
            <p className="text-slate-600 leading-relaxed">
              If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us.
            </p>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-xl">
              <Eye className="w-5 h-5 text-indigo-600" />
              <h2>Log Files</h2>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Simple Receipt Generator follows a standard procedure of using log files. These files log visitors when they visit websites. All hosting companies do this and a part of hosting services' analytics. The information collected by log files include internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable. The purpose of the information is for analyzing trends, administering the site, tracking users' movement on the website, and gathering demographic information.
            </p>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-xl">
              <ShieldCheck className="w-5 h-5 text-indigo-600" />
              <h2>Google DoubleClick DART Cookie</h2>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Google is one of a third-party vendor on our site. It also uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to www.website.com and other sites on the internet. However, visitors may choose to decline the use of DART cookies by visiting the Google ad and content network Privacy Policy at the following URL – <a href="https://policies.google.com/technologies/ads" className="text-indigo-600 hover:underline">https://policies.google.com/technologies/ads</a>
            </p>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-xl">
              <FileText className="w-5 h-5 text-indigo-600" />
              <h2>Privacy Policies</h2>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Third-party ad servers or ad networks uses technologies like cookies, JavaScript, or Web Beacons that are used in their respective advertisements and links that appear on Simple Receipt Generator, which are sent directly to users' browser. They automatically receive your IP address when this occurs. These technologies are used to measure the effectiveness of their advertising campaigns and/or to personalize the advertising content that you see on websites that you visit.
            </p>
            <p className="text-slate-600 leading-relaxed">
              Note that Simple Receipt Generator has no access to or control over these cookies that are used by third-party advertisers.
            </p>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-xl">
              <Lock className="w-5 h-5 text-indigo-600" />
              <h2>Third Party Privacy Policies</h2>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Simple Receipt Generator's Privacy Policy does not apply to other advertisers or websites. Thus, we are advising you to consult the respective Privacy Policies of these third-party ad servers for more detailed information. It may include their practices and instructions about how to opt-out of certain options.
            </p>
            <p className="text-slate-600 leading-relaxed">
              You can choose to disable cookies through your individual browser options. To know more detailed information about cookie management with specific web browsers, it can be found at the browsers' respective websites.
            </p>
          </section>

          <div className="pt-10 border-t border-slate-100">
            <p className="text-slate-400 text-sm italic">
              If you have any questions about our Privacy Policy, please contact us at <a href="mailto:simplereceiptgenerator@gmail.com" className="text-indigo-600 hover:underline">simplereceiptgenerator@gmail.com</a>.
            </p>
          </div>
        </motion.div>
      </main>

      <footer className="bg-white border-t border-slate-200 py-12 text-center flex flex-col items-center gap-6 no-print">
        <div className="flex flex-wrap justify-center gap-6">
          <button onClick={onBack} className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors">Home</button>
          <a href="mailto:simplereceiptgenerator@gmail.com" className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors">Contact</a>
          <p className="text-sm font-medium text-slate-900">Privacy Policy</p>
        </div>
        <p className="text-slate-400 text-sm max-w-md">© 2026 Simple Receipt Generator. Your privacy is our priority.</p>
      </footer>
    </div>
  );
}
