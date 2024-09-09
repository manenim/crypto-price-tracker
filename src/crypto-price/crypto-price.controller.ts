import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, ParseEnumPipe } from '@nestjs/common';
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
import { ChainEnum } from 'src/alerts/enums/chains.enums';

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

  @ApiOperation({ summary: 'Get crypto prices for a specific chain' })
  @ApiResponse({
    status: 200,
    description: 'Successful response',
    type: [CryptoPrice],
  })
  @ApiResponse({
    status: 500,
    description: 'chain parameter must be either polygon or ethereum',
  })
  @Get(':chain/hourly-price')
  async getPrices(
    @Param('chain', new ParseEnumPipe(ChainEnum)) chain: ChainEnum,
  ) {
    return await this.cryptoPriceService.getHourlyPrices(chain);
  }

  //delete all
  @ApiOperation({ summary: 'Delete all crypto prices' })
  @ApiResponse({
    status: 200,
    description: 'Successful response',
    type: [CryptoPrice],
  })
  @ApiResponse({ status: 500, description: 'Some server error' })
  @Delete()
  deleteAll() {
    return this.cryptoPriceService.deleteAll();
  }
}
