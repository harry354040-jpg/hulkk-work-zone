import React, { useState } from 'react';
import { GYM_INFO } from '../data/gymInfo';
import { REVIEW_SUGGESTIONS } from '../data/reviewSuggestions';
import {
  Star,
  Copy,
  Check,
  RotateCcw,
  ExternalLink,
  MessageSquareHeart,
  Plus,
  Info,
} from 'lucide-react';

export const ReviewAssistant: React.FC = () => {
  const [selectedStars, setSelectedStars] = useState<number>(5);
  const [hoveredStars, setHoveredStars] = useState<number | null>(null);
  const [reviewText, setReviewText] = useState<string>(
    REVIEW_SUGGESTIONS[5][0]?.text || ''
  );
  const [copied, setCopied] = useState<boolean>(false);
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set(['5-1']));

  const handleStarSelect = (stars: number) => {
    setSelectedStars(stars);
    // If text is empty or matched a default, provide initial suggestion for the selected stars
    const suggestions = REVIEW_SUGGESTIONS[stars] || [];
    if (suggestions.length > 0 && (!reviewText.trim() || reviewText.length < 15)) {
      setReviewText(suggestions[0].text);
      setAddedIds(new Set([suggestions[0].id]));
    }
  };

  const handleAddSuggestion = (id: string, text: string) => {
    setReviewText((prev) => {
      const trimmed = prev.trim();
      if (!trimmed) {
        return text;
      }
      return `${trimmed}\n\n${text}`;
    });

    setAddedIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  const handleClear = () => {
    setReviewText('');
    setAddedIds(new Set());
  };

  const handleCopy = async () => {
    if (!reviewText.trim()) return;
    try {
      await navigator.clipboard.writeText(reviewText.trim());
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Clipboard copy failed:', err);
    }
  };

  const currentSuggestions = REVIEW_SUGGESTIONS[selectedStars] || [];

  return (
    <section id="reviews" className="py-16 sm:py-20 bg-neutral-900/50 border-y border-neutral-800 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-bold tracking-wide uppercase mb-3">
            <MessageSquareHeart className="w-3.5 h-3.5" />
            <span>Interactive Feedback Helper</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-white uppercase tracking-tight">
            Share Your Experience 💬
          </h2>
          <p className="text-neutral-300 text-sm sm:text-base mt-2 leading-relaxed">
            Choose the rating that matches your experience, personalize your thoughts, and share your genuine feedback on Google.
          </p>
        </div>

        <div className="bg-neutral-950 border border-neutral-800 rounded-3xl p-5 sm:p-8 shadow-2xl">
          {/* STEP 1: Star Rating Selector */}
          <div className="mb-8 text-center">
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider block mb-3">
              Step 1: Select Your Star Rating
            </span>
            <div
              className="inline-flex items-center gap-2 sm:gap-4 p-2.5 rounded-2xl bg-neutral-900/80 border border-neutral-800/80"
              role="radiogroup"
              aria-label="Star rating selection"
            >
              {[1, 2, 3, 4, 5].map((star) => {
                const isFilled = (hoveredStars !== null ? hoveredStars : selectedStars) >= star;
                return (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleStarSelect(star)}
                    onMouseEnter={() => setHoveredStars(star)}
                    onMouseLeave={() => setHoveredStars(null)}
                    aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                    className="p-2 sm:p-2.5 rounded-xl hover:bg-neutral-800 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 group min-w-[44px] min-h-[44px] flex items-center justify-center"
                  >
                    <Star
                      className={`w-7 h-7 sm:w-8 sm:h-8 transition-transform group-hover:scale-115 ${
                        isFilled
                          ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.3)]'
                          : 'text-neutral-600'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
            <div className="mt-2 text-xs font-semibold text-neutral-300">
              {selectedStars === 5 && '★★★★★ Excellent Experience'}
              {selectedStars === 4 && '★★★★☆ Very Good Experience'}
              {selectedStars === 3 && '★★★☆☆ Decent / Average Experience'}
              {selectedStars === 2 && '★★☆☆☆ Room for Improvement'}
              {selectedStars === 1 && '★☆☆☆☆ Critical Honest Feedback'}
            </div>
          </div>

          {/* STEP 2: Rating-Based Suggestions */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                Step 2: Tap Suggestions to Add to Your Review (Tap multiple to combine)
              </span>
              <span className="text-[11px] text-neutral-400">
                {currentSuggestions.length} suggestions ready
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {currentSuggestions.map((item) => {
                const isAdded = addedIds.has(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleAddSuggestion(item.id, item.text)}
                    className={`text-left p-3.5 rounded-2xl border transition-all text-xs sm:text-sm leading-relaxed flex flex-col justify-between group ${
                      isAdded
                        ? 'bg-neutral-900 border-amber-500/40 text-neutral-200'
                        : 'bg-neutral-900/60 border-neutral-800 hover:border-neutral-700 text-neutral-300 hover:bg-neutral-900'
                    }`}
                  >
                    <div className="flex items-start gap-2 mb-2">
                      <span className="text-base">{item.emoji}</span>
                      <span className="text-neutral-200 font-medium line-clamp-3">
                        {item.text}
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-neutral-800/60 text-[11px] text-neutral-400 font-semibold">
                      <span>{item.category}</span>
                      <span className="inline-flex items-center gap-1 text-amber-400 group-hover:text-amber-300">
                        <Plus className="w-3.5 h-3.5" />
                        {isAdded ? 'Add Again' : 'Add to Review'}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 3 & 4: Editable Text Area */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="review-textarea" className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                Step 3: Personalize & Edit Your Review Text
              </label>
              <span className="text-[11px] text-neutral-400">
                {reviewText.length} characters • {reviewText.trim() ? reviewText.trim().split(/\s+/).length : 0} words
              </span>
            </div>

            <textarea
              id="review-textarea"
              rows={5}
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Your genuine review text will appear here. Tap suggestions above or write your own thoughts directly..."
              className="w-full bg-neutral-900 border border-neutral-800 rounded-2xl p-4 text-sm sm:text-base text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-amber-500/80 focus:ring-1 focus:ring-amber-500/80 transition-all resize-y leading-relaxed font-normal"
            />
          </div>

          {/* Authenticity notice */}
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-neutral-900/80 border border-neutral-800 text-xs text-neutral-400 mb-6">
            <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p className="leading-normal">
              <strong>Authentic Feedback Notice:</strong> This assistant helps you articulate your thoughts quickly. Please make sure your final review reflects your genuine experience at Hulk's Work Zone before posting.
            </p>
          </div>

          {/* STEP 5: Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={handleClear}
              className="inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-semibold text-neutral-400 hover:text-white bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear Text</span>
            </button>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                type="button"
                onClick={handleCopy}
                disabled={!reviewText.trim()}
                className={`inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl text-sm font-bold border transition-all ${
                  copied
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-neutral-850 hover:bg-neutral-800 text-white border-neutral-700 hover:border-neutral-600 disabled:opacity-50 disabled:cursor-not-allowed'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy Review</span>
                  </>
                )}
              </button>

              <a
                href={GYM_INFO.googleReviewsUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleCopy}
                className="inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-sm font-bold text-neutral-950 bg-amber-400 hover:bg-amber-300 transition-all shadow-lg shadow-amber-500/20 active:scale-95"
              >
                <span>SHARE ON GOOGLE ⭐</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
