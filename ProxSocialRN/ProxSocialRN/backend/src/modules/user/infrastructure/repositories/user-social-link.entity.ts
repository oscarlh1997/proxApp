import { Column, Entity, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('user_social_links')
export class UserSocialLinkEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ length: 30 })
  platform: string;

  @Column({ length: 500 })
  url: string;

  @Column({ length: 100, default: '' })
  handle: string;

  @ManyToOne(() => UserEntity, (u) => u.socialLinks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
}
