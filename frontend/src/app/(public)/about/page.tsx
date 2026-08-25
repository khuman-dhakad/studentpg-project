import type { Metadata } from 'next';
import Image from 'next/image';
import { 
  Users, 
  Building, 
  MapPin, 
  ShieldCheck, 
  Tag, 
  Search, 
  Lock, 
  Headphones,
  ChevronRight 
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about StudentPG, India’s trusted student accommodation discovery platform.',
};

export default function AboutUsPage() {
  const stats = [
    {
      icon: <Users className="w-5 h-5 text-indigo-600" />,
      bg: 'bg-indigo-50',
      value: '50K+',
      label: 'Happy Students',
    },
    {
      icon: <Building className="w-5 h-5 text-pink-600" />,
      bg: 'bg-pink-50',
      value: '10K+',
      label: 'Verified PGs',
    },
    {
      icon: <MapPin className="w-5 h-5 text-emerald-600" />,
      bg: 'bg-emerald-50',
      value: '100+',
      label: 'Cities Covered',
    },
  ];

  const features = [
    {
      icon: <ShieldCheck className="w-5 h-5 text-indigo-600" />,
      bg: 'bg-indigo-50',
      title: 'Verified Listings',
      desc: 'All PGs are verified by our team for authenticity and quality.',
    },
    {
      icon: <Tag className="w-5 h-5 text-pink-600" />,
      bg: 'bg-pink-50',
      title: 'No Brokerage',
      desc: "We don't charge any hidden fees. Connect directly with PG owners.",
    },
    {
      icon: <Search className="w-5 h-5 text-emerald-600" />,
      bg: 'bg-emerald-50',
      title: 'Advanced Search',
      desc: 'Find PGs based on location, rent, amenities and other preferences.',
    },
    {
      icon: <Lock className="w-5 h-5 text-amber-600" />,
      bg: 'bg-amber-50',
      title: 'Safe & Secure',
      desc: 'Your safety is our priority. We ensure a secure platform for everyone.',
    },
    {
      icon: <Headphones className="w-5 h-5 text-purple-600" />,
      bg: 'bg-purple-50',
      title: 'Dedicated Support',
      desc: 'Our support team is always ready to help you with your queries.',
    },
  ];

  return (
    <main className="min-h-screen bg-white py-8 sm:py-14 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12 sm:space-y-20">
        
        {/* HERO SECTION */}
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Text & Stats */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <span className="text-[11px] font-black tracking-widest text-indigo-600 uppercase">
                ABOUT US
              </span>
              <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight mt-1 leading-[1.15]">
                Making PG Search <br className="hidden sm:inline" />
                <span className="text-pink-600">Simple, Safe & Reliable</span>
              </h1>
              <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-4 leading-relaxed max-w-xl">
                StudentPG is India's trusted platform that helps students find verified and comfortable PG accommodations with ease. We connect students with genuine PG owners and provide a transparent experience.
              </p>
            </div>

            {/* Stats Cards Row / Mobile Stack */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 pt-2">
              {stats.map((stat, idx) => (
                <div 
                  key={idx} 
                  className="flex items-center gap-3.5 p-3.5 sm:p-4 rounded-2xl bg-slate-50/80 border border-slate-100 shadow-sm"
                >
                  <div className={`p-2.5 rounded-xl ${stat.bg} shrink-0`}>
                    {stat.icon}
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                      {stat.value}
                    </h3>
                    <p className="text-[10px] sm:text-xs font-bold text-slate-400">
                      {stat.label}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Image Container */}
          <div className="lg:col-span-5 relative">
            <div className="relative w-full h-[260px] sm:h-[360px] rounded-3xl overflow-hidden shadow-lg border border-slate-100">
              <Image
                src="/AboutUs.jpeg"
                alt="Comfortable Room Stay"
                fill
                priority
                className="object-cover"
              />
            </div>
          </div>
        </div>

        {/* OUR MISSION SECTION */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Our Mission
          </h2>
          <p className="text-xs sm:text-sm font-semibold text-slate-500 leading-relaxed">
            To make PG search hassle-free for students by providing verified listings, accurate information, and a seamless experience.
          </p>
        </div>

        {/* WHY CHOOSE STUDENTPG? */}
        <div className="space-y-6 sm:space-y-8">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 text-center tracking-tight">
            Why Choose StudentPG?
          </h2>

          {/* DESKTOP VIEW GRID */}
          <div className="hidden md:grid md:grid-cols-5 gap-4">
            {features.map((item, idx) => (
              <div 
                key={idx} 
                className="bg-slate-50/60 p-5 rounded-2xl border border-slate-100 shadow-xs flex flex-col items-center text-center space-y-3 hover:bg-white hover:shadow-md transition-all duration-200"
              >
                <div className={`p-3 rounded-2xl ${item.bg}`}>
                  {item.icon}
                </div>
                <h3 className="text-xs font-black text-slate-900">
                  {item.title}
                </h3>
                <p className="text-[11px] font-medium text-slate-500 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          {/* MOBILE VIEW (High-Performance Touch Design) */}
          <div className="md:hidden space-y-3">
            {features.map((item, idx) => (
              <div 
                key={idx} 
                className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between gap-3 active:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3.5">
                  <div className={`p-2.5 rounded-xl ${item.bg} shrink-0`}>
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-slate-900">
                      {item.title}
                    </h3>
                    <p className="text-[10px] font-semibold text-slate-400 mt-0.5">
                      {item.desc}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />
              </div>
            ))}
          </div>
        </div>

        {/* OUR STORY SECTION */}
        <div className="bg-slate-50/50 rounded-3xl p-6 sm:p-10 border border-slate-100">
          <div className="grid md:grid-cols-12 gap-8 items-center">
            
            <div className="md:col-span-6 space-y-4">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Our Story
              </h2>
              <p className="text-xs sm:text-sm font-semibold text-slate-500 leading-relaxed">
                StudentPG was founded with a simple idea – to make it easier for students to find good and reliable PG accommodations.
              </p>
              <p className="text-xs sm:text-sm font-semibold text-slate-500 leading-relaxed">
                We understand the challenges students face while searching for a PG in a new city. That's why we built a platform that is transparent, easy to use, and focused on trust.
              </p>
              <p className="text-xs sm:text-sm font-semibold text-slate-500 leading-relaxed">
                From a small beginning, we are growing every day with the support of thousands of students and PG owners across India.
              </p>
            </div>

            <div className="md:col-span-6">
              <div className="relative w-full h-[220px] sm:h-[300px] rounded-2xl overflow-hidden shadow-sm border border-slate-200">
                <Image
                  src="/AboutUs 2.jpeg"
                  alt="StudentPG Community Story"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

          </div>
        </div>

      </div>
    </main>
  );
}