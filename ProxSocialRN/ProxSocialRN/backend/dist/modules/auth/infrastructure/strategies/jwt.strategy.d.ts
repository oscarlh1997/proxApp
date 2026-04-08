import { ConfigService } from '@nestjs/config';
import { Strategy } from 'passport-jwt';
import { AuthService } from '../../application/auth.service';
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private authService;
    constructor(config: ConfigService, authService: AuthService);
    validate(payload: {
        id: string;
    }): Promise<{
        id: string;
        username: string;
    }>;
}
export {};
