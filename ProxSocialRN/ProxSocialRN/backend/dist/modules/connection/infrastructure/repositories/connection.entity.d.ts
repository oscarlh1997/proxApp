import { UserEntity } from '../../../user/infrastructure/repositories/user.entity';
export declare class ConnectionEntity {
    id: string;
    requesterId: string;
    targetId: string;
    status: string;
    createdAt: number;
    requester: UserEntity;
    target: UserEntity;
}
