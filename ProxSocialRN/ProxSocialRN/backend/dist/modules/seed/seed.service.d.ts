import { Repository } from 'typeorm';
import { UserEntity } from '../user/infrastructure/repositories/user.entity';
import { UserInterestEntity } from '../user/infrastructure/repositories/user-interest.entity';
import { UserSocialLinkEntity } from '../user/infrastructure/repositories/user-social-link.entity';
import { PostEntity, PostTagEntity } from '../feed/infrastructure/repositories/feed.entities';
export declare class SeedService {
    private users;
    private interests;
    private socialLinks;
    private posts;
    private postTags;
    private logger;
    constructor(users: Repository<UserEntity>, interests: Repository<UserInterestEntity>, socialLinks: Repository<UserSocialLinkEntity>, posts: Repository<PostEntity>, postTags: Repository<PostTagEntity>);
    seed(): Promise<string>;
}
