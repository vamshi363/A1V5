import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Layout } from './components/Layout';
import HomePage from './pages/HomePage';
import UniversitiesPage from './pages/UniversitiesPage';
import UniversityDetailsPage from './pages/UniversityDetailsPage';
import ScholarshipsPage from './pages/ScholarshipsPage';
import ScholarshipDetailsPage from './pages/ScholarshipDetailsPage';
import ToolsPage from './pages/ToolsPage';
import ExamsPage from './pages/ExamsPage';
import ExamDetailsPage from './pages/ExamDetailsPage';
import ExamFinderPage from './pages/ExamFinderPage';
import HelpPage from './pages/HelpPage';
import SavedPage from './pages/SavedPage';
import ComparePage from './pages/ComparePage';
import { LegalPage } from './pages/LegalPage';
import { CoursePage } from './pages/CoursePage';
import CoursesExplorerPage from './pages/CoursesExplorerPage';
import { CareerPage } from './pages/CareerPage';
import { SkillPage } from './pages/SkillPage';
import { RoadmapPage } from './pages/RoadmapPage';
import QuizPage from './pages/QuizPage';
import ResultsPage from './pages/ResultsPage';
import JEECalculatorPage from './pages/JEECalculatorPage';
import CertificateCheckerPage from './pages/CertificateCheckerPage';
import LifeAfterNeetPage from './pages/LifeAfterNeetPage';

// Component to scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const App: React.FC = () => {
  return (
    <Router>
      <ScrollToTop />
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/universities" element={<UniversitiesPage />} />
          <Route path="/universities/:id" element={<UniversityDetailsPage />} />
          <Route path="/scholarships" element={<ScholarshipsPage />} />
          <Route path="/scholarships/:id" element={<ScholarshipDetailsPage />} />
          <Route path="/exams" element={<ExamsPage />} />
          <Route path="/exams/:id" element={<ExamDetailsPage />} />
          <Route path="/exam-finder" element={<ExamFinderPage />} />
          <Route path="/tools" element={<ToolsPage />} />
          <Route path="/compare" element={<ComparePage />} />
          <Route path="/courses" element={<CoursesExplorerPage />} />
          <Route path="/courses/:slug" element={<CoursePage />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/jee-marks-calculator" element={<JEECalculatorPage />} />
          <Route path="/certificate-checker" element={<CertificateCheckerPage />} />
          <Route path="/life-after-neet" element={<LifeAfterNeetPage />} />
          <Route path="/careers/:slug" element={<CareerPage />} />
          <Route path="/skills/:slug" element={<SkillPage />} />
          <Route path="/roadmaps/:slug" element={<RoadmapPage />} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="/saved" element={<SavedPage />} />
          <Route path="/privacy" element={<LegalPage title="Privacy Policy" />} />
          <Route path="/terms" element={<LegalPage title="Terms & Conditions" />} />
          <Route path="/disclaimer" element={<LegalPage title="Disclaimer" />} />
          <Route path="/login" element={
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
               <h1 className="text-3xl font-bold mb-4">Join After Inter</h1>
               <p className="text-slate-500 mb-8">Save your favorite colleges and track applications.</p>
               <button className="bg-primary-green text-white px-12 py-4 rounded-2xl font-bold shadow-lg">Sign In with Google</button>
            </div>
          } />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;