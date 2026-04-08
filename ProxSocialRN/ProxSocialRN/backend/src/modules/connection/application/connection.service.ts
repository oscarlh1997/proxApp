import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConnectionEntity } from '../infrastructure/repositories/connection.entity';

@Injectable()
export class ConnectionService {
  constructor(
    @InjectRepository(ConnectionEntity) private readonly repo: Repository<ConnectionEntity>,
  ) {}

  async connect(requesterId: string, targetId: string) {
    if (requesterId === targetId) throw new BadRequestException('No puedes conectar contigo mismo');
    const existing = await this.repo.findOne({ where: { requesterId, targetId } });
    if (existing) return { status: 'already_exists' };
    // Check reverse direction too
    const reverse = await this.repo.findOne({ where: { requesterId: targetId, targetId: requesterId } });
    if (reverse) return { status: 'already_exists' };

    const conn = this.repo.create({ requesterId, targetId, status: 'pending', createdAt: Date.now() });
    await this.repo.save(conn);
    return { status: 'pending' };
  }

  async getConnections(userId: string) {
    const sent = await this.repo.find({ where: { requesterId: userId }, relations: ['target'] });
    const received = await this.repo.find({ where: { targetId: userId }, relations: ['requester'] });
    return {
      sent: sent.map((c) => ({
        id: c.id, targetId: c.targetId, status: c.status,
        displayName: c.target.displayName, avatarSeed: c.target.avatarSeed,
      })),
      received: received.map((c) => ({
        id: c.id, requesterId: c.requesterId, status: c.status,
        displayName: c.requester.displayName, avatarSeed: c.requester.avatarSeed,
      })),
    };
  }

  async acceptConnection(requesterId: string, targetId: string) {
    await this.repo.update(
      { requesterId, targetId },
      { status: 'accepted' },
    );
    return { ok: true };
  }
}
