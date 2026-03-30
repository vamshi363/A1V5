import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, animate, useInView } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Upload, FileText, CheckCircle, ChevronRight, Share2, AlertCircle, RefreshCw, ShieldCheck, Zap, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import * as pdfjsLib from 'pdfjs-dist';

// ─── Spring & Easing Constants (Emil Kowalski) ─────────────────────────────
const SPRING_BOUNCE = { type: "spring" as const, stiffness: 400, damping: 30 };
const SPRING_SOFT = { type: "spring" as const, stiffness: 300, damping: 25 };
const ENTRANCE_EASE = [0.22, 1, 0.36, 1] as const;

// ─── Animated Counter Hook ──────────────────────────────────────────────────
const useAnimatedCounter = (target: number, duration: number = 1.5, start: boolean = false) => {
  const motionVal = useMotionValue(0);
  const rounded = useTransform(motionVal, (v) => Math.round(v));
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!start) return;
    const controls = animate(motionVal, target, {
      duration,
      ease: ENTRANCE_EASE as unknown as [number, number, number, number],
    });
    const unsub = rounded.on("change", (v) => setDisplay(v));
    return () => { controls.stop(); unsub(); };
  }, [start, target, duration, motionVal, rounded]);

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
          stroke="#F59E0B"
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

// Use CDN for pdf.worker to avoid Vite build issues
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface ScoreData {
  name: string;
  applicationNo: string;
  physics: number;
  chemistry: number;
  maths: number;
  totalRaw: number;
}

