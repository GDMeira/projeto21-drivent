import Joi from 'joi';

export const putBookingParamSchema = Joi.object({
  bookingId: Joi.number().integer().min(1).required(),
});