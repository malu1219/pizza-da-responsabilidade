// src/components/ExportControls.jsx
import React from 'react';
import html2canvas from 'html2canvas';

export default function ExportControls({ chartRef, eventText = '', notesText = '', isExporting = false, setExporting = () => {} }) {
  async function prepareAndCapture(wrapperEl) {
    await new Promise((r) => setTimeout(r, 120));
    const canvas = await html2canvas(wrapperEl, { backgroundColor: '#fff', scale: 2, useCORS: true });
    return canvas;
  }

  async function exportAsPng() {
    if (!chartRef.current) return alert('Gráfico não encontrado.');
    try {
      setExporting(true);
      const el = chartRef.current;
      const clone = el.cloneNode(true);

      const wrapper = document.createElement('div');
      wrapper.className = 'export-wrapper';
      wrapper.style.position = 'fixed';
      wrapper.style.left = '-9999px';
      wrapper.style.top = '0';
      wrapper.style.fontFamily = getComputedStyle(document.body).fontFamily || 'sans-serif';

      const title = document.createElement('div');
      title.textContent = eventText || 'Torta da responsabilidade';
      title.style.fontFamily = '"Playfair Display", serif';
      title.style.fontSize = '20px';
      title.style.fontWeight = '700';
      title.style.marginBottom = '10px';
      title.style.textAlign = 'center';

      wrapper.appendChild(title);
      wrapper.appendChild(clone);

      const notes = document.createElement('div');
      notes.textContent = notesText || '';
      notes.style.marginTop = '10px';
      notes.style.fontSize = '13px';
      notes.style.color = '#333';
      notes.style.textAlign = 'center';
      wrapper.appendChild(notes);

      document.body.appendChild(wrapper);
      const canvas = await prepareAndCapture(wrapper);

      const link = document.createElement('a');
      link.download = 'torta.png';
      link.href = canvas.toDataURL('image/png');
      link.click();

      document.body.removeChild(wrapper);
    } catch (err) {
      console.error(err);
      alert('Erro ao exportar imagem');
    } finally {
      setExporting(false);
    }
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <button
        className="btn btn-primary"
        onClick={exportAsPng}
        disabled={isExporting}
        aria-disabled={isExporting}
        title="Baixar imagem PNG da torta"
      >
        {isExporting ? 'Exportando...' : 'Salvar como PNG'}
      </button>
    </div>
  );
}
