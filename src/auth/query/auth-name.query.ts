import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsString } from 'class-validator';

export class AuthNameQuery {
  @IsDefined()
  @IsString()
  @ApiProperty({ type: String, description: '이름' })
  name!: string;
}
