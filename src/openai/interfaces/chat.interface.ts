export interface CodeStyleVariant {
  name: string;
  desc: string;
}

export interface OpenAIChat {
  minimalist: CodeStyleVariant[];
  semantic: CodeStyleVariant[];
  technical: CodeStyleVariant[];
}

export const languageMap: Record<string, string> = {
  'zh-CN': 'Chinese',
  'en-US': 'English',
  'ja-JP': 'Japanese',
  'ko-KR': 'Korean',
  'fr-FR': 'French',
  'de-DE': 'German',
  'es-ES': 'Spanish',
  'it-IT': 'Italian',
  'pt-BR': 'Portuguese',
};
