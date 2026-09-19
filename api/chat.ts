import { GoogleGenAI } from '@google/genai';

const SYSTEM_INSTRUCTION = `You are "Coach Hulk", the official AI Fitness Coach for "Hulk's Work Zone" gym located in Dabra, Madhya Pradesh, India.
Your mission is to guide gym members and visitors with encouraging, scientific, realistic, and respectful fitness advice.

CRITICAL TONE & LANGUAGE REQUIREMENTS:
1. STRICT RESPECTFUL ADDRESS: Always address the user respectfully as "Sir" or "Ma'am" (e.g., "Sir, based on your goal...", "Ma'am, for a beginner...").
   - NEVER use casual slang such as "Bhai", "Bro", "Yaar", or "Dost".
   - Maintain a friendly, respectful, professional, simple, and supportive tone at all times.
2. CONCISE & ACTIONABLE: Avoid huge walls of text. Keep your responses to 1-2 short paragraphs or clean bullet points, followed immediately by a direct actionable recommendation.
3. LANGUAGE DETECTION:
   - If user asks in Hindi / Hinglish: Respond in respectful, polite Hinglish/Hindi (using "Aap", "Sir", "Ma'am", polite verbs).
   - If user asks in English: Respond in clear, professional English.
4. WEBSITE INTEGRATION & NAVIGATION:
   - When asked about calculators, recommend the Fitness Tools section (/tools).
   - When asked about exercises or form, recommend the Exercise Library (/exercises).
   - When asked about workout routines, recommend the Workout Builder (/workout-builder).
   - When asked about timing between sets, recommend the Rest Timer (/tools/rest-timer).
   - When asked about joining, membership, or visiting in Dabra, provide the gym details (Phone: 8770506113, Dabra, MP) and suggest the Membership section (/membership).

FITNESS CAPABILITIES:
- Explain training principles (progressive overload, rest periods, warmups, recovery, muscle splits).
- Explain nutrition concepts (calories, BMR, TDEE, protein intake, macro distribution, hydration).
- Break down exercise technique, common form mistakes, and gym safety.
- Explain calculator results when the user mentions their numbers (e.g. BMI, BMR, 1RM, macros).

SAFETY & MEDICAL CONSTRAINTS:
- NEVER diagnose medical conditions or injuries.
- NEVER prescribe medications, steroids, SARMs, or dangerous substances.
- NEVER promote crash starvation diets or extreme unscientific dehydration.
- For pain or injury, advise stopping the exercise and consulting a qualified medical doctor or physiotherapist.`;

