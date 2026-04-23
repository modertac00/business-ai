import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common'
import {
  BedrockRuntimeClient,
  ConverseCommand,
  ConverseCommandInput,
} from '@aws-sdk/client-bedrock-runtime'

@Injectable()
export class BedrockService {
  private readonly logger = new Logger(BedrockService.name)
  private readonly client: BedrockRuntimeClient
  private readonly modelId: string

  constructor() {
    this.client = new BedrockRuntimeClient({
      region: process.env.AWS_REGION ?? 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    })
    this.modelId =
      process.env.BEDROCK_MODEL_ID ?? 'anthropic.claude-3-5-sonnet-20241022-v2:0'
  }

  async converse(
    systemPrompt: string,
    messages: Array<{ role: 'user' | 'assistant'; content: string }>,
  ): Promise<string> {
    const input: ConverseCommandInput = {
      modelId: this.modelId,
      system: [{ text: systemPrompt }],
      messages: messages.map((m) => ({
        role: m.role,
        content: [{ text: m.content }],
      })),
      inferenceConfig: {
        maxTokens: 2048,
        temperature: 0.7,
      },
    }

    try {
      const response = await this.client.send(new ConverseCommand(input))
      const block = response.output?.message?.content?.[0]
      if (!block || !('text' in block)) {
        throw new Error('Unexpected response shape from Bedrock')
      }
      return block.text!
    } catch (err) {
      this.logger.error('Bedrock converse failed', err)
      throw new InternalServerErrorException('AI service unavailable')
    }
  }
}
