import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserInfoType } from '../types/userInfo.type';

export class UserProfileDto {
  @ApiProperty({ description: 'id', type: String })
  id!: string;

  @ApiProperty({ description: '이메일', type: String })
  email!: string;

  @ApiProperty({ description: '이름', type: String })
  name!: string;

  @ApiPropertyOptional({
    description: '프로필 사진 url',
    type: String,
    nullable: true,
  })
  photo?: string | null;

  static of(data: UserInfoType): UserProfileDto {
    return {
      id: data.id,
      email: data.email,
      name: data.name,
      photo: data.photo,
    };
  }
}
