import { useEffect, useState } from 'react';
import { useApi } from '../hooks/useApi.js';
import ScoreSparklines from '../components/ScoreSparkline.jsx';

function scoreClass(v) {
  if (v == null) return '';
  if (v >= 80) return 'score-high';
  if (v >= 60) return 'score-mid';
  return 'score-low';
}

function fmt(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function ProgressPage() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { get } = useApi();

  useEffect(() => {
    get('/api/sessions')
      .then((r) => r.json())
      .then(setSessions)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page">
      <div className="page-heading">
        <h1>My Progress</h1>
        <p>Track your improvement over time</p>
      </div>

      {loading && <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}><div className="spinner" /></div>}

      {!loading && sessions.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">📊</div>
          <p>No sessions yet.<br />Go to Practice and complete your first speaking exercise!</p>
        </div>
      )}

      {!loading && sessions.length > 0 && (
        <>
          <p className="section-title">Score Trends ({sessions.length} sessions)</p>
          <ScoreSparklines sessions={sessions} />

          <p className="section-title" style={{ marginTop: 28 }}>Session History</p>
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Topic</th>
                  <th>Pron.</th>
                  <th>Fluency</th>
                  <th>Grammar</th>
                  <th>Vocab</th>
                </tr>
              </thead>
              <tbody>
                {[...sessions].reverse().map((s) => (
                  <tr key={s.id}>
                    <td style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{fmt(s.createdAt)}</td>
                    <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.topicTitle}</td>
                    {['pronunciation', 'fluency', 'grammar', 'vocabulary'].map((m) => (
                      <td key={m}>
                        <span className={`score-pill ${scoreClass(s.scores?.[m])}`}>{s.scores?.[m] != null ? Math.round(s.scores[m]) : '—'}</span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {sessions.length > 0 && sessions[sessions.length - 1]?.transcription && (
            <>
              <p className="section-title" style={{ marginTop: 28 }}>Latest Transcription</p>
              <div className="card">
                <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--text-secondary)' }}>{sessions[sessions.length - 1].transcription}</p>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
