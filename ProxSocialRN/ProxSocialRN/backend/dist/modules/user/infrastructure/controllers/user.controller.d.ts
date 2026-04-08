import { UserService } from '../../application/user.service';
import { UpdateProfileDto } from '../../domain/entities/user-profile';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    getMe(userId: string): Promise<import("../../domain/entities/user-profile").UserProfile>;
    updateMe(userId: string, dto: UpdateProfileDto): Promise<import("../../domain/entities/user-profile").UserProfile>;
    getUser(userId: string): Promise<import("../../domain/entities/user-profile").UserProfile>;
    updateLocation(userId: string, body: {
        latitude: number;
        longitude: number;
    }): Promise<{
        ok: boolean;
    }>;
}
