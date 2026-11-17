import { Module } from '@nestjs/common';
import { ProximityService } from './application/proximity.service';
import { ProximityController } from './infrastructure/controllers/proximity.controller';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule],
  controllers: [ProximityController],
  providers: [ProximityService],
  exports: [ProximityService],
})
export class ProximityModule {}
