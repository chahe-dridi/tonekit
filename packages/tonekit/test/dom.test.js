// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest'
import { applyTheme, loadTheme, noFlashScript, resolveTheme, saveTheme } from '../src/index.js'

beforeEach(() => {
  localStorage.clear()
  document.documentElement.removeAttribute('style')
  document.documentElement.className = ''
  window.matchMedia = () => ({ matches: false, addEventListener() {}, removeEventListener() {} })
})

describe('in the browser', () => {
  it('applyTheme sets variables, data-theme, class and color-scheme', () => {
    applyTheme('catppuccin-latte')
    const root = document.documentElement
    expect(root.dataset.theme).toBe('catppuccin-latte')
    expect(root.classList.contains('light')).toBe(true)
    expect(root.style.getPropertyValue('--theme-bg')).toBe('#eff1f5')
  })

  it('saves and restores a choice, and follows the system otherwise', () => {
    expect(resolveTheme().id).toBe('midnight')
    saveTheme('nord')
    expect(loadTheme()).toBe('nord')
    expect(resolveTheme().id).toBe('nord')
    saveTheme('system')
    expect(loadTheme()).toBe('system')
  })

  it('the no-flash script applies the saved theme', () => {
    saveTheme('gruvbox')
    // run it the way a <script> tag would
    const script = document.createElement('script')
    script.textContent = noFlashScript()
    document.head.appendChild(script)
    new Function(script.textContent)() // jsdom does not execute appended scripts by default
    expect(document.documentElement.dataset.theme).toBe('gruvbox')
    expect(document.documentElement.style.getPropertyValue('--theme-bg')).toBe('#282828')
  })
})
