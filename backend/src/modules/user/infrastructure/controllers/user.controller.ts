import { Body, Controller, Get, Param, ParseUUIDPipe, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser } from '../../../../common/decorators/current-user.decorator';
import { UserService } from '../../application/user.service';
import { UpdateProfileBody } from './dto';

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
  updateMe(@CurrentUser('id') userId: string, @Body() dto: UpdateProfileBody) {
    return this.userService.updateProfile(userId, dto);
  }

  @Get(':userId')
  getUser(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.userService.getProfile(userId);
  }
}
