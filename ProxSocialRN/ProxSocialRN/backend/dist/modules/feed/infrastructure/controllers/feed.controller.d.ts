import { FeedService } from '../../application/feed.service';
export declare class FeedController {
    private readonly feedService;
    constructor(feedService: FeedService);
    getFeed(userId: string, limit?: string, offset?: string): Promise<{
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
    createPost(userId: string, body: {
        text: string;
        tags?: string[];
    }): Promise<{
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
    addComment(userId: string, postId: string, body: {
        text: string;
    }): Promise<{
        id: string;
    }>;
}
