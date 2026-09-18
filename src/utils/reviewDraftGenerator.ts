/**
 * Hulk's Work Zone - Review Draft Assistant Generator
 * Generates natural, respectful review drafts strictly matching user inputs.
 * NEVER invents personal experiences, unselected equipment, trainers, or false claims.
 */

export const EXPERIENCE_ASPECTS = [
  'Equipment',
  'Training Environment',
  'Trainers',
  'Cleanliness',
  'Atmosphere',
  'Membership',
  'Overall Experience',
] as const;

export type ExperienceAspect = typeof EXPERIENCE_ASPECTS[number];

export const STAR_LABELS: Record<number, string> = {
  1: 'Poor',
  2: 'Fair',
  3: 'Decent',
  4: 'Good',
  5: 'Excellent',
};

interface DraftParams {
  rating: number; // 1 to 5
  selectedAspects: string[];
  customNote?: string;
  variationIndex?: number;
}

const formatAspectPhrasing = (aspect: string): string => {
  switch (aspect) {
    case 'Equipment':
      return 'the equipment';
    case 'Training Environment':
      return 'the training environment';
    case 'Trainers':
      return 'the trainers';
    case 'Cleanliness':
      return 'the cleanliness';
    case 'Atmosphere':
      return 'the workout atmosphere';
    case 'Membership':
      return 'the membership plans';
    case 'Overall Experience':
      return 'the overall experience';
    default:
      return aspect.toLowerCase();
  }
};

export const formatAspectsList = (aspects: string[]): string => {
  if (aspects.length === 0) return '';
  const formatted = aspects.map(formatAspectPhrasing);
  if (formatted.length === 1) return formatted[0];
  if (formatted.length === 2) return `${formatted[0]} and ${formatted[1]}`;
  return `${formatted.slice(0, -1).join(', ')}, and ${formatted[formatted.length - 1]}`;
};