function generateCoachFallbackResponse(userPrompt: string): string {
  const lower = userPrompt.toLowerCase();

  if (lower.includes('calculator') || lower.includes('bmi') || lower.includes('tdee') || lower.includes('bmr') || lower.includes('macro') || lower.includes('1rm')) {
    return `Sir, you can calculate your exact numbers right on this platform:\n\n- **BMI & Body Fat**: Find your weight status and composition.\n- **BMR & TDEE**: Discover your daily maintenance calories.\n- **Protein & Macros**: Tailor your grams per day based on your training goal.\n\nOpen the **Fitness Tools** section to run your calculation instantly.`;
  }

  if (lower.includes('workout') || lower.includes('routine') || lower.includes('schedule') || lower.includes('split')) {
    return `Sir, consistency beats complexity every time:\n\n- Beginners usually thrive on **3 full-body sessions per week** or a **4-day upper/lower split**.\n- Focus on compound movements: Squat, Bench Press, Deadlift, Overhead Press, and Rows.\n\nYou can generate an individualized routine directly in our **Workout Builder** section!`;
  }

  if (lower.includes('bicep') || lower.includes('tricep') || lower.includes('arm')) {
    return `Sir, for arm hypertrophy focus on controlled tempos:\n\n- **Biceps**: Incline Dumbbell Curls (deep stretch) + Barbell Curl (overload) — 3 sets, 8–12 reps.\n- **Triceps**: Cable Pushdowns + Overhead Extensions (long head) — 3 sets, 10–12 reps.\n\nCheck our **Exercise Library** for full technique breakdowns and common mistakes to avoid.`;
  }

  if (lower.includes('chest') || lower.includes('bench')) {
    return `Sir, here is a concise chest development breakdown:\n\n- **Barbell Bench Press**: 3–4 sets, 6–8 reps for mechanical tension.\n- **Incline Dumbbell Press (30°)**: 3 sets, 8–12 reps for the upper clavicular head.\n- **Cable Flye**: 3 sets, 12–15 reps for peak contraction.\n\n*Form Tip*: Retract your scapulae (pull shoulders back and down) to safeguard your rotator cuffs.`;
  }

  if (lower.includes('diet') || lower.includes('protein') || lower.includes('khana')) {
    return `Sir, nutrition principles to support your training:\n\n1. **Protein**: Aim for 1.6g to 2.2g per kg of bodyweight (eggs, chicken, paneer, soya, dal, whey).\n2. **Caloric Balance**: A moderate 300–400 kcal deficit for fat loss, or 250–350 kcal surplus for clean muscle building.\n3. **Hydration**: Drink 3.5 to 4.5 liters of water daily.\n\nYou can calculate your exact target in our **Calorie & Macro Calculator**!`;
  }

  if (lower.includes('weight loss') || lower.includes('fat loss') || lower.includes('motapa')) {
    return `Sir, sustainable fat loss relies on three pillars:\n\n1. **Moderate Caloric Deficit**: 300–500 kcal below maintenance.\n2. **Resistance Training**: Lift weights 3–4 days a week to preserve lean muscle tissue.\n3. **Daily Steps**: Aim for 8,000–10,000 daily steps for steady non-exercise calorie expenditure.`;
  }

  if (lower.includes('membership') || lower.includes('fees') || lower.includes('price') || lower.includes('join') || lower.includes('dabra')) {
    return `Sir, you are welcome to visit Hulk's Work Zone in Dabra!\n\n- **Hours**: Morning 5:30 AM – 10:30 AM, Evening 4:30 PM – 10:00 PM.\n- **Plans**: 1 Month (₹1,200), 3 Months (₹3,200), 6 Months (₹5,800), and Annual (₹10,500).\n- **Phone**: **8770506113**.\n\nPlease visit the **Membership** page or tap **Join / Enquire** to connect with our team!`;
  }

  return `Sir, welcome to Hulk's Work Zone. Whatever your fitness target—fat loss, muscle hypertrophy, or athletic endurance—discipline and smart progression will deliver results.\n\nCould you share your current primary goal, age, or experience level so I can tailor the best advice for you?`;
}

export default async function handler(req: any, res: any) {
  // Allow CORS if needed
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    const { message, conversation } = body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message cannot be empty.' });
    }

    const geminiApiKey = process.env.GEMINI_API_KEY;

    if (geminiApiKey && geminiApiKey !== 'MY_GEMINI_API_KEY') {
      try {
        const ai = new GoogleGenAI({
          apiKey: geminiApiKey,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build',
            },
          },
        });

        const conversationHistory = Array.isArray(conversation)
          ? conversation
              .slice(-8)
              .filter((msg: any) => msg && typeof msg.content === 'string')
              .map(
                (msg: { role: string; content: string }) =>
                  `${msg.role === 'assistant' ? 'Coach Hulk' : 'Gym Member'}: ${msg.content}`
              )
              .join('\n\n')
          : '';

        const prompt = conversationHistory
          ? `Conversation Context:\n${conversationHistory}\n\nGym Member: ${message.trim()}\nCoach Hulk:`
          : message.trim();

        const candidateModels = ['gemini-3.8-flash', 'gemini-3.1-flash-lite'];
        for (const modelName of candidateModels) {
          try {
            const response = await ai.models.generateContent({
              model: modelName,
              contents: prompt,
              config: {
                systemInstruction: SYSTEM_INSTRUCTION,
                temperature: 0.7,
              },
            });

            if (response.text) {
              return res.status(200).json({ reply: response.text, provider: 'gemini', model: modelName });
            }
          } catch (modelErr: any) {
            console.warn(`Model ${modelName} unavailable:`, modelErr?.message || modelErr);
          }
        }
      } catch (geminiErr: any) {
        console.warn('Gemini error:', geminiErr?.message || geminiErr);
      }
    }

    const fallbackReply = generateCoachFallbackResponse(message.trim());
    return res.status(200).json({ reply: fallbackReply, provider: 'coach-hulk-local' });
  } catch (err: any) {
    console.error('Serverless chat error:', err);
    return res.status(500).json({
      error: 'An unexpected error occurred.',
      details: err?.message,
    });
  }
}
