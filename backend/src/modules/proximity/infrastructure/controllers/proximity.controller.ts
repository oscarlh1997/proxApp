import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, Max, Min } from 'class-validator';
import { CurrentUser } from '../../../../common/decorators/current-user.decorator';
import { ProximityService } from '../../application/proximity.service';
import { LocationBody } from '../../../user/infrastructure/controllers/dto';

class NearbyQuery {
  @IsOptional() @Type(() => Number) @IsNumber() @Min(0.05) @Max(5)
  radius: number = 0.5;
}

@ApiTags('proximity')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('api')
export class ProximityController {
  constructor(private readonly proximityService: ProximityService) {}

  @Post('location')
  async updateLocation(@CurrentUser('id') userId: string, @Body() body: LocationBody) {
    await this.proximityService.updateLocation(userId, body.latitude, body.longitude);
    return { ok: true };
  }

  @Get('nearby')
  getNearby(@CurrentUser('id') userId: string, @Query() q: NearbyQuery) {
    return this.proximityService.findNearbyMe(userId, q.radius);
  }
}
