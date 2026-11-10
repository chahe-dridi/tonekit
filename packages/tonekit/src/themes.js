/**
 * The themes. Every theme has the same shape, so any of them can drive any UI:
 *
 *   id      kebab-case key, used in storage and as <html data-theme="…">
 *   name    display name
 *   mode    'dark' | 'light'
 *   tags    mood keywords for filtering (see TAGS)
 *   credit  { name, url } when the palette follows a published theme
 *   colors  13 semantic tokens, all hex:
 *     bg          page background
 *     bgAlt       alternate section background
 *     surface     cards, panels, inputs
 *     surfaceAlt  raised / hovered surfaces, chips
 *     border      hairlines and outlines
 *     text        body text and headings          (≥ 7:1 on bg)
 *     textMuted   secondary text                  (≥ 4.5:1 on bg and surface)
 *     textSubtle  captions, placeholders          (≥ 3:1 on bg)
 *     primary     links, active states, buttons   (≥ 4.5:1 on bg)
 *     accent      second brand colour, highlights (≥ 3:1 on bg)
 *     success, warning, danger   status colours
 *
 * Text drawn on top of `primary` is not stored: readableOn() picks black or
 * white, whichever contrasts more. checkTheme() verifies the targets above,
 * and the test suite runs it on every theme.
 */

