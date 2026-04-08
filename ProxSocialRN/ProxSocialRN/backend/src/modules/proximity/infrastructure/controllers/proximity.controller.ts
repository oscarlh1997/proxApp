import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser } from '../../../../common/decorators/current-user.decorator';
import { ProximityService } from '../../application/proximity.service';

@ApiTags('proximity')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('api')
export class ProximityController {
  constructor(private readonly proximityService: ProximityService) {}

  @Post('location')
  async updateLocation(
    @CurrentUser('id') userId: string,
    @Body() body: { latitude: number; longitude: number },
  ) {
    await this.proximityService.updateLocation(userId, body.latitude, body.longitude);
    return { ok: true };
  }

  @Get('nearby')
  async getNearby(
    @CurrentUser('id') userId: string,
    @Query('radius') radius?: string,
    @Query('lat') lat?: string,
    @Query('lon') lon?: string,
  ) {
    const r = parseFloat(radius || '0.5');
    // Si el cliente envía lat/lon, usarlos. Si no, buscar la última ubicación del usuario.
    const latitude = lat ? parseFloat(lat) : undefined;
    const longitude = lon ? parseFloat(lon) : undefined;

    if (latitude && longitude) {
      // Actualizar ubicación y buscar
      await this.proximityService.updateLocation(userId, latitude, longitude);
      return this.proximityService.findNearby(userId, latitude, longitude, r);
    }

    // Buscar con la última ubicación guardada en Redis/DB
    return this.proximityService.findNearby(userId, 0, 0, r);
  }
}
