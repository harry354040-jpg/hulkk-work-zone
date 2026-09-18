# Hulk's Work Zone — Full-Stack Gym & Fitness Platform

A production-grade, full-stack fitness web application built for **Hulk's Work Zone** in **Dabra, Madhya Pradesh**.

This repository contains the complete editable source code for both the frontend (React + Tailwind CSS + Lucide Icons + Vite) and the backend (Express + Node.js + Google Gemini AI).

---

## 🏋️ Features Overview

1. **Google Reviews Trust Card & Assistant**
   - Verified 5-star Google review trust badge prominently featured in the Hero section.
   - Interactive review writing assistant with 1 to 5-star selector, prompt pills for genuine feedback, live word/character counters, one-tap clipboard copy, and direct redirection to the gym's official Google Maps review page.

2. **Real Bilingual AI Fitness Assistant (Coach Hulk)**
   - Powered by Google Gemini (`@google/genai` SDK) via backend `/api/chat` endpoint.
   - Native support for Hindi, Hinglish, and English queries.
   - Answers questions regarding hypertrophy, progressive overload, diet, BMR, TDEE, and beginner gym routines.
   - Educational safety disclaimer included on every response.

3. **Scientific Fitness Calculator Hub**
   - **Body Mass Index (BMI)** with healthy population bands.
   - **BMR & TDEE** via the Mifflin-St Jeor equation.
   - **Calorie & Macronutrient Split** (Protein, Carbs, Fats) for maintenance, fat loss, or muscle gain.
   - **Protein Requirements** based on athletic goal (g/kg & g/lb).
   - **One-Rep Max (1RM)** via the Epley formula with 50%–95% load breakdown.
   - **Body Fat %** via the US Navy circumference method.
   - **Hydration Estimator** taking into account training duration.
   - **"Ask AI About This Result 🤖"**: One-tap button that transfers calculated metrics into Coach Hulk AI for immediate context-aware advice.

4. **Form & Movement Exercise Library**
   - Searchable directory of core compound and isolation movements.
   - Categorized by muscle group, equipment, and experience level.
   - Detailed modal for each exercise containing step-by-step instructions, beginner cues, common form mistakes, and safety notes.
   - "Add to Workout Builder" quick action.

5. **Interactive Workout Builder & Volume Calculator**
   - Create and customize daily training routines.
   - Reorder exercises (move up/down), configure sets, reps, load (kg), and rest duration.
   - Real-time total training volume ($Sets \times Reps \times Weight$) and sets calculation.
   - Stored in browser `localStorage` with sample workout templates.

6. **Interval Rest Timer**
   - Digital countdown with SVG progress ring.
   - Quick interval presets: 30s, 60s, 90s, 120s, 180s.
   - Audio alert beep generated via standard Web Audio API (zero audio file dependencies, 100% offline reliable).

7. **PR & Progress Tracker**
   - Log bodyweight, Bench Press PR, Squat PR, Deadlift PR, dates, and training journal notes.
   - High-contrast visual table with personal record metric badges.
   - One-click CSV export for offline backup.

8. **Location, Pricing & Enquiry Management**
   - Transparent membership tier cards (1 Month, 3 Months, 6 Months, 12 Months).
   - Training schedules (Morning 5:30 AM – 10:30 AM, Evening 4:30 PM – 10:00 PM).
   - Direct calling (`tel:8770506113`), Instagram link, and Google Maps GPS navigation.
   - Membership enquiry modal connected to backend `/api/enquiry`.

---

## 📦 External Libraries & Dependencies