const themes = [
  // ── tonekit's own defaults ─────────────────────────────────────────────
  {
    id: 'midnight',
    name: 'Midnight',
    mode: 'dark',
    tags: ['cool', 'vivid'],
    colors: {
      bg: '#0a0a0f', bgAlt: '#11131a', surface: '#151821', surfaceAlt: '#1e2230', border: '#2a3042',
      text: '#f5f7fb', textMuted: '#b6bfcf', textSubtle: '#7c8699',
      primary: '#3b82f6', accent: '#06b6d4',
      success: '#10b981', warning: '#f59e0b', danger: '#ef4444',
    },
  },
  {
    id: 'daylight',
    name: 'Daylight',
    mode: 'light',
    tags: ['cool', 'minimal'],
    colors: {
      bg: '#ffffff', bgAlt: '#f8fafc', surface: '#ffffff', surfaceAlt: '#f1f5f9', border: '#e2e8f0',
      text: '#1e293b', textMuted: '#475569', textSubtle: '#64748b',
      primary: '#2563eb', accent: '#0891b2',
      success: '#059669', warning: '#b45309', danger: '#dc2626',
    },
  },

  // ── Dark themes ───────────────────────────────────────────────────────
  {
    id: 'retro-82',
    name: 'Retro 82',
    mode: 'dark',
    tags: ['retro', 'vivid'],
    colors: {
      bg: '#110d24', bgAlt: '#17112f', surface: '#1d1538', surfaceAlt: '#271c4a', border: '#3a2b66',
      text: '#f4eefe', textMuted: '#c3b5e8', textSubtle: '#8f7fbf',
      primary: '#ff4fa3', accent: '#2de2e6',
      success: '#7cf29a', warning: '#ffb347', danger: '#ff5c6c',
    },
  },
  {
    id: 'ristretto',
    name: 'Ristretto',
    mode: 'dark',
    tags: ['warm', 'retro'],
    credit: { name: 'Monokai Pro (Ristretto)', url: 'https://monokai.pro' },
    colors: {
      bg: '#2c2525', bgAlt: '#272121', surface: '#352d2d', surfaceAlt: '#403838', border: '#5b5353',
      text: '#fff1f3', textMuted: '#c3b7b8', textSubtle: '#948a8b',
      primary: '#f9cc6c', accent: '#fd6883',
      success: '#adda78', warning: '#f38d70', danger: '#fd6883',
    },
  },
  {
    id: 'rose-pine',
    name: 'Rosé Pine',
    mode: 'dark',
    tags: ['pastel', 'warm'],
    credit: { name: 'Rosé Pine', url: 'https://rosepinetheme.com' },
    colors: {
      bg: '#191724', bgAlt: '#1f1d2e', surface: '#1f1d2e', surfaceAlt: '#26233a', border: '#403d52',
      text: '#e0def4', textMuted: '#908caa', textSubtle: '#6e6a86',
      primary: '#c4a7e7', accent: '#ebbcba',
      success: '#9ccfd8', warning: '#f6c177', danger: '#eb6f92',
    },
  },
  {
    id: 'solitude',
    name: 'Solitude',
    mode: 'dark',
    tags: ['minimal', 'neutral'],
    colors: {
      bg: '#16181d', bgAlt: '#1b1e24', surface: '#20242b', surfaceAlt: '#2a2f38', border: '#363c47',
      text: '#d8dbe0', textMuted: '#a3a9b4', textSubtle: '#737a87',
      primary: '#9fb4c7', accent: '#c7b99f',
      success: '#9bb89a', warning: '#d4b483', danger: '#c98a8a',
    },
  },
  {
    id: 'tokyo-night',
    name: 'Tokyo Night',
    mode: 'dark',
    tags: ['cool', 'vivid'],
    credit: { name: 'Tokyo Night', url: 'https://github.com/folke/tokyonight.nvim' },
    colors: {
      bg: '#1a1b26', bgAlt: '#16161e', surface: '#1f2335', surfaceAlt: '#292e42', border: '#3b4261',
      text: '#c0caf5', textMuted: '#a9b1d6', textSubtle: '#737aa2',
      primary: '#7aa2f7', accent: '#bb9af7',
      success: '#9ece6a', warning: '#e0af68', danger: '#f7768e',
    },
  },
  {
    id: 'vantablack',
    name: 'Vantablack',
    mode: 'dark',
    tags: ['minimal', 'neutral', 'high-contrast'],
    colors: {
      bg: '#000000', bgAlt: '#050505', surface: '#0c0c0c', surfaceAlt: '#161616', border: '#262626',
      text: '#f2f2f2', textMuted: '#a6a6a6', textSubtle: '#6e6e6e',
      primary: '#e6e6e6', accent: '#8a8a8a',
      success: '#9fd8a4', warning: '#e0c48a', danger: '#e58a8a',
    },
  },
  {
    id: 'catppuccin',
    name: 'Catppuccin',
    mode: 'dark',
    tags: ['pastel', 'cool'],
    credit: { name: 'Catppuccin (Mocha)', url: 'https://catppuccin.com' },
    colors: {
      bg: '#1e1e2e', bgAlt: '#181825', surface: '#262637', surfaceAlt: '#313244', border: '#45475a',
      text: '#cdd6f4', textMuted: '#bac2de', textSubtle: '#7f849c',
      primary: '#cba6f7', accent: '#89b4fa',
      success: '#a6e3a1', warning: '#f9e2af', danger: '#f38ba8',
    },
  },
  {
    id: 'ethereal',
    name: 'Ethereal',
    mode: 'dark',
    tags: ['cool', 'pastel'],
    colors: {
      bg: '#060b1e', bgAlt: '#0a1029', surface: '#10173a', surfaceAlt: '#182150', border: '#26306a',
      text: '#ffe6d5', textMuted: '#d6b9a8', textSubtle: '#9b8a99',
      primary: '#8f94e6', accent: '#c89dc1',
      success: '#92a593', warning: '#e9bb4f', danger: '#ed5b5a',
    },
  },
  {
    id: 'everforest',
    name: 'Everforest',
    mode: 'dark',
    tags: ['nature', 'warm'],
    credit: { name: 'Everforest', url: 'https://github.com/sainnhe/everforest' },
    colors: {
      bg: '#2d353b', bgAlt: '#272e33', surface: '#343f44', surfaceAlt: '#3d484d', border: '#475258',
      text: '#d3c6aa', textMuted: '#b8b59c', textSubtle: '#859289',
      primary: '#a7c080', accent: '#7fbbb3',
      success: '#a7c080', warning: '#dbbc7f', danger: '#e67e80',
    },
  },
  {
    id: 'gruvbox',
    name: 'Gruvbox',
    mode: 'dark',
    tags: ['retro', 'warm'],
    credit: { name: 'Gruvbox', url: 'https://github.com/morhetz/gruvbox' },
    colors: {
      bg: '#282828', bgAlt: '#1d2021', surface: '#32302f', surfaceAlt: '#3c3836', border: '#504945',
      text: '#ebdbb2', textMuted: '#d5c4a1', textSubtle: '#a89984',
      primary: '#fe8019', accent: '#8ec07c',
      success: '#b8bb26', warning: '#fabd2f', danger: '#fb4934',
    },
  },
  {
    id: 'hackerman',
    name: 'Hackerman',
    mode: 'dark',
    tags: ['retro', 'vivid', 'high-contrast'],
    colors: {
      bg: '#0b0c16', bgAlt: '#080912', surface: '#11131f', surfaceAlt: '#181b2b', border: '#232742',
      text: '#ddf7ff', textMuted: '#9fb6c2', textSubtle: '#6a7d8a',
      primary: '#50f872', accent: '#7cf8f7',
      success: '#50f872', warning: '#e8e65f', danger: '#ff5f6e',
    },
  },
  {
    id: 'kanagawa',
    name: 'Kanagawa',
    mode: 'dark',
    tags: ['cool', 'pastel'],
    credit: { name: 'Kanagawa', url: 'https://github.com/rebelot/kanagawa.nvim' },
    colors: {
      bg: '#1f1f28', bgAlt: '#16161d', surface: '#2a2a37', surfaceAlt: '#363646', border: '#54546d',
      text: '#dcd7ba', textMuted: '#c8c093', textSubtle: '#8a8980',
      primary: '#7e9cd8', accent: '#d27e99',
      success: '#98bb6c', warning: '#e6c384', danger: '#e46876',
    },
  },
  {
    id: 'last-horizon',
    name: 'Last Horizon',
    mode: 'dark',
    tags: ['warm', 'vivid'],
    colors: {
      bg: '#14121b', bgAlt: '#18151f', surface: '#1f1b29', surfaceAlt: '#2a2436', border: '#3a3247',
      text: '#ece4f2', textMuted: '#b9adc6', textSubtle: '#85799a',
      primary: '#f2a25c', accent: '#8fa9e0',
      success: '#9ccf8f', warning: '#f2c35c', danger: '#e8707a',
    },
  },
  {
    id: 'lumon',
    name: 'Lumon',
    mode: 'dark',
    tags: ['cool', 'minimal'],
    colors: {
      bg: '#0c1a1f', bgAlt: '#0a161a', surface: '#12252c', surfaceAlt: '#1a323b', border: '#26444f',
      text: '#e3efe9', textMuted: '#a8c3bf', textSubtle: '#6f8f8d',
      primary: '#7fd1c7', accent: '#d9c7a0',
      success: '#8fd1a0', warning: '#e3c27a', danger: '#e08a7f',
    },
  },
  {
    id: 'matte-black',
    name: 'Matte Black',
    mode: 'dark',
    tags: ['minimal', 'warm'],
    colors: {
      bg: '#121212', bgAlt: '#0e0e0e', surface: '#1a1a1a', surfaceAlt: '#222222', border: '#333333',
      text: '#e0e0e0', textMuted: '#a8a8a8', textSubtle: '#777777',
      primary: '#e68e0d', accent: '#c0a36e',
      success: '#8fbf7a', warning: '#ffc107', danger: '#d35f5f',
    },
  },
  {
    id: 'miasma',
    name: 'Miasma',
    mode: 'dark',
    tags: ['nature', 'warm'],
    credit: { name: 'Miasma', url: 'https://github.com/xero/miasma.nvim' },
    colors: {
      bg: '#222222', bgAlt: '#1c1c1c', surface: '#2a2a28', surfaceAlt: '#333330', border: '#44443f',
      text: '#d8d6c0', textMuted: '#b5b39d', textSubtle: '#85836f',
      primary: '#c98a55', accent: '#a3ad6b',
      success: '#8fae8f', warning: '#c9a554', danger: '#c97a5a',
    },
  },
  {
    id: 'nord',
    name: 'Nord',
    mode: 'dark',
    tags: ['cool', 'minimal'],
    credit: { name: 'Nord', url: 'https://www.nordtheme.com' },
    colors: {
      bg: '#2e3440', bgAlt: '#272c36', surface: '#3b4252', surfaceAlt: '#434c5e', border: '#4c566a',
      text: '#eceff4', textMuted: '#d8dee9', textSubtle: '#a3acbd',
      primary: '#88c0d0', accent: '#81a1c1',
      success: '#a3be8c', warning: '#ebcb8b', danger: '#bf616a',
    },
  },
  {
    id: 'osaka-jade',
    name: 'Osaka Jade',
    mode: 'dark',
    tags: ['nature', 'cool'],
    colors: {
      bg: '#111c18', bgAlt: '#0d1613', surface: '#172520', surfaceAlt: '#1f312a', border: '#2b4239',
      text: '#f6f5dd', textMuted: '#c1c497', textSubtle: '#8a9a7e',
      primary: '#63b07a', accent: '#2dd5b7',
      success: '#63b07a', warning: '#e5c736', danger: '#ff5345',
    },
  },

  // ── Light themes ──────────────────────────────────────────────────────
  {
    id: 'catppuccin-latte',
    name: 'Catppuccin Latte',
    mode: 'light',
    tags: ['pastel', 'cool'],
    credit: { name: 'Catppuccin (Latte)', url: 'https://catppuccin.com' },
    colors: {
      bg: '#eff1f5', bgAlt: '#e6e9ef', surface: '#f5f6f9', surfaceAlt: '#dce0e8', border: '#ccd0da',
      text: '#4c4f69', textMuted: '#5c5f77', textSubtle: '#6c6f85',
      primary: '#8839ef', accent: '#1e66f5',
      success: '#40a02b', warning: '#df8e1d', danger: '#d20f39',
    },
  },
  {
    id: 'flexoki-light',
    name: 'Flexoki Light',
    mode: 'light',
    tags: ['warm', 'minimal'],
    credit: { name: 'Flexoki', url: 'https://stephango.com/flexoki' },
    colors: {
      bg: '#fffcf0', bgAlt: '#f2f0e5', surface: '#fffdf6', surfaceAlt: '#e6e4d9', border: '#dad8ce',
      text: '#100f0f', textMuted: '#575653', textSubtle: '#6f6e69',
      primary: '#205ea6', accent: '#24837b',
      success: '#66800b', warning: '#ad8301', danger: '#af3029',
    },
  },
  {
    id: 'lupine',
    name: 'Lupine',
    mode: 'light',
    tags: ['pastel', 'vivid'],
    colors: {
      bg: '#f6f3fb', bgAlt: '#ece6f6', surface: '#ffffff', surfaceAlt: '#e4dcf2', border: '#d4c8ea',
      text: '#2a2340', textMuted: '#4f4566', textSubtle: '#6e6488',
      primary: '#6a4fc9', accent: '#c0478a',
      success: '#3f8a4f', warning: '#a86a00', danger: '#c2343f',
    },
  },
];

export const DEFAULT_DARK = 'midnight';
export const DEFAULT_LIGHT = 'daylight';

export const themesById = Object.fromEntries(themes.map((t) => [t.id, t]));

/** Every tag used by at least one theme, in a stable order. */
export const TAGS = ['cool', 'warm', 'neutral', 'pastel', 'vivid', 'minimal', 'nature', 'retro', 'high-contrast']
  .filter((tag) => themes.some((t) => t.tags.includes(tag)));

export { themes };
export default themes;
