import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsInt, IsString } from 'class-validator';
import { ChainEnum } from '../enums/chains.enums';

export class CreateAlertDto {
  @ApiProperty({
    description: 'The blockchain chain for which the alert is being created',
    enum: ChainEnum,
    example: ChainEnum.ETHEREUM,
  })
  @IsEnum(ChainEnum)
  chain: string;

  @ApiProperty({
    description:
      'The price in US dollars at which the alert should be triggered',
    example: 2000,
  })
  @IsInt()
  priceInDollars: number;

  @ApiProperty({
    description: 'The email address to which the alert should be sent',
    example: 'user@example.com',
  })
  @IsEmail()
  email: string;
}
