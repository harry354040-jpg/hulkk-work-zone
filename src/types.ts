export interface GymInfo {
  name: string;
  phone: string;
  phoneRaw: string;
  instagramUrl: string;
  googleMapsUrl: string;
  googleReviewsUrl: string;
  city: string;
  state: string;
  country: string;
  address: string;
  hours: {
    morning: string;
    evening: string;
    sunday: string;
  };
  latitude: number;
  longitude: number;
  tagline: string;
  shortBio: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  isError?: boolean;
}

export type UnitSystem = 'metric' | 'imperial';

export interface BmiResult {
  bmi: number;
  category: string;
  colorClass: string;
  healthyRange: string;
  explanation: string;
}

export interface BmrResult {
  bmr: number;
  formula: string;
  explanation: string;
}

export interface TdeeResult {
  bmr: number;
  tdee: number;
  activityFactor: number;
  activityLabel: string;
  explanation: string;
}

export interface CalorieGoalResult {
  tdee: number;
  targetCalories: number;
  goalType: 'maintain' | 'loss' | 'gain';
  dailyDeficitOrSurplus: number;
  weeklyTarget: string;
  explanation: string;
}

export interface ProteinResult {
  dailyGramsMin: number;
  dailyGramsMax: number;
  gramsPerKg: string;
  gramsPerLb: string;
  explanation: string;
}

export interface MacroResult {
  totalCalories: number;
  proteinGrams: number;
  proteinCalories: number;
  proteinPct: number;
  carbGrams: number;
  carbCalories: number;
  carbPct: number;
  fatGrams: number;
  fatCalories: number;
  fatPct: number;
  distributionName: string;
}

export interface HydrationResult {
  litersPerDay: number;
  glassesPerDay: number;
  workoutSupplementMl: number;
  explanation: string;
}

export interface BodyFatResult {
  bodyFatPercent: number;
  category: string;
  fatMassKg: number;
  leanMassKg: number;
  explanation: string;
}

export interface OneRepMaxResult {
  oneRepMax: number;
  percentages: {
    percentage: number;
    weight: number;
    repsEstimate: string;
  }[];
  explanation: string;
}

export interface ExerciseItem {
  id: string;
  name: string;
  hindiName?: string;
  category: 'Chest' | 'Back' | 'Shoulders' | 'Biceps' | 'Triceps' | 'Legs' | 'Glutes' | 'Core' | 'Full Body';
  equipment: 'Barbell' | 'Dumbbell' | 'Cable / Machine' | 'Bodyweight';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  targetMuscles: string[];
  instructions: string[];
  beginnerNotes: string;
  commonMistakes: string[];
  safetyNotes: string;
}

export interface WorkoutExerciseItem {
  exerciseId: string;
  name: string;
  category: string;
  sets: number;
  reps: number;
  weightKg: number;
  restSeconds: number;
}

export interface WorkoutPlan {
  id: string;
  title: string;
  exercises: WorkoutExerciseItem[];
  totalVolume: number;
  updatedAt: number;
}

export interface ProgressEntry {
  id: string;
  date: string;
  weightKg?: number;
  bodyFatPct?: number;
  benchPressMaxKg?: number;
  squatMaxKg?: number;
  deadliftMaxKg?: number;
  benchPrKg?: number;
  squatPrKg?: number;
  deadliftPrKg?: number;
  notes?: string;
}

export interface MembershipPlan {
  id: string;
  name: string;
  duration: string;
  badge?: string;
  price?: string;
  description: string;
  features: string[];
  popular?: boolean;
  isPopular?: boolean;
}

export interface ReviewSuggestion {
  id: string;
  stars: number;
  emoji: string;
  text: string;
  category: string;
}

export interface EnquiryData {
  name: string;
  phone: string;
  goal: string;
  planInterest: string;
  message: string;
}
