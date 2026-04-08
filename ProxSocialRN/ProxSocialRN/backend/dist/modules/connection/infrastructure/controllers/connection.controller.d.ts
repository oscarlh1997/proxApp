import { ConnectionService } from '../../application/connection.service';
export declare class ConnectionController {
    private readonly connectionService;
    constructor(connectionService: ConnectionService);
    connect(me: string, targetId: string): Promise<{
        status: string;
    }>;
    getConnections(me: string): Promise<{
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
    accept(me: string, requesterId: string): Promise<{
        ok: boolean;
    }>;
}
