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
  ArrowLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn, CURRENCIES, type InvoiceData, type InvoiceItem } from './lib/utils';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import LandingPage from './components/LandingPage';
import { GoogleGenAI } from "@google/genai";

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

export default function App() {
  const [data, setData] = useState<InvoiceData>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : INITIAL_DATA;
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [showLanding, setShowLanding] = useState(true);
  const invoiceRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);

  const [assets, setAssets] = useState<{ logoSvg?: string; faviconSvg?: string }>({});

  // Fetch generated assets
  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const response = await fetch('/api/assets');
        if (response.ok) {
          const data = await response.json();
          setAssets(data);
          
          // Update favicon if available
          if (data.faviconSvg) {
            const blob = new Blob([data.faviconSvg], { type: 'image/svg+xml' });
            const url = URL.createObjectURL(blob);
            let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
            if (!link) {
              link = document.createElement('link');
              link.rel = 'icon';
              document.getElementsByTagName('head')[0].appendChild(link);
            }
            link.href = url;
          }
        }
      } catch (error) {
        console.error("Error fetching assets:", error);
      }
    };
    fetchAssets();
  }, []);

  const [showCustomCurrency, setShowCustomCurrency] = useState(() => {
    return !CURRENCIES.find(c => c.code === data.currency);
  });

  // Auto-save to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

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
    setShowLanding(false);
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
    window.print();
  };

  const handleDownloadPDF = async () => {
    if (!invoiceRef.current) {
      toast.error('Invoice preview not found');
      return;
    }
    
    setIsGenerating(true);
    const toastId = toast.loading('Generating PDF...');
    
    try {
      // Scroll to top to ensure html2canvas captures correctly
      window.scrollTo(0, 0);
      
      // Ensure the element is visible for capture
      const element = invoiceRef.current;
      
      const canvas = await html2canvas(element, {
        scale: 3, // Higher scale for better quality
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: 1200, // Force a consistent width for capture
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'letter');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      // Calculate dimensions to fit the page while maintaining aspect ratio
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // If the image is taller than the page, scale it down
      let finalWidth = imgWidth;
      let finalHeight = imgHeight;
      if (finalHeight > pdfHeight) {
        finalHeight = pdfHeight;
        finalWidth = (canvas.width * finalHeight) / canvas.height;
      }

      // Center the image on the page
      const xOffset = (pdfWidth - finalWidth) / 2;
      const yOffset = (pdfHeight - finalHeight) / 2;
      
      pdf.addImage(imgData, 'PNG', xOffset, yOffset, finalWidth, finalHeight);
      pdf.save(`${data.type}-${data.invoiceNumber}.pdf`);
      
      toast.success('PDF downloaded successfully!', { id: toastId });
    } catch (error) {
      console.error('PDF Generation failed:', error);
      toast.error('Failed to generate PDF. Please try again.', { id: toastId });
    } finally {
      setIsGenerating(false);
    }
  };

  if (showLanding) {
    return (
      <>
        <Toaster position="top-center" richColors />
        <LandingPage onStart={handleStart} logoSvg={assets.logoSvg} />
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" ref={editorRef}>
      <Toaster position="top-center" richColors />
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 no-print">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setShowLanding(true)}
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
          <div className="flex items-center gap-3">
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
              onClick={handleDownloadPDF}
              disabled={isGenerating}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-all disabled:opacity-50"
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
        {/* Editor Side */}
        <section className="space-y-8 no-print">
          {/* Document Type & Basic Info */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex p-1.5 bg-slate-100 rounded-2xl">
                <button 
                  onClick={() => setData(prev => ({ ...prev, type: 'invoice' }))}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                    data.type === 'invoice' ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                  )}
                >
                  Invoice
                </button>
                <button 
                  onClick={() => setData(prev => ({ ...prev, type: 'receipt' }))}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                    data.type === 'receipt' ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                  )}
                >
                  Receipt
                </button>
              </div>
              <div className="flex flex-col gap-2">
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
                    className="appearance-none bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 pr-8 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 w-full"
                  >
                    {CURRENCIES.map(c => (
                      <option key={c.code} value={c.code}>{c.code} ({c.symbol})</option>
                    ))}
                    <option value="CUSTOM">Other...</option>
                  </select>
                  <ChevronDown className="w-4 h-4 absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
                {showCustomCurrency && (
                  <div className="grid grid-cols-2 gap-2 animate-in fade-in slide-in-from-top-1 duration-200">
                    <input 
                      placeholder="Code (e.g. JPY)"
                      value={data.currency}
                      onChange={(e) => setData(prev => ({ ...prev, currency: e.target.value.toUpperCase() }))}
                      className="input-field !py-1.5 !px-2 text-xs"
                    />
                    <input 
                      placeholder="Symbol (e.g. ¥)"
                      value={data.customCurrencySymbol || ''}
                      onChange={(e) => setData(prev => ({ ...prev, customCurrencySymbol: e.target.value }))}
                      className="input-field !py-1.5 !px-2 text-xs"
                    />
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
            <div className="flex items-center gap-2 text-slate-900 font-bold text-lg">
              <Settings2 className="w-5 h-5 text-indigo-600" />
              <h2>Business Details</h2>
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

          {/* Ad Slot: Inline */}
          <div className="ad-slot h-[250px] w-full rounded-2xl relative">
            <span className="ad-label">Advertisement</span>
            {/* Ad Slot: Inline Ad */}
            <span className="text-center px-4">Responsive Rectangle Ad Space</span>
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
                className="flex items-center gap-1.5 text-sm font-bold text-indigo-600 hover:text-indigo-700 px-4 py-2 bg-indigo-50 rounded-2xl transition-all"
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
                    className="flex gap-4 items-start group p-6 bg-slate-50/50 rounded-2xl border border-slate-100"
                  >
                    <div className="flex-1 space-y-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Description</label>
                        <input 
                          placeholder="Item description"
                          value={item.description}
                          onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                          className="input-field !bg-white"
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Qty</label>
                          <input 
                            type="number"
                            inputMode="decimal"
                            value={item.quantity}
                            onChange={(e) => handleItemChange(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                            className="input-field !bg-white text-center"
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
                          <div className="w-full text-sm font-bold text-slate-900 py-2.5 px-1">
                            {currencySymbol}{(item.quantity * item.price).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleRemoveItem(item.id)}
                      className="mt-8 p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
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
              className="bg-white w-full aspect-[8.5/11] shadow-2xl p-8 sm:p-16 flex flex-col print:shadow-none print:p-[20mm] print:w-[8.5in] print:h-[11in] mx-auto"
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
              <p className="text-slate-500 text-sm max-w-xs">
                The world's simplest free online invoice generator. Helping small businesses and freelancers get paid faster since 2026.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-4">Tools</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                <li><button onClick={() => { setShowLanding(false); setData(prev => ({ ...prev, type: 'invoice' })); }} className="hover:text-indigo-600">Free Invoice Generator</button></li>
                <li><button onClick={() => { setShowLanding(false); setData(prev => ({ ...prev, type: 'receipt' })); }} className="hover:text-indigo-600">Receipt Maker Online</button></li>
                <li><button onClick={() => setShowLanding(true)} className="hover:text-indigo-600">Simple Invoice Maker</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                <li><a href="#" className="hover:text-indigo-600">Help Center</a></li>
                <li><a href="#" className="hover:text-indigo-600">Privacy Policy</a></li>
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

      {/* Mobile Sticky Ad */}
      <div className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-slate-200 sm:hidden z-50 flex items-center justify-center no-print">
        <div className="ad-slot h-full w-full">
          {/* Ad Slot: Mobile Sticky */}
          <span className="text-[10px]">Mobile Advertisement</span>
        </div>
      </div>
    </div>
  );
}
