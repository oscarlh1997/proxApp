import { BadRequestException, Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { UserEntity } from '../user/infrastructure/repositories/user.entity';
import { UserInterestEntity } from '../user/infrastructure/repositories/user-interest.entity';
import { UserSocialLinkEntity } from '../user/infrastructure/repositories/user-social-link.entity';
import { PostEntity, PostTagEntity } from '../feed/infrastructure/repositories/feed.entities';

const SEED_USERS = [
  { username: 'ana', email: 'ana@test.com', name: 'Ana García', bio: 'Diseñadora UX. Amante del café y el ML.', status: 'soltera', interests: ['ML', 'Café', 'UI/UX', 'Foto'], socials: [{ platform: 'instagram', url: 'https://instagram.com/ana_garcia', handle: '@ana_garcia' }, { platform: 'linkedin', url: 'https://linkedin.com/in/anagarcia', handle: 'Ana García' }], post: '¿Alguien para café y hablar de ML?' },
  { username: 'luis', email: 'luis@test.com', name: 'Luis Martín', bio: 'Runner y dev cloud. Siempre buscando trail nuevo.', status: 'en_relacion', interests: ['Trail', 'Cloud', 'Gaming'], socials: [{ platform: 'twitter', url: 'https://twitter.com/luismartin', handle: '@luismartin' }, { platform: 'strava', url: 'https://strava.com/athletes/luis', handle: 'Luis M.' }], post: 'Busco gente para correr trail este finde.' },
  { username: 'mar', email: 'mar@test.com', name: 'Mar López', bio: 'Freelance iOS/Android. Networking lover.', status: 'soltera', interests: ['iOS', 'UI/UX', 'Fintech'], socials: [{ platform: 'github', url: 'https://github.com/marlopez', handle: 'marlopez' }, { platform: 'linkedin', url: 'https://linkedin.com/in/marlopez', handle: 'Mar López' }], post: 'Estoy en el coworking: networking y UI/UX!' },
  { username: 'pablo', email: 'pablo@test.com', name: 'Pablo Ruiz', bio: 'Cloud architect. Meetup organizer.', status: 'casado', interests: ['Cloud', 'ML', 'Jazz'], socials: [{ platform: 'twitter', url: 'https://twitter.com/pabloruiz', handle: '@pabloruiz' }], post: '¿Quién va al meetup de Cloud hoy?' },
  { username: 'sara', email: 'sara@test.com', name: 'Sara Vega', bio: 'Fotógrafa y ciclista urbana. Me gusta el jazz.', status: 'es_complicado', interests: ['Foto', 'Ciclismo', 'Jazz', 'Café'], socials: [{ platform: 'instagram', url: 'https://instagram.com/saravega', handle: '@saravega' }, { platform: 'flickr', url: 'https://flickr.com/saravega', handle: 'Sara V.' }], post: 'Saliendo a hacer fotos por Malasaña. ¿Alguien se apunta?' },
  { username: 'ivan', email: 'ivan@test.com', name: 'Iván Torres', bio: 'Gamer y dev backend. Java/Kotlin.', status: 'soltero', interests: ['Gaming', 'Cloud', 'Fútbol'], socials: [{ platform: 'twitch', url: 'https://twitch.tv/ivantorres', handle: 'ivantorres' }, { platform: 'github', url: 'https://github.com/ivant', handle: 'ivant' }], post: 'Buscando equipo para hackathon de gaming este mes.' },
];

import { ProximityService } from '../proximity/application/proximity.service';
import { USER_REPOSITORY, IUserRepository } from '../user/domain/ports/user-repository.port';

const MADRID = { lat: 40.4168, lon: -3.7038 };

@Injectable()
export class SeedService {
  private logger = new Logger('Seed');

  constructor(
    @InjectRepository(UserEntity) private users: Repository<UserEntity>,
    @InjectRepository(UserInterestEntity) private interests: Repository<UserInterestEntity>,
    @InjectRepository(UserSocialLinkEntity) private socialLinks: Repository<UserSocialLinkEntity>,
    @InjectRepository(PostEntity) private posts: Repository<PostEntity>,
    @InjectRepository(PostTagEntity) private postTags: Repository<PostTagEntity>,
    @Inject(USER_REPOSITORY) private userRepo: IUserRepository,
    private proximity: ProximityService,
  ) {}

  /** Crea los usuarios demo que falten (idempotente) y los coloca en el centro de Madrid. */
  async seed(): Promise<string> {
    const hash = await bcrypt.hash('test123', 10);
    let created = 0;
    for (const u of SEED_USERS) {
      if (await this.users.exist({ where: { email: u.email } })) continue;
      const saved = await this.users.save(this.users.create({
        username: u.username, email: u.email, passwordHash: hash,
        displayName: u.name, bio: u.bio, avatarSeed: u.username,
        relationshipStatus: u.status, visible: true,
      }));
      await this.interests.insert(u.interests.map((tag) => ({ userId: saved.id, tag })));
      await this.socialLinks.insert(u.socials.map((s) => ({ userId: saved.id, ...s })));
      const post = await this.posts.save(this.posts.create({
        authorId: saved.id, text: u.post, createdAt: Date.now() - Math.round(Math.random() * 6 * 3600000),
      }));
      await this.postTags.insert(u.interests.slice(0, 2).map((tag) => ({ postId: post.id, tag })));
      created++;
    }
    await this.placeDemoUsers(MADRID.lat, MADRID.lon);
    this.logger.log(`Seed: ${created} usuarios nuevos`);
    return created ? `Creados ${created} usuarios demo` : 'Usuarios demo ya existían; ubicaciones renovadas';
  }

  /** Solo desarrollo: mueve a los usuarios demo a tu alrededor para poder probar el radar con GPS real. */
  async bringDemoUsersNear(userId: string): Promise<string> {
    const loc = await this.userRepo.getLocation(userId);
    if (!loc) throw new BadRequestException('Activa la ubicación antes de traer usuarios demo');
    const n = await this.placeDemoUsers(loc.lat, loc.lon, userId);
    return `${n} usuarios demo colocados a tu alrededor`;
  }

  private async placeDemoUsers(lat: number, lon: number, excludeId?: string): Promise<number> {
    const demo = await this.users.find({ where: { email: In(SEED_USERS.map((u) => u.email)) }, select: ['id'] });
    const targets = demo.filter((d) => d.id !== excludeId);
    // ~±150 m alrededor del punto
    await Promise.all(targets.map((d) => this.proximity.updateLocation(
      d.id, lat + (Math.random() - 0.5) * 0.0027, lon + (Math.random() - 0.5) * 0.0035,
    )));
    return targets.length;
  }
}
