import { IsString, IsIn, IsOptional, IsInt, Min } from 'class-validator'

export class UpdateSectionDto {
  @IsString()
  @IsOptional()
  title?: string

  @IsString()
  @IsOptional()
  content?: string

  @IsIn(['done', 'writing', 'empty'])
  @IsOptional()
  status?: 'done' | 'writing' | 'empty'

  @IsInt()
  @Min(0)
  @IsOptional()
  order?: number
}
