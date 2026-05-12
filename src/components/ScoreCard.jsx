import './ScoreCard.css';

function getGrade(score) {
  if (score === null) return '—';
  if (score >= 90) return 'Excellent';
  if (score >= 75) return 'Good';
  if (score >= 60) return 'Fair';
  return 'Needs Work';
}

function CircleProgress({ score, color }) {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const progress = score !== null ? (score / 100) * circumference : 0;

  return (
    <svg width="90" height="90" viewBox="0 0 90 90" className="score-circle">
      <circle cx="45" cy="45" r={radius} fill="none" stroke="var(--border)" strokeWidth="6" />
      <circle
        cx="45"
        cy="45"
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={score !== null ? circumference - progress : circumference}
        transform="rotate(-90 45 45)"
        style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)' }}
      />
      <text x="45" y="50" textAnchor="middle" fill="var(--text-primary)" fontSize="18" fontWeight="700">
        {score !== null ? Math.round(score) : '—'}
      </text>
    </svg>
  );
}

export default function ScoreCard({ label, score, color, icon, loading }) {
  return (
    <div className="score-card">
      {loading ? (
        <div className="score-loading">
          <div className="score-spinner" style={{ borderTopColor: color }} />
        </div>
      ) : (
        <CircleProgress score={score} color={color} />
      )}
      <div className="score-info">
        <span className="score-icon">{icon}</span>
        <span className="score-label">{label}</span>
        {!loading && score !== null && (
          <span className="score-grade" style={{ color }}>{getGrade(score)}</span>
        )}
      </div>
    </div>
  );
}
