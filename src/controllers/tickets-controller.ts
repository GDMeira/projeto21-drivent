import { ticketsService } from '@/services';
import { Request, Response } from 'express';
import httpStatus from 'http-status';

export async function getTicketTypes(req: Request, res: Response) {
  const types = await ticketsService.getTicketsType();

  res.status(httpStatus.OK).send(types);
}

export async function getTicket(req: Request, res: Response) {
  const { userId } = res.locals;

  const ticket = await ticketsService.getTicket(userId);

  res.status(httpStatus.OK).send(ticket);
}

export async function postTicket(req: Request, res: Response) {
  const { userId } = res.locals;
  const { ticketTypeId } = req.body;

  const ticket = await ticketsService.postTicket(userId, ticketTypeId);

  res.status(httpStatus.CREATED).send(ticket);
}