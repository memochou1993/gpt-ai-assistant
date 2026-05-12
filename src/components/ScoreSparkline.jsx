const COLORS = { pronunciation: '#4caf84', fluency: '#6c63ff', grammar: '#f0a500', vocabulary: '#e85d8a' };

function Sparkline({ values, color, width = 120, height = 40 }) {
  if (!values || values.length < 2) return null;
  const pts = values.map((v, i) => {
    const x = (i / (values.length - 1)) * width;
    const y = height - (v / 100) * height;
    return `${x},${y}`;
  }).join(' ');
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ display: 'block' }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={parseFloat(pts.split(' ').at(-1))} cy={parseFloat(pts.split(' ').at(-1).split(',')[1])} r="3" fill={color} />
    </svg>
  );
}

export default function ScoreSparklines({ sessions }) {
  const metrics = ['pronunciation', 'fluency', 'grammar', 'vocabulary'];
  const latest = sessions[sessions.length - 1]?.scores || {};

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
      {metrics.map((m) => {
        const vals = sessions.map((s) => s.scores?.[m]).filter((v) => v != null);
        const avg = vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : null;
        return (
          <div key={m} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
            <div>
              <div style={{ fontSize: 22, fontWeight: 700, color: COLORS[m] }}>{latest[m] != null ? Math.round(latest[m]) : '—'}</div>
              <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.6px', color: 'var(--text-secondary)', marginTop: 3 }}>{m}</div>
              {avg != null && <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>avg {avg}</div>}
            </div>
            <Sparkline values={vals} color={COLORS[m]} />
          </div>
        );
      })}
    </div>
  );
}
