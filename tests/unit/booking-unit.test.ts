import faker from '@faker-js/faker';
import { TicketStatus } from '@prisma/client';
import {
  returnBooking,
  returnBookingWithRoom,
  returnBookingsByRoomId,
  returnEnrollment,
  returnRoom,
  returnTicketWithTicketType,
} from '../factories';
import { bookingsRepository, enrollmentRepository, hotelsRepository, ticketsRepository } from '@/repositories';
import { bookingService } from '@/services';

describe('GET /booking', () => {
  it('should return the booking', async () => {
    const booking = returnBookingWithRoom();

    jest.spyOn(bookingsRepository, 'readBooking').mockResolvedValueOnce(booking);

    const response = await bookingService.getBooking(booking.id);

    expect(response).toEqual(booking);
  });

  it('should return not found error', async () => {
    jest.spyOn(bookingsRepository, 'readBooking').mockResolvedValueOnce(undefined);

    const response = bookingService.getBooking(faker.datatype.number({ min: 1, max: 10 }));

    expect(response).rejects.toEqual({
      name: 'NotFoundError',
      message: 'No result for this search!',
    });
  });
});

describe('POST /booking', () => {
  it('should return the booking', async () => {
    const booking = returnBooking();

    jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockResolvedValueOnce(returnEnrollment());
    jest
      .spyOn(ticketsRepository, 'findTicketByEnrollmentId')
      .mockResolvedValueOnce(returnTicketWithTicketType(false, true, TicketStatus.PAID));
    jest.spyOn(hotelsRepository, 'readRoomById').mockResolvedValueOnce(returnRoom(2));
    jest.spyOn(bookingsRepository, 'readBookingsByRoomId').mockResolvedValueOnce(returnBookingsByRoomId(1));
    jest.spyOn(bookingsRepository, 'createBooking').mockResolvedValueOnce(booking);

    const response = await bookingService.postBooking(1, 1);

    expect(response).toEqual(booking);
  });

  it('should return enrollment error', async () => {
    const booking = returnBooking();

    jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockResolvedValueOnce(undefined);
    jest
      .spyOn(ticketsRepository, 'findTicketByEnrollmentId')
      .mockResolvedValueOnce(returnTicketWithTicketType(false, true, TicketStatus.PAID));
    jest.spyOn(hotelsRepository, 'readRoomById').mockResolvedValueOnce(returnRoom(2));
    jest.spyOn(bookingsRepository, 'readBookingsByRoomId').mockResolvedValueOnce(returnBookingsByRoomId(1));
    jest.spyOn(bookingsRepository, 'createBooking').mockResolvedValueOnce(booking);

    const response = bookingService.postBooking(1, 1);

    expect(response).rejects.toEqual({
      name: 'CannotBookingError',
      message: 'You must have an enrollment to book a room.',
    });
  });

  it('should return do not have ticket error', async () => {
    const booking = returnBooking();

    jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockResolvedValueOnce(returnEnrollment());
    jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId').mockResolvedValueOnce(undefined);
    jest.spyOn(hotelsRepository, 'readRoomById').mockResolvedValueOnce(returnRoom(2));
    jest.spyOn(bookingsRepository, 'readBookingsByRoomId').mockResolvedValueOnce(returnBookingsByRoomId(1));
    jest.spyOn(bookingsRepository, 'createBooking').mockResolvedValueOnce(booking);

    const response = bookingService.postBooking(1, 1);

    expect(response).rejects.toEqual({
      name: 'CannotBookingError',
      message: 'You must have a ticket to book a room.',
    });
  });

  it('should return do not have a compatible ticket error', async () => {
    const booking = returnBooking();

    jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockResolvedValueOnce(returnEnrollment());
    jest
      .spyOn(ticketsRepository, 'findTicketByEnrollmentId')
      .mockResolvedValueOnce(returnTicketWithTicketType(true, false, TicketStatus.RESERVED));
    jest.spyOn(hotelsRepository, 'readRoomById').mockResolvedValueOnce(returnRoom(2));
    jest.spyOn(bookingsRepository, 'readBookingsByRoomId').mockResolvedValueOnce(returnBookingsByRoomId(1));
    jest.spyOn(bookingsRepository, 'createBooking').mockResolvedValueOnce(booking);

    const response = bookingService.postBooking(1, 1);

    expect(response).rejects.toEqual({
      name: 'CannotBookingError',
      message: 'You must have a paid ticket not remote to book a room.',
    });
  });

  it('should return room not found error', async () => {
    const booking = returnBooking();

    jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockResolvedValueOnce(returnEnrollment());
    jest
      .spyOn(ticketsRepository, 'findTicketByEnrollmentId')
      .mockResolvedValueOnce(returnTicketWithTicketType(false, true, TicketStatus.PAID));
    jest.spyOn(hotelsRepository, 'readRoomById').mockResolvedValueOnce(undefined);
    jest.spyOn(bookingsRepository, 'readBookingsByRoomId').mockResolvedValueOnce(returnBookingsByRoomId(1));
    jest.spyOn(bookingsRepository, 'createBooking').mockResolvedValueOnce(booking);

    const response = bookingService.postBooking(1, 1);

    expect(response).rejects.toEqual({
      name: 'NotFoundError',
      message: 'No result for this search!',
    });
  });

  it('should return room is full error', async () => {
    const booking = returnBooking();

    jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockResolvedValueOnce(returnEnrollment());
    jest
      .spyOn(ticketsRepository, 'findTicketByEnrollmentId')
      .mockResolvedValueOnce(returnTicketWithTicketType(false, true, TicketStatus.PAID));
    jest.spyOn(hotelsRepository, 'readRoomById').mockResolvedValueOnce(returnRoom(2));
    jest.spyOn(bookingsRepository, 'readBookingsByRoomId').mockResolvedValueOnce(returnBookingsByRoomId(2));
    jest.spyOn(bookingsRepository, 'createBooking').mockResolvedValueOnce(booking);

    const response = bookingService.postBooking(1, 1);

    expect(response).rejects.toEqual({
      name: 'CannotBookingError',
      message: 'Room is full.',
    });
  });
});

