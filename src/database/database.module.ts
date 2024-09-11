import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        // url: 'postgresql://mani:kjm57EwyEPqKfietDDhdxEpNg7OFe9v3@dpg-crga085svqrc73f0h5c0-a.oregon-postgres.render.com/cryptodb_l4dd',
        host: configService.getOrThrow('DB_HOST'),
        port: configService.getOrThrow('DB_PORT'),
        username: configService.getOrThrow('DB_USERNAME'),
        password: configService.getOrThrow('DB_PASSWORD'),
        database: configService.getOrThrow('DB_NAME'),
        ssl: true,
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
