import {
  BmiResult,
  BmrResult,
  TdeeResult,
  CalorieGoalResult,
  ProteinResult,
  MacroResult,
  HydrationResult,
  BodyFatResult,
  OneRepMaxResult,
  WorkoutExerciseItem,
} from '../types';

/**
 * 1. BMI CALCULATOR
 * Formula: weight (kg) / [height (m)]^2
 */
export function calculateBMI(weightKg: number, heightCm: number): BmiResult {
  if (weightKg <= 0 || heightCm <= 0) {
    throw new Error('Please enter valid positive numbers for weight and height.');
  }

  const heightM = heightCm / 100;
  const bmi = parseFloat((weightKg / (heightM * heightM)).toFixed(1));

  let category = 'Normal weight';
  let colorClass = 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';

  if (bmi < 18.5) {
    category = 'Underweight';
    colorClass = 'text-amber-400 border-amber-500/30 bg-amber-500/10';
  } else if (bmi >= 18.5 && bmi < 25) {
    category = 'Normal / Healthy weight';
    colorClass = 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
  } else if (bmi >= 25 && bmi < 30) {
    category = 'Overweight';
    colorClass = 'text-amber-400 border-amber-500/30 bg-amber-500/10';
  } else {
    category = 'Obesity range';
    colorClass = 'text-rose-400 border-rose-500/30 bg-rose-500/10';
  }

  const minHealthyKg = (18.5 * heightM * heightM).toFixed(1);
  const maxHealthyKg = (24.9 * heightM * heightM).toFixed(1);

  return {
    bmi,
    category,
    colorClass,
    healthyRange: `${minHealthyKg} kg – ${maxHealthyKg} kg`,
    explanation:
      'BMI is a broad screening tool and does not differentiate between muscle mass and fat tissue. Athletic individuals with high muscle mass may show higher BMI numbers without having excess body fat.',
  };
}

/**
 * 2. BMR CALCULATOR (Mifflin-St Jeor Equation)
 * Men: 10 * weight(kg) + 6.25 * height(cm) - 5 * age(y) + 5
 * Women: 10 * weight(kg) + 6.25 * height(cm) - 5 * age(y) - 161
 */
export function calculateBMR(
  weightKg: number,
  heightCm: number,
  age: number,
  gender: 'male' | 'female'
): BmrResult {
  if (weightKg <= 0 || heightCm <= 0 || age <= 0) {
    throw new Error('Please enter valid positive values for weight, height, and age.');
  }

  let bmrBase = 10 * weightKg + 6.25 * heightCm - 5 * age;
  const bmr = Math.round(gender === 'male' ? bmrBase + 5 : bmrBase - 161);

  return {
    bmr,
    formula: 'Mifflin-St Jeor Equation',
    explanation:
      'Basal Metabolic Rate (BMR) represents the baseline calories your body expends at complete rest just to keep organs functioning (breathing, cellular repair, heartbeat).',
  };
}

/**
 * 3. TDEE CALCULATOR (Total Daily Energy Expenditure)
 * Multipliers:
 * Sedentary: 1.2
 * Light: 1.375
 * Moderate: 1.55
 * Very Active: 1.725
 * Extra Active: 1.9
 */
export const ACTIVITY_MULTIPLIERS = {
  sedentary: { factor: 1.2, label: 'Sedentary (Desk job, minimal exercise)' },
  light: { factor: 1.375, label: 'Lightly Active (1–3 gym sessions / week)' },
  moderate: { factor: 1.55, label: 'Moderately Active (3–5 hard workouts / week)' },
  heavy: { factor: 1.725, label: 'Very Active (6–7 heavy training sessions / week)' },
  athlete: { factor: 1.9, label: 'Extra Active (Intense training twice daily / manual labor)' },
};

export function calculateTDEE(
  bmr: number,
  activityLevel: keyof typeof ACTIVITY_MULTIPLIERS
): TdeeResult {
  if (bmr <= 0) {
    throw new Error('BMR must be greater than zero.');
  }

  const { factor, label } = ACTIVITY_MULTIPLIERS[activityLevel] || ACTIVITY_MULTIPLIERS.moderate;
  const tdee = Math.round(bmr * factor);

  return {
    bmr,
    tdee,
    activityFactor: factor,
    activityLabel: label,
    explanation:
      'TDEE combines your BMR with your non-exercise activity thermogenesis (NEAT), exercise activity, and the thermic effect of food.',
  };
}

