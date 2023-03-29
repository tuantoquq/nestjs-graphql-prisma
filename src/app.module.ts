import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './models/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { APP_PIPE } from '@nestjs/core';
import { errorFormatter } from './common/middlewares/error-format.middleware';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: './src/schema.graphql',
      sortSchema: true,
      buildSchemaOptions: {
        numberScalarMode: 'integer',
      },
      installSubscriptionHandlers: true,
      playground: true,
      context: ({ req }) => ({ req }),
      csrfPrevention: false,
      formatError: errorFormatter,
    }),
    PrismaModule,
    AuthModule,
    UserModule,
    JwtModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
      }),
    },
  ],
})
export class AppModule {}
