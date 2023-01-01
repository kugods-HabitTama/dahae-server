import { IsDefined, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProfilePayload {
  @IsDefined()
  @IsString()
  @ApiProperty({ type: String, description: '이름' })
  name!: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String, description: '프로필 사진 url' })
  photo?: string | null;
}
