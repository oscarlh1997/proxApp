import { UserEntity } from '../../../user/infrastructure/repositories/user.entity';
export declare class PostEntity {
    id: string;
    authorId: string;
    text: string;
    imageUrl: string | null;
    createdAt: number;
    author: UserEntity;
    tags: PostTagEntity[];
    likes: LikeEntity[];
    saves: SaveEntity[];
    comments: CommentEntity[];
}
export declare class PostTagEntity {
    id: string;
    postId: string;
    tag: string;
    post: PostEntity;
}
export declare class LikeEntity {
    id: string;
    userId: string;
    postId: string;
    post: PostEntity;
}
export declare class SaveEntity {
    id: string;
    userId: string;
    postId: string;
    post: PostEntity;
}
export declare class CommentEntity {
    id: string;
    postId: string;
    authorId: string;
    text: string;
    createdAt: number;
    post: PostEntity;
    author: UserEntity;
}
