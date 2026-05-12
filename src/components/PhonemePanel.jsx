import './PhonemePanel.css';

// Common IPA phoneme tips for non-native speakers
const PHONEME_TIPS = {
  'θ': { label: 'th (think)', tip: 'Place your tongue between your teeth and blow air gently.' },
  'ð': { label: 'th (the)',   tip: 'Same as θ but vibrate your vocal cords.' },
  'æ': { label: 'a (cat)',    tip: 'Open your mouth wide and push the sound forward.' },
  'ɪ': { label: 'i (bit)',    tip: 'Short, relaxed vowel — do not stretch your lips.' },
  'ʌ': { label: 'u (cup)',    tip: 'Central mouth, relaxed jaw. Not like "oo".' },
  'ɜː': { label: 'er (bird)', tip: 'Curl your tongue slightly without touching the roof.' },
  'ŋ': { label: 'ng (sing)',  tip: 'Nasal sound — the back of your tongue touches the soft palate.' },
  'v': { label: 'v (van)',    tip: 'Bite your lower lip lightly; feel the vibration.' },
  'w': { label: 'w (wet)',    tip: 'Round your lips fully before making the sound.' },
  'r': { label: 'r (red)',    tip: 'Curl your tongue back slightly; do not trill like in Spanish.' },
  'l': { label: 'l (let)',    tip: 'Touch the tip of your tongue behind your upper teeth.' },
};

export default function PhonemePanel({ word }) {
  if (!word || !word.phonemes?.length) return null;

  const weak = word.phonemes.filter((p) => p.score < 70);

  return (
    <div className="phoneme-panel">
      <div className="phoneme-header">
        <span className="phoneme-word">/{word.word}/</span>
        <span className="phoneme-overall" style={{ color: word.score >= 80 ? '#4caf84' : word.score >= 60 ? '#f0a500' : '#f06060' }}>
          {word.score} pts
        </span>
      </div>

      <div className="phoneme-list">
        {word.phonemes.map((p, i) => {
          const tip = PHONEME_TIPS[p.phoneme];
          const isWeak = p.score < 70;
          return (
            <div key={i} className={`phoneme-item ${isWeak ? 'phoneme-weak' : ''}`}>
              <span className="phoneme-ipa">[{p.phoneme}]</span>
              <div className="phoneme-bar-wrap">
                <div className="phoneme-bar" style={{ width: `${p.score}%`, background: p.score >= 80 ? '#4caf84' : p.score >= 60 ? '#f0a500' : '#f06060' }} />
              </div>
              <span className="phoneme-score">{p.score}</span>
            </div>
          );
        })}
      </div>

      {weak.length > 0 && (
        <div className="phoneme-tips">
          {weak.map((p, i) => {
            const tip = PHONEME_TIPS[p.phoneme];
            return tip ? (
              <div key={i} className="phoneme-tip-item">
                <span className="phoneme-tip-label">💡 [{p.phoneme}] — {tip.label}</span>
                <p className="phoneme-tip-text">{tip.tip}</p>
              </div>
            ) : null;
          }).filter(Boolean)}
        </div>
      )}
    </div>
  );
}
