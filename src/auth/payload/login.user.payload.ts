import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDefined } from 'class-validator';

export class LoginUserPayload {
  @IsDefined()
  @IsString()
  @ApiProperty({
    type: String,
    description: '이메일',
  })
  email!: string;

  @IsDefined()
  @IsString()
  @ApiProperty({
    type: String,
    description: '패스워드',
  })
  password!: string;
}
