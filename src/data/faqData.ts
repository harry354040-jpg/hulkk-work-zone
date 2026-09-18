export interface FaqItem {
  question: string;
  answer: string;
  category: string;
}

export const FAQ_DATA: FaqItem[] = [
  {
    category: 'Beginners & Getting Started',
    question: 'I am a complete beginner. Will someone guide me on how to use gym equipment properly?',
    answer:
      'Yes! Starting out can feel intimidating, but at Hulk’s Work Zone in Dabra, staff and experienced members prioritize proper form and safety. On your first visits, you receive a walk-through on how to adjust benches, load barbells safely, and set up cable attachments. You can also explore our digital Exercise Library and AI Coach on this website anytime.',
  },
  {
    category: 'Membership & Enquiries',
    question: 'How do I enquire about current membership fees and discounts?',
    answer:
      'You can easily call us directly at 8770506113, tap our WhatsApp link, or submit the enquiry form on this website. We discuss your personal schedule, fitness goals, and provide the exact pricing for 1-month, 3-month, 6-month, or annual packages without any hidden charges.',
  },
  {
    category: 'Workout & Fitness Tools',
    question: 'How do the website fitness calculators and AI assistant work?',
    answer:
      'All calculators on this platform (BMI, BMR, TDEE, Macros, 1RM, Hydration, Volume) use recognized scientific formulas (like Mifflin-St Jeor and Epley). You can tap "Ask AI About This Result 🤖" after any calculation to get an immediate, conversational breakdown in Hindi, Hinglish, or English tailored to your numbers.',
  },
  {
    category: 'Location & Visiting',
    question: 'Where is Hulk’s Work Zone located in Dabra and how do I get directions?',
    answer:
      'We are conveniently located in Dabra, Madhya Pradesh. You can tap the "Get Directions" or "Open in Google Maps" buttons anywhere on this page to navigate directly using GPS.',
  },
  {
    category: 'Etiquette & Guidelines',
    question: 'What should I bring to the gym for my workout sessions?',
    answer:
      'Please bring comfortable athletic shoes with clean soles (essential for hygiene on mats), a gym towel, a refillable water bottle, and breathable workout clothing. Remember to re-rack your dumbbells and wipe equipment down after use as a courtesy to fellow lifters.',
  },
  {
    category: 'Google Reviews',
    question: 'How do I share my feedback or leave a Google Review?',
    answer:
      'We deeply value honest customer feedback! You can use the interactive Review Assistant near the top of this website to pick stars, draft your thoughts with helpful prompts, edit your text, and copy it straight to our official Google Review page with one tap.',
  },
];
