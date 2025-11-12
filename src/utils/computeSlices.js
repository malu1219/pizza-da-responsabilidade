// src/utils/computeSlices.js
export function computeSlices(factors) {
  // factors: [{id, name, value}]
  // returns slices with startAngle, endAngle, percent, color
  const colors = [
    '#3f7d5a', '#7fa380', '#b2c7a3', '#e0e5d9', '#a7c4a0',
    '#5b745e', '#96b197', '#ccd7ca', '#7d9277', '#9ab79f'
  ]

  const slices = []
  let start = -Math.PI / 2 // start at top

  for (let i = 0; i < factors.length; i++) {
    const f = factors[i]
    const p = Math.max(0, Math.min(100, Number(f.value) || 0))
    const angle = (p / 100) * Math.PI * 2
    const slice = {
      id: f.id,
      name: f.name || 'Sem nome',
      percent: p,
      startAngle: start,
      endAngle: start + angle,
      color: colors[i % colors.length]
    }
    slices.push(slice)
    start += angle
  }

  return slices
}
