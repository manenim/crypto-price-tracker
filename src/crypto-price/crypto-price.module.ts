import { Module } from '@nestjs/common';
import { CryptoPriceService } from './crypto-price.service';
import { CryptoPriceController } from './crypto-price.controller';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CryptoPrice } from './entities/crypto-price.entity';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    HttpModule,
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([CryptoPrice]),
  ],
  controllers: [CryptoPriceController],
  providers: [CryptoPriceService],
})
export class CryptoPriceModule {}
