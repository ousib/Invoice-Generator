import React, { useState, useRef, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Download, 
  Printer, 
  Image as ImageIcon, 
  X, 
  ChevronDown,
  LayoutTemplate,
  FileText,
  Settings2,
  Info,
  ArrowLeft,
  History,
  Share2,
  LogIn,
  LogOut,
  User as UserIcon,
  Cloud,
  CloudUpload,
  CloudDownload,
  Save
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { cn, CURRENCIES, type InvoiceData, type InvoiceItem } from './lib/utils';
import { toCanvas } from 'html-to-image';
import { jsPDF } from 'jspdf';
import LandingPage from './components/LandingPage';
import AboutPage from './components/AboutPage';
import PrivacyPolicy from './components/PrivacyPolicy';
import { GoogleGenAI } from "@google/genai";
import { supabase } from './lib/supabase';
import type { User } from '@supabase/supabase-js';

import { Toaster, toast } from 'sonner';

const INITIAL_DATA: InvoiceData = {
  type: 'invoice',
  invoiceNumber: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
  date: new Date().toISOString().split('T')[0],
  dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  businessName: '',
  businessEmail: '',
  businessPhone: '',
  businessAddress: '',
  businessLogo: null,
  clientName: '',
  clientEmail: '',
  clientAddress: '',
  items: [{ id: '1', description: '', quantity: 1, price: 0 }],
  currency: 'USD',
  taxRate: 0,
  discount: 0,
  notes: '',
};

const STORAGE_KEY = 'simple_receipt_generator_draft';
const RECENT_KEY = 'simple_receipt_generator_history';

interface RecentReceipt {
  id: string;
  number: string;
  client: string;
  total: number;
  currency: string;
  date: string;
  data: InvoiceData;
}

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [data, setData] = useState<InvoiceData>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : INITIAL_DATA;
  });
  const [recentReceipts, setRecentReceipts] = useState<RecentReceipt[]>(() => {
    const saved = localStorage.getItem(RECENT_KEY);
    return saved ? JSON.parse(saved) : [];
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const invoiceRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);

  // Auth & Cloud State
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [cloudInvoices, setCloudInvoices] = useState<any[]>([]);
  const [showCloudHistory, setShowCloudHistory] = useState(false);

  const [assets, setAssets] = useState<{ logoSvg?: string; faviconSvg?: string }>({
    logoSvg: `<svg width="200" height="50" viewBox="0 0 200 50" xmlns="http://www.w3.org/2000/svg"><rect width="40" height="40" x="5" y="5" rx="8" fill="#4f46e5" /><path d="M15 15h20M15 20h20M15 25h10" stroke="white" stroke-width="2" stroke-linecap="round" /><path d="M30 30l3 3 7-7" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" /><text x="55" y="32" font-family="Inter, sans-serif" font-weight="bold" font-size="18" fill="#1e293b">Simple Receipt</text><text x="55" y="45" font-family="Inter, sans-serif" font-size="10" fill="#64748b">Generator</text></svg>`,
    faviconSvg: `<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><rect width="32" height="32" rx="6" fill="#4f46e5" /><path d="M8 10h16M8 14h16M8 18h8" stroke="white" stroke-width="2" stroke-linecap="round" /><path d="M20 22l2 2 4-4" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" /></svg>`
  });

  // Update favicon when assets change
  useEffect(() => {
    if (assets.faviconSvg) {
      const blob = new Blob([assets.faviconSvg], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.getElementsByTagName('head')[0].appendChild(link);
      }
      link.href = url;
      
      return () => URL.revokeObjectURL(url);
    }
  }, [assets.faviconSvg]);

  // Fetch generated assets
  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const response = await fetch('/api/assets');
        if (response.ok) {
          const data = await response.json();
          if (data.logoSvg || data.faviconSvg) {
            setAssets(prev => ({ ...prev, ...data }));
          }
        }
      } catch (error) {
        console.error("Error fetching assets:", error);
      }
    };
    fetchAssets();
  }, []);

  // Supabase Auth Listener
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch profile and cloud invoices when user changes
  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchCloudInvoices();
    } else {
      setProfile(null);
      setCloudInvoices([]);
    }
  }, [user]);

  const fetchProfile = async (forceSync = false) => {
    if (!user) return;
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (data && !error) {
      setProfile(data);
      if (forceSync) {
        setData(prev => ({
          ...prev,
          businessName: data.business_name || prev.businessName,
          businessEmail: data.business_email || prev.businessEmail,
          businessPhone: data.business_phone || prev.businessPhone,
          businessAddress: data.business_address || prev.businessAddress,
          businessLogo: data.business_logo || prev.businessLogo,
        }));
        toast.success('Business details synced from profile');
      } else {
        // Only sync if empty
        setData(prev => ({
          ...prev,
          businessName: prev.businessName || data.business_name || '',
          businessEmail: prev.businessEmail || data.business_email || '',
          businessPhone: prev.businessPhone || data.business_phone || '',
          businessAddress: prev.businessAddress || data.business_address || '',
          businessLogo: prev.businessLogo || data.business_logo || null,
        }));
      }
    }
  };

  const fetchCloudInvoices = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('invoices')
      .select('*, invoice_items(*)')
      .order('created_at', { ascending: false });
    
    if (data && !error) {
      setCloudInvoices(data);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthLoading(true);
    try {
      if (authMode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success('Logged in successfully!');
      } else {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        if (data.session) {
          toast.success('Account created and logged in!');
        } else {
          toast.success('Check your email for the confirmation link!');
        }
      }
      setShowAuthModal(false);
      setEmail('');
      setPassword('');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success('Logged out successfully');
  };

  const saveToCloud = async () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    setIsSaving(true);
    const toastId = toast.loading('Saving to cloud...');

    try {
      // 1. Update Profile (Business Details)
      await supabase.from('profiles').update({
        business_name: data.businessName,
        business_email: data.businessEmail,
        business_phone: data.businessPhone,
        business_address: data.businessAddress,
        business_logo: data.businessLogo,
      }).eq('id', user.id);

      // 2. Insert Invoice
      const { data: invoice, error: invoiceError } = await supabase
        .from('invoices')
        .insert({
          user_id: user.id,
          type: data.type,
          invoice_number: data.invoiceNumber,
          date: data.date,
          due_date: data.dueDate,
          client_name: data.clientName,
          client_email: data.clientEmail,
          client_address: data.clientAddress,
          currency: data.currency,
          tax_rate: data.taxRate,
          discount: data.discount,
          notes: data.notes,
        })
        .select()
        .single();

      if (invoiceError) throw invoiceError;

      // 3. Insert Items
      const itemsToInsert = data.items.map((item) => ({
        invoice_id: invoice.id,
        description: item.description,
        quantity: item.quantity,
        price: item.price,
      }));

      const { error: itemsError } = await supabase
        .from('invoice_items')
        .insert(itemsToInsert);

      if (itemsError) throw itemsError;

      toast.success('Invoice saved to cloud!', { id: toastId });
      fetchCloudInvoices();
    } catch (error: any) {
      toast.error(error.message, { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  const loadCloudInvoice = (cloudInvoice: any) => {
    const mappedData: InvoiceData = {
      type: cloudInvoice.type,
      invoiceNumber: cloudInvoice.invoice_number,
      date: cloudInvoice.date,
      dueDate: cloudInvoice.due_date,
      businessName: profile?.business_name || data.businessName,
      businessEmail: profile?.business_email || data.businessEmail,
      businessPhone: profile?.business_phone || data.businessPhone,
      businessAddress: profile?.business_address || data.businessAddress,
      businessLogo: profile?.business_logo || data.businessLogo,
      clientName: cloudInvoice.client_name,
      clientEmail: cloudInvoice.client_email,
      clientAddress: cloudInvoice.client_address,
      items: cloudInvoice.invoice_items.map((item: any) => ({
        id: item.id,
        description: item.description,
        quantity: item.quantity,
        price: item.price,
      })),
      currency: cloudInvoice.currency,
      taxRate: cloudInvoice.tax_rate,
      discount: cloudInvoice.discount,
      notes: cloudInvoice.notes,
    };
    setData(mappedData);
    setShowCloudHistory(false);
    toast.success('Invoice loaded from cloud');
  };

  const [showCustomCurrency, setShowCustomCurrency] = useState(() => {
    return !CURRENCIES.find(c => c.code === data.currency);
  });

  // Auto-save to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  // Save recent receipts to localStorage
  useEffect(() => {
    localStorage.setItem(RECENT_KEY, JSON.stringify(recentReceipts));
  }, [recentReceipts]);

  const handleReset = () => {
    if (window.confirm('Are you sure you want to clear all data?')) {
      setData(INITIAL_DATA);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const currencySymbol = data.customCurrencySymbol || CURRENCIES.find(c => c.code === data.currency)?.symbol || data.currency || '$';

  const subtotal = data.items.reduce((acc, item) => acc + (item.quantity * item.price), 0);
  const taxAmount = (subtotal * data.taxRate) / 100;
  const total = subtotal + taxAmount - data.discount;

  const handleStart = () => {
    navigate('/generate-invoice');
    setTimeout(() => {
      editorRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleAddItem = () => {
    setData(prev => ({
      ...prev,
      items: [...prev.items, { id: Math.random().toString(36).substr(2, 9), description: '', quantity: 1, price: 0 }]
    }));
  };

  const handleRemoveItem = (id: string) => {
    if (data.items.length === 1) return;
    setData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id)
    }));
  };

  const handleItemChange = (id: string, field: keyof InvoiceItem, value: string | number) => {
    setData(prev => ({
      ...prev,
      items: prev.items.map(item => item.id === id ? { ...item, [field]: value } : item)
    }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setData(prev => ({ ...prev, businessLogo: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePrint = () => {
    toast.info('Opening print dialog...');
    window.focus();
    window.print();
  };

  const handleShare = async () => {
    const shareData = {
      title: 'Simple Receipt Generator',
      text: 'Create professional invoices and receipts for free!',
      url: window.location.origin,
    };

    try {
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
        return;
      }
    } catch (error) {
      console.error('Error sharing:', error);
      // Fall through to clipboard fallback
    }

    try {
      await navigator.clipboard.writeText(window.location.origin);
      toast.success('Link copied to clipboard!');
    } catch (err) {
      console.error('Clipboard failed:', err);
      toast.error('Failed to copy link');
    }
  };

  const handleDownloadPDF = async () => {
    if (!invoiceRef.current) {
      toast.error('Invoice preview not found');
      return;
    }
    
    setIsGenerating(true);
    const toastId = toast.loading('Generating PDF...');
    
    try {
      const element = invoiceRef.current;
      
      // Use html-to-image for better reliability with modern CSS like oklch
      const canvas = await toCanvas(element, {
        quality: 1,
        pixelRatio: 2, // 2 is usually enough and faster
        backgroundColor: '#ffffff',
        width: 800,
        style: {
          boxShadow: 'none',
          borderRadius: '0',
          transform: 'none',
          margin: '0',
          padding: '60px',
          minHeight: '0',
          maxHeight: 'none',
          height: 'auto',
          width: '800px',
          display: 'flex',
          flexDirection: 'column'
        }
      });
      
      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      // If the invoice is just slightly longer than one page, scale it down to fit
      // This avoids awkward splits for minor overflows
      if (pdfHeight > pageHeight && pdfHeight < pageHeight * 1.1) {
        const scaleFactor = pageHeight / pdfHeight;
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight * scaleFactor, undefined, 'FAST');
      } else {
        // Standard multi-page support
        let heightLeft = pdfHeight;
        let position = 0;

        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight, undefined, 'FAST');
        heightLeft -= pageHeight;

        while (heightLeft > 0) {
          position = heightLeft - pdfHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight, undefined, 'FAST');
          heightLeft -= pageHeight;
        }
      }
      
      pdf.save(`${data.type}-${data.invoiceNumber}.pdf`);
      
      // Add to recent receipts
      const newRecent: RecentReceipt = {
        id: Math.random().toString(36).substr(2, 9),
        number: data.invoiceNumber,
        client: data.clientName || 'Unnamed Client',
        total: total,
        currency: currencySymbol,
        date: new Date().toLocaleDateString(),
        data: { ...data }
      };
      
      setRecentReceipts(prev => {
        const filtered = prev.filter(r => r.number !== data.invoiceNumber);
        return [newRecent, ...filtered].slice(0, 5);
      });

      toast.success('PDF downloaded successfully!', { id: toastId });
    } catch (error) {
      console.error('PDF Generation failed:', error);
      toast.error('Failed to generate PDF. Please try again.', { id: toastId });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Routes>
      <Route 
        path="/" 
        element={
          <>
            <Toaster position="top-center" richColors />
            <LandingPage 
              onStart={handleStart} 
              onAbout={() => navigate('/about')} 
              onPrivacy={() => navigate('/privacy')}
              logoSvg={assets.logoSvg} 
            />
          </>
        } 
      />
      <Route 
        path="/about" 
        element={
          <>
            <Toaster position="top-center" richColors />
            <AboutPage onBack={() => navigate('/')} logoSvg={assets.logoSvg} />
          </>
        } 
      />
      <Route 
        path="/privacy" 
        element={
          <>
            <Toaster position="top-center" richColors />
            <PrivacyPolicy onBack={() => navigate('/')} />
          </>
        } 
      />
      <Route 
        path="/generate-invoice" 
        element={
          <div className="min-h-screen flex flex-col" ref={editorRef}>
            <Toaster position="top-center" richColors />
            {/* Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-50 no-print">
              <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => navigate('/')}
                    className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <div className="flex items-center gap-2">
                    {assets.logoSvg ? (
                      <div 
                        className="h-8 w-auto flex items-center"
                        dangerouslySetInnerHTML={{ __html: assets.logoSvg }} 
                      />
                    ) : (
                      <>
                        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">S</div>
                        <h1 className="text-xl font-bold tracking-tight hidden sm:block">Simple Receipt Generator</h1>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <button 
                    onClick={handleReset}
                    className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                    title="Reset"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={handlePrint}
                    className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                    title="Print"
                  >
                    <Printer className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={handleShare}
                    className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                    title="Share"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>

                  {/* User Menu / Auth Button */}
                  {user ? (
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => setShowCloudHistory(true)}
                        className="px-3 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                      >
                        Cloud History
                      </button>
                      <button 
                        onClick={handleSignOut}
                        className="px-3 py-2 text-sm font-bold text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        Sign Out
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => setShowAuthModal(true)}
                      className="px-4 py-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg text-sm font-bold transition-colors"
                    >
                      Login
                    </button>
                  )}

                  <button 
                    onClick={handleDownloadPDF}
                    disabled={isGenerating}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-3 sm:px-4 py-2 rounded-lg font-medium transition-all disabled:opacity-50"
                  >
                    {isGenerating ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Download className="w-5 h-5" />
                    )}
                    <span className="hidden sm:inline">Download PDF</span>
                  </button>
                </div>
              </div>
            </header>

            {/* Ad Slot: Top Banner */}
            <div className="max-w-7xl mx-auto w-full px-4 py-4 no-print">
              <div className="ad-slot h-[90px] w-full max-w-[728px] mx-auto rounded-xl relative">
                <span className="ad-label">Advertisement</span>
                {/* Ad Slot: Top Banner (728x90) */}
                <span className="text-center px-4">Leaderboard Ad Space</span>
              </div>
            </div>

            <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="space-y-8 no-print">
          {/* Document Type & Basic Info */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="flex p-1.5 bg-slate-100 rounded-2xl w-full sm:w-auto">
                <button 
                  onClick={() => setData(prev => ({ ...prev, type: 'invoice' }))}
                  className={cn(
                    "flex-1 px-4 py-2.5 rounded-xl text-sm font-bold transition-all",
                    data.type === 'invoice' ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                  )}
                >
                  Invoice
                </button>
                <button 
                  onClick={() => setData(prev => ({ ...prev, type: 'receipt' }))}
                  className={cn(
                    "flex-1 px-4 py-2.5 rounded-xl text-sm font-bold transition-all",
                    data.type === 'receipt' ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                  )}
                >
                  Receipt
                </button>
              </div>
              <div className="flex flex-col gap-3 w-full sm:w-auto sm:min-w-[160px]">
                <div className="relative">
                  <select 
                    value={showCustomCurrency ? 'CUSTOM' : data.currency}
                    onChange={(e) => {
                      if (e.target.value === 'CUSTOM') {
                        setShowCustomCurrency(true);
                        setData(prev => ({ ...prev, currency: '', customCurrencySymbol: '' }));
                      } else {
                        setShowCustomCurrency(false);
                        setData(prev => ({ ...prev, currency: e.target.value, customCurrencySymbol: undefined }));
                      }
                    }}
                    className="appearance-none bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 pr-10 text-base font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 w-full transition-all"
                  >
                    {CURRENCIES.map(c => (
                      <option key={c.code} value={c.code}>{c.code} ({c.symbol})</option>
                    ))}
                    <option value="CUSTOM">Other...</option>
                  </select>
                  <ChevronDown className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
                {showCustomCurrency && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 animate-in fade-in slide-in-from-top-1 duration-200">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 sm:hidden">Code</label>
                      <input 
                        placeholder="Code (e.g. JPY)"
                        value={data.currency}
                        onChange={(e) => setData(prev => ({ ...prev, currency: e.target.value.toUpperCase() }))}
                        className="input-field !py-2.5 !px-4 text-sm font-bold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 sm:hidden">Symbol</label>
                      <input 
                        placeholder="Symbol (e.g. ¥)"
                        value={data.customCurrencySymbol || ''}
                        onChange={(e) => setData(prev => ({ ...prev, customCurrencySymbol: e.target.value }))}
                        className="input-field !py-2.5 !px-4 text-sm font-bold"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Number</label>
                <input 
                  type="text"
                  value={data.invoiceNumber}
                  onChange={(e) => setData(prev => ({ ...prev, invoiceNumber: e.target.value }))}
                  className="input-field"
                  placeholder="INV-001"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Date</label>
                <input 
                  type="date"
                  value={data.date}
                  onChange={(e) => setData(prev => ({ ...prev, date: e.target.value }))}
                  className="input-field"
                />
              </div>
            </div>
          </div>

          {/* Business Details */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-lg">
                <Settings2 className="w-5 h-5 text-indigo-600" />
                <h2>Business Details</h2>
              </div>
              {user && profile && (
                <button 
                  onClick={() => fetchProfile(true)}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 bg-indigo-50 px-3 py-1.5 rounded-full transition-colors"
                >
                  <CloudDownload className="w-3.5 h-3.5" />
                  Sync from Profile
                </button>
              )}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-8">
              <div className="flex-shrink-0">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Logo</label>
                <label className="block w-28 h-28 border-2 border-dashed border-slate-200 rounded-2xl hover:border-indigo-400 hover:bg-indigo-50 transition-all cursor-pointer relative overflow-hidden group">
                  {data.businessLogo ? (
                    <>
                      <img src={data.businessLogo} alt="Logo" className="w-full h-full object-contain p-3" />
                      <button 
                        onClick={(e) => { e.preventDefault(); setData(prev => ({ ...prev, businessLogo: null })); }}
                        className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-6 h-6 text-white" />
                      </button>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-slate-400">
                      <ImageIcon className="w-6 h-6 mb-1" />
                      <span className="text-[10px] font-bold">UPLOAD</span>
                    </div>
                  )}
                  <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                </label>
              </div>
              
              <div className="flex-1 space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Business Name</label>
                  <input 
                    placeholder="Your Company Name"
                    value={data.businessName}
                    onChange={(e) => setData(prev => ({ ...prev, businessName: e.target.value }))}
                    className="w-full text-xl font-black text-slate-900 placeholder:text-slate-200 focus:outline-none border-b-2 border-transparent focus:border-indigo-100 transition-colors pb-1"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Email</label>
                    <input 
                      placeholder="hello@company.com"
                      type="email"
                      value={data.businessEmail}
                      onChange={(e) => setData(prev => ({ ...prev, businessEmail: e.target.value }))}
                      className="input-field"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Phone</label>
                    <input 
                      placeholder="+1 (555) 000-0000"
                      type="tel"
                      value={data.businessPhone}
                      onChange={(e) => setData(prev => ({ ...prev, businessPhone: e.target.value }))}
                      className="input-field"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Address</label>
                  <textarea 
                    placeholder="Street, City, Country"
                    rows={2}
                    value={data.businessAddress}
                    onChange={(e) => setData(prev => ({ ...prev, businessAddress: e.target.value }))}
                    className="input-field resize-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Client Details */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-8">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-lg">
              <FileText className="w-5 h-5 text-indigo-600" />
              <h2>Bill To</h2>
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Client Name</label>
                <input 
                  placeholder="Client or Company Name"
                  value={data.clientName}
                  onChange={(e) => setData(prev => ({ ...prev, clientName: e.target.value }))}
                  className="w-full text-lg font-bold text-slate-900 placeholder:text-slate-200 focus:outline-none border-b-2 border-transparent focus:border-indigo-100 transition-colors pb-1"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Client Email</label>
                  <input 
                    placeholder="client@example.com"
                    type="email"
                    value={data.clientEmail}
                    onChange={(e) => setData(prev => ({ ...prev, clientEmail: e.target.value }))}
                    className="input-field"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Client Address</label>
                  <textarea 
                    placeholder="Client's Street, City, Country"
                    rows={1}
                    value={data.clientAddress}
                    onChange={(e) => setData(prev => ({ ...prev, clientAddress: e.target.value }))}
                    className="input-field resize-none min-h-[46px]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Line Items */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-lg">
                <LayoutTemplate className="w-5 h-5 text-indigo-600" />
                <h2>Line Items</h2>
              </div>
            <button 
              onClick={handleAddItem}
              className="flex items-center justify-center gap-1.5 text-sm font-bold text-indigo-600 hover:text-indigo-700 px-4 py-3 bg-indigo-50 rounded-2xl transition-all w-full sm:w-auto"
            >
              <Plus className="w-4 h-4" />
              Add Item
            </button>
            </div>

            <div className="space-y-6">
              <AnimatePresence initial={false}>
                {data.items.map((item, index) => (
                  <motion.div 
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex flex-col sm:flex-row gap-4 items-start group p-4 sm:p-6 bg-slate-50/50 rounded-2xl border border-slate-100 relative"
                  >
                    <div className="flex-1 w-full space-y-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Description</label>
                        <input 
                          placeholder="Item description"
                          value={item.description}
                          onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                          className="input-field !bg-white"
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Qty</label>
                          <input 
                            type="number"
                            inputMode="decimal"
                            value={item.quantity}
                            onChange={(e) => handleItemChange(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                            className="input-field !bg-white text-left sm:text-center"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Price</label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">{currencySymbol}</span>
                            <input 
                              type="number"
                              inputMode="decimal"
                              value={item.price}
                              onChange={(e) => handleItemChange(item.id, 'price', parseFloat(e.target.value) || 0)}
                              className="input-field !bg-white pl-7"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total</label>
                          <div className="w-full text-base font-bold text-slate-900 py-3 px-4 bg-white rounded-xl border border-slate-200 sm:border-transparent sm:bg-transparent sm:py-2.5 sm:px-1">
                            {currencySymbol}{(item.quantity * item.price).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleRemoveItem(item.id)}
                      className="absolute top-2 right-2 sm:static sm:mt-8 p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all sm:opacity-0 sm:group-hover:opacity-100"
                      disabled={data.items.length === 1}
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Totals & Notes */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Notes / Terms</label>
                  <textarea 
                    placeholder="Payment terms, bank details, etc."
                    rows={4}
                    value={data.notes}
                    onChange={(e) => setData(prev => ({ ...prev, notes: e.target.value }))}
                    className="input-field resize-none"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between text-sm text-slate-500 font-medium">
                  <span>Subtotal</span>
                  <span className="text-slate-900">{currencySymbol}{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-slate-600">Tax (%)</span>
                  <input 
                    type="number"
                    inputMode="decimal"
                    value={data.taxRate}
                    onChange={(e) => setData(prev => ({ ...prev, taxRate: parseFloat(e.target.value) || 0 }))}
                    className="w-24 text-right input-field !py-1 !px-2"
                  />
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-slate-600">Discount ({currencySymbol})</span>
                  <input 
                    type="number"
                    inputMode="decimal"
                    value={data.discount}
                    onChange={(e) => setData(prev => ({ ...prev, discount: parseFloat(e.target.value) || 0 }))}
                    className="w-24 text-right input-field !py-1 !px-2"
                  />
                </div>
                <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
                  <span className="font-bold text-slate-900">Total</span>
                  <span className="text-xl font-bold text-indigo-600">{currencySymbol}{total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Ad Slot: Inline (Moved under subtotal) */}
          <div className="ad-slot h-[250px] w-full rounded-2xl relative">
            <span className="ad-label">Advertisement</span>
            {/* Ad Slot: Inline Ad */}
            <span className="text-center px-4">Responsive Rectangle Ad Space</span>
          </div>

          {/* Recent Receipts Section */}
          {recentReceipts.length > 0 && (
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-lg">
                <History className="w-5 h-5 text-indigo-600" />
                <h2>Recent Receipts</h2>
              </div>
              <div className="space-y-3">
                {recentReceipts.map((receipt) => (
                  <button
                    key={receipt.id}
                    onClick={() => {
                      if (window.confirm('Load this receipt? This will overwrite your current draft.')) {
                        setData(receipt.data);
                        toast.success(`Loaded ${receipt.number}`);
                      }
                    }}
                    className="w-full flex items-center justify-between p-4 rounded-2xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/50 transition-all text-left group"
                  >
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{receipt.number}</span>
                      <span className="text-xs text-slate-400">{receipt.client}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-slate-900">{receipt.currency}{receipt.total.toLocaleString()}</div>
                      <div className="text-[10px] text-slate-400 uppercase tracking-wider">{receipt.date}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Preview Side */}
        <section className="block lg:sticky lg:top-24 h-fit print:block print:static">
          <div className="flex items-center gap-2 mb-4 text-slate-500 font-medium text-sm no-print">
            <Info className="w-4 h-4" />
            Live Preview
          </div>
          
          <div className="bg-slate-200 p-4 sm:p-8 rounded-3xl shadow-inner overflow-hidden print:bg-white print:p-0 print:shadow-none">
            <div 
              ref={invoiceRef}
              id="invoice-preview"
              className="bg-white w-full min-h-[11in] shadow-2xl p-8 sm:p-16 flex flex-col print:shadow-none print:p-[20mm] print:w-[8.5in] print:h-[11in] mx-auto"
              style={{ fontSize: '13px' }}
            >
              {/* Invoice Header */}
              <div className="flex justify-between items-start mb-16">
                <div>
                  {data.businessLogo ? (
                    <img src={data.businessLogo} alt="Logo" className="h-20 w-auto mb-6 object-contain" />
                  ) : assets.logoSvg ? (
                    <div 
                      className="h-20 w-auto mb-6 flex items-center"
                      dangerouslySetInnerHTML={{ __html: assets.logoSvg }} 
                    />
                  ) : (
                    <div className="w-14 h-14 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl mb-6 shadow-lg shadow-indigo-200">S</div>
                  )}
                  <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">{data.type}</h2>
                </div>
                <div className="text-right space-y-2">
                  <div className="inline-block px-3 py-1 bg-slate-100 rounded-md mb-2">
                    <p className="font-bold text-slate-900 text-sm">#{data.invoiceNumber}</p>
                  </div>
                  <div className="space-y-1 text-sm">
                    <p className="text-slate-500 flex justify-end gap-2">
                      <span className="font-medium text-slate-400 uppercase text-[10px] tracking-wider">Date:</span>
                      {data.date}
                    </p>
                    {data.type === 'invoice' && (
                      <p className="text-slate-500 flex justify-end gap-2">
                        <span className="font-medium text-slate-400 uppercase text-[10px] tracking-wider">Due:</span>
                        {data.dueDate}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Addresses */}
              <div className="grid grid-cols-2 gap-16 mb-16">
                <div className="space-y-3">
                  <p className="text-[11px] font-bold text-indigo-600 uppercase tracking-[0.2em] border-b border-indigo-100 pb-1 inline-block">From</p>
                  <div className="pl-4">
                    <p className="font-bold text-slate-900 text-base mb-1">{data.businessName || 'Your Business Name'}</p>
                    <div className="text-slate-500 leading-relaxed whitespace-pre-line text-sm">
                      {data.businessAddress}
                      {data.businessEmail && `\n${data.businessEmail}`}
                      {data.businessPhone && `\n${data.businessPhone}`}
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <p className="text-[11px] font-bold text-indigo-600 uppercase tracking-[0.2em] border-b border-indigo-100 pb-1 inline-block">Bill To</p>
                  <div className="pl-4">
                    <p className="font-bold text-slate-900 text-base mb-1">{data.clientName || 'Client Name'}</p>
                    <div className="text-slate-500 leading-relaxed whitespace-pre-line text-sm">
                      {data.clientAddress}
                      {data.clientEmail && `\n${data.clientEmail}`}
                    </div>
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="flex-1">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-slate-900">
                      <th className="text-left pb-4 font-bold text-slate-900 uppercase tracking-widest text-[11px]">Description</th>
                      <th className="text-right pb-4 font-bold text-slate-900 uppercase tracking-widest text-[11px] w-20">Qty</th>
                      <th className="text-right pb-4 font-bold text-slate-900 uppercase tracking-widest text-[11px] w-28">Price</th>
                      <th className="text-right pb-4 font-bold text-slate-900 uppercase tracking-widest text-[11px] w-28">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {data.items.map((item) => (
                      <tr key={item.id} className="group">
                        <td className="py-5 text-slate-700 font-medium">{item.description || 'Item Description'}</td>
                        <td className="py-5 text-right text-slate-600">{item.quantity}</td>
                        <td className="py-5 text-right text-slate-600">{currencySymbol}{item.price.toLocaleString()}</td>
                        <td className="py-5 text-right font-bold text-slate-900">{currencySymbol}{(item.quantity * item.price).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Footer Totals */}
              <div className="mt-16 pt-8 border-t-2 border-slate-900 flex justify-between items-start">
                <div className="max-w-[45%]">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-3">Notes & Terms</p>
                  <p className="text-slate-500 leading-relaxed whitespace-pre-line text-sm italic">
                    {data.notes || 'Thank you for your business! Please make payment within the due date.'}
                  </p>
                </div>
                <div className="w-64 space-y-3">
                  <div className="flex justify-between text-slate-500 text-sm">
                    <span className="font-medium">Subtotal</span>
                    <span className="font-semibold">{currencySymbol}{subtotal.toLocaleString()}</span>
                  </div>
                  {data.taxRate > 0 && (
                    <div className="flex justify-between text-slate-500 text-sm">
                      <span className="font-medium">Tax ({data.taxRate}%)</span>
                      <span className="font-semibold">{currencySymbol}{taxAmount.toLocaleString()}</span>
                    </div>
                  )}
                  {data.discount > 0 && (
                    <div className="flex justify-between text-slate-500 text-sm">
                      <span className="font-medium">Discount</span>
                      <span className="font-semibold text-red-500">-{currencySymbol}{data.discount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-xl font-black text-slate-900 pt-4 border-t border-slate-200">
                    <span className="uppercase tracking-tighter">Total</span>
                    <span className="text-indigo-600">{currencySymbol}{total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Save to Cloud Button */}
          <div className="mt-6 no-print">
            <button 
              onClick={saveToCloud}
              disabled={isSaving}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-4 rounded-2xl font-bold text-lg shadow-lg shadow-indigo-200 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {isSaving && (
                <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
              )}
              <span>{user ? "Save to Cloud" : "Login to Save to Cloud"}</span>
            </button>
          </div>
        </section>
      </main>

      {/* Footer Ad Slot & SEO Links */}
      <footer className="bg-white border-t border-slate-200 pt-12 pb-24 no-print">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                {assets.logoSvg ? (
                  <div 
                    className="h-8 w-auto flex items-center"
                    dangerouslySetInnerHTML={{ __html: assets.logoSvg }} 
                  />
                ) : (
                  <>
                    <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">S</div>
                    <span className="text-xl font-bold">Simple Receipt Generator</span>
                  </>
                )}
              </div>
              <p className="text-slate-500 text-sm max-w-xs mb-2">
                The world's simplest free online invoice generator. Helping small businesses and freelancers get paid faster since 2026.
              </p>
              <a 
                href="mailto:gomgomtechnologies@gmail.com" 
                className="text-xs text-slate-400 hover:text-indigo-600 transition-colors"
              >
                gomgomtechnologies@gmail.com
              </a>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-4">Tools</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                <li><button onClick={() => { navigate('/generate-invoice'); setData(prev => ({ ...prev, type: 'invoice' })); }} className="hover:text-indigo-600">Free Invoice Generator</button></li>
                <li><button onClick={() => { navigate('/generate-invoice'); setData(prev => ({ ...prev, type: 'receipt' })); }} className="hover:text-indigo-600">Receipt Maker Online</button></li>
                <li><button onClick={() => navigate('/')} className="hover:text-indigo-600">Simple Invoice Maker</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                <li><button onClick={() => navigate('/about')} className="hover:text-indigo-600">About Us</button></li>
                <li><a href="#" className="hover:text-indigo-600">Help Center</a></li>
                <li><button onClick={() => navigate('/privacy')} className="hover:text-indigo-600">Privacy Policy</button></li>
                <li><a href="#" className="hover:text-indigo-600">Terms of Service</a></li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col items-center gap-8 border-t border-slate-100 pt-8">
            <div className="ad-slot h-[90px] w-full max-w-[728px] rounded-xl relative">
              <span className="ad-label">Advertisement</span>
              <span className="text-center px-4">Leaderboard Ad Space</span>
            </div>
            <p className="text-slate-400 text-xs">© 2026 Simple Receipt Generator. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AnimatePresence>
        {showAuthModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm no-print">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-8">
                <div className="flex justify-between items-center mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
                      <UserIcon className="w-6 h-6" />
                    </div>
                    <h2 className="text-2xl font-black text-slate-900">
                      {authMode === 'login' ? 'Welcome Back' : 'Create Account'}
                    </h2>
                  </div>
                  <button 
                    onClick={() => setShowAuthModal(false)}
                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleAuth} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                    <input 
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="input-field"
                      placeholder="you@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Password</label>
                    <input 
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="input-field"
                      placeholder="••••••••"
                    />
                  </div>

                  <button 
                    type="submit"
                    disabled={isAuthLoading}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-indigo-200 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isAuthLoading ? (
                      <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        {authMode === 'login' ? <LogIn className="w-5 h-5" /> : <UserIcon className="w-5 h-5" />}
                        {authMode === 'login' ? 'Sign In' : 'Sign Up'}
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-8 pt-8 border-t border-slate-100 text-center">
                  <p className="text-slate-500 font-medium">
                    {authMode === 'login' ? "Don't have an account?" : "Already have an account?"}
                    <button 
                      onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
                      className="ml-2 text-indigo-600 font-bold hover:underline"
                    >
                      {authMode === 'login' ? 'Sign Up' : 'Sign In'}
                    </button>
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Cloud History Modal */}
      <AnimatePresence>
        {showCloudHistory && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm no-print">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden max-h-[80vh] flex flex-col"
            >
              <div className="p-8 border-b border-slate-100">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
                      <Cloud className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-slate-900">Cloud History</h2>
                      <p className="text-sm text-slate-500 font-medium">Your saved invoices and receipts</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowCloudHistory(false)}
                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-4">
                {cloudInvoices.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Cloud className="w-8 h-8 text-slate-300" />
                    </div>
                    <p className="text-slate-500 font-medium">No invoices saved to cloud yet.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {cloudInvoices.map((invoice) => (
                      <button
                        key={invoice.id}
                        onClick={() => loadCloudInvoice(invoice)}
                        className="w-full flex items-center justify-between p-6 rounded-2xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/50 transition-all text-left group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-white rounded-xl border border-slate-100 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
                            <FileText className="w-6 h-6" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                              {invoice.invoice_number}
                            </span>
                            <span className="text-sm text-slate-500 font-medium">{invoice.client_name || 'No Client'}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-slate-900">
                            {CURRENCIES.find(c => c.code === invoice.currency)?.symbol || invoice.currency}
                            {(invoice.invoice_items?.reduce((acc: number, item: any) => acc + (item.quantity * item.price), 0) || 0).toLocaleString()}
                          </div>
                          <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                            {new Date(invoice.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Mobile Sticky Ad */}
      <div className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-slate-200 sm:hidden z-50 flex items-center justify-center no-print">
        <div className="ad-slot h-full w-full">
          {/* Ad Slot: Mobile Sticky */}
          <span className="text-[10px]">Mobile Advertisement</span>
        </div>
      </div>
      <Toaster position="bottom-right" />
          </div>
        } 
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
