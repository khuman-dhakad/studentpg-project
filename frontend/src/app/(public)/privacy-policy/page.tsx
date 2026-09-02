'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Calendar, Lock, ChevronDown, ChevronUp, ShieldCheck } from 'lucide-react';

export default function PrivacyPolicyPage() {
  const [activeSection, setActiveSection] = useState('1');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: '1', label: '1. Introduction' },
    { id: '2', label: '2. Information We Collect' },
    { id: '3', label: '3. How We Use Your Information' },
    { id: '4', label: '4. How We Share Your Information' },
    { id: '5', label: '5. Data Security' },
    { id: '6', label: '6. Your Rights and Choices' },
    { id: '7', label: '7. Cookies and Tracking Technologies' },
    { id: '8', label: '8. Data Retention' },
    { id: '9', label: '9. Children\'s Privacy' },
    { id: '10', label: '10. Changes to This Policy' },
    { id: '11', label: '11. Contact Us' },
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
    <main className="min-h-screen bg-slate-50/50 py-8 sm:py-12 px-4 sm:px-6 lg:px-8 antialiased">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* HERO BANNER SECTION */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xs grid lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8 space-y-3">
            <span className="text-[11px] font-black tracking-widest text-emerald-700 uppercase bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 inline-block mb-1">
              PRIVACY POLICY
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Your <span className="text-emerald-600">Privacy,</span> Our Commitment
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-slate-500 leading-relaxed max-w-2xl">
              At StudentPG, we respect your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your data.
            </p>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 pt-1">
              <Calendar className="w-4 h-4 text-emerald-600" />
              <span>Last Updated: 16 May 2025</span>
            </div>
          </div>

          <div className="lg:col-span-4 flex justify-center lg:justify-end">
            <div className="relative w-40 h-40 sm:w-52 sm:h-52">
              <Image
                src="/privacy policy.jpeg"
                alt="Privacy Guarantee Illustration"
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
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      activeSection === item.id
                        ? 'bg-emerald-50 text-emerald-800 border-l-2 border-emerald-600 font-black'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* TRUST BADGE */}
            <div className="bg-emerald-50/70 border border-emerald-100 p-4 rounded-2xl flex items-center gap-3">
              <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-xl shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <p className="text-[11px] font-bold text-emerald-900 leading-snug">
                We never sell your personal information or contact details to third parties.
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
                  {navItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold cursor-pointer ${
                        activeSection === item.id ? 'bg-emerald-50 text-emerald-800' : 'text-slate-600'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT DETAILS CONTENT */}
          <div className="lg:col-span-8 bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/80 shadow-xs space-y-8 text-xs sm:text-sm font-medium text-slate-600 leading-relaxed">

            {/* SECTION 1 */}
            <section id="section-1" className="space-y-2 scroll-mt-6">
              <h2 className="text-base sm:text-lg font-black text-slate-900">1. Introduction</h2>
              <p>
                StudentPG (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;) operates the StudentPG platform and website. This Privacy Policy explains how we collect, use, disclose, and protect your personal information when you use our platform.
              </p>
            </section>

            {/* SECTION 2 */}
            <section id="section-2" className="space-y-2 scroll-mt-6">
              <h2 className="text-base sm:text-lg font-black text-slate-900">2. Information We Collect</h2>
              <p>We collect the following types of information:</p>
              <ul className="list-disc pl-5 space-y-1.5 font-semibold text-slate-700">
                <li><strong className="text-slate-900">Personal Information:</strong> Name, email address, phone number, profile details (for owners).</li>
                <li><strong className="text-slate-900">Property Information:</strong> PG listings, images, address, amenities and related information.</li>
                <li><strong className="text-slate-900">Usage Information:</strong> IP address, browser type, device information, pages visited, and time spent.</li>
                <li><strong className="text-slate-900">Communications:</strong> Messages you send to us via contact forms or support.</li>
              </ul>
            </section>

            {/* SECTION 3 */}
            <section id="section-3" className="space-y-2 scroll-mt-6">
              <h2 className="text-base sm:text-lg font-black text-slate-900">3. How We Use Your Information</h2>
              <p>We use your information to:</p>
              <ul className="list-disc pl-5 space-y-1.5 font-semibold text-slate-700">
                <li>Provide, operate, and improve our services.</li>
                <li>Verify and approve PG listings.</li>
                <li>Respond to your inquiries and support requests.</li>
                <li>Send important updates and notifications.</li>
                <li>Ensure safety, security, and prevent fraud.</li>
              </ul>
            </section>

            {/* SECTION 4 */}
            <section id="section-4" className="space-y-2 scroll-mt-6">
              <h2 className="text-base sm:text-lg font-black text-slate-900">4. How We Share Your Information</h2>
              <p>We do not sell your personal information. We may share your information only in the following cases:</p>
              <ul className="list-disc pl-5 space-y-1.5 font-semibold text-slate-700">
                <li>With service providers who help us operate our platform.</li>
                <li>When required by law or legal process.</li>
                <li>To protect our rights, users, and the public.</li>
              </ul>
            </section>

            {/* SECTION 5 */}
            <section id="section-5" className="space-y-2 scroll-mt-6">
              <h2 className="text-base sm:text-lg font-black text-slate-900">5. Data Security</h2>
              <p>
                We implement appropriate technical and organizational measures to protect your data from unauthorized access, alteration, disclosure, or destruction.
              </p>
            </section>

            {/* SECTION 6 */}
            <section id="section-6" className="space-y-2 scroll-mt-6">
              <h2 className="text-base sm:text-lg font-black text-slate-900">6. Your Rights and Choices</h2>
              <p>
                You have the right to access, update, or delete your personal information at any time through your account settings or by contacting us directly.
              </p>
            </section>

            {/* SECTION 7 */}
            <section id="section-7" className="space-y-2 scroll-mt-6">
              <h2 className="text-base sm:text-lg font-black text-slate-900">7. Cookies and Tracking Technologies</h2>
              <p>
                We use cookies and similar technologies to enhance user experience, analyze site traffic, and remember your preferences.
              </p>
            </section>

            {/* SECTION 8 */}
            <section id="section-8" className="space-y-2 scroll-mt-6">
              <h2 className="text-base sm:text-lg font-black text-slate-900">8. Data Retention</h2>
              <p>
                We retain your personal data only for as long as necessary to fulfill the purposes outlined in this policy or as required by law.
              </p>
            </section>

            {/* SECTION 9 */}
            <section id="section-9" className="space-y-2 scroll-mt-6">
              <h2 className="text-base sm:text-lg font-black text-slate-900">9. Children&apos;s Privacy</h2>
              <p>
                Our services are intended for users aged 18 and above. We do not knowingly collect personal data from minors without parental consent.
              </p>
            </section>

            {/* SECTION 10 */}
            <section id="section-10" className="space-y-2 scroll-mt-6">
              <h2 className="text-base sm:text-lg font-black text-slate-900">10. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated revision date.
              </p>
            </section>

            {/* SECTION 11 */}
            <section id="section-11" className="space-y-2 scroll-mt-6">
              <h2 className="text-base sm:text-lg font-black text-slate-900">11. Contact Us</h2>
              <p>If you have any questions or concerns regarding this policy, please reach out to us at:</p>
              <p className="font-bold text-slate-900">
                Email: <a href="mailto:studentpg.support@gmail.com" className="text-emerald-700 hover:underline">studentpg.support@gmail.com</a>
              </p>
            </section>

          </div>

        </div>

      </div>
    </main>
  );
}