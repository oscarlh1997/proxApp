import {
  Column, CreateDateColumn, Entity, Index, OneToMany, PrimaryGeneratedColumn,
} from 'typeorm';
import { UserInterestEntity } from './user-interest.entity';
import { UserSocialLinkEntity } from './user-social-link.entity';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 50 })
  username: string;

  @Column({ unique: true, length: 255 })
  email: string;

  @Column({ name: 'password_hash' })
  passwordHash: string;

  @Column({ name: 'display_name', length: 100, default: '' })
  displayName: string;

  @Column({ type: 'text', default: '' })
  bio: string;

  @Column({ name: 'avatar_seed', length: 50, default: '' })
  avatarSeed: string;

  @Column({ name: 'relationship_status', length: 30, default: 'no_especificado' })
  relationshipStatus: string;

  // PostGIS geography point for ultra-fast proximity queries
  @Index({ spatial: true })
  @Column({
    type: 'geography',
    spatialFeatureType: 'Point',
    srid: 4326,
    nullable: true,
  })
  location: string | null; // GeoJSON or WKT

  @Column({ type: 'double precision', nullable: true })
  latitude: number | null;

  @Column({ type: 'double precision', nullable: true })
  longitude: number | null;

  @Column({ name: 'location_updated_at', type: 'bigint', nullable: true })
  locationUpdatedAt: number | null;

  @Column({ default: true })
  visible: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => UserInterestEntity, (i) => i.user, { cascade: true, eager: false })
  interests: UserInterestEntity[];

  @OneToMany(() => UserSocialLinkEntity, (l) => l.user, { cascade: true, eager: false })
  socialLinks: UserSocialLinkEntity[];
}
