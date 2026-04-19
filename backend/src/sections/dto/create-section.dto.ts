import { IsString, IsNotEmpty, IsOptional, IsInt, Min } from 'class-validator'

export class CreateSectionDto {
  @IsString()
  @IsNotEmpty()
  title: string

  @IsString()
  @IsOptional()
  content?: string

  @IsInt()
  @Min(0)
  @IsOptional()
  order?: number
}
