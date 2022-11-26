import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({
    description: '이메일',
  })
  @IsNotEmpty()
  @IsString()
  email!: string;

  @ApiProperty({
    description: '패스워드',
  })
  @IsNotEmpty()
  @IsString()
  password!: string;
}
