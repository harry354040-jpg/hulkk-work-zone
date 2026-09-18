import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { MobileBottomNav } from './components/MobileBottomNav';
import { ScrollToTop } from './components/ScrollToTop';
import { EnquiryModal } from './components/EnquiryModal';
import { ReviewModal } from './components/ReviewModal';

// Pages
import { HomePage } from './pages/HomePage';
import { StartHerePage } from './pages/StartHerePage';
import { ToolsHubPage } from './pages/tools/ToolsHubPage';
import { BmiPage } from './pages/tools/BmiPage';
import { BmrTdeePage } from './pages/tools/BmrTdeePage';
import { CaloriesMacrosPage } from './pages/tools/CaloriesMacrosPage';
import { BodyFatPage } from './pages/tools/BodyFatPage';
import { OneRepMaxPage } from './pages/tools/OneRepMaxPage';
import { RestTimerPage } from './pages/tools/RestTimerPage';
import { ExercisesPage } from './pages/ExercisesPage';
import { ExerciseDetailPage } from './pages/ExerciseDetailPage';
import { WorkoutBuilderPage } from './pages/WorkoutBuilderPage';
import { ProgressPage } from './pages/ProgressPage';
import { AiCoachPage } from './pages/AiCoachPage';
import { MembershipPage } from './pages/MembershipPage';
import { ReviewsPage } from './pages/ReviewsPage';
import { ContactPage } from './pages/ContactPage';
import { FaqPage } from './pages/FaqPage';

import { ExerciseItem } from './types';
import { openWhatsAppMembershipEnquiry } from './utils/whatsappEnquiry';

function AppContent() {
  const navigate = useNavigate();
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [selectedPlanForEnquiry, setSelectedPlanForEnquiry] = useState<string | undefined>(undefined);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [exerciseForWorkout, setExerciseForWorkout] = useState<ExerciseItem | null>(null);

  const handleOpenEnquiry = (planName?: string) => {
    if (planName) {
      openWhatsAppMembershipEnquiry(planName);
      return;
    }
    setSelectedPlanForEnquiry(undefined);
    setIsEnquiryOpen(true);
  };

  const handleMembershipPlanSelect = (planName: string) => {
    openWhatsAppMembershipEnquiry(planName);
  };

  const handleCloseEnquiry = () => {
    setIsEnquiryOpen(false);
    setSelectedPlanForEnquiry(undefined);
  };

  const handleAskAi = (prompt: string) => {
    navigate('/ai-coach', { state: { initialPrompt: prompt } });
  };

  const handleAddExerciseToWorkout = (exercise: ExerciseItem) => {
    setExerciseForWorkout(exercise);
    navigate('/workout-builder');
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col selection:bg-emerald-500 selection:text-neutral-950">
      <ScrollToTop />

      {/* Top Fixed Navigation */}
      <Navbar onOpenEnquiry={handleOpenEnquiry} />

      {/* Primary Routing Content */}
      <main className="flex-1">
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                onOpenEnquiry={handleOpenEnquiry}
                onOpenReviewModal={() => setIsReviewModalOpen(true)}
              />
            }
          />
          <Route
            path="/start"
            element={
              <StartHerePage
                onOpenEnquiry={handleOpenEnquiry}
                onAskAi={handleAskAi}
              />
            }
          />

          {/* Tools Hub & Sub-Routes */}
          <Route
            path="/tools"
            element={<ToolsHubPage onAskAi={handleAskAi} />}
          />
          <Route
            path="/tools/bmi"
            element={<BmiPage onAskAi={handleAskAi} />}
          />
          <Route
            path="/tools/bmr-tdee"
            element={<BmrTdeePage onAskAi={handleAskAi} />}
          />
          <Route
            path="/tools/calories"
            element={<CaloriesMacrosPage onAskAi={handleAskAi} />}
          />
          <Route
            path="/tools/body-fat"
            element={<BodyFatPage onAskAi={handleAskAi} />}
          />
          <Route
            path="/tools/one-rep-max"
            element={<OneRepMaxPage onAskAi={handleAskAi} />}
          />
          <Route
            path="/tools/rest-timer"
            element={<RestTimerPage />}
          />

          {/* Exercise Library & Detail */}
          <Route
            path="/exercises"
            element={<ExercisesPage onAddToWorkout={handleAddExerciseToWorkout} />}
          />
          <Route
            path="/exercises/:exerciseId"
            element={<ExerciseDetailPage onAskAi={handleAskAi} />}
          />

          {/* Workout Builder & Progress */}
          <Route
            path="/workout-builder"
            element={
              <WorkoutBuilderPage
                incomingExercise={exerciseForWorkout}
                onClearIncomingExercise={() => setExerciseForWorkout(null)}
                onAskAi={handleAskAi}
              />
            }
          />
          <Route
            path="/progress"
            element={<ProgressPage />}
          />

          {/* AI Coach */}
          <Route
            path="/ai-coach"
            element={<AiCoachPage />}
          />

          {/* Gym Hub Pages */}
          <Route
            path="/membership"
            element={<MembershipPage onSelectPlan={handleMembershipPlanSelect} />}
          />
          <Route
            path="/reviews"
            element={<ReviewsPage onOpenReviewModal={() => setIsReviewModalOpen(true)} />}
          />
          <Route
            path="/contact"
            element={<ContactPage onOpenEnquiry={handleOpenEnquiry} />}
          />
          <Route
            path="/faq"
            element={<FaqPage onOpenEnquiry={() => handleOpenEnquiry()} />}
          />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Global Footer */}
      <Footer />

      {/* Persistent Mobile Bottom Bar */}
      <MobileBottomNav />

      {/* Global Modals */}
      <EnquiryModal
        isOpen={isEnquiryOpen}
        onClose={handleCloseEnquiry}
        initialPlan={selectedPlanForEnquiry}
      />

      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
