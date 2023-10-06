import { Response } from 'express';
import httpStatus from 'http-status';
import { bookingService } from '@/services';
import { AuthenticatedRequest } from '@/middlewares';
import { notFoundError } from '@/errors';

export async function getBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  const booking = await bookingService.getBooking(userId);

  res.status(httpStatus.OK).send(booking);
}

export async function postBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { roomId } = req.body;
  if (!roomId) throw notFoundError();

  const booking = await bookingService.postBooking(userId, roomId);

  res.status(httpStatus.OK).send({ bookingId: booking.id });
}

export async function putBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { roomId } = req.body;
  if (!roomId) throw notFoundError();

  const booking = await bookingService.putBooking(userId, roomId);

  res.status(httpStatus.OK).send({ bookingId: booking.id });
}
