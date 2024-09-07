import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateCryptoPriceDto } from './dto/create-crypto-price.dto';
import { UpdateCryptoPriceDto } from './dto/update-crypto-price.dto';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import Moralis from 'moralis';
import { InjectRepository } from '@nestjs/typeorm';
import { CryptoPrice } from './entities/crypto-price.entity';
import { Between, Repository } from 'typeorm';
import { AlertsService } from 'src/alerts/alerts.service';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class CryptoPriceService {
  private isMoralisStarted = false;

  private apiKey = this.configService.getOrThrow('MORALIS_API_KEY');
  constructor(
    private readonly mailService: MailService,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    private readonly alertsService: AlertsService,
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

      // check if alert exist for this chain
      const alert = await this.alertsService.findOneByChainAndPrice(
        response.raw.tokenName,
        Math.round(response.raw.usdPrice),
      );
      if (alert) {
        // send email  for alert
        this.mailService.sendEmail(
          alert.email,
          'Price Alert',
          `The price of ${response.raw.tokenName} has reached ${Math.round(
            response.raw.usdPrice,
          )}`,
        );
      }

      // check if price change is greater than 3%

      const currentPrice = response.raw.usdPrice;

      const previousHour = new Date(Date.now() - 60 * 60 * 1000);

      const previousPriceDocument = await this.cryptoPriceRepository.findOne({
        where: {
          createdAt: previousHour,
        },
      });
      if (previousPriceDocument) {
        const previousPrice = previousPriceDocument.price;
        const percentageChange =
          ((currentPrice - previousPrice) / previousPrice) * 100;

        if (percentageChange > 3) {
          this.mailService.sendEmail(
            this.configService.getOrThrow('HYPERHIRE_EMAIL'),
            'Price Alert',
            `The price of ${response.raw.tokenName} has reached ${Math.round(
              response.raw.usdPrice,
            )}`,
          );
        }
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

      // check if alert exist for this chain
      const alert = await this.alertsService.findOneByChainAndPrice(
        response.raw.tokenName,
        Math.round(response.raw.usdPrice),
      );
      if (alert) {
        // send email  for alert
        this.mailService.sendEmail(
          alert.email,
          'Price Alert',
          `The price of ${response.raw.tokenName} has reached ${Math.round(
            response.raw.usdPrice,
          )}`,
        );
      }

      // check if price change is greater than 3%

      const currentPrice = response.raw.usdPrice;

      const previousHour = new Date(Date.now() - 60 * 60 * 1000);

      const previousPriceDocument = await this.cryptoPriceRepository.findOne({
        where: {
          createdAt: previousHour,
        },
      });
      if (previousPriceDocument) {
        const previousPrice = previousPriceDocument.price;
        const percentageChange =
          ((currentPrice - previousPrice) / previousPrice) * 100;

        if (percentageChange > 3) {
          this.mailService.sendEmail(
            this.configService.getOrThrow('HYPERHIRE_EMAIL'),
            'Price Alert',
            `The price of ${response.raw.tokenName} has reached ${Math.round(
              response.raw.usdPrice,
            )}`,
          );
        }
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

  async findAll() {
    return await this.cryptoPriceRepository.find();
  }

  async getHourlyPrices(chain: string) {
    const now = new Date();
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );
    const startOfYesterday = new Date(
      startOfToday.getTime() - 24 * 60 * 60 * 1000,
    );

    const hourlyPrices = await this.cryptoPriceRepository.find({
      where: {
        tokenName: chain,
        createdAt: Between(startOfYesterday, startOfToday),
      },
      order: {
        createdAt: 'ASC',
      },
    });

    return hourlyPrices.map((price) => ({
      hour: price.createdAt.getHours(),
      price: price.price,
    }));
  }
}
