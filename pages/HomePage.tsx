import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// ─── Spring & Easing Constants (Emil Kowalski) ─────────────────────────────
const SPRING_BOUNCE = { type: "spring" as const, stiffness: 400, damping: 30 };
const SPRING_SOFT = { type: "spring" as const, stiffness: 300, damping: 25 };
const ENTRANCE_EASE = [0.22, 1, 0.36, 1] as const;

const staggerContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15 } }
};
const staggerItem = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 300, damping: 25 } }
};

// ─── SVG Underline ──────────────────────────────────────────────────────────
const AnimatedUnderline: React.FC<{ delay?: number }> = ({ delay = 0.5 }) => {
  const pathRef = useRef<SVGPathElement>(null);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const [pathLength, setPathLength] = useState(0);
  useEffect(() => { if (pathRef.current) setPathLength(pathRef.current.getTotalLength()); }, []);
  return (
    <div ref={ref} className="absolute -bottom-2 left-0 w-full">
      <svg viewBox="0 0 300 12" className="w-full h-3" preserveAspectRatio="none">
        <path ref={pathRef} d="M0,8 Q75,0 150,8 Q225,16 300,8" fill="none" stroke="#047857" strokeWidth="4" strokeLinecap="round"
          style={{ strokeDasharray: pathLength || 400, strokeDashoffset: isInView ? 0 : (pathLength || 400), transition: `stroke-dashoffset 0.8s cubic-bezier(0.22,1,0.36,1) ${delay}s` }} />
      </svg>
    </div>
  );
};

// ─── Hero Career Preview Data ───────────────────────────────────────────────
type CareerPreview = { emoji: string; name: string; match: number; salary: string; demand: string; course: string; colleges: string; demandColor: string };


