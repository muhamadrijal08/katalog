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
  ArrowUp,
  ArrowDown,
  Palette,
  ExternalLink,
  Layers,
  HelpCircle
} from 'lucide-react';
import { db } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export default function Home() {
  const [activeTab, setActiveTab] = useState('preview'); // 'edit' | 'preview'
  const [bottomNav, setBottomNav] = useState('produk'); // 'baca' | 'materi' | 'produk'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [isSaving, setIsSaving] = useState(false);

  // State Pengaturan Toko ala Referensi Partner Mizyan
  const [storeData, setStoreData] = useState({
    name: 'Digital Gold',
    partnerLink: 'https://akbar-kabul-wahyudi.myscalev.com/b',
    digitalProductsLabel: 'Digital products',
    recoursesLabel: 'Recourses',
    ideasLabel: 'Ideas',
    communityLink: 'Link Grup Komunitas (WA/Telegram)',
    logoUrl: 'https://lh3.googleusercontent.com/d/1WegxyL-Kl2ozNPlg_ow2D_r4SFxnX4XF',
    bgTheme: 'from-[#0d1117] via-[#161b22] to-[#0d1117]',
    customBgUrl: 'https://lh3.googleusercontent.com/d/1rGIU64hHNMto1i4n7XxecksBGpmrlQt',
    statsProducts: '1000',
    statsModules: '29',
    statsUsers: '3354',
    statsRating: '4.9',
    // Menu & Konten
    bacaTitle: 'Sabar Adalah Kunci Sukses',
    bacaSubtitle: 'ISTIQOMAH & FOKUS',
    bacaContent: 'Perjalanan bisnis digital butuh proses. Terus upgrade ilmu dan ikuti modul materi yang tersedia.',
  });

  // Data Kategori / Kelompok Produk (Bisa diatur naik turun / edit / hapus)
  const [categoriesList, setCategoriesList] = useState([
    { id: 1, name: 'KHUSUS ISLAMI & IBADAH', count: '23 Produk', color: 'bg-emerald-500' },
    { id: 2, name: 'PRODUK ANAK & EDUKASI', count: '11 Produk', color: 'bg-amber-500' },
    { id: 3, name: 'GAME & KUIS INTERAKTIF', count: '15 Produk', color: 'bg-cyan-500' },
    { id: 4, name: 'BONUS & TOOLS SPESIAL', count: '18 Produk', color: 'bg-rose-500' },
    { id: 5, name: 'TEMPLATE & SOCIAL MEDIA', count: '29 Produk', color: 'bg-purple-500' },
  ]);

  // Data List Produk Lengkap
  const [products, setProducts] = useState([
    { id: 1, title: 'Tasbih Digital', category: 'KHUSUS ISLAMI & IBADAH', iconColor: 'bg-amber-500', badge: 'Hot', url: '#' },
    { id: 2, title: 'Waktu Sholat', category: 'KHUSUS ISLAMI & IBADAH', iconColor: 'bg-rose-500', badge: 'New', url: '#' },
    { id: 3, title: 'Ebook Tajwid', category: 'PRODUK ANAK & EDUKASI', iconColor: 'bg-cyan-500', badge: 'Pro', url: '#' },
    { id: 4, title: 'Quiz Anak SD', category: 'GAME & KUIS INTERAKTIF', iconColor: 'bg-purple-500', badge: 'Bonus', url: '#' }
  ]);

  const [newProduct, setNewProduct] = useState({
    title: '',
    url: '',
    category: 'KHUSUS ISLAMI & IBADAH',
    iconColor: 'bg-emerald-500',
    badge: 'Populer'
  });

  const [newCategoryName, setNewCategoryName] = useState('');

  // Load Data dari Firestore Cloud
  useEffect(() => {
    async function loadData() {
      try {
        const docRef = doc(db, 'katalog_config', 'partner_store');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.storeData) setStoreData(data.storeData);
          if (data.products) setProducts(data.products);
          if (data.categoriesList) setCategoriesList(data.categoriesList);
        }
      } catch (err) {
        console.error("Gagal mengambil data dari Firebase:", err);
      }
    }
    loadData();
  }, []);

  // Simpan Data ke Firestore Cloud
  const handleSaveData = async () => {
    setIsSaving(true);
    try {
      const docRef = doc(db, 'katalog_config', 'partner_store');
      await setDoc(docRef, {
        storeData,
        products,
        categoriesList
      }, { merge: true });
      
      alert('✅ Berhasil Simpan & Sinkronisasi ke Halaman Toko!');
      setActiveTab('preview');
    } catch (err) {
      console.error("Error Detail Firebase:", err);
      alert(`❌ Gagal menyimpan data: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!newProduct.title || !newProduct.url) return;
    const item = { id: Date.now(), ...newProduct };
    setProducts([...products, item]);
    setNewProduct({ title: '', url: '', category: categoriesList[0]?.name || 'Umum', iconColor: 'bg-emerald-500', badge: 'Populer' });
  };

  const handleDeleteProduct = (id) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!newCategoryName) return;
    const newCat = { id: Date.now(), name: newCategoryName.toUpperCase(), count: '0 Produk', color: 'bg-cyan-500' };
    setCategoriesList([...categoriesList, newCat]);
    setNewCategoryName('');
  };

  const handleDeleteCategory = (id) => {
    setCategoriesList(categoriesList.filter(c => c.id !== id));
  };

  // Filter Kategori unik untuk dropdown produk
  const categoryNames = ['Semua', ...categoriesList.map(c => c.name)];

  const filteredProducts = products.filter(p => {
    const matchCat = selectedCategory === 'Semua' || p.category === selectedCategory;
    const matchSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className={`min-h-screen bg-gradient-to-b ${storeData.bgTheme} text-slate-100 flex flex-col font-sans relative overflow-x-hidden pb-24 transition-all duration-500`}>
      {/* Background Ornaments */}
      <div className="fixed top-[-10%] left-[-20%] w-[400px] h-[400px] bg-rose-600/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="fixed top-[40%] right-[-20%] w-[400px] h-[400px] bg-cyan-600/20 rounded-full blur-[100px] pointer-events-none" />

      {/* Top Header Bar ala Partner Mizyan */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#161b22]/90 border-b border-slate-800 px-4 py-3 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-400 to-blue-500 flex items-center justify-center shadow-md">
            <Store className="w-4 h-4 text-slate-950 font-bold" />
          </div>
          <div>
            <h1 className="font-bold text-xs text-white">PENGATURAN TOKO MITRA</h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-slate-900 p-1 rounded-xl border border-slate-800 flex text-xs">
            <button 
              onClick={() => setActiveTab('edit')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${activeTab === 'edit' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400'}`}
            >
              Edit
            </button>
            <button 
              onClick={() => setActiveTab('preview')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${activeTab === 'preview' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400'}`}
            >
              Pratinjau
            </button>
          </div>

          <button 
            onClick={handleSaveData}
            disabled={isSaving}
            className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1 shadow-lg shadow-cyan-500/20 active:scale-95"
          >
            <Save className="w-3.5 h-3.5" /> {isSaving ? '...' : 'SIMPAN'}
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-md mx-auto w-full px-4 pt-4 flex-1">
        
        {/* ================= PANEL EDIT (SUPER LENGKAP & CANGGIH) ================= */}
        {activeTab === 'edit' && (
          <div className="space-y-4 pb-16">
            
            {/* Tombol Utama Simpan Cepat */}
            <button 
              onClick={handleSaveData}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold py-3 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-xl shadow-cyan-500/20"
            >
              <Save className="w-4 h-4" /> SIMPAN & LIHAT HALAMAN TOKO
            </button>

            {/* Profil Hero & Statistik */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
              <h2 className="text-xs font-semibold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                <Store className="w-4 h-4" /> Profil Hero, Komunitas & Statistik
              </h2>
              <div className="space-y-2.5 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <input 
                    type="text"
                    value={storeData.name}
                    onChange={(e) => setStoreData({...storeData, name: e.target.value})}
                    placeholder="Nama Toko"
                    className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                  />
                  <input 
                    type="text"
                    value={storeData.partnerLink}
                    onChange={(e) => setStoreData({...storeData, partnerLink: e.target.value})}
                    placeholder="Link Partner URL"
                    className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input 
                    type="text"
                    value={storeData.digitalProductsLabel}
                    onChange={(e) => setStoreData({...storeData, digitalProductsLabel: e.target.value})}
                    placeholder="Label Produk"
                    className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                  />
                  <input 
                    type="text"
                    value={storeData.recoursesLabel}
                    onChange={(e) => setStoreData({...storeData, recoursesLabel: e.target.value})}
                    placeholder="Label Recourses"
                    className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input 
                    type="text"
                    value={storeData.ideasLabel}
                    onChange={(e) => setStoreData({...storeData, ideasLabel: e.target.value})}
                    placeholder="Label Ideas"
                    className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                  />
                  <input 
                    type="text"
                    value={storeData.communityLink}
                    onChange={(e) => setStoreData({...storeData, communityLink: e.target.value})}
                    placeholder="Link Komunitas WA/Telegram"
                    className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                  />
                </div>
                <input 
                  type="text"
                  value={storeData.logoUrl}
                  onChange={(e) => setStoreData({...storeData, logoUrl: e.target.value})}
                  placeholder="URL Foto/Logo Toko"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                />
                
                {/* Statistik Angka */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <input 
                    type="text"
                    value={storeData.statsProducts}
                    onChange={(e) => setStoreData({...storeData, statsProducts: e.target.value})}
                    placeholder="Jumlah Produk"
                    className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                  />
                  <input 
                    type="text"
                    value={storeData.statsModules}
                    onChange={(e) => setStoreData({...storeData, statsModules: e.target.value})}
                    placeholder="Jumlah Modul"
                    className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                  />
                  <input 
                    type="text"
                    value={storeData.statsUsers}
                    onChange={(e) => setStoreData({...storeData, statsUsers: e.target.value})}
                    placeholder="Jumlah Pengguna"
                    className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                  />
                  <input 
                    type="text"
                    value={storeData.statsRating}
                    onChange={(e) => setStoreData({...storeData, statsRating: e.target.value})}
                    placeholder="Rating Toko"
                    className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                  />
                </div>
              </div>
            </div>

            {/* Kelompok Produk (Kategori) */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                  <Layers className="w-4 h-4" /> Kelompok Produk (Kategori)
                </h2>
              </div>
              
              <form onSubmit={handleAddCategory} className="flex gap-2">
                <input 
                  type="text"
                  placeholder="Nama Kategori Baru..."
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200"
                />
                <button type="submit" className="bg-emerald-500 text-slate-950 font-bold px-3 py-2 rounded-xl text-xs">
                  + Buat
                </button>
              </form>

              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {categoriesList.map((cat) => (
                  <div key={cat.id} className="flex items-center justify-between bg-slate-950 p-2.5 rounded-xl text-xs">
                    <span className="font-bold text-slate-200 truncate">{cat.name}</span>
                    <button 
                      onClick={() => handleDeleteCategory(cat.id)}
                      className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Tambah & Kelola Produk */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
              <h2 className="text-xs font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                <ShoppingBag className="w-4 h-4" /> Tambah & Kelola Koleksi Produk ({products.length})
              </h2>
              <form onSubmit={handleAddProduct} className="space-y-2.5 text-xs">
                <input 
                  type="text"
                  placeholder="Judul Produk..."
                  value={newProduct.title}
                  onChange={(e) => setNewProduct({...newProduct, title: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                />
                <input 
                  type="text"
                  placeholder="Link URL Produk..."
                  value={newProduct.url}
                  onChange={(e) => setNewProduct({...newProduct, url: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                />
                <div className="grid grid-cols-2 gap-2">
                  <select 
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                    className="bg-slate-950 border border-slate-800 rounded-xl px-2 py-2 text-slate-200 text-xs"
                  >
                    {categoriesList.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                  <input 
                    type="text"
                    placeholder="Badge (Hot/New)"
                    value={newProduct.badge}
                    onChange={(e) => setNewProduct({...newProduct, badge: e.target.value})}
                    className="bg-slate-950 border border-slate-800 rounded-xl px-2 py-2 text-slate-200 text-xs"
                  />
                </div>
                <button type="submit" className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md">
                  <Plus className="w-4 h-4" /> Tambah Produk
                </button>
              </form>

              <div className="space-y-2 max-h-48 overflow-y-auto pr-1 pt-2 border-t border-slate-800">
                {products.map((p) => (
                  <div key={p.id} className="flex items-center justify-between bg-slate-950 p-2 rounded-xl text-xs">
                    <div className="min-w-0">
                      <p className="font-bold text-slate-200 truncate">{p.title}</p>
                      <p className="text-[10px] text-slate-400">{p.category}</p>
                    </div>
                    <button onClick={() => handleDeleteProduct(p.id)} className="p-1 rounded-lg bg-rose-500/10 text-rose-400">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ================= PANEL PREVIEW (HALAMAN UTAMA DINAMIS) ================= */}
        {activeTab === 'preview' && (
          <div className="space-y-4">
            
            {/* Header Profil Toko */}
            <div className="bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-slate-800 rounded-3xl p-5 backdrop-blur-xl shadow-2xl flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-500 p-0.5 shadow-xl shrink-0 overflow-hidden">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                  {storeData.logoUrl ? (
                    <img src={storeData.logoUrl} alt="Logo" className="w-full h-full object-cover rounded-[14px]" />
                  ) : (
                    <Store className="w-7 h-7 text-cyan-400" />
                  )}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-extrabold text-white truncate">{storeData.name}</h2>
                <a href={storeData.partnerLink} target="_blank" rel="noreferrer" className="text-[10px] text-cyan-400 flex items-center gap-1 hover:underline truncate">
                  Kunjungi Tautan <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Menu 1: Baca Dulu */}
            {bottomNav === 'baca' && (
              <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 space-y-2 shadow-xl animate-fadeIn">
                <h3 className="text-xs font-bold text-amber-400 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" /> {storeData.bacaSubtitle}
                </h3>
                <h4 className="text-base font-extrabold text-white">{storeData.bacaTitle}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{storeData.bacaContent}</p>
              </div>
            )}

            {/* Menu 2: Materi / Recourses */}
            {bottomNav === 'materi' && (
              <div className="grid grid-cols-2 gap-3 animate-fadeIn">
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-lg">
                  <FileText className="w-6 h-6 text-cyan-400 mb-2" />
                  <h4 className="text-xs font-bold text-slate-200">{storeData.digitalProductsLabel}</h4>
                  <p className="text-[10px] text-slate-400 mt-1">Akses modul pembelajaran utama</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-lg">
                  <TrendingUp className="w-6 h-6 text-rose-400 mb-2" />
                  <h4 className="text-xs font-bold text-slate-200">{storeData.recoursesLabel}</h4>
                  <p className="text-[10px] text-slate-400 mt-1">Panduan strategi digital</p>
                </div>
              </div>
            )}

            {/* Menu 3: Produk Utama */}
            {bottomNav === 'produk' && (
              <>
                {/* Stats Bar */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
                    <div>
                      <p className="text-[11px] text-slate-400">Total Produk</p>
                      <p className="text-xl font-extrabold text-white mt-0.5">{storeData.statsProducts}</p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                      <ShoppingBag className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
                    <div>
                      <p className="text-[11px] text-slate-400">Modul Belajar</p>
                      <p className="text-xl font-extrabold text-white mt-0.5">{storeData.statsModules}</p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center">
                      <BookOpen className="w-5 h-5" />
                    </div>
                  </div>
                </div>

                {/* Search & Filter Kategori ala Referensi */}
                <div className="space-y-3">
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input 
                      type="text"
                      placeholder="Cari produk digital, template, ebook..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div className="flex gap-2 overflow-x-auto pb-1 text-xs">
                    {categoryNames.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-3.5 py-1.5 rounded-xl whitespace-nowrap border transition-all ${
                          selectedCategory === cat 
                            ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400 shadow-lg' 
                            : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-white'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Grid Produk */}
                <div className="grid grid-cols-3 gap-2.5">
                  {filteredProducts.map((p) => (
                    <div 
                      key={p.id}
                      className="bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-2.5 flex flex-col justify-between relative shadow-lg group"
                    >
                      {p.badge && (
                        <span className="absolute top-1.5 right-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-rose-500/20 text-rose-400 border border-rose-500/30">
                          {p.badge}
                        </span>
                      )}
                      <div>
                        <div className={`w-9 h-9 rounded-xl ${p.iconColor || 'bg-cyan-500'} flex items-center justify-center text-slate-950 mb-2 shadow-md`}>
                          <Sparkles className="w-5 h-5" />
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
              </>
            )}

            {/* Tombol Komunitas */}
            <div className="bg-gradient-to-r from-cyan-950/40 to-slate-900 border border-cyan-500/30 rounded-2xl p-4 flex items-center justify-between shadow-xl">
              <div>
                <p className="text-xs font-bold text-cyan-400">Grup Komunitas</p>
                <p className="text-[10px] text-slate-400">Gabung diskusi eksklusif mitra</p>
              </div>
              <a 
                href={storeData.communityLink.startsWith('http') ? storeData.communityLink : `https://wa.me/${storeData.whatsapp || '6281234567890'}`}
                target="_blank"
                rel="noreferrer"
                className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg"
              >
                <MessageCircle className="w-4 h-4" /> Gabung
              </a>
            </div>
          </div>
        )}
      </main>

      {/* Navigasi Bawah */}
      <nav className="fixed bottom-3 left-1/2 -translate-x-1/2 max-w-xs w-[90%] bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-full px-4 py-2 flex items-center justify-around shadow-2xl z-50 text-xs">
        <button 
          onClick={() => { setBottomNav('baca'); setActiveTab('preview'); }}
          className={`flex flex-col items-center gap-1 transition-all ${bottomNav === 'baca' && activeTab === 'preview' ? 'text-cyan-400 scale-105' : 'text-slate-400 hover:text-white'}`}
        >
          <BookOpen className="w-4 h-4" />
          <span className="text-[10px]">Baca Dulu</span>
        </button>
        <button 
          onClick={() => { setBottomNav('materi'); setActiveTab('preview'); }}
          className={`flex flex-col items-center gap-1 transition-all ${bottomNav === 'materi' && activeTab === 'preview' ? 'text-cyan-400 scale-105' : 'text-slate-400 hover:text-white'}`}
        >
          <FileText className="w-4 h-4" />
          <span className="text-[10px]">Materi</span>
        </button>
        <button 
          onClick={() => { setBottomNav('produk'); setActiveTab('preview'); }}
          className={`flex flex-col items-center gap-1 transition-all ${bottomNav === 'produk' && activeTab === 'preview' ? 'text-cyan-400 scale-105' : 'text-slate-400 hover:text-white'}`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span className="text-[10px]">Produk</span>
        </button>
      </nav>
    </div>
  );
}
