import { IsString, IsIn, IsOptional } from 'class-validator'

export class UpdateDocumentDto {
  @IsString()
  @IsOptional()
  name?: string

  @IsIn(['doc', 'template'])
  @IsOptional()
  type?: 'doc' | 'template'

  @IsIn(['done', 'draft', 'empty'])
  @IsOptional()
  status?: 'done' | 'draft' | 'empty'
}
