import { Controller, NotFoundException, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { SeedService } from './seed.service';

function assertDev() {
  if (process.env.NODE_ENV === 'production') throw new NotFoundException();
}

@ApiTags('dev')
@Controller('api')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Post('seed')
  async seed() {
    assertDev();
    return { message: await this.seedService.seed() };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('dev/demo-nearby')
  async demoNearby(@CurrentUser('id') userId: string) {
    assertDev();
    return { message: await this.seedService.bringDemoUsersNear(userId) };
  }
}
