import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostEntity, PostTagEntity, LikeEntity, SaveEntity, CommentEntity } from '../infrastructure/repositories/feed.entities';
import { UserEntity } from '../../user/infrastructure/repositories/user.entity';

@Injectable()
export class FeedService {
  constructor(
    @InjectRepository(PostEntity) private readonly posts: Repository<PostEntity>,
    @InjectRepository(PostTagEntity) private readonly postTags: Repository<PostTagEntity>,
    @InjectRepository(LikeEntity) private readonly likes: Repository<LikeEntity>,
    @InjectRepository(SaveEntity) private readonly saves: Repository<SaveEntity>,
    @InjectRepository(CommentEntity) private readonly comments: Repository<CommentEntity>,
    @InjectRepository(UserEntity) private readonly users: Repository<UserEntity>,
  ) {}

  async getFeed(userId: string, limit = 20, offset = 0) {
    const posts = await this.posts
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.author', 'u')
      .orderBy('p.createdAt', 'DESC')
      .skip(offset)
      .take(limit)
      .getMany();

    return Promise.all(posts.map(async (p) => {
      const tags = await this.postTags.find({ where: { postId: p.id } });
      const likeCount = await this.likes.count({ where: { postId: p.id } });
      const commentCount = await this.comments.count({ where: { postId: p.id } });
      const liked = !!(await this.likes.findOne({ where: { postId: p.id, userId } }));
      const saved = !!(await this.saves.findOne({ where: { postId: p.id, userId } }));

      return {
        id: p.id, authorId: p.authorId, authorName: p.author.displayName,
        authorUsername: p.author.username, authorAvatarSeed: p.author.avatarSeed,
        createdAt: Number(p.createdAt), text: p.text,
        tags: tags.map((t) => t.tag), liked, saved, likeCount, commentCount,
        imageUrl: p.imageUrl,
      };
    }));
  }

  async createPost(userId: string, text: string, tags: string[] = []) {
    const post = this.posts.create({ authorId: userId, text, createdAt: Date.now() });
    const saved = await this.posts.save(post);
    if (tags.length) {
      await this.postTags.save(tags.map((tag) => this.postTags.create({ postId: saved.id, tag })));
    }
    return { id: saved.id };
  }

  async toggleLike(userId: string, postId: string) {
    const existing = await this.likes.findOne({ where: { userId, postId } });
    if (existing) {
      await this.likes.remove(existing);
    } else {
      await this.likes.save(this.likes.create({ userId, postId }));
    }
    const likeCount = await this.likes.count({ where: { postId } });
    return { liked: !existing, likeCount };
  }

  async toggleSave(userId: string, postId: string) {
    const existing = await this.saves.findOne({ where: { userId, postId } });
    if (existing) {
      await this.saves.remove(existing);
    } else {
      await this.saves.save(this.saves.create({ userId, postId }));
    }
    return { saved: !existing };
  }

  async getComments(postId: string) {
    const comments = await this.comments.find({
      where: { postId },
      relations: ['author'],
      order: { createdAt: 'DESC' },
    });
    return comments.map((c) => ({
      id: c.id, postId: c.postId, authorName: c.author.displayName,
      authorAvatarSeed: c.author.avatarSeed, createdAt: Number(c.createdAt), text: c.text,
    }));
  }

  async addComment(userId: string, postId: string, text: string) {
    const comment = this.comments.create({ postId, authorId: userId, text, createdAt: Date.now() });
    const saved = await this.comments.save(comment);
    return { id: saved.id };
  }
}
