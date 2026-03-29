import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Search, 
  GraduationCap, 
  Trophy, 
  UserCheck, 
  ChevronRight, 
  Briefcase,
  TrendingUp,
  ShieldCheck,
  BookOpen,
  Sparkles
} from 'lucide-react';

// ─── Floating Decorative Cards for Hero ──────────────────────────────────────
const FloatingCard: React.FC<{ icon: React.ReactNode; text: string; delay: number; top: string; left: string; color: string }> = ({ icon, text, delay, top, left, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ 
      opacity: 0.15, 
      y: [0, -10, 0],
      transition: { 
        opacity: { duration: 0.5, delay },
        y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay }
      }
    }}
    className={`absolute hidden lg:flex items-center gap-3 bg-white p-3 rounded-xl shadow-lg border border-slate-100 z-0 pointer-events-none`}
    style={{ top, left }}
  >
    <div className={`p-2 rounded-lg ${color} text-white`}>
      {icon}
    </div>
    <span className="text-xs font-bold text-slate-800">{text}</span>
  </motion.div>
);

// ─── Career Card (Netflix Style) ─────────────────────────────────────────────
const careers = [
  { name: 'Data Scientist', category: 'Tech', salary: '₹8-25 LPA', demand: 'Rising', icon: '📊' },
  { name: 'Chartered Accountant', category: 'Commerce', salary: '₹7-18 LPA', demand: 'Stable', icon: '💼' },
  { name: 'Civil Services (IAS/IPS)', category: 'Govt', salary: '₹6-15 LPA', demand: 'Competitive', icon: '🏛️' },
  { name: 'UI/UX Designer', category: 'Design', salary: '₹5-14 LPA', demand: 'High', icon: '🎨' },
  { name: 'Medical Professional', category: 'Science', salary: '₹9-30 LPA', demand: 'Critical', icon: '🩺' },
  { name: 'Fashion Photographer', category: 'Arts', salary: '₹4-12 LPA', demand: 'Growth', icon: '📸' },
];

const CareerCard: React.FC<{ career: typeof careers[0] }> = ({ career }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="min-w-[280px] md:min-w-[320px] bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer"
  >
    <div className="text-4xl mb-4">{career.icon}</div>
    <h3 className="text-xl font-bold text-[#1E3A5F] mb-1">{career.name}</h3>
    <div className="text-sm text-[#047857] font-medium mb-3">{career.category}</div>
    <div className="space-y-2 border-t border-slate-100 pt-3">
      <div className="flex justify-between text-xs">
        <span className="text-slate-500">Avg. Salary</span>
        <span className="font-bold text-slate-800">{career.salary}</span>
      </div>
      <div className="flex justify-between text-xs">
        <span className="text-slate-500">Market Demand</span>
        <span className="font-bold text-blue-600">{career.demand}</span>
      </div>
    </div>
  </motion.div>
);