// ─── MAIN COMPONENT ─────────────────────────────────────────────────────────
const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [stickyDismissed, setStickyDismissed] = useState(false);
  
  

  
  
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400 && !stickyDismissed) setShowStickyBar(true);
      else setShowStickyBar(false);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [stickyDismissed]);

  // Refs for in-view triggers
  const howItWorksRef = useRef<HTMLDivElement>(null);
  const howItWorksInView = useInView(howItWorksRef, { once: true, margin: "-50px" });

  const testimonials = [
    { name: 'Priya R.', location: 'Hyderabad', text: 'After EAMCET didn\'t go well, I found 6 other exams I didn\'t know about. Got into BITS! 🎉', time: '2 hours ago' },
    { name: 'Rahul K.', location: 'Vijayawada', text: 'The IKIGAI quiz helped me realize engineering wasn\'t for me. Now studying design at NID 🎨', time: '5 hours ago' },
    { name: 'Sanjana M.', location: 'Warangal', text: 'Found a ₹2L scholarship through this portal that I didn\'t even know existed! 💰', time: '1 day ago' },
    { name: 'Arun P.', location: 'Tirupati', text: 'Was confused between B.Tech and B.Sc. The career quiz gave me clarity in 3 mins ✅', time: '1 day ago' },
    { name: 'Kavya S.', location: 'Guntur', text: 'My parents wanted engineering, quiz showed I\'m perfect for law. Now at NALSAR! ⚖️', time: '2 days ago' },
    { name: 'Venkat R.', location: 'Karimnagar', text: 'COMEDK exam tip from this site — scored 98 percentile. Changed my life 🚀', time: '3 days ago' },
    { name: 'Deepika L.', location: 'Nellore', text: 'I got scholarship alert just in time. ₹1.5L saved on my BBA fees 🙏', time: '3 days ago' },
    { name: 'Srikanth B.', location: 'Khammam', text: 'The college finder comparison feature is amazing. Chose JNTU over Osmania with data! 📊', time: '4 days ago' },
    { name: 'Meera T.', location: 'Kurnool', text: 'Was going to drop a year. Found alternative paths and now in my dream college ❤️', time: '5 days ago' },
    { name: 'Harsha V.', location: 'Nizamabad', text: 'Free and actually useful. No spam. No fake promises. Genuine career guidance 🙌', time: '1 week ago' },
  ];

  
  // Define the base 8 cards as per strict spec rules
  const baseCards = [
    {
      id: "ikigai",
      emoji: "😕",
      problem: "I don't know what career to choose after Inter",
      solutionPreview: "→ IKIGAI quiz finds your perfect career in 3 minutes",
      hoverColor: "#047857",
      hoverBg: "#F0FDF4",
      action: () => navigate('/quiz')
    },
    {
      id: "courses",
      emoji: "📚",
      problem: "I don't know what courses exist after Inter",
      solutionPreview: "→ Explore 100+ courses across all streams",
      hoverColor: "#2563EB",
      hoverBg: "#EFF6FF",
      action: () => navigate('/courses')
    },
    {
      id: "colleges",
      emoji: "🏫",
      problem: "I don't know which college to join",
      solutionPreview: "→ Compare 200+ colleges with real placement data",
      hoverColor: "#7C3AED",
      hoverBg: "#F5F3FF",
      action: () => navigate('/universities')
    },
    {
      id: "scholarships",
      emoji: "💰",
      problem: "I don't know if I qualify for any scholarship",
      solutionPreview: "→ Find TS & AP scholarships worth ₹Lakhs in 2 minutes",
      hoverColor: "#D97706",
      hoverBg: "#FFFBEB",
      action: () => navigate('/scholarships')
    },
    {
      id: "beyond-eamcet",
      emoji: "😰",
      problem: "My EAMCET rank is bad — what do I do now?",
      solutionPreview: "→ 15+ legitimate paths to engineering you don't know",
      hoverColor: "#EA580C",
      hoverBg: "#FFF7ED",
      badge: "⚠️ Don't give up",
      badgeColor: "bg-[#FEE2E2] text-[#DC2626]",
      action: () => navigate('/exam-finder')
    },
    {
      id: "jee-calc",
      emoji: "📊",
      problem: "I can't calculate my JEE marks from answer key",
      solutionPreview: "→ Upload PDF → instant marks + college predictions",
      hoverColor: "#2563EB",
      hoverBg: "#EFF6FF",
      badge: <><span className="w-1.5 h-1.5 rounded-full bg-[#DC2626] animate-pulse mr-1 inline-block" />⏰ Results April 20</>,
      badgeColor: "bg-[#DBEAFE] text-[#1D4ED8] border border-[#BFDBFE]",
      action: () => navigate('/jee-marks-calculator')
    },
    {
      id: "neet",
      emoji: "🔬",
      problem: "NEET didn't go well — is my medical dream over?",
      solutionPreview: "→ 15+ healthcare careers beyond MBBS you can still pursue",
      hoverColor: "#047857",
      hoverBg: "#F0FDF4",
      action: () => navigate('/life-after-neet')
    },
    {
      id: "certificate",
      emoji: "📋",
      problem: "My certificate might have spelling mistakes",
      solutionPreview: "→ Upload & scan instantly before EAMCET counselling",
      hoverColor: "#EA580C",
      hoverBg: "#FFF7ED",
      action: () => navigate('/certificate-checker')
    }
  ];

  
  return (
    <div className="min-h-screen bg-white text-[#0F172A] pb-16 md:pb-0">

      {/* ═══════════════ SECTION 1: GOVERNMENT TRUST BAR ═══════════════ */}
      <div className="bg-[#1E3A5F] h-9 flex justify-center md:justify-between items-center px-4 md:px-6 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 animate-shimmer" style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.05) 50%, transparent 100%)',
            width: '100%',
          }} />
        </div>
        <span className="text-white text-xs relative z-10 truncate">
          🇮🇳&nbsp; Free Career Guidance — Telangana & AP
        </span>
        <span className="text-white text-xs relative z-10 hidden md:block">
          📞 +91 98765 43210 &nbsp;|&nbsp; Telugu &nbsp;|&nbsp; English
        </span>
      </div>

      {/* ═══════════════ SECTION 2: JEE URGENCY BAR ═══════════════ */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => navigate('/jee-marks-calculator')}
        className="bg-[#EA580C] py-2 px-4 flex items-center justify-center gap-3 cursor-pointer hover:bg-[#C2410C] transition-colors">
        <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
        <span className="text-white text-sm font-semibold text-center">⏰ JEE Session 2 Results expected April 20 — Calculate your marks now →</span>
      </motion.div>

      {/* ═══════════════ SECTION 3: HERO — "THE DIGITAL DIPLOMAT" ═══════════════ */}
      <section className="relative min-h-[92vh] flex flex-col justify-center bg-[#F8FAFC] overflow-hidden pt-10 pb-16 px-4 md:px-8">
        
        {/* ── Background: Engineering Dot Grid + Ambient Glows ── */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute inset-0 dot-grid-bg" />
          <div className="absolute top-[15%] -right-[8%] w-[45vw] h-[45vw] rounded-full bg-gradient-to-bl from-[#047857]/8 to-transparent blur-[140px]" />
          <div className="absolute bottom-[5%] -left-[8%] w-[35vw] h-[35vw] rounded-full bg-gradient-to-tr from-[#EA580C]/6 to-transparent blur-[140px]" />
          <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] rounded-full bg-gradient-to-b from-[#047857]/3 to-transparent blur-[200px]" />
        </div>

        {/* ── Live Activity Counter (Floating Top) ── */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, ...SPRING_SOFT }}
          className="absolute top-6 left-1/2 -translate-x-1/2 z-20 w-max max-w-[90vw]"
        >
          <div className="bg-white/90 backdrop-blur-xl border border-[#047857]/15 rounded-full px-4 sm:px-5 py-2 shadow-[0_4px_30px_-10px_rgba(4,120,87,0.15)] flex items-center justify-center gap-2 sm:gap-3">
            <span className="relative flex h-2 w-2 sm:h-2.5 sm:w-2.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75" />
              <span className="relative inline-flex rounded-full h-full w-full bg-[#047857]" />
            </span>
            <span className="text-[11px] sm:text-xs font-bold text-[#0F172A] truncate">
              <span className="font-numbers text-[#047857]">742</span> students exploring careers right now
            </span>
          </div>
        </motion.div>

        <div className="max-w-[85rem] mx-auto w-full grid grid-cols-1 xl:grid-cols-12 gap-10 xl:gap-14 items-center relative z-10">
          
          {/* ─── LEFT: THE AUTHORITY (Text + Trust + CTA) ─── */}
          <div className="xl:col-span-5 flex flex-col items-start pt-14 xl:pt-0">
            
            {/* Trust Badge Pill */}
            <motion.div 
              initial={{ opacity: 0, y: -20, scale: 0.9 }} 
              animate={{ opacity: 1, y: 0, scale: 1 }} 
              transition={{ ...SPRING_BOUNCE, delay: 0.1 }}
              className="inline-flex mx-auto sm:mx-0 items-center justify-center gap-2 bg-white border border-[#047857]/15 shadow-[0_4px_24px_-6px_rgba(4,120,87,0.12)] rounded-full px-3 sm:px-4 py-1.5 sm:py-2 text-[11px] sm:text-[13px] font-bold text-[#047857] mb-6 sm:mb-8"
            >
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              100% Free • Data-Driven • AP & TS
            </motion.div>

            {/* Massive Headline */}
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, ...SPRING_BOUNCE }}
              className="text-[2.5rem] sm:text-[3.25rem] md:text-[3.75rem] lg:text-[4.25rem] font-extrabold text-[#0F172A] leading-[1.1] tracking-tight mb-4 sm:mb-5 font-heading text-center sm:text-left w-full"
            >
              Your Career{' '}
              <span className="relative inline-block">
                <span className="text-[#047857]">Blueprint</span>
                <AnimatedUnderline delay={0.8} />
              </span>
              <br />
              After Inter.
            </motion.h1>

            {/* Sub-headline */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, ...SPRING_BOUNCE }}
              className="text-[15px] md:text-lg text-[#475569] mb-8 font-medium max-w-md leading-relaxed text-center sm:text-left w-full mx-auto sm:mx-0"
            >
              AI-powered matching, 150+ courses, scholarship finder, and exam tracking — all free, all in one place.
            </motion.p>

            {/* Primary CTA */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, ...SPRING_BOUNCE }}
              className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto"
            >
              <motion.button 
                whileHover={{ scale: 1.03, boxShadow: "0 24px 48px -16px rgba(4,120,87,0.4)" }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate('/quiz')}
                className="w-full sm:w-auto bg-[#047857] text-white font-bold rounded-full py-4 px-8 text-lg shadow-[0_10px_35px_rgba(4,120,87,0.25)] flex items-center justify-center gap-3 relative overflow-hidden group cursor-pointer"
              >
                <span className="absolute inset-0 w-full h-full -translate-x-[150%] skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-shine" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#EA580C] animate-pulse shrink-0" />
                Start IKIGAI Quiz
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03, backgroundColor: '#F0FDF4' }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate('/courses')}
                className="w-full sm:w-auto bg-white border-2 border-[#047857]/20 text-[#047857] font-bold rounded-full py-4 px-8 text-base cursor-pointer shadow-sm flex items-center justify-center gap-2"
              >
                Explore All Tools
              </motion.button>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-8 flex items-center justify-center sm:justify-start flex-wrap gap-x-5 gap-y-2 text-[13px] sm:text-sm text-[#64748B] w-full"
            >
              <span className="flex items-center gap-1.5 font-semibold"><span className="text-[#047857] font-numbers font-bold text-base">47K+</span> Students</span>
              <span className="hidden sm:block w-1 h-1 rounded-full bg-slate-300" />
              <span className="flex items-center gap-1.5 font-semibold"><span className="text-[#047857] font-numbers font-bold text-base">150+</span> Courses</span>
              <span className="hidden sm:block w-1 h-1 rounded-full bg-slate-300" />
              <span className="flex items-center gap-1.5 font-semibold"><span className="text-[#047857] font-numbers font-bold text-base">200+</span> Colleges</span>
            </motion.div>
          </div>

          {/* ─── RIGHT: THE ENGINE (INTERACTIVE BENTO DASHBOARD) ─── */}
          <div className="xl:col-span-7 w-full relative mt-8 sm:mt-6 xl:mt-0">
             <motion.div 
               variants={staggerContainer}
               initial="hidden"
               animate="show"
               className="grid grid-cols-6 grid-flow-dense gap-3 sm:gap-4 md:gap-5 auto-rows-[minmax(140px,auto)]"
             >
                {/* ── Node 1: IKIGAI Engine (Large, 4-col, 2-row) ── */}
                <motion.div 
                  variants={staggerItem}
                  whileHover={{ y: -6, scale: 1.015, boxShadow: "0 30px 70px -20px rgba(4,120,87,0.18)" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/quiz')}
                  className="col-span-6 sm:col-span-4 row-span-2 bg-white/90 backdrop-blur-xl border border-[#047857]/10 rounded-[1.75rem] p-6 shadow-[0_20px_60px_-15px_rgba(4,120,87,0.1)] flex flex-col relative overflow-hidden cursor-pointer group"
                >
                   {/* Top Row: Label + Arrow */}
                   <div className="flex items-start justify-between mb-2">
                     <div>
                       <h3 className="text-xl font-extrabold text-[#0F172A] font-heading">AI Career Matcher</h3>
                       <p className="text-[13px] text-[#64748B] font-medium mt-0.5">IKIGAI Assessment • 3 min quiz</p>
                     </div>
                     <div className="w-10 h-10 rounded-full bg-[#ECFDF5] flex items-center justify-center text-[#047857] group-hover:bg-[#047857] group-hover:text-white transition-all duration-200 shrink-0">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                     </div>
                   </div>

                   {/* Breathing SVG Ring + Cycling Avatars */}
                   <div className="flex-1 flex items-center justify-center relative">
                      <svg className="w-44 h-44 transform -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="42" fill="none" stroke="#F1F5F9" strokeWidth="6" />
                        <motion.circle 
                           cx="50" cy="50" r="42" fill="none" stroke="url(#ikigaiGrad)" strokeWidth="6" strokeLinecap="round"
                           initial={{ strokeDasharray: 264, strokeDashoffset: 264 }}
                           animate={{ strokeDashoffset: [264, 50, 264] }}
                           transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                        />
                        <defs>
                          <linearGradient id="ikigaiGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#047857" />
                            <stop offset="100%" stopColor="#10B981" />
                          </linearGradient>
                        </defs>
                      </svg>
                      {/* Orbiting Avatars */}
                      <motion.div 
                         animate={{ rotate: 360 }} 
                         transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                         className="w-44 h-44 absolute rounded-full"
                      >
                         <span className="absolute -top-1 left-1/2 -translate-x-1/2 text-2xl drop-shadow-md">👨‍💻</span>
                         <span className="absolute top-1/2 -right-1 -translate-y-1/2 text-2xl drop-shadow-md">👩‍⚕️</span>
                         <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-2xl drop-shadow-md">⚖️</span>
                         <span className="absolute top-1/2 -left-1 -translate-y-1/2 text-2xl drop-shadow-md">🎨</span>
                      </motion.div>
                      {/* Center Icon */}
                      <div className="absolute text-3xl bg-white shadow-lg p-3.5 rounded-2xl z-10 border border-[#047857]/10">🎯</div>
                   </div>

                   {/* Bottom Chip */}
                   <div className="mt-3 flex items-center gap-2">
                     <span className="bg-[#ECFDF5] text-[#047857] text-[11px] font-bold px-3 py-1 rounded-full">🔥 Most Popular</span>
                     <span className="text-[11px] text-[#64748B] font-medium">47,832 students matched</span>
                   </div>
                </motion.div>

                {/* ── Node 2: Course Library (Tall, 2-col, 2-row) ── */}
                <motion.div 
                  variants={staggerItem}
                  whileHover={{ y: -6, scale: 1.015, boxShadow: "0 25px 60px -20px rgba(37,99,235,0.15)" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/courses')}
                  className="col-span-3 sm:col-span-2 row-span-1 sm:row-span-2 bg-white/90 backdrop-blur-xl border border-[#2563EB]/10 rounded-2xl sm:rounded-[1.75rem] p-4 sm:p-5 shadow-[0_10px_40px_-15px_rgba(37,99,235,0.08)] flex flex-col cursor-pointer group overflow-hidden relative min-h-[140px]"
                >
                   <h3 className="text-[15px] sm:text-[17px] font-extrabold text-[#0F172A] mb-0.5 z-10 group-hover:text-[#2563EB] transition-colors leading-tight font-heading">Course Library</h3>
                   <p className="text-[9px] sm:text-[10px] text-[#64748B] font-bold uppercase tracking-wider mb-2 sm:mb-3 z-10">150+ Courses</p>
                   
                   {/* Vertical Scrolling Marquee */}
                   <div className="flex-1 relative overflow-hidden -mx-1" style={{ maskImage: "linear-gradient(to bottom, transparent, black 8%, black 75%, transparent 100%)", WebkitMaskImage: "linear-gradient(to bottom, transparent, black 8%, black 75%, transparent 100%)" }}>
                      <motion.div 
                         animate={{ y: [0, -380] }}
                         transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                         className="flex flex-col gap-2 px-1"
                      >
                         {['B.Tech CSE', 'MBBS', 'B.Des', 'CA', 'B.Arch', 'Pharm.D', 'BBA', 'BA LLB', 'B.Sc Ag', 'BPT', 'BMS', 'BSW', 'B.Tech ECE', 'BAMS', 'B.Tech CSE', 'MBBS', 'B.Des', 'CA'].map((course, i) => (
                           <div key={i} className="bg-[#F8FAFC] border border-slate-100 py-2 px-3 rounded-xl text-[12px] font-semibold text-slate-600 whitespace-nowrap text-center">
                              {course}
                           </div>
                         ))}
                      </motion.div>
                   </div>
                </motion.div>

                {/* ── Node 3: College & Scholarship Finder (Wide, 4-col, 1-row) ── */}
                <motion.div 
                  variants={staggerItem}
                  whileHover={{ y: -6, scale: 1.015, boxShadow: "0 28px 60px -20px rgba(234,88,12,0.25)" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/universities')}
                  className="col-span-6 sm:col-span-4 row-span-1 bg-gradient-to-br from-[#EA580C] to-[#C2410C] rounded-[1.75rem] p-5 md:p-6 shadow-[0_20px_50px_-15px_rgba(234,88,12,0.25)] flex flex-col justify-center cursor-pointer relative overflow-hidden group"
                >
                   {/* Decorative blur */}
                   <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
                   
                   <div className="flex items-center justify-between mb-3 relative z-10">
                     <div>
                       <p className="text-white/70 font-bold text-[10px] uppercase tracking-wider mb-0.5">Colleges & Scholarships</p>
                       <h3 className="text-lg md:text-xl font-extrabold text-white font-heading leading-tight">Find ₹Lakhs in Govt. Funds</h3>
                     </div>
                     <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center group-hover:bg-white/25 transition-colors shrink-0">
                       <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                     </div>
                   </div>
                   
                   {/* Typewriter Search Bar */}
                   <div className="bg-white/10 p-3 rounded-xl border border-white/15 flex items-center gap-3 w-full backdrop-blur-sm relative z-10">
                      <span className="text-white/40 text-lg">🔍</span>
                      <TypewriterSearch />
                   </div>
                </motion.div>

                {/* ── Node 4: Exams Beyond EAMCET (2-col, 1-row) ── */}
                <motion.div 
                  variants={staggerItem}
                  whileHover={{ y: -6, scale: 1.015, boxShadow: "0 22px 50px -18px rgba(37,99,235,0.18)" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/exam-finder')}
                  className="col-span-3 sm:col-span-2 row-span-1 bg-white/90 backdrop-blur-xl border border-[#2563EB]/10 rounded-2xl sm:rounded-[1.75rem] p-4 sm:p-5 shadow-[0_15px_40px_-15px_rgba(37,99,235,0.08)] flex flex-col justify-between cursor-pointer group relative overflow-hidden"
                >
                   <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-[#EFF6FF] rounded-full blur-2xl" />
                   
                   <div className="flex items-start justify-between relative z-10 mb-2">
                     <h3 className="text-[13px] sm:text-[15px] font-extrabold text-[#0F172A] leading-tight group-hover:text-[#2563EB] transition-colors font-heading pr-1">Exams Beyond EAMCET</h3>
                     <span className="text-base sm:text-lg shrink-0 hidden sm:block">📅</span>
                   </div>
                   
                   {/* Mini Countdown */}
                   <div className="bg-[#EFF6FF] rounded-lg sm:rounded-xl py-2 px-2 flex items-center justify-center gap-1.5 sm:gap-3 mt-auto border border-[#2563EB]/8 relative z-10 w-full object-contain">
                      <ExamCountdown />
                   </div>
                </motion.div>

             </motion.div>
          </div>

        </div>
      </section>

      {/* ═══════════════ SECTION 4: PROBLEM CARDS GRID ═══════════════ */}
      <section className="px-4 pb-20 bg-white relative z-10">
        <div className="max-w-[72rem] mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-[#0F172A] font-heading mt-4">
              Which situation are you in?
            </h2>
            <p className="text-base text-[#64748B] mt-2">
              Tap your situation — we solve it instantly
            </p>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key="default"
              variants={staggerContainer}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5"
            >
              {baseCards.map((card, index) => {
                const isIkigai = card.id === 'ikigai';
                
                // Determine staggered wave delay
                // Wave 1: cards 1-2 (0s), Wave 2: cards 3-5 (0.15s), Wave 3: cards 6-8 (0.3s)
                let waveDelay = 0;
                if (index >= 2 && index <= 4) waveDelay = 0.15;
                if (index > 4) waveDelay = 0.3;

                return (
                  <motion.div
                    key={card.id}
                    layout="position"
                    initial={{ opacity: 0, y: 40, scale: 0.95 }}
                    animate={{ 
                      opacity: 1, 
                      y: 0, 
                      scale: 1,
                      transition: { 
                        delay: waveDelay,
                        type: "spring", 
                        stiffness: 300, 
                        damping: 25 
                      } 
                    }}
                    exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                    whileHover="hover"
                    whileTap={{ scale: 0.97 }}
                    onClick={card.action}
                    className={`group rounded-2xl border p-5 cursor-pointer overflow-hidden relative transition-colors duration-200 ${isIkigai ? 'col-span-1 md:col-span-2 lg:col-span-2 bg-gradient-to-br from-[#047857] to-[#065F46] border-[#047857]' : 'bg-white border-[#E2E8F0]'} flex flex-col h-full z-10 hover:z-20`}
                  >
                    {/* Hover bg/border for non-IKIGAI cards */}
                    {!isIkigai && (
                      <>
                        <motion.div className="absolute inset-0 pointer-events-none" variants={{ hover: { backgroundColor: card.hoverBg } }} transition={{ duration: 0.2 }} />
                        <motion.div className="absolute inset-0 pointer-events-none border-2 rounded-2xl" initial={{ borderColor: 'transparent' }} variants={{ hover: { borderColor: card.hoverColor } }} transition={{ duration: 0.2 }} />
                      </>
                    )}

                    {/* IKIGAI subtle rotating background */}
                    {isIkigai && (
                      <div className="absolute top-1/2 left-3/4 w-[400px] h-[400px] animate-ikigai-rotate pointer-events-none opacity-[0.03] group-hover:opacity-[0.06] transition-opacity" style={{ transform: 'translate(-50%, -50%)' }}>
                        <div className="absolute w-40 h-40 rounded-full border-[20px] border-[#047857] top-0 left-1/4" />
                        <div className="absolute w-40 h-40 rounded-full border-[20px] border-[#047857] top-0 right-1/4" />
                        <div className="absolute w-40 h-40 rounded-full border-[20px] border-[#047857] bottom-0 left-1/4" />
                        <div className="absolute w-40 h-40 rounded-full border-[20px] border-[#047857] bottom-0 right-1/4" />
                      </div>
                    )}

                    <div className="relative z-10 flex-grow flex flex-col">
                      <div className="flex justify-between items-start mb-3">
                        <motion.div 
                          className="text-4xl"
                          variants={{ hover: { scale: 1.2 } }}
                          transition={SPRING_SOFT}
                        >
                          {card.emoji}
                        </motion.div>
                        {card.badge && (
                          <span className={`text-[10px] font-bold px-2 py-1 rounded-full whitespace-nowrap ${card.badgeColor}`}>
                            {card.badge}
                          </span>
                        )}
                      </div>
                      
                      <h3 className={`font-bold leading-snug flex-grow ${isIkigai ? 'text-xl md:text-2xl mt-2 mb-4 max-w-sm text-white' : 'text-base mb-4 text-[#0F172A]'}`}>
                        "{card.problem}"
                      </h3>
                      
                      <motion.div 
                        className={`font-medium text-[13px] flex items-start gap-1 mt-auto ${isIkigai ? 'text-white/80' : ''}`}
                        initial={{ color: isIkigai ? 'rgba(255,255,255,0.8)' : '#64748B' }}
                        variants={isIkigai ? {} : { hover: { color: card.hoverColor } }}
                      >
                        <span className="shrink-0 pt-0.5">{card.solutionPreview.split(' ')[0]}</span>
                        <span>{card.solutionPreview.substring(card.solutionPreview.indexOf(' ') + 1)}</span>
                        <motion.span 
                          variants={{ hover: { x: 4 } }}
                          className="inline-block shrink-0 pt-0.5 ml-auto"
                        >
                          →
                        </motion.span>
                      </motion.div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ═══════════════ SECTION 4: TRUST STRIP ═══════════════ */}
      <section className="w-full bg-[#F0FDF4] border-y border-[#D1FAE5] py-4 overflow-hidden">
        <div className="animate-marquee-left flex items-center gap-8">
          {[1, 2, 3].map((set) => (
            <React.Fragment key={set}>
              <span className="text-[#047857] font-bold text-sm whitespace-nowrap">✓ 47,832 students helped</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#34D399]" />
              <span className="text-[#047857] font-bold text-sm whitespace-nowrap">🔒 100% Free Forever</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#34D399]" />
              <span className="text-[#047857] font-bold text-sm whitespace-nowrap">✓ No Signup Required</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#34D399]" />
              <span className="text-[#047857] font-bold text-sm whitespace-nowrap">📊 NTA Official Data</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#34D399]" />
              <span className="text-[#047857] font-bold text-sm whitespace-nowrap">🎓 BIE TS/AP Referenced</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#34D399]" />
              <span className="text-[#047857] font-bold text-sm whitespace-nowrap">✓ Works on Mobile</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#34D399]" />
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* ═══════════════ SECTION 5: IKIGAI DARK SECTION ═══════════════ */}
      <section className="bg-[#0A0F1E] py-24 px-4 overflow-hidden">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
          {/* Left — IKIGAI Diagram */}
          <div className="relative w-80 h-80 mx-auto md:mr-auto">
            {/* 4 breathing circles — BRIGHTER (FIX 5) */}
            <motion.div initial={{ scale: 0 }} whileInView={{ scale: 1 }} transition={{ ...SPRING_BOUNCE, delay: 0 }} viewport={{ once: true }}
              className="absolute w-44 h-44 rounded-full border-2 animate-breathe-1 flex items-start justify-center pt-6" style={{ top: '5%', left: '15%', borderColor: 'rgba(236,72,153,0.7)', backgroundColor: 'rgba(236,72,153,0.15)' }}>
              <span className="text-pink-300 text-xs font-bold uppercase tracking-wider">❤️ Passion</span>
            </motion.div>
            <motion.div initial={{ scale: 0 }} whileInView={{ scale: 1 }} transition={{ ...SPRING_BOUNCE, delay: 0.3 }} viewport={{ once: true }}
              className="absolute w-44 h-44 rounded-full border-2 animate-breathe-2 flex items-start justify-center pt-6" style={{ top: '5%', right: '15%', borderColor: 'rgba(59,130,246,0.7)', backgroundColor: 'rgba(59,130,246,0.15)' }}>
              <span className="text-blue-300 text-xs font-bold uppercase tracking-wider">💪 Skills</span>
            </motion.div>
            <motion.div initial={{ scale: 0 }} whileInView={{ scale: 1 }} transition={{ ...SPRING_BOUNCE, delay: 0.6 }} viewport={{ once: true }}
              className="absolute w-44 h-44 rounded-full border-2 animate-breathe-3 flex items-end justify-center pb-6" style={{ bottom: '15%', left: '15%', borderColor: 'rgba(245,158,11,0.7)', backgroundColor: 'rgba(245,158,11,0.15)' }}>
              <span className="text-amber-300 text-xs font-bold uppercase tracking-wider">💰 Salary</span>
            </motion.div>
            <motion.div initial={{ scale: 0 }} whileInView={{ scale: 1 }} transition={{ ...SPRING_BOUNCE, delay: 0.9 }} viewport={{ once: true }}
              className="absolute w-44 h-44 rounded-full border-2 animate-breathe-4 flex items-end justify-center pb-6" style={{ bottom: '15%', right: '15%', borderColor: 'rgba(16,185,129,0.7)', backgroundColor: 'rgba(16,185,129,0.15)' }}>
              <span className="text-emerald-300 text-xs font-bold uppercase tracking-wider">🌍 Market</span>
            </motion.div>
            {/* Center glow — BRIGHT WHITE (FIX 5) */}
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-white/30"
              animate={{ boxShadow: ['0 0 30px rgba(255,255,255,0.5)', '0 0 70px rgba(255,255,255,0.9)', '0 0 30px rgba(255,255,255,0.5)'] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
            <span className="absolute top-[48%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-white font-heading font-black text-lg tracking-widest drop-shadow-lg">
              IKIGAI
            </span>
          </div>

          {/* Right — Text */}
          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: ENTRANCE_EASE }}
            >
              <h2 className="text-3xl md:text-5xl font-bold text-white font-heading leading-tight md:leading-tight">
                Most Students Choose Career Randomly.<br />
                <span className="text-[#10B981]">We Use Science.</span>
              </h2>
            </motion.div>

            <div className="mt-10 space-y-6">
              {[
                { icon: '❤️', title: 'What You Love', desc: 'Identify your true passions and interests' },
                { icon: '💪', title: 'What You\'re Good At', desc: 'Discover your natural talents and strengths' },
                { icon: '💰', title: 'What Pays Well', desc: 'Find careers with strong earning potential' },
                { icon: '🌍', title: 'What the World Needs', desc: 'Align with market demand and future trends' },
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.1, duration: 0.5, ease: ENTRANCE_EASE }}
                  viewport={{ once: true }}
                  className="flex items-start gap-5"
                >
                  <span className="text-2xl mt-1 bg-white/5 w-12 h-12 flex items-center justify-center rounded-xl border border-white/10 shrink-0">{item.icon}</span>
                  <div>
                    <h4 className="text-white font-bold text-lg mb-1">{item.title}</h4>
                    <p className="text-slate-400 text-sm">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: '#047857', borderColor: '#047857' }}
              whileTap={{ scale: 0.95 }}
              transition={SPRING_SOFT}
              onClick={() => navigate('/quiz')}
              className="mt-10 border-2 border-[#10B981] text-[#10B981] font-bold rounded-full px-8 py-3 text-sm md:text-base hover:text-white transition-colors cursor-pointer w-full md:w-auto"
            >
              Find My Ideal Career Path →
            </motion.button>
          </div>
        </div>
      </section>

      {/* ═══════════════ SECTION 6: HOW IT WORKS ═══════════════ */}
      <section className="bg-white py-24 px-4 overflow-hidden relative" ref={howItWorksRef}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0F172A] font-heading">
              Your Journey from Confusion to Clarity
            </h2>
          </div>

          <div className="relative">
            {/* SVG Connecting dashed line that draws on scroll (Desktop) */}
            <div className="hidden md:block absolute top-7 left-[12%] right-[12%] z-0">
               <svg width="100%" height="20" viewBox="0 0 100 2" preserveAspectRatio="none">
                 <motion.path 
                   d="M 0 1 L 100 1" 
                   fill="transparent" 
                   stroke="#10B981" 
                   strokeWidth="1" 
                   strokeDasharray="2 2"
                   initial={{ pathLength: 0 }}
                   animate={howItWorksInView ? { pathLength: 1 } : {}}
                   transition={{ duration: 1.5, ease: "easeInOut", delay: 0.2 }}
                 />
               </svg>
            </div>
            
            {/* SVG Connecting dashed line that draws on scroll (Mobile) */}
            <div className="block md:hidden absolute left-7 top-[10%] bottom-[10%] z-0">
               <svg width="2" height="100%" viewBox="0 0 2 100" preserveAspectRatio="none">
                 <motion.path 
                   d="M 1 0 L 1 100" 
                   fill="transparent" 
                   stroke="#10B981" 
                   strokeWidth="1" 
                   strokeDasharray="2 2"
                   initial={{ pathLength: 0 }}
                   animate={howItWorksInView ? { pathLength: 1 } : {}}
                   transition={{ duration: 1.5, ease: "easeInOut", delay: 0.2 }}
                 />
               </svg>
            </div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate={howItWorksInView ? "show" : "hidden"}
              className="flex flex-col md:grid md:grid-cols-4 gap-10 md:gap-4 relative z-10"
            >
              {[
                { step: 1, emoji: '🧠', title: 'Take Quiz', sub: '3 min • Free', desc: 'Answer 15 simple personality questions' },
                { step: 2, emoji: '🎯', title: 'Get Matches', sub: 'Instant • AI Generated', desc: 'See your top 3 career pathways' },
                { step: 3, emoji: '📚', title: 'Explore Path', sub: 'Courses • Colleges', desc: 'Find where to study your chosen field' },
                { step: 4, emoji: '🏆', title: 'Decide Confidently', sub: 'Clear future', desc: 'No more stress. Just action.' },
              ].map((item, index) => (
                <motion.div key={item.step} variants={staggerItem} className="flex md:block items-center md:text-center text-left relative bg-white md:bg-transparent rounded-2xl md:rounded-none p-4 md:p-0 shadow-sm md:shadow-none border border-slate-100 md:border-none">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={howItWorksInView ? { scale: 1 } : {}}
                    transition={{ ...SPRING_BOUNCE, delay: 0.2 + item.step * 0.2 }}
                    className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-[#047857] text-white text-lg font-bold flex items-center justify-center shrink-0 shadow-lg shadow-[#047857]/20 md:mx-auto md:mb-6"
                  >
                    {String(item.step).padStart(2, '0')}
                  </motion.div>
                  <div className="ml-5 md:ml-0">
                    <span className="text-[#047857] font-bold text-xs font-numbers block mb-1">STEP {String(item.step).padStart(2, '0')}</span>
                    <h3 className="font-heading font-extrabold text-[#0F172A] text-lg mb-1">{item.title}</h3>
                    <p className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">{item.sub}</p>
                    <p className="text-sm text-[#64748B] hidden md:block">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════ SECTION 7: SOCIAL PROOF TICKER ═══════════════ */}
      <section className="bg-slate-50 py-20 border-y border-slate-200 overflow-hidden">
        <h2 className="text-center text-2xl md:text-3xl font-bold text-[#0F172A] font-heading mb-12 px-4 max-w-2xl mx-auto">
          Join 47,832+ AP & Telangana Students Finding Their Path
        </h2>

        {/* Row 1 — scrolls left */}
        <div className="overflow-hidden mb-6">
          <div className="animate-ticker-left flex gap-6" style={{ width: 'max-content' }}>
            {[...testimonials.slice(0, 5), ...testimonials.slice(0, 5)].map((t, i) => (
              <div
                key={`r1-${i}`}
                className="w-[300px] md:w-[350px] bg-white rounded-2xl shadow-sm border border-slate-200 p-5 border-l-4 border-l-[#25D366] hover:shadow-md transition-shadow cursor-default"
              >
                <div className="flex gap-1 mb-3">⭐⭐⭐⭐⭐</div>
                <p className="text-sm text-slate-700 leading-relaxed font-medium mb-4">{t.text}</p>
                <div className="flex justify-between items-center mt-auto border-t border-slate-100 pt-3">
                  <div>
                    <p className="text-sm font-bold text-[#0F172A]">{t.name}</p>
                    <p className="text-xs text-[#64748B] flex items-center gap-1">📍 {t.location}</p>
                  </div>
                  <span className="text-[10px] bg-slate-100 px-2 py-1 rounded-full text-[#64748B]">{t.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Row 2 — scrolls right */}
        <div className="overflow-hidden">
          <div className="animate-ticker-right flex gap-6" style={{ width: 'max-content' }}>
            {[...testimonials.slice(5), ...testimonials.slice(5)].map((t, i) => (
              <div
                key={`r2-${i}`}
                className="w-[300px] md:w-[350px] bg-white rounded-2xl shadow-sm border border-slate-200 p-5 border-l-4 border-l-[#25D366] hover:shadow-md transition-shadow cursor-default"
              >
                <div className="flex gap-1 mb-3">⭐⭐⭐⭐⭐</div>
                <p className="text-sm text-slate-700 leading-relaxed font-medium mb-4">{t.text}</p>
                <div className="flex justify-between items-center mt-auto border-t border-slate-100 pt-3">
                  <div>
                    <p className="text-sm font-bold text-[#0F172A]">{t.name}</p>
                    <p className="text-xs text-[#64748B] flex items-center gap-1">📍 {t.location}</p>
                  </div>
                  <span className="text-[10px] bg-slate-100 px-2 py-1 rounded-full text-[#64748B]">{t.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ SECTION 8: FINAL CTA ═══════════════ */}
      <section
        className="py-28 px-4 text-center animate-gradient-shift relative overflow-hidden flex flex-col items-center justify-center min-h-[55vh]"
        style={{ background: 'linear-gradient(135deg, #047857, #1D4ED8, #047857)' }}
      >
        <div className="absolute inset-0 bg-white/5 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px] opacity-10 pointer-events-none" />
        
        <div className="max-w-3xl mx-auto relative z-10 w-full">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: ENTRANCE_EASE }}
            className="text-4xl md:text-6xl font-black text-white font-heading leading-tight"
          >
            Your Answer is<br />
            <span className="text-white">One Tap Away</span>
          </motion.h2>

          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.15 }}
            className="text-white/80 text-lg mt-4 font-medium">Start in the next 5 minutes →</motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5, ...SPRING_BOUNCE }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12 w-full max-w-xl mx-auto"
          >
            <motion.button
              whileHover={{ scale: 1.05, y: -4, boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/quiz')}
              className="w-full sm:w-auto bg-white text-[#047857] rounded-full font-bold py-4 px-10 text-lg font-heading cursor-pointer shadow-xl flex items-center justify-center gap-2"
            >
              Start IKIGAI Quiz <ArrowRight size={20} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.15)', borderColor: 'rgba(255,255,255,0.8)' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/courses')}
              className="w-full sm:w-auto bg-white/10 border-2 border-white/50 backdrop-blur-sm text-white rounded-full py-4 px-10 text-lg font-bold cursor-pointer transition-colors flex items-center justify-center gap-2"
            >
              Explore Courses
            </motion.button>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="mt-8 text-white/80 text-sm flex items-center justify-center gap-4 font-medium"
          >
            <span className="flex items-center gap-1"><ShieldCheck size={16} /> Secure</span>
            <span className="flex items-center gap-1">✨ Free</span>
            <span className="flex items-center gap-1">⚡ Instant</span>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════ FLOATING ELEMENTS ═══════════════ */}

      {/* AI Chatbot (bottom right) */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ ...SPRING_BOUNCE, delay: 2 }}
        className="fixed bottom-24 right-5 z-50 md:bottom-8"
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="relative w-14 h-14 bg-[#047857] rounded-full shadow-xl flex items-center justify-center cursor-pointer border-2 border-white"
        >
          {/* Ping animation */}
          <span className="absolute inset-0 rounded-full bg-[#047857] animate-ping opacity-30" />
          <span className="text-white text-xl relative z-10">🤖</span>
        </motion.button>
        <motion.span
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-3 -right-2 bg-white text-[#047857] text-[10px] font-bold rounded-full px-2 py-0.5 shadow-lg border border-slate-200"
        >
          Ask AI
        </motion.span>
      </motion.div>

      {/* WhatsApp (bottom left) */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ ...SPRING_BOUNCE, delay: 2.2 }}
        className="fixed bottom-24 left-5 z-50 md:bottom-8"
      >
        <motion.a
          href="https://wa.me/919876543210"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-14 h-14 bg-[#25D366] rounded-full shadow-xl flex items-center justify-center border-2 border-white"
        >
          <span className="text-white text-2xl">💬</span>
        </motion.a>
      </motion.div>

      {/* Sticky Hook Bar (Mobile Only) */}
      <AnimatePresence>
        {showStickyBar && !stickyDismissed && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={SPRING_SOFT}
            className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] py-3 px-4 md:hidden"
          >
            <div className="flex items-center justify-between gap-3 max-w-lg mx-auto">
              <div className="flex-1 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#ECFDF5] flex items-center justify-center text-xl shrink-0">🎯</div>
                <div className="text-sm flex flex-col">
                  <span className="font-bold text-[#0F172A] leading-tight">Match Your Career</span>
                  <span className="text-[#047857] font-bold text-[10px] uppercase tracking-wider">Free Quiz</span>
                </div>
              </div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/quiz')}
                className="bg-[#EA580C] text-white text-sm font-bold rounded-full px-5 py-2.5 whitespace-nowrap cursor-pointer shadow-md"
              >
                Start Now
              </motion.button>
              <button
                onClick={() => setStickyDismissed(true)}
                className="text-[#64748B] text-lg leading-none px-2 py-1 cursor-pointer"
                aria-label="Dismiss"
              >
                ✕
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── TypewriterSearch: Cycling search phrases for Scholarship/College node ────
const SEARCH_PHRASES = [
  "Top B.Tech Colleges in Telangana...",
  "100% Free Scholarships for BC...",
  "Best Medical Colleges in AP...",
  "SC/ST Scholarship worth ₹2L...",
  "Top Law Universities in India...",
];

const TypewriterSearch: React.FC = () => {
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const phrase = SEARCH_PHRASES[phraseIdx];
    if (!deleting && charIdx < phrase.length) {
      const t = setTimeout(() => setCharIdx(c => c + 1), 45 + Math.random() * 30);
      return () => clearTimeout(t);
    }
    if (!deleting && charIdx === phrase.length) {
      const t = setTimeout(() => setDeleting(true), 2000);
      return () => clearTimeout(t);
    }
    if (deleting && charIdx > 0) {
      const t = setTimeout(() => setCharIdx(c => c - 1), 22);
      return () => clearTimeout(t);
    }
    if (deleting && charIdx === 0) {
      setDeleting(false);
      setPhraseIdx(p => (p + 1) % SEARCH_PHRASES.length);
    }
  }, [charIdx, deleting, phraseIdx]);

  return (
    <span className="text-white font-semibold text-sm">
      {SEARCH_PHRASES[phraseIdx].slice(0, charIdx)}
      <span className="typing-cursor text-white/60">|</span>
    </span>
  );
};

// ─── ExamCountdown: Live countdown to next major exam ─────────────────────────
const ExamCountdown: React.FC = () => {
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);

  useEffect(() => {
    // Target: JEE Mains Session 2 (approx date)
    const target = new Date('2026-04-20T00:00:00');
    const update = () => {
      const now = new Date();
      const diff = target.getTime() - now.getTime();
      if (diff > 0) {
        setDays(Math.floor(diff / (1000 * 60 * 60 * 24)));
        setHours(Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
      }
    };
    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-1 sm:gap-2 w-full justify-center">
      <div className="flex flex-col items-center">
        <span className="text-[17px] sm:text-xl font-bold text-[#1D4ED8] font-numbers leading-none">{days}</span>
        <span className="text-[7px] sm:text-[8px] font-bold text-[#3B82F6] uppercase mt-0.5">Days</span>
      </div>
      <span className="text-[#3B82F6] font-bold text-base sm:text-lg leading-none mb-2">:</span>
      <div className="flex flex-col items-center">
        <span className="text-[17px] sm:text-xl font-bold text-[#1D4ED8] font-numbers leading-none">{hours}</span>
        <span className="text-[7px] sm:text-[8px] font-bold text-[#3B82F6] uppercase mt-0.5">Hrs</span>
      </div>
      <span className="text-[7.5px] sm:text-[9px] text-[#64748B] font-bold ml-0.5 sm:ml-1 leading-tight text-left">JEE<br/>Results</span>
    </div>
  );
};

// Imported arrow right icon for buttons
const ArrowRight = ({ size = 24 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14"></path>
    <path d="m12 5 7 7-7 7"></path>
  </svg>
);

// Imported ShieldCheck icon
const ShieldCheck = ({ size = 24 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.5 3.8 17 5 19 5a1 1 0 0 1 1 1z"></path>
    <path d="m9 12 2 2 4-4"></path>
  </svg>
);

export default HomePage;