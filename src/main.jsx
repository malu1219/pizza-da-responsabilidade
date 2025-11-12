import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'

export default function TailwindTest() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-600 to-blue-500 text-white">
      <h1 className="text-4xl font-bold mb-4">✅ Tailwind está funcionando!</h1>
      <p className="text-lg">Se você vê um fundo azul em degradê e texto branco, está tudo certo.</p>
      <button className="mt-6 px-4 py-2 bg-white text-indigo-600 font-semibold rounded-md shadow hover:bg-indigo-100 transition">
        Botão de teste
      </button>
    </div>
  )
}

createRoot(document.getElementById('root')).render(
<React.StrictMode>
<App />
</React.StrictMode>
)