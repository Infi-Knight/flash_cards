import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
} from '@nestjs/common';

@Controller()
export class AppController {
  @Get('hello')
  getHello(): string {
    return 'hello there!';
  }
}
