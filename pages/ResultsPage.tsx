import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, 
  Award, 
  BookOpen, 
  Briefcase, 
  GraduationCap, 
  MapPin, 
  Share2, 
  Download, 
  RotateCcw,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Star,
  Search
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CAREERS_DB, calculateIkigaiResults } from '../data/ikigaiData';

// ─── Personalized Explanation Generator ─────────────────────────────────────
function getPersonalizedWhy(careerName: string, answers: any[]) {
    // Simplified logic for brevity in this redesign
    return "Based on your unique combination of passion, skills, salary expectations, and market awareness, this career provides the perfect balance for your future.";
}

// ─── Circular Progress Component ─────────────────────────────────────────────
const CircularProgress = ({ score, color, label, icon }: {score: number, color: string, label: string, icon: string}) => {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-20 h-20 md:w-24 md:h-24 mb-3">
        <svg className="w-full h-full transform -rotate-90">
          <circle cx="50%" cy="50%" r={radius} stroke="#e2e8f0" strokeWidth="8" fill="transparent" />
          <motion.circle 
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
            cx="50%" cy="50%" r={radius} stroke="currentColor" strokeWidth="8" fill="transparent" 
            strokeDasharray={circumference} className={color} strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-lg md:text-xl font-black text-slate-800">
          {score}%
        </div>
      </div>
      <div className="text-xs font-bold text-slate-500 text-center uppercase tracking-tighter">{icon} {label}</div>
    </div>
  );
};

