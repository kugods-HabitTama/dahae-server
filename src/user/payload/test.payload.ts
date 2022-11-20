import { IsDefined, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class TestPayload {
  // 필수 필드
  @IsDefined()
  @IsString()
  @ApiProperty({ type: String, description: '필수 필드' })
  a!: string;

  // null 또는 undefined 허용
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    type: String,
    description: 'null 또는 undefined 허용',
  })
  b?: string | null;

  // undefined 허용, null 불가
  @IsString()
  @ApiPropertyOptional({
    type: String,
    description: 'undefined 허용, null 불가',
  })
  c?: string;
}
