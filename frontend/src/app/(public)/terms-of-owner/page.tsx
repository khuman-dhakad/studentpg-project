'use client';

import { useState } from 'react';
import Image from 'next/image';
import { 
  Calendar, 
  ShieldCheck, 
  ChevronDown, 
  ChevronUp, 
  FileText, 
  UserCheck, 
  CheckCircle, 
  ListChecks, 
  BadgeCheck, 
  CreditCard, 
  Ban, 
  FileSpreadsheet, 
  AlertTriangle, 
  XCircle, 
  RefreshCw, 
  Mail 
} from 'lucide-react';

export default function TermsOfOwnerPage() {
  const [activeSection, setActiveSection] = useState('1');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: '1', label: '1. Introduction', icon: FileText },
    { id: '2', label: '2. Eligibility', icon: UserCheck },
    { id: '3', label: '3. Owner Responsibilities', icon: CheckCircle },
    { id: '4', label: '4. Listing Rules', icon: ListChecks },
    { id: '5', label: '5. Verification & Approval', icon: BadgeCheck },
    { id: '6', label: '6. Payments & Fees', icon: CreditCard },
    { id: '7', label: '7. Prohibited Activities', icon: Ban },
    { id: '8', label: '8. Content & Accuracy', icon: FileSpreadsheet },
    { id: '9', label: '9. Limitation of Liability', icon: AlertTriangle },
    { id: '10', label: '10. Termination', icon: XCircle },
    { id: '11', label: '11. Changes to Terms', icon: RefreshCw },
    { id: '12', label: '12. Contact Us', icon: Mail },
  ];

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    setIsMobileMenuOpen(false);
    const element = document.getElementById(`section-${id}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <main className="min-h-screen bg-slate-50/50 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* HERO BANNER SECTION */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xs grid lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8 space-y-3">
            <span className="text-[11px] font-black tracking-widest text-emerald-700 uppercase bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 inline-block mb-1">
              HOST GUIDELINES
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Terms of <span className="text-emerald-600">Owner</span>
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-slate-500 leading-relaxed max-w-2xl">
              These terms and conditions outline the standards, responsibilities, and operational guidelines for PG Owners hosting on the StudentPG platform.
            </p>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 pt-1">
              <Calendar className="w-4 h-4 text-emerald-600" />
              <span>Last Updated: 16 May 2025</span>
            </div>
          </div>

          <div className="lg:col-span-4 flex justify-center lg:justify-end">
            <div className="relative w-40 h-40 sm:w-52 sm:h-52">
              <Image
                src="/terms and owner.jpeg"
                alt="Terms of Owner Illustration"
                fill
                priority
                className="object-contain"
              />
            </div>
          </div>
        </div>

        {/* MAIN CONTENT AREA */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">

          {/* LEFT NAVIGATION - DESKTOP SIDEBAR */}
          <aside className="hidden lg:block lg:col-span-4 sticky top-6 space-y-4">
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                On this page
              </h3>
              <nav className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        activeSection === item.id
                          ? 'bg-emerald-50 text-emerald-800 border-l-2 border-emerald-600 font-black'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <Icon className={`w-4 h-4 shrink-0 ${activeSection === item.id ? 'text-emerald-700' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* TRUST BADGE */}
            <div className="bg-emerald-50/70 border border-emerald-100 p-4 rounded-2xl flex items-center gap-3">
              <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-xl shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <p className="text-[11px] font-bold text-emerald-900 leading-snug">
                By listing properties on StudentPG, hosts commit to truthful information and tenant security.
              </p>
            </div>
          </aside>

          {/* MOBILE NAVIGATION DROPDOWN */}
          <div className="lg:hidden col-span-12">
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="w-full p-4 flex items-center justify-between text-xs font-black text-slate-900 cursor-pointer"
              >
                <span>On this page</span>
                {isMobileMenuOpen ? <ChevronUp className="w-4 h-4 text-emerald-600" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>

              {isMobileMenuOpen && (
                <div className="px-3 pb-3 pt-1 border-t border-slate-100 space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => scrollToSection(item.id)}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold cursor-pointer ${
                          activeSection === item.id ? 'bg-emerald-50 text-emerald-800' : 'text-slate-600'
                        }`}
                      >
                        <Icon className={`w-3.5 h-3.5 ${activeSection === item.id ? 'text-emerald-700' : 'text-slate-400'}`} />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT DETAILS CONTENT */}
          <div className="lg:col-span-8 bg-white p-6 sm:p-10 rounded-3xl border border-slate-100 shadow-xs space-y-8 text-xs sm:text-sm font-medium text-slate-600 leading-relaxed">

            {/* SECTION 1 */}
            <section id="section-1" className="space-y-2 scroll-mt-6 flex items-start gap-3">
              <div className="p-2 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl shrink-0 mt-1">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-black text-slate-900">1. Introduction</h2>
                <p className="mt-1">
                  Welcome to StudentPG. By registering as an Owner and listing PG properties on our platform, you agree to comply with and be bound by these Terms of Owner.
                </p>
              </div>
            </section>

            {/* SECTION 2 */}
            <section id="section-2" className="space-y-2 scroll-mt-6 flex items-start gap-3">
              <div className="p-2 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl shrink-0 mt-1">
                <UserCheck className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-black text-slate-900">2. Eligibility</h2>
                <p className="mt-1">
                  You must be at least 18 years old and legally authorized to list and manage PG properties. You agree to provide accurate and complete information during registration.
                </p>
              </div>
            </section>

            {/* SECTION 3 */}
            <section id="section-3" className="space-y-2 scroll-mt-6 flex items-start gap-3">
              <div className="p-2 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl shrink-0 mt-1">
                <CheckCircle className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-black text-slate-900">3. Owner Responsibilities</h2>
                <ul className="list-disc pl-5 mt-2 space-y-1.5 font-semibold text-slate-700">
                  <li>Provide accurate and truthful information about your PG property.</li>
                  <li>Keep your listing details updated at all times.</li>
                  <li>Respond to inquiries from students in a timely and respectful manner.</li>
                  <li>Ensure your property complies with all applicable local laws and regulations.</li>
                </ul>
              </div>
            </section>

            {/* SECTION 4 */}
            <section id="section-4" className="space-y-2 scroll-mt-6 flex items-start gap-3">
              <div className="p-2 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl shrink-0 mt-1">
                <ListChecks className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-black text-slate-900">4. Listing Rules</h2>
                <ul className="list-disc pl-5 mt-2 space-y-1.5 font-semibold text-slate-700">
                  <li>You may list only PG/hostel properties that you own or have the legal right to rent out.</li>
                  <li>Do not post misleading, false, or duplicate listings.</li>
                  <li>You may upload up to 3 high-quality images per PG listing.</li>
                </ul>
              </div>
            </section>

            {/* SECTION 5 */}
            <section id="section-5" className="space-y-2 scroll-mt-6 flex items-start gap-3">
              <div className="p-2 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl shrink-0 mt-1">
                <BadgeCheck className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-black text-slate-900">5. Verification & Approval</h2>
                <p className="mt-1">
                  All listings are subject to verification and approval by the StudentPG admin team. We reserve the right to reject or unpublish listings that do not meet our quality guidelines.
                </p>
              </div>
            </section>

            {/* SECTION 6 */}
            <section id="section-6" className="space-y-2 scroll-mt-6 flex items-start gap-3">
              <div className="p-2 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl shrink-0 mt-1">
                <CreditCard className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-black text-slate-900">6. Payments & Fees</h2>
                <p className="mt-1">
                  Listing your PG on StudentPG is currently free. We may introduce paid or premium features in the future. Any applicable fees will be communicated well in advance.
                </p>
              </div>
            </section>

            {/* SECTION 7 */}
            <section id="section-7" className="space-y-2 scroll-mt-6 flex items-start gap-3">
              <div className="p-2 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl shrink-0 mt-1">
                <Ban className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-black text-slate-900">7. Prohibited Activities</h2>
                <p className="mt-1">
                  You agree not to use the platform for any unlawful purpose. Prohibited activities include spamming, fraudulent listings, impersonation, or violating any local tenant-landlord laws.
                </p>
              </div>
            </section>

            {/* SECTION 8 */}
            <section id="section-8" className="space-y-2 scroll-mt-6 flex items-start gap-3">
              <div className="p-2 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl shrink-0 mt-1">
                <FileSpreadsheet className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-black text-slate-900">8. Content & Accuracy</h2>
                <p className="mt-1">
                  Owners are solely responsible for all photos, rent details, and amenities published under their account. StudentPG is not liable for inaccuracies in listings.
                </p>
              </div>
            </section>

            {/* SECTION 9 */}
            <section id="section-9" className="space-y-2 scroll-mt-6 flex items-start gap-3">
              <div className="p-2 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl shrink-0 mt-1">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-black text-slate-900">9. Limitation of Liability</h2>
                <p className="mt-1">
                  StudentPG acts as a venue connecting PG owners with students. We are not responsible for tenant conduct, unpaid rent, or property damages incurred.
                </p>
              </div>
            </section>

            {/* SECTION 10 */}
            <section id="section-10" className="space-y-2 scroll-mt-6 flex items-start gap-3">
              <div className="p-2 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl shrink-0 mt-1">
                <XCircle className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-black text-slate-900">10. Termination</h2>
                <p className="mt-1">
                  We reserve the right to suspend or terminate host accounts that violate these terms, engage in fraudulent behavior, or receive multiple tenant complaints.
                </p>
              </div>
            </section>

            {/* SECTION 11 */}
            <section id="section-11" className="space-y-2 scroll-mt-6 flex items-start gap-3">
              <div className="p-2 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl shrink-0 mt-1">
                <RefreshCw className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-black text-slate-900">11. Changes to Terms</h2>
                <p className="mt-1">
                  We may revise these Terms of Owner at any time. Continued use of the platform after updates constitutes your acceptance of the revised terms.
                </p>
              </div>
            </section>

            {/* SECTION 12 */}
            <section id="section-12" className="space-y-2 scroll-mt-6 flex items-start gap-3">
              <div className="p-2 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl shrink-0 mt-1">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-black text-slate-900">12. Contact Us</h2>
                <p className="mt-1">For any queries regarding host guidelines, contact our support team:</p>
                <p className="font-bold text-slate-900 mt-1">
                  Email: <a href="mailto:studentpg.support@gmail.com" className="text-emerald-700 hover:underline">studentpg.support@gmail.com</a>
                </p>
              </div>
            </section>

          </div>

        </div>

      </div>
    </main>
  );
}