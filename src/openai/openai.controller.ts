import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { OpenaiService } from './openai.service';
import { OpenAIDto } from './dto/openai.dto';
import { AuthGuard } from '@/iam/login/decorators/auth-guard.decorator';
import { AuthType } from '@/iam/login/enums/auth-type.enum';

@ApiTags('OpenAI')
@Controller('openai')
@ApiBearerAuth()
@AuthGuard(AuthType.None)
export class OpenaiController {
  constructor(private readonly openaiService: OpenaiService) {}

  @Post('chat')
  @ApiOperation({
    description: 'GPT chat endpoint to interact with OpenAI models',
    operationId: 'chatWithOpenAI',
    summary: 'Chat with OpenAI',
  })
  async chat(@Body() openAIDto: OpenAIDto) {
    return this.openaiService.chat(openAIDto);
  }
}
