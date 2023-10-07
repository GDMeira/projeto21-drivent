import { cannotBookingError, notFoundError, notPaidError } from '@/errors';
import { bookingsRepository, enrollmentRepository, hotelsRepository, ticketsRepository } from '@/repositories';

async function getBooking(userId: number) {
  const booking = await bookingsRepository.readBooking(userId);
  if (!booking) throw notFoundError();

  return booking;
}

async function postBooking(userId: number, roomId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw cannotBookingError('You must have an enrollment to book a room.');

  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket) throw cannotBookingError('You must have a ticket to book a room.');
  if (ticket.status !== 'PAID' || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel)
    throw cannotBookingError('You must have a paid ticket not remote to book a room.');

  const room = await hotelsRepository.readRoomById(roomId);
  if (!room) throw notFoundError();

  const bookingsAtThisRoom = await bookingsRepository.readBookingsByRoomId(roomId);
  if (bookingsAtThisRoom.length >= room.capacity) throw cannotBookingError('Room is full.');

  const booking = await bookingsRepository.createBooking(userId, roomId);

  return booking;
}

async function putBooking(userId: number, roomId: number, bookingId: number) {
  const lastBooking = await bookingsRepository.readBooking(userId);
  if (!lastBooking) throw cannotBookingError('You dont have a booking to update.');
  if (lastBooking.id !== bookingId) throw cannotBookingError('You can only update your booking.');

  const room = await hotelsRepository.readRoomById(roomId);
  if (!room) throw notFoundError();

  const bookingsAtThisRoom = await bookingsRepository.readBookingsByRoomId(roomId);
  if (bookingsAtThisRoom.length >= room.capacity) throw cannotBookingError('Room is full.');

  const booking = await bookingsRepository.updateBooking(lastBooking.id, roomId);

  return booking;
}

export const bookingService = {
  getBooking,
  postBooking,
  putBooking,
};
