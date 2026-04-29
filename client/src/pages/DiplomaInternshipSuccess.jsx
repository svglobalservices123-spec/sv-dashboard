import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Home, ArrowLeft, ShieldCheck, Download, ExternalLink } from 'lucide-react';

const DiplomaInternshipSuccess = () => {
  return (
    <div className="min-h-screen bg-muted flex flex-col items-center justify-center p-4 md:p-8">
      <div className="max-w-2xl w-full bg-white rounded-[3rem] shadow-2xl p-10 md:p-16 text-center relative overflow-hidden border border-gray-100">
        {/* Top Accent Bar */}
        <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-primary via-secondary to-primary"></div>

        {/* Success Icon Wrapper */}
        <div className="mb-10 flex justify-center relative">
          <div className="absolute inset-0 bg-green-100 blur-3xl opacity-50 rounded-full scale-150"></div>
          <div className="bg-green-100 p-8 rounded-[2.5rem] shadow-xl relative z-10 animate-in zoom-in duration-700">
            <CheckCircle2 size={72} className="text-green-600" />
          </div>
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full mb-6 border border-green-100 animate-in fade-in slide-in-from-top-4 duration-1000">
          <ShieldCheck size={14} />
          <span className="text-[10px] font-black uppercase tracking-widest">Submission Verified & Logged</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-display font-black text-dark mb-4 tracking-tighter italic uppercase">
          Training Application
          <span className="text-secondary not-italic">Confirmed!</span>
        </h1>

        <p className="text-gray-500 font-medium text-lg mb-10 leading-relaxed max-w-lg mx-auto">
          Dear Student,
          <br /><br />
          Your application for industrial training has been successfully submitted. Our academic team will review your documents and contact you shortly.
          <br /><br />
          Thank you.
        </p>

        <div className="text-left space-y-8 mb-12">
          {/* Instructions Card */}
          <div className="bg-muted/50 rounded-[2rem] p-8 border border-gray-100">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-4 flex items-center gap-2">
              <Download size={14} /> Basic Details & Requirements
            </h3>
            <p className="text-sm font-bold text-gray-700 leading-relaxed mb-6">
              Dear candidates, please read the basic details:
              <br /><br />
              • You are applying for Diploma 6-months industrial training as per the SBTET curriculum.
              <br />
              • Candidates should follow the guidelines of the SBTET training curriculum.
              <br />
              • All candidates should submit an NOC letter, Indemnity Bond, and Insurance during the training program.
            </p>

            <div className="space-y-3">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Keep the below documents ready:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {['1. SSC Memo – PDF', '2. Aadhaar Card – PDF', '3. College ID Card – PDF', '4. Passport Size Photo – PDF'].map((doc, i) => (
                  <div key={i} className="flex items-center gap-3 bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                    <div className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center text-green-600 flex-shrink-0">
                      <CheckCircle2 size={12} />
                    </div>
                    <span className="text-[10px] font-bold text-gray-600">{doc}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center gap-3 text-green-700">
                <CheckCircle2 size={16} />
                <span className="text-xs font-black uppercase tracking-wider">Yes, I have read all points and all the documents are ready.</span>
              </div>
            </div>
          </div>

          {/* Terms Card */}
          <div className="bg-muted/50 rounded-[2rem] p-8 border border-gray-100">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-secondary mb-4 flex items-center gap-2">
              <ShieldCheck size={14} /> Terms and Conditions
            </h3>
            <ul className="space-y-4">
              {[
                'All students should maintain 90% training attendance during the training as per the SBTET curriculum.',
                'NOC letter and training offer letter will not be re-issued or changed once issued.',
                'Fee payment will not be refunded once paid.',
                'I will follow the training company’s rules, regulations, and guidelines.',
                'I will attend all the training sessions and maintain polite and respectful behaviour.'
              ].map((term, i) => (
                <li key={i} className="flex items-start gap-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-secondary mt-1.5 flex-shrink-0"></div>
                  <p className="text-[11px] font-bold text-gray-600 leading-relaxed">{term}</p>
                </li>
              ))}
            </ul>

            <div className="mt-8 pt-6 border-t border-gray-200 flex items-center gap-4">
              <div className="w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center text-secondary">
                <ShieldCheck size={20} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary">Declaration</p>
                <p className="text-[11px] font-bold text-gray-700 italic">I have read and I agree to all the above points.</p>
              </div>
            </div>
          </div>
        </div>



        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/diploma-internship"
            className="w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-5 bg-primary text-white rounded-2xl hover:scale-105 active:scale-95 transition-all font-black text-[10px] uppercase tracking-widest shadow-xl shadow-blue-500/30"
          >
            <ArrowLeft size={16} /> Back to Registration
          </Link>

          <Link
            to="https://svglobalservices.com/industrial-training/"
            className="w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-5 bg-white border border-gray-200 text-dark rounded-2xl hover:bg-gray-50 transition-all font-black text-[10px] uppercase tracking-widest"
          >
            <Home size={16} /> Main Website
          </Link>
        </div>

        {/* Footer info */}
        <div className="mt-12 pt-8 border-t border-gray-50">
          <p className="text-[9px] font-black text-gray-300 uppercase tracking-[0.4em]">Transaction Reference: DI-{Date.now().toString().slice(-6)}</p>
        </div>
      </div>

      <p className="mt-8 text-gray-400 text-[10px] font-black uppercase tracking-[0.3em]">Svglobal Services • Internship Portal</p>
    </div>
  );
};

export default DiplomaInternshipSuccess;
