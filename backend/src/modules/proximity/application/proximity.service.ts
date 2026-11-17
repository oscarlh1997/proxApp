import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { RedisService } from '../../../config/redis.service';
import { USER_REPOSITORY, IUserRepository } from '../../user/domain/ports/user-repository.port';

@Injectable()
export class ProximityService implements OnModuleInit {
  private readonly logger = new Logger('Proximity');

  constructor(
    private readonly dataSource: DataSource,
    private readonly redis: RedisService,
    @Inject(USER_REPOSITORY) private readonly userRepo: IUserRepository,
  ) {}

  /** Si Redis se reinició, lo recarga desde Postgres para que los candidatos GEO estén completos. */
  async onModuleInit() {
    const rows: { id: string; latitude: number; longitude: number }[] = await this.dataSource.query(
      'SELECT id, latitude, longitude FROM users WHERE latitude IS NOT NULL AND location_updated_at > $1',
      [Date.now() - 30 * 60 * 1000],
    );
    await Promise.all(rows.map((r) => this.redis.setUserLocation(r.id, r.latitude, r.longitude)));
    if (rows.length) this.logger.log(`Redis GEO precargado con ${rows.length} ubicaciones`);
  }

  /** Redis GEO (volátil, rápido) + PostGIS (persistente). */
  async updateLocation(userId: string, lat: number, lon: number): Promise<void> {
    await Promise.all([
      this.redis.setUserLocation(userId, lat, lon, 1800),
      this.userRepo.updateLocation(userId, lat, lon),
    ]);
  }

  /** Busca alrededor de la última ubicación conocida del usuario. */
  async findNearbyMe(userId: string, radiusKm: number) {
    const loc = await this.userRepo.getLocation(userId);
    if (!loc) return [];
    // Redis da candidatos en microsegundos; Postgres filtra (visible, frescura) y enriquece
    const ids = (await this.redis.getNearbyUserIds(loc.lat, loc.lon, radiusKm))
      .map((r) => r.id)
      .filter((id) => id !== userId);
    return this.userRepo.findNearby(loc.lat, loc.lon, radiusKm, userId, ids.length ? ids : undefined);
  }
}
