export const COLORS = {
  bg: '#f4efe7',
  bgSoft: '#fffaf3',
  paper: 'rgba(255, 252, 247, 0.94)',
  ink: '#1f2933',
  muted: '#5f6c7b',
  accent: '#b6452c',
  accentDark: '#822914',
  accentSoft: 'rgba(182, 69, 44, 0.12)',
  sage: '#5e7d62',
  sageLight: '#e2efda',
  white: '#ffffff',
  black: '#000000',
  red: '#e31a0e',
  greenTerrain: '#25bc74',
  greenTraceBg: '#e2efda',
  greenTraceText: '#375623',
  greyLabel: '#d9d9d9',
  greyFixed: '#808080',
  redTime: '#8b1a1a',
} as const;

export const DOCX_COLORS = {
  C_GREY_LABEL: 'D9D9D9',
  C_GREY_FIXED: '808080',
  C_GREEN_BG: 'E2EFDA',
  C_GREEN_TEXT: '375623',
  C_GREEN_TERRAIN: '25BC74',
  C_WHITE_TEXT: 'FFFFFF',
  C_RED_HEADER: 'E31A0E',
  C_BLACK: '000000',
  C_WHITE: 'FFFFFF',
} as const;

export const FIXED_ACTIVITIES = ['arrivee', 'arrivée', 'repas', 'fin de la', "fin de l'audit", 'réunion d\'ouverture', 'réunion de clôture', 'preparation', 'préparation'];

export const TRACEABILITY_KEYWORDS = ['traçabilité', 'traçabilité', 'tracabilite', 'traceability'];

export const FIXED_TIME_SLOTS = {
  arrival: '08h15',
  openingMeeting: '08h30',
  lunch: '12h30',
  closingPrep: '16h30',
  closingMeeting: '17h00',
  endOfDay: '17h30',
};

export const MIN_TERRAIN_PERCENT = 0.5;
export const MAX_DAY_AMPLITUDE_MINUTES = 540;
export const TIME_SLOT_MINUTES = 15;

export const AVAILABLE_DURATIONS = [2, 2.25, 2.5, 2.75, 3, 3.25, 3.5, 3.75, 4, 4.25, 5] as const;

export const APP_NAME = 'Audit Planner Ecocert';
export const APP_VERSION = '2.0.0';
