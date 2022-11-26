import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';
import { UserOS } from '@prisma/client';

export class CreateUserDto {
  @ApiProperty({
    description: '이메일',
  })
  @IsString()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({
    description: '패스워드',
  })
  @IsString()
  @IsNotEmpty()
  password!: string;

  @ApiProperty({
    description: '이름',
  })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({
    description: 'os',
  })
  @IsNotEmpty()
  os!: UserOS;
}