| Library | Version | Purpose | How to Install |
| :--- | :--- | :--- | :--- |
| `react` | `^19.0.0` | Declarative UI framework | `npm install react react-dom` |
| `vite` | `^6.0.0` | Fast build tool & dev server | Pre-installed via `package.json` |
| `@google/genai` | `^0.1.2` | Official Google Gemini AI SDK for server-side AI chat | `npm install @google/genai` |
| `express` | `^5.0.0` | Server runtime hosting `/api/chat` and `/api/enquiry` | `npm install express` |
| `lucide-react` | `^0.475.0` | Clean vector icons (Dumbbell, Star, Phone, etc.) | `npm install lucide-react` |
| `tailwindcss` | `^4.0.0` | High-performance utility styling | Configured via `@tailwindcss/vite` |
| `tsx` | `^4.19.0` | Executes backend TypeScript server in development | `npm install -D tsx` |
| `esbuild` | `^0.25.0` | Bundles server into standalone `dist/server.cjs` | `npm install -D esbuild` |

---

## 🚀 Quick Start (Local Setup)

### 1. Prerequisites
- **Node.js**: Version 18 or higher.
- **npm**: Version 9 or higher.

### 2. Clone & Install Dependencies
```bash
git clone <your-repo-url>
cd hulks-work-zone
npm install
```

### 3. Configure Environment Variables
Copy the template configuration file:
```bash
cp .env.example .env
```

Open `.env` and configure your API key:
```env
# Google Gemini API Key (Recommended)
GEMINI_API_KEY=your_actual_gemini_api_key_here

# (Optional Fallback) OpenAI API Key
OPENAI_API_KEY=

# Server Port (Default is 3000)
PORT=3000
```

> **Note on AI functionality**: The backend server is configured with graceful fallbacks. If no API key is provided, the AI assistant will explain key fitness concepts with educational responses while prompting the administrator to configure `GEMINI_API_KEY`.

### 4. Run Development Server
```bash
npm run dev
```
Open `http://localhost:3000` in your web browser. Both the React frontend and Express backend run concurrently through Vite middleware.

### 5. Production Build
```bash
npm run build
npm start
```
This compiles the client static assets to `dist/` and bundles the Express backend to `dist/server.cjs`.

---

## 🛠️ Customizing Gym Details

All gym information is centralized in a single configuration file: `src/data/gymInfo.ts`.

To update contact numbers, social media links, or addresses:
```typescript
// src/data/gymInfo.ts
export const GYM_INFO = {
  name: "Hulk's Work Zone",
  phone: "8770506113",
  phoneRaw: "8770506113",
  instagramUrl: "https://www.instagram.com/hulks_work_zone/",
  googleMapsUrl: "https://www.google.com/maps?...",
  googleReviewsUrl: "https://www.google.com/maps/place/Hulk's+workzone/...",
  city: "Dabra",
  state: "Madhya Pradesh",
  country: "India",
  address: "Hulk's Work Zone, Dabra, Gwalior District, Madhya Pradesh 475110",
  hours: {
    morning: "5:30 AM – 10:30 AM",
    evening: "4:30 PM – 10:00 PM",
    sunday: "6:00 AM – 10:00 AM",
  },
};
```

---

## 🌐 Deployment Instructions

### Option 1: Full-Stack Deployment (Cloud Run / Render / Railway / Heroku)
Because this app bundles both client and backend into one unified artifact, deploy it as a standard Node.js application:
1. Set the build command: `npm run build`
2. Set the start command: `npm start`
3. Add environment variable: `GEMINI_API_KEY=<your_api_key>`
4. Ensure port mapping binds to `0.0.0.0:3000` or `$PORT`.

### Option 2: Decoupled Frontend (Netlify / Vercel)
If you wish to host the static frontend on Netlify or Vercel:
1. Build command: `vite build`
2. Publish directory: `dist`
3. Deploy the Express backend (`server.ts`) to a serverless platform (e.g., Render, Railway, AWS Lambda, or Cloud Run).
4. In `src/components/AiAssistant.tsx` and `src/components/EnquiryModal.tsx`, update `/api/chat` and `/api/enquiry` to point to your deployed backend URL.

---

## 📄 License
Source code provided under standard permissive commercial terms for the owner and operators of **Hulk's Work Zone**.
