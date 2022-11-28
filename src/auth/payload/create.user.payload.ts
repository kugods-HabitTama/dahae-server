import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDefined } from 'class-validator';
import { UserOS } from '@prisma/client';

export class CreateUserPayload {
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

  @IsDefined()
  @IsString()
  @ApiProperty({
    type: String,
    description: '이름',
  })
  name!: string;

  @IsDefined()
  @ApiProperty({
    description: 'os',
  })
  os!: UserOS;
}
