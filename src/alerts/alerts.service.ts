import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateAlertDto } from './dto/create-alert.dto';
import { UpdateAlertDto } from './dto/update-alert.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Alert } from './entities/alert.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AlertsService {
  constructor(
    @InjectRepository(Alert)
    private readonly alertRepository: Repository<Alert>,
  ) {}

  async create(createAlertDto: CreateAlertDto) {
    try {
      const existingAlert = this.findOneByChainAndEmail(
        createAlertDto.chain,
        createAlertDto.email,
      );

      if (existingAlert) {
        throw new BadRequestException(
          'Alert already exists for this chain and email',
        );
      }

      const newAlert = this.alertRepository.create(createAlertDto);
      await this.alertRepository.save(newAlert);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findAll() {
    try {
      return await this.alertRepository.find();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findOneByChainAndEmail(chain: string, email: string) {
    try {
      const alert = await this.alertRepository.findOne({
        where: { chain: chain, email: email },
      });
      if (!alert) {
        throw new BadRequestException('Alert not found');
      }
      return alert;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findOneByChainAndPrice(chain: string, price: number) {
    try {
      const alert = await this.alertRepository.findOne({
        where: { chain: chain, priceInDollars: price },
      });
      if (!alert) {
        throw new BadRequestException('Alert not found');
      }
      return alert;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  update(id: number, updateAlertDto: UpdateAlertDto) {
    return `This action updates a #${id} alert`;
  }

  remove(id: number) {
    return `This action removes a #${id} alert`;
  }
}
