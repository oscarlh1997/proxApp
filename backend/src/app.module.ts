import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { typeOrmConfig } from './config/typeorm.config';
import { RedisModule } from './config/redis.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { ProximityModule } from './modules/proximity/proximity.module';
import { FeedModule } from './modules/feed/feed.module';
import { MessagingModule } from './modules/messaging/messaging.module';
import { ConnectionModule } from './modules/connection/connection.module';
import { SeedModule } from './modules/seed/seed.module';

@Module({
  imports: [
    // Config
    ConfigModule.forRoot({ isGlobal: true }),

    // Database (PostgreSQL + PostGIS)
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: typeOrmConfig,
    }),

    // Redis (global)
    RedisModule,

    // Rate limiting
    ThrottlerModule.forRoot([{
      ttl: 60000,  // 1 minuto
      limit: 300,  // por IP; el radar y el chat hacen polling
    }]),

    // Feature modules (hexagonal)
    AuthModule,
    UserModule,
    ProximityModule,
    FeedModule,
    MessagingModule,
    ConnectionModule,
    SeedModule,
  ],
  // Sin este guard el ThrottlerModule no limita nada
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
