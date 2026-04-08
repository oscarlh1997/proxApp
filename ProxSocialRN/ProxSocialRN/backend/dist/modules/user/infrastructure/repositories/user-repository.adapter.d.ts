import { Repository } from 'typeorm';
import { IUserRepository } from '../../domain/ports/user-repository.port';
import { UserProfile, UpdateProfileDto } from '../../domain/entities/user-profile';
import { UserEntity } from './user.entity';
import { UserInterestEntity } from './user-interest.entity';
import { UserSocialLinkEntity } from './user-social-link.entity';
export declare class UserRepositoryAdapter implements IUserRepository {
    private readonly users;
    private readonly interests;
    private readonly socialLinks;
    constructor(users: Repository<UserEntity>, interests: Repository<UserInterestEntity>, socialLinks: Repository<UserSocialLinkEntity>);
    findById(id: string): Promise<UserProfile | null>;
    findByEmail(email: string): Promise<(UserProfile & {
        passwordHash: string;
    }) | null>;
    findByUsername(username: string): Promise<UserProfile | null>;
    create(data: {
        username: string;
        email: string;
        passwordHash: string;
        displayName: string;
        avatarSeed: string;
    }): Promise<UserProfile>;
    update(id: string, data: UpdateProfileDto): Promise<UserProfile>;
    updateLocation(id: string, lat: number, lon: number): Promise<void>;
    findNearby(lat: number, lon: number, radiusKm: number, excludeId: string, userIds?: string[]): Promise<(UserProfile & {
        distanceM: number;
    })[]>;
    private toProfile;
}