/**
 * 4. CALORIE GOAL ESTIMATOR
 */
export function calculateCalorieGoal(
  tdee: number,
  goal: 'maintain' | 'loss' | 'gain'
): CalorieGoalResult {
  if (tdee <= 0) {
    throw new Error('TDEE must be a positive number.');
  }

  let targetCalories = tdee;
  let dailyDeficitOrSurplus = 0;
  let weeklyTarget = 'Weight maintenance';
  let explanation = 'Maintains your current body weight with balanced energy intake.';

  if (goal === 'loss') {
    dailyDeficitOrSurplus = -400; // Moderate, sustainable deficit
    targetCalories = Math.max(1200, Math.round(tdee - 400));
    weeklyTarget = 'Approx. 0.35 kg to 0.5 kg loss per week';
    explanation =
      'A moderate ~400 kcal deficit preserves lean muscle mass while facilitating gradual, healthy fat loss without metabolic crashes.';
  } else if (goal === 'gain') {
    dailyDeficitOrSurplus = 350; // Lean muscle surplus
    targetCalories = Math.round(tdee + 350);
    weeklyTarget = 'Approx. 0.25 kg to 0.4 kg lean gain per week';
    explanation =
      'A controlled ~350 kcal surplus provides sufficient energy to optimize muscle protein synthesis with minimal unwanted body fat accrual.';
  }

  return {
    tdee,
    targetCalories,
    goalType: goal,
    dailyDeficitOrSurplus,
    weeklyTarget,
    explanation,
  };
}

/**
 * 5. PROTEIN CALCULATOR
 * General active: 1.4 - 1.6 g/kg
 * Muscle gain / Strength: 1.6 - 2.2 g/kg
 * Fat loss preservation: 1.8 - 2.4 g/kg
 */
export function calculateProtein(
  weightKg: number,
  goal: 'general' | 'muscle_gain' | 'fat_loss'
): ProteinResult {
  if (weightKg <= 0) {
    throw new Error('Weight must be a positive number.');
  }

  let minRate = 1.6;
  let maxRate = 2.0;
  let explanation = 'Adequate protein for active individuals training consistently.';

  if (goal === 'general') {
    minRate = 1.2;
    maxRate = 1.6;
    explanation = 'Baseline protein requirement to maintain muscle tissue and support general recovery.';
  } else if (goal === 'muscle_gain') {
    minRate = 1.8;
    maxRate = 2.2;
    explanation = 'Optimal range to maximize muscle protein synthesis and support progressive overload.';
  } else if (goal === 'fat_loss') {
    minRate = 2.0;
    maxRate = 2.4;
    explanation = 'Higher protein preserves existing muscle mass in a caloric deficit and enhances satiety.';
  }

  const minGrams = Math.round(weightKg * minRate);
  const maxGrams = Math.round(weightKg * maxRate);
  const weightLb = weightKg * 2.20462;
  const minLb = (minGrams / weightLb).toFixed(2);
  const maxLb = (maxGrams / weightLb).toFixed(2);

  return {
    dailyGramsMin: minGrams,
    dailyGramsMax: maxGrams,
    gramsPerKg: `${minRate} – ${maxRate} g/kg`,
    gramsPerLb: `${minLb} – ${maxLb} g/lb`,
    explanation,
  };
}

/**
 * 6. MACRO CALCULATOR
 * Protein = 4 kcal/g, Carbs = 4 kcal/g, Fat = 9 kcal/g
 */
