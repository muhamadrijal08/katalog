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

  // Data Pengaturan Toko
  const [storeData, setStoreData] = useState({
    name: 'Digital Treasury',
    whatsapp: '6281533331953',
    slogan: 'Pusat Aset Digital, Template Canva, E-Book Premium & Modul Edukasi',
    logoUrl: 'https://lh3.googleusercontent.com/u/0/d/1EsBwFRqDXW_HGSgtiYtMXwCl7Q45z2JC',
    bgTheme: 'from-[#0d1117] via-[#161b22] to-[#0d1117]',
    statsProducts: '1000+',
    statsLearners: '29+',
    bacaTitle: 'Sabar Adalah Kunci Sukses',
    bacaSubtitle: 'ISTIQOMAH & FOKUS',
    bacaContent: 'Perjalanan bisnis digital butuh proses. Terus upgrade ilmu, ikuti arahan mentor, dan iringi dengan ikhtiar terbaik.',
    materi1Title: 'Materi Belajar',
    materi1Desc: 'Modul e-learning lengkap bisnis digital',
    materi2Title: 'Cover & Banner Promosi',
    materi2Desc: 'Aset promosi siap pakai & strategi cuan'
  });

  const [newProduct, setNewProduct] = useState({
    title: '',
    url: '',
    category: 'Template',
    iconColor: 'bg-emerald-500',
    badge: 'Populer'
  });

  // DATA SEMUA PRODUK ASLI DARI DIGITAL TREASURY
  const initialProducts = [
    // ISLAMI
    { id: 101, title: 'Tasbih Digital', category: 'Islami', iconColor: 'bg-emerald-500', badge: 'Islami', url: 'https://sites.google.com/view/tasbih-mizyan/home' },
    { id: 102, title: 'Waktu Sholat', category: 'Islami', iconColor: 'bg-emerald-500', badge: 'Islami', url: 'https://equran.id/shalat' },
    { id: 103, title: 'Arah Kiblat', category: 'Islami', iconColor: 'bg-emerald-500', badge: 'Islami', url: 'https://qiblafinder.withgoogle.com/intl/ms/desktop' },
    { id: 104, title: 'Dzikir Pagi Petang', category: 'Islami', iconColor: 'bg-emerald-500', badge: 'Islami', url: 'https://sites.google.com/view/produkdigitaltemaislami/kumpulan-dzikir-pagi-dan-petang' },
    { id: 105, title: 'Adab Islam', category: 'Islami', iconColor: 'bg-emerald-500', badge: 'Islami', url: 'https://sites.google.com/view/produkdigitaltemaislami/adab-dalam-islam' },
    { id: 106, title: 'Amalan Rezeki', category: 'Islami', iconColor: 'bg-emerald-500', badge: 'Islami', url: 'https://sites.google.com/view/produkdigitaltemaislami/amalan-pembuka-rezeki' },
    { id: 107, title: 'Doa Harian', category: 'Islami', iconColor: 'bg-emerald-500', badge: 'Islami', url: 'https://equran.id/doa' },
    { id: 108, title: 'Kisah Nabi', category: 'Islami', iconColor: 'bg-emerald-500', badge: 'Islami', url: 'https://sites.google.com/view/kisah-nabi/home' },
    { id: 109, title: 'Tulis Al-Quran', category: 'Islami', iconColor: 'bg-emerald-500', badge: 'Islami', url: 'https://sites.google.com/view/mizyan-tulis-quran/home' },
    { id: 110, title: 'Ebook Tajwid', category: 'Ebook', iconColor: 'bg-rose-500', badge: 'Hot', url: 'https://drive.google.com/file/d/1EFXRmfKhrGReJ4uj9HtQxIu1mX2pxMHl/view?usp=drivesdk' },
    { id: 111, title: 'Hafalan Quran', category: 'Islami', iconColor: 'bg-emerald-500', badge: 'Islami', url: 'https://sites.google.com/view/mizyan-hafalan-surah/home' },
    { id: 112, title: 'Tebak Ayat', category: 'Game', iconColor: 'bg-cyan-500', badge: 'Game', url: 'https://sites.google.com/view/mizyan-tebak-ayat/home' },
    { id: 113, title: 'Planner Murojaah', category: 'Template', iconColor: 'bg-amber-500', badge: 'Planner', url: 'https://sites.google.com/view/hafizplanner/home' },

    // PRODUK ANAK-ANAK
    { id: 201, title: 'Video Edukasi Anak', category: 'Ecourse', iconColor: 'bg-cyan-500', badge: 'Video', url: 'https://drive.google.com/drive/folders/1Rf2aXQuhSy20wbutc08tjyiRgfzJPpzL' },
    { id: 202, title: 'Worksheet Anak', category: 'Worksheet', iconColor: 'bg-purple-500', badge: 'Edukasi', url: 'https://www.digitalprodukno1seindonesia.my.id/worksheet' },
    { id: 203, title: 'Flash Card Interaktif', category: 'Worksheet', iconColor: 'bg-purple-500', badge: 'Anak', url: 'https://www.digitalprodukno1seindonesia.my.id/flash-card' },
    { id: 204, title: 'Quiz Anak SD', category: 'Game', iconColor: 'bg-cyan-500', badge: 'Quiz', url: 'https://www.digitalprodukno1seindonesia.my.id/quiz' },
    { id: 205, title: 'Ebook Cerita Anak', category: 'Ebook', iconColor: 'bg-rose-500', badge: 'Cerita', url: 'https://sites.google.com/view/ebook-cerita-hewan/home' },
    { id: 206, title: '39K Printable Anak', category: 'Worksheet', iconColor: 'bg-purple-500', badge: 'Print', url: 'https://drive.google.com/drive/folders/1xsQ7LMcDhzeIsjdnAJ3XbKW8IO72G8ue' },

    // GAME
    { id: 301, title: 'Game Asah Otak', category: 'Game', iconColor: 'bg-cyan-500', badge: 'Game', url: 'https://www.digitalprodukno1seindonesia.my.id/game-edukasi' },
    { id: 302, title: 'Quiz Islami Cilik', category: 'Game', iconColor: 'bg-cyan-500', badge: 'Game', url: 'https://sites.google.com/view/game-islami-cilik/home' },
    { id: 303, title: 'Quiz Matematika (MTK)', category: 'Game', iconColor: 'bg-cyan-500', badge: 'Game', url: 'https://sites.google.com/view/game-edukasi-islami-mizyan/home' },
    { id: 304, title: 'Game Cerdas Cermat', category: 'Game', iconColor: 'bg-cyan-500', badge: 'Game', url: 'https://sites.google.com/view/game-cerdas-cermat/home' },
    { id: 305, title: 'Quiz PAI & Sains', category: 'Game', iconColor: 'bg-cyan-500', badge: 'Game', url: 'https://sites.google.com/view/game-sains/home' },
    { id: 306, title: 'Game Ular Tangga', category: 'Game', iconColor: 'bg-cyan-500', badge: 'Game', url: 'https://sites.google.com/view/game-ular-tanggaa/home' },
    { id: 307, title: 'Game Bounce Nokia', category: 'Game', iconColor: 'bg-cyan-500', badge: 'Retro', url: 'https://sites.google.com/view/gamebounce/home' },
    { id: 308, title: 'Game Tangkap Hewan', category: 'Game', iconColor: 'bg-cyan-500', badge: 'Game', url: 'https://sites.google.com/view/tankap-hewan/home' },
    { id: 309, title: 'Puzzle Hewan', category: 'Game', iconColor: 'bg-cyan-500', badge: 'Game', url: 'https://sites.google.com/view/puzzle-mizyan/home' },
    { id: 310, title: 'Tetris Mobile 3D', category: 'Game', iconColor: 'bg-cyan-500', badge: 'Game', url: 'https://sites.google.com/view/tetris-3d/home' },
    { id: 311, title: 'Game Balap Mobil', category: 'Game', iconColor: 'bg-cyan-500', badge: 'Game', url: 'https://sites.google.com/view/game-race/home' },
    { id: 312, title: 'Super Mario Remake', category: 'Game', iconColor: 'bg-cyan-500', badge: 'Game', url: 'https://sites.google.com/view/mario-bros-remake/home' },
    { id: 313, title: 'Snake Nokia 3D', category: 'Game', iconColor: 'bg-cyan-500', badge: 'Retro', url: 'https://sites.google.com/view/snake-3d/home' },
    { id: 314, title: 'Math Galaxy', category: 'Game', iconColor: 'bg-cyan-500', badge: 'Game', url: 'https://sites.google.com/view/math-galaxy/home' },
    { id: 315, title: 'Kapal Tempur Naval', category: 'Game', iconColor: 'bg-cyan-500', badge: 'Game', url: 'https://sites.google.com/view/naval-battle/home' },

    // BONUS & TOOLS
    { id: 401, title: 'Script & Voice Over AI', category: 'Tools', iconColor: 'bg-purple-500', badge: 'Bonus', url: 'https://gemini.google.com/share/71487a50d705' },
    { id: 402, title: 'AI Generator Soal', category: 'Tools', iconColor: 'bg-purple-500', badge: 'Bonus', url: 'https://gemini.google.com/share/867599217d97' },
    { id: 403, title: 'AI Generator Materi', category: 'Tools', iconColor: 'bg-purple-500', badge: 'Bonus', url: 'https://gemini.google.com/share/c8de7e4afbb8' },
    { id: 404, title: 'Bank Konten Ide Jualan', category: 'Tools', iconColor: 'bg-purple-500', badge: 'Spreadsheet', url: 'https://docs.google.com/spreadsheets/d/12lHxAjbdNQWyw6888AyGFYXUlQbzii_dK6FSMrhBfVI/edit?usp=drivesdk' },
    { id: 405, title: 'Kalkulator Diet Sehat', category: 'Tools', iconColor: 'bg-purple-500', badge: 'Tools', url: 'https://sites.google.com/view/mizyan-kalkulator-diet/home' },

    // TEMPLATE PREMIUM & CANVA
    { id: 501, title: '48 Buku Cerita B.Inggris', category: 'Ebook', iconColor: 'bg-rose-500', badge: 'New', url: 'https://drive.google.com/file/d/13J6yOoiUiIwp7sK2r-13zI36zKQuV9_9/view' },
    { id: 502, title: '20+ Finance Social Media Canva', category: 'Template', iconColor: 'bg-amber-500', badge: 'Canva', url: 'https://www.canva.com/design/DAGSSKhRum0/sesUclbzYyTSUDrktkYrHQ/view' },
    { id: 503, title: '70+ Worksheet Baca', category: 'Worksheet', iconColor: 'bg-purple-500', badge: 'Anak', url: 'https://drive.google.com/drive/folders/1hg_-b2xUUqvXdoXQ9MbM3XoxeX5l1HDj' },
    { id: 504, title: '82 Hal Template Ebook Canva', category: 'Template', iconColor: 'bg-amber-500', badge: 'Canva', url: 'https://www.canva.com/design/DAGWhWbP_SI/Q-sKDZpbPIYXWchZNz_IfA/view' },
    { id: 505, title: '1000 Ide Produk Digital PDF', category: 'Ebook', iconColor: 'bg-rose-500', badge: 'PDF', url: 'https://drive.google.com/file/d/1sMifdrNxyrhe6LAdsHoP1fVVNtHwsLC4/view' },
    { id: 506, title: '30 Day Guided Journal Canva', category: 'Template', iconColor: 'bg-amber-500', badge: 'Canva', url: 'https://www.canva.com/design/DAF5WZVv0nM/go92BvPmu7PxUcNyoIeoDg/view' },
    { id: 507, title: '8 Lifestyle Sheet Bundle Excel', category: 'Tools', iconColor: 'bg-purple-500', badge: 'Excel', url: 'https://drive.google.com/drive/folders/1Go2yMHMEIArDxzFTJiPR9uBo5-arV-Sh' },
    { id: 508, title: '45+ Aktivitas Natal Anak Canva', category: 'Template', iconColor: 'bg-amber-500', badge: 'Canva', url: 'https://www.canva.com/design/DAF1m0ImRBc/rBH2tWdVElGp1jeIZUJOXw/view' },
    { id: 509, title: '49+ Mewarnai Alfabet', category: 'Worksheet', iconColor: 'bg-purple-500', badge: 'Print', url: 'https://drive.google.com/drive/folders/13Bb6SGaqDwQNOhkiFvuBBvdU00taA1Mf' },
    { id: 510, title: 'Digital Product Planner Canva', category: 'Template', iconColor: 'bg-amber-500', badge: 'Canva', url: 'https://www.canva.com/design/DAF6wFMUePY/upE6FHcgPob7BJxcwEHC6A/view' },
    { id: 511, title: 'Printable Tracker Bundle Canva', category: 'Template', iconColor: 'bg-amber-500', badge: 'Canva', url: 'https://www.canva.com/design/DAF6ofd2VF8/tCWxG--lrOXH3OB-fPuv1w/view' },
    { id: 512, title: 'Daily Life Planner Canva', category: 'Template', iconColor: 'bg-amber-500', badge: 'Canva', url: 'https://www.canva.com/design/DAF7atJsoMs/o7tGSgLb_9rtbSgiXYJ7_w/view' },
    { id: 513, title: 'Business IG Templates Canva', category: 'Template', iconColor: 'bg-amber-500', badge: 'Canva', url: 'https://www.canva.com/design/DAF1Oav2n4g/UNF1DnHV9F5e5ibHBlwBMA/view' },
    { id: 514, title: 'Printable Shopify Planner Canva', category: 'Template', iconColor: 'bg-amber-500', badge: 'Canva', url: 'https://www.canva.com/design/DAF4708i2XU/RlS9v39_R257dX7U80dK1w/view' },
    { id: 515, title: 'Family Financial Planner Canva', category: 'Template', iconColor: 'bg-amber-500', badge: 'Canva', url: 'https://www.canva.com/design/DAF2r5CaBmI/m-z8rixX_JZyA60o09e72A/view' },
    { id: 516, title: 'Weight Loss Journal Canva', category: 'Template', iconColor: 'bg-amber-500', badge: 'Canva', url: 'https://www.canva.com/design/DAF4-yM1MXk/rOVgqsdD7UWRuG5ZBWUDFw/view' },
    { id: 517, title: 'Sosmed Post Planner Canva', category: 'Template', iconColor: 'bg-amber-500', badge: 'Canva', url: 'https://www.canva.com/design/DAF9hS21aLg/8qQqjqye0aNblDkX9oAt7g/view' },
    { id: 518, title: 'Buku Mewarnai Cinta Canva', category: 'Template', iconColor: 'bg-amber-500', badge: 'Canva', url: 'https://www.canva.com/design/DAF74rDpwYg/UnFue53hhH5_hOzFTGNM3w/view' },
    { id: 519, title: 'Printable Wedding Planner Canva', category: 'Template', iconColor: 'bg-amber-500', badge: 'Canva', url: 'https://www.canva.com/design/DAGECiBeCXs/qIkE2ptYi1xql-dV0ga6NA/view' },
    { id: 520, title: 'Template Buku Penerbit Docx', category: 'Template', iconColor: 'bg-amber-500', badge: 'Docx', url: 'https://docs.google.com/document/d/1RkP3iRj2izBH_tTKgDal7Lg-JZ4qrhV1/edit' },
    { id: 521, title: 'Nature Videos Reels HD', category: 'Ecourse', iconColor: 'bg-cyan-500', badge: 'Video', url: 'https://www.canva.com/design/DAGNwT5b3H4/_Q95p_aOd0LnFcujy0FNfA/view' },
    { id: 522, title: 'Luxury IG Stories Drive', category: 'Template', iconColor: 'bg-amber-500', badge: 'Drive', url: 'https://drive.google.com/file/d/1nODH3DqDkuXdsX9mS6FpLLAuu5V5XWFs/view' },
    { id: 523, title: '40 Reel Covers Drive', category: 'Template', iconColor: 'bg-amber-500', badge: 'Drive', url: 'https://drive.google.com/file/d/1FbuG46OduPoEOpDoC0AUffgHN6gFnhsw/view' },
    { id: 524, title: '30 Motivational Reels Drive', category: 'Ecourse', iconColor: 'bg-cyan-500', badge: 'Video', url: 'https://drive.google.com/file/d/1KIpRJENJjFXVX8nIzzq2Km0cQ127hpL4/view' },
    { id: 525, title: 'Ebook Content Marketing Drive', category: 'Ebook', iconColor: 'bg-rose-500', badge: 'PDF', url: 'https://drive.google.com/drive/u/0/folders/18RWdPcUanx1z6H-f4yeL5n97cCuyxJAm' }
  ];

  const [products, setProducts] = useState(initialProducts);

  useEffect(() => {
    async function loadData() {
      try {
        const docRef = doc(db, 'katalog_config', 'main_store');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.storeData) setStoreData(data.storeData);
          if (data.products && data.products.length > 0) setProducts(data.products);
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
      alert(`❌ Gagal menyimpan data: ${err.message || 'Cek koneksi'}`);
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

  const categories = ['Semua', 'Template', 'Ebook', 'Ecourse', 'Tools', 'Game', 'Worksheet', 'Islami'];

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
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 active:scale-95 disabled:opacity-50"
          >
            <Save className="w-4 h-4" /> {isSaving ? '...' : 'Simpan'}
          </button>
        </div>
      </header>

      <main className="max-w-md mx-auto w-full px-4 pt-4 flex-1">
        
        {/* PANEL EDIT */}
        {activeTab === 'edit' && (
          <div className="space-y-4 pb-12">
            
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
                  <label className="text-slate-400">Foto Profil / Logo</label>
                  <div className="flex items-center gap-3 mt-1">
                    <label className="cursor-pointer bg-slate-800 hover:bg-slate-700 border border-slate-700 text-emerald-400 px-3 py-2 rounded-xl text-xs flex items-center gap-2 transition-all">
                      <Upload className="w-4 h-4" /> Pilih File Gambar
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                    {storeData.logoUrl && <span className="text-[10px] text-emerald-400">✔ Gambar Dimuat</span>}
                  </div>
                </div>
                <div>
                  <label className="text-slate-400">Atau Gunakan URL Gambar Logo</label>
                  <input 
                    type="text"
                    placeholder="https://..."
                    value={storeData.logoUrl}
                    onChange={(e) => setStoreData({...storeData, logoUrl: e.target.value})}
                    className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-slate-400">Nomor WhatsApp Konsultasi (Format: 628xxx)</label>
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

            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 backdrop-blur-md shadow-xl space-y-3">
              <h2 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                <ShoppingBag className="w-4 h-4" /> 3. Kelola Produk ({products.length} Produk Aktif)
              </h2>
              <form onSubmit={handleAddProduct} className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-400">Judul Produk Baru</label>
                  <input 
                    type="text"
                    placeholder="Contoh: Ebook Tajwid"
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
                      {categories.filter(c => c !== 'Semua').map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
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
                  <Plus className="w-4 h-4" /> Tambah Produk Baru
                </button>
              </form>

              <div className="space-y-2 max-h-60 overflow-y-auto pr-1 pt-2 border-t border-slate-800">
                {products.map((p) => (
                  <div key={p.id} className="flex items-center justify-between bg-slate-950 p-2 rounded-xl text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className={`w-6 h-6 rounded-lg ${p.iconColor || 'bg-emerald-500'} flex items-center justify-center text-slate-950 shrink-0`}>
                        <Sparkles className="w-3 h-3" />
                      </div>
                      <div className="truncate">
                        <p className="font-bold text-slate-200 truncate">{p.title}</p>
                        <p className="text-[10px] text-slate-400">{p.category}</p>
                      </div>
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

        {/* PANEL PREVIEW */}
        {activeTab === 'preview' && (
          <div className="space-y-4">
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

            {bottomNav === 'materi' && (
              <div className="grid grid-cols-2 gap-3 animate-fadeIn">
                <a href="https://sites.google.com/view/katalog-produk-premium/kumpulan-produk" target="_blank" rel="noreferrer" className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-lg block hover:border-cyan-500 transition-all">
                  <FileText className="w-6 h-6 text-cyan-400 mb-2" />
                  <h4 className="text-xs font-bold text-slate-200">{storeData.materi1Title}</h4>
                  <p className="text-[10px] text-slate-400 mt-1">{storeData.materi1Desc}</p>
                </a>
                <a href="https://sites.google.com/view/mizyandigital02/bahan-promosi/cover-produk-siap-pakai" target="_blank" rel="noreferrer" className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-lg block hover:border-rose-500 transition-all">
                  <TrendingUp className="w-6 h-6 text-rose-400 mb-2" />
                  <h4 className="text-xs font-bold text-slate-200">{storeData.materi2Title}</h4>
                  <p className="text-[10px] text-slate-400 mt-1">{storeData.materi2Desc}</p>
                </a>
              </div>
            )}

            {bottomNav === 'produk' && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
                    <div>
                      <p className="text-[11px] text-slate-400">Total Produk</p>
                      <p className="text-xl font-extrabold text-white mt-0.5">{products.length}+</p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                      <ShoppingBag className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
                    <div>
                      <p className="text-[11px] text-slate-400">Modul Belajar</p>
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
                      placeholder="Cari template, ebook, ecourse, game..."
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

            <div className="bg-gradient-to-r from-emerald-950/40 to-slate-900 border border-emerald-500/30 rounded-2xl p-4 flex items-center justify-between shadow-xl">
              <div>
                <p className="text-xs font-bold text-emerald-400">Punya Pertanyaan?</p>
                <p className="text-[10px] text-slate-400">Konsultasi langsung via WhatsApp</p>
              </div>
              <a 
                href={`https://wa.me/${storeData.whatsapp}?text=Halo%20kak!%20Aku%20mau%20konsultasi`}
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
