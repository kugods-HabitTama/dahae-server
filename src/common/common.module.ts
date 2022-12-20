import { Global, Module } from '@nestjs/common';
import { DefaultUserInterceptor } from './interceptor/default.user.interceptor';
import { PrismaService } from './services/prisma.service';

@Global()
@Module({
  providers: [PrismaService, DefaultUserInterceptor],
  exports: [PrismaService, DefaultUserInterceptor],
})
export class CommonModule {}
