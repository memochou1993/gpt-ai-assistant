import { useState, useCallback } from 'react';
import TopicCard from '../components/TopicCard.jsx';
import Recorder from '../components/Recorder.jsx';
import ScoreCard from '../components/ScoreCard.jsx';
import FeedbackPanel from '../components/FeedbackPanel.jsx';
import { useApi } from '../hooks/useApi.js';

const INITIAL_STATE = { scores: null, feedback: null, transcription: '', isLoading: false, error: null };

export default function PracticePage({ user }) {
  const [topic, setTopic] = useState(null);
  const [state, setState] = useState(INITIAL_STATE);
  const { post } = useApi();

  const handleReset = useCallback(() => setState(INITIAL_STATE), []);

  const handleAudioReady = useCallback(async (audioBlob) => {
    setState((p) => ({ ...p, isLoading: true, error: null }));
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');

      const assessRes = await post('/api/assess', formData, true);
      if (!assessRes.ok) {
        const err = await assessRes.json().catch(() => ({}));
        throw new Error(err.message || `Assessment failed (${assessRes.status})`);
      }
      const assessData = await assessRes.json();

      setState((p) => ({
        ...p,
        transcription: assessData.transcription,
        scores: { pronunciation: assessData.pronunciationScore, fluency: assessData.fluencyScore, grammar: null, vocabulary: null },
      }));

      if (assessData.transcription) {
        const grammarRes = await post('/api/grammar', { transcription: assessData.transcription, topic: topic?.title || null });
        let grammarData = {};
        if (grammarRes.ok) grammarData = await grammarRes.json();

        const finalScores = {
          pronunciation: assessData.pronunciationScore,
          fluency: assessData.fluencyScore,
          grammar: grammarData.grammarScore ?? null,
          vocabulary: grammarData.vocabularyScore ?? null,
        };

        // Save session to DB
        post('/api/sessions', {
          topicId: topic?.id || null,
          topicTitle: topic?.title || 'Free Practice',
          transcription: assessData.transcription,
          scores: finalScores,
          feedback: grammarData,
        }).catch(console.error);

        setState((p) => ({ ...p, scores: finalScores, feedback: grammarData, isLoading: false }));
      } else {
        setState((p) => ({ ...p, isLoading: false }));
      }
    } catch (err) {
      setState((p) => ({ ...p, isLoading: false, error: err.message }));
    }
  }, [topic, post]);

  const hasResults = state.scores !== null;

  return (
    <div className="page" style={{ maxWidth: 720, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <TopicCard topic={topic} onTopicChange={setTopic} disabled={state.isLoading} />

      <Recorder onAudioReady={handleAudioReady} onReset={handleReset} isLoading={state.isLoading} hasResults={hasResults} disabled={!topic} />

      {state.error && (
        <div className="error-banner">
          <span>⚠️ {state.error}</span>
          <button className="error-dismiss" onClick={() => setState((p) => ({ ...p, error: null }))}>✕</button>
        </div>
      )}

      {state.transcription && (
        <div className="card">
          <span className="section-title" style={{ display: 'block', marginBottom: 8 }}>Transcription</span>
          <p style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--text-primary)' }}>{state.transcription}</p>
        </div>
      )}

      {hasResults && (
        <section>
          <p className="section-title">Your Scores</p>
          <div className="scores-grid">
            <ScoreCard label="Pronunciation" score={state.scores.pronunciation} color="var(--score-a)" icon="🗣️" loading={state.isLoading && state.scores.pronunciation === null} />
            <ScoreCard label="Fluency" score={state.scores.fluency} color="var(--score-b)" icon="🌊" loading={state.isLoading && state.scores.fluency === null} />
            <ScoreCard label="Grammar" score={state.scores.grammar} color="var(--score-c)" icon="✏️" loading={state.isLoading && state.scores.grammar === null} />
            <ScoreCard label="Vocabulary" score={state.scores.vocabulary} color="var(--score-d)" icon="📚" loading={state.isLoading && state.scores.vocabulary === null} />
          </div>
        </section>
      )}

      {state.feedback && <FeedbackPanel feedback={state.feedback} />}
    </div>
  );
}
