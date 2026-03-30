import React from 'react';
import { motion } from 'framer-motion';
import { FileSearch, CheckCircle2, ShieldCheck } from 'lucide-react';

const CertificateCheckerPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-[#1E3A5F] py-16 px-4 md:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <FileSearch size={40} className="text-white" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black text-white font-heading mb-4"
          >
            Certificate Name Checker
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-white/80 text-lg max-w-2xl mx-auto"
          >
            Upload your SSC and Intermediate certificates to instantly check for spelling mismatches before counselling.
          </motion.p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden mb-12">
          <div className="p-8 md:p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="border-2 border-dashed border-slate-300 rounded-2xl p-12 mb-6 bg-slate-50 relative overflow-hidden group">
                {/* Coming Soon Overlay */}
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10 transition-opacity">
                  <div className="bg-[#EA580C] text-white px-6 py-2 rounded-full font-bold shadow-lg">
                    Coming Soon 🚀
                  </div>
                </div>
                
                <FileSearch size={48} className="text-slate-400 mx-auto mb-4 group-hover:text-[#047857] transition-colors" />
                <h3 className="text-xl font-bold text-slate-800 mb-2">Upload Certificates</h3>
                <p className="text-slate-500 text-sm mb-6">PDF, JPG, or PNG formats supported</p>
                <button className="bg-[#047857] text-white px-8 py-3 rounded-full font-bold opacity-50 cursor-not-allowed">
                  Select Files
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 text-sm text-slate-500 font-medium bg-[#ECFDF5] text-[#047857] py-2 px-4 rounded-full inline-flex">
                <ShieldCheck size={16} />
                <span>100% Secure & Private. Files are processed locally.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: 'Avoid Counselling Rejection', desc: 'Even a single letter mismatch can cause rejection at document verification.' },
            { title: '100% Privacy', desc: 'Your certificates never leave your browser. All scanning happens on your device.' },
            { title: 'Instant Verification', desc: 'AI-powered scanning reads your name and parents\' names instantly.' },
          ].map((feature, i) => (
            <div key={i} className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
              <CheckCircle2 className="text-[#047857] mb-3" size={24} />
              <h4 className="font-bold text-slate-800 mb-2">{feature.title}</h4>
              <p className="text-slate-600 text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CertificateCheckerPage;
