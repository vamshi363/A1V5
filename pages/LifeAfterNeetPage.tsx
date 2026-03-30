import React from 'react';
import { motion } from 'framer-motion';
import { HeartPulse, ArrowRight } from 'lucide-react';

const LifeAfterNeetPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-[#047857] py-16 px-4 md:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <HeartPulse size={40} className="text-white" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black text-white font-heading mb-4"
          >
            Life After NEET
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-white/80 text-lg max-w-2xl mx-auto leading-relaxed"
          >
            Didn't get the score you hoped for? Your medical dream isn't over.
            Discover 15+ lucrative healthcare careers beyond MBBS.
          </motion.p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="text-2xl md:text-3xl font-bold font-heading text-slate-900 text-center mb-12">
          Top Healthcare Alternatives to MBBS
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { tag: 'B.Pharm / Pharm.D', title: 'Pharmacy & Clinical Research', desc: 'Develop, test, and distribute life-saving drugs. High demand across globally expanding pharma sector.', icon: '💊' },
            { tag: 'B.Sc. Nursing', title: 'Advanced Nursing Practice', desc: 'The backbone of healthcare. Global opportunities with excellent pay bands, especially in UK, USA & Australia.', icon: '👩‍⚕️' },
            { tag: 'BPT', title: 'Physiotherapy', desc: 'Help patients recover from injuries. Start your own independent practice without needing a hospital setup.', icon: '🏃' },
            { tag: 'B.Sc. Allied Health', title: 'Allied Health Sciences', desc: 'Radiology, Anesthesia Tech, Cardiac Care Tech. Work alongside doctors in operation theaters.', icon: '🩺' },
            { tag: 'B.V.Sc', title: 'Veterinary Sciences', desc: 'High demand, very low competition. Treat animals and work in wildlife, research, or private clinics.', icon: '🐾' },
            { tag: 'B.Tech / B.Sc', title: 'Biotechnology & Bioinformatics', desc: 'The future of medicine. Combine biology with tech for genomics, virology, and personalized medicine.', icon: '🧪' },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              className="bg-white border border-slate-200 rounded-3xl p-8 hover:border-[#047857] hover:shadow-lg transition-all group"
            >
              <div className="text-4xl mb-4">{item.icon}</div>
              <div className="inline-block px-3 py-1 bg-[#ECFDF5] text-[#047857] text-sm font-bold rounded-full mb-3">
                {item.tag}
              </div>
              <h3 className="text-xl font-bold font-heading text-slate-900 mb-2 group-hover:text-[#047857] transition-colors">
                {item.title}
              </h3>
              <p className="text-slate-600 leading-relaxed mb-6">
                {item.desc}
              </p>
              <button className="flex items-center font-bold text-[#047857] text-sm group-hover:gap-2 transition-all">
                Explore Career Path <ArrowRight size={16} className="ml-1" />
              </button>
            </motion.div>
          ))}
        </div>

        {/* Note */}
        <div className="mt-16 bg-[#FFF7ED] p-8 rounded-3xl text-center border border-[#FED7AA]">
          <h3 className="font-bold text-[#EA580C] text-xl font-heading mb-2">Feeling Lost?</h3>
          <p className="text-[#9A3412] max-w-2xl mx-auto mb-6">
            Taking a drop year isn't your only option. Our IKIGAI Career Quiz helps BiPC students find the exact path their personality and salary goals match with.
          </p>
          <a href="/quiz" className="inline-block bg-[#EA580C] text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-[#EA580C]/20 hover:scale-105 transition-transform">
            Take IKIGAI Quiz Now →
          </a>
        </div>
      </div>
    </div>
  );
};

export default LifeAfterNeetPage;
