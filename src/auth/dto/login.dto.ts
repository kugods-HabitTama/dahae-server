import { ApiProperty } from '@nestjs/swagger';
export class LoginDto {
  @ApiProperty({ type: String })
  accessToken: string;

  @ApiProperty({ type: String })
  refreshToken: string;
}
