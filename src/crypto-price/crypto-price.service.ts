import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateCryptoPriceDto } from './dto/create-crypto-price.dto';
import { UpdateCryptoPriceDto } from './dto/update-crypto-price.dto';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import Moralis from 'moralis';
import { InjectRepository } from '@nestjs/typeorm';
import { CryptoPrice } from './entities/crypto-price.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CryptoPriceService {
  private isMoralisStarted = false;

  private apiKey = this.configService.getOrThrow('MORALIS_API_KEY');
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    @InjectRepository(CryptoPrice)
    private readonly cryptoPriceRepository: Repository<CryptoPrice>,
  ) {}

  async initMoralis() {
    if (!this.isMoralisStarted) {
      await Moralis.start({
        apiKey: this.apiKey,
      });
      this.isMoralisStarted = true;
    }
  }

  async getCryptoPricesPolygon() {
    try {
      await this.initMoralis();

      let response = await Moralis.EvmApi.token.getTokenPrice({
        chain: '0x1',
        include: 'percent_change',
        address: '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0',
      });

      const currentPrice = response.raw.usdPrice;

      const previousHour = new Date(Date.now() - 60 * 60 * 1000);

      const previousPriceDocument = await this.cryptoPriceRepository.findOne({
        where: {
          createdAt: previousHour,
        },
      });
      if (!previousPriceDocument) {
        throw new InternalServerErrorException(
          'No token available in the last one hour',
        );
      }

      const previousPrice = previousPriceDocument.price;
      const percentageChange =
        ((currentPrice - previousPrice) / previousPrice) * 100;

      if (percentageChange > 3) {
        console.log('Price change is greater than 3%');
      }

      const token = this.cryptoPriceRepository.create({
        tokenName: response.raw.tokenName,
        price: response.raw.usdPrice,
      });
      const savedToken = await this.cryptoPriceRepository.save(token);
      return savedToken;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getCryptoPricesEther() {
    try {
      await this.initMoralis();

      const response = await Moralis.EvmApi.token.getTokenPrice({
        chain: '0x1',
        include: 'percent_change',
        address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      });

      const token = this.cryptoPriceRepository.create({
        tokenName: response.raw.tokenName,
        price: response.raw.usdPrice,
      });
      const savedToken = await this.cryptoPriceRepository.save(token);
      return savedToken;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  create(createCryptoPriceDto: CreateCryptoPriceDto) {
    return 'This action adds a new cryptoPrice';
  }

  async findAll() {
    return await this.cryptoPriceRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} cryptoPrice`;
  }

  update(id: number, updateCryptoPriceDto: UpdateCryptoPriceDto) {
    return `This action updates a #${id} cryptoPrice`;
  }

  remove(id: number) {
    return `This action removes a #${id} cryptoPrice`;
  }
}
