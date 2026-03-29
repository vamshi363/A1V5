import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Upload, FileText, CheckCircle, ChevronRight, Share2, AlertCircle, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import * as pdfjsLib from 'pdfjs-dist';

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

  // UI Helpers
  const CircleRing = ({ value, label, color, size = 100, max = 100 }: { value: number, label: string, color: string, size?: number, max?: number }) => {
    const strokeWidth = size * 0.1;
    const radius = size * 0.4;
    const circumference = 2 * Math.PI * radius;
    // Cap value at max for visual reasons, handle negatives gracefully
    const displayValue = Math.max(0, Math.min(value, max));
    const offset = circumference - (displayValue / max) * circumference;
    
    return (
      <div className="flex flex-col items-center">
        <div className="relative" style={{ width: size, height: size }}>
          {/* Background circle */}
          <svg className="transform -rotate-90 w-full h-full">
            <circle cx={size/2} cy={size/2} r={radius} stroke="currentColor" strokeWidth={strokeWidth} fill="transparent" className="text-slate-800" />
            <motion.circle
              cx={size/2}
              cy={size/2}
              r={radius}
              stroke={color}
              strokeWidth={strokeWidth}
              fill="transparent"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <span className="text-xl font-bold text-white">{value.toFixed(1)}</span>
          </div>
        </div>
        <span className="mt-2 text-sm text-slate-400 font-medium">{label}</span>
      </div>
    );
  };

  const getStrongestSubject = () => {
    const { physics, chemistry, maths } = scoreData;
    if (physics > chemistry && physics > maths) return { name: "Physics", icon: "⚛️", matches: "ECE, EEE, Mechanical" };
    if (maths > chemistry && maths > physics) return { name: "Mathematics", icon: "📐", matches: "CSE, AI/ML, Data Science" };
    if (chemistry > physics && chemistry > maths) return { name: "Chemistry", icon: "🧪", matches: "Chemical Engg, Biotech" };
    return { name: "Balanced", icon: "⚖️", matches: "CS/IT, ECE, or Multi-disciplinary branches" };
  };

  const getExamRecommendation = () => {
    const raw = scoreData.totalRaw;
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

  const examRec = getExamRecommendation();
  const strongSubj = getStrongestSubject();

  return (
    <div className="min-h-screen bg-[#0A0F1E] text-white pt-24 pb-20">
      <Helmet>
        <title>JEE Scorecard Analyzer 2026 | Upload PDF → Get College Predictions Instantly | After Inter</title>
        <meta name="description" content="Upload your NTA JEE Main 2026 scorecard PDF. We automatically extract your marks, predict percentile and show which colleges you can get. Free, instant, private." />
      </Helmet>

      <div className="max-w-4xl mx-auto px-4">
        
        {/* PRIVACY BADGE */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-4 py-2 rounded-full border border-emerald-500/20 text-sm font-medium">
            <CheckCircle className="w-4 h-4" />
            <span>🔒 Native Browser Processing. Your response sheet is never uploaded to any server.</span>
          </div>
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
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
              <div className="text-center space-y-4">
                <h1 className="text-4xl md:text-5xl font-bold">
                  JEE Response Sheet <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F59E0B] to-yellow-300">Analyzer</span>
                </h1>
                <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                  Upload your NTA Response Sheet PDF. We will calculate your exact Raw Marks (out of 300) and suggest suitable exams for you in 2 seconds.
                </p>
              </div>

              {/* DROPZONE */}
              <div 
                className={`relative overflow-hidden rounded-3xl border-2 border-dashed transition-all duration-300 ${isDragging ? 'border-[#F59E0B] bg-[#F59E0B]/5' : 'border-slate-700 hover:border-slate-500 bg-slate-900/50'}`}
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
                
                <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
                  <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 transition-colors ${isDragging ? 'bg-[#F59E0B]/20' : 'bg-slate-800'}`}>
                    <Upload className={`w-10 h-10 ${isDragging ? 'text-[#F59E0B]' : 'text-slate-400'}`} />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">📄 Upload Your NTA Response Sheet PDF</h3>
                  <p className="text-slate-400 mb-6">Drag and drop your PDF here or click to browse</p>
                  
                  <div className="flex items-center gap-2 text-sm text-slate-500 bg-slate-950/50 px-4 py-2 rounded-full">
                    <AlertCircle className="w-4 h-4" />
                    <span>Supported: .pdf files only (Max 5MB)</span>
                  </div>

                  {errorMsg && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 text-red-400 bg-red-400/10 px-4 py-2 rounded-lg">
                      {errorMsg}
                    </motion.div>
                  )}
                </div>
              </div>

              {/* INSTRUCTIONS */}
              <div className="bg-slate-900/50 rounded-3xl p-8 border border-slate-800">
                <h3 className="text-xl font-bold mb-6 text-center">How to get your PDF?</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-slate-950/50 p-6 rounded-2xl text-center border border-slate-800/50">
                    <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-[#F59E0B] font-bold">1</div>
                    <p className="font-medium text-slate-300">Login to NTA Portal during the answer key challenging window</p>
                  </div>
                  <div className="bg-slate-950/50 p-6 rounded-2xl text-center border border-slate-800/50">
                    <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-[#F59E0B] font-bold">2</div>
                    <p className="font-medium text-slate-300">Download your large 'Response Sheet' PDF (usually 30+ pages)</p>
                  </div>
                  <div className="bg-slate-950/50 p-6 rounded-2xl text-center border border-slate-800/50">
                    <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-[#F59E0B] font-bold">3</div>
                    <p className="font-medium text-slate-300">Upload it here to instantly calculate your total score!</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ========================================== */}
          {/* PARSING LOADING */}
          {/* ========================================== */}
          {step === 'parsing' && (
            <motion.div 
              key="parsing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-32 flex flex-col items-center justify-center text-center"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                className="w-16 h-16 border-4 border-slate-800 border-t-[#F59E0B] rounded-full mb-8"
              />
              <h2 className="text-2xl font-bold mb-2">Analyzing Response Sheet</h2>
              <p className="text-slate-400">Extracting raw marks securely in your browser...</p>
            </motion.div>
          )}

          {/* ========================================== */}
          {/* FALLBACK MANUAL FORM */}
          {/* ========================================== */}
          {step === 'fallback' && (
            <motion.div 
              key="fallback"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-2xl mx-auto"
            >
              <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="w-8 h-8 text-orange-400" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">We couldn't read your PDF automatically.</h2>
                  <p className="text-slate-400">
                    {docType === 'scorecard' 
                      ? "This looks like a Scorecard. Please upload a JEE Main Response Sheet (which contains Question IDs) to extract raw marks." 
                      : "The NTA format might have changed. Please enter your known raw marks manually."}
                  </p>
                  
                  <button 
                    onClick={() => setShowDebug(!showDebug)}
                    className="mt-4 text-xs text-slate-500 hover:text-slate-300 underline"
                  >
                    {showDebug ? "Hide Debug Info" : "Show Debug Info (For Developers)"}
                  </button>
                  
                  {showDebug && debugText && (
                    <div className="mt-4 p-4 bg-black/50 rounded-lg text-left text-[10px] font-mono overflow-auto max-h-40 text-slate-400">
                      {debugText.substring(0, 2000)}...
                    </div>
                  )}
                </div>

                <form onSubmit={handleManualSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Student Name (Optional)</label>
                    <input 
                      type="text" 
                      name="name"
                      placeholder="e.g. Rahul Reddy"
                      value={scoreData.name === 'Student' ? '' : scoreData.name}
                      onChange={handleFallbackChange}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#F59E0B] transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-2">Physics (out of 100)</label>
                      <input 
                        type="number" step="1" name="physics" required max="100" min="-25"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#F59E0B]"
                        onChange={handleFallbackChange}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-2">Chemistry (out of 100)</label>
                      <input 
                        type="number" step="1" name="chemistry" required max="100" min="-25"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#F59E0B]"
                        onChange={handleFallbackChange}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-2">Maths (out of 100)</label>
                      <input 
                        type="number" step="1" name="maths" required max="100" min="-25"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#F59E0B]"
                        onChange={handleFallbackChange}
                      />
                    </div>
                  </div>

                  <button type="submit" className="w-full bg-[#F59E0B] hover:bg-orange-400 text-slate-950 font-bold text-lg py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)] flex items-center justify-center gap-2 mt-4">
                    View Analysis <ChevronRight className="w-5 h-5" />
                  </button>
                </form>
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
              className="space-y-10"
            >
              {/* HEADER */}
              <div className="text-center space-y-4 mb-12">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.2 }}
                  className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <span className="text-4xl">🎉</span>
                </motion.div>
                <h1 className="text-4xl md:text-5xl font-bold">
                  Hi <span className="text-[#F59E0B] capitalize">{scoreData.name}</span>!
                </h1>
                <h2 className="text-2xl text-slate-300">Your Raw Marks Calculation is Ready</h2>
                
                <p className="text-slate-400 max-w-lg mx-auto mt-2">
                  Note: Official percentiles will be released by NTA later. This relies entirely on your response keys.
                </p>
              </div>

              {/* SCORE CARDS */}
              <div className="bg-slate-900/40 backdrop-blur-sm border border-slate-800 rounded-3xl p-8 shadow-xl">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
                  <CircleRing value={scoreData.physics} label="⚛️ Physics" color="#3B82F6" max={100} />
                  <CircleRing value={scoreData.chemistry} label="🧪 Chemistry" color="#10B981" max={100} />
                  <CircleRing value={scoreData.maths} label="📐 Mathematics" color="#F97316" max={100} />
                  <CircleRing value={scoreData.totalRaw || (scoreData.physics + scoreData.chemistry + scoreData.maths)} label="🏆 Total Score" color="#F59E0B" size={120} max={300} />
                </div>
                
                <div className="mt-8 pt-8 border-t border-slate-800 grid md:grid-cols-2 gap-6">
                  <div className="bg-slate-950/50 p-6 rounded-2xl border border-slate-800">
                    <p className="font-medium text-lg mb-2">
                       {strongSubj.icon} {strongSubj.name} is your strongest subject
                    </p>
                    <p className="text-slate-400 text-sm">
                      Your strength suits: <span className="text-white font-medium">{strongSubj.matches}</span>
                    </p>
                  </div>
                  <div className="bg-emerald-500/10 p-6 rounded-2xl border border-emerald-500/20 flex flex-col justify-center">
                    <h4 className="font-bold text-emerald-400 mb-1">{examRec.title}</h4>
                    <p className="text-emerald-300/80 text-sm leading-relaxed">
                      {examRec.desc}
                    </p>
                  </div>
                </div>
              </div>

              {/* EXAM RECOMMENDATIONS BASED ON SCORE (REPLACING COLLEGE SEARCH) */}
              <div>
                <h3 className="text-3xl font-bold mb-8">Exams You Should Target, {scoreData.name}</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {examRec.exams.map((exam) => (
                    <div key={exam} className="bg-slate-900/60 border border-slate-700 p-6 rounded-2xl text-center shadow-lg relative overflow-hidden group hover:border-[#F59E0B] transition-colors">
                      <div className="absolute inset-0 bg-[#F59E0B]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <CheckCircle className="w-8 h-8 text-[#F59E0B] mx-auto mb-4 opacity-80" />
                      <p className="font-bold text-xl text-slate-200">{exam}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* IKIGAI HOOK */}
                <div className="relative overflow-hidden bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-indigo-500/30 rounded-3xl p-8 shadow-xl flex flex-col justify-between">
                  <div className="absolute top-0 right-0 -mr-20 -mt-20 w-48 h-48 bg-indigo-500/20 blur-3xl rounded-full pointer-events-none" />
                  <div className="relative z-10">
                    <h3 className="text-2xl font-bold mb-3">Which Branch fits YOU?</h3>
                    <p className="text-indigo-200/80 mb-6">
                      Don't just pick CSE. Discover the engineering field that matches your skills, passion, and market demand using our IKIGAI framework.
                    </p>
                  </div>
                  <Link to="/quiz" className="inline-flex w-fit items-center gap-2 bg-indigo-500 hover:bg-indigo-400 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-lg relative z-10">
                    Take Free Career Quiz <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>

                {/* EXPLORE COURSES HOOK */}
                <div className="relative overflow-hidden bg-gradient-to-br from-emerald-900/40 to-teal-900/40 border border-emerald-500/30 rounded-3xl p-8 shadow-xl flex flex-col justify-between">
                  <div className="absolute top-0 left-0 -ml-20 -mt-20 w-48 h-48 bg-emerald-500/20 blur-3xl rounded-full pointer-events-none" />
                  <div className="relative z-10">
                    <h3 className="text-2xl font-bold mb-3">Explore Top Courses</h3>
                    <p className="text-emerald-200/80 mb-6">
                      Confused between ECE and Artificial Intelligence? Explore detailed roadmaps, salaries, and real truths about all engineering degrees.
                    </p>
                  </div>
                  <Link to="/courses" className="inline-flex w-fit items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-lg relative z-10">
                    Explore Course Roadmaps <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* SHARE */}
              <div className="text-center pt-8 border-t border-slate-800">
                <p className="font-medium mb-4">Share your results with friends</p>
                <button 
                  onClick={() => {
                    const text = `I just calculated my JEE main raw marks on After Inter!\nTotal Marks: ${scoreData.totalRaw || (scoreData.physics + scoreData.chemistry + scoreData.maths)}/300\nCalculate yours instantly:\nhttps://afterinter.in/jee-marks-calculator`;
                    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`);
                  }}
                  className="inline-flex items-center gap-2 bg-[#25D366]/20 text-[#25D366] hover:bg-[#25D366]/30 px-6 py-3 rounded-full font-medium transition-colors"
                >
                  <Share2 className="w-5 h-5" />
                  Share on WhatsApp
                </button>
              </div>

              <div className="flex justify-center mt-8">
                 <button onClick={() => setStep('upload')} className="text-slate-500 hover:text-white flex items-center gap-2 text-sm transition-colors">
                   <RefreshCw className="w-4 h-4" /> Analyze Another Response Sheet
                 </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
