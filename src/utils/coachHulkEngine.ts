// Client-side intelligent Coach Hulk engine for fallback when backend API is unavailable or on static hosting

export function generateClientCoachResponse(userPrompt: string): string {
  const p = userPrompt.trim().toLowerCase();

  // Greetings
  if (
    p === 'hi' ||
    p === 'hii' ||
    p === 'hiii' ||
    p === 'hello' ||
    p === 'hey' ||
    p === 'heyy' ||
    p === 'namaste' ||
    p === 'pranam' ||
    p === 'ram ram' ||
    p.includes('kaise ho') ||
    p.includes('kese ho') ||
    p.includes('good morning') ||
    p.includes('good evening') ||
    p.includes('good afternoon')
  ) {
    return `Namaste Sir! Welcome to Hulk's Work Zone.

Main Coach Hulk hoon—aapka personal training and fitness assistant.

Aap mujhse workout routines, muscle exercises, diet & calorie calculations, ya gym memberships ke baare me pooch sakte hain:
- 🏋️‍♂️ **Workout Plans** (Chest, Back, Arms, Legs, PPL Split)
- 🥗 **Diet & Protein** (Fat loss, Muscle gain, Vegetarian diet)
- 🧮 **Fitness Tools** (BMI, BMR, Daily Calorie & Macro calculator)
- 📍 **Dabra Gym Info** (Timings, Plans & Trainers: 8770506113)

Bataiye Sir, aaj aap kis goal par focus karna chahte hain?`;
  }

  // Gym info, timings, fees, membership in Dabra
  if (
    p.includes('gym') ||
    p.includes('timing') ||
    p.includes('time') ||
    p.includes('fees') ||
    p.includes('price') ||
    p.includes('join') ||
    p.includes('membership') ||
    p.includes('dabra') ||
    p.includes('location') ||
    p.includes('address') ||
    p.includes('contact') ||
    p.includes('phone')
  ) {
    return `Sir, **Hulk's Work Zone** gym Dabra (Madhya Pradesh) ki details ye hain:

⏰ **Timings:**
- **Morning:** 5:30 AM – 10:30 AM
- **Evening:** 4:30 PM – 10:00 PM (Monday to Saturday)

💳 **Membership Plans:**
- **1 Month:** ₹1,200
- **3 Months:** ₹3,200 (Save ₹400)
- **6 Months:** ₹5,800 (Save ₹1,400)
- **Annual (1 Year):** ₹10,500 (Best Value)

📞 **Contact / WhatsApp:** **8770506113**
📍 **Address:** Dabra, Madhya Pradesh, India.

Aap website par **Membership** page par jakar direct online enquiry submit kar sakte hain ya gym aakar free trial session le sakte hain, Sir!`;
  }

  // Chest workout
  if (p.includes('chest') || p.includes('bench press') || p.includes('chhati')) {
    return `Sir, effective chest growth ke liye best workout routine:

1. **Flat Barbell Bench Press**: 3–4 sets (6–10 reps) — Heavy mechanical tension.
2. **Incline Dumbbell Press (30° angle)**: 3 sets (8–12 reps) — Upper chest (clavicular head).
3. **Dips ya Machine Chest Press**: 3 sets (10–12 reps) — Mid & lower chest.
4. **Cable Flyes / Pec Deck**: 3 sets (12–15 reps) — Deep stretch & peak contraction.

💡 *Coach Tip*: Hamesha shoulders ko peeche aur neeche lock rakhein (scapular retraction) taaki shoulder injury na ho.`;
  }

  // Back workout
  if (p.includes('back') || p.includes('lat') || p.includes('pull up') || p.includes('deadlift')) {
    return `Sir, ek wide aur thick V-Taper back ke liye best exercises:

1. **Lat Pulldown ya Pull-ups**: 3–4 sets (8–12 reps) — Lats width ke liye.
2. **Barbell Bent-Over Row ya T-Bar Row**: 3 sets (8–10 reps) — Mid-back thickness.
3. **Seated Cable Row**: 3 sets (10–12 reps) — Scapular squeeze.
4. **Conventional Deadlift ya Hyperextension**: 3 sets (6–8 reps) — Lower back aur posterior chain.

💡 *Coach Tip*: Weight ko hamesha elbows se pull karein, haathon se nahi!`;
  }

  // Arms: Biceps & Triceps
  if (p.includes('bicep') || p.includes('tricep') || p.includes('arm') || p.includes('dole')) {
    return `Sir, bigger arms ke liye biceps aur triceps dono par focus zaroori hai (Triceps arm ka 65% size banata hai):

💪 **Biceps Routine:**
- **Standing Barbell / EZ-Bar Curl**: 3 sets (8–10 reps)
- **Incline Dumbbell Curl**: 3 sets (10–12 reps) — Deep stretch on long head
- **Hammer Curls**: 3 sets (10–12 reps) — Brachialis muscle for arm thickness

🔥 **Triceps Routine:**
- **Close-Grip Bench Press ya Dips**: 3 sets (8–10 reps)
- **Overhead Cable Rope Extension**: 3 sets (10–12 reps) — Long head stretch
- **Straight Bar / Rope Pushdown**: 3 sets (12–15 reps) — Lateral head burn

💡 *Coach Tip*: Elbows ko swing mat karein, har rep me 2 second ka controlled eccentric (neeche lana) rakhein.`;
  }

  // Shoulder workout
  if (p.includes('shoulder') || p.includes('kandha') || p.includes('delt')) {
    return `Sir, 3D rounded shoulders develop karne ke liye teeno heads ko target karein:

1. **Overhead Barbell / Dumbbell Press**: 3–4 sets (6–10 reps) — Anterior delt aur overall strength.
2. **Dumbbell Lateral Raise**: 4 sets (12–15 reps) — Side delt for shoulder width.
3. **Rear Delt Flyes (Reverse Pec Deck / Face Pulls)**: 4 sets (15–20 reps) — Posture aur 3D look.

💡 *Coach Tip*: Lateral raises me heavy weight ke bajaye form par dhyan dein aur pinky finger ko halka upar rakhein.`;
  }

  // Legs workout
  if (p.includes('leg') || p.includes('squat') || p.includes('thigh') || p.includes('calf')) {
    return `Sir, legs ko train karna testosterone boost aur overall power ke liye sabse important hai:

1. **Barbell Back Squats**: 3–4 sets (6–8 reps) — King of lower body.
2. **Leg Press**: 3 sets (10–12 reps) — Quad overload.
3. **Romanian Deadlift (RDL)**: 3 sets (8–10 reps) — Hamstrings & glutes stretch.
4. **Leg Extensions & Lying Leg Curls**: 3 sets (12–15 reps).
5. **Standing Calf Raises**: 4 sets (15–20 reps).

💡 *Coach Tip*: Squat lagate waqt knees ko feet ke line me rakhein aur heels ko floor par press karein.`;
  }

  // Diet, Calories, Protein
  if (
    p.includes('diet') ||
    p.includes('protein') ||
    p.includes('calorie') ||
    p.includes('khana') ||
    p.includes('nutrition') ||
    p.includes('food') ||
    p.includes('whey') ||
    p.includes('creatine')
  ) {
    return `Sir, scientific nutrition ke basic golden rules:

1. **Daily Protein Requirement**:
   - Muscle building ke liye apne bodyweight (kg) ka **1.6g se 2.2g** protein daily lein.
   - Example: Agar aap 70 kg ke hain, to target **110g - 140g protein/day** rakhein.

2. **Best Protein Sources**:
   - **Vegetarian**: Soya chunks (52g/100g), Paneer (18g/100g), Tofu, Greek yogurt/Dahi, Moong dal, Roasted Chana, Whey Protein.
   - **Non-Vegetarian**: Eggs (6g/egg), Chicken breast (31g/100g), Fish.

3. **Creatine Monohydrate**:
   - Daily **3g to 5g** kisi bhi time lein, 3-4 liters paani peena zaroori hai.

Aap website par **Fitness Tools > Calorie & Macro Calculator** use karke apna exact daily calorie goal check kar sakte hain, Sir!`;
  }

  // Weight loss / Fat loss
  if (p.includes('weight loss') || p.includes('fat loss') || p.includes('pet kam') || p.includes('wazan kam')) {
    return `Sir, sustainable aur safe fat loss ke 3 golden rules:

1. **Moderate Caloric Deficit**:
   - Apni maintenance calories se 300–400 calories kam khayein. Crash dieting mat karein.
2. **High Protein Intake**:
   - Weight loss ke dauran muscle loss rokne ke liye high protein (1.8g/kg) lein.
3. **Strength Training + Steps**:
   - Gym me weight lifting continue karein aur daily **8,000 – 10,000 steps** walk karein.

Aap hamare **BMI & Calorie Calculator** se apna exact target nikal sakte hain, Sir!`;
  }

  // Weight gain / Muscle gain
  if (p.includes('weight gain') || p.includes('muscle gain') || p.includes('bulking') || p.includes('wazan badhana')) {
    return `Sir, lean muscle gain (clean bulking) ke liye:

1. **Caloric Surplus**:
   - Apni maintenance calorie se 300–500 extra calories khayein.
2. **Dense Calorie Foods**:
   - Peanut butter, oats, banana milkshakes, dry fruits, paneer, and eggs shamil karein.
3. **Progressive Overload**:
   - Har hafte gym me weights ya reps thode-thode badhane ki koshish karein.
4. **Sleep**:
   - Daily 7–8 ghante ki quality sleep lein kyunki muscle growth aaram ke waqt hoti hai.`;
  }

  // Workout splits (PPL, 4-day, 5-day)
  if (p.includes('split') || p.includes('routine') || p.includes('schedule') || p.includes('plan')) {
    return `Sir, fitness goals ke hisaab se best workout splits:

🔥 **Option A: Push-Pull-Legs (PPL) - 6 Days (Most Popular)**
- Day 1: Push (Chest, Shoulder, Triceps)
- Day 2: Pull (Back, Biceps, Rear Delts)
- Day 3: Legs & Abs
- Day 4-6: Repeat | Day 7: Rest

⚡ **Option B: Upper / Lower Split - 4 Days (Best for Busy Schedules)**
- Day 1: Upper Body | Day 2: Lower Body
- Day 3: Rest
- Day 4: Upper Body | Day 5: Lower Body
- Weekend: Rest

Aap hamare **Workout Builder** page par jaakar customized workout plan generate kar sakte hain!`;
  }

  // Fitness Calculators
  if (p.includes('calculator') || p.includes('bmi') || p.includes('bmr') || p.includes('tdee') || p.includes('1rm')) {
    return `Sir, aap hamare **Fitness Tools** section me jaakar ye sab calculate kar sakte hain:
- 📊 **BMI Calculator**: Apna healthy weight range check karein.
- 🔥 **BMR & TDEE Calculator**: Apni daily maintenance calorie consumption jaanein.
- 🍗 **Macro & Protein Calculator**: Apne goal ke hisaab se carbs, fats aur protein ratio set karein.
- 🏋️ **1RM Calculator**: One rep max strength calculate karein.
- ⏱️ **Rest Timer**: Sets ke beech exact rest time track karein.`;
  }

  // Default intelligent coach response
  return `Sir, welcome to Hulk's Work Zone!

Aapka question bohot acha hai. Chahe aapka goal **muscle hypertrophy**, **fat loss**, ya **strength gain** ho—discipline aur progressive training se 100% results aate hain.

Aap mujhse pooch sakte hain:
1. "Sir, chest aur bicep ka workout batayein"
2. "Weight loss ke liye diet plan kya hona chahiye?"
3. "Hulk's Work Zone gym Dabra ki fees aur timing kya hai?"
4. "Daily protein intake kaise calculate karein?"

Aap kis topic par guide chahte hain, Sir?`;
}
