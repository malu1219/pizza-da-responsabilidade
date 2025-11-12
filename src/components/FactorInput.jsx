// src/components/FactorInput.jsx
import React from 'react';

export default function FactorInput({
  factor = { id: '', name: '', value: '' },
  onChange = () => {},
  onRemove = () => {},
  disableRemove = false,
  focusRef = null
}) {
  // defensive defaults: factor may be undefined on broken imports
  const id = factor && factor.id ? factor.id : '';

  function handleName(e) {
    onChange(id, 'name', e.target.value);
  }

  function handleValue(e) {
    let v = e.target.value;
    if (v === '') return onChange(id, 'value', '');
    // strip non-digits
    v = String(v).replace(/[^0-9]/g, '');
    let n = parseInt(v, 10);
    if (Number.isNaN(n)) n = '';
    if (n !== '') {
      if (n < 0) n = 0;
      if (n > 100) n = 100;
    }
    onChange(id, 'value', n === '' ? '' : String(n));
  }

  return (
    <div className="factor-row card" style={{ padding: '0.6rem' }}>
      <label style={{ display: 'none' }} htmlFor={`name-${id}`}>Nome do fator</label>
      <input
        id={`name-${id}`}
        className="input"
        placeholder="Ex: Colega, situação externa..."
        value={factor.name ?? ''}
        onChange={handleName}
        ref={focusRef}
        aria-label={`Nome do fator ${factor.name ?? ''}`}
      />

      <label style={{ display: 'none' }} htmlFor={`value-${id}`}>Percentual</label>
      <input
        id={`value-${id}`}
        className="input percent"
        type="number"
        min="0"
        max="100"
        value={factor.value ?? ''}
        onChange={handleValue}
        placeholder="%"
        aria-label={`Percentual do fator ${factor.name ?? ''}`}
      />

      <button
        onClick={() => onRemove(id)}
        className="btn btn-secondary"
        style={{ padding: '0.4rem' }}
        aria-disabled={disableRemove}
        disabled={disableRemove}
      >
        Remover
      </button>
    </div>
  );
}
