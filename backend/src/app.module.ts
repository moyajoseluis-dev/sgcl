import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import configuration from './config/configuration';
import { validate } from './config/validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [configuration],
      validate,
    }),
  ],
})
export class AppModule {}