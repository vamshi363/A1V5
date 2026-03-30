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
const HERO_CAREERS: Record<string, CareerPreview[]> = {
  default: [
    { emoji: '💻', name: 'Software Engineer / AI Developer', match: 94, salary: '₹6L – ₹25L/yr', demand: '🔥 Very High', course: 'B.Tech CSE', colleges: '📍 JNTU Hyd • NIT Warangal • BITS', demandColor: 'bg-red-50 text-red-600' },
    { emoji: '🩺', name: 'Doctor / MBBS', match: 87, salary: '₹8L – ₹35L/yr', demand: '🔥 Very High', course: 'MBBS', colleges: '📍 Osmania Medical • Gandhi Medical', demandColor: 'bg-red-50 text-red-600' },
    { emoji: '🎨', name: 'UI/UX Designer', match: 81, salary: '₹5L – ₹20L/yr', demand: '✅ High', course: 'B.Des', colleges: '📍 NIFT • Woxsen University', demandColor: 'bg-green-50 text-green-600' },
  ],
  MPC: [
    { emoji: '💻', name: 'Software Engineer / AI Developer', match: 94, salary: '₹6L – ₹25L/yr', demand: '🔥 Very High', course: 'B.Tech CSE', colleges: '📍 JNTU Hyd • NIT Warangal • BITS', demandColor: 'bg-red-50 text-red-600' },
    { emoji: '🏗️', name: 'Architect / Civil Engineer', match: 85, salary: '₹4L – ₹18L/yr', demand: '⚡ Growing', course: 'B.Arch', colleges: '📍 JNAFAU • NIT Warangal', demandColor: 'bg-amber-50 text-amber-600' },
    { emoji: '📊', name: 'Data Scientist', match: 82, salary: '₹8L – ₹30L/yr', demand: '🔥 Very High', course: 'B.Tech + MS', colleges: '📍 IIT Hyd • IIIT Hyd', demandColor: 'bg-red-50 text-red-600' },
  ],
  BiPC: [
    { emoji: '🩺', name: 'Doctor / MBBS', match: 94, salary: '₹8L – ₹35L/yr', demand: '🔥 Very High', course: 'MBBS', colleges: '📍 Osmania Medical • Gandhi Medical', demandColor: 'bg-red-50 text-red-600' },
    { emoji: '🧬', name: 'Pharmacist / Biotech', match: 87, salary: '₹4L – ₹15L/yr', demand: '⚡ Growing', course: 'B.Pharm', colleges: '📍 NIPER Hyd • AU Vizag', demandColor: 'bg-amber-50 text-amber-600' },
    { emoji: '🏃', name: 'Physiotherapist', match: 81, salary: '₹4L – ₹12L/yr', demand: '✅ High', course: 'BPT', colleges: '📍 NTR Health Univ • SVIMS', demandColor: 'bg-green-50 text-green-600' },
  ],
  'MEC/CEC': [
    { emoji: '📊', name: 'Chartered Accountant', match: 94, salary: '₹7L – ₹22L/yr', demand: '✅ High', course: 'B.Com + CA', colleges: '📍 Osmania • St Josephs', demandColor: 'bg-green-50 text-green-600' },
    { emoji: '🚀', name: 'Entrepreneur / MBA', match: 87, salary: '₹5L – ₹50L+/yr', demand: '🔥 Very High', course: 'BBA / MBA', colleges: '📍 ISB Hyd • IIM Vizag', demandColor: 'bg-red-50 text-red-600' },
    { emoji: '💼', name: 'Investment Banker', match: 81, salary: '₹10L – ₹40L/yr', demand: '✅ High', course: 'B.Com Hons', colleges: '📍 Loyola • Christ Univ', demandColor: 'bg-green-50 text-green-600' },
  ],
  'HEC/Arts': [
    { emoji: '🏛️', name: 'Civil Services / IAS', match: 94, salary: '₹6L – ₹18L/yr', demand: '✅ High', course: 'BA / B.Sc', colleges: '📍 Nizam College • Osmania', demandColor: 'bg-green-50 text-green-600' },
    { emoji: '⚖️', name: 'Lawyer / Legal', match: 87, salary: '₹5L – ₹25L/yr', demand: '✅ High', course: 'BA LLB', colleges: '📍 NALSAR Hyd • Pendekanti', demandColor: 'bg-green-50 text-green-600' },
    { emoji: '📚', name: 'Psychologist / Professor', match: 81, salary: '₹4L – ₹12L/yr', demand: '⚡ Growing', course: 'BA Psychology', colleges: '📍 Osmania • EFLU Hyd', demandColor: 'bg-amber-50 text-amber-600' },
  ],
};

