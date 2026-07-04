import React from "react";
import { 
  MdOutlineReportProblem, MdMailOutline, MdPhone, MdChat, 
  MdShield, MdVerifiedUser, MdErrorOutline, MdLockClock 
} from "react-icons/md";

export default function Support() {
  return (
    <main className="max-w-5xl mx-auto px-4 py-12 font-sans flex-grow w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* LEFT & CENTER COLUMN: WHAT CAN BE REPORTED & ASSURANCE */}
        <div className="md:col-span-2 bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-xs space-y-8">
          
          {/* HEADER SECTIONS */}
          <div className="space-y-3">
            <div className="bg-red-50 text-red-500 w-12 h-12 rounded-full flex items-center justify-center text-2xl shadow-xs">
              <MdOutlineReportProblem />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Student Support & Grievance Cell
            </h1>
            <p className="text-sm text-slate-500 leading-relaxed font-medium">
              If you are facing any issues or problems with any PG accommodation or property owner listed on our platform, you can file an official complaint immediately. Connect with us directly via phone call, WhatsApp, or email.
            </p>
          </div>

          {/* TIME FRAME ASSURANCE BLOCK */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
            <MdLockClock className="text-amber-600 text-2xl flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-xs font-black text-amber-900 uppercase tracking-wider">
                Strict 24-Hour Action Window
              </h3>
              <p className="text-xs text-amber-800 font-medium mt-0.5 leading-relaxed">
                As soon as your issue is received, the StudentPG Admin Team will investigate your report. If the owner or listing is found guilty, <strong>strict legal or platform action will be taken within 24 hours</strong>.
              </p>
            </div>
          </div>

          {/* COMPLAINT TYPES / CATEGORIES LIST */}
          <div className="space-y-4">
            <h2 className="text-xs uppercase font-black tracking-wider text-slate-400">
              What types of issues can you report?
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="border border-slate-100 bg-slate-50/50 p-4 rounded-xl space-y-1.5">
                <div className="flex items-center gap-2 text-red-500 font-bold text-xs">
                  <MdErrorOutline className="text-sm" /> Wrong Room Details
                </div>
                <p className="text-slate-500 text-[11px] leading-relaxed font-medium">
                  Listed amenities (like WiFi, Food, AC) are missing in reality, or incorrect room-sharing statuses were listed.
                </p>
              </div>

              <div className="border border-slate-100 bg-slate-50/50 p-4 rounded-xl space-y-1.5">
                <div className="flex items-center gap-2 text-red-500 font-bold text-xs">
                  <MdErrorOutline className="text-sm" /> Fake Property Photos
                </div>
                <p className="text-slate-500 text-[11px] leading-relaxed font-medium">
                  The property owner uploaded fake pictures or random internet downloads instead of the real room images.
                </p>
              </div>

              <div className="border border-slate-100 bg-slate-50/50 p-4 rounded-xl space-y-1.5">
                <div className="flex items-center gap-2 text-red-500 font-bold text-xs">
                  <MdErrorOutline className="text-sm" /> Security Deposit Issues
                </div>
                <p className="text-slate-500 text-[11px] leading-relaxed font-medium">
                  The property owner is refusing to return or illegally holding onto your security deposit amount after you vacate.
                </p>
              </div>

              <div className="border border-slate-100 bg-slate-50/50 p-4 rounded-xl space-y-1.5">
                <div className="flex items-center gap-2 text-red-500 font-bold text-xs">
                  <MdErrorOutline className="text-sm" /> Unfair Rent & Behavior
                </div>
                <p className="text-slate-500 text-[11px] leading-relaxed font-medium">
                  Sudden rent increments without prior notices, or any sort of mistreatment or harassment by the management.
                </p>
              </div>
            </div>
          </div>

          {/* PLATFORM SAFETY GUARANTEE */}
          <div className="border-t border-slate-100 pt-6 flex items-center gap-2 text-slate-400 text-xs font-semibold">
            <MdVerifiedUser className="text-emerald-500 text-lg flex-shrink-0" />
            <span>StudentPG is an absolute safe ecosystem. Your privacy and identity parameters are completely secure.</span>
          </div>

        </div>

        {/* RIGHT COLUMN: DIRECT CONTACT INFRASTRUCTURE CARD */}
        <aside className="bg-slate-900 text-slate-100 rounded-xl p-6 border border-slate-800 shadow-lg h-fit space-y-6">
          <div className="space-y-1.5">
            <span className="text-emerald-400 font-black text-[10px] uppercase tracking-wider block">
              Official Helpdesks
            </span>
            <h2 className="text-base font-black tracking-tight text-white flex items-center gap-1.5">
              <MdShield className="text-emerald-400 text-lg" /> Connect Directly
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              Please use any of the communication avenues below to reach out. Our support helpdesk is active to help you out.
            </p>
          </div>

          <hr className="border-slate-800" />

          {/* CONTACT LIST LINKS */}
          <div className="space-y-4">
            
            {/* DIRECT PHONE CALL */}
            <a 
              href="tel:+918604325848" 
              className="flex items-start gap-3 p-2.5 rounded-lg bg-slate-800/40 border border-slate-800 hover:border-blue-500/50 transition-all group"
            >
              <div className="bg-blue-600/20 text-blue-400 p-2 rounded-lg text-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <MdPhone />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Call Helpline</p>
                <p className="text-xs font-black text-white font-mono tracking-wide mt-0.5">+91 79 7013 4063</p>
              </div>
            </a>

            {/* DIRECT WHATSAPP */}
            <a 
              href="https://wa.me/918604325848?text=Hello%20StudentPG%20Support,%20I%20want%20to%20file%20a%20complaint." 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-start gap-3 p-2.5 rounded-lg bg-slate-800/40 border border-slate-800 hover:border-emerald-500/50 transition-all group"
            >
              <div className="bg-emerald-600/20 text-emerald-400 p-2 rounded-lg text-lg group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <MdChat />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">WhatsApp Us</p>
                <p className="text-xs font-black text-white font-mono tracking-wide mt-0.5"> +91 8604325848</p>
              </div>
            </a>

            {/* DIRECT EMAIL */}
            <a 
              href="mailto:tn8673436@gmail.com?subject=Grievance%20Report%20-%20StudentPG" 
              className="flex items-start gap-3 p-2.5 rounded-lg bg-slate-800/40 border border-slate-800 hover:border-red-500/50 transition-all group"
            >
              <div className="bg-red-600/20 text-red-400 p-2 rounded-lg text-lg group-hover:bg-red-600 group-hover:text-white transition-colors">
                <MdMailOutline />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Official Email</p>
                <p className="text-xs font-black text-white font-mono mt-0.5 break-all">tn8673436@gmail.com</p>
              </div>
            </a>

          </div>

          {/* EDIT NOTICE */}
          <div className="bg-slate-800/60 rounded-lg p-3 border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
            🔒 <strong> 100% Confidential</strong>  SupportYour privacy is our priority. All complaints, personal data, and conversations with our grievance team remain strictly secure and confidential.
          </div>
        </aside>

      </div>
    </main>
  );
}