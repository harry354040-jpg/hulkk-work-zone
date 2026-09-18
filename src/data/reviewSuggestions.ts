import { ReviewSuggestion } from '../types';

export const REVIEW_SUGGESTIONS: Record<number, ReviewSuggestion[]> = {
  5: [
    {
      id: '5-1',
      stars: 5,
      emoji: '💪',
      category: 'Environment & Energy',
      text: "Really enjoyed my experience at Hulk's Work Zone! The workout environment feels energetic and motivating, and I genuinely enjoy spending time here working towards my fitness goals. 🔥🏋️",
    },
    {
      id: '5-2',
      stars: 5,
      emoji: '🏋️',
      category: 'Consistency & Motivation',
      text: "A great place to stay consistent with your fitness routine! I’ve enjoyed the overall workout experience and the positive energy around the gym. It definitely gives me extra motivation to keep working on my goals. 💯🔥",
    },
    {
      id: '5-3',
      stars: 5,
      emoji: '❤️',
      category: 'Focus & Atmosphere',
      text: "Had a really good experience here! I like the overall atmosphere and the energy during workouts. It feels like a place where you can stay focused on your fitness journey and keep improving. 💪✨",
    },
    {
      id: '5-4',
      stars: 5,
      emoji: '🔥',
      category: 'Training Motivation',
      text: "Really enjoyed training here. The overall environment is motivating and makes workouts more enjoyable. I appreciate the experience and the motivation I get whenever I come in for a session. 🏋️‍♂️💯",
    },
    {
      id: '5-5',
      stars: 5,
      emoji: '🎯',
      category: 'Fitness Lifestyle',
      text: "Solid gym experience in Dabra. Good workout vibe, clean atmosphere, and members who are genuinely focused on self-improvement. Highly recommend checking it out! ⚡💪",
    },
  ],
  4: [
    {
      id: '4-1',
      stars: 4,
      emoji: '💪',
      category: 'Positive Experience',
      text: "Overall, I’ve had a really good experience at the gym. I’ve enjoyed the workout environment and the overall atmosphere, and I’m happy with my experience so far. 🔥",
    },
    {
      id: '4-2',
      stars: 4,
      emoji: '🏋️',
      category: 'Training Progress',
      text: "A good place to train and stay consistent with your fitness goals. I’ve enjoyed my time here and there are several things I really appreciate about the overall experience. 💯",
    },
    {
      id: '4-3',
      stars: 4,
      emoji: '⚡',
      category: 'Solid Workout Vibe',
      text: "Good gym with a positive training community. Workouts feel productive and the overall vibe keeps you on track with your fitness plan. 👍",
    },
  ],
  3: [
    {
      id: '3-1',
      stars: 3,
      emoji: '🙂',
      category: 'Decent Workout',
      text: "Overall, my experience has been decent. I’ve had some good workout sessions and there are things I appreciate about the gym, while I also feel there are a few areas that could be improved. 💪",
    },
    {
      id: '3-2',
      stars: 3,
      emoji: '⏱️',
      category: 'Peak Hours Note',
      text: "Good gym overall for daily workouts. During peak evening hours it gets quite busy, so timing your sessions makes a big difference. Fair experience. 👍",
    },
  ],
  2: [
    {
      id: '2-1',
      stars: 2,
      emoji: '⚠️',
      category: 'Room for Improvement',
      text: "The gym has potential and the basic workout setup is there, but peak hour crowding and equipment wait times could definitely be improved for a smoother workout. 🤝",
    },
  ],
  1: [
    {
      id: '1-1',
      stars: 1,
      emoji: '📝',
      category: 'Constructive Feedback',
      text: "Sharing my honest experience: I felt several operational and facility aspects need attention and better management to support members effectively during peak training hours.",
    },
  ],
};
