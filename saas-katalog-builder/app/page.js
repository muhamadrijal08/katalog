<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>KatalogCraft SaaS - Modern App UI</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/lucide@latest"></script>
</head>
<body class="bg-[#0d1117] text-slate-100 font-sans min-h-screen pb-24 relative overflow-x-hidden">

    <!-- Aurora Background Glow -->
    <div class="fixed top-[-10%] left-[-20%] w-[400px] h-[400px] bg-rose-600/20 rounded-full blur-[100px] pointer-events-none"></div>
    <div class="fixed top-[40%] right-[-20%] w-[400px] h-[400px] bg-cyan-600/20 rounded-full blur-[100px] pointer-events-none"></div>

    <!-- Top Bar -->
    <header class="sticky top-0 z-40 backdrop-blur-xl bg-[#161b22]/80 border-b border-slate-800/80 px-4 py-3 flex items-center justify-between shadow-lg">
        <div class="flex items-center gap-2">
            <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-400 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <i data-lucide="store" class="w-5 h-5 text-slate-950"></i>
            </div>
            <div>
                <h1 class="font-bold text-sm bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                    KatalogCraft <span class="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">Pro UI</span>
                </h1>
            </div>
        </div>
        <div class="flex items-center gap-2">
            <div class="bg-slate-900/90 p-1 rounded-xl border border-slate-800 flex text-xs">
                <button onclick="switchTab('edit')" id="btn-edit" class="px-3 py-1.5 rounded-lg font-medium transition-all text-slate-400 hover:text-white">Edit</button>
                <button onclick="switchTab('preview')" id="btn-preview" class="px-3 py-1.5 rounded-lg font-medium transition-all bg-emerald-500 text-slate-950 font-semibold shadow-md">Preview</button>
            </div>
            <button onclick="saveData()" class="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-3 py-2 rounded-xl text-xs font-bold shadow-lg shadow-emerald-500/20 active:scale-95">Simpan</button>
        </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-md mx-auto w-full px-4 pt-4">
        
        <!-- PANEL EDIT -->
        <div id="panel-edit" class="hidden space-y-4">
            <div class="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 backdrop-blur-md shadow-xl">
                <h2 class="text-xs font-semibold text-emerald-400 mb-3 uppercase tracking-wider">Identitas Toko</h2>
                <div class="space-y-3 text-xs">
                    <div>
                        <label class="text-slate-400">Nama Toko</label>
                        <input type="text" id="input-name" class="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500" value="Digital Treasury Hub">
                    </div>
                    <div>
                        <label class="text-slate-400">Nomor WhatsApp</label>
                        <input type="text" id="input-wa" class="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500" value="6281234567890">
                    </div>
                    <div>
                        <label class="text-slate-400">Slogan / Deskripsi</label>
                        <textarea id="input-slogan" rows="2" class="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500">Pusat Aset Digital & Template Premium</textarea>
                    </div>
                </div>
            </div>
        </div>

        <!-- PANEL PREVIEW (APP UI) -->
        <div id="panel-preview" class="space-y-4">
            <!-- Header Profil Toko -->
            <div class="bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-slate-800 rounded-3xl p-5 backdrop-blur-xl shadow-2xl flex items-center gap-4">
                <div class="w-14 h-14 rounded-2xl bg-gradient-to-tr from-rose-500 via-purple-500 to-cyan-500 p-0.5 shadow-xl">
                    <div class="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                        <i data-lucide="store" class="w-7 h-7 text-emerald-400"></i>
                    </div>
                </div>
                <div class="flex-1 min-w-0">
                    <h2 id="view-name" class="text-lg font-extrabold text-white truncate">Digital Treasury Hub</h2>
                    <p id="view-slogan" class="text-xs text-slate-400 leading-relaxed line-clamp-2 mt-0.5">Pusat Aset Digital & Template Premium</p>
                </div>
            </div>

            <!-- Stats Bar -->
            <div class="grid grid-cols-2 gap-3">
                <div class="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
                    <div>
                        <p class="text-[11px] text-slate-400">Produk Digital</p>
                        <p class="text-xl font-extrabold text-white mt-0.5">1000+</p>
                    </div>
                    <div class="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                        <i data-lucide="shopping-bag" class="w-5 h-5"></i>
                    </div>
                </div>
                <div class="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
                    <div>
                        <p class="text-[11px] text-slate-400">Materi Belajar</p>
                        <p class="text-xl font-extrabold text-white mt-0.5">500+</p>
                    </div>
                    <div class="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center">
                        <i data-lucide="book-open" class="w-5 h-5"></i>
                    </div>
                </div>
            </div>

            <!-- Search Bar -->
            <div class="relative">
                <i data-lucide="search" class="w-4 h-4 text-slate-400 absolute left-3.5 top-3"></i>
                <input type="text" placeholder="Cari template, ebook, ecourse..." class="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500">
            </div>

            <!-- Grid Produk 3 Kolom Modern -->
            <div class="grid grid-cols-3 gap-2.5">
                <div class="bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-2.5 flex flex-col justify-between relative shadow-lg">
                    <span class="absolute top-1.5 right-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-rose-500/20 text-rose-400 border border-rose-500/30">Hot</span>
                    <div>
                        <div class="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 mb-2 shadow-md">
                            <i data-lucide="sparkles" class="w-5 h-5"></i>
                        </div>
                        <h4 class="text-[11px] font-bold text-slate-200 line-clamp-2">Template Canva IG</h4>
                    </div>
                    <a href="#" class="mt-3 w-full py-1.5 rounded-xl bg-slate-800 text-emerald-400 text-[10px] font-bold text-center block border border-slate-700">LIHAT</a>
                </div>

                <div class="bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-2.5 flex flex-col justify-between relative shadow-lg">
                    <span class="absolute top-1.5 right-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">New</span>
                    <div>
                        <div class="w-9 h-9 rounded-xl bg-rose-500 flex items-center justify-center text-slate-950 mb-2 shadow-md">
                            <i data-lucide="book-open" class="w-5 h-5"></i>
                        </div>
                        <h4 class="text-[11px] font-bold text-slate-200 line-clamp-2">E-Book Bisnis</h4>
                    </div>
                    <a href="#" class="mt-3 w-full py-1.5 rounded-xl bg-slate-800 text-emerald-400 text-[10px] font-bold text-center block border border-slate-700">LIHAT</a>
                </div>

                <div class="bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-2.5 flex flex-col justify-between relative shadow-lg">
                    <span class="absolute top-1.5 right-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">Pro</span>
                    <div>
                        <div class="w-9 h-9 rounded-xl bg-cyan-500 flex items-center justify-center text-slate-950 mb-2 shadow-md">
                            <i data-lucide="shopping-bag" class="w-5 h-5"></i>
                        </div>
                        <h4 class="text-[11px] font-bold text-slate-200 line-clamp-2">Game Edukasi</h4>
                    </div>
                    <a href="#" class="mt-3 w-full py-1.5 rounded-xl bg-slate-800 text-emerald-400 text-[10px] font-bold text-center block border border-slate-700">LIHAT</a>
                </div>
            </div>

            <!-- WhatsApp Direct CTA -->
            <div class="bg-gradient-to-r from-emerald-950/40 to-slate-900 border border-emerald-500/30 rounded-2xl p-4 flex items-center justify-between shadow-xl">
                <div>
                    <p class="text-xs font-bold text-emerald-400">Punya Pertanyaan?</p>
                    <p class="text-[10px] text-slate-400">Chat langsung via WhatsApp</p>
                </div>
                <a id="wa-link" href="https://wa.me/6281234567890" target="_blank" class="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg">
                    <i data-lucide="message-circle" class="w-4 h-4"></i> Hubungi
                </a>
            </div>
        </div>
    </main>

    <!-- Bottom Navigation Bar -->
    <nav class="fixed bottom-3 left-1/2 -translate-x-1/2 max-w-xs w-[90%] bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-full px-4 py-2 flex items-center justify-around shadow-2xl z-50 text-xs">
        <button class="flex flex-col items-center gap-1 text-cyan-400">
            <i data-lucide="book-open" class="w-4 h-4"></i>
            <span class="text-[10px]">Baca Dulu</span>
        </button>
        <button class="flex flex-col items-center gap-1 text-slate-400 hover:text-white">
            <i data-lucide="file-text" class="w-4 h-4"></i>
            <span class="text-[10px]">Materi</span>
        </button>
        <button class="flex flex-col items-center gap-1 text-slate-400 hover:text-white">
            <i data-lucide="shopping-bag" class="w-4 h-4"></i>
            <span class="text-[10px]">Produk</span>
        </button>
    </nav>

    <script>
        lucide.createIcons();

        function switchTab(tab) {
            const editPanel = document.getElementById('panel-edit');
            const previewPanel = document.getElementById('panel-preview');
            const btnEdit = document.getElementById('btn-edit');
            const btnPreview = document.getElementById('btn-preview');

            if (tab === 'edit') {
                editPanel.classList.remove('hidden');
                previewPanel.classList.add('hidden');
                btnEdit.className = "px-3 py-1.5 rounded-lg font-medium transition-all bg-emerald-500 text-slate-950 font-semibold shadow-md";
                btnPreview.className = "px-3 py-1.5 rounded-lg font-medium transition-all text-slate-400 hover:text-white";
            } else {
                editPanel.classList.add('hidden');
                previewPanel.classList.remove('hidden');
                btnPreview.className = "px-3 py-1.5 rounded-lg font-medium transition-all bg-emerald-500 text-slate-950 font-semibold shadow-md";
                btnEdit.className = "px-3 py-1.5 rounded-lg font-medium transition-all text-slate-400 hover:text-white";
                
                // Update preview text
                document.getElementById('view-name').innerText = document.getElementById('input-name').value;
                document.getElementById('view-slogan').innerText = document.getElementById('input-slogan').value;
                const wa = document.getElementById('input-wa').value;
                document.getElementById('wa-link').href = `https://wa.me/${wa}`;
            }
        }

        function saveData() {
            switchTab('preview');
            alert('✅ Perubahan berhasil diterapkan pada pratinjau!');
        }
    </script>
</body>
</html>