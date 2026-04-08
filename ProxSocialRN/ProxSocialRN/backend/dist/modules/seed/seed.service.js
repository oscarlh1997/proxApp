"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeedService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = require("bcryptjs");
const user_entity_1 = require("../user/infrastructure/repositories/user.entity");
const user_interest_entity_1 = require("../user/infrastructure/repositories/user-interest.entity");
const user_social_link_entity_1 = require("../user/infrastructure/repositories/user-social-link.entity");
const feed_entities_1 = require("../feed/infrastructure/repositories/feed.entities");
const SEED_USERS = [
    { username: 'ana', email: 'ana@test.com', name: 'Ana García', bio: 'Diseñadora UX. Amante del café y el ML.', status: 'soltera', interests: ['ML', 'Café', 'UI/UX', 'Foto'], socials: [{ platform: 'instagram', url: 'https://instagram.com/ana_garcia', handle: '@ana_garcia' }, { platform: 'linkedin', url: 'https://linkedin.com/in/anagarcia', handle: 'Ana García' }], post: '¿Alguien para café y hablar de ML?' },
    { username: 'luis', email: 'luis@test.com', name: 'Luis Martín', bio: 'Runner y dev cloud. Siempre buscando trail nuevo.', status: 'en_relacion', interests: ['Trail', 'Cloud', 'Gaming'], socials: [{ platform: 'twitter', url: 'https://twitter.com/luismartin', handle: '@luismartin' }, { platform: 'strava', url: 'https://strava.com/athletes/luis', handle: 'Luis M.' }], post: 'Busco gente para correr trail este finde.' },
    { username: 'mar', email: 'mar@test.com', name: 'Mar López', bio: 'Freelance iOS/Android. Networking lover.', status: 'soltera', interests: ['iOS', 'UI/UX', 'Fintech'], socials: [{ platform: 'github', url: 'https://github.com/marlopez', handle: 'marlopez' }, { platform: 'linkedin', url: 'https://linkedin.com/in/marlopez', handle: 'Mar López' }], post: 'Estoy en el coworking: networking y UI/UX!' },
    { username: 'pablo', email: 'pablo@test.com', name: 'Pablo Ruiz', bio: 'Cloud architect. Meetup organizer.', status: 'casado', interests: ['Cloud', 'ML', 'Jazz'], socials: [{ platform: 'twitter', url: 'https://twitter.com/pabloruiz', handle: '@pabloruiz' }], post: '¿Quién va al meetup de Cloud hoy?' },
    { username: 'sara', email: 'sara@test.com', name: 'Sara Vega', bio: 'Fotógrafa y ciclista urbana. Me gusta el jazz.', status: 'es_complicado', interests: ['Foto', 'Ciclismo', 'Jazz', 'Café'], socials: [{ platform: 'instagram', url: 'https://instagram.com/saravega', handle: '@saravega' }, { platform: 'flickr', url: 'https://flickr.com/saravega', handle: 'Sara V.' }], post: 'Saliendo a hacer fotos por Malasaña. ¿Alguien se apunta?' },
    { username: 'ivan', email: 'ivan@test.com', name: 'Iván Torres', bio: 'Gamer y dev backend. Java/Kotlin.', status: 'soltero', interests: ['Gaming', 'Cloud', 'Fútbol'], socials: [{ platform: 'twitch', url: 'https://twitch.tv/ivantorres', handle: 'ivantorres' }, { platform: 'github', url: 'https://github.com/ivant', handle: 'ivant' }], post: 'Buscando equipo para hackathon de gaming este mes.' },
];
let SeedService = class SeedService {
    constructor(users, interests, socialLinks, posts, postTags) {
        this.users = users;
        this.interests = interests;
        this.socialLinks = socialLinks;
        this.posts = posts;
        this.postTags = postTags;
        this.logger = new common_1.Logger('Seed');
    }
    async seed() {
        const count = await this.users.count();
        if (count > 0)
            return 'Already seeded';
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
            await this.users.createQueryBuilder()
                .update()
                .set({ location: () => `ST_SetSRID(ST_MakePoint(${lon}, ${lat}), 4326)::geography` })
                .where('id = :id', { id: saved.id })
                .execute();
            await this.interests.save(u.interests.map((tag) => this.interests.create({ userId: saved.id, tag })));
            await this.socialLinks.save(u.socials.map((s) => this.socialLinks.create({ userId: saved.id, platform: s.platform, url: s.url, handle: s.handle })));
            const post = this.posts.create({ authorId: saved.id, text: u.post, createdAt: Date.now() - Math.random() * 6 * 3600000 });
            const savedPost = await this.posts.save(post);
            await this.postTags.save(u.interests.slice(0, 2).map((tag) => this.postTags.create({ postId: savedPost.id, tag })));
        }
        this.logger.log('Seeded 6 users with profiles, social links, interests, and posts');
        return 'Seeded 6 users';
    }
};
exports.SeedService = SeedService;
exports.SeedService = SeedService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.UserEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(user_interest_entity_1.UserInterestEntity)),
    __param(2, (0, typeorm_1.InjectRepository)(user_social_link_entity_1.UserSocialLinkEntity)),
    __param(3, (0, typeorm_1.InjectRepository)(feed_entities_1.PostEntity)),
    __param(4, (0, typeorm_1.InjectRepository)(feed_entities_1.PostTagEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], SeedService);
//# sourceMappingURL=seed.service.js.map