import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '1mb' }));

// In-memory store for leads/enquiries
interface StoredEnquiry {
  id: string;
  name: string;
  phone: string;
  goal: string;
  planInterest: string;
  message: string;
  createdAt: string;
}
const enquiries: StoredEnquiry[] = [];

// Rate limiting map for AI chat (IP based)
const ipRequestCounts = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 30;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = ipRequestCounts.get(ip);

  if (!record || now > record.resetTime) {
    ipRequestCounts.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }

  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }

  record.count += 1;
  return true;
}

// System Prompt for AI Fitness Coach
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

// 1. Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    gym: "Hulk's Work Zone",
    location: 'Dabra, Madhya Pradesh',
    timestamp: new Date().toISOString(),
  });
});

// 2. Chat endpoint (Supports Gemini via @google/genai or OpenAI if configured)
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const clientIp = req.ip || req.socket.remoteAddress || 'unknown';
    if (!checkRateLimit(clientIp)) {
      return res.status(429).json({
        error: 'Too many requests. Please wait a minute before sending another question.',
      });
    }

    const { message, conversation } = req.body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message cannot be empty.' });
    }

    if (message.length > 2000) {
      return res.status(400).json({ error: 'Message is too long (maximum 2000 characters).' });
    }

    const geminiApiKey = process.env.GEMINI_API_KEY;
    const openaiApiKey = process.env.OPENAI_API_KEY;

    // Primary Provider: Google Gemini (@google/genai)
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

        // Format conversation history for Gemini
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

        // Use model cascade to ensure high availability during demand spikes
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
              return res.json({ reply: response.text, provider: 'gemini', model: modelName });
            }
          } catch (modelErr: any) {
            console.warn(`Model ${modelName} unavailable, checking fallback:`, modelErr?.status || modelErr?.message || modelErr);
          }
        }
      } catch (geminiErr: any) {
        console.warn('Gemini API call returned an error, checking fallback:', geminiErr?.message || geminiErr);
      }
    }

    // Secondary Optional Provider: OpenAI (only if Gemini is not configured or failed)
    if (openaiApiKey && openaiApiKey !== 'your_openai_api_key_here' && openaiApiKey.startsWith('sk-')) {
      try {
        const messagesPayload = [
          { role: 'system', content: SYSTEM_INSTRUCTION },
          ...(Array.isArray(conversation)
            ? conversation.slice(-10).map((msg: { role: string; content: string }) => ({
                role: msg.role === 'assistant' ? 'assistant' : 'user',
                content: msg.content,
              }))
            : []),
          { role: 'user', content: message.trim() },
        ];

        const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${openaiApiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: messagesPayload,
            temperature: 0.7,
            max_tokens: 800,
          }),
        });

        if (openaiRes.ok) {
          const data = await openaiRes.json();
          const reply = data.choices?.[0]?.message?.content;
          if (reply) {
            return res.json({ reply, provider: 'openai' });
          }
        }
      } catch {
        // Silently fall through to intelligent coach fallback
      }
    }

    // Intelligent built-in fitness coach response fallback if external APIs are temporarily unavailable
    const fallbackReply = generateCoachFallbackResponse(message.trim());
    return res.json({ reply: fallbackReply, provider: 'coach-hulk-local' });
  } catch (error: any) {
    console.error('Error in /api/chat endpoint:', error);
    return res.status(500).json({
      error: 'An unexpected error occurred while contacting the AI Coach. Please try again.',
      details: process.env.NODE_ENV !== 'production' ? error.message : undefined,
    });
  }
});

// Intelligent local rule-based response generator when offline or API key is reaching quota
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

  return `Sir, welcome to Hulk's Work Zone! I am Coach Hulk, your training assistant.\n\n- Whether you need help with **exercise technique**, **calculating calories**, or **building a workout**, I am here to guide you.\n- For in-person training, our gym in Dabra is equipped with top-tier strength machines, Olympic barbells, and certified trainers.\n\nFeel free to ask any question or navigate to our **Fitness Tools** or **Exercise Library**!`;
}

// 3. Enquiry / Lead Generation Endpoint
app.post('/api/enquiry', (req: Request, res: Response) => {
  try {
    const { name, phone, goal, planInterest, message } = req.body;

    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return res.status(400).json({ error: 'Please provide a valid name (at least 2 characters).' });
    }

    if (!phone || typeof phone !== 'string' || phone.trim().replace(/\D/g, '').length < 10) {
      return res.status(400).json({ error: 'Please enter a valid 10-digit phone number.' });
    }

    const cleanEnquiry: StoredEnquiry = {
      id: `enq_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: name.trim(),
      phone: phone.trim(),
      goal: (goal || 'General Fitness').trim(),
      planInterest: (planInterest || 'Unspecified').trim(),
      message: (message || '').trim(),
      createdAt: new Date().toISOString(),
    };

    enquiries.unshift(cleanEnquiry);
    console.log('[LEAD] New gym enquiry received:', cleanEnquiry);

    return res.status(200).json({
      success: true,
      message: "Thank you for reaching out to Hulk's Work Zone! We will call or WhatsApp you shortly.",
      enquiryId: cleanEnquiry.id,
    });
  } catch (error) {
    console.error('Error in /api/enquiry:', error);
    return res.status(500).json({ error: 'Unable to process enquiry. Please call us directly at 8770506113.' });
  }
});

// Setup Vite development middleware or static production serving
async function setupServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
    console.log(`Gym: Hulk's Work Zone | Dabra | Phone: 8770506113`);
  });
}

setupServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
