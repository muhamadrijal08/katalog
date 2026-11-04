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
  Palette
} from 'lucide-react';
import { db } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export default function Home() {
  const [activeTab, setActiveTab] = useState('preview'); // 'edit' | 'preview'
  const [bottomNav, setBottomNav] = useState('produk'); // 'baca' | 'materi' | 'produk'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [isSaving, setIsSaving] = useState(false);

  // Data Pengaturan Toko & Semua Menu Navigasi
  const [storeData, setStoreData] = useState({
    name: 'Digital Treasury Hub',
    whatsapp: '6281234567890',
    slogan: 'Pusat Aset Digital, Template Canva & E-Book Premium Siap Pakai',
    logoUrl: '',
    bgTheme: 'from-[#0d1117] via-[#161b22] to-[#0d1117]',
    statsProducts: '1000+',
    statsLearners: '500+',
    // Konten Menu 1: Baca Dulu
    bacaTitle: 'Sabar Adalah Kunci Sukses',
    bacaSubtitle: 'ISTIQOMAH & FOKUS',
    bacaContent: 'Perjalanan bisnis digital butuh proses. Terus upgrade ilmu, ikuti arahan mentor, dan iringi dengan ikhtiar terbaik.',
    // Konten Menu 2: Materi
    materi1Title: 'Panduan Mulai',
    materi1Desc: 'Modul e-learning lengkap dasar bisnis',
    materi2Title: 'Tips Promosi',
    materi2Desc: 'Aset promosi siap pakai & strategi cuan'
  });

  // State Input Produk Baru
  const [newProduct, setNewProduct] = useState({
    title: '',
    url: '',
    category: 'Template',
    iconColor: 'bg-emerald-500',
    badge: 'Populer'
  });

  // Data List Produk
  const [products, setProducts] = useState([
    { id: 1, title: '100+ Template Canva IG', category: 'Template', iconColor: 'bg-amber-500', badge: 'Hot', url: '#' },
    { id: 2, title: 'E-Book Panduan Bisnis Digital', category: 'Ebook', iconColor: 'bg-rose-500', badge: 'New', url: '#' },
    { id: 3, title: 'Game Edukasi Interaktif', category: 'Ecourse', iconColor: 'bg-cyan-500', badge: 'Pro', url: '#' },
    { id: 4, title: '500+ Prompt ChatGPT Marketing', category: 'Template', iconColor: 'bg-purple-500', badge: 'Bonus', url: '#' }
  ]);

  // Load Data dari Firestore
  useEffect(() => {
    async function loadData() {
      try {
        const docRef = doc(db, 'katalog_config', 'main_store');
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

  // Simpan Data ke Firestore
  const handleSaveData = async () => {
    setIsSaving(true);
    try {
      const docRef = doc(db, 'katalog_config', 'main_store');
      await setDoc(docRef, {
        storeData,
        products
      }, { merge: true });
      
      alert('✅ Semua pengaturan berhasil disimpan ke Cloud Firebase!');
      setActiveTab('preview');
    } catch (err) {
      console.error("Error Detail Firebase:", err);
      alert(`❌ Gagal menyimpan data: ${err.message || 'Cek izin Firestore Rules'}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Handler Upload Gambar dari Galeri HP/Komputer (Base64)
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setStoreData({ ...storeData, logoUrl: reader.result });
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
    setNewProduct({ title: '', url: '', category: 'Template', iconColor: 'bg-emerald-500', badge: 'Populer' });
  };

  const handleDeleteProduct = (id) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const categories = ['Semua', 'Template', 'Ebook', 'Ecourse'];

  const filteredProducts = products.filter(p => {
    const matchCat = selectedCategory === 'Semua' || p.category === selectedCategory;
    const matchSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className={`min-h-screen bg-gradient-to-b ${storeData.bgTheme} text-slate-100 flex flex-col font-sans relative overflow-x-hidden pb-24 transition-all duration-500`}>
      {/* Background Aurora Ornaments */}
      <div className="fixed top-[-10%] left-[-20%] w-[400px] h-[400px] bg-rose-600/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="fixed top-[40%] right-[-20%] w-[400px] h-[400px] bg-cyan-600/20 rounded-full blur-[100px] pointer-events-none" />

      {/* Top Bar Navigation */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#161b22]/80 border-b border-slate-800/80 px-4 py-3 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-400 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Store className="w-5 h-5 text-slate-950 font-bold" />
          </div>
          <div>
            <h1 className="font-bold text-sm bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              KatalogCraft <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">Ultimate Control</span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-slate-900/90 p-1 rounded-xl border border-slate-800 flex text-xs">
            <button 
              onClick={() => setActiveTab('edit')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${activeTab === 'edit' ? 'bg-emerald-500 text-slate-950 shadow-md font-semibold' : 'text-slate-400 hover:text-white'}`}
            >
              <Edit3 className="w-3.5 h-3.5" /> Edit
            </button>
            <button 
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${activeTab === 'preview' ? 'bg-emerald-500 text-slate-950 shadow-md font-semibold' : 'text-slate-400 hover:text-white'}`}
            >
              <Eye className="w-3.5 h-3.5" /> Preview
            </button>
          </div>

          <button 
            onClick={handleSaveData}
            disabled={isSaving}
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 active:scale-95 disabled:opacity-50"
          >
            <Save className="w-4 h-4" /> {isSaving ? '...' : 'Simpan'}
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-md mx-auto w-full px-4 pt-4 flex-1">
        
        {/* ================= PANEL EDIT ================= */}
        {activeTab === 'edit' && (
          <div className="space-y-4 pb-12">
            
            {/* 1. Identitas & Foto Profil */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 backdrop-blur-md shadow-xl space-y-3">
              <h2 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                <Store className="w-4 h-4" /> 1. Identitas & Foto Profil Toko
              </h2>
              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-400">Nama Toko</label>
                  <input 
                    type="text"
                    value={storeData.name}
                    onChange={(e) => setStoreData({...storeData, name: e.target.value})}
                    className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-slate-400">Foto Profil / Logo (Upload dari HP / Komputer)</label>
                  <div className="flex items-center gap-3 mt-1">
                    <label className="cursor-pointer bg-slate-800 hover:bg-slate-700 border border-slate-700 text-emerald-400 px-3 py-2 rounded-xl text-xs flex items-center gap-2 transition-all">
                      <Upload className="w-4 h-4" /> Pilih File Gambar
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                    {storeData.logoUrl && <span className="text-[10px] text-emerald-400">✔ Gambar Dimuat</span>}
                  </div>
                </div>
                <div>
                  <label className="text-slate-400">Atau Gunakan URL Gambar</label>
                  <input 
                    type="text"
                    placeholder="https://..."
                    value={storeData.logoUrl}
                    onChange={(e) => setStoreData({...storeData, logoUrl: e.target.value})}
                    className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-slate-400">Nomor WhatsApp (Format: 628xxx)</label>
                  <input 
                    type="text"
                    value={storeData.whatsapp}
                    onChange={(e) => setStoreData({...storeData, whatsapp: e.target.value})}
                    className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-slate-400">Slogan / Deskripsi Toko</label>
                  <textarea 
                    value={storeData.slogan}
                    onChange={(e) => setStoreData({...storeData, slogan: e.target.value})}
                    className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                    rows={2}
                  />
                </div>
              </div>
            </div>

            {/* 2. Pengaturan Tema & Background */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 backdrop-blur-md shadow-xl space-y-3">
              <h2 className="text-xs font-semibold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                <Palette className="w-4 h-4" /> 2. Pengaturan Background & Tema
              </h2>
              <div className="space-y-2 text-xs">
                <label className="text-slate-400">Pilih Nuansa Background</label>
                <select 
                  value={storeData.bgTheme}
                  onChange={(e) => setStoreData({...storeData, bgTheme: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  <option value="from-[#0d1117] via-[#161b22] to-[#0d1117]">Dark Obsidian (Default)</option>
                  <option value="from-slate-950 via-indigo-950 to-slate-950">Deep Indigo / Midnight</option>
                  <option value="from-slate-950 via-emerald-950 to-slate-950">Emerald Forest</option>
                  <option value="from-slate-950 via-rose-950 to-slate-950">Sunset Rose</option>
                </select>
              </div>
            </div>

            {/* 3. Kustomisasi Menu 1: Baca Dulu */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 backdrop-blur-md shadow-xl space-y-3">
              <h2 className="text-xs font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                <BookOpen className="w-4 h-4" /> 3. Edit Menu "Baca Dulu"
              </h2>
              <div className="space-y-2 text-xs">
                <div>
                  <label className="text-slate-400">Judul Kecil (Badge)</label>
                  <input 
                    type="text"
                    value={storeData.bacaSubtitle}
                    onChange={(e) => setStoreData({...storeData, bacaSubtitle: e.target.value})}
                    className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                  />
                </div>
                <div>
                  <label className="text-slate-400">Judul Utama</label>
                  <input 
                    type="text"
                    value={storeData.bacaTitle}
                    onChange={(e) => setStoreData({...storeData, bacaTitle: e.target.value})}
                    className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                  />
                </div>
                <div>
                  <label className="text-slate-400">Isi Pesan / Konten</label>
                  <textarea 
                    value={storeData.bacaContent}
                    onChange={(e) => setStoreData({...storeData, bacaContent: e.target.value})}
                    className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                    rows={3}
                  />
                </div>
              </div>
            </div>

            {/* 4. Kustomisasi Menu 2: Materi */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 backdrop-blur-md shadow-xl space-y-3">
              <h2 className="text-xs font-semibold text-purple-400 uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-4 h-4" /> 4. Edit Menu "Materi"
              </h2>
              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-slate-400">Card 1 Judul</label>
                    <input 
                      type="text"
                      value={storeData.materi1Title}
                      onChange={(e) => setStoreData({...storeData, materi1Title: e.target.value})}
                      className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-2 py-2 text-slate-200"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400">Card 1 Desc</label>
                    <input 
                      type="text"
                      value={storeData.materi1Desc}
                      onChange={(e) => setStoreData({...storeData, materi1Desc: e.target.value})}
                      className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-2 py-2 text-slate-200"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-slate-400">Card 2 Judul</label>
                    <input 
                      type="text"
                      value={storeData.materi2Title}
                      onChange={(e) => setStoreData({...storeData, materi2Title: e.target.value})}
                      className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-2 py-2 text-slate-200"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400">Card 2 Desc</label>
                    <input 
                      type="text"
                      value={storeData.materi2Desc}
                      onChange={(e) => setStoreData({...storeData, materi2Desc: e.target.value})}
                      className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-2 py-2 text-slate-200"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
                  <div>
                    <label className="text-slate-400">Statistik Produk</label>
                    <input 
                      type="text"
                      value={storeData.statsProducts}
                      onChange={(e) => setStoreData({...storeData, statsProducts: e.target.value})}
                      className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-2 py-2 text-slate-200"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400">Statistik Materi</label>
                    <input 
                      type="text"
                      value={storeData.statsLearners}
                      onChange={(e) => setStoreData({...storeData, statsLearners: e.target.value})}
                      className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-2 py-2 text-slate-200"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 5. Kustomisasi Menu 3: Produk */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 backdrop-blur-md shadow-xl space-y-3">
              <h2 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                <ShoppingBag className="w-4 h-4" /> 5. Edit Menu "Produk" (Katalog)
              </h2>
              <form onSubmit={handleAddProduct} className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-400">Judul Produk</label>
                  <input 
                    type="text"
                    placeholder="Contoh: 100+ Template Canva"
                    value={newProduct.title}
                    onChange={(e) => setNewProduct({...newProduct, title: e.target.value})}
                    className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                  />
                </div>
                <div>
                  <label className="text-slate-400">Link URL Tujuan</label>
                  <input 
                    type="text"
                    placeholder="https://..."
                    value={newProduct.url}
                    onChange={(e) => setNewProduct({...newProduct, url: e.target.value})}
                    className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-slate-400">Kategori</label>
                    <select 
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                      className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-2 py-2 text-slate-200"
                    >
                      <option value="Template">Template</option>
                      <option value="Ebook">Ebook</option>
                      <option value="Ecourse">Ecourse</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-slate-400">Warna Ikon</label>
                    <select 
                      value={newProduct.iconColor}
                      onChange={(e) => setNewProduct({...newProduct, iconColor: e.target.value})}
                      className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-2 py-2 text-slate-200"
                    >
                      <option value="bg-emerald-500">Hijau</option>
                      <option value="bg-amber-500">Kuning</option>
                      <option value="bg-rose-500">Merah</option>
                      <option value="bg-cyan-500">Biru</option>
                      <option value="bg-purple-500">Ungu</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-slate-400">Badge</label>
                    <input 
                      type="text"
                      placeholder="Hot/New"
                      value={newProduct.badge}
                      onChange={(e) => setNewProduct({...newProduct, badge: e.target.value})}
                      className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-2 py-2 text-slate-200"
                    />
                  </div>
                </div>
                <button 
                  type="submit"
                  className="w-full mt-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg"
                >
                  <Plus className="w-4 h-4" /> Tambah Produk ke Katalog
                </button>
              </form>

              {/* List Produk Aktif */}
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1 pt-2 border-t border-slate-800">
                {products.map((p) => (
                  <div key={p.id} className="flex items-center justify-between bg-slate-950 p-2 rounded-xl text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className={`w-6 h-6 rounded-lg ${p.iconColor} flex items-center justify-center text-slate-950 shrink-0`}>
                        <Sparkles className="w-3 h-3" />
                      </div>
                      <p className="font-bold text-slate-200 truncate">{p.title}</p>
                    </div>
                    <button 
                      onClick={() => handleDeleteProduct(p.id)}
                      className="p-1 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ================= PANEL PREVIEW ================= */}
        {activeTab === 'preview' && (
          <div className="space-y-4">
            {/* Header Profil Toko */}
            <div className="bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-slate-800 rounded-3xl p-5 backdrop-blur-xl shadow-2xl flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-rose-500 via-purple-500 to-cyan-500 p-0.5 shadow-xl shrink-0 overflow-hidden">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                  {storeData.logoUrl ? (
                    <img src={storeData.logoUrl} alt="Logo Toko" className="w-full h-full object-cover rounded-[14px]" />
                  ) : (
                    <Store className="w-7 h-7 text-emerald-400" />
                  )}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-extrabold text-white truncate">{storeData.name}</h2>
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 mt-0.5">{storeData.slogan}</p>
              </div>
            </div>

            {/* KONTEN MENU 1: BACA DULU */}
            {bottomNav === 'baca' && (
              <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 space-y-2 shadow-xl animate-fadeIn">
                <h3 className="text-xs font-bold text-amber-400 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" /> {storeData.bacaSubtitle}
                </h3>
                <h4 className="text-base font-extrabold text-white">{storeData.bacaTitle}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {storeData.bacaContent}
                </p>
              </div>
            )}

            {/* KONTEN MENU 2: MATERI */}
            {bottomNav === 'materi' && (
              <div className="grid grid-cols-2 gap-3 animate-fadeIn">
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-lg">
                  <FileText className="w-6 h-6 text-cyan-400 mb-2" />
                  <h4 className="text-xs font-bold text-slate-200">{storeData.materi1Title}</h4>
                  <p className="text-[10px] text-slate-400 mt-1">{storeData.materi1Desc}</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-lg">
                  <TrendingUp className="w-6 h-6 text-rose-400 mb-2" />
                  <h4 className="text-xs font-bold text-slate-200">{storeData.materi2Title}</h4>
                  <p className="text-[10px] text-slate-400 mt-1">{storeData.materi2Desc}</p>
                </div>
              </div>
            )}

            {/* KONTEN MENU 3: PRODUK */}
            {bottomNav === 'produk' && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
                    <div>
                      <p className="text-[11px] text-slate-400">Produk Digital</p>
                      <p className="text-xl font-extrabold text-white mt-0.5">{storeData.statsProducts}</p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                      <ShoppingBag className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
                    <div>
                      <p className="text-[11px] text-slate-400">Materi Belajar</p>
                      <p className="text-xl font-extrabold text-white mt-0.5">{storeData.statsLearners}</p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center">
                      <BookOpen className="w-5 h-5" />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input 
                      type="text"
                      placeholder="Cari template, ebook, ecourse..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div className="flex gap-2 overflow-x-auto pb-1 text-xs">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-3.5 py-1.5 rounded-xl whitespace-nowrap border transition-all ${
                          selectedCategory === cat 
                            ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 font-bold border-cyan-400 shadow-lg' 
                            : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-white'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

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
                        <div className={`w-9 h-9 rounded-xl ${p.iconColor || 'bg-emerald-500'} flex items-center justify-center text-slate-950 mb-2 shadow-md`}>
                          <Sparkles className="w-5 h-5" />
                        </div>
                        <h4 className="text-[11px] font-bold text-slate-200 line-clamp-2">{p.title}</h4>
                      </div>
                      <a 
                        href={p.url || '#'}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-3 w-full py-1.5 rounded-xl bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-emerald-400 text-[10px] font-bold text-center block border border-slate-700 transition-all"
                      >
                        LIHAT
                      </a>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* WhatsApp CTA */}
            <div className="bg-gradient-to-r from-emerald-950/40 to-slate-900 border border-emerald-500/30 rounded-2xl p-4 flex items-center justify-between shadow-xl">
              <div>
                <p className="text-xs font-bold text-emerald-400">Punya Pertanyaan?</p>
                <p className="text-[10px] text-slate-400">Chat langsung via WhatsApp</p>
              </div>
              <a 
                href={`https://wa.me/${storeData.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg"
              >
                <MessageCircle className="w-4 h-4" /> Hubungi
              </a>
            </div>
          </div>
        )}
      </main>

      {/* Floating Bottom Navigation Bar */}
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
