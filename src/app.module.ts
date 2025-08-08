import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { IamModule } from './iam/iam.module';
import { OpenaiModule } from './openai/openai.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: process.env.TYPEORM_HOST,
        port: process.env.TYPEORM_PORT
          ? parseInt(process.env.TYPEORM_PORT, 10)
          : 5432,
        username: process.env.TYPEORM_USERNAME,
        password: process.env.TYPEORM_PASSWORD,
        database: process.env.TYPEORM_DATABASE,
        synchronize: true,
        entities: [__dirname + '/**/*.{model,entity}.{ts,js}'],
        migrations: ['dist/migrations/**/*.js'],
        subscribers: ['dist/subscriber/**/*.js'],
        cli: {
          migrationsDir: process.env.TYPEORM_MIGRATIONS_DIR,
          subscribersDir: process.env.TYPEORM_SUBSCRIBERS_DIR,
        },
      }),
    }),
    IamModule,
    UsersModule,
    OpenaiModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
