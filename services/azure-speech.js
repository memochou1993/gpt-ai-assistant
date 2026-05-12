import axios from 'axios';

const REGION = process.env.AZURE_SPEECH_REGION;
const KEY = process.env.AZURE_SPEECH_KEY;

// ─── Pronunciation Assessment ─────────────────────────────────────────────────

export async function assessPronunciation(audioBuffer, contentType = 'audio/webm', referenceText = '') {
  if (!REGION || !KEY) throw new Error('Azure Speech credentials not configured.');

  const config = {
    GradingSystem: 'HundredMark',
    Granularity: 'Phoneme',        // word + phoneme level data
    EnableMiscue: !!referenceText,  // detect omissions / insertions
    PhonemeAlphabet: 'IPA',
    EnableProsodyAssessment: true,
  };
  if (referenceText) config.ReferenceText = referenceText;

  const pronunciationHeader = Buffer.from(JSON.stringify(config)).toString('base64');

  const url = `https://${REGION}.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1`;

  const response = await axios.post(url, audioBuffer, {
    params: { language: 'en-US', format: 'detailed' },
    headers: {
      'Ocp-Apim-Subscription-Key': KEY,
      'Content-Type': contentType,
      'Pronunciation-Assessment': pronunciationHeader,
    },
    responseType: 'json',
    timeout: 30_000,
  });

  const data = response.data;
  if (!data.NBest?.length) {
    return { transcription: data.DisplayText || '', pronunciationScore: null, fluencyScore: null, words: [] };
  }

  const best = data.NBest[0];
  const pa = best.PronunciationAssessment || {};

  const words = (best.Words || []).map((w) => ({
    word: w.Word,
    score: Math.round(w.PronunciationAssessment?.AccuracyScore ?? 0),
    error: w.PronunciationAssessment?.ErrorType || 'None',
    phonemes: (w.Phonemes || []).map((p) => ({
      phoneme: p.Phoneme,
      score: Math.round(p.PronunciationAssessment?.AccuracyScore ?? 0),
    })),
  }));

  return {
    transcription: best.Display || data.DisplayText || '',
    pronunciationScore: Math.round(pa.AccuracyScore ?? pa.PronScore ?? 0),
    fluencyScore: Math.round(pa.FluencyScore ?? 0),
    words,
  };
}

// ─── Text-to-Speech ───────────────────────────────────────────────────────────

export async function textToSpeech(text, voice = 'en-US-JennyNeural') {
  if (!REGION || !KEY) throw new Error('Azure Speech credentials not configured.');

  const ssml = `<speak version="1.0" xml:lang="en-US">
    <voice name="${voice}">
      <prosody rate="0%">${escapeXml(text)}</prosody>
    </voice>
  </speak>`;

  const response = await axios.post(
    `https://${REGION}.tts.speech.microsoft.com/cognitiveservices/v1`,
    ssml,
    {
      headers: {
        'Ocp-Apim-Subscription-Key': KEY,
        'Content-Type': 'application/ssml+xml',
        'X-Microsoft-OutputFormat': 'audio-16khz-128kbitrate-mono-mp3',
      },
      responseType: 'arraybuffer',
      timeout: 15_000,
    }
  );

  return Buffer.from(response.data);
}

function escapeXml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
