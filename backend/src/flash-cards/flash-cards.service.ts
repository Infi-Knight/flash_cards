import { Injectable } from '@nestjs/common';
import { CreateFlashCardDto } from './dto/create-flash-card.dto';
import { UpdateFlashCardDto } from './dto/update-flash-card.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { FlashCard } from '@prisma/client';
import * as moment from 'moment';

const MAX_WRONGS_ALLOWED = 10;
@Injectable()
export class FlashCardsService {
  constructor(private prisma: PrismaService) {}

  create(createFlashCardDto: CreateFlashCardDto) {
    return this.prisma.flashCard.create({ data: createFlashCardDto });
  }

  findAll() {
    return this.prisma.flashCard.findMany();
  }

  async findAllCardsReadyForReview() {
    const x = await this.prisma.flashCard.findMany({
      where: {
        OR: [
          {
            nextAppearanceAt: {
              lt: new Date(Date.now()),
            },
          },
          {
            bin: {
              equals: 11,
            },
          },
          {
            bin: {
              equals: 12,
            },
          },
        ],
      },
    });
    return await this.getCardsToReviewOrStatus(x);
  }

  async getCardsToReviewOrStatus(
    data: FlashCard[],
  ): Promise<{ cardsToStudy: FlashCard[]; message: string }> {
    const readyCardsNotInHardOrNeverOrZeroBin = data.filter(
      (card) => ![0, 11, 12].includes(card.bin),
    );
    const cardsInBinZero = data.filter((card) => card.bin === 0);
    const cardsInHardOrNeverBin = data.filter((card) =>
      [11, 12].includes(card.bin),
    );

    let cardsToStudy: FlashCard[];
    let message = '';

    if (readyCardsNotInHardOrNeverOrZeroBin.length > 0) {
      cardsToStudy = readyCardsNotInHardOrNeverOrZeroBin.sort(
        (card1, card2) => card2.bin - card1.bin,
      );
    } else if (cardsInBinZero.length > 0) {
      cardsToStudy = cardsInBinZero;
    } else if (
      cardsInBinZero.length === 0 &&
      readyCardsNotInHardOrNeverOrZeroBin.length === 0 &&
      cardsInHardOrNeverBin.length === 0
    ) {
      const totalCardsCount = await this.prisma.flashCard.count();
      if (totalCardsCount === 0) {
        message = 'Please add some cards to start studying';
      } else {
        message =
          'You are temporarily done; please come back later to review more words.';
      }
    } else if (
      cardsInBinZero.length === 0 &&
      readyCardsNotInHardOrNeverOrZeroBin.length === 0 &&
      cardsInHardOrNeverBin.length > 0 // all the cards are in never or hard bin
    ) {
      message = 'You have no more words to review; you are permanently done!';
    }

    return { cardsToStudy, message };
  }

  findOne(id: number) {
    return `This action returns a #${id} flashCard`;
  }

  async update(id: number, updateFlashCardDto: UpdateFlashCardDto) {
    const { answeredCorrectly } = updateFlashCardDto;
    const currentStats = await this.prisma.flashCard.findUnique({
      where: {
        id,
      },
    });

    if (!answeredCorrectly) {
      const newWrongCount = currentStats.wrongCount + 1;

      if (newWrongCount === MAX_WRONGS_ALLOWED) {
        // move to hard bin, as wrong count is 10 now
        const newBin = 12;
        await this.prisma.flashCard.update({
          where: {
            id,
          },
          data: {
            bin: newBin,
            wrongCount: newWrongCount,
          },
        });
      } else {
        // move to bin 1
        const newBin = 1;
        await this.prisma.flashCard.update({
          where: {
            id,
          },
          data: {
            bin: newBin,
            wrongCount: newWrongCount,
            nextAppearanceAt: this.getNextAppearanceDate(newBin),
          },
        });
      }
    } else {
      const newBin = currentStats.bin + 1;
      await this.prisma.flashCard.update({
        where: {
          id,
        },
        data: {
          bin: newBin,
          nextAppearanceAt: this.getNextAppearanceDate(newBin),
        },
      });
    }
  }

  getNextAppearanceDate(bin: number): Date {
    switch (bin) {
      case 1:
        return moment().add(5, 's').toDate();
      case 2:
        return moment().add(25, 's').toDate();
      case 3:
        return moment().add(2, 'm').toDate();
      case 4:
        return moment().add(10, 'm').toDate();
      case 5:
        return moment().add(1, 'h').toDate();
      case 6:
        return moment().add(5, 'h').toDate();
      case 7:
        return moment().add(1, 'd').toDate();
      case 8:
        return moment().add(5, 'd').toDate();
      case 9:
        return moment().add(25, 'd').toDate();
      case 10:
        return moment().add(4, 'M').toDate();
      case 11:
        return moment().add(30, 'y').toDate(); // 30 years for the never bin
      default:
        throw new Error(`invalid bin: ${bin}`);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} flashCard`;
  }
}
