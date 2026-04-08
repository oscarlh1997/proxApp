import { JwtService } from '@nestjs/jwt';
import { IUserRepository } from '../../user/domain/ports/user-repository.port';
export declare class AuthService {
    private readonly userRepo;
    private readonly jwtService;
    constructor(userRepo: IUserRepository, jwtService: JwtService);
    register(dto: {
        username: string;
        email: string;
        password: string;
        displayName?: string;
    }): Promise<{
        token: string;
        user: {
            id: string;
            username: string;
            displayName: string;
        };
    }>;
    login(dto: {
        email: string;
        password: string;
    }): Promise<{
        token: string;
        user: {
            id: string;
            username: string;
            displayName: string;
        };
    }>;
    validateJwtPayload(payload: {
        id: string;
    }): Promise<{
        id: string;
        username: string;
    }>;
}
