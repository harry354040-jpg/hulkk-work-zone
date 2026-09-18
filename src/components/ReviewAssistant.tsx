import React from 'react';
import { GYM_INFO } from '../data/gymInfo';
import {
  Star,
  MessageSquare,
  ShieldCheck,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  MapPin,
} from 'lucide-react';

interface ReviewAssistantProps {
  onOpenReviewModal: () => void;
}

export const ReviewAssistant: React.FC<ReviewAssistantProps> = ({ onOpenReviewModal }) => {
  return (
    <section id="reviews-experience" className="py-12 sm:py-16 bg-neutral-900/40 rounded-3xl border border-neutral-800 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Trust Banner Header */}
        <div className="bg-neutral-950 border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-xl mb-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            <div className="w-20 h-20 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex flex-col items-center justify-center shrink-0">
              <span className="font-heading font-black text-3xl text-amber-400">4.8</span>
              <div className="flex text-amber-400 mt-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-amber-400" />
                ))}
              </div>
            </div>
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                <h2 className="font-heading text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
                  Google Reviews
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Verified Gym</span>
                </span>
              </div>
              <p className="text-xs sm:text-sm text-neutral-300 max-w-xl">
                Trained at Hulk&apos;s Work Zone? Share your genuine experience to help fellow fitness enthusiasts and beginners in Dabra find the right gym.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full md:w-auto shrink-0">
            <button
              type="button"
              id="assistant-write-google-review-btn"
              onClick={onOpenReviewModal}
              className="inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl text-xs sm:text-sm font-bold text-neutral-950 bg-amber-400 hover:bg-amber-300 transition-all shadow-md shadow-amber-500/20 active:scale-98"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Write a Google Review</span>
            </button>

            <button
              type="button"
              id="assistant-draft-btn"
              onClick={onOpenReviewModal}
              className="inline-flex items-center justify-center gap-1.5 py-3 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-850 border border-amber-500/30 text-amber-400 hover:text-amber-300 text-xs font-semibold transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Draft Assistant ↓</span>
            </button>

            <a
              href={GYM_INFO.googleReviewsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-semibold text-neutral-300 bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 transition-colors"
            >
              <span>View Google Reviews</span>
              <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
            </a>
          </div>
        </div>

        {/* Step-by-Step Transparent Flow */}
        <div className="mb-10">
          <div className="text-center max-w-xl mx-auto mb-6">
            <h3 className="font-heading text-lg sm:text-xl font-bold text-white uppercase tracking-tight">
              How Reviewing Works
            </h3>
            <p className="text-xs text-neutral-400 mt-1">
              Simple, transparent, and always in your control. The website never submits on your behalf.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 font-bold text-xs flex items-center justify-center border border-amber-500/20">
                1
              </div>
              <h4 className="font-heading font-bold text-sm text-white">
                Rate &amp; Write Your Experience
              </h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Choose your star rating and write what you felt about our iron equipment, coaches, or atmosphere. No personal passwords or IDs required.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 font-bold text-xs flex items-center justify-center border border-amber-500/20">
                2
              </div>
              <h4 className="font-heading font-bold text-sm text-white">
                Optional Draft Assistant
              </h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Need help wording your experience? The assistant helps structure a clean draft based only on points you pick. You can edit every word.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 font-bold text-xs flex items-center justify-center border border-amber-500/20">
                3
              </div>
              <h4 className="font-heading font-bold text-sm text-white">
                Continue to Google Maps
              </h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Preview your review, click &quot;Continue to Google&quot;, and paste your text into Google Reviews to publish it under your Google profile.
              </p>
            </div>
          </div>
        </div>

        {/* Genuine Reviews Commitment */}
        <div className="p-5 rounded-2xl bg-neutral-950/80 border border-neutral-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-xs sm:text-sm text-white block">
                Genuine Reviews Policy
              </span>
              <span className="text-xs text-neutral-400 leading-relaxed">
                We do not display simulated testimonials or fake customer reviews. All reviews for Hulk&apos;s Work Zone are published publicly on Google Maps by real visitors and members.
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenReviewModal}
            className="shrink-0 px-4 py-2 rounded-xl bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/30 text-amber-300 text-xs font-bold transition-colors"
          >
            Leave Your Feedback
          </button>
        </div>
      </div>
    </section>
  );
};
