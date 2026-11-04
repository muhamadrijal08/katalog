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
    bacaTitle: 'Sabar Adalah Kunci Sukses',
    bacaSubtitle: 'ISTIQOMAH & FOKUS',
    bacaContent: 'Perjalanan bisnis digital butuh proses. Terus upgrade ilmu, ikuti arahan mentor, dan iringi dengan ikhtiar terbaik.',
    materi1Title: 'Panduan Mulai',
    materi1Desc: 'Modul e-learning lengkap dasar bisnis',
    materi2Title: 'Tips Promosi',
    materi2Desc: 'Aset promosi siap pakai & strategi cuan'
  });

  const [newProduct, setNewProduct] = useState({
    title: '',
    url: '',
    category: 'Template',
    iconColor: 'bg-emerald-500',
    badge: 'Populer'
  });

  const [products, setProducts] = useState([
    { id: 1, title: '100+ Template Canva IG', category: 'Template', iconColor: 'bg-amber-500', badge: 'Hot', url: '#' },
    { id: 2, title: 'E-Book Panduan Bisnis Digital', category: 'Ebook', iconColor: 'bg-rose-500', badge: 'New', url: '#' },
    { id: 3, title: 'Game Edukasi Interaktif', category: 'Ecourse', iconColor: 'bg-cyan-500', badge: 'Pro', url: '#' },
    { id: 4, title: '500+ Prompt ChatGPT Marketing', category: 'Template', iconColor: 'bg-purple-500', badge: 'Bonus', url: '#' }
  ]);

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
    <div className={`min-h-screen bg-gradient-to-b ${storeData.bgTheme} text-slate-100 flex flex-col font-sans relative overflow-x-hidden pb-28 transition-all duration-500`}>
      <div className="fixed top-[-10%] left-[-20%] w-[500px] h-[500px] bg-rose-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed top-[40%] right-[-20%] w-[500px] h-[500px] bg-cyan-600/15 rounded-full blur-[120px] pointer-events-none" />

      {/* Header Utama diperlebar agar proporsional di desktop */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#161b22]/90 border-b border-slate-800/80 px-6 py-4 flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-400 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Store className="w-5 h-5 text-slate-950 font-bold" />
          </div>
          <div>
            <h1 className="font-extrabold text-base bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              KatalogCraft <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">Ultimate Control</span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-900/90 p-1 rounded-xl border border-slate-800 flex text-xs">
            <button 
              onClick={() => setActiveTab('edit')}
              className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${activeTab === 'edit' ? 'bg-emerald-500 text-slate-950 shadow-md font-semibold' : 'text-slate-400 hover:text-white'}`}
            >
              <Edit3 className="w-4 h-4" /> Edit
            </button>
            <button 
              onClick={() => setActiveTab('preview')}
              className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${activeTab === 'preview' ? 'bg-emerald-500 text-slate-950 shadow-md font-semibold' : 'text-slate-400 hover:text-white'}`}
            >
              <Eye className="w-4 h-4" /> Preview
            </button>
          </div>

          <button 
            onClick={handleSaveData}
            disabled={isSaving}
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95 disabled:opacity-50"
          >
            <Save className="w-4 h-4" /> {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </div>
      </header>

      {/* Lebar Container ditingkatkan ke max-w-3xl agar pas dan tidak kekecilan di layar 100% */}
      <main className="max-w-3xl mx-auto w-full px-6 pt-6 flex-1">
        
        {activeTab === 'edit' && (
          <div className="space-y-6 pb-12">
            
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 backdrop-blur-md shadow-xl space-y-4">
              <h2 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                <Store className="w-4 h-4" /> 1. Identitas & Foto Profil Toko
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="text-slate-400 font-medium">Nama Toko</label>
                  <input 
                    type="text"
                    value={storeData.name}
                    onChange={(e) => setStoreData({...storeData, name: e.target.value})}
                    className="w-full mt-1.5 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-emerald-500 text-sm"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-medium">Nomor WhatsApp (Format: 628xxx)</label>
                  <input 
                    type="text"
                    value={storeData.whatsapp}
                    onChange={(e) => setStoreData({...storeData, whatsapp: e.target.value})}
                    className="w-full mt-1.5 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-emerald-500 text-sm"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-slate-400 font-medium">Foto Profil / Logo (Upload Kompres Otomatis)</label>
                  <div className="flex items-center gap-3 mt-1.5">
                    <label className="cursor-pointer bg-slate-800 hover:bg-slate-700 border border-slate-700 text-emerald-400 px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all">
                      <Upload className="w-4 h-4" /> Pilih File Gambar
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                    {storeData.logoUrl && <span className="text-xs text-emerald-400">✔ Gambar Logo Berhasil Dimuat</span>}
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="text-slate-400 font-medium">Atau Gunakan URL Gambar</label>
                  <input 
                    type="text"
                    placeholder="https://..."
                    value={storeData.logoUrl}
                    onChange={(e) => setStoreData({...storeData, logoUrl: e.target.value})}
                    className="w-full mt-1.5 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-emerald-500 text-sm"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-slate-400 font-medium">Slogan / Deskripsi Toko</label>
                  <textarea 
                    value={storeData.slogan}
                    onChange={(e) => setStoreData({...storeData, slogan: e.target.value})}
                    className="w-full mt-1.5 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-emerald-500 text-sm"
                    rows={2}
                  />
                </div>
              </div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 backdrop-blur-md shadow-xl space-y-4">
              <h2 className="text-sm font-semibold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                <Palette className="w-4 h-4" /> 2. Pengaturan Background & Tema
              </h2>
              <div className="space-y-2 text-xs">
                <label className="text-slate-400 font-medium">Pilih Nuansa Background</label>
                <select 
                  value={storeData.bgTheme}
                  onChange={(e) => setStoreData({...storeData, bgTheme: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-cyan-500 text-sm"
                >
                  <option value="from-[#0d1117] via-[#161b22] to-[#0d1117]">Dark Obsidian (Default)</option>
                  <option value="from-slate-950 via-indigo-950 to-slate-950">Deep Indigo / Midnight</option>
                  <option value="from-slate-950 via-emerald-950 to-slate-950">Emerald Forest</option>
                  <option value="from-slate-950 via-rose-950 to-slate-950">Sunset Rose</option>
                </select>
              </div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 backdrop-blur-md shadow-xl space-y-4">
              <h2 className="text-sm font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                <BookOpen className="w-4 h-4" /> 3. Edit Menu "Baca Dulu"
              </h2>
              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-400 font-medium">Judul Kecil (Badge)</label>
                    <input 
                      type="text"
                      value={storeData.bacaSubtitle}
                      onChange={(e) => setStoreData({...storeData, bacaSubtitle: e.target.value})}
                      className="w-full mt-1.5 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-200 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 font-medium">Judul Utama</label>
                    <input 
                      type="text"
                      value={storeData.bacaTitle}
                      onChange={(e) => setStoreData({...storeData, bacaTitle: e.target.value})}
                      className="w-full mt-1.5 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-200 text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-slate-400 font-medium">Isi Pesan / Konten</label>
                  <textarea 
                    value={storeData.bacaContent}
                    onChange={(e) => setStoreData({...storeData, bacaContent: e.target.value})}
                    className="w-full mt-1.5 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-200 text-sm"
                    rows={3}
                  />
                </div>
              </div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 backdrop-blur-md shadow-xl space-y-4">
              <h2 className="text-sm font-semibold text-purple-400 uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-4 h-4" /> 4. Edit Menu "Materi" & Statistik
              </h2>
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 p-3 bg-slate-950/50 rounded-xl border border-slate-800">
                    <p className="font-semibold text-cyan-400">Card 1 Materi</p>
                    <input type="text" value={storeData.materi1Title} onChange={(e) => setStoreData({...storeData, materi1Title: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 text-xs" placeholder="Judul" />
                    <input type="text" value={storeData.materi1Desc} onChange={(e) => setStoreData({...storeData, materi1Desc: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 text-xs" placeholder="Deskripsi" />
                  </div>
                  <div className="space-y-2 p-3 bg-slate-950/50 rounded-xl border border-slate-800">
                    <p className="font-semibold text-rose-400">Card 2 Materi</p>
                    <input type="text" value={storeData.materi2Title} onChange={(e) => setStoreData({...storeData, materi2Title: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 text-xs" placeholder="Judul" />
                    <input type="text" value={storeData.materi2Desc} onChange={(e) => setStoreData({...storeData, materi2Desc: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 text-xs" placeholder="Deskripsi" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-800">
                  <div>
                    <label className="text-slate-400 font-medium">Statistik Produk</label>
                    <input type="text" value={storeData.statsProducts} onChange={(e) => setStoreData({...storeData, statsProducts: e.target.value})} className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 text-sm" />
                  </div>
                  <div>
                    <label className="text-slate-400 font-medium">Statistik Materi</label>
                    <input type="text" value={storeData.statsLearners} onChange={(e) => setStoreData({...storeData, statsLearners: e.target.value})} className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 text-sm" />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 backdrop-blur-md shadow-xl space-y-4">
              <h2 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                <ShoppingBag className="w-4 h-4" /> 5. Kelola Katalog Produk
              </h2>
              <form onSubmit={handleAddProduct} className="space-y-3 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-400 font-medium">Judul Produk</label>
                    <input type="text" placeholder="Contoh: 100+ Template Canva" value={newProduct.title} onChange={(e) => setNewProduct({...newProduct, title: e.target.value})} className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-200 text-sm" />
                  </div>
                  <div>
                    <label className="text-slate-400 font-medium">Link URL Tujuan</label>
                    <input type="text" placeholder="https://..." value={newProduct.url} onChange={(e) => setNewProduct({...newProduct, url: e.target.value})} className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-200 text-sm" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-slate-400 font-medium">Kategori</label>
                    <select value={newProduct.category} onChange={(e) => setNewProduct({...newProduct, category: e.target.value})} className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-200 text-sm">
                      <option value="Template">Template</option>
                      <option value="Ebook">Ebook</option>
                      <option value="Ecourse">Ecourse</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-slate-400 font-medium">Warna Ikon</label>
                    <select value={newProduct.iconColor} onChange={(e) => setNewProduct({...newProduct, iconColor: e.target.value})} className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-200 text-sm">
                      <option value="bg-emerald-500">Hijau</option>
                      <option value="bg-amber-500">Kuning</option>
                      <option value="bg-rose-500">Merah</option>
                      <option value="bg-cyan-500">Biru</option>
                      <option value="bg-purple-500">Ungu</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-slate-400 font-medium">Badge</label>
                    <input type="text" placeholder="Hot/New" value={newProduct.badge} onChange={(e) => setNewProduct({...newProduct, badge: e.target.value})} className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-200 text-sm" />
                  </div>
                </div>
                <button type="submit" className="w-full mt-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3 rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg">
                  <Plus className="w-4 h-4" /> Tambah Produk ke Katalog
                </button>
              </form>

              <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1 pt-3 border-t border-slate-800">
                {products.map((p) => (
                  <div key={p.id} className="flex items-center justify-between bg-slate-950 p-3 rounded-xl text-xs">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-7 h-7 rounded-lg ${p.iconColor} flex items-center justify-center text-slate-950 shrink-0`}>
                        <Sparkles className="w-3.5 h-3.5" />
                      </div>
                      <p className="font-bold text-slate-200 text-sm truncate">{p.title}</p>
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

        {activeTab === 'preview' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl shadow-2xl flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-rose-500 via-purple-500 to-cyan-500 p-0.5 shadow-xl shrink-0 overflow-hidden">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                  {storeData.logoUrl ? (
                    <img src={storeData.logoUrl} alt="Logo Toko" className="w-full h-full object-cover rounded-[14px]" />
                  ) : (
                    <Store className="w-8 h-8 text-emerald-400" />
                  )}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-extrabold text-white truncate">{storeData.name}</h2>
                <p className="text-sm text-slate-400 leading-relaxed line-clamp-2 mt-1">{storeData.slogan}</p>
              </div>
            </div>

            {bottomNav === 'baca' && (
              <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-3 shadow-xl animate-fadeIn">
                <h3 className="text-xs font-bold text-amber-400 flex items-center gap-2 tracking-wide uppercase">
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
                  <TrendingUp className="w-7 h-7 text-rose-400 mb-3" />
                  <h4 className="text-sm font-bold text-slate-200">{storeData.materi2Title}</h4>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{storeData.materi2Desc}</p>
                </div>
              </div>
            )}

            {bottomNav === 'produk' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-400 font-medium">Produk Digital</p>
                      <p className="text-2xl font-extrabold text-white mt-1">{storeData.statsProducts}</p>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                      <ShoppingBag className="w-6 h-6" />
                    </div>
                  </div>
                  <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-400 font-medium">Materi Belajar</p>
                      <p className="text-2xl font-extrabold text-white mt-1">{storeData.statsLearners}</p>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center">
                      <BookOpen className="w-6 h-6" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="relative">
                    <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
                    <input 
                      type="text"
                      placeholder="Cari template, ebook, ecourse..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-12 pr-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div className="flex gap-2 overflow-x-auto pb-1 text-sm">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-4 py-2 rounded-xl whitespace-nowrap border transition-all ${
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

                {/* Grid produk diperlebar menjadi 3 atau 4 kolom agar pas di layar desktop */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {filteredProducts.map((p) => (
                    <div 
                      key={p.id}
                      className="bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between relative shadow-xl group hover:border-slate-700 transition-all"
                    >
                      {p.badge && (
                        <span className="absolute top-2.5 right-2.5 text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-400 border border-rose-500/30">
                          {p.badge}
                        </span>
                      )}
                      <div>
                        <div className={`w-10 h-10 rounded-xl ${p.iconColor || 'bg-emerald-500'} flex items-center justify-center text-slate-950 mb-3 shadow-md`}>
                          <Sparkles className="w-5 h-5" />
                        </div>
                        <h4 className="text-xs font-bold text-slate-200 line-clamp-2 leading-relaxed">{p.title}</h4>
                      </div>
                      <a 
                        href={p.url || '#'}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-4 w-full py-2 rounded-xl bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-emerald-400 text-xs font-bold text-center block border border-slate-700 transition-all shadow"
                      >
                        LIHAT PRODUK
                      </a>
                    </div>
                  ))}
                </div>
              </>
            )}

            <div className="bg-gradient-to-r from-emerald-950/40 to-slate-900 border border-emerald-500/30 rounded-2xl p-5 flex items-center justify-between shadow-xl mt-6">
              <div>
                <p className="text-sm font-bold text-emerald-400">Punya Pertanyaan?</p>
                <p className="text-xs text-slate-400 mt-0.5">Chat langsung via WhatsApp mentor</p>
              </div>
              <a 
                href={`https://wa.me/${storeData.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg"
              >
                <MessageCircle className="w-4 h-4" /> Hubungi
              </a>
            </div>
          </div>
        )}
      </main>

      {/* Navigasi Bawah disesuaikan ukurannya agar proporsional */}
      <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 max-w-sm w-[90%] bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-full px-6 py-3 flex items-center justify-around shadow-2xl z-50 text-xs">
        <button 
          onClick={() => { setBottomNav('baca'); setActiveTab('preview'); }}
          className={`flex flex-col items-center gap-1 transition-all ${bottomNav === 'baca' && activeTab === 'preview' ? 'text-cyan-400 scale-105' : 'text-slate-400 hover:text-white'}`}
        >
          <BookOpen className="w-5 h-5" />
          <span className="text-[11px]">Baca Dulu</span>
        </button>
        <button 
          onClick={() => { setBottomNav('materi'); setActiveTab('preview'); }}
          className={`flex flex-col items-center gap-1 transition-all ${bottomNav === 'materi' && activeTab === 'preview' ? 'text-cyan-400 scale-105' : 'text-slate-400 hover:text-white'}`}
        >
          <FileText className="w-5 h-5" />
          <span className="text-[11px]">Materi</span>
        </button>
        <button 
          onClick={() => { setBottomNav('produk'); setActiveTab('preview'); }}
          className={`flex flex-col items-center gap-1 transition-all ${bottomNav === 'produk' && activeTab === 'preview' ? 'text-cyan-400 scale-105' : 'text-slate-400 hover:text-white'}`}
        >
          <ShoppingBag className="w-5 h-5" />
          <span className="text-[11px]">Produk</span>
        </button>
      </nav>
    </div>
  );
}
