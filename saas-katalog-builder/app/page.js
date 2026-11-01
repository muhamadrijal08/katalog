'use client';

import React, { useState, useMemo } from 'react';
import { 
  Store, BookOpen, Gamepad2, Gift, MessageCircle, Search, 
  Plus, Trash2, ExternalLink, Check, Sparkles, Smartphone, 
  LayoutDashboard, Eye, Save, Palette, Layers, Share2, HelpCircle, FileText
} from 'lucide-react';

const PRESETS = {
  digital: {
    store_name: "Digital Treasury Hub",
    store_tagline: "Pusat Aset Digital, Template Canva & E-Book Premium Siap Pakai",
    whatsapp_number: "6281234567890",
    logo_url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150",
    theme_color: "emerald",
    products: [
      { id: '1', title: "100+ Template Canva Feed IG", subtitle: "Desain Promosi Siap Edit", category: "Produk Digital", url: "https://drive.google.com", icon: "FileText" },
      { id: '2', title: "E-Book Panduan Bisnis Digital", subtitle: "Format PDF + Lisensi PLR", category: "Modul & E-Book", url: "https://drive.google.com", icon: "BookOpen" },
      { id: '3', title: "Game Edukasi Matematika", subtitle: "Berbasis Web Interaktif Anak", category: "Game Interaktif", url: "https://example.com/game", icon: "Gamepad2" },
      { id: '4', title: "Bonus 500+ Prompt ChatGPT", subtitle: "Aset Copywriting & Marketing", category: "Bonus Premium", url: "https://drive.google.com", icon: "Gift" }
    ]
  },
  edukasi: {
    store_name: "Dunia Edukasi Anak",
    store_tagline: "Kumpulan Worksheet, Flashcard & Game Pembelajaran Interaktif",
    whatsapp_number: "6289876543210",
    logo_url: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=150",
    theme_color: "blue",
    products: [
      { id: '101', title: "Worksheet Mewarnai PDF", subtitle: "50 Lembar Siap Cetak A4", category: "Modul & E-Book", url: "#", icon: "FileText" },
      { id: '102', title: "Flashcard Hijaiyah & English", subtitle: "Kartu Cetak Bergambar HD", category: "Produk Digital", url: "#", icon: "BookOpen" },
      { id: '103', title: "Game Kuis Tebak Bergambar", subtitle: "Main Langsung di HP/Laptop", category: "Game Interaktif", url: "#", icon: "Gamepad2" }
    ]
  }
};

const THEMES = {
  emerald: {
    name: "Emerald Green",
    primaryBg: "bg-emerald-600 hover:bg-emerald-500",
    primaryText: "text-emerald-400",
    badgeBg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    border: "border-emerald-500",
    gradient: "from-emerald-900/60 to-slate-900",
    buttonTheme: "bg-emerald-600 hover:bg-emerald-500 text-white"
  },
  blue: {
    name: "Royal Blue",
    primaryBg: "bg-blue-600 hover:bg-blue-500",
    primaryText: "text-blue-400",
    badgeBg: "bg-blue-500/10 text-blue-400 border-blue-500/30",
    border: "border-blue-500",
    gradient: "from-blue-900/60 to-slate-900",
    buttonTheme: "bg-blue-600 hover:bg-blue-500 text-white"
  },
  purple: {
    name: "Cyber Purple",
    primaryBg: "bg-purple-600 hover:bg-purple-500",
    primaryText: "text-purple-400",
    badgeBg: "bg-purple-500/10 text-purple-400 border-purple-500/30",
    border: "border-purple-500",
    gradient: "from-purple-900/60 to-slate-900",
    buttonTheme: "bg-purple-600 hover:bg-purple-500 text-white"
  }
};

