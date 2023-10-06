import { prisma } from '@/config';

async function readBooking(userId: number) {
  return await prisma.booking.findFirst({
    where: { userId },
    select: { id: true, Room: true },
  });
}

async function createBooking(userId: number, roomId: number) {
  return await prisma.booking.create({
    data: {
      userId,
      roomId,
    },
    select: {
      id: true,
    },
  });
}

async function readBookingsByRoomId(roomId: number) {
  return await prisma.booking.findMany({
    where: { roomId },
    select: { id: true },
  });
}

async function updateBooking(id: number, roomId: number) {
  return await prisma.booking.update({
    where: { id },
    data: { roomId },
    select: { id: true },
  });
}

export const bookingsRepository = {
  readBooking,
  createBooking,
  readBookingsByRoomId,
  updateBooking,
};
