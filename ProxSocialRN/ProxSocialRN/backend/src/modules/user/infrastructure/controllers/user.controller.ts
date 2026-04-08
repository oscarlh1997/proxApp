import { Body, Controller, Get, Param, Put, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser } from '../../../../common/decorators/current-user.decorator';
import { UserService } from '../../application/user.service';
import { UpdateProfileDto } from '../../domain/entities/user-profile';

@ApiTags('profile')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('api/profile')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  getMe(@CurrentUser('id') userId: string) {
    return this.userService.getProfile(userId);
  }

  @Put('me')
  updateMe(@CurrentUser('id') userId: string, @Body() dto: UpdateProfileDto) {
    return this.userService.updateProfile(userId, dto);
  }

  @Get(':userId')
  getUser(@Param('userId') userId: string) {
    return this.userService.getProfile(userId);
  }

  @Post('location')
  async updateLocation(
    @CurrentUser('id') userId: string,
    @Body() body: { latitude: number; longitude: number },
  ) {
    await this.userService.updateLocation(userId, body.latitude, body.longitude);
    return { ok: true };
  }
}