export default function App() {
  const [viewMode, setViewMode] = useState('split');
  const [toastMessage, setToastMessage] = useState(null);
  const [storeData, setStoreData] = useState(PRESETS.digital);
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [newProduct, setNewProduct] = useState({
    title: '',
    subtitle: '',
    category: 'Produk Digital',
    url: '',
    icon: 'FileText'
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const loadPreset = (presetKey) => {
    if (PRESETS[presetKey]) {
      setStoreData(PRESETS[presetKey]);
      showToast(`Preset "${PRESETS[presetKey].store_name}" berhasil dimuat!`);
    }
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!newProduct.title || !newProduct.url) {
      showToast("Judul dan Link URL wajib diisi!");
      return;
    }
    const item = { ...newProduct, id: Date.now().toString() };
    setStoreData(prev => ({ ...prev, products: [item, ...prev.products] }));
    setNewProduct({ title: '', subtitle: '', category: 'Produk Digital', url: '', icon: 'FileText' });
    showToast("Produk baru berhasil ditambahkan!");
  };

  const handleDeleteProduct = (id) => {
    setStoreData(prev => ({ ...prev, products: prev.products.filter(p => p.id !== id) }));
    showToast("Produk berhasil dihapus!");
  };

  const filteredProducts = useMemo(() => {
    return storeData.products.filter(p => {
      const matchCategory = selectedCategory === 'Semua' || p.category === selectedCategory;
      const matchSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.subtitle.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [storeData.products, selectedCategory, searchQuery]);

  const currentTheme = THEMES[storeData.theme_color] || THEMES.emerald;

  const renderIcon = (iconName) => {
    switch (iconName) {
      case 'BookOpen': return <BookOpen className="w-5 h-5" />;
      case 'Gamepad2': return <Gamepad2 className="w-5 h-5" />;
      case 'Gift': return <Gift className="w-5 h-5" />;
      case 'Sparkles': return <Sparkles className="w-5 h-5" />;
      default: return <FileText className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased flex flex-col">
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50 px-4 py-3 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-emerald-500/20">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-base tracking-tight">KatalogCraft SaaS</span>
              <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] px-2 py-0.5 rounded-full font-semibold">v2.4 Pro</span>
            </div>
            <p className="text-xs text-slate-400">Website Builder Instant Katalog Digital</p>
          </div>
        </div>

        <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700">
          <button onClick={() => setViewMode('dashboard')} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${viewMode === 'dashboard' ? 'bg-slate-700 text-emerald-400' : 'text-slate-400'}`}>Dashboard Edit</button>
          <button onClick={() => setViewMode('split')} className={`hidden md:block px-3 py-1.5 rounded-lg text-xs font-medium ${viewMode === 'split' ? 'bg-slate-700 text-emerald-400' : 'text-slate-400'}`}>Split View</button>
          <button onClick={() => setViewMode('preview')} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${viewMode === 'preview' ? 'bg-slate-700 text-emerald-400' : 'text-slate-400'}`}>Live Preview</button>
        </div>

        <div className="flex items-center space-x-2">
          <button onClick={() => showToast("Perubahan tersimpan!")} className="bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1">
            <Save className="w-3.5 h-3.5" /> Simpan
          </button>
        </div>
      </header>

      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-800 text-slate-100 border border-emerald-500/40 px-4 py-3 rounded-xl shadow-2xl flex items-center space-x-3">
          <Check className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-medium">{toastMessage}</span>
        </div>
      )}

      <div className="flex-1 flex overflow-hidden">
        {(viewMode === 'dashboard' || viewMode === 'split') && (
          <div className={`flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-slate-950 border-r border-slate-800 ${viewMode === 'split' ? 'max-w-xl' : 'w-full max-w-4xl mx-auto'}`}>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider border-b border-slate-800 pb-2.5 flex items-center gap-2">
                <Store className="w-4 h-4 text-emerald-400" /> Identitas Toko
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Nama Toko</label>
                  <input type="text" value={storeData.store_name} onChange={(e) => setStoreData({...storeData, store_name: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-100" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">WhatsApp</label>
                  <input type="text" value={storeData.whatsapp_number} onChange={(e) => setStoreData({...storeData, whatsapp_number: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-100" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Slogan</label>
                <input type="text" value={storeData.store_tagline} onChange={(e) => setStoreData({...storeData, store_tagline: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-100" />
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider border-b border-slate-800 pb-2.5 flex items-center gap-2">
                <Plus className="w-4 h-4 text-emerald-400" /> Tambah Produk
              </h2>
              <form onSubmit={handleAddProduct} className="space-y-3">
                <input type="text" value={newProduct.title} onChange={(e) => setNewProduct({...newProduct, title: e.target.value})} placeholder="Judul Produk" className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100" />
                <input type="url" value={newProduct.url} onChange={(e) => setNewProduct({...newProduct, url: e.target.value})} placeholder="Link URL Produk" className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100" />
                <button type="submit" className="w-full bg-emerald-600 text-white text-xs py-2.5 rounded-xl font-semibold">Tambah ke Katalog</button>
              </form>
            </div>
          </div>
        )}

        {(viewMode === 'preview' || viewMode === 'split') && (
          <div className="flex-1 bg-slate-950 p-4 overflow-y-auto flex flex-col items-center">
            <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-[32px] overflow-hidden shadow-2xl p-4 min-h-[600px] flex flex-col">
              <header className="text-center pt-4">
                <h1 className="text-lg font-extrabold text-white">{storeData.store_name}</h1>
                <p className="text-xs text-slate-400 mt-1">{storeData.store_tagline}</p>
              </header>

              <div className="space-y-2 pt-6 flex-1">
                {filteredProducts.map((item) => (
                  <a key={item.id} href={item.url} target="_blank" rel="noreferrer" className="flex items-center justify-between bg-slate-800 p-3 rounded-2xl border border-slate-700">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-xl bg-slate-900 text-emerald-400">{renderIcon(item.icon)}</div>
                      <div>
                        <h4 className="text-xs font-semibold text-slate-200">{item.title}</h4>
                        <p className="text-[10px] text-slate-400">{item.subtitle}</p>
                      </div>
                    </div>
                    <span className="text-[10px] bg-emerald-600 text-white px-2 py-1 rounded-lg font-bold">LIHAT</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}