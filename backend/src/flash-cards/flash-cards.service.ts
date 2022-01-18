import { Injectable } from '@nestjs/common';
import { CreateFlashCardDto } from './dto/create-flash-card.dto';
import { UpdateFlashCardDto } from './dto/update-flash-card.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FlashCardsService {
  constructor(private prisma: PrismaService) {}

  async create(createFlashCardDto: CreateFlashCardDto) {
    return await this.prisma.flashCard.create({ data: createFlashCardDto });
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
