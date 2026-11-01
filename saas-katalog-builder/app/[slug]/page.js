import { getStoreProfile } from '../../lib/firebase';

export default async function StorePage({ params }) {
  let store = null;
  
  try {
    if (process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
      store = await getStoreProfile(params.slug);
    }
  } catch (error) {
    console.log("Firebase belum diaktifkan:", error);
  }

  if (!store) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-400 flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-xl font-bold text-slate-200">Toko Tidak Ditemukan / Belum Aktif</h1>
        <p className="text-xs text-slate-500 mt-2">Pastikan API Key Firebase sudah terpasang di Vercel.</p>
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