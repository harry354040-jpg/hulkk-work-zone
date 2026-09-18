import React, { useState, useEffect, useRef } from 'react';
import { GYM_INFO } from '../data/gymInfo';
import {
  EXPERIENCE_ASPECTS,
  ExperienceAspect,
  STAR_LABELS,
  generateReviewDraft,
} from '../utils/reviewDraftGenerator';
import {
  Star,
  X,
  Copy,
  Check,
  ExternalLink,
  Sparkles,
  Edit3,
  RotateCcw,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialShowAssistant?: boolean;
}

const STORAGE_KEY = 'hwz_google_review_draft_v2';

export const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  initialShowAssistant = false,
}) => {
  const [rating, setRating] = useState<number>(5);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [selectedAspects, setSelectedAspects] = useState<string[]>([]);
  const [customNote, setCustomNote] = useState<string>('');
  const [variationIndex, setVariationIndex] = useState<number>(0);
  const [reviewText, setReviewText] = useState<string>('');
  const [isManuallyEdited, setIsManuallyEdited] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [googleNotice, setGoogleNotice] = useState<string | null>(null);
  const [isEditingFocused, setIsEditingFocused] = useState<boolean>(false);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Load saved session draft on mount
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        if (data.rating && typeof data.rating === 'number') setRating(data.rating);
        if (Array.isArray(data.selectedAspects)) setSelectedAspects(data.selectedAspects);
        if (typeof data.customNote === 'string') setCustomNote(data.customNote);
        if (typeof data.reviewText === 'string' && data.reviewText.trim()) {
          setReviewText(data.reviewText);
          setIsManuallyEdited(Boolean(data.isManuallyEdited));
          return;
        }
      }
    } catch {
      // Ignore sessionStorage parsing errors
    }

    // Default initial draft (5 stars)
    const initialDraft = generateReviewDraft({
      rating: 5,
      selectedAspects: [],
      customNote: '',
      variationIndex: 0,
    });
    setReviewText(initialDraft);
  }, []);

  // Save draft temporarily to sessionStorage
  useEffect(() => {
    if (!reviewText) return;
    try {
      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          rating,
          selectedAspects,
          customNote,
          reviewText,
          isManuallyEdited,
        })
      );
    } catch {
      // Ignore storage errors
    }
  }, [rating, selectedAspects, customNote, reviewText, isManuallyEdited]);

  // If user hasn't explicitly written a custom review from scratch, update draft when rating/aspects/note change
  const regenerateWithNewInputs = (
    newRating: number,
    newAspects: string[],
    newNote: string,
    newVarIndex: number
  ) => {
    const draft = generateReviewDraft({
      rating: newRating,
      selectedAspects: newAspects,
      customNote: newNote,
      variationIndex: newVarIndex,
    });
    setReviewText(draft);
    setIsManuallyEdited(false);
  };

  const handleRatingChange = (newStar: number) => {
    setRating(newStar);
    setCopied(false);
    setGoogleNotice(null);
    regenerateWithNewInputs(newStar, selectedAspects, customNote, 0);
  };

  const handleToggleAspect = (aspect: ExperienceAspect) => {
    const nextAspects = selectedAspects.includes(aspect)
      ? selectedAspects.filter((a) => a !== aspect)
      : [...selectedAspects, aspect];

    setSelectedAspects(nextAspects);
    setCopied(false);
    setGoogleNotice(null);
    regenerateWithNewInputs(rating, nextAspects, customNote, variationIndex);
  };

  const handleCustomNoteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCustomNote(val);
    setCopied(false);
    setGoogleNotice(null);
    regenerateWithNewInputs(rating, selectedAspects, val, variationIndex);
  };

  const handleGenerateAgain = () => {
    const nextVar = variationIndex + 1;
    setVariationIndex(nextVar);
    setCopied(false);
    setGoogleNotice(null);
    regenerateWithNewInputs(rating, selectedAspects, customNote, nextVar);
  };

  const handleManualTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReviewText(e.target.value);
    setIsManuallyEdited(true);
    setCopied(false);
    setGoogleNotice(null);
  };

  const handleFocusEdit = () => {
    if (textareaRef.current) {
      textareaRef.current.focus();
      setIsEditingFocused(true);
    }
  };

  const copyToClipboard = async (text: string): Promise<boolean> => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch {
      // Fallback
    }

    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textarea);
      return successful;
    } catch {
      return false;
    }
  };

  const handleCopyReview = async () => {
    const textToCopy = reviewText.trim();
    if (!textToCopy) return;

    const success = await copyToClipboard(textToCopy);
    if (success) {
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 3500);
    }
  };

  const handleContinueToGoogle = async () => {
    const textToCopy = reviewText.trim();
    if (textToCopy) {
      await copyToClipboard(textToCopy);
      setCopied(true);
    }

    // Set clear instruction message
    setGoogleNotice(
      `Your review has been copied. Google will open next. Please select the same star rating (${rating} Star${
        rating > 1 ? 's' : ''
      }) and paste your review.`
    );

    // Open existing configured Google review URL in a new window/tab
    window.open(GYM_INFO.googleReviewsUrl, '_blank', 'noopener,noreferrer');
  };

  const handleResetDraft = () => {
    sessionStorage.removeItem(STORAGE_KEY);
    setRating(5);
    setSelectedAspects([]);
    setCustomNote('');
    setVariationIndex(0);
    setIsManuallyEdited(false);
    setCopied(false);
    setGoogleNotice(null);
    const resetDraft = generateReviewDraft({
      rating: 5,
      selectedAspects: [],
      customNote: '',
      variationIndex: 0,
    });
    setReviewText(resetDraft);
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="google-review-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-150 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-2xl w-full my-auto max-h-[92vh] overflow-y-auto p-5 sm:p-7 shadow-2xl relative text-neutral-100 flex flex-col gap-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
              <Star className="w-5 h-5 fill-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2
                  id="google-review-modal-title"
                  className="font-heading text-lg sm:text-xl font-black text-white uppercase tracking-tight"
                >
                  Write a Google Review
                </h2>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Verified Gym</span>
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                Hulk&apos;s Work Zone • Dabra, Madhya Pradesh
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleResetDraft}
              title="Reset draft and start over"
              className="text-[11px] font-semibold text-neutral-500 hover:text-neutral-300 px-2 py-1 rounded-lg hover:bg-neutral-800 transition-colors"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close review dialog"
              className="p-2 rounded-full bg-neutral-800/80 text-neutral-400 hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Respectful Assistant Welcome Callout */}
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-3 text-xs sm:text-sm text-neutral-200">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-semibold text-amber-300 block mb-0.5">
              &quot;Sir / Ma&apos;am, I can help you write a short review based on your actual experience.&quot;
            </span>
            <span className="text-neutral-300 text-xs">
              Select your rating and optional highlights below. An authentic review draft will be generated instantly for you to edit and copy.
            </span>
          </div>
        </div>

        {/* QUESTION 1: HOW WAS YOUR EXPERIENCE? */}
        <div className="space-y-3 bg-neutral-950 border border-neutral-800/90 rounded-2xl p-4 sm:p-5">
          <div className="text-center sm:text-left">
            <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">
              Step 1
            </span>
            <h3 className="font-heading text-sm sm:text-base font-black text-white uppercase tracking-tight">
              HOW WAS YOUR EXPERIENCE AT HULK&apos;S WORK ZONE?
            </h3>
          </div>

          {/* Star Rating Buttons (1 to 5 Stars) */}
          <div className="flex flex-col items-center sm:items-start gap-2 pt-1">
            <div
              className="inline-flex items-center justify-center gap-1.5 sm:gap-2.5 p-2 rounded-2xl bg-neutral-900 border border-neutral-800/80 shadow-inner"
              role="radiogroup"
              aria-label="Select star rating from 1 to 5"
            >
              {[1, 2, 3, 4, 5].map((star) => {
                const activeVal = hoveredRating !== null ? hoveredRating : rating;
                const isSelectedOrLower = activeVal >= star;
                const isExactSelected = rating === star;

                return (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleRatingChange(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(null)}
                    className={`p-2 sm:p-2.5 rounded-xl transition-all min-w-[42px] min-h-[42px] flex flex-col items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
                      isExactSelected
                        ? 'bg-amber-400/20 border border-amber-400/60 scale-105 shadow-sm shadow-amber-500/20'
                        : 'hover:bg-neutral-800 border border-transparent'
                    }`}
                    aria-label={`${star} Star${star > 1 ? 's' : ''}`}
                    title={`${star} Star${star > 1 ? 's' : ''} (${STAR_LABELS[star]})`}
                  >
                    <Star
                      className={`w-6 h-6 sm:w-7 sm:h-7 transition-transform ${
                        isSelectedOrLower
                          ? 'fill-amber-400 text-amber-400 scale-105'
                          : 'text-neutral-600 hover:text-neutral-400'
                      }`}
                    />
                    <span
                      className={`text-[9px] font-bold mt-0.5 tracking-tighter ${
                        isExactSelected ? 'text-amber-300' : 'text-neutral-500'
                      }`}
                    >
                      {star}★
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2 pt-1 text-xs">
              <span className="font-bold text-amber-400">
                {rating} / 5 Stars
              </span>
              <span className="text-neutral-500">•</span>
              <span className="text-neutral-300 font-medium">
                {STAR_LABELS[rating]} Rating
              </span>
            </div>
          </div>
        </div>

        {/* QUESTION 2: OPTIONAL EXPERIENCE DETAILS */}
        <div className="space-y-3 bg-neutral-950 border border-neutral-800/90 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">
                Step 2 (Optional)
              </span>
              <h3 className="font-heading text-xs sm:text-sm font-bold text-white uppercase tracking-tight">
                WHAT DID YOU LIKE ABOUT YOUR EXPERIENCE?
              </h3>
            </div>
            {selectedAspects.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  setSelectedAspects([]);
                  regenerateWithNewInputs(rating, [], customNote, variationIndex);
                }}
                className="text-[11px] text-amber-400 hover:underline"
              >
                Clear choices
              </button>
            )}
          </div>

          <p className="text-[11px] text-neutral-400 leading-relaxed">
            Select what stood out to you. The assistant will include only aspects you pick and will never invent feedback.
          </p>

          {/* Quick Choice Chips */}
          <div className="flex flex-wrap gap-2 pt-1">
            {EXPERIENCE_ASPECTS.map((aspect) => {
              const isSelected = selectedAspects.includes(aspect);
              return (
                <button
                  key={aspect}
                  type="button"
                  onClick={() => handleToggleAspect(aspect)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                    isSelected
                      ? 'bg-amber-400 text-neutral-950 border-amber-400 font-bold shadow-sm shadow-amber-500/20 scale-102'
                      : 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:border-neutral-700 hover:text-white'
                  }`}
                >
                  <span className="mr-1">{isSelected ? '✓' : '+'}</span>
                  <span>{aspect}</span>
                </button>
              );
            })}
          </div>

          {/* Free Text Note (Optional) */}
          <div className="pt-2">
            <label
              htmlFor="custom-note-input"
              className="text-[11px] font-semibold text-neutral-400 block mb-1"
            >
              Anything else you&apos;d like to mention?
            </label>
            <input
              id="custom-note-input"
              type="text"
              value={customNote}
              onChange={handleCustomNoteChange}
              placeholder="e.g. morning slot, friendly coaches, spacious lifting floor..."
              className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400 transition-colors"
            />
          </div>
        </div>

        {/* SECTION 3: YOUR GOOGLE REVIEW PREVIEW & CONTROLS */}
        <div className="space-y-3 bg-neutral-950 border border-neutral-800/90 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-800/80">
            <div className="flex items-center gap-2">
              <h3 className="font-heading text-xs sm:text-sm font-black text-white uppercase tracking-wider">
                YOUR GOOGLE REVIEW
              </h3>
              <div className="flex text-amber-400">
                {[...Array(rating)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isManuallyEdited && (
                <span className="text-[10px] text-amber-400/90 font-medium px-2 py-0.5 rounded bg-amber-400/10">
                  Custom Edited
                </span>
              )}
              <span className="text-[11px] text-neutral-500">
                {reviewText.length} chars
              </span>
            </div>
          </div>

          {/* Editable Text Area */}
          <div className="relative">
            <textarea
              ref={textareaRef}
              id="generated-google-review-text"
              rows={4}
              value={reviewText}
              onChange={handleManualTextChange}
              onFocus={() => setIsEditingFocused(true)}
              onBlur={() => setIsEditingFocused(false)}
              className={`w-full bg-neutral-900/90 border rounded-2xl p-3.5 text-xs sm:text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none transition-all leading-relaxed resize-y ${
                isEditingFocused
                  ? 'border-amber-400 ring-1 ring-amber-400/50'
                  : 'border-neutral-800 hover:border-neutral-700'
              }`}
              placeholder="Your review draft will appear here..."
            />
          </div>

          <p className="text-[11px] text-neutral-400">
            You can freely edit, reword, or rewrite this text at any time before publishing to Google Maps.
          </p>

          {/* Notice Before Opening Google */}
          {googleNotice && (
            <div className="p-3.5 rounded-xl bg-amber-500/15 border border-amber-500/40 text-neutral-200 text-xs flex items-start gap-2.5 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <span className="font-bold text-amber-300 block mb-0.5">
                  Review copied to clipboard!
                </span>
                <span>{googleNotice}</span>
                <div className="mt-2">
                  <a
                    href={GYM_INFO.googleReviewsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-bold text-amber-400 hover:underline"
                  >
                    <span>Click here if Google didn&apos;t open automatically</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* The 4 Action Buttons as Requested in Section 6 */}
          <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {/* Button 1: Edit Review */}
            <button
              type="button"
              id="edit-review-draft-btn"
              onClick={handleFocusEdit}
              className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 text-neutral-200 text-xs font-semibold transition-all"
            >
              <Edit3 className="w-3.5 h-3.5 text-amber-400" />
              <span>Edit Review</span>
            </button>

            {/* Button 2: Generate Again */}
            <button
              type="button"
              id="generate-again-review-btn"
              onClick={handleGenerateAgain}
              className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 text-neutral-200 text-xs font-semibold transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
              <span>Generate Again</span>
            </button>

            {/* Button 3: Copy Review */}
            <button
              type="button"
              id="copy-review-draft-btn"
              onClick={handleCopyReview}
              disabled={!reviewText.trim()}
              className={`inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                copied
                  ? 'bg-emerald-500 text-neutral-950 shadow-md shadow-emerald-500/20'
                  : 'bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-white'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Review copied ✓</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-amber-400" />
                  <span>Copy Review</span>
                </>
              )}
            </button>

            {/* Button 4: Continue to Google */}
            <button
              type="button"
              id="continue-to-google-maps-btn"
              onClick={handleContinueToGoogle}
              disabled={!reviewText.trim()}
              className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold bg-amber-400 hover:bg-amber-300 text-neutral-950 shadow-lg shadow-amber-500/20 active:scale-98 transition-all"
            >
              <span>Continue to Google</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Section 9: Transparent Google Limitations Disclaimer */}
        <div className="px-1 text-[11px] text-neutral-400 leading-relaxed space-y-1">
          <p className="flex items-center gap-1.5 text-neutral-400">
            <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>
              Google requires reviews to be submitted directly on your Google account. We copy your text so you can paste it with one tap into Google Maps.
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};
