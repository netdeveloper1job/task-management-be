import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configuration } from './config/configuration';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { TasksModule } from './tasks/tasks.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `${process.cwd()}/src/config/${process.env.NODE_ENV}.env`,
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => config.get('database'),
      inject: [ConfigService],
    }),
    AuthModule,
    UserModule,
    TasksModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
