// src/hooks/useTortaReducer.js
import { useReducer } from 'react'

let idCounter = 0
function genId() {
  idCounter += 1
  return `${Date.now().toString(36)}-${idCounter}`
}

export const initialState = {
  event: '',
  notes: '',
  factors: [{ id: genId(), name: '', value: '' }],
  isExporting: false,
  highlighted: null
}

export function reducer(state, action) {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value }

    case 'ADD_FACTOR': {
      const f = { id: genId(), name: '', value: '' }
      return { ...state, factors: [...state.factors, f] }
    }

    case 'REMOVE_FACTOR':
      return { ...state, factors: state.factors.filter(f => f.id !== action.id) }

    case 'UPDATE_FACTOR': {
      const factors = state.factors.map(f =>
        f.id === action.id ? { ...f, [action.field]: action.value } : f
      )
      return { ...state, factors }
    }

    case 'RESET':
      return initialState

    case 'SET_EXPORTING':
      return { ...state, isExporting: action.value }

    case 'HIGHLIGHT':
      return { ...state, highlighted: action.id }

    case 'SET_FACTORS':
      return { ...state, factors: action.factors }

    default:
      return state
  }
}

export function useTortaReducer() {
  return useReducer(reducer, initialState)
}
