import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConnectionEntity } from '../infrastructure/repositories/connection.entity';
import { UserEntity } from '../../user/infrastructure/repositories/user.entity';

export type ConnectionStatus = 'none' | 'pending_sent' | 'pending_received' | 'accepted';

@Injectable()
export class ConnectionService {
  constructor(
    @InjectRepository(ConnectionEntity) private readonly repo: Repository<ConnectionEntity>,
    @InjectRepository(UserEntity) private readonly users: Repository<UserEntity>,
  ) {}

  async connect(requesterId: string, targetId: string): Promise<{ status: ConnectionStatus }> {
    if (requesterId === targetId) throw new BadRequestException('No puedes conectar contigo mismo');
    if (!(await this.users.exist({ where: { id: targetId } }))) throw new NotFoundException('Usuario no encontrado');

    const current = await this.statusWith(requesterId, targetId);
    if (current.status === 'pending_received') return this.accept(targetId, requesterId); // interés mutuo
    if (current.status !== 'none') return current;

    await this.repo.createQueryBuilder().insert()
      .values({ requesterId, targetId, status: 'pending', createdAt: Date.now() })
      .orIgnore().execute();
    return { status: 'pending_sent' };
  }

  async statusWith(me: string, other: string): Promise<{ status: ConnectionStatus }> {
    const c = await this.repo.findOne({
      where: [{ requesterId: me, targetId: other }, { requesterId: other, targetId: me }],
    });
    if (!c) return { status: 'none' };
    if (c.status === 'accepted') return { status: 'accepted' };
    return { status: c.requesterId === me ? 'pending_sent' : 'pending_received' };
  }

  async getConnections(userId: string) {
    const [sent, received] = await Promise.all([
      this.repo.find({ where: { requesterId: userId }, relations: ['target'], order: { createdAt: 'DESC' } }),
      this.repo.find({ where: { targetId: userId }, relations: ['requester'], order: { createdAt: 'DESC' } }),
    ]);
    const view = (c: ConnectionEntity, u: UserEntity) => ({
      userId: u.id, status: c.status, displayName: u.displayName, avatarSeed: u.avatarSeed, createdAt: Number(c.createdAt),
    });
    return { sent: sent.map((c) => view(c, c.target)), received: received.map((c) => view(c, c.requester)) };
  }

  async accept(requesterId: string, targetId: string): Promise<{ status: ConnectionStatus }> {
    const res = await this.repo.update({ requesterId, targetId, status: 'pending' }, { status: 'accepted' });
    if (!res.affected) throw new NotFoundException('No hay solicitud pendiente');
    return { status: 'accepted' };
  }

  async reject(requesterId: string, targetId: string) {
    await this.repo.delete({ requesterId, targetId, status: 'pending' });
    return { status: 'none' as ConnectionStatus };
  }
}
