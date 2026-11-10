const STORAGE_KEY = 'chiku-state-v1'

export type BottleConfig = {
  size: string
  name: string
  color: string
  fragrance: string
  refill: boolean
}

export type CartItem = {
  formulaId: number
  bottle: BottleConfig
  quantity: number
  price: number
}

export type ChikuState = {
  answers: Record<string, string | string[]>
  formulaId: number | null
  bottle: BottleConfig | null
  cart: CartItem[]
  user: { email: string } | null
}

export const defaultBottle: BottleConfig = {
  size: '200 ml',
  name: '',
  color: '#e8d2b5',
  fragrance: 'Nimbu, Naturally',
  refill: false,
}

export const initialState: ChikuState = {
  answers: {},
  formulaId: null,
  bottle: null,
  cart: [],
  user: null,
}

export function loadState(): ChikuState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) return initialState
    const parsed = JSON.parse(saved) as Partial<ChikuState>
    return {
      ...initialState,
      ...parsed,
      answers: parsed.answers ?? {},
      cart: parsed.cart ?? [],
    }
  } catch (error) {
    console.error('Unable to read Chiku data from local storage.', error)
    return initialState
  }
}

export function saveState(state: ChikuState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch (error) {
    console.error('Unable to save Chiku data to local storage.', error)
  }
}
