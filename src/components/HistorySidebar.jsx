import React from 'react'


export default function HistorySidebar({ history = [], onLoad }) {
return (
<div className="card-soft">
<h3 className="text-sm font-semibold text-gray-700">Histórico</h3>
{history.length === 0 ? (
<p className="text-sm text-gray-500 mt-3">Nenhuma torta salva ainda</p>
) : (
<ul className="mt-3 space-y-3">
{history.map(h => (
<li key={h.id} className="flex items-start justify-between gap-3">
<div className="flex-1">
<div className="text-sm font-medium text-gray-800 truncate">{h.event || 'Sem título'}</div>
<div className="text-xs text-gray-500">{new Date(h.createdAt).toLocaleString()}</div>
</div>
<div className="flex items-center gap-2">
<button onClick={() => onLoad(h)} className="px-3 py-1 rounded-lg border border-gray-200 text-sm">Carregar</button>
</div>
</li>
))}
</ul>
)}
</div>
)
}