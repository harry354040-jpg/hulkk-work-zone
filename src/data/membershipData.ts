import { MembershipPlan } from '../types';

/**
 * Membership Plans for Hulk's Work Zone
 * Note: Prices are transparently provided upon enquiry or customized consultation
 * to reflect current promotional rates and personalized trainer requirements.
 */
export const MEMBERSHIP_PLANS: MembershipPlan[] = [
  {
    id: 'monthly-pass',
    name: '1 Month Kickstart',
    duration: '1 Month Access',
    price: '₹1,200',
    description: 'Perfect for beginners testing consistency or visitors in Dabra needing short-term training.',
    features: [
      'Full access to strength & free-weights zone',
      'Cardio & conditioning equipment access',
      'Initial form & safety equipment walk-through',
      'Free locker room & hydration station access',
      'Access to digital workout calculators & AI coach',
    ],
    popular: false,
    isPopular: false,
  },
  {
    id: 'quarterly-pass',
    name: '3 Months Transformation',
    duration: '3 Months Access',
    badge: 'Popular Choice',
    price: '₹3,200',
    description: 'The golden standard timeframe to build lasting workout habits, noticeable hypertrophy, and strength.',
    features: [
      'Complete gym & weight-training floor access',
      'Personalized routine planning assistance',
      'Periodic progress assessment & benchmark check',
      'Priority assistance on lifting techniques',
      'Full access to all digital tools and rest timer',
    ],
    popular: true,
    isPopular: true,
  },
  {
    id: 'half-yearly-pass',
    name: '6 Months Dedication',
    duration: '6 Months Access',
    badge: 'Best Value',
    price: '₹5,800',
    description: 'For committed lifters seeking substantial body recomposition and progressive overload milestones.',
    features: [
      'All 3-Month benefits with extended consistency',
      'Comprehensive workout volume tracking',
      'Form breakdown on compound lifts (Squat, Bench, Deadlift)',
      'Nutrition & macro distribution guidelines',
      'Special member renewal privileges',
    ],
    popular: false,
    isPopular: false,
  },
  {
    id: 'yearly-pass',
    name: '12 Months Annual Elite',
    duration: '1 Full Year Access',
    badge: 'Ultimate Commitment',
    price: '₹10,500',
    description: 'The ultimate year-round fitness lifestyle package for peak athletic condition and strength longevity.',
    features: [
      '365 days of unrestricted gym access',
      'VIP onboarding & annual goal mapping',
      'Full year access to advanced tracking tools',
      'Guest passes for friends / training partners (subject to terms)',
      'Guaranteed membership price lock for renewals',
    ],
    popular: false,
    isPopular: false,
  },
];
