// src/App.jsx
import React, { useMemo, useRef } from "react";
import "./index.css";
import { useTortaReducer } from "./hooks/useTortaReducer";
import FactorsList from "./components/FactorsList";
import ResponsibilityChart from "./components/ResponsibilityChart";
import ExportControls from "./components/ExportControls";
import { computeSlices } from "./utils/computeSlices";

export default function App() {
  const [state, dispatch] = useTortaReducer();
  const chartRef = useRef(null);

  const factorsFilled = useMemo(() => {
    return state.factors.map((f) => ({ ...f, value: f.value === "" ? 0 : Number(f.value) }));
  }, [state.factors]);

  const total = useMemo(() => {
    return factorsFilled.reduce((s, f) => s + Number(f.value || 0), 0);
  }, [factorsFilled]);

  const slices = useMemo(() => computeSlices(factorsFilled), [factorsFilled]);

  function setField(field, value) {
    dispatch({ type: "SET_FIELD", field, value });
  }

  function assignToEu() {
    const remainder = 100 - total;
    if (remainder === 0) return;
    const eu = state.factors.find((f) => (f.name || "").toLowerCase() === "eu");
    if (eu) {
      dispatch({
        type: "UPDATE_FACTOR",
        id: eu.id,
        field: "value",
        value: String(Math.max(0, Number(eu.value || 0) + remainder)),
      });
    } else {
      const newFactors = [
        ...state.factors,
        { id: `eu-${Date.now()}`, name: "Eu", value: String(Math.max(0, remainder)) },
      ];
      dispatch({ type: "SET_FACTORS", factors: newFactors });
    }
  }

  // NOTE: a função normalizeTo100 foi removida conforme pedido.
  // se quiser reapresentar futuramente, podemos reintroduzir

  function highlight(id) {
    dispatch({ type: "HIGHLIGHT", id });
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ padding: "2rem 1rem" }}>
      <div className="container">
        <header className="card header" style={{ marginBottom: 16 }}>
          <div style={{ textAlign: "center" }}>
            <div className="header-title">Pizza da Responsabilidade</div>
            <div className="lead">
              Distribua os percentuais de responsabilidade pelos fatores envolvidos em um evento.  
              O objetivo é visualizar o quanto realmente está sob seu controle.
            </div>
          </div>
        </header>

        <div className="grid-2">
          <div>
            <section className="card" style={{ marginBottom: 12 }}>
              <label htmlFor="event" style={{ fontWeight: 600 }}>Descreva o evento</label>
              <textarea
                id="event"
                className="input"
                rows={2}
                value={state.event}
                onChange={(e) => setField("event", e.target.value)}
                placeholder="Descreva brevemente o evento"
              />
            </section>

            <section className="card" style={{ marginBottom: 12 }}>
              <h2 style={{ fontWeight: 700, marginBottom: 12 }}>Fatores / Pessoas envolvidas</h2>
              <div style={{ marginBottom: 10, color: 'var(--muted)' }}>
                Dica: deixar você por último
              </div>

              <FactorsList factors={state.factors} dispatch={dispatch} />

              <div style={{ marginTop: 12 }} className="helper">
                <div>
                  Total: <strong>{total}%</strong>{" "}
                  {total !== 100 && <span className="text-danger">(a soma deve ser 100%)</span>}
                </div>

                {total !== 100 && (
                  <div style={{ marginTop: 8 }}>
                    <button className="btn btn-secondary" onClick={assignToEu} style={{ marginRight: 8 }} title="Atribuir o restante para 'Eu'">
                      Atribuir restante a "Eu"
                    </button>

                    {/* botão 'Normalizar automaticamente' removido conforme solicitado */}
                  </div>
                )}
              </div>
            </section>

            <section className="card">
              <label style={{ fontWeight: 600 }}>Reflexão</label>
              <textarea
                className="input"
                rows={2}
                value={state.notes}
                onChange={(e) => setField('notes', e.target.value)}
                placeholder="O que é realmente minha responsabilidade?"
              />
              <div style={{ marginTop: 10 }}>
                <button className="btn btn-secondary" onClick={() => dispatch({ type: "RESET" })}>
                  Nova torta
                </button>
              </div>
            </section>
          </div>

          <aside className="card center" style={{ position: "relative" }}>
            <div ref={chartRef} style={{ textAlign: "center", width: "100%" }}>
              {total > 0 ? (
                <>
                  <ResponsibilityChart
                    factors={factorsFilled}
                    highlighted={state.highlighted}
                    onHighlight={highlight}
                    size={320}
                  />

                  <div className="small-muted" style={{ marginTop: 10, textAlign: "center" }}>
                    {state.event || "Responsabilidade distribuída"}
                  </div>

                  <div style={{ marginTop: 12 }}>
                    <ExportControls
                      chartRef={chartRef}
                      eventText={state.event}
                      notesText={state.notes}
                      isExporting={state.isExporting}
                      setExporting={(v) => dispatch({ type: "SET_EXPORTING", value: v })}
                    />
                  </div>
                </>
              ) : (
                <div className="small-muted">Insira os fatores e ajuste as porcentagens</div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
