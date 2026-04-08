import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser } from '../../../../common/decorators/current-user.decorator';
import { FeedService } from '../../application/feed.service';

@ApiTags('feed')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('api')
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @Get('feed')
  getFeed(
    @CurrentUser('id') userId: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    return this.feedService.getFeed(userId, parseInt(limit || '20'), parseInt(offset || '0'));
  }

  @Post('posts')
  createPost(@CurrentUser('id') userId: string, @Body() body: { text: string; tags?: string[] }) {
    return this.feedService.createPost(userId, body.text, body.tags);
  }

  @Post('posts/:id/like')
  toggleLike(@CurrentUser('id') userId: string, @Param('id') postId: string) {
    return this.feedService.toggleLike(userId, postId);
  }

  @Post('posts/:id/save')
  toggleSave(@CurrentUser('id') userId: string, @Param('id') postId: string) {
    return this.feedService.toggleSave(userId, postId);
  }

  @Get('posts/:id/comments')
  getComments(@Param('id') postId: string) {
    return this.feedService.getComments(postId);
  }

  @Post('posts/:id/comments')
  addComment(
    @CurrentUser('id') userId: string,
    @Param('id') postId: string,
    @Body() body: { text: string },
  ) {
    return this.feedService.addComment(userId, postId, body.text);
  }
}
