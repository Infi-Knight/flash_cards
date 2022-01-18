import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { FlashCardsService } from './flash-cards.service';
import { CreateFlashCardDto } from './dto/create-flash-card.dto';
import { UpdateFlashCardDto } from './dto/update-flash-card.dto';

@Controller('flash-cards')
export class FlashCardsController {
  constructor(private readonly flashCardsService: FlashCardsService) {}

  @Post()
  async create(@Body() createFlashCardDto: CreateFlashCardDto) {
    try {
      return await this.flashCardsService.create(createFlashCardDto);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new HttpException(
            'This word already exists',
            HttpStatus.CONFLICT,
          );
        }
      }
      throw error;
    }
  }

  @Get()
  findAll() {
    return this.flashCardsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.flashCardsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateFlashCardDto: UpdateFlashCardDto,
  ) {
    return this.flashCardsService.update(+id, updateFlashCardDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.flashCardsService.remove(+id);
  }
}
