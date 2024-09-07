import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CryptoPriceService } from './crypto-price.service';
import { CreateCryptoPriceDto } from './dto/create-crypto-price.dto';
import { UpdateCryptoPriceDto } from './dto/update-crypto-price.dto';
import { Cron, CronExpression } from '@nestjs/schedule';

@Controller('crypto-price')
export class CryptoPriceController {
  constructor(private readonly cryptoPriceService: CryptoPriceService) {}

  @Post()
  create(@Body() createCryptoPriceDto: CreateCryptoPriceDto) {
    return this.cryptoPriceService.create(createCryptoPriceDto);
  }

  // @Get('/get-prices-polygon')
  // @Cron(CronExpression.EVERY_5_MINUTES)
  getPricesPolygon() {
    return this.cryptoPriceService.getCryptoPricesPolygon();
  }

  // @Get('/get-prices-ether')
  // @Cron(CronExpression.EVERY_5_MINUTES)
  getPricesEther() {
    return this.cryptoPriceService.getCryptoPricesEther();
  }

  // private readonly logger = new Logger(TasksService.name);

  @Cron(CronExpression.EVERY_5_MINUTES)
  handleCron() {
    console.log('Called when the current second is 2');
  }

  @Get()
  findAll() {
    return this.cryptoPriceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cryptoPriceService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCryptoPriceDto: UpdateCryptoPriceDto,
  ) {
    return this.cryptoPriceService.update(+id, updateCryptoPriceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cryptoPriceService.remove(+id);
  }
}
