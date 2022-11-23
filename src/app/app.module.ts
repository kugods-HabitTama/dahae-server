import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from '../common/common.module';
import { UserModule } from '../user/user.module';
import { configModule } from './modules/config.module';

@Module({
  imports: [CommonModule, UserModule, configModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
