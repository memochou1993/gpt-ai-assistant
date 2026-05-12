import { useState, useCallback } from 'react';
import TopicCard from './components/TopicCard.jsx';
import Recorder from './components/Recorder.jsx';
import ScoreCard from './components/ScoreCard.jsx';
import FeedbackPanel from './components/FeedbackPanel.jsx';
import './App.css';

const INITIAL_STATE = {
  scores: null,
  feedback: null,
  transcription: '',
  isLoading: false,
  error: null,
};

export default function App() {
  const [topic, setTopic] = useState(null);
  const [state, setState] = useState(INITIAL_STATE);

  const handleReset = useCallback(() => {
    setState(INITIAL_STATE);
  }, []);

  const handleAudioReady = useCallback(async (audioBlob) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');

      const assessRes = await fetch('/api/assess', {
        method: 'POST',
        body: formData,
      });

      if (!assessRes.ok) {
        const err = await assessRes.json().catch(() => ({}));
        throw new Error(err.message || `Assessment failed (${assessRes.status})`);
      }

      const assessData = await assessRes.json();

      setState((prev) => ({
        ...prev,
        transcription: assessData.transcription,
        scores: {
          pronunciation: assessData.pronunciationScore,
          fluency: assessData.fluencyScore,
          grammar: null,
          vocabulary: null,
        },
      }));

      if (assessData.transcription) {
        const grammarRes = await fetch('/api/grammar', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            transcription: assessData.transcription,
            topic: topic?.title || null,
          }),
        });

        if (grammarRes.ok) {
          const grammarData = await grammarRes.json();
          setState((prev) => ({
            ...prev,
            scores: {
              ...prev.scores,
              grammar: grammarData.grammarScore,
              vocabulary: grammarData.vocabularyScore,
            },
            feedback: grammarData,
            isLoading: false,
          }));
        } else {
          setState((prev) => ({ ...prev, isLoading: false }));
        }
      } else {
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    } catch (err) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: err.message,
      }));
    }
  }, [topic]);

  const hasResults = state.scores !== null;

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-inner">
          <span className="header-icon">🎙️</span>
          <div>
            <h1>English Speaking Coach</h1>
            <p className="header-subtitle">AI-powered pronunciation & grammar feedback</p>
          </div>
        </div>
      </header>

      <main className="app-main">
        <TopicCard topic={topic} onTopicChange={setTopic} disabled={state.isLoading} />

        <Recorder
          onAudioReady={handleAudioReady}
          onReset={handleReset}
          isLoading={state.isLoading}
          hasResults={hasResults}
          disabled={!topic}
        />

        {state.error && (
          <div className="error-banner">
            <span>⚠️ {state.error}</span>
            <button className="error-dismiss" onClick={() => setState((p) => ({ ...p, error: null }))}>✕</button>
          </div>
        )}

        {state.transcription && (
          <div className="transcription-box">
            <span className="transcription-label">Transcription</span>
            <p className="transcription-text">{state.transcription}</p>
          </div>
        )}

        {hasResults && (
          <section className="scores-section">
            <h2 className="section-title">Your Scores</h2>
            <div className="scores-grid">
              <ScoreCard
                label="Pronunciation"
                score={state.scores.pronunciation}
                color="var(--score-a)"
                icon="🗣️"
                loading={state.isLoading && state.scores.pronunciation === null}
              />
              <ScoreCard
                label="Fluency"
                score={state.scores.fluency}
                color="var(--score-b)"
                icon="🌊"
                loading={state.isLoading && state.scores.fluency === null}
              />
              <ScoreCard
                label="Grammar"
                score={state.scores.grammar}
                color="var(--score-c)"
                icon="✏️"
                loading={state.isLoading && state.scores.grammar === null}
              />
              <ScoreCard
                label="Vocabulary"
                score={state.scores.vocabulary}
                color="var(--score-d)"
                icon="📚"
                loading={state.isLoading && state.scores.vocabulary === null}
              />
            </div>
          </section>
        )}

        {state.feedback && <FeedbackPanel feedback={state.feedback} />}
      </main>
    </div>
  );
}
