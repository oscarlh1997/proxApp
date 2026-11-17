import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayMaxSize, IsArray, IsInt, IsOptional, IsString, Length, Max, Min } from 'class-validator';
import { CurrentUser } from '../../../../common/decorators/current-user.decorator';
import { FeedService } from '../../application/feed.service';

class FeedQuery {
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(50) limit: number = 20;
  @IsOptional() @Type(() => Number) @IsInt() @Min(0) offset: number = 0;
}

class CreatePostBody {
  @IsString() @Length(1, 1000) text: string;
  @IsOptional() @IsArray() @ArrayMaxSize(5) @IsString({ each: true }) @Length(1, 50, { each: true })
  tags: string[] = [];
}

class CommentBody {
  @IsString() @Length(1, 1000) text: string;
}

@ApiTags('feed')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('api')
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @Get('feed')
  getFeed(@CurrentUser('id') userId: string, @Query() q: FeedQuery) {
    return this.feedService.getFeed(userId, q.limit, q.offset);
  }

  @Post('posts')
  createPost(@CurrentUser('id') userId: string, @Body() body: CreatePostBody) {
    return this.feedService.createPost(userId, body.text, body.tags);
  }

  @Post('posts/:id/like')
  toggleLike(@CurrentUser('id') userId: string, @Param('id', ParseUUIDPipe) postId: string) {
    return this.feedService.toggleLike(userId, postId);
  }

  @Post('posts/:id/save')
  toggleSave(@CurrentUser('id') userId: string, @Param('id', ParseUUIDPipe) postId: string) {
    return this.feedService.toggleSave(userId, postId);
  }

  @Get('posts/:id/comments')
  getComments(@Param('id', ParseUUIDPipe) postId: string) {
    return this.feedService.getComments(postId);
  }

  @Post('posts/:id/comments')
  addComment(@CurrentUser('id') userId: string, @Param('id', ParseUUIDPipe) postId: string, @Body() body: CommentBody) {
    return this.feedService.addComment(userId, postId, body.text);
  }
}
