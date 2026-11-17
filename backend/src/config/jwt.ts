import { ConfigService } from '@nestjs/config';

// Un único origen del secreto: antes el chat usaba otro valor y los sockets se desconectaban
export const jwtSecret = (config: ConfigService) =>
  config.get<string>('JWT_SECRET') || 'proxsocial-dev-secret-cambiar-en-produccion';
