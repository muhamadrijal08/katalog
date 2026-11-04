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
    <div className={`min-h-screen bg-gradient-to-b ${storeData.bgTheme} text-slate-100 flex flex-col font-sans relative overflow-x-hidden pb-24 transition-all duration-500`}>
      <div className="fixed top-[-10%] left-[-20%] w-[400px] h-[400px] bg-rose-600/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="fixed top-[40%] right-[-20%] w-[400px] h-[400px] bg-cyan-600/20 rounded-full blur-[100px] pointer-events-none" />

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
            className="bg-