const AVATARS = [
  { initial: 'P', gradient: 'from-pink-400 to-rose-500' },
  { initial: 'R', gradient: 'from-blue-400 to-indigo-500' },
  { initial: 'S', gradient: 'from-green-400 to-emerald-500' },
  { initial: 'A', gradient: 'from-amber-400 to-orange-500' },
  { initial: 'K', gradient: 'from-purple-400 to-violet-500' },
];

// ─── MAIN COMPONENT ─────────────────────────────────────────────────────────
const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [stickyDismissed, setStickyDismissed] = useState(false);
  const [selectedStream, setSelectedStream] = useState<string | null>(null);
  const [activeCareerIdx, setActiveCareerIdx] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem('student_stream');
    if (saved) setSelectedStream(saved);
  }, []);

  const handleStreamSelect = (stream: string) => {
    if (selectedStream === stream) {
      setSelectedStream(null);
      localStorage.removeItem('student_stream');
    } else {
      setSelectedStream(stream);
      localStorage.setItem('student_stream', stream);
    }
    setActiveCareerIdx(0);
  };

  // Career cycling every 3s
  useEffect(() => {
    const careers = HERO_CAREERS[selectedStream || 'default'];
    const interval = setInterval(() => {
      setActiveCareerIdx(prev => (prev + 1) % careers.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [selectedStream]);

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

  const streams = [
    { id: 'MPC', title: 'MPC', sub: 'Maths, Physics, Chem', icon: '📐', theme: 'blue', hoverBg: 'hover:bg-[#EFF6FF]', hoverBorder: 'hover:border-[#2563EB]', hoverText: 'group-hover:text-[#2563EB]', activeBg: 'bg-[#EFF6FF]', activeBorder: 'border-[#2563EB]', activeText: 'text-[#2563EB]' },
    { id: 'BiPC', title: 'BiPC', sub: 'Biology, Physics, Chem', icon: '🔬', theme: 'green', hoverBg: 'hover:bg-[#F0FDF4]', hoverBorder: 'hover:border-[#047857]', hoverText: 'group-hover:text-[#047857]', activeBg: 'bg-[#F0FDF4]', activeBorder: 'border-[#047857]', activeText: 'text-[#047857]' },
    { id: 'MEC/CEC', title: 'MEC/CEC', sub: 'Commerce Stream', icon: '💼', theme: 'gold', hoverBg: 'hover:bg-[#FFFBEB]', hoverBorder: 'hover:border-[#D97706]', hoverText: 'group-hover:text-[#D97706]', activeBg: 'bg-[#FFFBEB]', activeBorder: 'border-[#D97706]', activeText: 'text-[#D97706]' },
    { id: 'HEC/Arts', title: 'HEC/Arts', sub: 'Humanities Stream', icon: '🎭', theme: 'purple', hoverBg: 'hover:bg-[#FDF4FF]', hoverBorder: 'hover:border-[#9333EA]', hoverText: 'group-hover:text-[#9333EA]', activeBg: 'bg-[#FDF4FF]', activeBorder: 'border-[#9333EA]', activeText: 'text-[#9333EA]' },
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

  // Derive which cards to prioritize based on the selected stream
  const getCardsForStream = () => {
    // We do NOT create different card sets. We just reorder and optionally emphasize.
    // Spec rule 5: the default order is very strict for the general view.
    let cards = [...baseCards];
    
    // Simple reordering based on stream
    if (selectedStream === 'MPC') {
      // Bring JEE calc right after the first 2-col IKIGAI card, before courses
      const jee = cards.find(c => c.id === 'jee-calc')!;
      const beyondEamcet = cards.find(c => c.id === 'beyond-eamcet')!;
      cards = cards.filter(c => c.id !== 'jee-calc' && c.id !== 'beyond-eamcet');
      cards.splice(1, 0, jee, beyondEamcet); // Insert immediately after IKIGAI
    } else if (selectedStream === 'BiPC') {
      // Bring NEET card up
      const neet = cards.find(c => c.id === 'neet')!;
      cards = cards.filter(c => c.id !== 'neet');
      cards.splice(1, 0, neet);
    } else if (selectedStream === 'MEC/CEC' || selectedStream === 'HEC/Arts') {
      // De-prioritize engineering/medical cards by pushing them to the end
      const calc = cards.find(c => c.id === 'jee-calc')!;
      const eamcet = cards.find(c => c.id === 'beyond-eamcet')!;
      const neet = cards.find(c => c.id === 'neet')!;
      cards = cards.filter(c => !['jee-calc', 'beyond-eamcet', 'neet'].includes(c.id));
      cards.push(calc, eamcet, neet);
    }
    
    return cards;
  };

  const displayCards = getCardsForStream();

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

      {/* ═══════════════ SECTION 3: HERO (Premium Rebuild) ═══════════════ */}
      <section className="relative min-h-[90vh] flex flex-col justify-center bg-[#F8FAFC] overflow-hidden pt-12 pb-20 px-4 md:px-8 border-b border-slate-200">
        
        {/* Aceternity-style Beams / Globs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-[20%] -right-[10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-br from-[#047857]/10 to-transparent blur-[100px]" />
          <div className="absolute top-[40%] -left-[10%] w-[40vw] h-[40vw] rounded-full bg-gradient-to-tr from-[#2563EB]/10 to-transparent blur-[100px]" />
          
          {/* Subtle Grid Background */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMTUsIDIzLCA0MiwgMC4wNSkiLz48L3N2Zz4=')] [mask-image:linear-gradient(to_bottom,white,transparent)] opacity-60" />
        </div>

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center relative z-10">
          
          {/* ─── LEFT: CONTENT ─── */}
          <div className="lg:col-span-6 flex flex-col items-start">
            
            {/* Government Trust Badge */}
            <motion.div 
              initial={{ opacity: 0, y: -20, scale: 0.9 }} 
              animate={{ opacity: 1, y: 0, scale: 1 }} 
              transition={{ type: "spring", bounce: 0.5, duration: 0.8 }}
              className="inline-flex items-center gap-2.5 bg-white border border-[#047857]/20 shadow-sm rounded-full px-4 py-2 text-sm font-semibold text-[#047857] mb-8"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#047857] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#047857]"></span>
              </span>
              🏛️ Official Guidance • Telangana & AP
            </motion.div>

            {/* Headline */}
            <h1 className="text-[2.75rem] md:text-6xl font-extrabold text-[#0F172A] leading-[1.15] tracking-tight mb-6">
              Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#047857] to-[#10B981]">Perfect Career</span>
              <br />
              <span className="relative inline-block mt-2">
                After Inter.
                <AnimatedUnderline delay={0.4} />
              </span>
            </h1>

            {/* "What you get" staggered list */}
            <motion.p 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-lg text-[#64748B] mb-6 font-medium"
            >
              Take our 3-minute AI quiz to instantly unlock:
            </motion.p>
            
            <motion.ul 
              variants={{
                hidden: { opacity: 0 },
                show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.4 } }
              }}
              initial="hidden"
              animate="show"
              className="space-y-3 mb-10 w-full max-w-md"
            >
              {[
                { emoji: "🎯", text: "Top 3 personalized career matches" },
                { emoji: "📚", text: "Exact courses clearly mapped out" },
                { emoji: "🏛️", text: "Best colleges in AP & Telangana" },
                { emoji: "📝", text: "Which entrance exams to write" },
                { emoji: "💰", text: "Hidden scholarships you qualify for" }
              ].map((item, i) => (
                <motion.li 
                  key={i}
                  variants={{
                    hidden: { opacity: 0, x: -20 },
                    show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
                  }}
                  className="flex items-center gap-3 bg-white/60 backdrop-blur-sm border border-slate-200/50 p-3 rounded-xl shadow-sm"
                >
                  <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#F0FDF4] text-lg shrink-0">
                    {item.emoji}
                  </span>
                  <span className="text-[#0F172A] font-semibold text-[15px]">{item.text}</span>
                </motion.li>
              ))}
            </motion.ul>

            {/* Big CTA */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.8, type: "spring", stiffness: 300, damping: 20 }}
              className="w-full sm:w-auto flex flex-col items-center sm:items-start"
            >
              <motion.button 
                whileHover={{ scale: 1.03, boxShadow: "0 20px 40px -15px rgba(234, 88, 12, 0.5)" }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate('/quiz')}
                className="w-full sm:w-auto bg-[#EA580C] hover:bg-[#C2410C] text-white font-bold rounded-full py-4 px-10 text-lg shadow-[0_8px_30px_rgb(234,88,12,0.3)] flex items-center justify-center gap-2 transition-colors relative overflow-hidden group"
              >
                {/* Shine effect (defined in index.html) */}
                <span className="absolute inset-0 w-full h-full -translate-x-[150%] skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-shine" />
                <span>Start Free Discovery</span>
                <svg className="w-5 h-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </motion.button>
              
              {/* Trust Subtext */}
              <div className="flex items-center gap-4 mt-4 text-[13px] font-semibold text-[#64748B]">
                <span className="flex items-center gap-1"><span className="text-[#047857]">✓</span> 100% Free</span>
                <span className="w-1 h-1 rounded-full bg-slate-300" />
                <span className="flex items-center gap-1"><span className="text-[#047857]">✓</span> No Signup needed</span>
              </div>
            </motion.div>

            {/* Social Proof Avatars */}
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              transition={{ delay: 1 }}
              className="flex items-center gap-3 mt-10"
            >
              <div className="flex -space-x-3">
                {['👨‍💻', '👩‍⚕️', '👷‍♂️', '👩‍⚖️', '👨‍🏫'].map((emoji, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ scale: 0, x: -20 }}
                    animate={{ scale: 1, x: 0 }}
                    transition={{ delay: 1.1 + (i * 0.1), type: "spring", stiffness: 400, damping: 25 }}
                    className="w-10 h-10 rounded-full bg-white border-2 border-[#F8FAFC] shadow-sm flex items-center justify-center text-lg relative"
                    style={{ zIndex: 10 - i }}
                  >
                    {emoji}
                  </motion.div>
                ))}
              </div>
              <div className="flex flex-col">
                <div className="flex text-[#F59E0B] text-sm">★★★★★</div>
                <span className="text-sm font-bold text-[#0F172A]">Joined by 47,832+ students</span>
              </div>
            </motion.div>

          </div>

          {/* ─── RIGHT: LIVE GENERATIVE PREVIEW ─── */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 24, delay: 0.4 }}
            style={{ perspective: '2000px' }}
            className="lg:col-span-6 w-full max-w-lg mx-auto lg:ml-auto relative"
          >
            {/* Main Premium Card Container - Glassmorphic */}
            <div className="relative w-full bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl p-6 shadow-[0_40px_100px_-20px_rgba(4,120,87,0.15)] ring-1 ring-slate-900/5">
              
              {/* Card Header */}
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                    <span className="text-[11px] font-bold text-[#10B981] uppercase tracking-wider">Live Analysis</span>
                  </div>
                  <h3 className="text-sm text-[#64748B] font-semibold">Generating perfect match...</h3>
                </div>
                <div className="w-10 h-10 rounded-full bg-[#F1F5F9] flex items-center justify-center">
                  <span className="text-xl">✨</span>
                </div>
              </div>

              {/* Cycling Career Item */}
              <AnimatePresence mode="wait">
                <motion.div 
                  key={activeCareerIdx + (selectedStream || 'default')}
                  initial={{ opacity: 0, x: 20, filter: "blur(4px)" }} 
                  animate={{ opacity: 1, x: 0, filter: "blur(0)" }}
                  exit={{ opacity: 0, x: -20, filter: "blur(4px)" }}
                  transition={{ type: "spring", stiffness: 350, damping: 25, duration: 0.3 }}
                  className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm"
                >
                  {(() => {
                    const careers = (selectedStream && HERO_CAREERS[selectedStream]) ? HERO_CAREERS[selectedStream] : HERO_CAREERS.default;
                    const career = careers[activeCareerIdx % careers.length] || careers[0];
                    return (
                      <>
                        <div className="flex gap-4 items-start mb-4">
                          <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-3xl shadow-inner shrink-0 border border-slate-100/50">
                            {career.emoji}
                          </div>
                          <div>
                            <h4 className="text-lg font-bold text-[#0F172A] leading-tight mb-1">{career.name}</h4>
                            <div className="flex flex-wrap gap-2">
                              <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#ECFDF5] text-[#047857] border border-[#047857]/10">
                                Match: {career.match}%
                              </span>
                              <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#EFF6FF] text-[#2563EB] border border-[#2563EB]/10">
                                {career.salary}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Match Bar */}
                        <div className="mb-4">
                          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }} 
                              animate={{ width: `${career.match}%` }}
                              transition={{ duration: 1, ease: "easeOut", type: "spring", bounce: 0 }}
                              className="h-full bg-gradient-to-r from-[#10B981] to-[#047857] rounded-full" 
                            />
                          </div>
                        </div>
                        
                        {/* Requirement Chips */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-[13px] bg-slate-50 border border-slate-100 p-2 rounded-lg">
                            <span className="w-5 text-center text-slate-400">📚</span>
                            <span className="font-semibold text-[#0F172A] truncate">{career.course}</span>
                          </div>
                          <div className="flex items-center gap-2 text-[13px] bg-slate-50 border border-slate-100 p-2 rounded-lg">
                            <span className="w-5 text-center text-slate-400">🏛️</span>
                            <span className="text-[#64748B] font-medium truncate">{career.colleges}</span>
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </motion.div>
              </AnimatePresence>

              {/* Progress Dots */}
              <div className="flex justify-center gap-2 mt-5">
                {HERO_CAREERS[selectedStream || 'default'].map((_, i) => (
                  <motion.div 
                    key={i} 
                    className={`h-1.5 rounded-full transition-colors ${i === (activeCareerIdx % 3) ? 'bg-[#047857]' : 'bg-slate-200'}`}
                    animate={{ width: i === (activeCareerIdx % 3) ? 24 : 6 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  />
                ))}
              </div>
            </div>

            {/* Floating Floating Cards (Decorations) */}
            <motion.div 
              animate={{ y: [0, -10, 0] }} 
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-6 -right-6 lg:-right-10 bg-white rounded-2xl shadow-xl p-4 border border-slate-100 z-20 flex items-center gap-3 backdrop-blur-md"
            >
              <div className="w-8 h-8 rounded-full bg-[#FEF3C7] text-[#D97706] flex items-center justify-center text-lg">💰</div>
              <div>
                <p className="text-[11px] font-bold text-[#0F172A]">Scholarship Found!</p>
                <p className="text-[10px] text-[#64748B]">Eligible for TS Epass</p>
              </div>
            </motion.div>

            <motion.div 
              animate={{ y: [0, 10, 0] }} 
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -bottom-6 -left-6 lg:-left-10 bg-[#0F172A] rounded-2xl shadow-xl p-4 border border-slate-800 z-20 flex items-center gap-3"
            >
              <div className="w-8 h-8 rounded-full bg-[#1E293B] text-white flex items-center justify-center text-lg">🚀</div>
              <div>
                <p className="text-[11px] font-bold text-white">Path Unlocked</p>
                <p className="text-[10px] text-slate-400">Engineering Roadmap</p>
              </div>
            </motion.div>

          </motion.div>
        </div>
      </section>

      {/* ─── STREAM SELECTOR PANEL ─── */}
      <section className="px-4 py-8 bg-[#F8FAFC] border-b border-slate-200 relative z-10">
        <div className="max-w-5xl mx-auto">
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-6">
            <div className="shrink-0 flex items-center gap-3 text-center md:text-left">
              <span className="text-2xl hidden md:block">⚡</span>
              <div>
                <h3 className="text-sm font-bold text-[#0F172A]">Explore by your Inter Stream</h3>
                <p className="text-xs text-[#64748B] font-medium hidden sm:block">Select below to preview specific careers above</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:flex flex-wrap md:flex-nowrap gap-2 sm:gap-3 w-full md:w-auto">
              {streams.map((stream) => {
                const isActive = selectedStream === stream.id;
                return (
                  <motion.button 
                    key={stream.id} 
                    onClick={() => handleStreamSelect(stream.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.95 }} 
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    className={`flex-1 md:w-32 py-3 px-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer border-2 transition-all ${
                      isActive 
                        ? `${stream.activeBg} ${stream.activeBorder} shadow-sm ring-2 ring-offset-2 ring-transparent ring-offset-[#F8FAFC]` 
                        : `bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-600`
                    }`}
                  >
                    <span className="text-lg">{stream.icon}</span>
                    <span className={`font-bold text-[13px] ${isActive ? stream.activeText : ''}`}>{stream.title}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-center md:justify-between items-center gap-4 max-w-2xl mx-auto border-t border-slate-200/60 pt-6 mt-2">
            
            {/* Trust line */}
            <p className="text-[13px] text-center text-[#64748B] font-medium flex items-center gap-2">
              <span className="text-slate-400">🔒</span> 47,832 students helped · No signup
            </p>

            {/* JEE Urgency bar */}
            <motion.div 
              whileHover={{ scale: 1.02 }} 
              whileTap={{ scale: 0.98 }} 
              onClick={() => navigate('/jee-marks-calculator')}
              className="bg-[#EA580C] rounded-full p-1.5 pl-3 flex items-center justify-between cursor-pointer w-full sm:w-auto shadow-sm"
            >
              <div className="flex items-center gap-2 text-white font-semibold text-xs sm:text-[13px] pr-2">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                ⏰ JEE Session 2 Results
              </div>
              <span className="bg-white text-[#EA580C] font-bold rounded-full px-3 py-1 text-xs whitespace-nowrap">Calculate Now →</span>
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
              key={selectedStream || 'default'}
              variants={staggerContainer}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5"
            >
              {displayCards.map((card, index) => {
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