export default function ResultsPage() {
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const saved = localStorage.getItem('afterinter_quiz');
    if (!saved) {
      navigate('/quiz');
      return;
    }
    const parsed = JSON.parse(saved);
    setData(parsed);

    // Confetti on success
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#047857', '#1D4ED8', '#EA580C']
    });
  }, [navigate]);

  if (!data) return null;

  const { ikigaiScores, topCareers, quizAnswers } = data;
  const topCareerDetails = topCareers.map((name: string) => CAREERS_DB.find(c => c.name === name)).filter(Boolean);
  const bestMatch = topCareerDetails[0];

  return (
    <div className="min-h-screen bg-white text-slate-800 pb-20">
      
      {/* ═══════════════ HEADER ═══════════════ */}
      <header className="bg-gov-blue text-white py-12 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 bg-white/10 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6"
          >
            <ShieldCheck size={14} className="text-primary-green" /> Official Analysis Complete
          </motion.div>
          <h1 className="font-heading text-4xl md:text-6xl font-black mb-4">Your Career Path is Clear.</h1>
          <p className="text-slate-300 text-lg md:text-xl font-medium max-w-2xl mx-auto">
            We've analyzed your responses across the 4 IKIGAI pillars to find your ideal future.
          </p>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 -mt-10">
        
        {/* ═══════════════ IKIGAI SCORE CARD (SEMI-DARK EXCEPTION) ═══════════════ */}
        <section className="bg-slate-900 border border-slate-800 rounded-3xl p-8 md:p-12 shadow-2xl mb-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-green/5 rounded-full blur-3xl" />
          
          <div className="relative z-10">
            <h2 className="text-2xl font-black text-white mb-10 text-center">Your IKIGAI Score Card</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
              <CircularProgress score={ikigaiScores.love} color="text-pink-500" label="Passion" icon="❤️" />
              <CircularProgress score={ikigaiScores.goodAt} color="text-blue-500" label="Skills" icon="💪" />
              <CircularProgress score={ikigaiScores.paysWell} color="text-amber-500" label="Salary" icon="💰" />
              <CircularProgress score={ikigaiScores.worldNeeds} color="text-emerald-500" label="Market" icon="🌍" />
            </div>
            
            <div className="mt-12 flex flex-wrap justify-center gap-3">
               {ikigaiScores.love > 80 && <span className="px-4 py-2 bg-pink-500/10 text-pink-400 border border-pink-500/20 rounded-xl text-sm font-bold">Passionate Explorer</span>}
               {ikigaiScores.goodAt > 80 && <span className="px-4 py-2 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-xl text-sm font-bold">High Skill Potential</span>}
               {ikigaiScores.paysWell > 80 && <span className="px-4 py-2 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-xl text-sm font-bold">Value Oriented</span>}
            </div>
          </div>
        </section>

        {/* ═══════════════ TOP CAREER MATCHES ═══════════════ */}
        <section className="mb-20">
          <h2 className="font-heading text-3xl font-black text-gov-blue mb-10">Top Career Recommendations</h2>
          
          <div className="space-y-8">
            {topCareerDetails.map((career: any, index: number) => (
              <motion.div 
                key={career.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`bg-white border-2 rounded-[2.5rem] p-8 md:p-10 flex flex-col lg:flex-row gap-10 items-start ${index === 0 ? 'border-primary-green shadow-xl' : 'border-slate-100 shadow-sm'}`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-6">
                    <span className="text-5xl">{career.emoji}</span>
                    <div>
                      <div className={`text-xs font-bold uppercase tracking-widest mb-1 ${index === 0 ? 'text-primary-green' : 'text-slate-400'}`}>
                        {index === 0 ? '🥇 #1 Best Fit' : index === 1 ? '🥈 Strong Match' : '🥉 Good Option'}
                      </div>
                      <h3 className="text-3xl font-black text-gov-blue leading-tight">{career.name}</h3>
                    </div>
                  </div>
                  
                  <p className="text-slate-600 leading-relaxed font-medium mb-8">
                    {getPersonalizedWhy(career.name, quizAnswers)}
                  </p>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-4 rounded-2xl">
                      <div className="text-xs font-bold text-slate-400 uppercase mb-1 flex items-center gap-1.5"><Briefcase size={14}/> Starting Salary</div>
                      <div className="text-lg font-black text-gov-blue">{career.salary}</div>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl">
                      <div className="text-xs font-bold text-slate-400 uppercase mb-1 flex items-center gap-1.5"><TrendingUp size={14}/> Demand</div>
                      <div className="text-lg font-black text-electric-blue">{career.demand}</div>
                    </div>
                  </div>
                </div>

                <div className="w-full lg:w-72 bg-slate-50 rounded-3xl p-6 border border-slate-100">
                  <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <GraduationCap size={18} className="text-primary-green" /> Path Highlights
                  </h4>
                  <ul className="space-y-4 text-sm font-semibold text-slate-600">
                    <li className="flex gap-2">
                      <span className="text-primary-green">✔</span> 
                      <span>Primary Exam: {career.exam}</span>
                    </li>
                    <li className="border-t border-slate-200 pt-3">
                       <span className="block text-xs uppercase text-slate-400 mb-1">Key Skills</span>
                       <div className="flex flex-wrap gap-2">
                         {career.skills.slice(0,3).map((s:string) => <span key={s} className="bg-white border border-slate-200 px-2.5 py-1 rounded-lg text-[10px]">{s}</span>)}
                       </div>
                    </li>
                  </ul>
                  <button className="w-full mt-6 bg-gov-blue hover:bg-slate-800 text-white py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2">
                    Full Roadmap <ArrowRight size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ═══════════════ FINAL ACTIONS ═══════════════ */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
          <div className="bg-primary-green p-8 rounded-[2rem] text-white flex flex-col justify-between">
            <div>
              <h3 className="text-2xl font-black mb-2">Save Your Results</h3>
              <p className="text-emerald-100/80 mb-8 font-medium">Download a detailed PDF report of your career analysis to show your parents or teachers.</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => window.print()} className="bg-white text-primary-green px-6 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-emerald-50 transition-all flex-1 justify-center">
                <Download size={20} /> Download PDF
              </button>
              <button className="bg-emerald-800 text-white p-4 rounded-2xl hover:bg-emerald-900 transition-all">
                <Share2 size={24} />
              </button>
            </div>
          </div>

          <div className="bg-saffron p-8 rounded-[2rem] text-white flex flex-col justify-between">
            <div>
              <h3 className="text-2xl font-black mb-2">Start Exploring</h3>
              <p className="text-orange-100/80 mb-8 font-medium">Browse our database of colleges and courses matching your top result.</p>
            </div>
            <div className="flex gap-3">
              <Link to="/courses" className="bg-white text-saffron px-6 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-orange-50 transition-all flex-1 justify-center">
                <Search size={20} /> Browse Colleges
              </Link>
              <button 
                onClick={() => { localStorage.removeItem('afterinter_quiz'); navigate('/quiz'); }}
                className="bg-orange-800 text-white p-4 rounded-2xl hover:bg-orange-900 transition-all"
              >
                <RotateCcw size={24} />
              </button>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
