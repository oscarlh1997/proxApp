import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { CommentEntity, LikeEntity, PostEntity, PostTagEntity, SaveEntity } from '../infrastructure/repositories/feed.entities';

@Injectable()
export class FeedService {
  constructor(@InjectDataSource() private readonly db: DataSource) {}

  /** Una consulta para toda la página (antes: 5 consultas por post). */
  async getFeed(userId: string, limit: number, offset: number) {
    const rows: any[] = await this.db.query(
      `SELECT p.id, p.author_id, p.text, p.created_at, p.image_url,
              u.username, u.display_name, u.avatar_seed,
              (SELECT COUNT(*)::int FROM likes l WHERE l.post_id = p.id) AS like_count,
              (SELECT COUNT(*)::int FROM comments c WHERE c.post_id = p.id) AS comment_count,
              EXISTS (SELECT 1 FROM likes l WHERE l.post_id = p.id AND l.user_id = $1) AS liked,
              EXISTS (SELECT 1 FROM saves s WHERE s.post_id = p.id AND s.user_id = $1) AS saved,
              COALESCE((SELECT array_agg(t.tag) FROM post_tags t WHERE t.post_id = p.id), '{}') AS tags
         FROM posts p JOIN users u ON u.id = p.author_id
        ORDER BY p.created_at DESC
        LIMIT $2 OFFSET $3`,
      [userId, limit, offset],
    );
    return rows.map((r) => ({
      id: r.id, authorId: r.author_id, authorName: r.display_name, authorUsername: r.username,
      authorAvatarSeed: r.avatar_seed, createdAt: Number(r.created_at), text: r.text, tags: r.tags,
      liked: r.liked, saved: r.saved, likeCount: r.like_count, commentCount: r.comment_count,
      imageUrl: r.image_url,
    }));
  }

  async createPost(userId: string, text: string, tags: string[] = []) {
    return this.db.transaction(async (tx) => {
      const post = await tx.save(tx.create(PostEntity, { authorId: userId, text: text.trim(), createdAt: Date.now() }));
      const unique = [...new Set(tags)];
      if (unique.length) await tx.insert(PostTagEntity, unique.map((tag) => ({ postId: post.id, tag })));
      return { id: post.id };
    });
  }

  async toggleLike(userId: string, postId: string) {
    await this.assertPost(postId);
    const repo = this.db.getRepository(LikeEntity);
    const del = await repo.delete({ userId, postId });
    if (!del.affected) await repo.createQueryBuilder().insert().values({ userId, postId }).orIgnore().execute();
    return { liked: !del.affected, likeCount: await repo.count({ where: { postId } }) };
  }

  async toggleSave(userId: string, postId: string) {
    await this.assertPost(postId);
    const repo = this.db.getRepository(SaveEntity);
    const del = await repo.delete({ userId, postId });
    if (!del.affected) await repo.createQueryBuilder().insert().values({ userId, postId }).orIgnore().execute();
    return { saved: !del.affected };
  }

  async getComments(postId: string) {
    const comments = await this.db.getRepository(CommentEntity).find({
      where: { postId }, relations: ['author'], order: { createdAt: 'ASC' }, take: 200,
    });
    return comments.map((c) => ({
      id: c.id, postId: c.postId, authorId: c.authorId, authorName: c.author.displayName,
      authorAvatarSeed: c.author.avatarSeed, createdAt: Number(c.createdAt), text: c.text,
    }));
  }

  async addComment(userId: string, postId: string, text: string) {
    await this.assertPost(postId);
    const repo = this.db.getRepository(CommentEntity);
    const saved = await repo.save(repo.create({ postId, authorId: userId, text: text.trim(), createdAt: Date.now() }));
    return { id: saved.id };
  }

  private async assertPost(postId: string) {
    if (!(await this.db.getRepository(PostEntity).exist({ where: { id: postId } }))) {
      throw new NotFoundException('Publicación no encontrada');
    }
  }
}
