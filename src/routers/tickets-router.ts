import { Router } from 'express';
import { authenticateToken, validateBody } from '@/middlewares';
import { getTicket, getTicketTypes, postTicket } from '@/controllers';
import { createTicketSchema } from '@/schemas';

const ticketsRouter = Router();

ticketsRouter
  .all('/*', authenticateToken)
  .get('/', getTicket)
  .post('/', validateBody(createTicketSchema), postTicket)
  .get('/types', getTicketTypes)

export { ticketsRouter };
