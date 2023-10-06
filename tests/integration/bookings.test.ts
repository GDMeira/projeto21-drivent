import faker from '@faker-js/faker';
import httpStatus from 'http-status';
import * as jwt from 'jsonwebtoken';
import supertest from 'supertest';

import { TicketStatus } from '@prisma/client';
import {
  createBooking,
  createEnrollmentWithAddress,
  createHotel,
  createRoom,
  createTicket,
  createTicketType,
  createUser,
} from '../factories';
import { cleanDb, generateValidToken } from '../helpers';
import app, { init } from '@/app';

beforeAll(async () => {
  await init();
  await cleanDb();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe('GET /booking', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.get('/booking');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe('when token is valid', () => {
    it('should respond with status 404 if there is no booking for given user', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it('should respond with status 200 when there is a booking', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const hotel = await createHotel();
      const room = await createRoom(hotel.id);
      const booking = await createBooking(user.id, room.id);

      const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual({
        id: booking.id,
        Room: room,
      });
    });
  });
});

describe('POST /booking', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.post('/booking');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.post('/booking').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.post('/booking').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe('when token is valid', () => {
    it('should respond with status 404 if roomId does not exist', async () => {
      const user = await createUser();
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType(false, true);
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const token = await generateValidToken(user);
      const hotel = await createHotel();
      const room = await createRoom(hotel.id);

      const response = await server
        .post('/booking')
        .set('Authorization', `Bearer ${token}`)
        .send({ roomId: room.id + 1 });

      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it('should respond with status 403 if room does not have capacity', async () => {
      const user1 = await createUser();
      const user2 = await createUser();
      const enrollment = await createEnrollmentWithAddress(user1);
      const ticketType = await createTicketType(false, true);
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const token = await generateValidToken(user1);
      const hotel = await createHotel();
      const room = await createRoom(hotel.id, 1);
      await createBooking(user2.id, room.id);

      const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({ roomId: room.id });

      expect(response.status).toBe(httpStatus.FORBIDDEN);
    });

    it('should respond with status 200 when there is a booking', async () => {
      const user = await createUser();
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType(false, true);
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const token = await generateValidToken(user);
      const hotel = await createHotel();
      const room = await createRoom(hotel.id);

      const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({ roomId: room.id });

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual({
        bookingId: expect.any(Number),
      });
    });
  });
});

describe('PUT /booking', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.put('/booking');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.put('/booking').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.put('/booking').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe('when token is valid', () => {
    it('should respond with status 403 if user does not have a booking', async () => {
      const user = await createUser();
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType(false, true);
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const token = await generateValidToken(user);
      const hotel = await createHotel();
      const room = await createRoom(hotel.id);

      const response = await server.put('/booking').set('Authorization', `Bearer ${token}`).send({ roomId: room.id });

      expect(response.status).toBe(httpStatus.FORBIDDEN);
    });

    it('should respond with status 404 if roomId does not exist', async () => {
      const user = await createUser();
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType(false, true);
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const token = await generateValidToken(user);
      const hotel = await createHotel();
      const oldRoom = await createRoom(hotel.id);
      await createBooking(user.id, oldRoom.id);
      const room = await createRoom(hotel.id);

      const response = await server
        .put('/booking')
        .set('Authorization', `Bearer ${token}`)
        .send({ roomId: room.id + 1 });

      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it('should respond with status 403 if room does not have capacity', async () => {
      const user1 = await createUser();
      const user2 = await createUser();
      const enrollment = await createEnrollmentWithAddress(user1);
      const ticketType = await createTicketType(false, true);
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const token = await generateValidToken(user1);
      const hotel = await createHotel();
      const oldRoom = await createRoom(hotel.id);
      await createBooking(user1.id, oldRoom.id);
      const room = await createRoom(hotel.id, 1);
      await createBooking(user2.id, room.id);

      const response = await server.put('/booking').set('Authorization', `Bearer ${token}`).send({ roomId: room.id });

      expect(response.status).toBe(httpStatus.FORBIDDEN);
    });

    it('should respond with status 200 when update the booking', async () => {
      const user = await createUser();
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType(false, true);
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const token = await generateValidToken(user);
      const hotel = await createHotel();
      const oldRoom = await createRoom(hotel.id);
      await createBooking(user.id, oldRoom.id);
      const room = await createRoom(hotel.id);

      const response = await server.put('/booking').set('Authorization', `Bearer ${token}`).send({ roomId: room.id });

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual({
        bookingId: expect.any(Number),
      });
    });
  });
});
