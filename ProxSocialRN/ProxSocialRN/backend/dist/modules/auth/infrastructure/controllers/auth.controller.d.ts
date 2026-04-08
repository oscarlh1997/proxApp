import { AuthService } from '../../application/auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(body: {
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
    login(body: {
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
}
