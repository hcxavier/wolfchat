export const availableModels = [
  'gemini/gemini-3-flash-preview',
  'gemini/gemini-3-pro-preview',
  'gemini/gemini-2.5-flash',
  'groq/moonshotai/kimi-k2-instruct-0905'
];

export const modelAliases: Record<string, string> = {
  'groq/moonshotai/kimi-k2-instruct-0905': 'Kimi K2 Instruct (09-05)',
  'gemini/gemini-3-flash-preview': 'Gemini 3.0 Flash',
  'gemini/gemini-3-pro-preview': 'Gemini 3.0 Pro',
  'gemini/gemini-2.5-flash': 'Gemini 2.5 Flash',
};
