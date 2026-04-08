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
    const results = await this.client.georadius(
      'user:locations', lon, lat, radiusKm, 'km',
      'WITHDIST', 'ASC', 'COUNT', 100,
    );
    // results: [[userId, distanceKmString], ...]
    return (results as [string, string][]).map(([id, distKm]) => ({
      id,
      distanceM: Math.round(parseFloat(distKm) * 1000),
    }));
  }

  async removeUserLocation(userId: string): Promise<void> {
    await this.client.zrem('user:locations', userId);
    await this.client.del(`user:loc:ts:${userId}`);
  }

  async isLocationFresh(userId: string): Promise<boolean> {
    return !!(await this.client.get(`user:loc:ts:${userId}`));
  }

  // ── Generic cache ───────────────────────────────────────────────────────────
  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    if (ttlSeconds) await this.client.set(key, value, 'EX', ttlSeconds);
    else await this.client.set(key, value);
  }

  async del(key: string): Promise<void> {
    await this.client.del(key);
  }

  // ── Pub/Sub for real-time messaging ─────────────────────────────────────────
  async publish(channel: string, message: string): Promise<void> {
    await this.client.publish(channel, message);
  }
}
