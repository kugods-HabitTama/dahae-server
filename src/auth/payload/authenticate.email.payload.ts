import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsString } from 'class-validator';

export class AuthenticateEmailPayload {
  @IsDefined()
  @IsString()
  @ApiProperty({
    type: String,
    description: '이메일',
  })
  email!: string;
}
