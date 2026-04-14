import { IsNotEmpty, IsString, IsIn, IsOptional } from 'class-validator'

export class CreateDocumentDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsIn(['doc', 'template'])
  type: 'doc' | 'template'

  @IsIn(['done', 'draft', 'empty'])
  @IsOptional()
  status?: 'done' | 'draft' | 'empty'
}
