"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeOrmConfig = void 0;
const typeOrmConfig = (config) => ({
    type: 'postgres',
    host: config.get('DB_HOST', 'localhost'),
    port: config.get('DB_PORT', 5432),
    username: config.get('DB_USER', 'proxsocial'),
    password: config.get('DB_PASSWORD', 'proxsocial_dev'),
    database: config.get('DB_NAME', 'proxsocial'),
    autoLoadEntities: true,
    synchronize: config.get('NODE_ENV') !== 'production',
    logging: config.get('NODE_ENV') === 'development' ? ['error', 'warn'] : ['error'],
});
exports.typeOrmConfig = typeOrmConfig;
//# sourceMappingURL=typeorm.config.js.map