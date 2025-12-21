/**
 * Application Constants
 */

export const MODES = {
  BRAINSTORMING: 'brainstorming',
  IDEAFINDER: 'ideafinder',
};

export const PHASES = {
  INPUT: 'input',
  EXPANDING: 'expanding',
  GENERATING_PRD: 'generating-prd',
  OPTIMIZING_PRD: 'optimizing-prd',
  GENERATING_PROTOTYPE: 'generating-prototype',
  CUSTOMIZING_PROTOTYPE: 'customizing-prototype',
  COMPLETE: 'complete',
  IDEAS_SELECTION: 'ideas-selection',
};

export const MAX_ITERATIONS = 8;
export const MIN_TOPIC_LENGTH = 10;
export const MAX_TOPIC_LENGTH = 500;

export const COLORS = {
  primary: '#667eea',
  secondary: '#764ba2',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
};

export const SCORING_METRICS = [
  { key: 'marketPotential', label: '🎯 Marktpotenzial' },
  { key: 'complexity', label: '🔧 Umsetzungskomplexität' },
  { key: 'relevance', label: '📈 Relevanz & Trends' },
  { key: 'risk', label: '⚠️ Risikobewertung' },
  { key: 'value', label: '💡 Nutzen/Value' },
];

export const FEATURES = [
  {
    icon: '🤖',
    title: 'AI-gestützte Ideation',
    description: 'Claude AI erweitert deine Idee mit strukturierten Fragen',
  },
  {
    icon: '📋',
    title: 'PRD-Generierung',
    description: 'Automatisches Erstellen professioneller PRDs',
  },
  {
    icon: '💻',
    title: 'Frontend-Prototypen',
    description: '95% produktionsreifer HTML/CSS/JS Code',
  },
  {
    icon: '🎨',
    title: 'Live-Anpassungen',
    description: 'Customize Farben, Text, Layout via Chat',
  },
  {
    icon: '⚡',
    title: 'Ultra-schnell',
    description: 'Von Idee zu Prototyp in < 30 Minuten',
  },
  {
    icon: '📦',
    title: 'Multi-Format Export',
    description: 'ZIP, HTML, JSON, Markdown, PDF',
  },
];

export const PERSONAS = [
  {
    icon: '👨‍💼',
    title: 'Startup Founder',
    description: 'Präsentiere Ideen mit Prototyp für Investors',
  },
  {
    icon: '👩‍💻',
    title: 'Product Manager',
    description: 'Visualisiere Features vor Entwicklung',
  },
  {
    icon: '🎨',
    title: 'Designer',
    description: 'Erstelle Quick-Mockups und Designs',
  },
  {
    icon: '👨‍🎓',
    title: 'Junior Developer',
    description: 'Lerne moderne Web App Struktur',
  },
];

export default {
  MODES,
  PHASES,
  MAX_ITERATIONS,
  MIN_TOPIC_LENGTH,
  MAX_TOPIC_LENGTH,
  COLORS,
  SCORING_METRICS,
  FEATURES,
  PERSONAS,
};
