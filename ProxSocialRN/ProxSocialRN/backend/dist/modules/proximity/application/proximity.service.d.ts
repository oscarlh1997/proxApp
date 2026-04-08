import { RedisService } from '../../../config/redis.service';
import { IUserRepository } from '../../user/domain/ports/user-repository.port';
import { UserProfile } from '../../user/domain/entities/user-profile';
export declare class ProximityService {
    private readonly redis;
    private readonly userRepo;
    constructor(redis: RedisService, userRepo: IUserRepository);
    updateLocation(userId: string, lat: number, lon: number): Promise<void>;
    findNearby(userId: string, lat: number, lon: number, radiusKm?: number): Promise<(UserProfile & {
        distanceM: number;
    })[]>;
    setInvisible(userId: string): Promise<void>;
}
