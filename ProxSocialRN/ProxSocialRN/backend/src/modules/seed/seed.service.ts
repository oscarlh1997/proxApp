import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

@Injectable()
export class SeedService {
  private logger = new Logger('Seed');

  constructor(
    @InjectRepository(UserEntity) private users: Repository<UserEntity>,
    @InjectRepository(UserInterestEntity) private interests: Repository<UserInterestEntity>,
    @InjectRepository(UserSocialLinkEntity) private socialLinks: Repository<UserSocialLinkEntity>,
    @InjectRepository(PostEntity) private posts: Repository<PostEntity>,
    @InjectRepository(PostTagEntity) private postTags: Repository<PostTagEntity>,
  ) {}

  async seed(): Promise<string> {
    const count = await this.users.count();
    if (count > 0) return 'Already seeded';

    const hash = await bcrypt.hash('test123', 10);
    const baseLat = 40.4168;
    const baseLon = -3.7038;

    for (const u of SEED_USERS) {
      const lat = baseLat + (Math.random() - 0.5) * 0.004;
      const lon = baseLon + (Math.random() - 0.5) * 0.004;

      const user = this.users.create({
        username: u.username, email: u.email, passwordHash: hash,
        displayName: u.name, bio: u.bio, avatarSeed: u.username,
        relationshipStatus: u.status, latitude: lat, longitude: lon,
        locationUpdatedAt: Date.now(), visible: true,
      });
      const saved = await this.users.save(user);

      // PostGIS location
      await this.users.createQueryBuilder()
        .update()
        .set({ location: () => `ST_SetSRID(ST_MakePoint(${lon}, ${lat}), 4326)::geography` })
        .where('id = :id', { id: saved.id })
        .execute();

      // Interests
      await this.interests.save(
        u.interests.map((tag) => this.interests.create({ userId: saved.id, tag })),
      );

      // Social links
      await this.socialLinks.save(
        u.socials.map((s) => this.socialLinks.create({ userId: saved.id, platform: s.platform, url: s.url, handle: s.handle })),
      );

      // Post
      const post = this.posts.create({ authorId: saved.id, text: u.post, createdAt: Date.now() - Math.random() * 6 * 3600000 });
      const savedPost = await this.posts.save(post);
      await this.postTags.save(
        u.interests.slice(0, 2).map((tag) => this.postTags.create({ postId: savedPost.id, tag })),
      );
    }

    this.logger.log('Seeded 6 users with profiles, social links, interests, and posts');
    return 'Seeded 6 users';
  }
}
