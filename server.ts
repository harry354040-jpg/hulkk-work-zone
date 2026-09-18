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
Your mission is to guide gym members and visitors with encouraging, scientific, realistic, and friendly fitness advice.

CRITICAL LANGUAGE REQUIREMENT:
1. Automatically detect the user's language and style:
   - If user asks in Hindi (Devanagari): Respond in natural, warm Hindi.
   - If user asks in Hinglish (Latin script Hindi, e.g. "bhai chest workout kaise start karu", "protein kitna lena chahiye", "fat loss ke liye tips do"): Respond in natural, conversational Hinglish with words like "Bhai", "Dost", "Suno", "Aap", "Bilkul", etc.
   - If user asks in English: Respond in clear, professional English.
   - If user mixes languages: Respond in mixed natural Hinglish/English.
2. Tone: Friendly, encouraging, energetic, practical, and non-judgmental.
3. Structure: Use bullet points, bold highlights, and clean short paragraphs.

FITNESS CAPABILITIES:
- Explain training principles (progressive overload, reps in reserve, warmups, recovery, muscle splits).
- Explain nutrition concepts (calories, BMR, TDEE, protein intake, macro distribution, hydration).
- Break down exercise technique, common form mistakes, and gym safety.
- Explain calculator results when the user pastes or mentions their stats (e.g. BMI, BMR, 1RM, macros).
- Recommend visiting Hulk's Work Zone in Dabra (Phone: 8770506113) for hands-on gym training.

SAFETY & MEDICAL CONSTRAINTS:
- NEVER diagnose medical conditions or injuries.
- NEVER prescribe medications, steroids, SARMs, or dangerous substances.
- NEVER promote crash starvation diets or extreme unscientific dehydration.
- For pain or injury, advise stopping the exercise and consulting a qualified doctor or physiotherapist.`;

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

  if (lower.includes('bicep') || lower.includes('tricep') || lower.includes('arm')) {
    return `**Coach Hulk's Arm Training Tips 💪**\n\n- **Biceps**: Incline Dumbbell Curls (peak stretch) + Barbell Curl (overload) — 3-4 sets each, 8-12 reps.\n- **Triceps**: Cable Pushdowns + Overhead French Press (long head development) — 3-4 sets.\n- **Key Secret**: Focus on full elbow extension and controlled 2-second eccentrics rather than swinging heavy weights!`;
  }

  if (lower.includes('chest') || lower.includes('bench')) {
    return `**Coach Hulk's Chest Hypertrophy Guide 🏋️‍♂️**\n\n- **Flat Barbell / Dumbbell Press**: 3-4 sets, 6-10 reps (Compound heavy driver)\n- **Incline Dumbbell Press (30° angle)**: 3-4 sets, 8-12 reps (Upper clavicular head)\n- **Cable Crossover / Pec Dec Flye**: 3 sets, 12-15 reps (Deep stretch & peak contraction)\n- *Cue*: Retract your scapula (shoulders back and down) to protect your rotator cuff!`;
  }

  if (lower.includes('diet') || lower.includes('protein') || lower.includes('khana')) {
    return `**Coach Hulk's Nutrition Rulebook 🥗**\n\n1. **Protein**: Aim for 1.6g to 2.2g per kg of bodyweight (Eggs, chicken, paneer, soya, whey protein, dal).\n2. **Caloric Balance**: \n   - For Fat Loss: Eat 300-500 kcal below maintenance (TDEE).\n   - For Muscle Gain: Eat 200-300 kcal above maintenance with progressive overload.\n3. **Hydration**: At least 3.5 to 4.5 liters of water daily.`;
  }

  if (lower.includes('weight loss') || lower.includes('fat loss') || lower.includes('motapa')) {
    return `**Coach Hulk's Fat Loss Formula 🔥**\n\n1. **Caloric Deficit**: Diet controls fat loss, weight training preserves muscle.\n2. **Daily Steps**: Hit 8,000 - 10,000 steps daily (NEAT burning).\n3. **Strength Training**: Don't just do cardio! Lift weights 4-5 days a week to prevent muscle wasting.\n4. **Consistency**: 0.5kg to 0.8kg loss per week is healthy and sustainable.`;
  }

  return `**Namaste! Coach Hulk here at Hulk's Work Zone, Dabra! 🏋️‍♂️**\n\nMaine aapka message dekha: "${userPrompt}"\n\nAgar aap fitness journey start kar rahe hain ya plateaus todna chahte hain:\n- **Consistency**: Week me kam se kam 4-5 din dedicated workout karein.\n- **Progressive Overload**: Har week rep ya thoda weight badhane ki koshish karein.\n- **Rest & Sleep**: 7-8 ghante ki proper recovery zaroori hai.\n\nKoi specific sawal ho jaise *Chest workout*, *Protein intake*, ya *Weight loss*, zaroor batayein! Aap seedhe Dabra gym par bhi mil sakte hain (Call: **8770506113**).`;
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
