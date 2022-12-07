import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TokenPayloadType } from '../type/token.payload.type';
import { UserService } from '../../user/user.service';
import { ConfigService } from '@nestjs/config';
import { UserInfoType } from '../../user/types/userInfo.type';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET_KEY'),
    });
  }

  async validate(payload: TokenPayloadType): Promise<UserInfoType> {
    const { userId } = payload;
    const user = await this.userService.getUserInfoById(userId);
    if (!user) {
      throw new UnauthorizedException('invalid user!');
    }
    return user;
  }
}
