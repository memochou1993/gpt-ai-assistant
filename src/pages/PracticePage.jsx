import { useState, useCallback } from 'react';
import TopicCard from '../components/TopicCard.jsx';
import Recorder from '../components/Recorder.jsx';
import ScoreCard from '../components/ScoreCard.jsx';
import FeedbackPanel from '../components/FeedbackPanel.jsx';
import WordHighlight from '../components/WordHighlight.jsx';
import PhonemePanel from '../components/PhonemePanel.jsx';
import StreakWidget from '../components/StreakWidget.jsx';
import { useApi } from '../hooks/useApi.js';

const INITIAL = { scores: null, feedback: null, transcription: '', words: [], isLoading: false, error: null };

export default function PracticePage({ user, onUserUpdate }) {
  const [topic, setTopic] = useState(null);
  const [state, setState] = useState(INITIAL);
  const [activeWord, setActiveWord] = useState(null);
  const { post } = useApi();

  const handleReset = useCallback(() => { setState(INITIAL); setActiveWord(null); }, []);

  const handleAudioReady = useCallback(async (blob) => {
    setState((p) => ({ ...p, isLoading: true, error: null }));
    try {
      const fd = new FormData();
      fd.append('audio', blob, 'recording.webm');

      const assessRes = await post('/api/assess', fd, true);
      if (!assessRes.ok) {
        const err = await assessRes.json().catch(() => ({}));
        throw new Error(err.message || `Assessment failed (${assessRes.status})`);
      }
      const assessData = await assessRes.json();

      setState((p) => ({
        ...p,
        transcription: assessData.transcription,
        words: assessData.words || [],
        scores: { pronunciation: assessData.pronunciationScore, fluency: assessData.fluencyScore, grammar: null, vocabulary: null },
      }));

      let grammarData = {};
      if (assessData.transcription) {
        const gr = await post('/api/grammar', { transcription: assessData.transcription, topic: topic?.title || null });
        if (gr.ok) grammarData = await gr.json();
      }

      const finalScores = {
        pronunciation: assessData.pronunciationScore,
        fluency: assessData.fluencyScore,
        grammar: grammarData.grammarScore ?? null,
        vocabulary: grammarData.vocabularyScore ?? null,
      };

      // Save session + streak update
      post('/api/sessions', {
        topicId: topic?.id || null,
        topicTitle: topic?.title || 'Free Practice',
        transcription: assessData.transcription,
        scores: finalScores,
        feedback: grammarData,
        words: assessData.words || [],
      }).then((r) => r.json()).then((saved) => {
        // Refresh user streak from server after save
        onUserUpdate?.();
      }).catch(console.error);

      setState((p) => ({ ...p, scores: finalScores, feedback: grammarData, isLoading: false }));
    } catch (err) {
      setState((p) => ({ ...p, isLoading: false, error: err.message }));
    }
  }, [topic, post, onUserUpdate]);

  const hasResults = state.scores !== null;

  return (
    <div className="page" style={{ maxWidth: 720, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <StreakWidget user={user} />
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
          <span className="section-title" style={{ display: 'block', marginBottom: 10 }}>Transcription</span>
          <p style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--text-primary)', marginBottom: state.words?.length ? 14 : 0 }}>
            {state.transcription}
          </p>
          {state.words?.length > 0 && (
            <>
              <span className="section-title" style={{ display: 'block', marginBottom: 10 }}>Word scores — click to see phoneme detail</span>
              <WordHighlight words={state.words} onWordClick={setActiveWord} activeWord={activeWord} />
              {activeWord !== null && (
                <div style={{ marginTop: 14 }}>
                  <PhonemePanel word={state.words[activeWord]} />
                </div>
              )}
            </>
          )}
        </div>
      )}

      {hasResults && (
        <section>
          <p className="section-title">Your Scores</p>
          <div className="scores-grid">
            <ScoreCard label="Pronunciation" score={state.scores.pronunciation} color="var(--score-a)" icon="🗣️" loading={state.isLoading && state.scores.pronunciation === null} />
            <ScoreCard label="Fluency"       score={state.scores.fluency}       color="var(--score-b)" icon="🌊" loading={state.isLoading && state.scores.fluency === null} />
            <ScoreCard label="Grammar"       score={state.scores.grammar}       color="var(--score-c)" icon="✏️" loading={state.isLoading && state.scores.grammar === null} />
            <ScoreCard label="Vocabulary"    score={state.scores.vocabulary}    color="var(--score-d)" icon="📚" loading={state.isLoading && state.scores.vocabulary === null} />
          </div>
        </section>
      )}

      {state.feedback && <FeedbackPanel feedback={state.feedback} />}
    </div>
  );
}
