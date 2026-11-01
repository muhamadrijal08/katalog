import { getStoreProfile } from '../../lib/firebase';

export default async function StorePage({ params }) {
  let store = null;

  // Cek apakah API Key Firebase sudah terpasang sebelum mencoba mengambil data
  try {
    if (process.env.NEXT_PUBLIC_FIREBASE_API_KEY && params?.slug) {
      store = await getStoreProfile(params.slug);
    }
  } catch (error) {
    console.log("Firebase belum siap atau belum dikonfigurasi:", error);
  }

  // Tampilan fallback aman jika data toko belum ditemukan atau Firebase belum terhubung
  if (!store) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-400 flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-sm">
          <h1 className="text-lg font-bold text-slate-200">Toko Tidak Ditemukan</h1>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
            Halaman ini belum aktif atau API Key Firebase belum dimasukkan di Settings Vercel.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6 max-w-md mx-auto">
      <h1 className="text-xl font-bold text-center">{store.store_name}</h1>
      <p className="text-xs text-slate-400 text-center mt-1">{store.store_tagline}</p>
    </div>
  );
}