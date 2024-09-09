import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AlertsService } from './alerts.service';
import { CreateAlertDto } from './dto/create-alert.dto';
import { UpdateAlertDto } from './dto/update-alert.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';


ApiTags('alerts');
@Controller('alerts')
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) {}

  @ApiOperation({ summary: 'Create a new alert' })
  @ApiBody({ type: CreateAlertDto })
  @ApiResponse({
    status: 201,
    description: 'The alert has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @Post('/set-alert')
  create(@Body() createAlertDto: CreateAlertDto) {
    return this.alertsService.create(createAlertDto);
  }

  @ApiOperation({ summary: 'Get all alerts' })
  @ApiResponse({ status: 200, description: 'Returns all alerts.' })
  @Get()
  findAll() {
    return this.alertsService.findAll();
  }
}

