import type { CSSProperties, ElementType, HTMLAttributes, ReactNode } from 'react'
import type { Theme, ThemeInput } from './index'

export interface ThemeProviderProps {
  children?: ReactNode
  /** The themes to offer. Default: all of them. */
  themes?: Theme[]
  /** A theme id, or 'system' to follow the OS light/dark setting. Default 'system'. */
  defaultTheme?: string
  /** Theme used for dark mode when following the system. Default 'midnight'. */
  dark?: ThemeInput
  /** Theme used for light mode when following the system. Default 'daylight'. */
  light?: ThemeInput
  /** localStorage key. Default 'tonekit-theme'. */
  storageKey?: string
  /** Remember the choice across visits. Default true. */
  persist?: boolean
  /** CSS variable prefix. Default 'theme'. */
  prefix?: string
}
export declare function ThemeProvider(props: ThemeProviderProps): JSX.Element

export interface ThemeContextValue {
  /** The chosen theme (what 'system' resolves to, when following the OS). */
  theme: Theme
  /** What the page shows right now: the chosen theme, or one being previewed. */
  shownTheme: Theme
  themeId: string
  /** A theme id, or 'system'. */
  choice: string
  followSystem: boolean
  themes: Theme[]
  /** Pick a theme id, or 'system'. Saved when persist is on. */
  setTheme(id: string): void
  /** Show a theme without choosing it; endPreview() goes back. */
  preview(id: string | null): void
  endPreview(): void
}
export declare function useTheme(): ThemeContextValue

export interface ThemePickerProps {
  /** Accessible name and button label prefix. Default 'Theme'. */
  label?: string
  /** Default 'Match system'. */
  systemLabel?: string
  /** Show the follow-the-system option. Default true. */
  showSystem?: boolean
  /** Which side of the button the menu lines up with. Default 'end'. */
  align?: 'start' | 'end'
  className?: string
}
export declare function ThemePicker(props: ThemePickerProps): JSX.Element

export type ThemeScopeProps = HTMLAttributes<HTMLElement> & {
  theme: ThemeInput
  /** Element to render. Default 'div'. */
  as?: ElementType
  prefix?: string
  /** Skip the default background and text colour. */
  bare?: boolean
  style?: CSSProperties
}
/** Renders its children in another theme, whatever the page uses. */
export declare function ThemeScope(props: ThemeScopeProps): JSX.Element

export declare function ThemeSwatch(props: { theme: ThemeInput; size?: number; style?: CSSProperties } & HTMLAttributes<HTMLSpanElement>): JSX.Element
