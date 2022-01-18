import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FlashCardsModule } from './flash-cards/flash-cards.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      // unless we are querying the api, serve the SPA
      rootPath: join(__dirname, '..', 'frontend_build'),
      exclude: ['/api*'],
    }),
    FlashCardsModule,
    PrismaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
