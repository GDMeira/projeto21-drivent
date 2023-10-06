import faker from '@faker-js/faker';
import { prisma } from '@/config';

export async function createBooking(
  userId: number = faker.datatype.number({ min: 1, max: 10 }),
  roomId: number = faker.datatype.number({ min: 1, max: 10 }),
) {
  return await prisma.booking.create({
    data: {
      userId,
      roomId,
    },
  });
}

export function returnBookingWithRoom() {
  return {
    id: faker.datatype.number({ min: 1, max: 10 }),
    Room: {
      id: faker.datatype.number({ min: 1, max: 10 }),
      name: faker.lorem.word(),
      capacity: faker.datatype.number({ min: 1, max: 10 }),
      hotelId: faker.datatype.number({ min: 1, max: 10 }),
      createdAt: faker.date.recent(),
      updatedAt: faker.date.recent(),
    },
  };
}

export function returnBookingsByRoomId(numberOfBookings = 0) {
  const bookings = [];

  for (let i = 0; i < numberOfBookings; i++) {
    bookings.push({ id: faker.datatype.number({ min: 1, max: 10 }) });
  }

  return bookings;
}

export function returnBooking() {
  return { id: faker.datatype.number({ min: 1, max: 10 }) };
}
