import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApi } from '../hooks/useApi.js';
import ScoreSparklines from '../components/ScoreSparkline.jsx';

function fmt(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function scoreClass(v) {
  if (v == null) return '';
  if (v >= 80) return 'score-high';
  if (v >= 60) return 'score-mid';
  return 'score-low';
}

export default function StudentDetailPage() {
  const { studentId } = useParams();
  const [student, setStudent] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [loading, setLoading] = useState(true);
  const { get } = useApi();

  useEffect(() => {
    Promise.all([
      get(`/api/teacher/students/${studentId}`).then((r) => r.json()),
      get(`/api/teacher/students/${studentId}/sessions`).then((r) => r.json()),
    ])
      .then(([s, ss]) => { setStudent(s); setSessions(ss); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [studentId]);

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}><div className="spinner" /></div>;

  return (
    <div className="page">
      <Link to="/teacher" style={{ fontSize: 13, color: 'var(--text-secondary)', textDecoration: 'none', display: 'block', marginBottom: 16 }}>← Back to Dashboard</Link>

      <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 28 }}>
        <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
          {student?.name?.[0]?.toUpperCase() || '?'}
        </div>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700 }}>{student?.name}</div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{student?.email}</div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>{sessions.length} sessions completed</div>
        </div>
      </div>

      {sessions.length > 0 && (
        <>
          <p className="section-title">Score Trends</p>
          <div style={{ marginBottom: 28 }}>
            <ScoreSparklines sessions={sessions} />
          </div>
        </>
      )}

      <p className="section-title">Session History</p>
      {sessions.length === 0 ? (
        <div className="empty-state"><div className="empty-state-icon">📝</div><p>This student has not completed any practice sessions yet.</p></div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[...sessions].reverse().map((s) => (
            <div key={s.id} className="card" style={{ cursor: 'pointer' }} onClick={() => setExpanded(expanded === s.id ? null : s.id)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{s.topicTitle}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>{fmt(s.createdAt)}</div>
                </div>
                <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                  {['pronunciation', 'fluency', 'grammar', 'vocabulary'].map((m) => (
                    <span key={m} className={`score-pill ${scoreClass(s.scores?.[m])}`} style={{ fontSize: 12 }}>
                      {s.scores?.[m] != null ? Math.round(s.scores[m]) : '—'}
                    </span>
                  ))}
                </div>
              </div>

              {expanded === s.id && (
                <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
                  {s.transcription && (
                    <div style={{ marginBottom: 14 }}>
                      <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.6px', color: 'var(--text-secondary)', marginBottom: 6 }}>Transcription</div>
                      <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--text-primary)' }}>{s.transcription}</p>
                    </div>
                  )}
                  {s.feedback?.overallFeedback && (
                    <div style={{ background: 'rgba(108,99,255,0.07)', borderLeft: '3px solid var(--accent)', padding: '10px 14px', borderRadius: '0 8px 8px 0', fontSize: 13, lineHeight: 1.7, color: 'var(--text-primary)' }}>
                      {s.feedback.overallFeedback}
                    </div>
                  )}
                  {s.feedback?.grammarCorrections?.length > 0 && (
                    <div style={{ marginTop: 12 }}>
                      <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.6px', color: 'var(--text-secondary)', marginBottom: 8 }}>Grammar Corrections</div>
                      {s.feedback.grammarCorrections.map((c, i) => (
                        <div key={i} style={{ fontSize: 13, marginBottom: 6, color: 'var(--text-secondary)' }}>
                          <span style={{ color: 'var(--danger)' }}>"{c.original}"</span> → <span style={{ color: 'var(--success)' }}>"{c.corrected}"</span>
                          {c.explanation && <span> — {c.explanation}</span>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
