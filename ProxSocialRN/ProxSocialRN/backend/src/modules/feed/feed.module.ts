import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity, PostTagEntity, LikeEntity, SaveEntity, CommentEntity } from './infrastructure/repositories/feed.entities';
import { UserEntity } from '../user/infrastructure/repositories/user.entity';
import { FeedService } from './application/feed.service';
import { FeedController } from './infrastructure/controllers/feed.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PostEntity, PostTagEntity, LikeEntity, SaveEntity, CommentEntity, UserEntity])],
  controllers: [FeedController],
  providers: [FeedService],
  exports: [FeedService],
})
export class FeedModule {}
