import { Injectable } from '@nestjs/common';
import { CreateFlashCardDto } from './dto/create-flash-card.dto';
import { UpdateFlashCardDto } from './dto/update-flash-card.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class FlashCardsService {
  constructor(private prisma: PrismaService) {}

  async create(createFlashCardDto: CreateFlashCardDto) {
    try {
      return await this.prisma.flashCard.create({ data: createFlashCardDto });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          console.log('Duplicate entry for flashCard');
        }
      }
      throw error;
    }
  }

  findAll() {
    return `This action returns all flashCards`;
  }

  findOne(id: number) {
    return `This action returns a #${id} flashCard`;
  }

  update(id: number, updateFlashCardDto: UpdateFlashCardDto) {
    return `This action updates a #${id} flashCard`;
  }

  remove(id: number) {
    return `This action removes a #${id} flashCard`;
  }
}
