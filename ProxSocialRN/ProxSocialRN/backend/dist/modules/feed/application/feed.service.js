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
exports.FeedService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const feed_entities_1 = require("../infrastructure/repositories/feed.entities");
const user_entity_1 = require("../../user/infrastructure/repositories/user.entity");
let FeedService = class FeedService {
    constructor(posts, postTags, likes, saves, comments, users) {
        this.posts = posts;
        this.postTags = postTags;
        this.likes = likes;
        this.saves = saves;
        this.comments = comments;
        this.users = users;
    }
    async getFeed(userId, limit = 20, offset = 0) {
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
    async createPost(userId, text, tags = []) {
        const post = this.posts.create({ authorId: userId, text, createdAt: Date.now() });
        const saved = await this.posts.save(post);
        if (tags.length) {
            await this.postTags.save(tags.map((tag) => this.postTags.create({ postId: saved.id, tag })));
        }
        return { id: saved.id };
    }
    async toggleLike(userId, postId) {
        const existing = await this.likes.findOne({ where: { userId, postId } });
        if (existing) {
            await this.likes.remove(existing);
        }
        else {
            await this.likes.save(this.likes.create({ userId, postId }));
        }
        const likeCount = await this.likes.count({ where: { postId } });
        return { liked: !existing, likeCount };
    }
    async toggleSave(userId, postId) {
        const existing = await this.saves.findOne({ where: { userId, postId } });
        if (existing) {
            await this.saves.remove(existing);
        }
        else {
            await this.saves.save(this.saves.create({ userId, postId }));
        }
        return { saved: !existing };
    }
    async getComments(postId) {
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
    async addComment(userId, postId, text) {
        const comment = this.comments.create({ postId, authorId: userId, text, createdAt: Date.now() });
        const saved = await this.comments.save(comment);
        return { id: saved.id };
    }
};
exports.FeedService = FeedService;
exports.FeedService = FeedService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(feed_entities_1.PostEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(feed_entities_1.PostTagEntity)),
    __param(2, (0, typeorm_1.InjectRepository)(feed_entities_1.LikeEntity)),
    __param(3, (0, typeorm_1.InjectRepository)(feed_entities_1.SaveEntity)),
    __param(4, (0, typeorm_1.InjectRepository)(feed_entities_1.CommentEntity)),
    __param(5, (0, typeorm_1.InjectRepository)(user_entity_1.UserEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], FeedService);
//# sourceMappingURL=feed.service.js.map