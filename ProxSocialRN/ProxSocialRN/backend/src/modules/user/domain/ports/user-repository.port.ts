import { UserProfile, UpdateProfileDto } from '../entities/user-profile';

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');

export interface IUserRepository {
  findById(id: string): Promise<UserProfile | null>;
  findByEmail(email: string): Promise<(UserProfile & { passwordHash: string }) | null>;
  findByUsername(username: string): Promise<UserProfile | null>;
  create(data: {
    username: string; email: string; passwordHash: string;
    displayName: string; avatarSeed: string;
  }): Promise<UserProfile>;
  update(id: string, data: UpdateProfileDto): Promise<UserProfile>;
  updateLocation(id: string, lat: number, lon: number): Promise<void>;
  findNearby(lat: number, lon: number, radiusKm: number, excludeId: string, userIds?: string[]): Promise<(UserProfile & { distanceM: number })[]>;
}
