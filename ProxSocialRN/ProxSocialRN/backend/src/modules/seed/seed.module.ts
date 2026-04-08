import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { UserEntity } from '../user/infrastructure/repositories/user.entity';
import { UserInterestEntity } from '../user/infrastructure/repositories/user-interest.entity';
import { UserSocialLinkEntity } from '../user/infrastructure/repositories/user-social-link.entity';
import { PostEntity, PostTagEntity } from '../feed/infrastructure/repositories/feed.entities';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, UserInterestEntity, UserSocialLinkEntity, PostEntity, PostTagEntity])],
  controllers: [SeedController],
  providers: [SeedService],
})
export class SeedModule {}
