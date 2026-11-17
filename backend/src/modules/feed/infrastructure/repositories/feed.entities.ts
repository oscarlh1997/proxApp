import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { UserEntity } from '../../../user/infrastructure/repositories/user.entity';

@Entity('posts')
@Index(['createdAt'])
export class PostEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'author_id' })
  authorId: string;

  @Column({ type: 'text' })
  text: string;

  @Column({ name: 'image_url', type: 'varchar', nullable: true })
  imageUrl: string | null;

  @Column({ name: 'created_at', type: 'bigint' })
  createdAt: number;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'author_id' })
  author: UserEntity;

  @OneToMany(() => PostTagEntity, (t) => t.post, { cascade: true })
  tags: PostTagEntity[];

  @OneToMany(() => LikeEntity, (l) => l.post)
  likes: LikeEntity[];

  @OneToMany(() => SaveEntity, (s) => s.post)
  saves: SaveEntity[];

  @OneToMany(() => CommentEntity, (c) => c.post)
  comments: CommentEntity[];
}

@Entity('post_tags')
export class PostTagEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ name: 'post_id' })
  postId: string;

  @Column({ length: 50 })
  tag: string;

  @ManyToOne(() => PostEntity, (p) => p.tags, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'post_id' })
  post: PostEntity;
}

@Entity('likes')
@Unique(['postId', 'userId'])
export class LikeEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'post_id' })
  postId: string;

  @ManyToOne(() => PostEntity, (p) => p.likes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'post_id' })
  post: PostEntity;
}

@Entity('saves')
@Unique(['postId', 'userId'])
export class SaveEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'post_id' })
  postId: string;

  @ManyToOne(() => PostEntity, (p) => p.saves, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'post_id' })
  post: PostEntity;
}

@Entity('comments')
@Index(['postId', 'createdAt'])
export class CommentEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'post_id' })
  postId: string;

  @Column({ name: 'author_id' })
  authorId: string;

  @Column({ type: 'text' })
  text: string;

  @Column({ name: 'created_at', type: 'bigint' })
  createdAt: number;

  @ManyToOne(() => PostEntity, (p) => p.comments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'post_id' })
  post: PostEntity;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'author_id' })
  author: UserEntity;
}
