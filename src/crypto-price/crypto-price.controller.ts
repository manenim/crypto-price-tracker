import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CryptoPriceService } from './crypto-price.service';
import { CreateCryptoPriceDto } from './dto/create-crypto-price.dto';
import { UpdateCryptoPriceDto } from './dto/update-crypto-price.dto';
import { Cron, CronExpression } from '@nestjs/schedule';

import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiProperty,
} from '@nestjs/swagger';
import { CryptoPrice } from './entities/crypto-price.entity';

@ApiTags('Crypto Price')
@Controller('crypto-price')
export class CryptoPriceController {
  constructor(private readonly cryptoPriceService: CryptoPriceService) {}

  @ApiOperation({ summary: 'Get crypto prices from Polygon' })
  @ApiResponse({
    status: 200,
    description: 'Successful response',
    type: [CryptoPrice],
  })
  @ApiResponse({ status: 500, description: 'Some server error' })
  @Cron(CronExpression.EVERY_5_MINUTES)
  getPricesPolygon() {
    return this.cryptoPriceService.getCryptoPricesPolygon();
  }

  @ApiOperation({ summary: 'Get crypto prices from Ether' })
  @ApiResponse({
    status: 200,
    description: 'Successful response',
    type: [CryptoPrice],
  })
  @ApiResponse({ status: 500, description: 'Some server error' })
  @Cron(CronExpression.EVERY_5_MINUTES)
  getPricesEther() {
    return this.cryptoPriceService.getCryptoPricesEther();
  }

  @ApiOperation({ summary: 'Get all crypto prices' })
  @ApiResponse({
    status: 200,
    description: 'Successful response',
    type: [CryptoPrice],
  })
  @ApiResponse({ status: 500, description: 'Some server error' })
  @Get()
  findAll() {
    return this.cryptoPriceService.findAll();
  }
}
