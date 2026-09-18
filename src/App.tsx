import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ReviewAssistant } from './components/ReviewAssistant';
import { AiAssistant } from './components/AiAssistant';
import { CalculatorHub } from './components/CalculatorHub';
import { ExerciseLibrary } from './components/ExerciseLibrary';
import { WorkoutBuilder } from './components/WorkoutBuilder';
import { RestTimer } from './components/RestTimer';
import { ProgressTracker } from './components/ProgressTracker';
import { MembershipPlans } from './components/MembershipPlans';
import { GymLocation } from './components/GymLocation';
import { EnquiryModal } from './components/EnquiryModal';
import { Footer } from './components/Footer';
import { ExerciseItem } from './types';
import { GYM_INFO } from './data/gymInfo';
import { Phone, Star, Sparkles } from 'lucide-react';

export default function App() {
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [selectedPlanForEnquiry, setSelectedPlanForEnquiry] = useState<string | undefined>(undefined);
  const [aiPrompt, setAiPrompt] = useState<string | undefined>(undefined);
  const [exerciseForWorkout, setExerciseForWorkout] = useState<ExerciseItem | null>(null);

  const handleOpenEnquiry = (planName?: string) => {
    setSelectedPlanForEnquiry(planName);
    setIsEnquiryOpen(true);
  };

  const handleCloseEnquiry = () => {
    setIsEnquiryOpen(false);
    setSelectedPlanForEnquiry(undefined);
  };

  const handleAskAi = (prompt: string) => {
    setAiPrompt(prompt);
    // Scroll smoothly to AI coach section
    const el = document.getElementById('ai-coach');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleAddExerciseToWorkout = (exercise: ExerciseItem) => {
    setExerciseForWorkout(exercise);
    // Scroll smoothly to workout builder
    const el = document.getElementById('workout-builder');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleExploreTools = () => {
    const el = document.getElementById('calculators');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 selection:bg-emerald-500 selection:text-neutral-950">
      {/* Top Fixed Navigation */}
      <Navbar
        onOpenEnquiry={() => handleOpenEnquiry()}
        activeSection="home"
      />

      {/* Main Page Flow */}
      <main>
        {/* Hero Section with Google Review Trust Card */}
        <Hero
          onOpenEnquiry={() => handleOpenEnquiry()}
          onExploreTools={handleExploreTools}
        />

        {/* Interactive Review Writing Assistant */}
        <ReviewAssistant />

        {/* Real AI Fitness Assistant (Bilingual / Coach Hulk) */}
        <AiAssistant
          externalPrompt={aiPrompt}
          onClearExternalPrompt={() => setAiPrompt(undefined)}
        />

        {/* Comprehensive Scientific Fitness Calculator Hub */}
        <CalculatorHub onAskAi={handleAskAi} />

        {/* Searchable Exercise Directory & Movement Guides */}
        <ExerciseLibrary onAddToWorkout={handleAddExerciseToWorkout} />

        {/* Custom Workout Routine Builder & Volume Calculator */}
        <WorkoutBuilder
          incomingExercise={exerciseForWorkout}
          onClearIncomingExercise={() => setExerciseForWorkout(null)}
          onAskAi={handleAskAi}
        />

        {/* Interval Rest Timer */}
        <RestTimer />

        {/* Personal Progress & PR Tracker */}
        <ProgressTracker />

        {/* Membership Plans & Pricing */}
        <MembershipPlans onSelectPlan={(plan) => handleOpenEnquiry(plan)} />

        {/* Location, Hours, Contact, and FAQs */}
        <GymLocation onOpenEnquiry={() => handleOpenEnquiry()} />
      </main>

      {/* Footer */}
      <Footer />

      {/* Membership & Training Enquiry Modal */}
      <EnquiryModal
        isOpen={isEnquiryOpen}
        onClose={handleCloseEnquiry}
        initialPlan={selectedPlanForEnquiry}
      />

      {/* Mobile Sticky Quick Action Bar */}
      <div className="sm:hidden fixed bottom-3 left-3 right-3 z-40 flex items-center gap-2 bg-neutral-900/90 backdrop-blur-md p-2 rounded-2xl border border-neutral-800 shadow-2xl">
        <a
          href={`tel:${GYM_INFO.phoneRaw}`}
          className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-neutral-800 text-xs font-bold text-white border border-neutral-700 active:scale-95 transition-transform"
        >
          <Phone className="w-3.5 h-3.5 text-emerald-400" />
          <span>Call Gym</span>
        </a>

        <a
          href={GYM_INFO.googleReviewsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-amber-400 text-xs font-bold text-neutral-950 active:scale-95 transition-transform shadow-md shadow-amber-500/20"
        >
          <Star className="w-3.5 h-3.5 fill-current" />
          <span>Review ⭐</span>
        </a>

        <button
          onClick={() => handleOpenEnquiry()}
          className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-emerald-400 text-xs font-bold text-neutral-950 active:scale-95 transition-transform shadow-md shadow-emerald-500/20"
        >
          <span>Join Now</span>
        </button>
      </div>
    </div>
  );
}