describe('PUT /booking', () => {
  it('should return the updated booking', async () => {
    const booking = returnBooking();

    jest.spyOn(bookingsRepository, 'readBooking').mockResolvedValueOnce(returnBookingWithRoom());
    jest.spyOn(hotelsRepository, 'readRoomById').mockResolvedValueOnce(returnRoom(2));
    jest.spyOn(bookingsRepository, 'readBookingsByRoomId').mockResolvedValueOnce(returnBookingsByRoomId(1));
    jest.spyOn(bookingsRepository, 'updateBooking').mockResolvedValueOnce(booking);

    const response = await bookingService.putBooking(1, 1);

    expect(response).toEqual(booking);
  });

  it('should return you dont have a booking error', async () => {
    const booking = returnBooking();

    jest.spyOn(bookingsRepository, 'readBooking').mockResolvedValueOnce(undefined);
    jest.spyOn(hotelsRepository, 'readRoomById').mockResolvedValueOnce(returnRoom(2));
    jest.spyOn(bookingsRepository, 'readBookingsByRoomId').mockResolvedValueOnce(returnBookingsByRoomId(1));
    jest.spyOn(bookingsRepository, 'updateBooking').mockResolvedValueOnce(booking);

    const response = bookingService.putBooking(1, 1);

    expect(response).rejects.toEqual({
      name: 'CannotBookingError',
      message: 'You dont have a booking to update.',
    });
  });

  it('should return room not found error', async () => {
    const booking = returnBooking();

    jest.spyOn(bookingsRepository, 'readBooking').mockResolvedValueOnce(returnBookingWithRoom());
    jest.spyOn(hotelsRepository, 'readRoomById').mockResolvedValueOnce(undefined);
    jest.spyOn(bookingsRepository, 'readBookingsByRoomId').mockResolvedValueOnce(returnBookingsByRoomId(1));
    jest.spyOn(bookingsRepository, 'updateBooking').mockResolvedValueOnce(booking);

    const response = bookingService.putBooking(1, 1);

    expect(response).rejects.toEqual({
      name: 'NotFoundError',
      message: 'No result for this search!',
    });
  });

  it('should return room is full error', async () => {
    const booking = returnBooking();

    jest.spyOn(bookingsRepository, 'readBooking').mockResolvedValueOnce(returnBookingWithRoom());
    jest.spyOn(hotelsRepository, 'readRoomById').mockResolvedValueOnce(returnRoom(2));
    jest.spyOn(bookingsRepository, 'readBookingsByRoomId').mockResolvedValueOnce(returnBookingsByRoomId(2));
    jest.spyOn(bookingsRepository, 'updateBooking').mockResolvedValueOnce(booking);

    const response = bookingService.putBooking(1, 1);

    expect(response).rejects.toEqual({
      name: 'CannotBookingError',
      message: 'Room is full.',
    });
  });
});
