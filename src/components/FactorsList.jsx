// src/components/FactorsList.jsx
import React, { useRef, useEffect } from 'react';
import FactorInput from './FactorInput';

export default function FactorsList({ factors = [], dispatch = () => {} }) {
  // ensure factors is an array
  const safeFactors = Array.isArray(factors) ? factors : [];

  // refs map to focus inputs after adding
  const refs = useRef({});

  useEffect(() => {
    // cleanup stale refs
    const keys = Object.keys(refs.current);
    for (const k of keys) {
      if (!safeFactors.find(f => f.id === k)) {
        delete refs.current[k];
      }
    }
  }, [safeFactors]);

  function handleAdd() {
    dispatch({ type: 'ADD_FACTOR' });
    setTimeout(() => {
      const keys = Object.keys(refs.current);
      const last = keys[keys.length - 1];
      if (last && refs.current[last]) {
        try { refs.current[last].focus(); } catch (e) { /* ignore */ }
      }
    }, 50);
  }

  function handleChange(id, field, value) {
    dispatch({ type: 'UPDATE_FACTOR', id, field, value });
  }

  function handleRemove(id) {
    dispatch({ type: 'REMOVE_FACTOR', id });
  }

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {safeFactors.map((f) => (
          <FactorInput
            key={f.id}
            factor={f}
            onChange={handleChange}
            onRemove={handleRemove}
            disableRemove={safeFactors.length <= 1}
            focusRef={(el) => { if (el) refs.current[f.id] = el; }}
          />
        ))}
      </div>

      <div style={{ marginTop: 10 }}>
        <button className="btn btn-secondary" onClick={handleAdd}>+ Adicionar fator</button>
      </div>
    </div>
  );
}
