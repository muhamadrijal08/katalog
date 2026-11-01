import { getStoreProfile } from '../../lib/firebase';

export default async function StorePage({ params }) {
  const store = await getStoreProfile(params.slug);

  if (!store) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-400 flex items-center justify-center p-6">
        Website Toko Tidak Ditemukan.
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