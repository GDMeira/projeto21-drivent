import dayjs from 'dayjs';
import faker from '@faker-js/faker';
import { prisma } from '@/config';
import { Hotel, Room } from '@prisma/client';

export function createHotel(): Promise<Hotel> {
  return prisma.hotel.create({
    data: {
      name: faker.lorem.word(),
      image: faker.image.imageUrl(),
      createdAt: dayjs().subtract(10, 'day').toDate()
    },
  });
}

export function createRoom(hotelId: number): Promise<Room> {
  return prisma.room.create({
    data: {
      name: faker.lorem.word(),
      capacity: faker.datatype.number({ min: 1, max: 10 }),
      hotelId,
      createdAt: dayjs().subtract(9, 'day').toDate()
    },
  });
}