// ─── Main Component ─────────────────────────────────────────────────────────
const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white text-slate-800">
      
      {/* ═══════════════ HERO SECTION ═══════════════ */}
      <section className="relative pt-24 pb-16 px-4 overflow-hidden border-b border-slate-100">
        <FloatingCard icon={<ShieldCheck size={18} />} text="Trust Verified" delay={0} top="15%" left="10%" color="bg-[#047857]" />
        <FloatingCard icon={<UserCheck size={18} />} text="10k+ Students" delay={1.5} top="20%" left="75%" color="bg-blue-600" />
        <FloatingCard icon={<Briefcase size={18} />} text="Govt. Jobs" delay={0.8} top="50%" left="5%" color="bg-[#EA580C]" />
        <FloatingCard icon={<TrendingUp size={18} />} text="Future Growth" delay={2.2} top="60%" left="85%" color="bg-[#047857]" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-slate-50 border border-slate-200 text-slate-600 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-8"
          >
            🇮🇳 Government & Professional Guidance for 12th Students
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-heading text-4xl md:text-6xl lg:text-7xl font-black text-[#1E3A5F] leading-[1.1] mb-6 tracking-tight"
          >
            Planning Your Future? <br />
            <span className="text-[#047857]">The Smart Way to Start.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-medium"
          >
            Access official career roadmaps, college databases, and verified 
            scholarships tailored for Telangana & AP students.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Link
              to="/quiz"
              className="inline-flex items-center gap-3 bg-[#EA580C] hover:bg-[#D94E0A] text-white px-10 py-5 rounded-2xl font-heading font-black text-xl transition-all hover:scale-105 active:scale-95 shadow-xl shadow-orange-500/20"
            >
              Start Career Quiz
              <ArrowRight size={24} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════ THE 3 TOOL CARDS ═══════════════ */}
      <section className="px-4 py-20 bg-slate-50/50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group p-8 bg-white border border-slate-200 rounded-3xl hover:border-[#047857] transition-all shadow-sm hover:shadow-xl cursor-pointer"
          >
            <div className="w-14 h-14 bg-[#047857]/10 rounded-2xl flex items-center justify-center text-[#047857] mb-6 group-hover:scale-110 transition-transform">
              <Search size={30} />
            </div>
            <h3 className="text-2xl font-black text-[#1E3A5F] mb-2">College Finder</h3>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">Explore 200+ top colleges across Telangana and Andhra Pradesh with detailed admission guides.</p>
            <div className="flex items-center gap-2 text-[#047857] font-bold group-hover:gap-4 transition-all uppercase text-xs tracking-widest">
              Launch Explorer <ChevronRight size={18} />
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="group p-8 bg-white border border-slate-200 rounded-3xl hover:border-blue-600 transition-all shadow-sm hover:shadow-xl cursor-pointer"
          >
            <div className="w-14 h-14 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform">
              <Trophy size={30} />
            </div>
            <h3 className="text-2xl font-black text-[#1E3A5F] mb-2">Scholarship Hub</h3>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">Verified national and state scholarships. Apply before the deadlines and save on your education.</p>
            <div className="flex items-center gap-2 text-blue-600 font-bold group-hover:gap-4 transition-all uppercase text-xs tracking-widest">
              View Scholarships <ChevronRight size={18} />
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="group p-8 bg-white border border-slate-200 rounded-3xl hover:border-[#EA580C] transition-all shadow-sm hover:shadow-xl cursor-pointer"
          >
            <div className="w-14 h-14 bg-[#EA580C]/10 rounded-2xl flex items-center justify-center text-[#EA580C] mb-6 group-hover:scale-110 transition-transform">
              <ShieldCheck size={30} />
            </div>
            <h3 className="text-2xl font-black text-[#1E3A5F] mb-2">Cert Speller</h3>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">Check your certificate spelling against official records before the admission season starts.</p>
            <div className="flex items-center gap-2 text-[#EA580C] font-bold group-hover:gap-4 transition-all uppercase text-xs tracking-widest">
              Run Check <ChevronRight size={18} />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════ TRENDING CAREERS (NETFLIX STYLE) ═══════════════ */}
      <section className="py-24 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
            <div>
              <h2 className="font-heading text-3xl md:text-4xl font-black text-[#1E3A5F] mb-2">Trending Career Paths</h2>
              <p className="text-slate-500 font-medium">Most explored by Intermediate graduates this season</p>
            </div>
            <Link to="/courses" className="flex items-center gap-2 text-[#047857] font-bold text-sm bg-slate-50 hover:bg-slate-100 px-6 py-3 rounded-full border border-slate-200 transition-colors">
              View All Careers <ArrowRight size={16} />
            </Link>
          </div>
          
          <div className="flex gap-6 overflow-x-auto no-scrollbar pb-8 px-2 -mx-2 snap-x">
            {careers.map((career) => (
              <div key={career.name} className="snap-start">
                <CareerCard career={career} />
              </div>
            ))}
            <div className="min-w-[200px] flex items-center justify-center">
              <Link to="/courses" className="w-16 h-16 bg-slate-50 rounded-full border border-slate-200 shadow-sm flex items-center justify-center text-slate-400 hover:text-[#047857] hover:border-[#047857] hover:bg-white transition-all">
                <ChevronRight size={32} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ CTA SECTION ═══════════════ */}
      <section className="px-4 pb-24">
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-7xl mx-auto bg-[#1E3A5F] rounded-[2rem] p-12 md:p-20 relative overflow-hidden text-center text-white"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#047857] blur-[120px] opacity-20 -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600 blur-[120px] opacity-20 translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative z-10">
            <h2 className="font-heading text-3xl md:text-5xl font-black mb-6">Ready to find your calling?</h2>
            <p className="text-blue-100 text-lg md:text-xl max-w-2xl mx-auto mb-10 opacity-80">
              Join thousands of students who have discovered their ideal careers using our IKIGAI-based assessment.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/quiz"
                className="w-full sm:w-auto bg-[#EA580C] text-white px-10 py-5 rounded-2xl font-heading font-black text-xl hover:bg-[#D94E0A] transition-all shadow-xl shadow-orange-950/20 active:scale-95 flex items-center justify-center gap-2"
              >
                <Sparkles size={24} /> Get Started Free
              </Link>
              <Link
                to="/courses"
                className="w-full sm:w-auto bg-white/10 text-white px-10 py-5 rounded-2xl font-heading font-bold text-xl hover:bg-white/20 transition-all border border-white/20 backdrop-blur-sm flex items-center justify-center gap-2"
              >
                Browse Pathwaus
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default HomePage;