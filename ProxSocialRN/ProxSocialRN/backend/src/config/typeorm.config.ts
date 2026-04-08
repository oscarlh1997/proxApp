import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export const typeOrmConfig = (config: ConfigService): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: config.get('DB_HOST', 'localhost'),
  port: config.get<number>('DB_PORT', 5432),
  username: config.get('DB_USER', 'proxsocial'),
  password: config.get('DB_PASSWORD', 'proxsocial_dev'),
  database: config.get('DB_NAME', 'proxsocial'),
  autoLoadEntities: true,
  synchronize: config.get('NODE_ENV') !== 'production', // migrations en prod
  logging: config.get('NODE_ENV') === 'development' ? ['error', 'warn'] : ['error'],
});
