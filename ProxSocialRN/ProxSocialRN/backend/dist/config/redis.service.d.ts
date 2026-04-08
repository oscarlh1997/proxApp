import { OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
export declare class RedisService implements OnModuleDestroy {
    private config;
    readonly client: Redis;
    constructor(config: ConfigService);
    onModuleDestroy(): Promise<void>;
    setUserLocation(userId: string, lat: number, lon: number, ttlSeconds?: number): Promise<void>;
    getNearbyUserIds(lat: number, lon: number, radiusKm: number): Promise<{
        id: string;
        distanceM: number;
    }[]>;
    removeUserLocation(userId: string): Promise<void>;
    isLocationFresh(userId: string): Promise<boolean>;
    get(key: string): Promise<string | null>;
    set(key: string, value: string, ttlSeconds?: number): Promise<void>;
    del(key: string): Promise<void>;
    publish(channel: string, message: string): Promise<void>;
}
