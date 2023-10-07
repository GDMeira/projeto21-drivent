import { Router } from 'express';
import { authenticateToken, validateParams } from '@/middlewares';
import { getBooking, postBooking, putBooking } from '@/controllers';
import { putBookingParamSchema } from '@/schemas';

const bookingRouter = Router();

bookingRouter.all('/*', authenticateToken).get('/', getBooking).post('/', postBooking).put('/:bookingId', validateParams(putBookingParamSchema), putBooking);

export { bookingRouter };
