import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { OpenAIDto } from './dto/openai.dto';

function getPrompt(descLanguage: string): string {
  return `
You are a naming assistant. Given an input phrase in any language, generate 5 concise and meaningful English variable names in each of the following three variable naming styles.

Only return a raw JSON object without markdown syntax like \`\`\`json or triple backticks.

Naming styles and their characteristics:

1. Minimalist Style:  
   - Short, expressive, and practical  
   - Often seen in quick scripts or compact codebases  
   - Examples: userAge, dragInt, amt, cfg

2. Semantic Style:  
   - Fully descriptive and highly readable  
   - Common in business domains or public APIs  
   - Often includes prefixes like is/has/should for boolean  
   - Examples: isUserVerified, shouldDisplayButton, dragInteractionEnabled

3. Technical Style:  
   - Used in low-level systems, legacy databases, or config files  
   - Often all uppercase or snake_case  
   - Sometimes includes abbreviations  
   - Examples: USER_AGE, user_age, usr_typ, is_active_flag

Return result in this structure:
{
  "minimalist": [{ "name": string, "desc": string }],
  "semantic": [{ "name": string, "desc": string }],
  "technical": [{ "name": string, "desc": string }]
}

Each 'desc' should be a concise explanation of the variable in ${descLanguage}, no more than 150 characters.
`.trim();
}

const openai = new OpenAI({
  apiKey: process.env.DASHSCOPE_API_KEY,
  baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
});

@Injectable()
export class OpenaiService {
  async chat(
    openAIDto: OpenAIDto,
  ): Promise<OpenAI.Chat.Completions.ChatCompletion> {
    const languageMap: Record<string, string> = {
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

    const descLanguage = languageMap[openAIDto.language] || 'English';
    const prompt = getPrompt(descLanguage);

    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      {
        role: 'system',
        content: prompt,
      },
      {
        role: 'user',
        content: `Input phrase: ${openAIDto.input}`,
      },
    ];
    const response = await openai.chat.completions.create({
      model: 'qwen-plus',
      messages: messages,
      // stream: true,
    });
    const { choices, ...rest } = response;
    const [data] = choices;
    const content = data.message?.content;
    return {
      ...rest,
      choices: [
        {
          ...data,
          message: {
            ...data.message,
            content: JSON.parse(content) || {},
          },
        },
      ],
    };
    // const stream = new ReadableStream({
    //   async start(controller) {
    //     for await (const chunk of response as any) {
    //       const text = chunk.choices?.[0]?.delta?.content || '';
    //       controller.enqueue(text);
    //     }
    //     controller.close();
    //   },
    // });

    // return stream;
  }
}
