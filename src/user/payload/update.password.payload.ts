import { IsDefined, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePasswordPayload {
  @IsDefined()
  @IsString()
  @ApiProperty({ type: String, description: '현재 비밀번호' })
  currentPassword!: string;

  @IsDefined()
  @IsString()
  @ApiProperty({ type: String, description: '변경할 비밀번호' })
  targetPassword!: string;
}
