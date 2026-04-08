import { UserEntity } from './user.entity';
export declare class UserSocialLinkEntity {
    id: string;
    userId: string;
    platform: string;
    url: string;
    handle: string;
    user: UserEntity;
}
