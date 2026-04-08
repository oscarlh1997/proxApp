import { Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SeedService } from './seed.service';

@ApiTags('seed')
@Controller('api')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Post('seed')
  seed() {
    return this.seedService.seed().then((message) => ({ message }));
  }
}
