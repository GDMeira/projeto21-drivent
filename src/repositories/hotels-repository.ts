import { prisma } from '@/config';

async function readHotels() {
  return await prisma.hotel.findMany();
}

async function readHotelById(hotelId: number) {
  return await prisma.hotel.findUnique({
    where: { id: hotelId },
    include: { Rooms: true },
  });
}

async function readRoomById(roomId: number) {
  return await prisma.room.findUnique({
    where: {
      id: roomId,
    },
  });
}

export const hotelsRepository = {
  readHotels,
  readHotelById,
  readRoomById,
};
