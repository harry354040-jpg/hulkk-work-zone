import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FAQ_DATA } from '../data/faqData';
import {
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Search,
  ChevronRight,
  MessageSquare,
  Sparkles,
  Phone,
  ArrowRight,
} from 'lucide-react';
import { GYM_INFO } from '../data/gymInfo';

interface FaqPageProps {
  onOpenEnquiry?: () => void;
}

export const FaqPage: React.FC<FaqPageProps> = ({ onOpenEnquiry }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [openIndices, setOpenIndices] = useState<number[]>([0]); // first item open by default

  const categories = ['All', ...Array.from(new Set(FAQ_DATA.map((item) => item.category)))];

  const filteredFaqs = useMemo(() => {
    return FAQ_DATA.filter((faq) => {
      const matchesSearch =
        !searchQuery.trim() ||
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCat =
        selectedCategory === 'All' || faq.category === selectedCategory;

      return matchesSearch && matchesCat;
    });
  }, [searchQuery, selectedCategory]);

  const toggleIndex = (index: number) => {
    setOpenIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <div className="min-h-screen bg-neutral-950 pt-24 pb-28 sm:pb-16 text-neutral-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-neutral-400 mb-6" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-neutral-600" />
          <span className="text-emerald-400 font-medium">Frequently Asked Questions</span>
        </nav>

        {/* Page Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Questions & Answers</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white uppercase mb-3">
            Frequently Asked <span className="text-emerald-400">Questions</span>
          </h1>
          <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
            Everything you need to know about joining Hulk's Work Zone in Dabra, training guidelines, membership plans, and our digital fitness tools.
          </p>
        </div>

        {/* Search & Category Filter */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-5 sm:p-6 mb-8 space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search questions (e.g. beginner guidance, timings, fees, protein)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 focus:border-emerald-500 rounded-2xl pl-11 pr-4 py-3 text-sm text-white placeholder:text-neutral-500 focus:outline-none transition-colors"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-emerald-400 text-neutral-950'
                    : 'bg-neutral-950 border border-neutral-800 text-neutral-400 hover:text-neutral-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3 mb-12">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, idx) => {
              const isOpen = openIndices.includes(idx);
              return (
                <div
                  key={idx}
                  className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden transition-all shadow-md"
                >
                  <button
                    type="button"
                    onClick={() => toggleIndex(idx)}
                    className="w-full p-5 sm:p-6 text-left flex items-start justify-between gap-4 hover:bg-neutral-850/50 transition-colors"
                  >
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">
                        {faq.category}
                      </span>
                      <h3 className="font-heading text-base font-bold text-white leading-snug">
                        {faq.question}
                      </h3>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-neutral-950 flex items-center justify-center text-neutral-400 shrink-0 mt-1 border border-neutral-800">
                      {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-6 sm:px-6 sm:pb-6 text-xs sm:text-sm text-neutral-300 border-t border-neutral-800/80 pt-4 leading-relaxed">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-10 text-center space-y-3">
              <HelpCircle className="w-8 h-8 text-neutral-600 mx-auto" />
              <h3 className="font-bold text-white text-base">No Matching Questions Found</h3>
              <p className="text-xs text-neutral-400">
                Try searching for different keywords or ask our AI Coach directly.
              </p>
            </div>
          )}
        </div>

        {/* Still Have Questions? Banner */}
        <div className="bg-neutral-900/60 border border-neutral-800 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-lg font-bold text-white mb-1">
              Have a Question That Isn't Listed Here?
            </h3>
            <p className="text-xs sm:text-sm text-neutral-400 max-w-lg leading-relaxed">
              Ask our AI Fitness Coach for an instant response, or speak directly with our gym management team in Dabra.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Link
              to="/ai-coach"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-neutral-950 font-bold text-xs transition-all shadow-md active:scale-98 whitespace-nowrap"
            >
              <Sparkles className="w-4 h-4" />
              <span>Ask AI Coach</span>
            </Link>

            <a
              href={`tel:${GYM_INFO.phoneRaw}`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-white font-bold text-xs transition-colors whitespace-nowrap"
            >
              <Phone className="w-4 h-4 text-emerald-400" />
              <span>Call {GYM_INFO.phone}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
