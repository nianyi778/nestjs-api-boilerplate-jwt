import { IsNotEmpty, IsOptional, IsIn } from 'class-validator';

export class OpenAIDto {
  @IsNotEmpty()
  input: string;

  @IsOptional()
  @IsIn([
    'en-US',
    'zh-CN',
    'ja-JP',
    'ko-KR',
    'fr-FR',
    'de-DE',
    'es-ES',
    'it-IT',
    'pt-BR',
  ])
  language?: string;

  constructor(partial: Partial<OpenAIDto>) {
    Object.assign(this, partial);
    if (!this.language) {
      this.language = 'en-US'; // 设置默认值
    }
  }
}
