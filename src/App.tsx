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

const STORAGE_KEY = 'swift_invoice_draft';

export default function App() {
  const [data, setData] = useState<InvoiceData>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : INITIAL_DATA;
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [showLanding, setShowLanding] = useState(true);
  const invoiceRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);

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

  const currencySymbol = CURRENCIES.find(c => c.code === data.currency)?.symbol || '$';

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
    if (!invoiceRef.current) return;
    setIsGenerating(true);
    try {
      const canvas = await html2canvas(invoiceRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${data.type}-${data.invoiceNumber}.pdf`);
    } catch (error) {
      console.error('PDF Generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  if (showLanding) {
    return <LandingPage onStart={handleStart} />;
  }

  return (
    <div className="min-h-screen flex flex-col" ref={editorRef}>
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
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">S</div>
              <h1 className="text-xl font-bold tracking-tight hidden sm:block">SwiftInvoice</h1>
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
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex p-1 bg-slate-100 rounded-xl">
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
              <div className="relative">
                <select 
                  value={data.currency}
                  onChange={(e) => setData(prev => ({ ...prev, currency: e.target.value }))}
                  className="appearance-none bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 pr-8 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                >
                  {CURRENCIES.map(c => (
                    <option key={c.code} value={c.code}>{c.code} ({c.symbol})</option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Number</label>
                <input 
                  type="text"
                  value={data.invoiceNumber}
                  onChange={(e) => setData(prev => ({ ...prev, invoiceNumber: e.target.value }))}
                  className="input-field"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</label>
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
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center gap-2 text-slate-900 font-semibold">
              <Settings2 className="w-5 h-5 text-indigo-600" />
              <h2>Business Details</h2>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="flex-shrink-0">
                <label className="block w-24 h-24 border-2 border-dashed border-slate-200 rounded-2xl hover:border-indigo-400 hover:bg-indigo-50 transition-all cursor-pointer relative overflow-hidden group">
                  {data.businessLogo ? (
                    <>
                      <img src={data.businessLogo} alt="Logo" className="w-full h-full object-contain p-2" />
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
                      <span className="text-[10px] font-medium">LOGO</span>
                    </div>
                  )}
                  <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                </label>
              </div>
              
              <div className="flex-1 space-y-4">
                <input 
                  placeholder="Business Name"
                  value={data.businessName}
                  onChange={(e) => setData(prev => ({ ...prev, businessName: e.target.value }))}
                  className="w-full text-lg font-bold placeholder:text-slate-300 focus:outline-none"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input 
                    placeholder="Email Address"
                    type="email"
                    value={data.businessEmail}
                    onChange={(e) => setData(prev => ({ ...prev, businessEmail: e.target.value }))}
                    className="input-field"
                  />
                  <input 
                    placeholder="Phone Number"
                    type="tel"
                    value={data.businessPhone}
                    onChange={(e) => setData(prev => ({ ...prev, businessPhone: e.target.value }))}
                    className="input-field"
                  />
                </div>
                <textarea 
                  placeholder="Business Address"
                  rows={2}
                  value={data.businessAddress}
                  onChange={(e) => setData(prev => ({ ...prev, businessAddress: e.target.value }))}
                  className="input-field resize-none"
                />
              </div>
            </div>
          </div>

          {/* Client Details */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center gap-2 text-slate-900 font-semibold">
              <FileText className="w-5 h-5 text-indigo-600" />
              <h2>Bill To</h2>
            </div>
            <div className="space-y-4">
              <input 
                placeholder="Client Name"
                value={data.clientName}
                onChange={(e) => setData(prev => ({ ...prev, clientName: e.target.value }))}
                className="w-full text-base font-semibold placeholder:text-slate-300 focus:outline-none"
              />
              <input 
                placeholder="Client Email"
                type="email"
                value={data.clientEmail}
                onChange={(e) => setData(prev => ({ ...prev, clientEmail: e.target.value }))}
                className="input-field"
              />
              <textarea 
                placeholder="Client Address"
                rows={2}
                value={data.clientAddress}
                onChange={(e) => setData(prev => ({ ...prev, clientAddress: e.target.value }))}
                className="input-field resize-none"
              />
            </div>
          </div>

          {/* Ad Slot: Inline */}
          <div className="ad-slot h-[250px] w-full rounded-2xl relative">
            <span className="ad-label">Advertisement</span>
            {/* Ad Slot: Inline Ad */}
            <span className="text-center px-4">Responsive Rectangle Ad Space</span>
          </div>

          {/* Items Table */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-900 font-semibold">
                <LayoutTemplate className="w-5 h-5 text-indigo-600" />
                <h2>Line Items</h2>
              </div>
              <button 
                onClick={handleAddItem}
                className="flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
              >
                <Plus className="w-4 h-4" />
                Add Item
              </button>
            </div>

            <div className="space-y-4">
              <AnimatePresence initial={false}>
                {data.items.map((item, index) => (
                  <motion.div 
                    key={item.id}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex gap-3 items-start group"
                  >
                    <div className="flex-1 space-y-2">
                      <input 
                        placeholder="Item description"
                        value={item.description}
                        onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                        className="input-field"
                      />
                      <div className="grid grid-cols-3 gap-3">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Qty</label>
                          <input 
                            type="number"
                            inputMode="decimal"
                            value={item.quantity}
                            onChange={(e) => handleItemChange(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                            className="input-field"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Price</label>
                          <input 
                            type="number"
                            inputMode="decimal"
                            value={item.price}
                            onChange={(e) => handleItemChange(item.id, 'price', parseFloat(e.target.value) || 0)}
                            className="input-field"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Total</label>
                          <div className="w-full text-sm font-semibold py-2 px-1">
                            {currencySymbol}{(item.quantity * item.price).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleRemoveItem(item.id)}
                      className="mt-8 p-2 text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Totals & Notes */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Notes / Terms</label>
                  <textarea 
                    placeholder="Payment terms, bank details, etc."
                    rows={4}
                    value={data.notes}
                    onChange={(e) => setData(prev => ({ ...prev, notes: e.target.value }))}
                    className="input-field resize-none"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Subtotal</span>
                  <span>{currencySymbol}{subtotal.toLocaleString()}</span>
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
        <section className="hidden lg:block sticky top-24 h-fit">
          <div className="flex items-center gap-2 mb-4 text-slate-500 font-medium text-sm">
            <Info className="w-4 h-4" />
            Live Preview
          </div>
          
          <div className="bg-slate-200 p-8 rounded-3xl shadow-inner overflow-hidden">
            <div 
              ref={invoiceRef}
              className="bg-white w-full aspect-[1/1.414] shadow-2xl p-12 flex flex-col"
              style={{ fontSize: '12px' }}
            >
              {/* Invoice Header */}
              <div className="flex justify-between items-start mb-12">
                <div>
                  {data.businessLogo ? (
                    <img src={data.businessLogo} alt="Logo" className="h-16 w-auto mb-4 object-contain" />
                  ) : (
                    <div className="w-12 h-12 bg-indigo-600 rounded flex items-center justify-center text-white font-bold text-xl mb-4">S</div>
                  )}
                  <h2 className="text-2xl font-bold text-slate-900 uppercase tracking-tight">{data.type}</h2>
                </div>
                <div className="text-right space-y-1">
                  <p className="font-bold text-slate-900">#{data.invoiceNumber}</p>
                  <p className="text-slate-500">Date: {data.date}</p>
                  {data.type === 'invoice' && <p className="text-slate-500">Due: {data.dueDate}</p>}
                </div>
              </div>

              {/* Addresses */}
              <div className="grid grid-cols-2 gap-12 mb-12">
                <div className="space-y-2">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">From</p>
                  <p className="font-bold text-slate-900 text-sm">{data.businessName || 'Your Business Name'}</p>
                  <div className="text-slate-500 leading-relaxed whitespace-pre-line">
                    {data.businessAddress}
                    {data.businessEmail && `\n${data.businessEmail}`}
                    {data.businessPhone && `\n${data.businessPhone}`}
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Bill To</p>
                  <p className="font-bold text-slate-900 text-sm">{data.clientName || 'Client Name'}</p>
                  <div className="text-slate-500 leading-relaxed whitespace-pre-line">
                    {data.clientAddress}
                    {data.clientEmail && `\n${data.clientEmail}`}
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="flex-1">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-slate-900">
                      <th className="text-left py-3 font-bold text-slate-900 uppercase tracking-wider">Description</th>
                      <th className="text-right py-3 font-bold text-slate-900 uppercase tracking-wider w-20">Qty</th>
                      <th className="text-right py-3 font-bold text-slate-900 uppercase tracking-wider w-28">Price</th>
                      <th className="text-right py-3 font-bold text-slate-900 uppercase tracking-wider w-28">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {data.items.map((item) => (
                      <tr key={item.id}>
                        <td className="py-4 text-slate-700">{item.description || 'Item Description'}</td>
                        <td className="py-4 text-right text-slate-700">{item.quantity}</td>
                        <td className="py-4 text-right text-slate-700">{currencySymbol}{item.price.toLocaleString()}</td>
                        <td className="py-4 text-right font-bold text-slate-900">{currencySymbol}{(item.quantity * item.price).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Footer Totals */}
              <div className="mt-12 pt-6 border-t-2 border-slate-900 flex justify-between items-start">
                <div className="max-w-[50%]">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Notes</p>
                  <p className="text-slate-500 leading-relaxed whitespace-pre-line">{data.notes || 'Thank you for your business!'}</p>
                </div>
                <div className="w-48 space-y-2">
                  <div className="flex justify-between text-slate-500">
                    <span>Subtotal</span>
                    <span>{currencySymbol}{subtotal.toLocaleString()}</span>
                  </div>
                  {data.taxRate > 0 && (
                    <div className="flex justify-between text-slate-500">
                      <span>Tax ({data.taxRate}%)</span>
                      <span>{currencySymbol}{taxAmount.toLocaleString()}</span>
                    </div>
                  )}
                  {data.discount > 0 && (
                    <div className="flex justify-between text-slate-500">
                      <span>Discount</span>
                      <span>-{currencySymbol}{data.discount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-bold text-slate-900 pt-2 border-t border-slate-100">
                    <span>Total</span>
                    <span>{currencySymbol}{total.toLocaleString()}</span>
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
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">S</div>
                <span className="text-xl font-bold">SwiftInvoice</span>
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
            <p className="text-slate-400 text-xs">© 2026 SwiftInvoice. All rights reserved.</p>
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