export function calculateMacros(
  totalCalories: number,
  approach: 'balanced' | 'high_protein' | 'strength_fuel'
): MacroResult {
  if (totalCalories <= 0) {
    throw new Error('Total calories must be greater than zero.');
  }

  let proteinPct = 30;
  let carbPct = 40;
  let fatPct = 30;
  let distributionName = 'Balanced Athletic Split';

  if (approach === 'high_protein') {
    proteinPct = 35;
    carbPct = 35;
    fatPct = 30;
    distributionName = 'High Protein / Lean Definition Split';
  } else if (approach === 'strength_fuel') {
    proteinPct = 25;
    carbPct = 50;
    fatPct = 25;
    distributionName = 'Performance & Glycogen Fuel Split';
  }

  const proteinCalories = Math.round(totalCalories * (proteinPct / 100));
  const carbCalories = Math.round(totalCalories * (carbPct / 100));
  const fatCalories = Math.round(totalCalories * (fatPct / 100));

  const proteinGrams = Math.round(proteinCalories / 4);
  const carbGrams = Math.round(carbCalories / 4);
  const fatGrams = Math.round(fatCalories / 9);

  return {
    totalCalories,
    proteinGrams,
    proteinCalories,
    proteinPct,
    carbGrams,
    carbCalories,
    carbPct,
    fatGrams,
    fatCalories,
    fatPct,
    distributionName,
  };
}

/**
 * 7. HYDRATION ESTIMATOR
 * Base: ~35 ml per kg + ~500-750 ml per hour of intense gym sweat
 */
export function calculateHydration(
  weightKg: number,
  workoutDurationMinutes: number = 60
): HydrationResult {
  if (weightKg <= 0) {
    throw new Error('Weight must be a positive number.');
  }

  const baseMl = weightKg * 35;
  const workoutSupplementMl = Math.round((workoutDurationMinutes / 60) * 600);
  const totalMl = baseMl + workoutSupplementMl;
  const liters = parseFloat((totalMl / 1000).toFixed(1));
  const glasses = Math.round(totalMl / 250);

  return {
    litersPerDay: liters,
    glassesPerDay: glasses,
    workoutSupplementMl,
    explanation:
      'Hydration needs fluctuate based on humidity, heat, workout intensity, and sodium intake. Sip water consistently throughout your training session.',
  };
}

/**
 * 8. BODY FAT ESTIMATOR (US Navy Method)
 * Men: 495 / (1.0324 - 0.19077*log10(waist - neck) + 0.15456*log10(height)) - 450
 * Women: 495 / (1.29579 - 0.35004*log10(waist + hip - neck) + 0.22100*log10(height)) - 450
 */
export function calculateBodyFat(
  gender: 'male' | 'female',
  heightCm: number,
  waistCm: number,
  neckCm: number,
  hipCm: number = 0,
  weightKg: number
): BodyFatResult {
  if (heightCm <= 0 || waistCm <= 0 || neckCm <= 0 || weightKg <= 0) {
    throw new Error('Please provide valid positive measurements.');
  }

  let bodyFatPct = 15;

  if (gender === 'male') {
    if (waistCm <= neckCm) {
      throw new Error('Waist measurement must be greater than neck measurement.');
    }
    const logWaistNeck = Math.log10(waistCm - neckCm);
    const logHeight = Math.log10(heightCm);
    const density = 1.0324 - 0.19077 * logWaistNeck + 0.15456 * logHeight;
    bodyFatPct = parseFloat((495 / density - 450).toFixed(1));
  } else {
    if (hipCm <= 0) {
      throw new Error('Hip measurement is required for women.');
    }
    const logWaistHipNeck = Math.log10(waistCm + hipCm - neckCm);
    const logHeight = Math.log10(heightCm);
    const density = 1.29579 - 0.35004 * logWaistHipNeck + 0.221 * logHeight;
    bodyFatPct = parseFloat((495 / density - 450).toFixed(1));
  }

  // Bounds clamping
  bodyFatPct = Math.max(3, Math.min(60, bodyFatPct));

  let category = 'Athletic';
  if (gender === 'male') {
    if (bodyFatPct < 6) category = 'Essential fat';
    else if (bodyFatPct <= 13) category = 'Athletic / Lean';
    else if (bodyFatPct <= 17) category = 'Fitness standard';
    else if (bodyFatPct <= 24) category = 'Average';
    else category = 'Above average';
  } else {
    if (bodyFatPct < 14) category = 'Essential fat';
    else if (bodyFatPct <= 20) category = 'Athletic / Lean';
    else if (bodyFatPct <= 24) category = 'Fitness standard';
    else if (bodyFatPct <= 31) category = 'Average';
    else category = 'Above average';
  }

  const fatMassKg = parseFloat(((weightKg * bodyFatPct) / 100).toFixed(1));
  const leanMassKg = parseFloat((weightKg - fatMassKg).toFixed(1));

  return {
    bodyFatPercent: bodyFatPct,
    category,
    fatMassKg,
    leanMassKg,
    explanation:
      'The US Navy circumference formula is an estimation. For clinical precision, DEXA scans or hydrostatic weighing are the gold standards.',
  };
}

