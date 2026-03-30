import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useMotionValue, useTransform, animate, useInView, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// ─── Spring & Easing Constants (Emil Kowalski) ─────────────────────────────
const SPRING_BOUNCE = { type: "spring" as const, stiffness: 400, damping: 30 };
const SPRING_SOFT = { type: "spring" as const, stiffness: 300, damping: 25 };
const ENTRANCE_EASE = [0.22, 1, 0.36, 1] as const;

// ─── Stagger Container Variants ────────────────────────────────────────────
const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
};

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: ENTRANCE_EASE }
  }
};

// ─── Animated Counter Hook ──────────────────────────────────────────────────
const useAnimatedCounter = (target: number, duration: number = 1.5, inView: boolean = false) => {
  const motionVal = useMotionValue(0);
  const rounded = useTransform(motionVal, (v) => Math.round(v));
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(motionVal, target, {
      duration,
      ease: ENTRANCE_EASE as unknown as [number, number, number, number],
    });
    const unsub = rounded.on("change", (v) => setDisplay(v));
    return () => { controls.stop(); unsub(); };
  }, [inView, target, duration, motionVal, rounded]);

  return display;
};

// ─── SVG Underline Component ────────────────────────────────────────────────
const AnimatedUnderline: React.FC<{ delay?: number }> = ({ delay = 0.5 }) => {
  const pathRef = useRef<SVGPathElement>(null);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const [pathLength, setPathLength] = useState(0);

  useEffect(() => {
    if (pathRef.current) {
      setPathLength(pathRef.current.getTotalLength());
    }
  }, []);

  return (
    <div ref={ref} className="absolute -bottom-2 left-0 w-full">
      <svg viewBox="0 0 300 12" className="w-full h-3" preserveAspectRatio="none">
        <path
          ref={pathRef}
          d="M0,8 Q75,0 150,8 Q225,16 300,8"
          fill="none"
          stroke="#047857"
          strokeWidth="3"
          strokeLinecap="round"
          style={{
            strokeDasharray: pathLength || 400,
            strokeDashoffset: isInView ? 0 : (pathLength || 400),
            transition: `stroke-dashoffset 0.8s cubic-bezier(0.22,1,0.36,1) ${delay}s`,
          }}
        />
      </svg>
    </div>
  );
};

// ─── Scholarship Counter Component ──────────────────────────────────────────
const ScholarshipCounter: React.FC<{ isHovered: boolean }> = ({ isHovered }) => {
  const motionVal = useMotionValue(0);
  const rounded = useTransform(motionVal, (v) => {
    return `₹${Math.round(v).toLocaleString('en-IN')}`;
  });
  const [display, setDisplay] = useState('₹0');

  useEffect(() => {
    if (isHovered) {
      const controls = animate(motionVal, 240000, {
        duration: 1.5,
        ease: ENTRANCE_EASE as unknown as [number, number, number, number],
      });
      const unsub = rounded.on("change", (v) => setDisplay(v));
      return () => { controls.stop(); unsub(); };
    } else {
      motionVal.set(0);
      setDisplay('₹0');
    }
  }, [isHovered, motionVal, rounded]);

  return (
    <span className="font-numbers font-extrabold text-2xl text-[#D97706]">
      {display}
    </span>
  );
};

// ─── Tilt Card Hook ─────────────────────────────────────────────────────────
const useTiltCard = () => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-0.5, 0.5], [2, -2]);
  const rotateY = useTransform(x, [-0.5, 0.5], [-2, 2]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const normalX = (e.clientX - rect.left) / rect.width - 0.5;
    const normalY = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(normalX);
    y.set(normalY);
  }, [x, y]);

  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  return { ref, rotateX, rotateY, handleMouseMove, handleMouseLeave };
};

// ─── Social Proof Card ──────────────────────────────────────────────────────
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

