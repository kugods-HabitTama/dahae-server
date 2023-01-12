import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProfilePayload {
  @IsString()
  @ApiPropertyOptional({ type: String, description: '이름' })
  name?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    type: String,
    description: '프로필 사진 url',
    nullable: true,
  })
  photo?: string | null;
}
