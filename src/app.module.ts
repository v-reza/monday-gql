import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './resource/users/users.module';
import { ProfileModule } from './resource/profile/profile.module';
import { SequelizeModule } from '@nestjs/sequelize';
import sequelizeConfig from './config/sequelize.config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { User } from './resource/users/entities/user.entity';
import { Profile } from './resource/profile/entities/profile.entity';

@Module({
  imports: [
    UsersModule,
    ProfileModule,
    SequelizeModule.forRoot({
      ...sequelizeConfig,
      models: [User, Profile],
      autoLoadModels: true,
    }),
    SequelizeModule.forFeature([User, Profile]),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      typePaths: ['./**/*.graphql'],
      playground: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
