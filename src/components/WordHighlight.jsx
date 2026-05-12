import { useState } from 'react';
import './WordHighlight.css';

function scoreColor(score, error) {
  if (error && error !== 'None') return 'word-error';
  if (score >= 80) return 'word-good';
  if (score >= 60) return 'word-fair';
  return 'word-poor';
}

const ERROR_LABELS = {
  Mispronunciation: 'Mispronounced',
  Omission: 'Omitted',
  Insertion: 'Extra word',
  UnexpectedBreak: 'Unexpected pause',
  MissingBreak: 'Missing pause',
};

export default function WordHighlight({ words, onWordClick, activeWord }) {
  if (!words?.length) return null;

  return (
    <div className="word-highlight-wrap">
      {words.map((w, i) => (
        <button
          key={i}
          className={`word-chip ${scoreColor(w.score, w.error)} ${activeWord === i ? 'word-chip-active' : ''}`}
          onClick={() => onWordClick?.(activeWord === i ? null : i)}
          title={w.error !== 'None' ? ERROR_LABELS[w.error] || w.error : `Score: ${w.score}`}
        >
          <span className="word-text">{w.word}</span>
          <span className="word-score">{w.score}</span>
        </button>
      ))}
    </div>
  );
}