// ─── MAIN COMPONENT ─────────────────────────────────────────────────────────
const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [stickyDismissed, setStickyDismissed] = useState(false);
  const [scholarshipHovered, setScholarshipHovered] = useState(false);
  const [examsHovered, setExamsHovered] = useState(false);

  // Scroll handler for sticky bar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300 && !stickyDismissed) {
        setShowStickyBar(true);
      } else {
        setShowStickyBar(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [stickyDismissed]);

  // Refs for in-view triggers
  const statsRef = useRef<HTMLDivElement>(null);
  const statsInView = useInView(statsRef, { once: true, margin: "-50px" });
  const howItWorksRef = useRef<HTMLDivElement>(null);
  const howItWorksInView = useInView(howItWorksRef, { once: true, margin: "-50px" });

  // Animated stat counters
  const coursesCount = useAnimatedCounter(100, 1.5, statsInView);
  const careersCount = useAnimatedCounter(50, 1.5, statsInView);
  const collegesCount = useAnimatedCounter(200, 1.5, statsInView);
  const scholarshipsCount = useAnimatedCounter(50, 1.5, statsInView);

  return (
    <div className="min-h-screen bg-white text-[#0F172A]">

      {/* ═══════════════ SECTION 1: GOVERNMENT TRUST BAR ═══════════════ */}
      <div className="bg-[#1E3A5F] h-9 flex justify-between items-center px-4 md:px-6 relative overflow-hidden">
        {/* Shimmer effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 animate-shimmer" style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.05) 50%, transparent 100%)',
            width: '100%',
          }} />
        </div>
        <span className="text-white text-xs relative z-10 truncate">
          🇮🇳&nbsp; Free Career Guidance Portal — Telangana & Andhra Pradesh
        </span>
        <span className="text-white text-xs relative z-10 hidden md:block">
          📞 +91 98765 43210 &nbsp;|&nbsp; Telugu &nbsp;|&nbsp; English
        </span>
      </div>

      {/* ═══════════════ SECTION 2: HERO ═══════════════ */}
      <section className="relative pt-16 md:pt-20 pb-16 px-4 overflow-hidden bg-white">
        {/* Dot grid background texture */}
        <div className="absolute inset-0 dot-grid-bg pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          {/* Animated Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={SPRING_BOUNCE}
            className="inline-flex items-center gap-2 bg-[#ECFDF5] border border-[#047857]/30 rounded-full px-4 py-1.5 mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-[#047857] animate-pulse" />
            <span className="text-sm text-[#047857] font-medium">
              🏛️ India's Free Career Guidance Portal
            </span>
          </motion.div>

          {/* Headline — staggered word animation */}
          <div className="mb-4">
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold leading-tight text-[#0F172A]">
              {'Confused After Inter?'.split(' ').map((word, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.15 + i * 0.05, ease: ENTRANCE_EASE }}
                  className="inline-block mr-3"
                >
                  {word}
                </motion.span>
              ))}
            </h1>
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold leading-tight text-[#047857] relative inline-block mt-1">
              {'We\'ll Find Your Path.'.split(' ').map((word, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.35 + i * 0.05, ease: ENTRANCE_EASE }}
                  className="inline-block mr-3"
                >
                  {word}
                </motion.span>
              ))}
              <AnimatedUnderline delay={0.8} />
            </h1>
          </div>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5, ease: ENTRANCE_EASE }}
            className="text-lg text-[#64748B] mt-6 max-w-2xl mx-auto text-center leading-relaxed"
          >
            Free career guidance for students in Telangana & Andhra Pradesh — no signup needed
          </motion.p>
        </div>

        {/* ═══════════════ 5 FEATURE CARDS ═══════════════ */}
        <div className="max-w-6xl mx-auto mt-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-[#0F172A] font-heading">
              Everything You Need to Decide Your Future
            </h2>
            <p className="text-base text-[#64748B] mt-2">
              Tap any feature to get started instantly
            </p>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-5"
          >
            {/* ──── ROW 1: IKIGAI (2/3) + Course (1/3) ──── */}
            <motion.div variants={staggerItem} className="md:col-span-2">
              {/* CARD 1 — IKIGAI CAREER QUIZ (HERO CARD) */}
              <motion.div
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
                transition={SPRING_SOFT}
                onClick={() => navigate('/quiz')}
                className="group bg-gradient-to-br from-[#047857] to-[#065F46] rounded-3xl p-6 md:p-8 overflow-hidden relative cursor-pointer h-full"
              >
                {/* Animated IKIGAI circles background */}
                <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] animate-ikigai-rotate pointer-events-none" style={{ transform: 'translate(-50%, -50%)' }}>
                  <div className="absolute w-32 h-32 rounded-full bg-white/[0.06] top-0 left-1/4" />
                  <div className="absolute w-32 h-32 rounded-full bg-white/[0.06] top-0 right-1/4" />
                  <div className="absolute w-32 h-32 rounded-full bg-white/[0.06] bottom-0 left-1/4" />
                  <div className="absolute w-32 h-32 rounded-full bg-white/[0.06] bottom-0 right-1/4" />
                </div>

                <div className="relative z-10">
                  {/* Top row */}
                  <div className="flex justify-between items-center mb-4">
                    <span className="bg-white/20 text-white/90 text-xs rounded-full px-3 py-1 font-medium">
                      ⭐ Most Popular Feature
                    </span>
                    <span className="bg-white/20 text-white text-xs rounded-full px-3 py-1 font-medium">
                      Free →
                    </span>
                  </div>

                  {/* Content */}
                  <div className="text-5xl mb-3">🎯</div>
                  <h3 className="text-2xl font-bold text-white font-heading">IKIGAI Career Quiz</h3>
                  <p className="text-white/80 text-sm mt-2 leading-relaxed max-w-md">
                    Discover your perfect career in 3 minutes. Our AI analyzes your passion, skills,
                    salary goals and market demand to find YOUR ideal path.
                  </p>

                  {/* Dimension chips */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    {['❤️ Passion', '💪 Skills', '💰 Value', '🌍 Market'].map((chip) => (
                      <span key={chip} className="bg-white/15 text-white text-xs rounded-full px-3 py-1">
                        {chip}
                      </span>
                    ))}
                  </div>

                  {/* Bottom row */}
                  <div className="flex justify-between items-center mt-6">
                    <span className="text-white/60 text-xs">
                      15 questions • 3 minutes • Free
                    </span>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-white text-[#047857] font-bold rounded-full px-6 py-2.5 text-sm"
                    >
                      Start Quiz →
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* CARD 2 — COURSE LIBRARY */}
            <motion.div variants={staggerItem}>
              <motion.div
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
                transition={SPRING_SOFT}
                onClick={() => navigate('/courses')}
                className="group bg-white rounded-3xl p-6 border border-[#E2E8F0] cursor-pointer relative overflow-hidden h-full hover:border-[#2563EB] transition-colors duration-300 hover:bg-[#EFF6FF]"
              >
                <div className="relative z-10">
                  {/* Icon */}
                  <div className="bg-[#EFF6FF] w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-1">
                    📚
                  </div>
                  {/* Badge */}
                  <span className="absolute top-6 right-6 bg-[#DBEAFE] text-[#1D4ED8] text-xs rounded-full px-2 py-1 font-medium">
                    100+ Courses
                  </span>
                  <h3 className="text-xl font-bold text-[#0F172A] mt-3 font-heading">Course Library</h3>
                  <p className="text-sm text-[#64748B] mt-1 leading-relaxed">
                    Engineering, Medicine, Commerce, Arts and 20+ more streams
                  </p>
                  {/* Stream chips */}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {['Engineering', 'MBBS', 'Law', 'Design', 'CA'].map((s, i) => (
                      <motion.span
                        key={s}
                        className="bg-[#EFF6FF] text-[#2563EB] text-xs rounded-full px-2.5 py-1"
                        whileHover={{ scale: 1.05 }}
                        transition={{ delay: i * 0.03 }}
                      >
                        {s}
                      </motion.span>
                    ))}
                  </div>
                  <div className="flex items-center gap-1 mt-4 text-[#2563EB] font-medium text-sm group-hover:gap-2 transition-all">
                    Explore All Courses
                    <motion.span whileHover={{ x: 4 }} className="inline-block">→</motion.span>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* ──── ROW 2: College + Scholarship + Beyond EAMCET ──── */}

            {/* CARD 3 — COLLEGE FINDER */}
            <motion.div variants={staggerItem}>
              <motion.div
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
                transition={SPRING_SOFT}
                onClick={() => navigate('/universities')}
                className="group bg-white rounded-3xl p-6 border border-[#E2E8F0] cursor-pointer relative overflow-hidden h-full hover:border-[#7C3AED] transition-colors duration-300 hover:bg-[#F5F3FF]"
              >
                <div className="relative z-10">
                  <div className="bg-[#F5F3FF] w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-1">
                    🏫
                  </div>
                  <span className="absolute top-6 right-6 bg-[#EDE9FE] text-[#7C3AED] text-xs rounded-full px-2 py-1 font-medium">
                    200+ Colleges
                  </span>
                  <h3 className="text-xl font-bold text-[#0F172A] mt-3 font-heading">College Finder</h3>
                  <p className="text-sm text-[#64748B] mt-1 leading-relaxed">
                    Real placement data for AP & Telangana colleges — compare before you decide
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {['JNTU Hyd', 'NIT Warangal', 'Osmania', 'BITS Hyd'].map((s) => (
                      <motion.span
                        key={s}
                        className="bg-[#F5F3FF] text-[#7C3AED] text-xs rounded-full px-2.5 py-1"
                        layout
                      >
                        {s}
                      </motion.span>
                    ))}
                  </div>
                  <div className="flex items-center gap-1 mt-4 text-[#7C3AED] font-medium text-sm group-hover:gap-2 transition-all">
                    Find Your College <motion.span whileHover={{ x: 4 }} className="inline-block">→</motion.span>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* CARD 4 — SCHOLARSHIP FINDER */}
            <motion.div variants={staggerItem}>
              <motion.div
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
                transition={SPRING_SOFT}
                onClick={() => navigate('/scholarships')}
                onHoverStart={() => setScholarshipHovered(true)}
                onHoverEnd={() => setScholarshipHovered(false)}
                className="group bg-white rounded-3xl p-6 border border-[#E2E8F0] cursor-pointer relative overflow-hidden h-full hover:border-[#D97706] transition-colors duration-300 hover:bg-[#FFFBEB]"
              >
                <div className="relative z-10">
                  <div className="bg-[#FFFBEB] w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-1">
                    💰
                  </div>
                  <span className="absolute top-6 right-6 bg-[#FEF3C7] text-[#D97706] text-xs rounded-full px-2 py-1 font-medium">
                    ₹Lakhs Available
                  </span>
                  <h3 className="text-xl font-bold text-[#0F172A] mt-3 font-heading">Scholarship Finder</h3>
                  <p className="text-sm text-[#64748B] mt-1 leading-relaxed">
                    Find TS & AP government scholarships you qualify for — crores go unclaimed yearly
                  </p>
                  {/* Animated counter */}
                  <div className="mt-3 mb-2">
                    <ScholarshipCounter isHovered={scholarshipHovered} />
                    <p className="text-xs text-[#64748B] mt-0.5">avg scholarship per eligible student</p>
                  </div>
                  <div className="flex items-center gap-1 mt-2 text-[#D97706] font-medium text-sm group-hover:gap-2 transition-all">
                    Check My Eligibility <motion.span whileHover={{ x: 4 }} className="inline-block">→</motion.span>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* CARD 5 — EXAMS BEYOND EAMCET */}
            <motion.div variants={staggerItem}>
              <motion.div
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
                transition={SPRING_SOFT}
                onClick={() => navigate('/exam-finder')}
                onHoverStart={() => setExamsHovered(true)}
                onHoverEnd={() => setExamsHovered(false)}
                className="group bg-white rounded-3xl p-6 border border-[#E2E8F0] cursor-pointer relative overflow-hidden h-full hover:border-[#EA580C] transition-colors duration-300 hover:bg-[#FFF7ED]"
              >
                <div className="relative z-10">
                  <div className="bg-[#FFF7ED] w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-1">
                    📝
                  </div>
                  <span className="absolute top-6 right-6 bg-[#FEE2E2] text-[#DC2626] text-xs rounded-full px-2 py-1 font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626] animate-pulse" />
                    Don't Miss This
                  </span>
                  <h3 className="text-xl font-bold text-[#0F172A] mt-3 font-heading">Exams Beyond EAMCET</h3>
                  <p className="text-sm text-[#64748B] mt-1 leading-relaxed">
                    Bad EAMCET rank? You have 15+ legitimate paths to top engineering colleges
                  </p>
                  {/* Exam names reveal on hover */}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {['COMEDK', 'VITEEE'].map((s) => (
                      <span key={s} className="bg-[#FFF7ED] text-[#EA580C] text-xs rounded-full px-2.5 py-1">
                        {s}
                      </span>
                    ))}
                    <AnimatePresence>
                      {examsHovered && ['SRMJEEE', 'MET', 'CUET', 'KCET'].map((s, i) => (
                        <motion.span
                          key={s}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ delay: i * 0.06, ...SPRING_BOUNCE }}
                          className="bg-[#FFF7ED] text-[#EA580C] text-xs rounded-full px-2.5 py-1"
                        >
                          {s}
                        </motion.span>
                      ))}
                    </AnimatePresence>
                    {!examsHovered && (
                      <span className="text-[#EA580C] text-xs font-medium px-1 py-1">+13 more</span>
                    )}
                  </div>
                  {/* Urgency */}
                  <div className="flex items-center gap-1.5 mt-2 text-xs text-[#DC2626]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626] animate-pulse" />
                    Deadlines closing soon
                  </div>
                  <div className="flex items-center gap-1 mt-2 text-[#EA580C] font-medium text-sm group-hover:gap-2 transition-all">
                    See All 15+ Options <motion.span whileHover={{ x: 4 }} className="inline-block">→</motion.span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* CTA Below Cards */}
          <div className="text-center mt-10">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/quiz')}
              className="animate-ripple bg-[#EA580C] text-white font-bold rounded-full py-4 px-10 text-base font-heading cursor-pointer"
            >
              🎯 Start Career Discovery Quiz — Free
            </motion.button>
            <p className="text-sm text-[#64748B] mt-3">
              ✓ 47,832 students helped &nbsp; ✓ No signup required &nbsp; ✓ 100% Free
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════ SECTION 3: HOW IT WORKS ═══════════════ */}
      <section className="bg-[#F0FDF4] py-20 px-4" ref={howItWorksRef}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-[#0F172A] font-heading">
              From Confused to Confident
            </h2>
            <p className="text-base text-[#64748B] mt-2">
              Follow these 4 simple steps
            </p>
          </div>

          <div className="relative">
            {/* Connecting line (desktop) */}
            <div className="hidden md:block absolute top-7 left-[12.5%] right-[12.5%] h-0.5 z-0">
              <motion.div
                initial={{ scaleX: 0 }}
                animate={howItWorksInView ? { scaleX: 1 } : {}}
                transition={{ duration: 1.2, ease: ENTRANCE_EASE, delay: 0.3 }}
                className="h-full bg-[#047857]/20 origin-left"
                style={{ backgroundImage: 'repeating-linear-gradient(90deg, #047857 0, #047857 8px, transparent 8px, transparent 16px)' }}
              />
            </div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate={howItWorksInView ? "show" : "hidden"}
              className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10"
            >
              {[
                { step: 1, emoji: '🧠', title: 'Take IKIGAI Quiz', sub: '3 min • Free' },
                { step: 2, emoji: '🎯', title: 'Get Career Matches', sub: 'Instant • Personalized' },
                { step: 3, emoji: '📚', title: 'Explore Your Path', sub: 'Courses • Colleges • Exams' },
                { step: 4, emoji: '✅', title: 'Decide with Confidence', sub: 'Not confusion' },
              ].map((item) => (
                <motion.div key={item.step} variants={staggerItem} className="text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={howItWorksInView ? { scale: 1 } : {}}
                    transition={{ ...SPRING_BOUNCE, delay: 0.2 + item.step * 0.15 }}
                    className="w-14 h-14 rounded-full bg-[#047857] text-white font-bold text-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#047857]/20"
                  >
                    {item.emoji}
                  </motion.div>
                  <h3 className="font-heading font-bold text-[#0F172A] text-lg">{item.title}</h3>
                  <p className="text-sm text-[#64748B] mt-1">{item.sub}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════ SECTION 4: IKIGAI DARK SECTION ═══════════════ */}
      <section className="bg-[#0F2318] py-20 md:py-24 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
          {/* Left — IKIGAI Diagram */}
          <div className="relative w-72 h-72 mx-auto">
            {/* 4 breathing circles */}
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ ...SPRING_BOUNCE, delay: 0 }}
              viewport={{ once: true }}
              className="absolute w-40 h-40 rounded-full border-2 border-[#EF4444]/40 bg-[#EF4444]/10 animate-breathe-1"
              style={{ top: '10%', left: '15%' }}
            />
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ ...SPRING_BOUNCE, delay: 0.3 }}
              viewport={{ once: true }}
              className="absolute w-40 h-40 rounded-full border-2 border-[#3B82F6]/40 bg-[#3B82F6]/10 animate-breathe-2"
              style={{ top: '10%', right: '15%' }}
            />
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ ...SPRING_BOUNCE, delay: 0.6 }}
              viewport={{ once: true }}
              className="absolute w-40 h-40 rounded-full border-2 border-[#F59E0B]/40 bg-[#F59E0B]/10 animate-breathe-3"
              style={{ bottom: '10%', left: '15%' }}
            />
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ ...SPRING_BOUNCE, delay: 0.9 }}
              viewport={{ once: true }}
              className="absolute w-40 h-40 rounded-full border-2 border-[#10B981]/40 bg-[#10B981]/10 animate-breathe-4"
              style={{ bottom: '10%', right: '15%' }}
            />
            {/* Center glow */}
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-[#047857]/30"
              animate={{
                boxShadow: [
                  '0 0 20px rgba(4,120,87,0.3)',
                  '0 0 40px rgba(4,120,87,0.6)',
                  '0 0 20px rgba(4,120,87,0.3)',
                ]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white font-heading font-bold text-sm">
              IKIGAI
            </span>
          </div>

          {/* Right — Text */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: ENTRANCE_EASE }}
            >
              <span className="inline-block border border-white/30 text-white/80 rounded-full px-4 py-1.5 text-xs font-medium mb-6">
                Our Science-Backed Method
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-white font-heading leading-tight">
                We Use IKIGAI Science<br />
                <span className="text-[#10B981]">to Find Your Perfect Career</span>
              </h2>
            </motion.div>

            <div className="mt-8 space-y-5">
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
                  className="flex items-start gap-4"
                >
                  <span className="text-2xl mt-1">{item.icon}</span>
                  <div>
                    <h4 className="text-white font-bold text-base">{item.title}</h4>
                    <p className="text-white/60 text-sm">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.03, backgroundColor: '#047857' }}
              whileTap={{ scale: 0.97 }}
              transition={SPRING_SOFT}
              onClick={() => navigate('/quiz')}
              className="mt-8 border-2 border-[#047857] text-[#10B981] font-bold rounded-full px-8 py-3 text-sm cursor-pointer hover:text-white transition-colors"
            >
              Discover My IKIGAI →
            </motion.button>
          </div>
        </div>
      </section>

      {/* ═══════════════ SECTION 5: STATS ═══════════════ */}
      <section ref={statsRef} className="bg-white border-y border-[#E2E8F0] py-16 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: coursesCount, suffix: '+', label: 'Courses', icon: '📚' },
            { value: careersCount, suffix: '+', label: 'Careers', icon: '🎯' },
            { value: collegesCount, suffix: '+', label: 'Colleges', icon: '🏫' },
            { value: scholarshipsCount, suffix: '+', label: 'Scholarships', icon: '💰' },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: ENTRANCE_EASE }}
            >
              <div className="text-2xl mb-2">{stat.icon}</div>
              <div className="text-4xl md:text-5xl font-extrabold text-[#047857] font-numbers">
                {stat.value}{stat.suffix}
              </div>
              <div className="text-sm text-[#64748B] mt-1 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══════════════ SECTION 6: JEE CALCULATOR PROMO ═══════════════ */}
      <section className="px-4 py-12">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: ENTRANCE_EASE }}
          className="max-w-5xl mx-auto rounded-3xl overflow-hidden bg-gradient-to-r from-[#1D4ED8] to-[#047857] p-8 md:p-12"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/15 rounded-full px-3 py-1.5 mb-4">
                <span className="w-2 h-2 rounded-full bg-[#EF4444] animate-pulse" />
                <span className="text-white text-xs font-medium">⏰ JEE Session 2 — Results April 20</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-white font-heading mb-4">
                Calculate Your JEE Marks Instantly
              </h3>
              <div className="flex flex-wrap gap-2 mb-6">
                {['📄 Upload PDF', '🔢 Auto Calculate', '📊 Get Analysis'].map((pill) => (
                  <span key={pill} className="bg-white/15 text-white text-xs rounded-full px-3 py-1.5 font-medium">
                    {pill}
                  </span>
                ))}
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/jee-marks-calculator')}
                className="relative overflow-hidden bg-white text-[#1D4ED8] font-bold rounded-full px-8 py-3 text-sm cursor-pointer"
              >
                Calculate Now →
                {/* Shimmer on hover */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-0 h-full w-1/3 bg-gradient-to-r from-transparent via-white/30 to-transparent" style={{ animation: 'btn-shimmer 2s infinite', left: '-100%' }} />
                </div>
              </motion.button>
            </div>

            {/* Score preview card */}
            <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
              <p className="text-white/70 text-xs font-medium mb-4 uppercase tracking-wider">Score Preview</p>
              {[
                { label: 'Physics', score: 72, color: '#3B82F6' },
                { label: 'Chemistry', score: 56, color: '#10B981' },
                { label: 'Mathematics', score: 88, color: '#F59E0B' },
              ].map((subject) => (
                <div key={subject.label} className="mb-3">
                  <div className="flex justify-between text-white text-sm mb-1">
                    <span>{subject.label}</span>
                    <span className="font-numbers font-bold">{subject.score}/100</span>
                  </div>
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${subject.score}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.3, ease: ENTRANCE_EASE }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: subject.color }}
                    />
                  </div>
                </div>
              ))}
              <div className="mt-4 pt-3 border-t border-white/10 flex justify-between text-white">
                <span className="text-sm">Total</span>
                <span className="font-numbers font-extrabold text-lg">216/300</span>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ═══════════════ SECTION 7: SOCIAL PROOF TICKER ═══════════════ */}
      <section className="bg-white py-12 overflow-hidden">
        <h2 className="text-center text-2xl font-bold text-[#0F172A] font-heading mb-8">
          Students Across AP & Telangana
        </h2>

        {/* Row 1 — scrolls left */}
        <div className="overflow-hidden mb-4">
          <div className="animate-ticker-left flex gap-4" style={{ width: 'max-content' }}>
            {[...testimonials.slice(0, 5), ...testimonials.slice(0, 5)].map((t, i) => (
              <div
                key={`r1-${i}`}
                className="min-w-[280px] md:min-w-[320px] bg-white rounded-2xl shadow-sm border border-[#E2E8F0] p-4 border-l-4 border-l-[#25D366]"
              >
                <p className="text-sm text-[#0F172A] leading-relaxed mb-3">{t.text}</p>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xs font-bold text-[#0F172A]">{t.name}</p>
                    <p className="text-xs text-[#64748B]">{t.location}</p>
                  </div>
                  <span className="text-[10px] text-[#64748B]">{t.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Row 2 — scrolls right */}
        <div className="overflow-hidden">
          <div className="animate-ticker-right flex gap-4" style={{ width: 'max-content' }}>
            {[...testimonials.slice(5), ...testimonials.slice(5)].map((t, i) => (
              <div
                key={`r2-${i}`}
                className="min-w-[280px] md:min-w-[320px] bg-white rounded-2xl shadow-sm border border-[#E2E8F0] p-4 border-l-4 border-l-[#25D366]"
              >
                <p className="text-sm text-[#0F172A] leading-relaxed mb-3">{t.text}</p>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xs font-bold text-[#0F172A]">{t.name}</p>
                    <p className="text-xs text-[#64748B]">{t.location}</p>
                  </div>
                  <span className="text-[10px] text-[#64748B]">{t.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ SECTION 8: TRUST ═══════════════ */}
      <section className="bg-[#EFF6FF] py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-center text-2xl font-bold text-[#0F172A] font-heading mb-10">
            Why Students Trust Us
          </h2>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10"
          >
            {[
              { icon: '🔒', title: 'Government Verified Data', desc: 'All information sourced from official NTA, UGC, BIE TS/AP databases' },
              { icon: '🎓', title: 'Expert-Curated Content', desc: 'Career paths validated by industry professionals and academic counselors' },
              { icon: '💯', title: '100% Free Forever', desc: 'No hidden charges, no premium gating. Every feature is free for students' },
            ].map((card) => {
              const tilt = useTiltCard();
              return (
                <motion.div
                  key={card.title}
                  variants={staggerItem}
                  ref={tilt.ref}
                  onMouseMove={tilt.handleMouseMove}
                  onMouseLeave={tilt.handleMouseLeave}
                  style={{
                    rotateX: tilt.rotateX,
                    rotateY: tilt.rotateY,
                    perspective: 1000,
                    transformStyle: 'preserve-3d',
                  }}
                  className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-sm text-center"
                >
                  <div className="text-4xl mb-4">{card.icon}</div>
                  <h3 className="font-heading font-bold text-[#0F172A] text-lg mb-2">{card.title}</h3>
                  <p className="text-sm text-[#64748B] leading-relaxed">{card.desc}</p>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Data badges */}
          <div className="flex flex-wrap justify-center gap-3">
            {['📊 NTA Data', '🎓 BIE TS/AP', '🏛️ UGC Info', '🔒 SSL Secured'].map((badge) => (
              <motion.span
                key={badge}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-[#0F172A] text-xs font-medium rounded-full px-4 py-2 border border-[#E2E8F0] shadow-sm cursor-default"
              >
                {badge}
              </motion.span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ SECTION 9: FINAL CTA ═══════════════ */}
      <section
        className="py-20 px-4 text-center animate-gradient-shift"
        style={{ background: 'linear-gradient(135deg, #047857, #2563EB, #047857)' }}
      >
        <div className="max-w-3xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: ENTRANCE_EASE }}
            className="text-3xl md:text-4xl font-bold text-white font-heading leading-tight"
          >
            Your Perfect Career is<br />
            <span className="text-white/90">3 Minutes Away</span>
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5, ease: ENTRANCE_EASE }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10"
          >
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/quiz')}
              className="bg-white text-[#047857] rounded-full font-bold py-4 px-10 font-heading cursor-pointer shadow-xl"
            >
              Start Free IKIGAI Quiz →
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03, backgroundColor: 'rgba(255,255,255,0.1)' }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/courses')}
              className="border-2 border-white text-white rounded-full py-4 px-10 font-heading font-bold cursor-pointer"
            >
              Explore Courses →
            </motion.button>
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
          className="relative w-14 h-14 bg-[#047857] rounded-full shadow-xl flex items-center justify-center cursor-pointer"
        >
          {/* Ping animation */}
          <span className="absolute inset-0 rounded-full bg-[#047857] animate-ping opacity-20" />
          <span className="text-white text-xl relative z-10">🤖</span>
        </motion.button>
        <motion.span
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-2 -right-1 bg-white text-[#047857] text-[10px] font-bold rounded-full px-2 py-0.5 shadow-md border border-[#E2E8F0]"
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
          className="w-14 h-14 bg-[#25D366] rounded-full shadow-xl flex items-center justify-center"
        >
          <span className="text-white text-2xl">💬</span>
        </motion.a>
      </motion.div>

      {/* Sticky Hook Bar */}
      <AnimatePresence>
        {showStickyBar && !stickyDismissed && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={SPRING_SOFT}
            className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#E2E8F0] shadow-[0_-4px_20px_rgba(0,0,0,0.08)] py-3 px-4 md:hidden"
          >
            <div className="flex items-center justify-between gap-3 max-w-lg mx-auto">
              <div className="text-sm flex-1">
                <span className="font-bold text-[#0F172A]">Confused about career?</span>
                <span className="text-[#64748B]"> Take free quiz</span>
              </div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/quiz')}
                className="bg-[#EA580C] text-white text-sm font-bold rounded-full px-5 py-2 whitespace-nowrap cursor-pointer"
              >
                Start Quiz
              </motion.button>
              <button
                onClick={() => setStickyDismissed(true)}
                className="text-[#64748B] text-lg leading-none px-1 cursor-pointer"
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

export default HomePage;