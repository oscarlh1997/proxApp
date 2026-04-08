import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '../../../user/infrastructure/repositories/user.entity';

@Entity('connections')
export class ConnectionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'requester_id' })
  requesterId: string;

  @Column({ name: 'target_id' })
  targetId: string;

  @Column({ length: 20, default: 'pending' })
  status: string; // pending | accepted | rejected

  @Column({ name: 'created_at', type: 'bigint' })
  createdAt: number;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'requester_id' })
  requester: UserEntity;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'target_id' })
  target: UserEntity;
}
