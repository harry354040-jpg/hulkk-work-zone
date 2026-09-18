import React from 'react';
import { Link } from 'react-router-dom';
import { ReviewAssistant } from '../components/ReviewAssistant';
import {
  Star,
  ChevronRight,
  ExternalLink,
  MessageSquare,
  ShieldCheck,
  MapPin,
} from 'lucide-react';
import { GYM_INFO } from '../data/gymInfo';

interface ReviewsPageProps {
  onOpenReviewModal: () => void;
}

export const ReviewsPage: React.FC<ReviewsPageProps> = ({ onOpenReviewModal }) => {
  return (
    <div className="min-h-screen bg-neutral-950 pt-24 pb-28 sm:pb-16 text-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-neutral-400 mb-6" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-neutral-600" />
          <span className="text-amber-400 font-medium">Member Reviews</span>
        </nav>

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-3">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span>Real Member Feedback</span>
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white uppercase mb-3">
              Member <span className="text-amber-400">Reviews</span>
            </h1>
            <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
              Read authentic experiences from athletes and fitness beginners training at Hulk's Work Zone in Dabra, MP.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onOpenReviewModal}
              className="inline-flex items-center gap-2 py-3 px-5 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 text-xs font-bold transition-all shadow-md shadow-amber-500/20 active:scale-98"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Write a Google Review</span>
            </button>

            <a
              href={GYM_INFO.googleReviewsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 py-3 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-xs font-semibold text-neutral-300 hover:text-white transition-colors"
            >
              <span>View Google Reviews</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Review Component */}
        <ReviewAssistant onOpenReviewModal={onOpenReviewModal} />
      </div>
    </div>
  );
};
