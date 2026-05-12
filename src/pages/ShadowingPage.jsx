import { useState, useRef, useCallback, useEffect } from 'react';
import WordHighlight from '../components/WordHighlight.jsx';
import PhonemePanel from '../components/PhonemePanel.jsx';
import Waveform from '../components/Waveform.jsx';
import ScoreCard from '../components/ScoreCard.jsx';
import { useApi } from '../hooks/useApi.js';
import './ShadowingPage.css';

const SENTENCES = [
  { id: 1,  level: 'Beginner',      text: 'Hello, how are you doing today?' },
  { id: 2,  level: 'Beginner',      text: 'My name is Alex and I live in Taipei.' },
  { id: 3,  level: 'Beginner',      text: 'I enjoy reading books and watching movies.' },
  { id: 4,  level: 'Intermediate',  text: 'The weather has been unusually warm this week.' },
  { id: 5,  level: 'Intermediate',  text: 'Learning a new language requires daily practice and patience.' },
  { id: 6,  level: 'Intermediate',  text: 'Technology has changed the way we communicate with each other.' },
  { id: 7,  level: 'Intermediate',  text: 'She decided to pursue her dream of becoming a professional musician.' },
  { id: 8,  level: 'Advanced',      text: 'The rapid development of artificial intelligence raises important ethical questions.' },
  { id: 9,  level: 'Advanced',      text: 'Environmental sustainability must be a priority for future generations worldwide.' },
  { id: 10, level: 'Advanced',      text: 'Cultural diversity enriches society and broadens our understanding of the human experience.' },
  { id: 11, level: 'Beginner',      text: 'Could you please repeat that more slowly?' },
  { id: 12, level: 'Intermediate',  text: 'I think this proposal has both advantages and disadvantages worth considering.' },
];

const LEVEL_COLORS = { Beginner: '#4caf84', Intermediate: '#6c63ff', Advanced: '#f0a500' };

const STEPS = { SELECT: 'select', LISTEN: 'listen', RECORD: 'record', RESULT: 'result' };

