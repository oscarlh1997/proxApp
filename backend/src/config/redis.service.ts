import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {
  public readonly client: Redis;

  constructor(private config: ConfigService) {
    this.client = new Redis({
      host: config.get('REDIS_HOST', 'localhost'),
      port: config.get<number>('REDIS_PORT', 6379),
      retryStrategy: (times) => Math.min(times * 100, 3000),
    });
  }

  async onModuleDestroy() {
    await this.client.quit();
  }

  // ── Location cache ──────────────────────────────────────────────────────────
  // Usamos Redis GEO commands para proximity queries ultra-rápidas
  async setUserLocation(userId: string, lat: number, lon: number, ttlSeconds = 1800): Promise<void> {
    await this.client.geoadd('user:locations', lon, lat, userId);
    await this.client.set(`user:loc:ts:${userId}`, Date.now().toString(), 'EX', ttlSeconds);
  }

  async getNearbyUserIds(lat: number, lon: number, radiusKm: number): Promise<{ id: string; distanceM: number }[]> {
    const results = await this.client.geosearch(
      'user:locations', 'FROMLONLAT', lon, lat, 'BYRADIUS', radiusKm, 'km',
      'ASC', 'COUNT', 100, 'WITHDIST',
    );
    // results: [[userId, distanceKmString], ...]
    return (results as [string, string][]).map(([id, distKm]) => ({
      id,
      distanceM: Math.round(parseFloat(distKm) * 1000),
    }));
  }
}
