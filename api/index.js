import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import { assessPronunciation } from '../services/azure-speech.js';
import { analyzeGrammarAndVocabulary } from '../services/azure-openai.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 15 * 1024 * 1024 } });

app.use(cors());
app.use(express.json());

// Serve Vite build in production
const distPath = path.join(__dirname, '..', 'dist');
app.use(express.static(distPath));

// POST /api/assess — audio file → Azure Speech pronunciation assessment
app.post('/api/assess', upload.single('audio'), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No audio file received.' });

  const contentType = req.file.mimetype || 'audio/webm';

  try {
    const result = await assessPronunciation(req.file.buffer, contentType);
    return res.json(result);
  } catch (err) {
    console.error('[assess]', err.message);
    return res.status(502).json({ message: err.message || 'Speech assessment failed.' });
  }
});

// POST /api/grammar — transcription text → Azure OpenAI grammar/vocab analysis
app.post('/api/grammar', async (req, res) => {
  const { transcription, topic } = req.body || {};
  if (!transcription?.trim()) return res.status(400).json({ message: 'No transcription provided.' });

  try {
    const result = await analyzeGrammarAndVocabulary(transcription, topic || null);
    return res.json(result);
  } catch (err) {
    console.error('[grammar]', err.message);
    return res.status(502).json({ message: err.message || 'Grammar analysis failed.' });
  }
});

// Fallback: SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;
