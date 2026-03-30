import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, X, Check, GraduationCap, ShieldCheck, Zap, Heart, Trophy, Briefcase, Globe } from 'lucide-react';
import { QUESTIONS, calculateIkigaiResults } from '../data/ikigaiData';

const TOTAL = QUESTIONS.length;
const STORAGE_KEY = 'afterinter_quiz';

const PILLARS_MAP = [
  { id: 'love', name: 'Passion', start: 0, end: 3, icon: <Heart size={14}/>, color: 'text-pink-600', bg: 'bg-pink-600' },
  { id: 'goodAt', name: 'Skills', start: 4, end: 7, icon: <Zap size={14}/>, color: 'text-blue-600', bg: 'bg-blue-600' },
  { id: 'paysWell', name: 'Salary', start: 8, end: 10, icon: <Briefcase size={14}/>, color: 'text-amber-600', bg: 'bg-amber-600' },
  { id: 'worldNeeds', name: 'Market', start: 11, end: 13, icon: <Globe size={14}/>, color: 'text-emerald-600', bg: 'bg-emerald-600' },
  { id: 'stream', name: 'Stream', start: 14, end: 14, icon: <GraduationCap size={14}/>, color: 'text-gov-blue', bg: 'bg-gov-blue' },
];

const IkigaiIntroDiagram = () => (
  <div className="relative w-64 h-64 md:w-80 md:h-80 mx-auto my-12">
    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2 }}
      className="absolute top-0 left-[20%] w-[60%] h-[60%] rounded-full border-2 border-pink-200 bg-pink-50/50 flex flex-col items-center justify-start pt-8">
      <span className="text-2xl">❤️</span>
      <span className="text-[10px] font-bold text-pink-700 uppercase">Passion</span>
    </motion.div>
    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.4 }}
      className="absolute top-[20%] left-0 w-[60%] h-[60%] rounded-full border-2 border-blue-200 bg-blue-50/50 flex flex-col items-start justify-center pl-8">
      <span className="text-2xl">💪</span>
      <span className="text-[10px] font-bold text-blue-700 uppercase">Skills</span>
    </motion.div>
    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.6 }}
      className="absolute top-[20%] right-0 w-[60%] h-[60%] rounded-full border-2 border-amber-200 bg-amber-50/50 flex flex-col items-end justify-center pr-8">
      <span className="text-2xl">💰</span>
      <span className="text-[10px] font-bold text-amber-700 uppercase">Salary</span>
    </motion.div>
    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.8 }}
      className="absolute bottom-0 left-[20%] w-[60%] h-[60%] rounded-full border-2 border-emerald-200 bg-emerald-50/50 flex flex-col items-center justify-end pb-8">
      <span className="text-2xl">🌍</span>
      <span className="text-[10px] font-bold text-emerald-700 uppercase">Market</span>
    </motion.div>
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-16 h-16 bg-white border shadow-xl rounded-full flex items-center justify-center">
        <span className="text-[10px] font-black text-gov-blue text-center leading-none">YOUR<br/>IKIGAI</span>
      </div>
    </div>
  </div>
);

