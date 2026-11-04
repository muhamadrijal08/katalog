'use client';
import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
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
  ExternalLink
} from 'lucide-react';
import { db } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export default function Home() {
  const [activeTab, setActiveTab] = useState('preview'); // 'edit' | 'preview'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('semua');
  const [isSaving, setIsSaving] = useState(false);

  // Data Toko ala Digital Treasury
  const [storeData, setStoreData] = useState({
    name: 'Digital Treasury',
    whatsapp: '6281533331953',
    slogan: 'Pusat Aset Digital, Template Canva, E-Book Premium & Modul Edukasi',
    logoUrl: 'https://lh3.googleusercontent.com/u/0/d/1EsBwFRqDXW_HGSgtiYtMXwCl7Q45z2JC',
    partnerLink: 'https://akbar-kabul-wahyudi.myscalev.com/buat-website-sendiri',
    bgTheme: 'from-[#0B132B] via-[#1C2541] to-[#0B132B]',
    statsProducts: '1000',
    statsModules: '29',
  });

  // Database Produk Lengkap
  const [products, setProducts] = useState([
    { id: 101, title: 'Tasbih Digital', category: 'islami', icon: 'fa-fingerprint', url: 'https://sites.google.com/view/tasbih-mizyan/home' },
    { id: 102, title: 'Waktu Sholat', category: 'islami', icon: 'fa-clock', url: 'https://equran.id/shalat' },
    { id: 103, title: 'Arah Kiblat', category: 'islami', icon: 'fa-compass', url: 'https://qiblafinder.withgoogle.com/intl/ms/desktop' },
    { id: 104, title: 'Dzikir Pagi Petang', category: 'islami', icon: 'fa-cloud-sun', url: 'https://sites.google.com/view/produkdigitaltemaislami/kumpulan-dzikir-pagi-dan-petang' },
    { id: 105, title: 'Adab Islam', category: 'islami', icon: 'fa-hands-praying', url: 'https://sites.google.com/view/produkdigitaltemaislami/adab-dalam-islam' },
    { id: 106, title: 'Amalan Rezeki', category: 'islami', icon: 'fa-wheat-awn', url: 'https://sites.google.com/view/produkdigitaltemaislami/amalan-pembuka-rezeki' },
    { id: 107, title: 'Doa Harian', category: 'islami', icon: 'fa-book-open-reader', url: 'https://equran.id/doa' },
    { id: 108, title: 'Kisah Nabi', category: 'islami', icon: 'fa-scroll', url: 'https://sites.google.com/view/kisah-nabi/home' },
    { id: 109, title: 'Tulis Al-Quran', category: 'islami', icon: 'fa-pen-nib', url: 'https://sites.google.com/view/mizyan-tulis-quran/home' },
    { id: 110, title: 'Ebook Tajwid', category: 'ebook', icon: 'fa-book-quran', url: 'https://drive.google.com/file/d/1EFXRmfKhrGReJ4uj9HtQxIu1mX2pxMHl/view?usp=drivesdk' },
    
    // Anak-anak
    { id: 201, title: 'Video Edukasi', category: 'ecourse', icon: 'fa-film', url: 'https://drive.google.com/drive/folders/1Rf2aXQuhSy20wbutc08tjyiRgfzJPpzL' },
    { id: 202, title: 'Worksheet Anak', category: 'worksheet', icon: 'fa-file-pen', url: 'https://www.digitalprodukno1seindonesia.my.id/worksheet' },
    { id: 203, title: 'Flash Card', category: 'worksheet', icon: 'fa-layer-group', url: 'https://www.digitalprodukno1seindonesia.my.id/flash-card' },
    { id: 204, title: 'Quiz Anak SD', category: 'game', icon: 'fa-graduation-cap', url: 'https://www.digitalprodukno1seindonesia.my.id/quiz' },
    
    // Game
    { id: 301, title: 'Asah Otak', category: 'game', icon: 'fa-puzzle-piece', url: 'https://www.digitalprodukno1seindonesia.my.id/game-edukasi' },
    { id: 302, title: 'Quiz Islami', category: 'game', icon: 'fa-star-and-crescent', url: 'https://sites.google.com/view/game-islami-cilik/home' },
    { id: 303, title: 'Quiz MTK', category: 'game', icon: 'fa-calculator', url: 'https://sites.google.com/view/game-edukasi-islami-mizyan/home' },
    { id: 304, title: 'Ular Tangga', category: 'game', icon: 'fa-dice', url: 'https://sites.google.com/view/game-ular-tanggaa/home' },
    { id: 305, title: 'Tetris Mobile', category: 'game', icon: 'fa-cubes', url: 'https://sites.google.com/view/tetris-3d/home' },

    // Template & Tools
    { id: 501, title: '48 Buku Cerita B.Inggris', category: 'ebook', icon: 'fa-book-open', url: 'https://drive.google.com/file/d/13J6yOoiUiIwp7sK2r-13zI36zKQuV9_9/view' },
    { id: 502, title: '20+ Finance Social Media', category: 'template', icon: 'fa-chart-line', url: 'https://www.canva.com/design/DAGSSKhRum0/sesUclbzYyTSUDrktkYrHQ/view' },
    { id: 503, title: '70+ Worksheet Baca', category: 'worksheet', icon: 'fa-spell-check', url: 'https://drive.google.com/drive/folders/1hg_-b2xUUqvXdoXQ9MbM3XoxeX5l1HDj' },
    { id: 504, title: '1000 Ide Produk Digital', category: 'ebook', icon: 'fa-lightbulb', url: 'https://drive.google.com/file/d/1sMifdrNxyrhe6LAdsHoP1fVVNtHwsLC4/view' }
  ]);

  const [newProduct, setNewProduct] = useState({ title: '', url: '', category: 'template', icon: 'fa-box' });

  // Load Firestore Data
  useEffect(() => {
    async function loadData() {
      try {
        const docRef = doc(db, 'katalog_config', 'digital_treasury_store');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.storeData) setStoreData(data.storeData);
          if (data.products && data.products.length > 0) setProducts(data.products);
        }
      } catch (err) {
        console.error("Gagal load Firebase:", err);
      }
    }
    loadData();
  }, []);

  const handleSaveData = async () => {
    setIsSaving(true);
    try {
      const docRef = doc(db, 'katalog_config', 'digital_treasury_store');
      await setDoc(docRef, { storeData, products }, { merge: true });
      alert('✅ Berhasil disimpan & disinkronkan ke Cloud Firebase!');
      setActiveTab('preview');
    } catch (err) {
      alert(`❌ Gagal menyimpan: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!newProduct.title || !newProduct.url) return;
    setProducts([{ id: Date.now(), ...newProduct }, ...products]);
    setNewProduct({ title: '', url: '', category: 'template', icon: 'fa-box' });
  };

  const handleDeleteProduct = (id) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const categories = [
    { key: 'semua', label: 'Semua' },
    { key: 'template', label: 'Template' },
    { key: 'ebook', label: 'Ebook' },
    { key: 'ecourse', label: 'Ecourse' },
    { key: 'tools', label: 'Tools' },
    { key: 'game', label: 'Game' },
    { key: 'worksheet', label: 'Worksheet' },
    { key: 'islami', label: 'Islami' },
  ];

  const filteredProducts = products.filter(p => {
    const matchCat = selectedCategory === 'semua' || p.category === selectedCategory;
    const matchSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen bg-[#0B132B] text-slate-100 flex flex-col font-sans relative pb-20">
      
      {/* Top Header Mode Toggle (Edit / Preview) */}
      <div className="bg-[#1C2541] border-b border-slate-800 px-4 py-2.5 flex items-center justify-between sticky top-0 z-50 shadow-md">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-xs font-bold tracking-wider text-slate-200">Digital Treasury Dashboard</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-[#0B132B] p-1 rounded-xl border border-slate-700 flex text-xs">
            <button 
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${activeTab === 'preview' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-300'}`}
            >
              Pratinjau
            </button>
            <button 
              onClick={() => setActiveTab('edit')}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${activeTab === 'edit' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-300'}`}
            >
              Edit Toko
            </button>
          </div>
          {activeTab === 'edit' && (
            <button 
              onClick={handleSaveData}
              disabled={isSaving}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 shadow"
            >
              <Save className="w-3.5 h-3.5" /> {isSaving ? '...' : 'Simpan'}
            </button>
          )}
        </div>
      </div>

      <main className="max-w-md mx-auto w-full px-4 pt-4 flex-1 space-y-4">

        {/* ================= PANEL EDIT ================= */}
        {activeTab === 'edit' && (
          <div className="space-y-4 pb-10">
            <div className="bg-[#1C2541] border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
              <h2 className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">Pengaturan Identitas Toko</h2>
              <div className="space-y-2 text-xs">
                <div>
                  <label className="text-slate-400">Nama Toko</label>
                  <input 
                    type="text"
                    value={storeData.name}
                    onChange={(e) => setStoreData({...storeData, name: e.target.value})}
                    className="w-full mt-1 bg-[#0B132B] border border-slate-700 rounded-xl px-3 py-2 text-slate-200"
                  />
                </div>
                <div>
                  <label className="text-slate-400">URL Logo Toko</label>
                  <input 
                    type="text"
                    value={storeData.logoUrl}
                    onChange={(e) => setStoreData({...storeData, logoUrl: e.target.value})}
                    className="w-full mt-1 bg-[#0B132B] border border-slate-700 rounded-xl px-3 py-2 text-slate-200"
                  />
                </div>
                <div>
                  <label className="text-slate-400">Nomor WhatsApp Konsultasi (628xxx)</label>
                  <input 
                    type="text"
                    value={storeData.whatsapp}
                    onChange={(e) => setStoreData({...storeData, whatsapp: e.target.value})}
                    className="w-full mt-1 bg-[#0B132B] border border-slate-700 rounded-xl px-3 py-2 text-slate-200"
                  />
                </div>
                <div>
                  <label className="text-slate-400">Slogan / Deskripsi</label>
                  <textarea 
                    value={storeData.slogan}
                    onChange={(e) => setStoreData({...storeData, slogan: e.target.value})}
                    className="w-full mt-1 bg-[#0B132B] border border-slate-700 rounded-xl px-3 py-2 text-slate-200"
                    rows={2}
                  />
                </div>
              </div>
            </div>

            {/* Tambah Produk Instan */}
            <div className="bg-[#1C2541] border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
              <h2 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Tambah Produk / Link Baru</h2>
              <form onSubmit={handleAddProduct} className="space-y-2.5 text-xs">
                <input 
                  type="text"
                  placeholder="Judul Produk..."
                  value={newProduct.title}
                  onChange={(e) => setNewProduct({...newProduct, title: e.target.value})}
                  className="w-full bg-[#0B132B] border border-slate-700 rounded-xl px-3 py-2 text-slate-200"
                />
                <input 
                  type="text"
                  placeholder="URL Tujuan (https://...)"
                  value={newProduct.url}
                  onChange={(e) => setNewProduct({...newProduct, url: e.target.value})}
                  className="w-full bg-[#0B132B] border border-slate-700 rounded-xl px-3 py-2 text-slate-200"
                />
                <select 
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                  className="w-full bg-[#0B132B] border border-slate-700 rounded-xl px-3 py-2 text-slate-200 text-xs"
                >
                  {categories.filter(c => c.key !== 'semua').map(c => (
                    <option key={c.key} value={c.key}>{c.label}</option>
                  ))}
                </select>
                <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1">
                  <Plus className="w-4 h-4" /> Tambahkan Produk
                </button>
              </form>

              <div className="space-y-2 max-h-48 overflow-y-auto pr-1 pt-2 border-t border-slate-800">
                {products.map((p) => (
                  <div key={p.id} className="flex items-center justify-between bg-[#0B132B] p-2 rounded-xl text-xs">
                    <span className="font-bold text-slate-200 truncate">{p.title}</span>
                    <button onClick={() => handleDeleteProduct(p.id)} className="p-1 rounded bg-rose-500/20 text-rose-400">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= PANEL PREVIEW (TAMPILAN DIGITAL TREASURY) ================= */}
        {activeTab === 'preview' && (
          <div className="space-y-4">
            
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-[#1C2541] to-[#3A506B] border border-slate-700 rounded-3xl p-5 shadow-2xl relative overflow-hidden flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={storeData.logoUrl} alt="Logo" className="w-12 h-12 rounded-full object-cover border-2 border-cyan-400 shadow-md" />
                <div>
                  <h1 className="text-base font-extrabold text-white">{storeData.name}</h1>
                  <div className="flex gap-1.5 mt-1">
                    <span className="text-[10px] px-2 py-0.5 bg-cyan-500/20 text-cyan-300 rounded-md border border-cyan-500/30 font-medium">Digital Product</span>
                    <span className="text-[10px] px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded-md border border-purple-500/30 font-medium">Resources</span>
                  </div>
                </div>
              </div>
              <a href={storeData.partnerLink} target="_blank" rel="noreferrer" className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-3 py-2 rounded-xl text-xs font-bold shadow-lg">
                Buat Website
              </a>
            </div>

            {/* Statistik Kotak */}
            <div className="grid grid-cols-2 gap-3">
              <a href="https://sites.google.com/view/katalog-produk-premium/kumpulan-produk" target="_blank" rel="noreferrer" className="bg-[#1C2541] border border-slate-700/80 rounded-2xl p-4 shadow-lg hover:border-cyan-500 transition-all block">
                <div className="flex justify-between items-center text-xs text-slate-300 mb-1">
                  <span>📚 Produk Digital</span>
                  <ShoppingBag className="w-4 h-4 text-cyan-400" />
                </div>
                <p className="text-2xl font-black text-white">{storeData.statsProducts}+</p>
              </a>
              <div className="bg-[#1C2541] border border-slate-700/80 rounded-2xl p-4 shadow-lg">
                <div className="flex justify-between items-center text-xs text-slate-300 mb-1">
                  <span>🎓 Materi Belajar</span>
                  <BookOpen className="w-4 h-4 text-emerald-400" />
                </div>
                <p className="text-2xl font-black text-white">{storeData.statsModules}+</p>
              </div>
            </div>

            {/* Menu Navigasi Grid */}
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider pt-2">Menu Navigasi Utama</h2>
            <div className="grid grid-cols-2 gap-2.5">
              <a href="https://sites.google.com/view/katalog-produk-premium/kumpulan-produk" target="_blank" rel="noreferrer" className="bg-[#1C2541]/80 border border-slate-800 p-3.5 rounded-2xl flex flex-col gap-1 hover:border-cyan-500 transition-all">
                <ShoppingBag className="w-5 h-5 text-cyan-400 mb-1" />
                <h3 className="text-xs font-bold text-white">Produk</h3>
                <p className="text-[10px] text-slate-400">Akses Katalog File</p>
              </a>
              <a href={`https://wa.me/${storeData.whatsapp}?text=Halo%20kak!%20Aku%20mau%20konsultasi`} target="_blank" rel="noreferrer" className="bg-[#1C2541]/80 border border-slate-800 p-3.5 rounded-2xl flex flex-col gap-1 hover:border-emerald-500 transition-all">
                <MessageCircle className="w-5 h-5 text-emerald-400 mb-1" />
                <h3 className="text-xs font-bold text-white">Konsultasi</h3>
                <p className="text-[10px] text-slate-400">Tanya mentor praktisi</p>
              </a>
            </div>

            {/* Eksplorasi Produk Digital & Pencarian */}
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider pt-3">Eksplorasi Produk Digital</h2>
            <div className="space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input 
                  type="text"
                  placeholder="Cari template, ebook, game, atau produk..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#1C2541] border border-slate-700 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Kategori Filter */}
              <div className="flex gap-2 overflow-x-auto pb-1 text-xs">
                {categories.map((cat) => (
                  <button
                    key={cat.key}
                    onClick={() => setSelectedCategory(cat.key)}
                    className={`px-3.5 py-1.5 rounded-xl whitespace-nowrap border transition-all ${
                      selectedCategory === cat.key 
                        ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400 shadow' 
                        : 'bg-[#1C2541] text-slate-300 border-slate-700 hover:text-white'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid Kartu Produk */}
            <div className="grid grid-cols-3 gap-2.5 pt-1">
              {filteredProducts.map((p) => (
                <div 
                  key={p.id}
                  className="bg-gradient-to-b from-[#1C2541] to-[#0B132B] border border-slate-800 rounded-2xl p-3 flex flex-col justify-between shadow-lg"
                >
                  <div>
                    <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mb-2 shadow">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <h4 className="text-[11px] font-bold text-slate-200 line-clamp-2">{p.title}</h4>
                  </div>
                  <a 
                    href={p.url || '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 w-full py-1.5 rounded-xl bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-cyan-400 text-[10px] font-bold text-center block border border-slate-700 transition-all"
                  >
                    LIHAT
                  </a>
                </div>
              ))}
            </div>

            {/* Footer WhatsApp CTA */}
            <div className="bg-gradient-to-r from-emerald-950/60 to-[#1C2541] border border-emerald-500/30 rounded-2xl p-4 flex items-center justify-between shadow-xl mt-6">
              <div>
                <p className="text-xs font-bold text-emerald-400">Punya Pertanyaan?</p>
                <p className="text-[10px] text-slate-400">Konsultasi langsung via WhatsApp</p>
              </div>
              <a 
                href={`https://wa.me/${storeData.whatsapp}?text=Halo%20kak!%20Aku%20mau%20konsultasi`}
                target="_blank"
                rel="noreferrer"
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow"
              >
                <MessageCircle className="w-4 h-4" /> Hubungi
              </a>
            </div>

          </div>
        )}

      </main>
    </div>
  );
}
