import { UserInterestEntity } from './user-interest.entity';
import { UserSocialLinkEntity } from './user-social-link.entity';
export declare class UserEntity {
    id: string;
    username: string;
    email: string;
    passwordHash: string;
    displayName: string;
    bio: string;
    avatarSeed: string;
    relationshipStatus: string;
    location: string | null;
    latitude: number | null;
    longitude: number | null;
    locationUpdatedAt: number | null;
    visible: boolean;
    createdAt: Date;
    interests: UserInterestEntity[];
    socialLinks: UserSocialLinkEntity[];
}
