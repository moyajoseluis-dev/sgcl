import { Global, Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { LaudusAuthService } from './services/laudus-auth.service';
import { LaudusClientService } from './services/laudus-client.service';

@Global()
@Module({
  imports: [
    HttpModule.register({
      timeout: 30000,
      maxRedirects: 3,
    }),
  ],
  providers: [LaudusAuthService, LaudusClientService],
  exports: [LaudusAuthService, LaudusClientService],
})
export class LaudusSdkModule {}