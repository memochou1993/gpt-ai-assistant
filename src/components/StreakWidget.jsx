import './StreakWidget.css';

export default function StreakWidget({ user }) {
  if (!user) return null;

  const streak = user.currentStreak || 0;
  const longest = user.longestStreak || 0;
  const doneTodayVal = user.practicedToday || false;
  const sessions = user.sessionCount || 0;

  return (
    <div className="streak-widget">
      <div className="streak-main">
        <span className="streak-fire">{streak > 0 ? '🔥' : '💤'}</span>
        <div>
          <div className="streak-count">{streak} <span className="streak-unit">day{streak !== 1 ? 's' : ''}</span></div>
          <div className="streak-label">Current streak</div>
        </div>
      </div>

      <div className="streak-divider" />

      <div className="streak-stats">
        <div className="streak-stat">
          <span className="streak-stat-value">{sessions}</span>
          <span className="streak-stat-label">Sessions</span>
        </div>
        <div className="streak-stat">
          <span className="streak-stat-value">{longest}</span>
          <span className="streak-stat-label">Best streak</span>
        </div>
        <div className="streak-stat">
          <span className={`streak-today ${doneTodayVal ? 'done' : 'pending'}`}>
            {doneTodayVal ? '✓ Done' : '○ Today'}
          </span>
          <span className="streak-stat-label">Daily goal</span>
        </div>
      </div>
    </div>
  );
}
