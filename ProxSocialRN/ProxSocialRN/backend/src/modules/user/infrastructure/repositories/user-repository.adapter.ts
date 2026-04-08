import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IUserRepository } from '../../domain/ports/user-repository.port';
import { UserProfile, UpdateProfileDto, SocialLink } from '../../domain/entities/user-profile';
import { UserEntity } from './user.entity';
import { UserInterestEntity } from './user-interest.entity';
import { UserSocialLinkEntity } from './user-social-link.entity';

@Injectable()
export class UserRepositoryAdapter implements IUserRepository {
  constructor(
    @InjectRepository(UserEntity) private readonly users: Repository<UserEntity>,
    @InjectRepository(UserInterestEntity) private readonly interests: Repository<UserInterestEntity>,
    @InjectRepository(UserSocialLinkEntity) private readonly socialLinks: Repository<UserSocialLinkEntity>,
  ) {}

  async findById(id: string): Promise<UserProfile | null> {
    const u = await this.users.findOne({ where: { id } });
    if (!u) return null;
    return this.toProfile(u);
  }

  async findByEmail(email: string): Promise<(UserProfile & { passwordHash: string }) | null> {
    const u = await this.users.findOne({ where: { email } });
    if (!u) return null;
    const profile = await this.toProfile(u);
    return { ...profile, passwordHash: u.passwordHash };
  }

  async findByUsername(username: string): Promise<UserProfile | null> {
    const u = await this.users.findOne({ where: { username } });
    if (!u) return null;
    return this.toProfile(u);
  }

  async create(data: { username: string; email: string; passwordHash: string; displayName: string; avatarSeed: string }): Promise<UserProfile> {
    const entity = this.users.create({
      username: data.username,
      email: data.email,
      passwordHash: data.passwordHash,
      displayName: data.displayName,
      avatarSeed: data.avatarSeed,
    });
    const saved = await this.users.save(entity);
    return this.toProfile(saved);
  }

  async update(id: string, data: UpdateProfileDto): Promise<UserProfile> {
    const updates: Partial<UserEntity> = {};
    if (data.displayName !== undefined) updates.displayName = data.displayName;
    if (data.bio !== undefined) updates.bio = data.bio;
    if (data.avatarSeed !== undefined) updates.avatarSeed = data.avatarSeed;
    if (data.relationshipStatus !== undefined) updates.relationshipStatus = data.relationshipStatus;
    if (data.visible !== undefined) updates.visible = data.visible;

    if (Object.keys(updates).length > 0) {
      await this.users.update(id, updates);
    }

    if (data.interests !== undefined) {
      await this.interests.delete({ userId: id });
      if (data.interests.length > 0) {
        await this.interests.save(
          data.interests.map((tag) => this.interests.create({ userId: id, tag })),
        );
      }
    }

    if (data.socialLinks !== undefined) {
      await this.socialLinks.delete({ userId: id });
      if (data.socialLinks.length > 0) {
        await this.socialLinks.save(
          data.socialLinks.map((l) =>
            this.socialLinks.create({ userId: id, platform: l.platform, url: l.url, handle: l.handle }),
          ),
        );
      }
    }

    return this.findById(id) as Promise<UserProfile>;
  }

  async updateLocation(id: string, lat: number, lon: number): Promise<void> {
    await this.users
      .createQueryBuilder()
      .update()
      .set({
        latitude: lat,
        longitude: lon,
        location: () => `ST_SetSRID(ST_MakePoint(${lon}, ${lat}), 4326)::geography`,
        locationUpdatedAt: Date.now(),
      })
      .where('id = :id', { id })
      .execute();
  }

  async findNearby(
    lat: number, lon: number, radiusKm: number, excludeId: string, userIds?: string[],
  ): Promise<(UserProfile & { distanceM: number })[]> {
    const radiusM = radiusKm * 1000;
    let qb = this.users
      .createQueryBuilder('u')
      .addSelect(
        `ST_Distance(u.location, ST_SetSRID(ST_MakePoint(:lon, :lat), 4326)::geography)`,
        'distance_m',
      )
      .where('u.id != :excludeId')
      .andWhere('u.visible = true')
      .andWhere('u.location IS NOT NULL')
      .andWhere(
        `ST_DWithin(u.location, ST_SetSRID(ST_MakePoint(:lon, :lat), 4326)::geography, :radiusM)`,
      )
      .andWhere('u.location_updated_at > :staleTs')
      .setParameters({ lat, lon, excludeId, radiusM, staleTs: Date.now() - 30 * 60 * 1000 })
      .orderBy('distance_m', 'ASC')
      .limit(100);

    if (userIds?.length) {
      qb = qb.andWhere('u.id IN (:...userIds)', { userIds });
    }

    const raw = await qb.getRawAndEntities();

    return Promise.all(
      raw.entities.map(async (entity, i) => {
        const profile = await this.toProfile(entity);
        const distanceM = Math.round(parseFloat(raw.raw[i].distance_m || '0'));
        return { ...profile, distanceM };
      }),
    );
  }

  private async toProfile(u: UserEntity): Promise<UserProfile> {
    const ints = await this.interests.find({ where: { userId: u.id } });
    const links = await this.socialLinks.find({ where: { userId: u.id } });

    return {
      id: u.id,
      username: u.username,
      displayName: u.displayName,
      bio: u.bio,
      avatarSeed: u.avatarSeed,
      relationshipStatus: u.relationshipStatus as any,
      interests: ints.map((i) => i.tag),
      socialLinks: links.map((l) => ({ id: l.id, platform: l.platform, url: l.url, handle: l.handle })),
      visible: u.visible,
      latitude: u.latitude,
      longitude: u.longitude,
    };
  }
}
