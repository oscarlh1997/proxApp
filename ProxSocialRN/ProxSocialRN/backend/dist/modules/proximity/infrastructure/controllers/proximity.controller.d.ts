import { ProximityService } from '../../application/proximity.service';
export declare class ProximityController {
    private readonly proximityService;
    constructor(proximityService: ProximityService);
    updateLocation(userId: string, body: {
        latitude: number;
        longitude: number;
    }): Promise<{
        ok: boolean;
    }>;
    getNearby(userId: string, radius?: string, lat?: string, lon?: string): Promise<(import("../../../user/domain/entities/user-profile").UserProfile & {
        distanceM: number;
    })[]>;
}
