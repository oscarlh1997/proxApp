import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './infrastructure/repositories/user.entity';
import { UserInterestEntity } from './infrastructure/repositories/user-interest.entity';
import { UserSocialLinkEntity } from './infrastructure/repositories/user-social-link.entity';
import { UserRepositoryAdapter } from './infrastructure/repositories/user-repository.adapter';
import { UserService } from './application/user.service';
import { UserController } from './infrastructure/controllers/user.controller';
import { USER_REPOSITORY } from './domain/ports/user-repository.port';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, UserInterestEntity, UserSocialLinkEntity])],
  controllers: [UserController],
  providers: [
    UserService,
    { provide: USER_REPOSITORY, useClass: UserRepositoryAdapter },
  ],
  exports: [UserService, USER_REPOSITORY],
})
export class UserModule {}
