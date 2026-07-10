// import Link from 'next/link';
// import Image from 'next/image';
// import { ROUTES } from '@/constants/routes';

// export default function HomePage() {
//   return (
//     <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      
  

//       {/* Hero Section - Search-Centric */}
//       <section className="relative w-full h-[40vh] md:h-[60vh] flex items-center justify-center p-4">
//         <Image src="/hero-bg.jpg.png" alt="Hero" fill className="object-cover" priority />
//         <div className="absolute inset-0 bg-black/30" />
        
//         <div className="relative z-10 w-full max-w-2xl bg-white rounded-2xl p-2 shadow-2xl flex items-center gap-2 md:p-4">
//           <input 
//             type="text" 
//             placeholder="Where do you want to stay?" 
//             className="flex-1 p-3 outline-none text-gray-800 placeholder:text-gray-400"
//           />
//           <Link href={ROUTES.SEARCH} className="bg-brand text-white px-6 py-3 rounded-xl font-bold hover:bg-brand-dark transition">
//             Search
//           </Link>
//         </div>
//       </section>

//       {/* Quick Access Grid - "Amazon/Flipkart" Style */}
//     <div className="max-w-6xl mx-auto px-4 -mt-8 relative z-20">
//   <div className="grid grid-cols-3 gap-3 md:gap-6">
//     {['Verified', 'No Brokerage', 'Fast Move-in'].map((item, i) => (
//       <div
//         key={i}
//         className="group relative bg-white p-4 md:p-6 rounded-2xl shadow-lg shadow-slate-200/60 border border-slate-100 text-center overflow-hidden transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-slate-300/50 hover:border-transparent"
//       >
//         <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-400 via-teal-500 to-emerald-400 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 ease-out" />

//         <div className="text-2xl mb-2 inline-block transition-transform duration-300 ease-out group-hover:scale-125 group-hover:-translate-y-0.5">
//           ✨
//         </div>

//         <p className="text-[10px] md:text-sm font-bold text-gray-800 uppercase tracking-wider transition-colors duration-300 group-hover:text-emerald-700">
//           {item}
//         </p>
//       </div>
//     ))}
//   </div>
// </div>

//       {/* Content Section */}
//       <main className="max-w-6xl mx-auto px-4 py-12">
//         <h2 className="text-2xl font-bold text-gray-900 mb-8">Featured Properties</h2>
//         {/* Placeholder for Dynamic Listings */}
//         <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
//             {[1,2,3].map((i) => (
//                 <div key={i} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 group">
//                     <div className="h-40 bg-gray-200 relative"></div>
//                     <div className="p-5">
//                         <div className="flex justify-between items-center mb-2">
//                             <span className="text-brand font-bold text-lg">₹12,000</span>
//                             <span className="text-gray-400 text-sm">★ 4.8</span>
//                         </div>
//                         <h3 className="font-semibold text-gray-900">Modern Studio near University</h3>
//                         <p className="text-gray-500 text-sm mt-1">Single room, Fully Furnished</p>
//                     </div>
//                 </div>
//             ))}
//         </div>
//       </main>

//       {/* Bottom Nav (Mobile Only) - Like Airbnb/Flipkart */}
//       <div className="fixed bottom-0 w-full bg-white border-t border-gray-200 flex justify-around p-4 md:hidden z-50">
//         {['Home', 'Search', 'Saved', 'Profile'].map((nav) => (
//           <button key={nav} className="text-[10px] font-bold text-gray-500">{nav}</button>
//         ))}
//       </div>
//     </div>
//   );
// }




import Link from 'next/link';
import Image from 'next/image';
import {
  Search,
  MapPin,
  Heart,
  Star,
  ShieldCheck,
  Wallet,
  Zap,
  Home as HomeIcon,
  User,
  Bookmark,
  ChevronRight,
} from 'lucide-react';
import { ROUTES } from '@/constants/routes';

const CATEGORIES = [
  { label: 'Boys PG', emoji: '🧑' },
  { label: 'Girls PG', emoji: '👩' },
  { label: 'Co-living', emoji: '🤝' },
  { label: 'Near Colleges', emoji: '🎓' },
  { label: 'Budget Friendly', emoji: '💰' },
  { label: 'Premium', emoji: '⭐' },
];

const CITIES = [
  { name: 'Bhopal', count: '120+ stays' },
  { name: 'Indore', count: '210+ stays' },
  { name: 'Pune', count: '340+ stays' },
  { name: 'Bengaluru', count: '480+ stays' },
];

