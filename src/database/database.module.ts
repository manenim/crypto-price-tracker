import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.getOrThrow('DB_HOST'),
        port: configService.getOrThrow('DB_PORT'),
        username: configService.getOrThrow('DB_USERNAME'),
        password: configService.getOrThrow('DB_PASSWORD'),
        database: configService.getOrThrow('DB_NAME'),
        autoLoadEntities: true,
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}

// import { Module } from '@nestjs/common';
// import { MongooseModule } from '@nestjs/mongoose';
// import { ModelDefinition } from '@nestjs/mongoose/dist/interfaces/model-definition.interface';

// @Module({
//   imports: [
//     MongooseModule.forRoot('mongodb://localhost/nest'),
//   ],
// })
// // eslint-disable-next-line @typescript-eslint/no-unused-vars

// export class DatabaseModule {
//   static forFeature(models: ModelDefinition[]) {
//     return MongooseModule.forFeature(models);
//   }
// }
