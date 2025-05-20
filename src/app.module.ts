import { join } from 'path';

import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ItemsModule } from './items/items.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      logging: true,
      logger: "file",
      synchronize: true,
      autoLoadEntities: true,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      // debug: false,
      playground: false,
      autoSchemaFile: join( process.cwd(), 'src/schema.gql'),
      plugins: [
        ApolloServerPluginLandingPageLocalDefault()
      ]
    }),
    ItemsModule,
    UsersModule,
    AuthModule,
    CommonModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {

  constructor() {
    console.log('Variables de entorno');
    console.log("STATE",  process.env.STATE );
    console.log("host",  process.env.DB_HOST );
    console.log("port",  process.env.DB_PORT );
    console.log("username",  process.env.DB_USERNAME );
    console.log("password",  process.env.DB_PASSWORD );
    console.log("database",  process.env.DB_NAME );
    console.log("jwt_expiration",  process.env.JWT_EXPIRATION );
  }
}
