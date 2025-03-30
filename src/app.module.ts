import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { MemoriesModule } from './memories/memories.module';
import { UsersModule } from './users/users.module';
import { MyLoggerModule } from './my-logger/my-logger.module';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.development.local'],
    }),
    MemoriesModule,
    UsersModule,
    MyLoggerModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