const FEATURED = [1, 2, 3, 4, 5, 6];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 pb-24 md:pb-0">
      {/* ============ HERO ============ */}
      <section className="relative w-full h-[52vh] md:h-[68vh] flex items-center justify-center px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900" />
        <Image
          src="/hero-bg.jpg.png"
          alt="Comfortable PG accommodation"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/40" />

        <div className="relative z-10 w-full max-w-3xl text-center">
          <span className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md border border-white/20 text-white text-[11px] md:text-xs font-semibold px-4 py-1.5 rounded-full mb-4 md:mb-5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Trusted by 50,000+ students & professionals
          </span>

          <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight tracking-tight mb-3 md:mb-4">
            Find your next home,
            <br className="hidden md:block" /> not just a room.
          </h1>
          <p className="text-white/80 text-sm md:text-base mb-6 md:mb-8 max-w-xl mx-auto">
            Verified PGs and co-living spaces, zero brokerage, ready to move in.
          </p>

          <div className="w-full bg-white rounded-2xl p-2 shadow-2xl shadow-black/30 flex items-center gap-2 md:p-2.5">
            <div className="flex items-center flex-1 gap-2 pl-3">
              <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
              <input
                type="text"
                placeholder="Where do you want to stay?"
                className="flex-1 py-3 outline-none text-gray-800 placeholder:text-gray-400 text-sm md:text-base bg-transparent"
              />
            </div>
            <Link
              href={ROUTES.SEARCH}
              className="flex items-center gap-2 bg-brand text-white px-5 md:px-7 py-3 rounded-xl font-bold text-sm md:text-base hover:bg-brand-dark active:scale-95 transition-all duration-200 shrink-0"
            >
              <Search className="w-4 h-4" />
              <span className="hidden sm:inline">Search</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center justify-center gap-2 mt-4 text-white/60 text-xs">
            <span>Popular:</span>
            {['Bhopal', 'Indore', 'MP Nagar', 'Near MANIT'].map((tag) => (
              <button
                key={tag}
                className="px-3 py-1 rounded-full border border-white/20 hover:bg-white/10 hover:text-white transition-colors duration-200"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ============ TRUST BADGES ============ */}
      <div className="max-w-6xl mx-auto px-4 -mt-8 relative z-20">
        <div className="grid grid-cols-3 gap-3 md:gap-6">
          {[
            { label: 'Verified', icon: ShieldCheck },
            { label: 'No Brokerage', icon: Wallet },
            { label: 'Fast Move-in', icon: Zap },
          ].map((item, i) => (
            <div
              key={i}
              className="group relative bg-white p-4 md:p-6 rounded-2xl shadow-lg shadow-slate-200/60 border border-slate-100 text-center overflow-hidden transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-slate-300/50 hover:border-transparent"
            >
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-400 via-teal-500 to-emerald-400 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 ease-out" />

              <div className="w-9 h-9 md:w-11 md:h-11 mx-auto mb-2 rounded-xl bg-emerald-50 flex items-center justify-center transition-transform duration-300 ease-out group-hover:scale-110">
                <item.icon className="w-4 h-4 md:w-5 md:h-5 text-emerald-600" />
              </div>

              <p className="text-[10px] md:text-sm font-bold text-gray-800 uppercase tracking-wider transition-colors duration-300 group-hover:text-emerald-700">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ============ CATEGORY PILLS ============ */}
      {/* <div className="max-w-6xl mx-auto px-4 mt-10 md:mt-14">
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.label}
              className="flex items-center gap-2 shrink-0 bg-white border border-gray-200 px-4 py-2.5 rounded-full text-sm font-semibold text-gray-700 hover:border-brand hover:text-brand hover:bg-brand/5 transition-colors duration-200"
            >
              <span className="text-base leading-none">{cat.emoji}</span>
              {cat.label}
            </button>
          ))}
        </div>
      </div> */}

      {/* ============ FEATURED PROPERTIES ============ */}
      <main className="max-w-6xl mx-auto px-4 pt-5 pb-12 md:py-16">
        <div className="flex items-end justify-between mb-6 md:mb-6">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">Featured Properties</h2>
            {/* <p className="text-gray-500 text-sm mt-1">Handpicked stays our team has personally verified</p> */}
          </div>
          <Link
            href={ROUTES.SEARCH}
            className="hidden md:flex items-center gap-1 text-brand font-semibold text-sm hover:gap-2 transition-all duration-200"
          >
            View all <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {FEATURED.map((i) => (
            <div
              key={i}
              className="group bg-white rounded-2xl md:rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-slate-200/70 border border-gray-100 transition-all duration-300 ease-out hover:-translate-y-1"
            >
              <div className="h-32 md:h-44 bg-gradient-to-br from-slate-200 to-slate-300 relative overflow-hidden">
                <div className="absolute inset-0 bg-slate-300 transition-transform duration-500 ease-out group-hover:scale-110" />

                <span className="absolute top-2.5 left-2.5 md:top-3 md:left-3 bg-emerald-500 text-white text-[9px] md:text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-2.5 h-2.5" />
                  Verified
                </span>

                <button
                  aria-label="Save to favorites"
                  className="absolute top-2.5 right-2.5 md:top-3 md:right-3 w-7 h-7 md:w-8 md:h-8 rounded-full bg-white/90 backdrop-blur flex items-center justify-center text-gray-500 hover:text-rose-500 hover:scale-110 transition-all duration-200"
                >
                  <Heart className="w-3.5 h-3.5 md:w-4 md:h-4" />
                </button>
              </div>

              <div className="p-3.5 md:p-5">
                <div className="flex justify-between items-center mb-1.5 md:mb-2">
                  <span className="text-brand font-extrabold text-base md:text-lg">
                    ₹12,000<span className="text-gray-400 font-medium text-xs">/mo</span>
                  </span>
                  <span className="flex items-center gap-1 text-gray-600 text-xs md:text-sm font-semibold">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    4.8
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 text-sm md:text-base leading-snug line-clamp-1">
                  Modern Studio near University
                </h3>
                <p className="text-gray-500 text-xs md:text-sm mt-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3 shrink-0" />
                  Single room · Fully Furnished
                </p>
              </div>
            </div>
          ))}
        </div>

        <Link
          href={ROUTES.SEARCH}
          className="md:hidden flex items-center justify-center gap-1 text-brand font-semibold text-sm mt-6 py-3 border border-brand/30 rounded-xl hover:bg-brand/5 transition-colors duration-200"
        >
          View all properties <ChevronRight className="w-4 h-4" />
        </Link>
      </main>

      {/* ============ EXPLORE BY CITY ============ */}
      <section className="max-w-6xl mx-auto px-4 pb-12 md:pb-16">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 md:mb-8">Explore by City</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {CITIES.map((city) => (
            <button
              key={city.name}
              className="group relative h-28 md:h-36 rounded-2xl overflow-hidden bg-gradient-to-br from-slate-700 to-slate-900 text-left p-4 flex flex-col justify-end transition-transform duration-300 ease-out hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
              <span className="relative text-white font-bold text-sm md:text-base">{city.name}</span>
              <span className="relative text-white/70 text-[11px] md:text-xs">{city.count}</span>
            </button>
          ))}
        </div>
      </section>

      {/* ============ CTA BANNER ============ */}
      <section className="max-w-6xl mx-auto px-4 pb-16 md:pb-20">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-700 via-emerald-800 to-slate-900 px-6 py-10 md:px-14 md:py-16 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="absolute -right-16 -top-16 w-56 h-56 rounded-full bg-emerald-500/20 blur-2xl" />
          <div className="relative">
            <h3 className="text-xl md:text-3xl font-extrabold text-white mb-2">
              Own a property? List it for free.
            </h3>
            <p className="text-white/70 text-sm md:text-base max-w-md">
              Reach thousands of verified students & professionals looking for a stay — zero commission.
            </p>
          </div>
          <Link
            href="/owner/register"
            className="relative shrink-0 bg-white text-emerald-800 font-bold px-6 md:px-8 py-3.5 rounded-xl hover:bg-gray-100 active:scale-95 transition-all duration-200"
          >
            List Your Property
          </Link>
        </div>
      </section>

      {/* ============ BOTTOM NAV (Mobile) ============ */}
      <div className="fixed bottom-0 w-full bg-white/95 backdrop-blur border-t border-gray-200 flex justify-around py-2 md:hidden z-50">
        {[
          { label: 'Home', icon: HomeIcon, active: true },
          { label: 'Search', icon: Search },
          { label: 'Saved', icon: Bookmark },
          { label: 'Profile', icon: User },
        ].map((nav) => (
          <button
            key={nav.label}
            className={`flex flex-col items-center gap-1 px-3 py-1 transition-colors duration-200 ${
              nav.active ? 'text-brand' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <nav.icon className={`w-5 h-5 ${nav.active ? 'fill-brand/10' : ''}`} />
            <span className="text-[10px] font-bold">{nav.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}