/**
 * 9. HEALTHY WEIGHT RANGE ESTIMATOR
 * Based on BMI healthy cutoffs (18.5 – 24.9)
 */
export function calculateHealthyWeightRange(heightCm: number): {
  minKg: number;
  maxKg: number;
  minLb: number;
  maxLb: number;
  explanation: string;
} {
  if (heightCm <= 0) {
    throw new Error('Height must be positive.');
  }
  const heightM = heightCm / 100;
  const minKg = parseFloat((18.5 * heightM * heightM).toFixed(1));
  const maxKg = parseFloat((24.9 * heightM * heightM).toFixed(1));

  return {
    minKg,
    maxKg,
    minLb: parseFloat((minKg * 2.20462).toFixed(1)),
    maxLb: parseFloat((maxKg * 2.20462).toFixed(1)),
    explanation:
      'This estimated range represents standard healthy population weight bands. Bodybuilders and strength athletes often exceed this range due to dense muscle mass rather than excess fat.',
  };
}

/**
 * 10. ONE REP MAX (1RM) CALCULATOR
 * Epley Formula: 1RM = Weight * (1 + Reps / 30)
 */
export function calculateOneRepMax(weight: number, reps: number): OneRepMaxResult {
  if (weight <= 0 || reps <= 0) {
    throw new Error('Weight and reps must be positive numbers.');
  }

  if (reps > 30) {
    throw new Error('1RM estimates are most accurate for 1 to 12 repetitions.');
  }

  const oneRepMax = Math.round(weight * (1 + reps / 30));

  const percentages = [
    { percentage: 95, weight: Math.round(oneRepMax * 0.95), repsEstimate: '1–2 reps' },
    { percentage: 90, weight: Math.round(oneRepMax * 0.9), repsEstimate: '2–3 reps' },
    { percentage: 85, weight: Math.round(oneRepMax * 0.85), repsEstimate: '4–6 reps' },
    { percentage: 80, weight: Math.round(oneRepMax * 0.8), repsEstimate: '6–8 reps' },
    { percentage: 75, weight: Math.round(oneRepMax * 0.75), repsEstimate: '8–10 reps' },
    { percentage: 70, weight: Math.round(oneRepMax * 0.7), repsEstimate: '10–12 reps' },
    { percentage: 60, weight: Math.round(oneRepMax * 0.6), repsEstimate: '12–15 reps' },
    { percentage: 50, weight: Math.round(oneRepMax * 0.5), repsEstimate: 'Warm-up / Speed' },
  ];

  return {
    oneRepMax,
    percentages,
    explanation:
      '1RM is calculated using the validated Epley formula. Always use a spotter or safety pins when attempting heavy singles in the gym.',
  };
}

/**
 * 11. WORKOUT VOLUME CALCULATOR
 * Formula: Sets * Reps * Weight for each movement
 */
export function calculateWorkoutVolume(exercises: WorkoutExerciseItem[]): {
  totalVolumeKg: number;
  exerciseBreakdown: { name: string; volumeKg: number }[];
} {
  let totalVolumeKg = 0;
  const exerciseBreakdown = exercises.map((item) => {
    const volume = (item.sets || 0) * (item.reps || 0) * (item.weightKg || 0);
    totalVolumeKg += volume;
    return {
      name: item.name,
      volumeKg: volume,
    };
  });

  return {
    totalVolumeKg,
    exerciseBreakdown,
  };
}
