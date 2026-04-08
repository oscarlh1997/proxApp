import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { USER_REPOSITORY, IUserRepository } from '../domain/ports/user-repository.port';
import { UpdateProfileDto, UserProfile } from '../domain/entities/user-profile';

@Injectable()
export class UserService {
  constructor(@Inject(USER_REPOSITORY) private readonly repo: IUserRepository) {}

  async getProfile(id: string): Promise<UserProfile> {
    const p = await this.repo.findById(id);
    if (!p) throw new NotFoundException('Usuario no encontrado');
    return p;
  }

  async updateProfile(id: string, dto: UpdateProfileDto): Promise<UserProfile> {
    return this.repo.update(id, dto);
  }

  async updateLocation(id: string, lat: number, lon: number): Promise<void> {
    await this.repo.updateLocation(id, lat, lon);
  }
}
