import axios from 'axios';

const REGION = process.env.AZURE_SPEECH_REGION;
const KEY = process.env.AZURE_SPEECH_KEY;

export async function assessPronunciation(audioBuffer, contentType = 'audio/webm') {
  if (!REGION || !KEY) throw new Error('Azure Speech credentials not configured.');

  const pronunciationConfig = Buffer.from(
    JSON.stringify({
      GradingSystem: 'HundredMark',
      Granularity: 'FullText',
      EnableMiscue: false,
      EnableProsodyAssessment: true,
    })
  ).toString('base64');

  const url = `https://${REGION}.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1`;

  const response = await axios.post(url, audioBuffer, {
    params: { language: 'en-US', format: 'detailed' },
    headers: {
      'Ocp-Apim-Subscription-Key': KEY,
      'Content-Type': contentType,
      'Pronunciation-Assessment': pronunciationConfig,
    },
    responseType: 'json',
    timeout: 30000,
  });

  const data = response.data;

  if (data.RecognitionStatus !== 'Success' || !data.NBest?.length) {
    return {
      transcription: data.DisplayText || '',
      pronunciationScore: null,
      fluencyScore: null,
    };
  }

  const best = data.NBest[0];
  const pa = best.PronunciationAssessment || {};

  return {
    transcription: best.Display || data.DisplayText || '',
    pronunciationScore: Math.round(pa.AccuracyScore ?? pa.PronScore ?? 0),
    fluencyScore: Math.round(pa.FluencyScore ?? 0),
  };
}
