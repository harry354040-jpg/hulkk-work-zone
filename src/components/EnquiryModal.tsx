import React, { useState } from 'react';
import { GYM_INFO } from '../data/gymInfo';
import { X, Send, Phone, CheckCircle, AlertCircle, Dumbbell, MessageCircle } from 'lucide-react';
import { openWhatsAppMembershipEnquiry, getMembershipWhatsAppUrl } from '../utils/whatsappEnquiry';

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPlan?: string;
}

export const EnquiryModal: React.FC<EnquiryModalProps> = ({
  isOpen,
  onClose,
  initialPlan,
}) => {
  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [goal, setGoal] = useState<string>('Muscle Building');
  const [timing, setTiming] = useState<string>('Evening Shift (4:30 PM - 10:00 PM)');
  const [message, setMessage] = useState<string>(
    initialPlan ? `Interested in ${initialPlan} plan.` : ''
  );
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const cleanPhone = phone.trim();
    if (cleanPhone.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          phone: cleanPhone,
          goal,
          timing,
          message: message.trim(),
          plan: initialPlan || 'General Enquiry',
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit enquiry.');
      }

      setIsSuccess(true);
      // Trigger WhatsApp with the user's name, plan, and goal
      openWhatsAppMembershipEnquiry({
        name: name.trim(),
        goal,
        timing,
        planName: initialPlan || 'Gym Membership',
        notes: message.trim(),
      });
    } catch (err: any) {
      console.error('Enquiry submission error:', err);
      setErrorMsg(err.message || 'Submission failed. Please call us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-5 right-5 p-2 rounded-full bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-lime-500 flex items-center justify-center text-neutral-950 font-black">
            <Dumbbell className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading text-xl font-bold text-white">
              Join Hulk's Work Zone
            </h3>
            <span className="text-xs text-neutral-400">
              {initialPlan ? `Plan: ${initialPlan}` : 'Membership & Training Enquiry'}
            </span>
          </div>
        </div>

        {isSuccess ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h4 className="font-heading text-2xl font-bold text-white">
              Enquiry Received!
            </h4>
            <p className="text-sm text-neutral-300 max-w-sm mx-auto leading-relaxed">
              Thank you, <strong>{name}</strong>. The Hulk's Work Zone team will connect with you on <strong>{phone}</strong> shortly.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                type="button"
                onClick={() =>
                  openWhatsAppMembershipEnquiry({
                    name: name.trim(),
                    goal,
                    timing,
                    planName: initialPlan || 'Gym Membership',
                    notes: message.trim(),
                  })
                }
                className="inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold text-neutral-950 bg-emerald-400 hover:bg-emerald-300 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat on WhatsApp</span>
              </button>
              <a
                href={`tel:${GYM_INFO.phoneRaw}`}
                className="inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-neutral-900 border border-neutral-800 hover:bg-neutral-850 transition-colors"
              >
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>Call: {GYM_INFO.phone}</span>
              </a>
              <button
                onClick={onClose}
                className="py-2.5 px-4 rounded-xl text-xs font-semibold text-neutral-400 bg-neutral-800 hover:bg-neutral-750 hover:text-white transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMsg && (
              <div className="p-3 bg-rose-950/60 border border-rose-800 rounded-xl text-xs text-rose-200 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                Your Full Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Rohit Sharma"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                Phone Number (WhatsApp / Calling) *
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g., 9876543210"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Primary Goal
                </label>
                <select
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="Muscle Building">Muscle Building / Hypertrophy</option>
                  <option value="Fat Loss & Toning">Fat Loss & Conditioning</option>
                  <option value="Strength & Powerlifting">Strength & Powerlifting</option>
                  <option value="General Health">General Health & Mobility</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Preferred Shift
                </label>
                <select
                  value={timing}
                  onChange={(e) => setTiming(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="Morning Shift (5:30 AM - 10:30 AM)">Morning (5:30 AM - 10:30 AM)</option>
                  <option value="Evening Shift (4:30 PM - 10:00 PM)">Evening (4:30 PM - 10:00 PM)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                Any specific questions or injuries? (Optional)
              </label>
              <textarea
                rows={2}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us about your fitness background..."
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500 resize-none"
              />
            </div>

            <div className="pt-2 flex items-center justify-between gap-3">
              <a
                href={`tel:${GYM_INFO.phoneRaw}`}
                className="text-xs text-neutral-400 hover:text-emerald-400 flex items-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Or call directly: {GYM_INFO.phone}</span>
              </a>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 py-2.5 px-5 rounded-xl text-xs font-bold text-neutral-950 bg-emerald-400 hover:bg-emerald-300 disabled:opacity-50 transition-all shadow-md shadow-emerald-500/20"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Submitting...' : 'Send Enquiry'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
