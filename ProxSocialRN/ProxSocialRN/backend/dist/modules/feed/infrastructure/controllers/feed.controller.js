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
exports.FeedController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const swagger_1 = require("@nestjs/swagger");
const current_user_decorator_1 = require("../../../../common/decorators/current-user.decorator");
const feed_service_1 = require("../../application/feed.service");
let FeedController = class FeedController {
    constructor(feedService) {
        this.feedService = feedService;
    }
    getFeed(userId, limit, offset) {
        return this.feedService.getFeed(userId, parseInt(limit || '20'), parseInt(offset || '0'));
    }
    createPost(userId, body) {
        return this.feedService.createPost(userId, body.text, body.tags);
    }
    toggleLike(userId, postId) {
        return this.feedService.toggleLike(userId, postId);
    }
    toggleSave(userId, postId) {
        return this.feedService.toggleSave(userId, postId);
    }
    getComments(postId) {
        return this.feedService.getComments(postId);
    }
    addComment(userId, postId, body) {
        return this.feedService.addComment(userId, postId, body.text);
    }
};
exports.FeedController = FeedController;
__decorate([
    (0, common_1.Get)('feed'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('offset')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], FeedController.prototype, "getFeed", null);
__decorate([
    (0, common_1.Post)('posts'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], FeedController.prototype, "createPost", null);
__decorate([
    (0, common_1.Post)('posts/:id/like'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], FeedController.prototype, "toggleLike", null);
__decorate([
    (0, common_1.Post)('posts/:id/save'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], FeedController.prototype, "toggleSave", null);
__decorate([
    (0, common_1.Get)('posts/:id/comments'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FeedController.prototype, "getComments", null);
__decorate([
    (0, common_1.Post)('posts/:id/comments'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], FeedController.prototype, "addComment", null);
exports.FeedController = FeedController = __decorate([
    (0, swagger_1.ApiTags)('feed'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Controller)('api'),
    __metadata("design:paramtypes", [feed_service_1.FeedService])
], FeedController);
//# sourceMappingURL=feed.controller.js.map