export default function JEECalculatorPage() {
  const [step, setStep] = useState<'upload' | 'parsing' | 'fallback' | 'results'>('upload');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [debugText, setDebugText] = useState<string | null>(null);
  const [showDebug, setShowDebug] = useState(false);
  const [docType, setDocType] = useState<'scorecard' | 'response_sheet'>('scorecard');
  const [isDragging, setIsDragging] = useState(false);
  
  const [scoreData, setScoreData] = useState<ScoreData>({
    name: 'Student',
    applicationNo: '',
    physics: 0,
    chemistry: 0,
    maths: 0,
    totalRaw: 0,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      handleFile(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      handleFile(file);
    }
  };

  const handleFile = async (file: File) => {
    if (file.type !== 'application/pdf') {
      setErrorMsg('Please upload a valid PDF file.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('File size exceeds the 5MB limit.');
      return;
    }

    setStep('parsing');
    setErrorMsg(null);

    try {
      const text = await extractFromPDF(file);
      setDebugText(text);
      
      const isResponseSheet = text.includes('Question ID') || text.includes('Chosen Option') || text.includes('Response Sheet');
      setDocType(isResponseSheet ? 'response_sheet' : 'scorecard');

      if (!isResponseSheet) {
        setStep('fallback');
        return;
      }

      const extracted = parseScorecardText(text);
      
      if (!extracted) {
        setStep('fallback');
      } else {
        setScoreData(extracted);
        setStep('results');
      }
    } catch (err) {
      console.error(err);
      setStep('fallback');
    }
  };

  const extractFromPDF = async (file: File): Promise<string> => {
    const objectUrl = URL.createObjectURL(file);
    try {
      const pdf = await pdfjsLib.getDocument(objectUrl).promise;
      let fullText = '';
      
      // Support multi-page (Response sheets are long)
      const numPages = Math.min(pdf.numPages, 40); // Cap at 40 pages for performance
      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        fullText += textContent.items
          .map((item: any) => item.str)
          .join(' ') + ' ';
      }
      
      return fullText;
    } finally {
      URL.revokeObjectURL(objectUrl);
    }
  };

  const parseScorecardText = (text: string): ScoreData | null => {
    try {
      // 1. Detect if it's a Response Sheet
      const isResponseSheet = text.includes('Question ID') || text.includes('Chosen Option') || text.includes('Response Sheet');

      if (!isResponseSheet) return null;

      // 2. Extract Candidate Name
      const nameMatch = text.match(/(?:Candidate Name|Name|Candidate's Name)[\s:]*([A-Za-z\s\.]+?)(?:Mother|Father|Roll|Application|Gender|Category|State)/i) 
                     || text.match(/(?:Candidate Name|Name)[\s:]*([A-Za-z\s]{3,40})/i);
      
      // 3. Extract Application Number
      const appNoMatch = text.match(/(?:Application No|Application Number)[\.\s:]*(\d{8,12})/i)
                      || text.match(/\b(240|250)\d{7,10}\b/);

      // 4. Calculate Marks
      let pScore = 0, cScore = 0, mScore = 0;
      let foundMarks = false;
      
      const rowRegex = /(Yes|No|--|Not Attempted)\s+(-?\d+)\s+(Physics|Chemistry|Mathematics)/ig;
      let match;
      while ((match = rowRegex.exec(text)) !== null) {
        foundMarks = true;
        const marks = parseInt(match[2], 10);
        const subj = match[3].toLowerCase();
        if (subj === 'physics') pScore += marks;
        else if (subj === 'chemistry') cScore += marks;
        else if (subj === 'mathematics') mScore += marks;
      }

      if (foundMarks) {
        const totalRaw = pScore + cScore + mScore;
        return {
          name: (nameMatch ? nameMatch[1].trim() : 'Student').replace(/[^a-zA-Z\s\.]/g, ''),
          applicationNo: appNoMatch ? appNoMatch[1] : 'Unknown',
          physics: pScore,
          chemistry: cScore,
          maths: mScore,
          totalRaw: totalRaw,
        };
      }
      return null;
    } catch (e) {
      console.error("Parsing error:", e);
      return null;
    }
  };

  const calculateApproxRank = (percentile: number) => {
    // Very rough heuristic for 2024-2025: Total Candidates ~ 14 Lakhs
    const totalCandidates = 1400000;
    return Math.max(1, Math.round(((100 - percentile) / 100) * totalCandidates));
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('results');
  };

  const handleFallbackChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setScoreData({
      ...scoreData,
      [name]: name === 'name' ? value : parseFloat(value) || 0,
    });
  };

  const getStrongestSubject = () => {
    const { physics, chemistry, maths } = scoreData;
    if (physics > chemistry && physics > maths) return { name: "Physics", icon: "⚛️", matches: "ECE, EEE, Mechanical" };
    if (maths > chemistry && maths > physics) return { name: "Mathematics", icon: "📐", matches: "CSE, AI/ML, Data Science" };
    if (chemistry > physics && chemistry > maths) return { name: "Chemistry", icon: "🧪", matches: "Chemical Engg, Biotech" };
    return { name: "Balanced", icon: "⚖️", matches: "CS/IT, ECE, or Multi-disciplinary branches" };
  };

  const getExamRecommendation = () => {
    const raw = scoreData.totalRaw || (scoreData.physics + scoreData.chemistry + scoreData.maths);
    if (raw >= 180) return {
      title: "🔥 Exceptional Score!",
      desc: "You have a very strong grasp of concepts. Focus highly on JEE Advanced and BITSAT. You are likely to secure a seat in top IITs or NITs.",
      exams: ["JEE Advanced", "BITSAT"]
    };
    if (raw >= 120) return {
      title: "🌟 Great Performance!",
      desc: "You have a solid foundation. Continue preparing for JEE Advanced, but also secure your backups with top private exams.",
      exams: ["JEE Advanced", "BITSAT", "VITEEE", "COMEDK"]
    };
    if (raw >= 80) return {
      title: "👍 Good Attempt!",
      desc: "You've shown good potential. Direct your focus towards competitive state syllabus exams and reputable private universities.",
      exams: ["COMEDK", "VITEEE", "MHT-CET", "State EAMCET"]
    };
    return {
      title: "💡 Keep Moving Forward!",
      desc: "Your JEE score is just one path. There are numerous state-level exams and excellent private universities where you can shine.",
      exams: ["State EAMCET", "SRMJEEE", "Manipal (MET)", "COMEDK"]
    };
  };

  const SubjectCard = ({ label, value, color, icon, delay, max = 100 }: { label: string, value: number, color: string, icon: React.ReactNode, delay: number, max?: number }) => {
    const animatedValue = useAnimatedCounter(value, 2, step === 'results');
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.8, ease: ENTRANCE_EASE }}
        whileHover={{ y: -5, scale: 1.02 }}
        className="bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-3xl p-8 relative overflow-hidden group shadow-xl"
      >
        {/* Subject-specific glow */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 blur-[60px] opacity-20 pointer-events-none group-hover:opacity-40 transition-opacity" style={{ backgroundColor: color }} />
        
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-6">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg`} style={{ backgroundColor: `${color}20`, border: `1px solid ${color}40` }}>
               {React.cloneElement(icon as React.ReactElement, { className: 'w-6 h-6', style: { color } })}
            </div>
            <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">{label}</span>
          </div>
          
          <div className="flex items-baseline gap-1 mb-4">
            <span className="text-5xl font-extrabold font-numbers tracking-tight">{animatedValue}</span>
            <span className="text-slate-500 font-medium font-numbers">/ {max}</span>
          </div>
          
          {/* Progress Bar */}
          <div className="relative h-2 bg-slate-800 rounded-full overflow-hidden mb-2">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${(value / max) * 100}%` }}
              transition={{ delay: delay + 0.5, duration: 1.5, ease: ENTRANCE_EASE }}
              className="absolute inset-0 rounded-full"
              style={{ backgroundColor: color }}
            />
          </div>
          <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase">
             <span>0</span>
             <span>Pass</span>
             <span>100%</span>
          </div>
        </div>
      </motion.div>
    );
  };

  const examRec = getExamRecommendation();
  const strongSubj = getStrongestSubject();

  return (
    <div className="min-h-screen bg-[#0A0F1E] text-white pt-24 pb-20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 dot-grid-bg pointer-events-none opacity-[0.03]" />
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-emerald-600/10 blur-[120px] rounded-full pointer-events-none" />

      <Helmet>
        <title>JEE Scorecard Analyzer 2026 | Upload PDF → Get Raw Marks Instantly | After Inter</title>
        <meta name="description" content="Upload your NTA JEE Main 2026 scorecard PDF. We automatically extract your marks and suggest suitable exams. Free, instant, private." />
      </Helmet>

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        
        {/* PRIVACY & TRUST BADGE */}
        <div className="flex justify-center mb-10">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={SPRING_BOUNCE}
            className="inline-flex items-center gap-2.5 bg-emerald-500/10 text-emerald-400 px-5 py-2.5 rounded-full border border-emerald-500/20 text-sm font-medium shadow-[0_0_20px_rgba(16,185,129,0.1)]"
          >
            <ShieldCheck className="w-5 h-5" />
            <span className="flex items-center gap-1.5">
              🔒 <span className="opacity-80">Privacy First:</span> Native Browser Processing
            </span>
          </motion.div>
        </div>

        <AnimatePresence mode="wait">
          {/* ========================================== */}
          {/* UPLOAD SCREEN */}
          {/* ========================================== */}
          {step === 'upload' && (
            <motion.div 
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
              transition={{ duration: 0.6, ease: ENTRANCE_EASE }}
              className="max-w-4xl mx-auto space-y-12"
            >
              <div className="text-center space-y-4">
                <div className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full border border-blue-500/20 text-xs font-bold uppercase tracking-widest mb-2">
                  <Zap className="w-3 h-3 fill-current" /> Fast & Accurate
                </div>
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight font-heading leading-tight">
                  {['JEE', 'Response', 'Sheet'].map((word, i) => (
                    <motion.span 
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + i * 0.1, duration: 0.5, ease: ENTRANCE_EASE }}
                      className="inline-block mr-3"
                    >
                      {word}
                    </motion.span>
                  ))}
                  <br />
                  <span className="relative inline-block text-[#F59E0B]">
                    Analyzer
                    <AnimatedUnderline delay={0.8} />
                  </span>
                </h1>
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1, duration: 1 }}
                  className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed"
                >
                  Calculate your exact Raw Marks (out of 300) in seconds.
                  <span className="block text-slate-500 text-sm mt-1 font-medium italic">Supports NTA June 2024 & Session 2 formats.</span>
                </motion.p>
              </div>

              {/* DROPZONE */}
              <motion.div 
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className={`group relative overflow-hidden rounded-[3rem] border-2 border-dashed transition-all duration-500 ${isDragging ? 'border-[#F59E0B] bg-[#F59E0B]/5 shadow-[0_0_40px_rgba(245,158,11,0.15)]' : 'border-slate-800 hover:border-slate-600 bg-slate-900/40 backdrop-blur-md'}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <input 
                  type="file" 
                  accept=".pdf"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  onChange={handleFileSelect}
                  ref={fileInputRef}
                />
                
                <div className="flex flex-col items-center justify-center py-24 px-6 text-center relative z-0">
                  <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <motion.div 
                    animate={isDragging ? { y: -10, scale: 1.1 } : { y: 0, scale: 1 }}
                    className={`w-32 h-32 rounded-[2rem] flex items-center justify-center mb-8 transition-all duration-300 ${isDragging ? 'bg-[#F59E0B]/20 text-[#F59E0B] shadow-[0_0_30px_rgba(245,158,11,0.2)]' : 'bg-slate-800/80 text-slate-400 group-hover:bg-slate-700/80 group-hover:text-white shadow-xl'}`}
                  >
                    <Upload className={`w-14 h-14 ${isDragging ? 'animate-bounce' : ''}`} strokeWidth={1.5} />
                  </motion.div>
                  
                  <h3 className="text-3xl font-bold mb-3 font-heading tracking-tight">Drop Response Sheet PDF</h3>
                  <p className="text-slate-400 mb-8 max-w-sm text-lg font-medium">Drag any NTA PDF here or click to browse</p>
                  
                  <div className="flex items-center gap-3 text-sm text-slate-500 bg-slate-950/80 border border-white/5 px-6 py-3 rounded-2xl shadow-inner">
                    <Info className="w-4 h-4 text-blue-400" />
                    <span>Privacy Notice: Processing happens 100% on your device</span>
                  </div>

                  {errorMsg && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      className="mt-8 text-red-400 bg-red-400/10 px-6 py-3 rounded-xl border border-red-400/20 font-bold"
                    >
                      {errorMsg}
                    </motion.div>
                  )}
                </div>
              </motion.div>

              {/* INSTRUCTIONS */}
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { id: 1, title: "Login", text: "Go to NTA portal and open your response sheet" },
                  { id: 2, title: "Save PDF", text: "Press Ctrl+P and Save as PDF (all pages)" },
                  { id: 3, title: "Analyze", text: "Drag that PDF here for instant calculation" }
                ].map((item) => (
                  <motion.div 
                    key={item.id}
                    whileHover={{ y: -5, backgroundColor: "rgba(30, 41, 59, 0.4)" }}
                    className="bg-slate-900/30 backdrop-blur-sm p-8 rounded-[2.5rem] border border-slate-800/50 text-center transition-colors shadow-lg"
                  >
                    <div className="w-12 h-12 bg-slate-800 text-[#F59E0B] rounded-2xl flex items-center justify-center mx-auto mb-5 font-extrabold border border-slate-700 shadow-xl font-numbers text-xl">
                      {item.id}
                    </div>
                    <h4 className="text-white font-bold mb-2 font-heading">{item.title}</h4>
                    <p className="text-sm text-slate-400 leading-relaxed font-medium">{item.text}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ========================================== */}
          {/* PARSING LOADING */}
          {/* ========================================== */}
          {step === 'parsing' && (
            <motion.div 
              key="parsing"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="py-32 flex flex-col items-center justify-center text-center"
            >
              <div className="relative w-24 h-24 mb-10">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                  className="absolute inset-0 border-4 border-slate-800 border-t-[#F59E0B] rounded-full"
                />
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ repeat: Infinity, duration: 5, ease: "linear" }}
                  className="absolute inset-2 border-4 border-slate-800 border-b-blue-500 rounded-full"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <RefreshCw className="w-8 h-8 text-white/50 animate-spin-slow" />
                </div>
              </div>
              <h2 className="text-3xl font-bold mb-4 font-heading">Securely Analyzing</h2>
              <div className="space-y-2">
                <p className="text-slate-400 text-lg">Extracting raw marks in your browser...</p>
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 3, ease: "easeInOut" }}
                  className="h-1 bg-[#F59E0B] rounded-full w-48 mx-auto mt-4 overflow-hidden"
                >
                   <div className="h-full w-full bg-white/20 animate-shimmer" />
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* ========================================== */}
          {/* RESULTS SCREEN */}
          {/* ========================================== */}
          {step === 'results' && (
            <motion.div 
              key="results"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: ENTRANCE_EASE }}
              className="space-y-10"
            >
              {/* HEADER */}
              <div className="text-center space-y-4 mb-16">
                <motion.div 
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={SPRING_BOUNCE}
                  className="w-24 h-24 bg-emerald-500/20 border border-emerald-500/30 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_rgba(16,185,129,0.15)]"
                >
                  <CheckCircle className="w-12 h-12 text-emerald-400" />
                </motion.div>
                <div className="space-y-1">
                   <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight font-heading">
                     Hi, <span className="text-[#F59E0B] capitalize">{scoreData.name}</span>
                   </h1>
                   <p className="text-xl md:text-2xl text-slate-300 font-medium opacity-80 font-heading">Your Performance Analysis is Ready</p>
                </div>
                
                <p className="text-slate-500 max-w-lg mx-auto mt-6 text-sm bg-slate-900/50 py-2 px-4 rounded-full border border-white/5 inline-block">
                  <AlertCircle className="w-4 h-4 inline mr-2 text-blue-400" />
                  Calculated based on NTA 2024 Response Key
                </p>
              </div>

              {/* MAIN SCORE DASHBOARD (NEW) */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                {/* Total Raw Marks Card (Largest) */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.8, ease: ENTRANCE_EASE }}
                  className="md:col-span-4 bg-gradient-to-br from-[#1E3A5F] to-[#0F172A] rounded-[3rem] p-10 border border-white/10 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-10 group"
                >
                  {/* Decorative animate-shimmer background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent animate-shimmer pointer-events-none" />
                  
                  <div className="text-center md:text-left relative z-10">
                    <span className="bg-white/10 text-white/80 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4 inline-block">Total Raw Score</span>
                    <div className="flex items-baseline justify-center md:justify-start gap-2">
                       <span className="text-7xl md:text-9xl font-extrabold font-numbers bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400">
                         {useAnimatedCounter(scoreData.totalRaw, 2, step === 'results')}
                       </span>
                       <span className="text-2xl md:text-4xl font-bold text-slate-500 font-numbers">/ 300</span>
                    </div>
                    <p className="text-slate-400 mt-4 text-lg font-medium">Excellent work! This is a solid foundation.</p>
                  </div>

                  <div className="w-full md:w-64 space-y-6 relative z-10">
                    <div className="bg-white/5 rounded-3xl p-6 border border-white/5 backdrop-blur-sm">
                       <h4 className="text-emerald-400 font-bold mb-3 flex items-center gap-2">
                         <Zap className="w-4 h-4 fill-current" /> Predicted Percentile*
                       </h4>
                       <div className="text-4xl font-bold font-numbers tracking-tight">
                         ~{Math.max(0, (scoreData.totalRaw / 3) + 15).toFixed(1)} <span className="text-sm opacity-50">%ile</span>
                       </div>
                       <p className="text-[10px] text-slate-500 mt-3 font-medium">*Estimated based on previous year trends</p>
                    </div>
                  </div>
                </motion.div>

                {/* Subject Cards */}
                <SubjectCard label="Physics" value={scoreData.physics} color="#3B82F6" icon={<Zap />} delay={0.4} />
                <SubjectCard label="Chemistry" value={scoreData.chemistry} color="#10B981" icon={<FileText />} delay={0.5} />
                <SubjectCard label="Mathematics" value={scoreData.maths} color="#F59E0B" icon={<Info />} delay={0.6} />
                
                {/* Strength Analysis Card */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7, duration: 0.8, ease: ENTRANCE_EASE }}
                  className="bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-3xl p-8 flex flex-col justify-between shadow-xl"
                >
                  <div>
                    <span className="text-[#10B981] text-[10px] font-bold uppercase tracking-widest mb-4 block">Strength Analysis</span>
                    <h4 className="text-2xl font-bold mb-2 font-heading leading-tight">{strongSubj.icon} {strongSubj.name} Specialist</h4>
                    <p className="text-xs text-slate-400 leading-relaxed font-medium">Your score suggests you have a natural aptitude for {strongSubj.name} related fields.</p>
                  </div>
                  <div className="mt-6 pt-6 border-t border-white/5">
                     <p className="text-[10px] text-slate-500 font-bold uppercase mb-2">Ideal Branches</p>
                     <p className="text-sm font-bold text-white tracking-wide">{strongSubj.matches}</p>
                  </div>
                </motion.div>
              </div>

              {/* EXAM RECOMMENDATIONS */}
              <div className="pt-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                  <div>
                    <h3 className="text-3xl font-extrabold font-heading tracking-tight mb-2">Target Exams for You</h3>
                    <p className="text-slate-400 font-medium">Based on your score, these are high-probability matches</p>
                  </div>
                  <div className="bg-orange-500/10 text-orange-400 px-4 py-2 rounded-xl border border-orange-500/20 text-xs font-bold">
                    🚀 {examRec.title}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {examRec.exams.map((exam, i) => (
                    <motion.div 
                      key={exam} 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.8 + i * 0.1, ...SPRING_BOUNCE }}
                      whileHover={{ scale: 1.05, y: -5, borderColor: "rgba(245, 158, 11, 0.4)" }}
                      className="bg-slate-950/50 border border-slate-800 p-8 rounded-3xl text-center shadow-lg group relative overflow-hidden transition-all"
                    >
                      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-[#F59E0B]/10 to-transparent rounded-bl-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-white/5 shadow-inner group-hover:bg-[#F59E0B]/20 transition-colors">
                        <CheckCircle className="w-6 h-6 text-[#F59E0B]" />
                      </div>
                      <p className="font-extrabold text-xl text-slate-100 font-heading">{exam}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* TAKE NEXT STEPS */}
              <div className="grid md:grid-cols-2 gap-6 pt-10">
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="relative overflow-hidden bg-gradient-to-br from-indigo-600/20 to-purple-800/20 border border-indigo-500/20 rounded-[2.5rem] p-10 shadow-2xl flex flex-col justify-between group"
                >
                  <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-indigo-500/10 blur-[80px] rounded-full pointer-events-none group-hover:bg-indigo-500/20 transition-all duration-700" />
                  <div className="relative z-10">
                    <h3 className="text-3xl font-bold mb-4 font-heading tracking-tight">Which Branch fits YOU?</h3>
                    <p className="text-indigo-200/60 mb-8 font-medium leading-relaxed">
                      Don't just pick CSE. Discover the engineering field that matches your skills, passion, and market demand using IKIGAI.
                    </p>
                  </div>
                  <Link to="/quiz" className="inline-flex w-full md:w-fit items-center justify-center gap-3 bg-indigo-500 hover:bg-indigo-400 text-white font-extrabold px-8 py-4 rounded-2xl transition-all shadow-lg active:scale-95 text-sm uppercase tracking-widest relative z-10 group-hover:shadow-indigo-500/20">
                    Take Career Quiz <ChevronRight className="w-5 h-5" />
                  </Link>
                </motion.div>

                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="relative overflow-hidden bg-gradient-to-br from-emerald-600/20 to-teal-800/20 border border-emerald-500/20 rounded-[2.5rem] p-10 shadow-2xl flex flex-col justify-between group"
                >
                  <div className="absolute top-0 left-0 -ml-20 -mt-20 w-64 h-64 bg-emerald-500/10 blur-[80px] rounded-full pointer-events-none group-hover:bg-emerald-500/20 transition-all duration-700" />
                  <div className="relative z-10">
                    <h3 className="text-3xl font-bold mb-4 font-heading tracking-tight">Explore Courses</h3>
                    <p className="text-emerald-200/60 mb-8 font-medium leading-relaxed">
                      Confused between ECE and Artificial Intelligence? Explore detailed roadmaps, salaries, and truths about engineering degrees.
                    </p>
                  </div>
                  <Link to="/courses" className="inline-flex w-full md:w-fit items-center justify-center gap-3 bg-emerald-500 hover:bg-emerald-400 text-white font-extrabold px-8 py-4 rounded-2xl transition-all shadow-lg active:scale-95 text-sm uppercase tracking-widest relative z-10 group-hover:shadow-emerald-500/20">
                    Explore Roadmaps <ChevronRight className="w-5 h-5" />
                  </Link>
                </motion.div>
              </div>

              {/* SHARE */}
              <div className="text-center pt-16 border-t border-slate-800/50">
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-6">Spread the knowledge</p>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    const text = `I just calculated my JEE main raw marks on After Inter!\nTotal Marks: ${scoreData.totalRaw}/300\nCalculate yours instantly:\nhttps://afterinter.in/jee-marks-calculator`;
                    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`);
                  }}
                  className="inline-flex items-center gap-3 bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 px-10 py-5 rounded-full font-bold transition-all border border-[#25D366]/20 shadow-xl"
                >
                  <Share2 className="w-6 h-6" />
                  Share on WhatsApp
                </motion.button>
              </div>

              <div className="flex justify-center pt-8">
                 <button onClick={() => setStep('upload')} className="text-slate-500 hover:text-white flex items-center gap-2 text-sm font-bold transition-colors group">
                   <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" /> Re-upload Another Sheet
                 </button>
              </div>
            </motion.div>
          )}

          {/* ========================================== */}
          {/* FALLBACK MANUAL FORM (RE-STRICTURED) */}
          {/* ========================================== */}
          {step === 'fallback' && (
            <motion.div 
              key="fallback"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-2xl mx-auto"
            >
              <div className="bg-slate-900/60 backdrop-blur-xl border border-white/5 rounded-[3rem] p-10 md:p-12 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 blur-[50px]" />
                
                <div className="text-center mb-10">
                  <div className="w-20 h-20 bg-orange-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-orange-500/20">
                    <AlertCircle className="w-10 h-10 text-orange-400" />
                  </div>
                  <h2 className="text-3xl font-extrabold mb-3 font-heading tracking-tight">Manual Score Entry</h2>
                  <p className="text-slate-400 leading-relaxed font-medium">
                    {docType === 'scorecard' 
                      ? "Scorecards don't have raw marks. Please upload a JEE Main Response Sheet (30+ pages) for auto-calculation." 
                      : "The extraction failed. Please enter your marks manually to see the analysis."}
                  </p>
                  
                  <button 
                    onClick={() => setShowDebug(!showDebug)}
                    className="mt-6 text-xs text-slate-500 hover:text-blue-400 underline font-bold tracking-widest uppercase transition-colors"
                  >
                    {showDebug ? "Hide Technical Details" : "Show Extraction Logs"}
                  </button>
                  
                  {showDebug && debugText && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} className="mt-6 p-6 bg-black/40 rounded-2xl text-left text-[10px] font-mono overflow-auto max-h-40 text-slate-500 border border-white/5">
                      {debugText.substring(0, 2000)}...
                    </motion.div>
                  )}
                </div>

                <form onSubmit={handleManualSubmit} className="space-y-8">
                  <div className="space-y-3">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Candidate Name (Optional)</label>
                    <input 
                      type="text" 
                      name="name"
                      placeholder="e.g. Rahul Reddy"
                      value={scoreData.name === 'Student' ? '' : scoreData.name}
                      onChange={handleFallbackChange}
                      className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-[#F59E0B] transition-all focus:ring-4 focus:ring-[#F59E0B]/5 placeholder:text-slate-700"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                      { name: 'physics', label: 'Physics', color: 'border-blue-500/30' },
                      { name: 'chemistry', label: 'Chemistry', color: 'border-emerald-500/30' },
                      { name: 'maths', label: 'Maths', color: 'border-orange-500/30' }
                    ].map((subj) => (
                      <div key={subj.name} className="space-y-3">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">{subj.label}</label>
                        <input 
                          type="number" step="1" name={subj.name} required max="100" min="-25"
                          placeholder="0"
                          className={`w-full bg-slate-950/50 border ${subj.color} rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-[#F59E0B] transition-all focus:ring-4 focus:ring-[#F59E0B]/5 font-numbers text-xl placeholder:text-slate-800`}
                          onChange={handleFallbackChange}
                        />
                      </div>
                    ))}
                  </div>

                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit" 
                    className="w-full bg-[#F59E0B] hover:bg-orange-400 text-slate-950 font-extrabold text-lg py-5 rounded-2xl transition-all shadow-[0_0_30px_rgba(245,158,11,0.2)] flex items-center justify-center gap-3 mt-4 group"
                  >
                    View High-Level Analysis <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                </form>
              </div>
              <div className="flex justify-center mt-8">
                 <button onClick={() => setStep('upload')} className="text-slate-500 hover:text-white flex items-center gap-2 text-sm font-bold transition-colors">
                    Back to Upload
                 </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
