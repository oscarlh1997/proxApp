import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { IUserRepository } from '../../domain/ports/user-repository.port';
import { UserProfile, UpdateProfileDto, RelationshipStatus } from '../../domain/entities/user-profile';
import { UserEntity } from './user.entity';
import { UserInterestEntity } from './user-interest.entity';
import { UserSocialLinkEntity } from './user-social-link.entity';

const STALE_MS = 30 * 60 * 1000;

@Injectable()
export class UserRepositoryAdapter implements IUserRepository {
  constructor(
    @InjectRepository(UserEntity) private readonly users: Repository<UserEntity>,
    @InjectRepository(UserInterestEntity) private readonly interests: Repository<UserInterestEntity>,
    @InjectRepository(UserSocialLinkEntity) private readonly socialLinks: Repository<UserSocialLinkEntity>,
  ) {}

  async findById(id: string): Promise<UserProfile | null> {
    const u = await this.users.findOne({ where: { id } });
    return u ? (await this.toProfiles([u]))[0] : null;
  }

  async findByEmail(email: string) {
    const u = await this.users.findOne({ where: { email: email.toLowerCase() } });
    if (!u) return null;
    const [profile] = await this.toProfiles([u]);
    return { ...profile, passwordHash: u.passwordHash };
  }

  async findByUsername(username: string): Promise<UserProfile | null> {
    const u = await this.users.findOne({ where: { username } });
    return u ? (await this.toProfiles([u]))[0] : null;
  }

  async create(data: { username: string; email: string; passwordHash: string; displayName: string; avatarSeed: string }) {
    const saved = await this.users.save(this.users.create({ ...data, email: data.email.toLowerCase() }));
    return (await this.toProfiles([saved]))[0];
  }

  async update(id: string, data: UpdateProfileDto): Promise<UserProfile> {
    await this.users.manager.transaction(async (tx) => {
      const updates: Partial<UserEntity> = {};
      if (data.displayName !== undefined) updates.displayName = data.displayName;
      if (data.bio !== undefined) updates.bio = data.bio;
      if (data.avatarSeed !== undefined) updates.avatarSeed = data.avatarSeed;
      if (data.relationshipStatus !== undefined) updates.relationshipStatus = data.relationshipStatus;
      if (data.visible !== undefined) updates.visible = data.visible;
      if (Object.keys(updates).length > 0) await tx.update(UserEntity, id, updates);

      if (data.interests !== undefined) {
        await tx.delete(UserInterestEntity, { userId: id });
        const unique = [...new Set(data.interests)];
        if (unique.length) await tx.insert(UserInterestEntity, unique.map((tag) => ({ userId: id, tag })));
      }
      if (data.socialLinks !== undefined) {
        await tx.delete(UserSocialLinkEntity, { userId: id });
        if (data.socialLinks.length) {
          await tx.insert(UserSocialLinkEntity, data.socialLinks.map((l) => ({
            userId: id, platform: l.platform, url: l.url, handle: l.handle ?? '',
          })));
        }
      }
    });
    return (await this.findById(id))!;
  }

  async updateLocation(id: string, lat: number, lon: number): Promise<void> {
    // Parámetros enlazados: nunca interpolar coordenadas en el SQL
    await this.users.query(
      `UPDATE users SET latitude = $1, longitude = $2,
         location = ST_SetSRID(ST_MakePoint($2, $1), 4326)::geography,
         location_updated_at = $3
       WHERE id = $4`,
      [lat, lon, Date.now(), id],
    );
  }

  async getLocation(id: string): Promise<{ lat: number; lon: number } | null> {
    const u = await this.users.findOne({ where: { id }, select: ['latitude', 'longitude'] });
    return u?.latitude != null && u.longitude != null ? { lat: u.latitude, lon: u.longitude } : null;
  }

  async findNearby(lat: number, lon: number, radiusKm: number, excludeId: string, userIds?: string[]) {
    const qb = this.users
      .createQueryBuilder('u')
      .addSelect('ST_Distance(u.location, ST_SetSRID(ST_MakePoint(:lon, :lat), 4326)::geography)', 'distance_m')
      .where('u.id != :excludeId')
      .andWhere('u.visible = true')
      .andWhere('u.location IS NOT NULL')
      .andWhere('ST_DWithin(u.location, ST_SetSRID(ST_MakePoint(:lon, :lat), 4326)::geography, :radiusM)')
      .andWhere('u.location_updated_at > :staleTs')
      .setParameters({ lat, lon, excludeId, radiusM: radiusKm * 1000, staleTs: Date.now() - STALE_MS })
      .orderBy('distance_m', 'ASC')
      .limit(100);
    if (userIds?.length) qb.andWhere('u.id IN (:...userIds)', { userIds });

    const { entities, raw } = await qb.getRawAndEntities();
    const profiles = await this.toProfiles(entities);
    // Redondeo a 10 m: dificulta triangular la posición exacta de alguien
    return profiles.map((p, i) => ({
      ...p,
      distanceM: Math.max(10, Math.round(parseFloat(raw[i].distance_m || '0') / 10) * 10),
    }));
  }

  /** Carga intereses y redes de todos los usuarios en 2 consultas (evita N+1). */
  private async toProfiles(users: UserEntity[]): Promise<UserProfile[]> {
    if (!users.length) return [];
    const ids = users.map((u) => u.id);
    const [ints, links] = await Promise.all([
      this.interests.find({ where: { userId: In(ids) } }),
      this.socialLinks.find({ where: { userId: In(ids) } }),
    ]);
    return users.map((u) => ({
      id: u.id,
      username: u.username,
      displayName: u.displayName,
      bio: u.bio,
      avatarSeed: u.avatarSeed,
      relationshipStatus: u.relationshipStatus as RelationshipStatus,
      interests: ints.filter((i) => i.userId === u.id).map((i) => i.tag),
      socialLinks: links.filter((l) => l.userId === u.id)
        .map((l) => ({ id: l.id, platform: l.platform, url: l.url, handle: l.handle })),
      visible: u.visible,
    }));
  }
}
