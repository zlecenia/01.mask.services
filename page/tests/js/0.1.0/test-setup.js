import { beforeEach } from 'vitest'

// Mock global Vue for components that expect it
global.Vue = {
  reactive: (obj) => obj,
  computed: (fn) => ({ value: typeof fn === 'function' ? fn() : fn }),
  onMounted: (fn) => typeof fn === 'function' ? fn() : undefined,
  inject: (key) => null
}

beforeEach(() => {
  // Clear any existing mocks
  if (typeof localStorage !== 'undefined') {
    localStorage.clear()
  }
})