export default function QuizPage() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<'intro' | 'quiz' | 'loading'>('intro');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [direction, setDirection] = useState<1 | -1>(1);
  const [loadingStep, setLoadingStep] = useState(0);

  const q = QUESTIONS[currentIdx];
  const currentPillarInfo = PILLARS_MAP.find(p => currentIdx >= p.start && currentIdx <= p.end);
  const progressPct = ((currentIdx + 1) / TOTAL) * 100;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentIdx, phase]);

  useEffect(() => {
    if (phase === 'quiz') {
      const savedStream = localStorage.getItem('student_stream');
      if (savedStream) {
        let streamAns = '';
        let streamText = '';
        if (savedStream === 'MPC') { streamAns = 'A'; streamText = 'MPC — Maths, Physics, Chemistry'; }
        else if (savedStream === 'BiPC') { streamAns = 'B'; streamText = 'BiPC — Biology, Physics, Chemistry'; }
        else if (savedStream === 'MEC/CEC') { streamAns = 'C'; streamText = 'MEC or CEC — Commerce stream'; }
        else if (savedStream === 'HEC/Arts') { streamAns = 'D'; streamText = 'HEC or Arts — Humanities / Other'; }
        
        if (streamAns) {
          setAnswers(prev => ({
            ...prev,
            15: { question: 15, answer: streamAns, text: streamText, pillar: 'stream' }
          }));
        }
      }
    }
  }, [phase]);

  const handleSelect = (optionId: string, optionText: string) => {
    setAnswers(prev => ({
      ...prev,
      [q.id]: { question: q.id, answer: optionId, text: optionText, pillar: q.pillar }
    }));

    setTimeout(() => {
      if (currentIdx < TOTAL - 1) {
        setDirection(1);
        setCurrentIdx(i => i + 1);
      } else {
        const finalAnswers = Object.values({ ...answers, [q.id]: { question: q.id, answer: optionId, text: optionText, pillar: q.pillar } }).sort((a:any,b:any) => a.question - b.question);
        const { ikigaiScores, topCareers } = calculateIkigaiResults(finalAnswers);
        const streamAns = finalAnswers.find((a:any) => a.question === 15)?.answer;
        const streamNames: Record<string, string> = { 'A': 'MPC', 'B': 'BiPC', 'C': 'MEC/CEC', 'D': 'Arts/Humanities' };
        
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          quizAnswers: finalAnswers,
          ikigaiScores,
          topCareers,
          stream: streamNames[streamAns] || 'MPC',
          completedAt: Date.now()
        }));
        setPhase('loading');
      }
    }, 300);
  };

  useEffect(() => {
    if (phase !== 'loading') return;
    const interval = setInterval(() => {
      setLoadingStep(s => {
        if (s >= 4) {
          clearInterval(interval);
          setTimeout(() => navigate('/results'), 800);
          return 4;
        }
        return s + 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [phase, navigate]);

  if (phase === 'intro') {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-slate-800">
        <div className="max-w-xl w-full text-center">
          <div className="inline-flex items-center gap-2 bg-slate-50 border border-slate-200 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-8">
            <ShieldCheck size={14} className="text-primary-green" /> Personalized Career Discovery
          </div>
          <h1 className="font-heading text-4xl md:text-5xl font-black text-gov-blue mb-6 leading-tight">
            Discover Your True Path
          </h1>
          <p className="text-slate-500 font-medium md:text-lg mb-4">
            Our assessment uses the IKIGAI framework to find where your passion meets the world's needs.
          </p>
          
          <IkigaiIntroDiagram />

          <button 
            onClick={() => setPhase('quiz')}
            className="w-full bg-saffron hover:bg-orange-700 text-white py-5 rounded-2xl font-heading font-black text-xl shadow-xl transition-all hover:scale-[1.02] active:scale-95"
          >
            Get Started
          </button>
          <p className="mt-6 text-xs text-slate-400 font-bold uppercase tracking-widest flex items-center justify-center gap-2">
            <Check size={14} className="text-primary-green" /> No registration required
          </p>
        </div>
      </div>
    );
  }

  if (phase === 'loading') {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8 text-center text-slate-800">
        <div className="w-32 h-32 mb-10 relative">
          <div className="absolute inset-0 border-4 border-slate-100 rounded-full" />
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 border-4 border-t-primary-green border-r-transparent border-b-transparent border-l-transparent rounded-full" 
          />
          <div className="absolute inset-0 flex items-center justify-center text-3xl">
            {loadingStep === 0 && '🔍'}
            {loadingStep === 1 && '🧠'}
            {loadingStep === 2 && '📈'}
            {loadingStep === 3 && '🌍'}
            {loadingStep === 4 && '✨'}
          </div>
        </div>
        <h2 className="text-2xl font-black text-gov-blue mb-2">
          {loadingStep === 0 && "Analyzing Passions..."}
          {loadingStep === 1 && "Evaluating Skills..."}
          {loadingStep === 2 && "Checking Compensation..."}
          {loadingStep === 3 && "Matching Market Trends..."}
          {loadingStep === 4 && "Finalizing Results!"}
        </h2>
        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Official Assessment in progress</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Quiz Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-50 px-4 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <button 
            onClick={() => currentIdx > 0 && setCurrentIdx(i => i - 1)}
            disabled={currentIdx === 0}
            className="p-2 hover:bg-slate-100 rounded-xl disabled:opacity-30 transition-colors"
          >
            <ArrowLeft size={20} className="text-slate-600" />
          </button>
          
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-[10px] font-black uppercase tracking-widest border px-2 py-0.5 rounded ${currentPillarInfo?.color} border-current opacity-70`}>
                {currentPillarInfo?.name}
              </span>
            </div>
            <div className="text-xs font-black text-slate-800">
              Question {currentIdx + 1} of {TOTAL}
            </div>
          </div>

          <Link to="/" className="p-2 hover:bg-slate-100 rounded-xl text-slate-400">
            <X size={20} />
          </Link>
        </div>
        
        {/* Progress Bar */}
        <div className="max-w-3xl mx-auto mt-4 h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <motion.div 
            className={`h-full ${currentPillarInfo?.bg || 'bg-primary-green'}`}
            initial={{ width: 0 }}
            animate={{ width: `${progressPct}%` }}
            transition={{ type: 'spring', bounce: 0, duration: 0.5 }}
          />
        </div>
      </div>

      <div className="flex-1 flex flex-col p-4 md:p-8">
        <div className="max-w-2xl mx-auto w-full my-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={q.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full"
            >
              <h2 className="font-heading text-2xl md:text-3xl font-black text-gov-blue mb-10 leading-tight">
                {q.text}
              </h2>

              <div className="grid grid-cols-1 gap-4">
                {q.options.map((opt) => {
                  const isSelected = answers[q.id]?.answer === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleSelect(opt.id, opt.text)}
                      className={`group relative flex items-center p-6 rounded-2xl border-2 transition-all text-left ${
                        isSelected 
                        ? 'border-primary-green bg-emerald-50 shadow-md scale-[1.01]' 
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <span className="text-3xl mr-5 group-hover:scale-110 transition-transform">{opt.emoji}</span>
                      <span className={`text-base md:text-lg font-bold flex-1 ${isSelected ? 'text-emerald-900' : 'text-slate-700'}`}>
                        {opt.text}
                      </span>
                      {isSelected && (
                        <div className="bg-primary-green text-white p-1 rounded-full">
                          <Check size={20} strokeWidth={3} />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
