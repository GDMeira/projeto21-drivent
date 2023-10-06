import dayjs from 'dayjs';
import faker from '@faker-js/faker';
import { Hotel, Room } from '@prisma/client';
import { prisma } from '@/config';

export type CreatedHotel = Hotel & { createdAt: string; updatedAt: string };

export async function createHotel() {
  const hotel: Hotel = await prisma.hotel.create({
    data: {
      name: faker.lorem.word(),
      image: faker.image.imageUrl(),
      createdAt: dayjs().subtract(10, 'day').toDate(),
    },
  });

  const createdHotel = {
    ...hotel,
    createdAt: hotel.createdAt.toISOString(),
    updatedAt: hotel.updatedAt.toISOString(),
  };

  return createdHotel;
}

export async function createRoom(hotelId: number, capacity: number = faker.datatype.number({ min: 1, max: 10 })) {
  const room = await prisma.room.create({
    data: {
      name: faker.lorem.word(),
      capacity,
      hotelId,
      createdAt: dayjs().subtract(9, 'day').toDate(),
    },
  });

  const createdRoom = {
    ...room,
    createdAt: room.createdAt.toISOString(),
    updatedAt: room.updatedAt.toISOString(),
  };

  return createdRoom;
}

export function returnRoom(capacity = 3): Room {
  return {
    id: faker.datatype.number({ min: 1, max: 10 }),
    name: faker.lorem.word(),
    capacity,
    hotelId: faker.datatype.number({ min: 1, max: 10 }),
    createdAt: dayjs().subtract(9, 'day').toDate(),
    updatedAt: dayjs().subtract(9, 'day').toDate(),
  };
}
