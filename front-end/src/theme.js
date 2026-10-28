import { alpha, createTheme, responsiveFontSizes } from '@mui/material/styles';

export const GOLD = '#F59E0B';       // Radiant Amber Gold
export const GOLD_LIGHT = '#FBBF24'; // Luminous Sunlit Gold
export const GOLD_DARK = '#D97706';  // Deep Rich Gold
export const NOIR_BG = '#080B11';    // Ultra-deep obsidian black canvas
export const NOIR_CARD = '#111622';  // Sleek dark obsidian card
export const NOIR_SURFACE = '#161B29'; // Slightly elevated surface
export const NOIR_MUTED = '#0D111A'; // Dark section contrast

const headingFont = '"Playfair Display", Georgia, serif';

let theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#FFFFFF',
      dark: '#E2E8F0',
      light: '#FFFFFF',
      contrastText: NOIR_BG,
    },
    secondary: {
      main: GOLD,
      dark: GOLD_DARK,
      light: GOLD_LIGHT,
      contrastText: '#080B11',
    },
    background: {
      default: NOIR_BG,
      paper: NOIR_CARD,
    },
    text: {
      primary: '#F8FAFC',
      secondary: '#94A3B8',
    },
    divider: 'rgba(255, 255, 255, 0.08)',
    success: { main: '#10B981', light: '#34D399' },
    error: { main: '#EF4444', light: '#F87171' },
    warning: { main: '#F59E0B', light: '#FCD34D' },
  },
  shape: { borderRadius: 16 },
  typography: {
    fontFamily: '"Inter", "Helvetica Neue", Arial, sans-serif',
    h1: { fontFamily: headingFont, fontWeight: 700, letterSpacing: '-0.025em' },
    h2: { fontFamily: headingFont, fontWeight: 700, letterSpacing: '-0.02em' },
    h3: { fontFamily: headingFont, fontWeight: 600, letterSpacing: '-0.015em' },
    h4: { fontFamily: headingFont, fontWeight: 600, letterSpacing: '-0.01em' },
    h5: { fontFamily: headingFont, fontWeight: 600 },
    h6: { fontWeight: 600 },
    overline: { fontWeight: 700, letterSpacing: '0.15em', fontSize: '0.75rem', color: GOLD },
    button: { textTransform: 'none', fontWeight: 600, letterSpacing: '0.01em' },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: { scrollBehavior: 'smooth' },
        body: {
          WebkitFontSmoothing: 'antialiased',
          backgroundColor: NOIR_BG,
          color: '#F8FAFC',
        },
        ':focus-visible': { outline: `2px solid ${GOLD}`, outlineOffset: 2 },
        '@media (prefers-reduced-motion: reduce)': {
          html: { scrollBehavior: 'auto' },
          '*, *::before, *::after': { animationDuration: '0.01ms !important', transitionDuration: '0.01ms !important' },
        },
        img: { display: 'block', maxWidth: '100%' },
        '::selection': { background: alpha(GOLD, 0.35), color: '#FFFFFF' },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          borderRadius: 999,
          paddingInline: 22,
          transition: 'all 0.25s cubic-bezier(0.2, 0.8, 0.2, 1)',
        },
        sizeLarge: { paddingBlock: 12, paddingInline: 30, fontSize: '1rem' },
        containedPrimary: {
          backgroundColor: '#FFFFFF',
          color: '#080B11',
          fontWeight: 700,
          '&:hover': {
            backgroundColor: '#F1F5F9',
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 25px rgba(255, 255, 255, 0.25)',
          },
        },
        containedSecondary: {
          background: `linear-gradient(135deg, ${GOLD} 0%, ${GOLD_DARK} 100%)`,
          color: '#080B11',
          fontWeight: 700,
          boxShadow: '0 4px 18px rgba(245, 158, 11, 0.35)',
          '&:hover': {
            background: `linear-gradient(135deg, ${GOLD_LIGHT} 0%, ${GOLD} 100%)`,
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 26px rgba(245, 158, 11, 0.55)',
          },
        },
        outlinedPrimary: {
          borderColor: 'rgba(255, 255, 255, 0.2)',
          color: '#F8FAFC',
          '&:hover': {
            borderColor: GOLD,
            backgroundColor: 'rgba(245, 158, 11, 0.08)',
            color: GOLD_LIGHT,
          },
        },
      },
    },
    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: 20,
          backgroundColor: NOIR_CARD,
          color: '#F8FAFC',
          transition: 'transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.35s cubic-bezier(0.2, 0.8, 0.2, 1), border-color 0.35s ease',
          '&:hover': {
            borderColor: 'rgba(245, 158, 11, 0.3)',
            boxShadow: '0 20px 45px -12px rgba(0, 0, 0, 0.8), 0 0 25px -5px rgba(245, 158, 11, 0.15)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
        rounded: { borderRadius: 16 },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: NOIR_CARD,
          borderRadius: 24,
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 30px 80px -10px rgba(0, 0, 0, 0.95), 0 0 45px -10px rgba(245, 158, 11, 0.18)',
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundColor: NOIR_CARD,
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 15px 45px rgba(0, 0, 0, 0.85)',
          borderRadius: 14,
        },
      },
    },
    MuiTextField: { defaultProps: { fullWidth: true } },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundColor: 'rgba(255, 255, 255, 0.04)',
          color: '#F8FAFC',
          '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.12)' },
          '&:hover fieldset': { borderColor: 'rgba(245, 158, 11, 0.5)' },
          '&.Mui-focused fieldset': { borderColor: GOLD, borderWidth: 2 },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          borderRadius: 999,
          border: '1px solid rgba(255, 255, 255, 0.08)',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '0.95rem',
          color: '#94A3B8',
          '&.Mui-selected': {
            color: GOLD_LIGHT,
          },
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: 'rgba(255, 255, 255, 0.08)',
        },
      },
    },
    MuiTooltip: { defaultProps: { arrow: true } },
  },
});

theme = responsiveFontSizes(theme);
export default theme;
