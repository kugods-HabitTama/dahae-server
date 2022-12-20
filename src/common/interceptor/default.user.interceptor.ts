import { UserInfoType } from './../../user/types/userInfo.type';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { PrismaService } from '../services/prisma.service';

@Injectable()
export class DefaultUserInterceptor implements NestInterceptor {
  constructor(private readonly prisma: PrismaService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const { user } = request;

    if (!user) {
      const defaultUser = await this.prisma.user.findFirst({});
      request.user = {
        id: defaultUser.id,
        createdAt: defaultUser.createdAt,
        email: defaultUser.email,
        name: defaultUser.name,
        role: defaultUser.role,
        photo: defaultUser.photo,
        os: defaultUser.os,
        streak: defaultUser.streak,
        marketingAgreement: defaultUser.marketingAgreement,
      } as UserInfoType;
    }

    return next.handle();
  }
}