export default function ShadowingPage({ user }) {
  const [sentence, setSentence] = useState(SENTENCES[0]);
  const [step, setStep] = useState(STEPS.SELECT);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [stream, setStream] = useState(null);
  const [seconds, setSeconds] = useState(0);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeWord, setActiveWord] = useState(null);
  const [error, setError] = useState('');

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);
  const audioRef = useRef(null);
  const { post } = useApi();

  // Cleanup on unmount
  useEffect(() => () => {
    clearInterval(timerRef.current);
    stream?.getTracks().forEach((t) => t.stop());
  }, [stream]);

  const handleListen = async () => {
    setIsPlaying(true);
    setError('');
    try {
      const res = await post('/api/tts', { text: sentence.text });
      if (!res.ok) throw new Error('TTS failed');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.onended = () => { setIsPlaying(false); URL.revokeObjectURL(url); };
      audio.onerror = () => { setIsPlaying(false); setError('Could not play audio.'); };
      await audio.play();
      setStep(STEPS.RECORD);
    } catch (e) {
      setIsPlaying(false);
      setError(e.message || 'TTS error');
    }
  };

  const stopAudio = () => {
    audioRef.current?.pause();
    setIsPlaying(false);
  };

  const startRecording = useCallback(async () => {
    setError('');
    try {
      const s = await navigator.mediaDevices.getUserMedia({ audio: true });
      setStream(s);
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus') ? 'audio/webm;codecs=opus' : 'audio/webm';
      const mr = new MediaRecorder(s, { mimeType });
      mediaRecorderRef.current = mr;
      chunksRef.current = [];

      mr.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      mr.onstop = async () => {
        s.getTracks().forEach((t) => t.stop());
        setStream(null);
        const blob = new Blob(chunksRef.current, { type: mimeType });
        await assess(blob, mimeType);
      };

      mr.start(100);
      setIsRecording(true);
      setSeconds(0);
      timerRef.current = setInterval(() => {
        setSeconds((v) => {
          if (v >= 59) { stopRecording(); return v; }
          return v + 1;
        });
      }, 1000);
    } catch { setError('Microphone access denied.'); }
  }, [sentence]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current?.state === 'recording') mediaRecorderRef.current.stop();
    clearInterval(timerRef.current);
    setIsRecording(false);
  }, []);

  const assess = async (blob, mimeType) => {
    setLoading(true);
    setStep(STEPS.RESULT);
    try {
      const fd = new FormData();
      fd.append('audio', blob, 'recording.webm');
      fd.append('referenceText', sentence.text);

      const res = await post('/api/assess', fd, true);
      if (!res.ok) throw new Error('Assessment failed');
      const data = await res.json();
      setResult(data);

      // Save session
      post('/api/sessions', {
        topicId: sentence.id,
        topicTitle: `[Shadowing] ${sentence.text.slice(0, 40)}`,
        transcription: data.transcription,
        scores: { pronunciation: data.pronunciationScore, fluency: data.fluencyScore, grammar: null, vocabulary: null },
        words: data.words,
      }).catch(console.error);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setResult(null);
    setActiveWord(null);
    setStep(STEPS.LISTEN);
    setError('');
  };

  const handleNewSentence = () => {
    setResult(null);
    setActiveWord(null);
    setStep(STEPS.SELECT);
    setError('');
  };

  const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  return (
    <div className="page" style={{ maxWidth: 720 }}>
      <div className="page-heading">
        <h1>🗣️ Shadowing Mode</h1>
        <p>Listen to the native speaker, then repeat the sentence.</p>
      </div>

      {/* Sentence selector */}
      {step === STEPS.SELECT && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <p className="section-title">Choose a sentence</p>
          {SENTENCES.map((s) => (
            <button
              key={s.id}
              className={`sentence-btn ${sentence.id === s.id ? 'sentence-btn-active' : ''}`}
              onClick={() => setSentence(s)}
            >
              <span className="sentence-level" style={{ color: LEVEL_COLORS[s.level] }}>{s.level}</span>
              <span className="sentence-text">{s.text}</span>
            </button>
          ))}
          <button className="btn-primary" style={{ alignSelf: 'flex-start', marginTop: 8 }} onClick={() => setStep(STEPS.LISTEN)}>
            Start with this sentence →
          </button>
        </div>
      )}

      {/* Listen + Record + Result */}
      {step !== STEPS.SELECT && (
        <>
          <div className="shadow-sentence-card">
            <div className="shadow-step-label">Reference sentence</div>
            <p className="shadow-sentence-text">{sentence.text}</p>
            <span className="sentence-level" style={{ color: LEVEL_COLORS[sentence.sentence], fontSize: 12 }}>{sentence.level}</span>
          </div>

          {error && <div className="error-banner"><span>⚠️ {error}</span></div>}

          {/* Step: Listen */}
          {step === STEPS.LISTEN && (
            <div className="shadow-action-card">
              <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Step 1 — Listen carefully to the native speaker pronunciation.</p>
              <button className="btn-listen" onClick={handleListen} disabled={isPlaying}>
                {isPlaying ? (
                  <><span className="btn-listen-stop" onClick={stopAudio}>■ Stop</span></>
                ) : (
                  <>▶ Play Native Speaker</>
                )}
              </button>
              <button className="btn-ghost" onClick={handleNewSentence}>← Choose different sentence</button>
            </div>
          )}

          {/* Step: Record */}
          {step === STEPS.RECORD && (
            <div className="shadow-action-card">
              <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Step 2 — Now repeat the sentence out loud.</p>
              <Waveform stream={stream} isRecording={isRecording} />
              {!isRecording ? (
                <div style={{ display: 'flex', gap: 10 }}>
                  <button className="btn-record-shadow" onClick={startRecording}>🎙️ Start Recording</button>
                  <button className="btn-ghost" onClick={handleListen}>↺ Listen again</button>
                </div>
              ) : (
                <button className="btn-stop-shadow" onClick={stopRecording}>
                  ■ Stop &nbsp;{fmt(seconds)}
                </button>
              )}
            </div>
          )}

          {/* Step: Result */}
          {step === STEPS.RESULT && (
            <>
              {loading && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, padding: 32 }}>
                  <div className="spinner" />
                  <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Analysing pronunciation…</p>
                </div>
              )}

              {result && !loading && (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    <ScoreCard label="Pronunciation" score={result.pronunciationScore} color="var(--score-a)" icon="🗣️" />
                    <ScoreCard label="Fluency" score={result.fluencyScore} color="var(--score-b)" icon="🌊" />
                  </div>

                  {result.words?.length > 0 && (
                    <div className="card">
                      <p className="section-title" style={{ marginBottom: 12 }}>Word-by-word — click a word for details</p>
                      <WordHighlight words={result.words} onWordClick={setActiveWord} activeWord={activeWord} />
                      {activeWord !== null && (
                        <div style={{ marginTop: 14 }}>
                          <PhonemePanel word={result.words[activeWord]} />
                        </div>
                      )}
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    <button className="btn-primary" onClick={handleRetry}>🔄 Try Again</button>
                    <button className="btn-ghost" onClick={handleNewSentence}>New Sentence</button>
                  </div>
                </>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
