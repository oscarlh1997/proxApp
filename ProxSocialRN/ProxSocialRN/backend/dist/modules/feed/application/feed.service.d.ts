import { Repository } from 'typeorm';
import { PostEntity, PostTagEntity, LikeEntity, SaveEntity, CommentEntity } from '../infrastructure/repositories/feed.entities';
import { UserEntity } from '../../user/infrastructure/repositories/user.entity';
export declare class FeedService {
    private readonly posts;
    private readonly postTags;
    private readonly likes;
    private readonly saves;
    private readonly comments;
    private readonly users;
    constructor(posts: Repository<PostEntity>, postTags: Repository<PostTagEntity>, likes: Repository<LikeEntity>, saves: Repository<SaveEntity>, comments: Repository<CommentEntity>, users: Repository<UserEntity>);
    getFeed(userId: string, limit?: number, offset?: number): Promise<{
        id: string;
        authorId: string;
        authorName: string;
        authorUsername: string;
        authorAvatarSeed: string;
        createdAt: number;
        text: string;
        tags: string[];
        liked: boolean;
        saved: boolean;
        likeCount: number;
        commentCount: number;
        imageUrl: string | null;
    }[]>;
    createPost(userId: string, text: string, tags?: string[]): Promise<{
        id: string;
    }>;
    toggleLike(userId: string, postId: string): Promise<{
        liked: boolean;
        likeCount: number;
    }>;
    toggleSave(userId: string, postId: string): Promise<{
        saved: boolean;
    }>;
    getComments(postId: string): Promise<{
        id: string;
        postId: string;
        authorName: string;
        authorAvatarSeed: string;
        createdAt: number;
        text: string;
    }[]>;
    addComment(userId: string, postId: string, text: string): Promise<{
        id: string;
    }>;
}
