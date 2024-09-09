import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({ summary: 'Healthcheck' })
  @ApiResponse({
    status: 201,
  })
  @ApiResponse({ status: 400, description: 'API is up and running' })
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
