import { IUserRepository } from '../domain/ports/user-repository.port';
import { UpdateProfileDto, UserProfile } from '../domain/entities/user-profile';
export declare class UserService {
    private readonly repo;
    constructor(repo: IUserRepository);
    getProfile(id: string): Promise<UserProfile>;
    updateProfile(id: string, dto: UpdateProfileDto): Promise<UserProfile>;
    updateLocation(id: string, lat: number, lon: number): Promise<void>;
}
