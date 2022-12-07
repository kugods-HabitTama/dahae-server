import {Injectable, UnauthorizedException} from "@nestjs/common";
import {PassportStrategy} from "@nestjs/passport";
import {ExtractJwt, Strategy} from "passport-jwt";
import {TokenPayloadType} from "../type/token.payload.type";
import {UserService} from "../../user/user.service";
import {UserInfoDto} from "../../user/dto/userInfo.dto";
import {ConfigService} from "@nestjs/config";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
    constructor(private readonly userService: UserService, private readonly configService: ConfigService) {
            super({
                jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
                ignoreExpiration: false,
                secretOrKey: configService.get<string>('JWT_SECRET_KEY'),
            });
    }

    async validate(payload: TokenPayloadType): Promise<UserInfoDto> {
        const {user_id} = payload;
        const user = await this.userService.getUserInfoById(user_id);
        if (!user) {
            throw new UnauthorizedException('invalid user!');
        }
        return user;
    }
}