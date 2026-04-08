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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcryptjs");
const user_repository_port_1 = require("../../user/domain/ports/user-repository.port");
let AuthService = class AuthService {
    constructor(userRepo, jwtService) {
        this.userRepo = userRepo;
        this.jwtService = jwtService;
    }
    async register(dto) {
        const existing = await this.userRepo.findByEmail(dto.email);
        if (existing)
            throw new common_1.ConflictException('Email ya registrado');
        const existingUsername = await this.userRepo.findByUsername(dto.username);
        if (existingUsername)
            throw new common_1.ConflictException('Username ya existe');
        const passwordHash = await bcrypt.hash(dto.password, 10);
        const user = await this.userRepo.create({
            username: dto.username,
            email: dto.email,
            passwordHash,
            displayName: dto.displayName || dto.username,
            avatarSeed: dto.username.toLowerCase().slice(0, 8),
        });
        return {
            token: this.jwtService.sign({ id: user.id }),
            user: { id: user.id, username: user.username, displayName: user.displayName },
        };
    }
    async login(dto) {
        const user = await this.userRepo.findByEmail(dto.email);
        if (!user)
            throw new common_1.UnauthorizedException('Credenciales inválidas');
        const valid = await bcrypt.compare(dto.password, user.passwordHash);
        if (!valid)
            throw new common_1.UnauthorizedException('Credenciales inválidas');
        return {
            token: this.jwtService.sign({ id: user.id }),
            user: { id: user.id, username: user.username, displayName: user.displayName },
        };
    }
    async validateJwtPayload(payload) {
        const user = await this.userRepo.findById(payload.id);
        if (!user)
            throw new common_1.UnauthorizedException();
        return { id: user.id, username: user.username };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(user_repository_port_1.USER_REPOSITORY)),
    __metadata("design:paramtypes", [Object, jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map