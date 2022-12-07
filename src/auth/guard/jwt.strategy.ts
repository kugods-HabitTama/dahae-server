import {Injectable, UnauthorizedException} from "@nestjs/common";
import {PassportStrategy} from "@nestjs/passport";
import {ExtractJwt, Strategy} from "passport-jwt";
import {TokenPayloadType} from "../type/token.payload.type";
import {UserService} from "../../user/user.service";
import {UserInfoDto} from "../../user/dto/userInfo.dto";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
    constructor(private readonly userService: UserService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET_KEY
        });
    }

    async validate(payload: TokenPayloadType): Promise<UserInfoDto> {
        const {userId} = payload;
        const user = await this.userService.getUserInfoById(userId);
        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }
}