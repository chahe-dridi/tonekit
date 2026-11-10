export type Mode = 'dark' | 'light'

export type Token =
  | 'bg' | 'bgAlt' | 'surface' | 'surfaceAlt' | 'border'
  | 'text' | 'textMuted' | 'textSubtle'
  | 'primary' | 'accent'
  | 'success' | 'warning' | 'danger'

export type ThemeId =
  | 'midnight' | 'daylight' | 'retro-82' | 'ristretto' | 'rose-pine' | 'solitude' | 'tokyo-night' | 'vantablack'
  | 'catppuccin' | 'ethereal' | 'everforest' | 'gruvbox' | 'hackerman' | 'kanagawa' | 'last-horizon' | 'lumon'
  | 'matte-black' | 'miasma' | 'nord' | 'osaka-jade' | 'catppuccin-latte' | 'flexoki-light' | 'lupine'

export type Tag = 'cool' | 'warm' | 'neutral' | 'pastel' | 'vivid' | 'minimal' | 'nature' | 'retro' | 'high-contrast'

export interface Theme {
  id: string
  name: string
  mode: Mode
  tags: string[]
  /** Set when the palette follows a published theme. */
  credit?: { name: string; url: string }
  /** 13 hex colours. */
  colors: Record<Token, string>
}

/** A built-in theme id, or a theme object (e.g. from defineTheme). */
export type ThemeInput = ThemeId | Theme | (string & {})

export declare const themes: Theme[]
export default themes
export declare const themesById: Record<string, Theme>
export declare const TAGS: Tag[]
export declare const DEFAULT_DARK: ThemeId
export declare const DEFAULT_LIGHT: ThemeId

/** The 13 tokens, in display order. */
export declare const TOKENS: Token[]
/** textMuted → 'text-muted' */
export declare function tokenToVar(token: Token): string
/** A theme by id (throws on unknown ids), or the object you pass. */
export declare function getTheme(theme: ThemeInput): Theme
/** Your own theme. Missing colours come from `base`; every colour must be hex. */
export declare function defineTheme(options: {
  id: string
  name?: string
  mode?: Mode
  colors?: Partial<Record<Token, string>>
  base?: ThemeInput
  tags?: string[]
  credit?: { name: string; url: string }
}): Theme

export interface VarOptions {
  /** Variable prefix. Default 'theme' (--theme-bg). */
  prefix?: string
}
/** --theme-bg … --theme-danger, --theme-on-primary and --theme-*-rgb triples. */
export declare function themeToVars(theme: ThemeInput, options?: VarOptions): Record<string, string>
/** One theme as a CSS rule; selector defaults to [data-theme="<id>"]. */
export declare function themeToCss(theme: ThemeInput, options?: VarOptions & { selector?: string }): string
/** Many themes (all by default) as one stylesheet. */
export declare function themesToCss(list?: Theme[], options?: VarOptions): string

export interface ContrastResult {
  fg: Token | 'onPrimary'
  bg: Token
  min: number
  label: string
  ratio: number
  pass: boolean
}
export declare const CONTRAST_CHECKS: [Token, Token, number, string][]
/** Every contrast target with its ratio; `pass` when all meet them. */
export declare function checkTheme(theme: ThemeInput): { pass: boolean; results: ContrastResult[] }

export declare function hexToRgb(hex: string): [number, number, number]
export declare function rgbToHex(rgb: [number, number, number]): string
export declare function luminance(hex: string): number
/** WCAG contrast ratio, 1 to 21. */
export declare function contrast(a: string, b: string): number
/** Near-black or white, whichever reads better on the colour. */
export declare function readableOn(hex: string): string
/** weight 0 → a, 1 → b */
export declare function mix(a: string, b: string, weight: number): string
/** '#3b82f6' → '59, 130, 246' */
export declare function rgbTriple(hex: string): string
export declare function isHex(value: unknown): boolean

export declare const DEFAULT_STORAGE_KEY: string
/** The OS setting ('dark' outside a browser). */
export declare function systemMode(): Mode
/** Sets the variables, data-theme, a dark/light class and color-scheme (on <html> by default). */
export declare function applyTheme(theme: ThemeInput, options?: VarOptions & { root?: HTMLElement }): Theme
/** Remember a theme, or 'system' to follow the OS. */
export declare function saveTheme(theme: ThemeInput | 'system', options?: VarOptions & { storageKey?: string }): void
/** The saved theme id, 'system', or null. */
export declare function loadTheme(options?: { storageKey?: string }): string | null
/** The saved theme, else the default for the OS mode. */
export declare function resolveTheme(options?: { storageKey?: string; dark?: ThemeInput; light?: ThemeInput; themes?: Theme[] }): Theme
/** Inline <head> script that applies the saved theme before first paint. */
export declare function noFlashScript(options?: VarOptions & { storageKey?: string; dark?: ThemeInput; light?: ThemeInput }): string
