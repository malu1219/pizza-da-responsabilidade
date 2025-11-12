// src/components/ResponsibilityChart.jsx
import React, { useMemo } from 'react';
import { computeSlices } from '../utils/computeSlices';

export default function ResponsibilityChart({
  factors = [],
  highlighted = null,
  onHighlight = () => {},
  size = 280
}) {
  const slices = useMemo(() =>
    computeSlices(factors.map(f => ({ ...f, value: Number(f.value || 0) })))
  , [factors]);

  const cx = size / 2;
  const cy = size / 2;
  const radius = Math.min(size, size) / 2 - 8;

  function polarToCartesian(cx, cy, r, angle) {
    return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)];
  }

  function pathForSlice(s) {
    const [x1, y1] = polarToCartesian(cx, cy, radius, s.startAngle);
    const [x2, y2] = polarToCartesian(cx, cy, radius, s.endAngle);
    const large = (s.endAngle - s.startAngle) > Math.PI ? 1 : 0;
    return `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${large} 1 ${x2} ${y2} Z`;
  }

  function handleKey(e, id) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onHighlight(id);
    }
    if (e.key === 'Escape') onHighlight(null);
  }

  return (
    <div className="center" role="group" aria-label="Gráfico de responsabilidade">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        role="img"
        aria-label="Gráfico de torta mostrando distribuição de responsabilidade"
        style={{ transition: 'all .24s ease' }}
      >
        <title>Torta da responsabilidade</title>
        <circle cx={cx} cy={cy} r={radius} fill="transparent" />
        {slices.map((s) => {
          const isHighlighted = highlighted === s.id;
          return (
            <path
              key={s.id}
              d={pathForSlice(s)}
              fill={s.color}
              stroke="#fff"
              strokeWidth={isHighlighted ? 2.4 : 1}
              opacity={highlighted && !isHighlighted ? 0.45 : 1}
              onMouseEnter={() => onHighlight(s.id)}
              onMouseLeave={() => onHighlight(null)}
              onFocus={() => onHighlight(s.id)}
              onBlur={() => onHighlight(null)}
              onKeyDown={(e) => handleKey(e, s.id)}
              tabIndex={0}
              role="button"
              aria-label={`${s.name}: ${s.percent}%`}
              style={{ transition: 'transform .18s ease, opacity .18s ease' }}
            />
          );
        })}
      </svg>

      <div className="legend" style={{ width: '100%', maxWidth: 340, marginTop: 12 }}>
        {slices.map((s) => (
          <div
            key={s.id}
            className="legend-item"
            onClick={() => onHighlight(s.id)}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onHighlight(s.id); } }}
            tabIndex={0}
            role="button"
            aria-pressed={highlighted === s.id}
            style={{ opacity: highlighted && highlighted !== s.id ? 0.6 : 1 }}
          >
            <span className="legend-swatch" style={{ background: s.color }} aria-hidden="true" />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="name" style={{ fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.name}</div>
              <div className="small-muted" style={{ fontSize: 13 }}>{s.percent}%</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
