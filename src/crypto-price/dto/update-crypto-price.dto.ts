import { PartialType } from '@nestjs/mapped-types';
import { CreateCryptoPriceDto } from './create-crypto-price.dto';

export class UpdateCryptoPriceDto extends PartialType(CreateCryptoPriceDto) {}
