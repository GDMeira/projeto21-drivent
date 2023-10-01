import dayjs from 'dayjs';
import faker from '@faker-js/faker';
import { prisma } from '@/config';
import { Hotel, Room } from '@prisma/client';

export type CreatedHotel = Hotel & { createdAt: string, updatedAt: string };

export async function createHotel() {
  const hotel: Hotel = await prisma.hotel.create({
    data: {
      name: faker.lorem.word(),
      image: faker.image.imageUrl(),
      createdAt: dayjs().subtract(10, 'day').toDate()
    },
  });

  const createdHotel = {
    ...hotel,
    createdAt: hotel.createdAt.toISOString(),
    updatedAt: hotel.updatedAt.toISOString()
  }


  return createdHotel;
}

export async function createRoom(hotelId: number) {
  const room = await prisma.room.create({
    data: {
      name: faker.lorem.word(),
      capacity: faker.datatype.number({ min: 1, max: 10 }),
      hotelId,
      createdAt: dayjs().subtract(9, 'day').toDate()
    },
  });

  const createdRoom = {
    ...room,
    createdAt: room.createdAt.toISOString(),
    updatedAt: room.updatedAt.toISOString()
  }

  return createdRoom;
}
