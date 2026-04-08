import { ConflictException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { USER_REPOSITORY, IUserRepository } from '../../user/domain/ports/user-repository.port';

@Injectable()
export class AuthService {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepo: IUserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: { username: string; email: string; password: string; displayName?: string }) {
    const existing = await this.userRepo.findByEmail(dto.email);
    if (existing) throw new ConflictException('Email ya registrado');
    const existingUsername = await this.userRepo.findByUsername(dto.username);
    if (existingUsername) throw new ConflictException('Username ya existe');

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

  async login(dto: { email: string; password: string }) {
    const user = await this.userRepo.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Credenciales inválidas');

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Credenciales inválidas');

    return {
      token: this.jwtService.sign({ id: user.id }),
      user: { id: user.id, username: user.username, displayName: user.displayName },
    };
  }

  async validateJwtPayload(payload: { id: string }) {
    const user = await this.userRepo.findById(payload.id);
    if (!user) throw new UnauthorizedException();
    return { id: user.id, username: user.username };
  }
}
