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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentEntity = exports.SaveEntity = exports.LikeEntity = exports.PostTagEntity = exports.PostEntity = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../../user/infrastructure/repositories/user.entity");
let PostEntity = class PostEntity {
};
exports.PostEntity = PostEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], PostEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'author_id' }),
    __metadata("design:type", String)
], PostEntity.prototype, "authorId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], PostEntity.prototype, "text", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'image_url', type: 'varchar', nullable: true }),
    __metadata("design:type", Object)
], PostEntity.prototype, "imageUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'created_at', type: 'bigint' }),
    __metadata("design:type", Number)
], PostEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.UserEntity, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'author_id' }),
    __metadata("design:type", user_entity_1.UserEntity)
], PostEntity.prototype, "author", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => PostTagEntity, (t) => t.post, { cascade: true }),
    __metadata("design:type", Array)
], PostEntity.prototype, "tags", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => LikeEntity, (l) => l.post),
    __metadata("design:type", Array)
], PostEntity.prototype, "likes", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => SaveEntity, (s) => s.post),
    __metadata("design:type", Array)
], PostEntity.prototype, "saves", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => CommentEntity, (c) => c.post),
    __metadata("design:type", Array)
], PostEntity.prototype, "comments", void 0);
exports.PostEntity = PostEntity = __decorate([
    (0, typeorm_1.Entity)('posts')
], PostEntity);
let PostTagEntity = class PostTagEntity {
};
exports.PostTagEntity = PostTagEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], PostTagEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'post_id' }),
    __metadata("design:type", String)
], PostTagEntity.prototype, "postId", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50 }),
    __metadata("design:type", String)
], PostTagEntity.prototype, "tag", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => PostEntity, (p) => p.tags, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'post_id' }),
    __metadata("design:type", PostEntity)
], PostTagEntity.prototype, "post", void 0);
exports.PostTagEntity = PostTagEntity = __decorate([
    (0, typeorm_1.Entity)('post_tags')
], PostTagEntity);
let LikeEntity = class LikeEntity {
};
exports.LikeEntity = LikeEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], LikeEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id' }),
    __metadata("design:type", String)
], LikeEntity.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'post_id' }),
    __metadata("design:type", String)
], LikeEntity.prototype, "postId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => PostEntity, (p) => p.likes, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'post_id' }),
    __metadata("design:type", PostEntity)
], LikeEntity.prototype, "post", void 0);
exports.LikeEntity = LikeEntity = __decorate([
    (0, typeorm_1.Entity)('likes')
], LikeEntity);
let SaveEntity = class SaveEntity {
};
exports.SaveEntity = SaveEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], SaveEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id' }),
    __metadata("design:type", String)
], SaveEntity.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'post_id' }),
    __metadata("design:type", String)
], SaveEntity.prototype, "postId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => PostEntity, (p) => p.saves, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'post_id' }),
    __metadata("design:type", PostEntity)
], SaveEntity.prototype, "post", void 0);
exports.SaveEntity = SaveEntity = __decorate([
    (0, typeorm_1.Entity)('saves')
], SaveEntity);
let CommentEntity = class CommentEntity {
};
exports.CommentEntity = CommentEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], CommentEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'post_id' }),
    __metadata("design:type", String)
], CommentEntity.prototype, "postId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'author_id' }),
    __metadata("design:type", String)
], CommentEntity.prototype, "authorId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], CommentEntity.prototype, "text", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'created_at', type: 'bigint' }),
    __metadata("design:type", Number)
], CommentEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => PostEntity, (p) => p.comments, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'post_id' }),
    __metadata("design:type", PostEntity)
], CommentEntity.prototype, "post", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.UserEntity, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'author_id' }),
    __metadata("design:type", user_entity_1.UserEntity)
], CommentEntity.prototype, "author", void 0);
exports.CommentEntity = CommentEntity = __decorate([
    (0, typeorm_1.Entity)('comments')
], CommentEntity);
//# sourceMappingURL=feed.entities.js.map