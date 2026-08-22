import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Lazy initialize Gemini AI client
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({ apiKey });
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', app: 'Memory Map' });
});

// AI Memory Summary Endpoint
app.post('/api/ai/summary', async (req, res) => {
  try {
    const { title, story, placeName, city, date, peopleNames, tags } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.status(200).json({
        summary: `A memorable journey to ${city || placeName || 'this location'} with ${
          peopleNames && peopleNames.length ? peopleNames.join(', ') : 'friends'
        }, marked by ${tags && tags.length ? tags.slice(0, 3).join(', ') : 'great memories'} and lasting moments.`,
        source: 'local_fallback',
      });
    }

    const prompt = `You are the emotional memory intelligence engine of "Memory Map". 
Create a concise, evocative, and deeply human 1-2 sentence emotional summary of this memory:
Title: ${title}
Story: ${story}
Location: ${placeName}, ${city}
Date: ${date}
People: ${(peopleNames || []).join(', ')}
Tags: ${(tags || []).join(', ')}

Return ONLY the 1-2 sentence summary without quotes or markdown prefixes.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const summaryText = response.text?.trim();
    return res.json({ summary: summaryText, source: 'gemini_api' });
  } catch (error: any) {
    console.error('Error generating AI summary:', error);
    return res.status(500).json({ error: error.message || 'AI generation failed' });
  }
});

// AI Auto-Organize Endpoint
app.post('/api/ai/organize', async (req, res) => {
  try {
    const { title, story, placeName, city, existingPeople } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.status(200).json({
        suggestion: null,
        message: 'No API key provided, client will use smart deterministic organizer',
      });
    }

    const prompt = `Analyze this memory narrative for the Memory Map platform:
Title: "${title || ''}"
Story: "${story || ''}"
Place: "${placeName || ''}", "${city || ''}"
Available People in User's Circle: ${(existingPeople || []).map((p: any) => p.name).join(', ')}

Provide a JSON response with:
1. "category": One of ["Travel", "Family", "Friends", "College", "Work", "Events", "Food", "Other"]
2. "tags": Array of 3 to 5 relevant string tags
3. "peopleNames": Array of people names mentioned or inferred from the narrative that match the user's circle
4. "collectionName": Recommended collection name (e.g. "College Life", "Travel & Roadtrips", "Tech & Hackathons", "Friends & Nights Out", "Family Heritage")
5. "aiSummary": A poetic 1-2 sentence emotional takeaway
6. "mood": A 2-word evocative mood descriptor (e.g. "Joyful & Nostalgic", "Euphoric & Inspired")

Respond ONLY with valid JSON in this format:
{
  "category": "...",
  "tags": ["..."],
  "peopleNames": ["..."],
  "collectionName": "...",
  "aiSummary": "...",
  "mood": "..."
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text?.trim() || '{}';
    const parsed = JSON.parse(text);
    return res.json({ suggestion: parsed, source: 'gemini_api' });
  } catch (error: any) {
    console.error('Error in AI organize:', error);
    return res.status(500).json({ error: error.message || 'AI organize failed' });
  }
});

async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Memory Map server running on http://localhost:${PORT}`);
  });
}

start();
