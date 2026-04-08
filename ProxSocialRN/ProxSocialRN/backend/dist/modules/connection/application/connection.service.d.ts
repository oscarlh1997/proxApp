import { Repository } from 'typeorm';
import { ConnectionEntity } from '../infrastructure/repositories/connection.entity';
export declare class ConnectionService {
    private readonly repo;
    constructor(repo: Repository<ConnectionEntity>);
    connect(requesterId: string, targetId: string): Promise<{
        status: string;
    }>;
    getConnections(userId: string): Promise<{
        sent: {
            id: string;
            targetId: string;
            status: string;
            displayName: string;
            avatarSeed: string;
        }[];
        received: {
            id: string;
            requesterId: string;
            status: string;
            displayName: string;
            avatarSeed: string;
        }[];
    }>;
    acceptConnection(requesterId: string, targetId: string): Promise<{
        ok: boolean;
    }>;
}
