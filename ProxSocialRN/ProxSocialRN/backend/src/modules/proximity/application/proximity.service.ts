import { Inject, Injectable } from '@nestjs/common';
import { RedisService } from '../../../config/redis.service';
import { USER_REPOSITORY, IUserRepository } from '../../user/domain/ports/user-repository.port';
import { UserProfile } from '../../user/domain/entities/user-profile';

@Injectable()
export class ProximityService {
  constructor(
    private readonly redis: RedisService,
    @Inject(USER_REPOSITORY) private readonly userRepo: IUserRepository,
  ) {}

  /**
   * Actualiza ubicación en Redis (rápido, volátil) + PostgreSQL (persistente, PostGIS).
   * Redis GEO se usa para queries de proximidad en tiempo real.
   * PostGIS se usa como fallback y para queries más complejas.
   */
  async updateLocation(userId: string, lat: number, lon: number): Promise<void> {
    await Promise.all([
      this.redis.setUserLocation(userId, lat, lon, 1800), // 30 min TTL
      this.userRepo.updateLocation(userId, lat, lon),
    ]);
  }

  /**
   * Busca usuarios cercanos:
   * 1. Redis GEO para obtener IDs + distancias (ultra-rápido, O(log(N)+M))
   * 2. PostgreSQL para enriquecer con perfiles completos
   * Fallback a PostGIS puro si Redis no tiene datos suficientes.
   */
  async findNearby(
    userId: string,
    lat: number,
    lon: number,
    radiusKm: number = 0.5,
  ): Promise<(UserProfile & { distanceM: number })[]> {
    // Primero: Redis GEO (milisegundos)
    const redisResults = await this.redis.getNearbyUserIds(lat, lon, radiusKm);
    const nearbyIds = redisResults
      .filter((r) => r.id !== userId)
      .map((r) => r.id);

    if (nearbyIds.length > 0) {
      // Enriquecer con datos de PostgreSQL usando los IDs de Redis
      const profiles = await this.userRepo.findNearby(lat, lon, radiusKm, userId, nearbyIds);
      return profiles;
    }

    // Fallback: PostGIS directo (más lento pero completo)
    return this.userRepo.findNearby(lat, lon, radiusKm, userId);
  }

  async setInvisible(userId: string): Promise<void> {
    await this.redis.removeUserLocation(userId);
  }
}