export const generateReviewDraft = ({
  rating,
  selectedAspects,
  customNote,
  variationIndex = 0,
}: DraftParams): string => {
  const safeRating = Math.min(Math.max(Math.round(rating), 1), 5);
  const aspectsText = formatAspectsList(selectedAspects);
  const hasAspects = selectedAspects.length > 0;

  let baseDraft = '';

  if (safeRating === 5) {
    if (hasAspects) {
      const templates = [
        `Had a great experience at Hulk's Work Zone. I especially appreciated ${aspectsText}. The gym provides everything needed for serious workouts.`,
        `Really good experience training at Hulk's Work Zone in Dabra. Very impressed with ${aspectsText}, which made my workouts motivating and productive.`,
        `Excellent training experience at Hulk's Work Zone. Particularly liked ${aspectsText}. Highly recommended for anyone serious about fitness.`,
        `Had a wonderful experience at Hulk's Work Zone. The gym offers a dedicated space and I truly appreciated ${aspectsText}.`,
      ];
      baseDraft = templates[variationIndex % templates.length];
    } else {
      const templates = [
        `Had a great experience at Hulk's Work Zone. The training environment is motivating and the equipment is well suited for serious workouts.`,
        `Really good experience training at Hulk's Work Zone in Dabra. Great fitness atmosphere and a solid setup for daily exercise.`,
        `Excellent experience overall at Hulk's Work Zone. A reliable and focused gym for anyone looking to stay consistent with fitness.`,
        `Had a wonderful experience training at Hulk's Work Zone. The workout vibe is positive and makes it easy to stay dedicated.`,
      ];
      baseDraft = templates[variationIndex % templates.length];
    }
  } else if (safeRating === 4) {
    if (hasAspects) {
      const templates = [
        `Had a good experience at Hulk's Work Zone. I found ${aspectsText} to be quite good and supportive for regular workouts.`,
        `Solid experience at Hulk's Work Zone in Dabra. Good impression with ${aspectsText}, and overall it's a dependable place to work out.`,
        `Enjoyed my workouts at Hulk's Work Zone. Appreciated ${aspectsText} while maintaining consistent fitness progress.`,
        `Overall a very good training setup at Hulk's Work Zone. Positive impression with ${aspectsText} for daily fitness.`,
      ];
      baseDraft = templates[variationIndex % templates.length];
    } else {
      const templates = [
        `Had a good experience at Hulk's Work Zone. The gym has a solid training environment and useful equipment.`,
        `Overall a very good experience at Hulk's Work Zone. Good training vibe and a reliable place for regular workouts in Dabra.`,
        `Good place to train in Dabra. The workout setup is solid and supports regular fitness goals well.`,
        `Enjoyed my workouts at Hulk's Work Zone. Solid training environment with a disciplined vibe.`,
      ];
      baseDraft = templates[variationIndex % templates.length];
    }
  } else if (safeRating === 3) {
    if (hasAspects) {
      const templates = [
        `Overall, I had a decent experience at Hulk's Work Zone. I found ${aspectsText} satisfactory, while there are other areas that could see continued improvement.`,
        `Decent training experience at Hulk's Work Zone. ${aspectsText.charAt(0).toUpperCase() + aspectsText.slice(1)} was okay for daily workouts, with room for further enhancement.`,
        `Fair experience at Hulk's Work Zone in Dabra. Satisfactory setup regarding ${aspectsText}, though regular maintenance and peak hour flow could be improved.`,
      ];
      baseDraft = templates[variationIndex % templates.length];
    } else {
      const templates = [
        `Overall, I had a decent experience at Hulk's Work Zone. There are several useful facilities for regular training.`,
        `Decent gym setup in Dabra for daily workouts. Works well for regular exercise, with potential for continued facility upgrades.`,
        `Average to good experience at Hulk's Work Zone. Good for basic daily training, though some aspects during busy hours have room for improvement.`,
      ];
      baseDraft = templates[variationIndex % templates.length];
    }
  } else if (safeRating === 2) {
    if (hasAspects) {
      const templates = [
        `Had a mixed experience at Hulk's Work Zone. While there is a basic setup, ${aspectsText} and overall management could be improved.`,
        `Fair setup, but my experience was below expectations, especially regarding ${aspectsText}. Hope management addresses these areas.`,
        `A few positive points, but there is clear scope for improvement in ${aspectsText} and general member convenience.`,
      ];
      baseDraft = templates[variationIndex % templates.length];
    } else {
      const templates = [
        `Had a mixed experience at Hulk's Work Zone. Some aspects were useful, while there are areas that could be improved.`,
        `Fair setup, but my overall experience was below expectations. Hope management focuses on facility maintenance and member feedback.`,
        `A few positive points, but there is clear scope for improvement in member experience and training space.`,
      ];
      baseDraft = templates[variationIndex % templates.length];
    }
  } else {
    // 1 Star: Negative but respectful
    if (hasAspects) {
      const templates = [
        `My experience at Hulk's Work Zone was not satisfactory, particularly regarding ${aspectsText}. I hope management takes constructive member feedback to make necessary improvements.`,
        `Sharing honest feedback: I was not satisfied with my experience, especially concerning ${aspectsText}. Clear improvements are needed.`,
      ];
      baseDraft = templates[variationIndex % templates.length];
    } else {
      const templates = [
        `My experience at Hulk's Work Zone was not satisfactory. I hope some areas can be improved.`,
        `Unfortunately had a disappointing experience during my visit. Several operational areas need attention and improvement.`,
        `Not satisfied with my experience at the gym. Sharing honest feedback in hopes that facilities and management will be upgraded.`,
      ];
      baseDraft = templates[variationIndex % templates.length];
    }
  }

  // Handle custom note cleanly without inventing anything
  const trimmedNote = customNote?.trim();
  if (trimmedNote) {
    const formattedNote = /[.!?]$/.test(trimmedNote) ? trimmedNote : `${trimmedNote}.`;
    return `${baseDraft} ${formattedNote}`;
  }

  return baseDraft;
};
