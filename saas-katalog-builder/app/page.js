'use client';
import React, { useState, useEffect } from 'react';
import { 
  Wrench, 
  BookOpen, 
  Sparkles, 
  Search, 
  MessageCircle, 
  Store, 
  Plus, 
  Save, 
  Eye, 
  Edit3,
  FileText,
  TrendingUp,
  Trash2,
  Upload,
  Palette,
  ExternalLink,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { db } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export default function Home() {
  const [activeTab, setActiveTab] = useState('preview'); // 'edit' | 'preview'
  const [bottomNav, setBottomNav] = useState('produk'); // 'baca' | 'materi' | 'produk'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [isSaving, setIsSaving] = useState(false);

  // Data Toko RIVIR DIGITAL
  const [storeData, setStoreData] = useState({
    name: 'RIVIR DIGITAL',
    whatsapp: '6281234567890',
    slogan: 'Pusat Tools Web Interaktif, E-Book Premium & Aset Digital Kreatif',
    logoUrl: '',
    bgTheme: 'from-[#0d1117] via-[#161b22] to-[#0d1117]',
    statsProducts: '100+',
    statsLearners: '500+',
    bacaTitle: 'Dari Hobi Jadi Gaji',
    bacaSubtitle: 'RIVIR DIGITAL ECOSYSTEM',
    bacaContent: 'Selamat datang di RIVIR DIGITAL! Di sini kamu bisa mengakses berbagai tools web interaktif buatan kami, e-book panduan, dan aset digital pilihan untuk mendukung karya serta bisnismu.',
    materi1Title: 'Panduan Tools',
    materi1Desc: 'Dokumentasi & cara pakai tools buatan RIVIR DIGITAL',
    materi2Title: 'RIVIR Pro Club',
    materi2Desc: 'Akses versi Pro & fitur eksklusif untuk member'
  });

  const [newProduct, setNewProduct] = useState({
    title: '',
    url: '',
    category: 'Tools Free',
    iconColor: 'bg-emerald-500',
    badge: 'FREE'
  });

  const [products, setProducts] = useState([
    { id: 1, title: 'Katalog Builder App', category: 'Tools Free', iconColor: 'bg-cyan-500', badge: 'FREE', url: '#' },
    { id: 2, title: 'Dari Hobi Jadi Gaji (E-Book)', category: 'Ebook', iconColor: 'bg-rose-500', badge: 'POPULER', url: '#' },
    { id: 3, title: 'AI Content Generator Tool', category: 'Tools Pro', iconColor: 'bg-purple-500', badge: 'PRO', url: '#' },
    { id: 4, title: '100+ Template Canva IG', category: 'Template', iconColor: 'bg-amber-500', badge: 'HOT', url: '#' }
  ]);

  useEffect(() => {
    async function loadData() {
      try {
        const docRef = doc(db, 'katalog_config', 'rivir_digital_store');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.storeData) setStoreData(data.storeData);
          if (data.products) setProducts(data.products);
        }
      } catch (err) {
        console.error("Gagal mengambil data dari Firebase:", err);
      }
    }
    loadData();
  }, []);

  const handleSaveData = async () => {
    setIsSaving(true);
    try {
      const docRef = doc(db, 'katalog_config', 'rivir_digital_store');
      await setDoc(docRef, {
        storeData,
        products
      }, { merge: true });
      
      alert('✅ Pengaturan RIVIR DIGITAL berhasil disimpan ke Cloud Firebase!');
      setActiveTab('preview');
    } catch (err) {
      console.error("Error Detail Firebase:", err);
      alert(`❌ Gagal menyimpan data: ${err.message || 'Cek izin Firestore Rules'}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 200;
          const MAX_HEIGHT = 200;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
          setStoreData({ ...storeData, logoUrl: dataUrl });
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!newProduct.title || !newProduct.url) return;
    const item = {
      id: Date.now(),
      ...newProduct
    };
    setProducts([...products, item]);
    setNewProduct({ title: '', url: '', category: 'Tools Free', iconColor: 'bg-emerald-500', badge: 'FREE' });
  };

  const handleDeleteProduct = (id) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const categories = ['Semua', 'Tools Free', 'Tools Pro', 'Ebook', 'Template', 'Ecourse'];

  const filteredProducts = products.filter(p => {
    const matchCat = selectedCategory === 'Semua' || p.category === selectedCategory;
    const matchSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className={`min-h-screen bg-gradient-to-b ${storeData.bgTheme} text-slate-100 flex flex-col font-sans relative overflow-x-hidden pb-28 transition-all duration-500`}>
      <div className="fixed top-[-10%] left-[-20%] w-[500px] h-[500px] bg-cyan-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed top-[40%] right-[-20%] w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[120px] pointer-events-none" />

      {/* Header Utama RIVIR DIGITAL */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#161b22]/90 border-b border-slate-800/80 px-6 py-4 flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-400 via-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Zap className="w-6 h-6 text-slate-950 font-black" />
          </div>
          <div>
            <h1 className="font-extrabold text-lg tracking-wider bg-gradient-to-r from-white via-cyan-200 to-blue-400 bg-clip-text text-transparent">
              RIVIR <span className="text-cyan-400 font-bold">DIGITAL</span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-900/90 p-1 rounded-xl border border-slate-800 flex text-xs">
            <button 
              onClick={() => setActiveTab('edit')}
              className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${activeTab === 'edit' ? 'bg-cyan-500 text-slate-950 shadow-md font-bold' : 'text-slate-400 hover:text-white'}`}
            >
              <Edit3 className="w-4 h-4" /> Edit Hub
            </button>
            <button 
              onClick={() => setActiveTab('preview')}
              className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${activeTab === 'preview' ? 'bg-cyan-500 text-slate-950 shadow-md font-bold' : 'text-slate-400 hover:text-white'}`}
            >
              <Eye className="w-4 h-4" /> Pratinjau
            </button>
          </div>

          <button 
            onClick={handleSaveData}
            disabled={isSaving}
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95 disabled:opacity-50"
          >
            <Save className="w-4 h-4" /> {isSaving ? 'Simpan...' : 'Simpan'}
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto w-full px-6 pt-6 flex-1">
        
        {/* ================= PANEL EDIT ================= */}
        {activeTab === 'edit' && (
          <div className="space-y-6 pb-12">
            
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 backdrop-blur-md shadow-xl space-y-4">
              <h2 className="text-sm font-semibold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                <Store className="w-4 h-4" /> 1. Pengaturan Identitas RIVIR DIGITAL
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="text-slate-400 font-medium">Nama Brand / Website</label>
                  <input 
                    type="text"
                    value={storeData.name}
                    onChange={(e) => setStoreData({...storeData, name: e.target.value})}
                    className="w-full mt-1.5 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-cyan-500 text-sm"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-medium">Nomor WhatsApp Konsultasi (628xxx)</label>
                  <input 
                    type="text"
                    value={storeData.whatsapp}
                    onChange={(e) => setStoreData({...storeData, whatsapp: e.target.value})}
                    className="w-full mt-1.5 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-cyan-500 text-sm"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-slate-400 font-medium">Logo / Avatar Branding</label>
                  <div className="flex items-center gap-3 mt-1.5">
                    <label className="cursor-pointer bg-slate-800 hover:bg-slate-700 border border-slate-700 text-cyan-400 px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all">
                      <Upload className="w-4 h-4" /> Upload File Logo
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                    {storeData.logoUrl && <span className="text-xs text-emerald-400">✔ Logo Berhasil Dimuat</span>}
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="text-slate-400 font-medium">Atau Link URL Logo</label>
                  <input 
                    type="text"
                    placeholder="https://..."
                    value={storeData.logoUrl}
                    onChange={(e) => setStoreData({...storeData, logoUrl: e.target.value})}
                    className="w-full mt-1.5 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-cyan-500 text-sm"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-slate-400 font-medium">Slogan & Deskripsi Website</label>
                  <textarea 
                    value={storeData.slogan}
                    onChange={(e) => setStoreData({...storeData, slogan: e.target.value})}
                    className="w-full mt-1.5 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-cyan-500 text-sm"
                    rows={2}
                  />
                </div>
              </div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 backdrop-blur-md shadow-xl space-y-4">
              <h2 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                <Wrench className="w-4 h-4" /> 2. Kelola Tools & Produk Digital
              </h2>
              <form onSubmit={handleAddProduct} className="space-y-3 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-400 font-medium">Nama Tools / Produk</label>
                    <input type="text" placeholder="Contoh: AI Image Generator Tool" value={newProduct.title} onChange={(e) => setNewProduct({...newProduct, title: e.target.value})} className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-200 text-sm" />
                  </div>
                  <div>
                    <label className="text-slate-400 font-medium">URL Link Akses Tools</label>
                    <input type="text" placeholder="https://..." value={newProduct.url} onChange={(e) => setNewProduct({...newProduct, url: e.target.value})} className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-200 text-sm" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-slate-400 font-medium">Kategori</label>
                    <select value={newProduct.category} onChange={(e) => setNewProduct({...newProduct, category: e.target.value})} className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-200 text-sm">
                      <option value="Tools Free">Tools Free</option>
                      <option value="Tools Pro">Tools Pro</option>
                      <option value="Ebook">Ebook</option>
                      <option value="Template">Template</option>
                      <option value="Ecourse">Ecourse</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-slate-400 font-medium">Warna Tema Ikon</label>
                    <select value={newProduct.iconColor} onChange={(e) => setNewProduct({...newProduct, iconColor: e.target.value})} className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-200 text-sm">
                      <option value="bg-cyan-500">Biru Cyan</option>
                      <option value="bg-emerald-500">Hijau Emerald</option>
                      <option value="bg-purple-500">Ungu Pro</option>
                      <option value="bg-amber-500">Kuning Hot</option>
                      <option value="bg-rose-500">Merah Rose</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-slate-400 font-medium">Badge Teks</label>
                    <input type="text" placeholder="FREE / PRO / HOT" value={newProduct.badge} onChange={(e) => setNewProduct({...newProduct, badge: e.target.value})} className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-200 text-sm" />
                  </div>
                </div>
                <button type="submit" className="w-full mt-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-3 rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20">
                  <Plus className="w-4 h-4" /> Tambah Item ke RIVIR DIGITAL Hub
                </button>
              </form>

              <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1 pt-3 border-t border-slate-800">
                {products.map((p) => (
                  <div key={p.id} className="flex items-center justify-between bg-slate-950 p-3 rounded-xl text-xs">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-7 h-7 rounded-lg ${p.iconColor} flex items-center justify-center text-slate-950 shrink-0`}>
                        <Wrench className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-200 text-sm truncate">{p.title}</p>
                        <span className="text-[10px] text-slate-400">{p.category}</span>
                      </div>
                    </div>
                    <button onClick={() => handleDeleteProduct(p.id)} className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 shrink-0">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ================= PANEL PREVIEW ================= */}
        {activeTab === 'preview' && (
          <div className="space-y-6">
            
            {/* Main Branding Card */}
            <div className="bg-gradient-to-r from-slate-900 via-[#161b22] to-slate-900 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl shadow-2xl flex items-center gap-5 relative overflow-hidden">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-500 to-purple-600 p-0.5 shadow-xl shrink-0 overflow-hidden">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                  {storeData.logoUrl ? (
                    <img src={storeData.logoUrl} alt="Logo RIVIR DIGITAL" className="w-full h-full object-cover rounded-[14px]" />
                  ) : (
                    <Zap className="w-8 h-8 text-cyan-400" />
                  )}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-black text-white tracking-wide truncate">{storeData.name}</h2>
                  <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0" />
                </div>
                <p className="text-xs text-slate-300 leading-relaxed line-clamp-2 mt-1">{storeData.slogan}</p>
              </div>
            </div>

            {/* Bottom Nav View Content */}
            {bottomNav === 'baca' && (
              <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-3 shadow-xl animate-fadeIn">
                <h3 className="text-xs font-bold text-cyan-400 flex items-center gap-2 tracking-wide uppercase">
                  <Sparkles className="w-4 h-4" /> {storeData.bacaSubtitle}
                </h3>
                <h4 className="text-lg font-extrabold text-white">{storeData.bacaTitle}</h4>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {storeData.bacaContent}
                </p>
              </div>
            )}

            {bottomNav === 'materi' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fadeIn">
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg">
                  <FileText className="w-7 h-7 text-cyan-400 mb-3" />
                  <h4 className="text-sm font-bold text-slate-200">{storeData.materi1Title}</h4>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{storeData.materi1Desc}</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg">
                  <TrendingUp className="w-7 h-7 text-purple-400 mb-3" />
                  <h4 className="text-sm font-bold text-slate-200">{storeData.materi2Title}</h4>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{storeData.materi2Desc}</p>
                </div>
              </div>
            )}

            {bottomNav === 'produk' && (
              <>
                {/* Search & Filter Bar */}
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
                    <input 
                      type="text"
                      placeholder="Cari tools gratis, versi pro, ebook, atau template..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-12 pr-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-cyan-500 shadow-inner"
                    />
                  </div>

                  {/* Kategori Horizontal Bar */}
                  <div className="flex gap-2 overflow-x-auto pb-1 text-sm no-scrollbar">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-4 py-2 rounded-xl whitespace-nowrap border transition-all ${
                          selectedCategory === cat 
                            ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold border-cyan-400 shadow-lg' 
                            : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-white'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Grid Produk & Tools (Lapang di Layar Desktop) */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {filteredProducts.map((p) => (
                    <div 
                      key={p.id}
                      className="bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between relative shadow-xl group hover:border-cyan-500/50 transition-all"
                    >
                      {p.badge && (
                        <span className={`absolute top-2.5 right-2.5 text-[9px] font-black px-2 py-0.5 rounded-md border ${
                          p.badge.toUpperCase() === 'PRO' 
                            ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' 
                            : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
                        }`}>
                          {p.badge}
                        </span>
                      )}
                      <div>
                        <div className={`w-10 h-10 rounded-xl ${p.iconColor || 'bg-cyan-500'} flex items-center justify-center text-slate-950 mb-3 shadow-md group-hover:scale-105 transition-transform`}>
                          <Wrench className="w-5 h-5" />
                        </div>
                        <h4 className="text-xs font-bold text-slate-200 line-clamp-2 leading-relaxed">{p.title}</h4>
                      </div>
                      <a 
                        href={p.url || '#'}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-4 w-full py-2 rounded-xl bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-cyan-400 text-xs font-bold text-center flex items-center justify-center gap-1 border border-slate-700 transition-all shadow"
                      >
                        BUKA TOOLS <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Footer WhatsApp CTA */}
            <div className="bg-gradient-to-r from-cyan-950/40 via-slate-900 to-slate-900 border border-cyan-500/30 rounded-2xl p-5 flex items-center justify-between shadow-xl mt-6">
              <div>
                <p className="text-sm font-bold text-cyan-400">Ada Ide Tools Baru / Pertanyaan?</p>
                <p className="text-xs text-slate-400 mt-0.5">Hubungi Muhamad Rijal via WhatsApp</p>
              </div>
              <a 
                href={`https://wa.me/${storeData.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-cyan-500/20"
              >
                <MessageCircle className="w-4 h-4" /> Hubungi
              </a>
            </div>

          </div>
        )}
      </main>

      {/* Navigasi Bawah Floating */}
      <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 max-w-sm w-[90%] bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-full px-6 py-3 flex items-center justify-around shadow-2xl z-50 text-xs">
        <button 
          onClick={() => { setBottomNav('baca'); setActiveTab('preview'); }}
          className={`flex flex-col items-center gap-1 transition-all ${bottomNav === 'baca' && activeTab === 'preview' ? 'text-cyan-400 scale-105' : 'text-slate-400 hover:text-white'}`}
        >
          <BookOpen className="w-5 h-5" />
          <span className="text-[11px]">Info Hub</span>
        </button>
        <button 
          onClick={() => { setBottomNav('materi'); setActiveTab('preview'); }}
          className={`flex flex-col items-center gap-1 transition-all ${bottomNav === 'materi' && activeTab === 'preview' ? 'text-cyan-400 scale-105' : 'text-slate-400 hover:text-white'}`}
        >
          <FileText className="w-5 h-5" />
          <span className="text-[11px]">Panduan</span>
        </button>
        <button 
          onClick={() => { setBottomNav('produk'); setActiveTab('preview'); }}
          className={`flex flex-col items-center gap-1 transition-all ${bottomNav === 'produk' && activeTab === 'preview' ? 'text-cyan-400 scale-105' : 'text-slate-400 hover:text-white'}`}
        >
          <Wrench className="w-5 h-5" />
          <span className="text-[11px]">Katalog Tools</span>
        </button>
      </nav>
    </div>
  );
}
