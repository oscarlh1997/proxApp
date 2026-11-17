import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/infrastructure/repositories/user.entity';
import { ConnectionEntity } from './infrastructure/repositories/connection.entity';
import { ConnectionService } from './application/connection.service';
import { ConnectionController } from './infrastructure/controllers/connection.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ConnectionEntity, UserEntity])],
  controllers: [ConnectionController],
  providers: [ConnectionService],
  exports: [ConnectionService],
})
export class ConnectionModule {}
