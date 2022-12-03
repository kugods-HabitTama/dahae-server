import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: 'id', type: String })
  id!: string;

  @ApiProperty({ description: '이메일', type: String })
  email!: string;

  @ApiProperty({ description: '패스워드', type: String })
  password!: string;

  @ApiProperty({ description: '이름', type: String })
  name!: string;
}
