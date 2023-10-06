import Joi from 'joi';

export const hotelIdParamSchema = Joi.object({
  hotelId: Joi.number().integer().min(1).required(),
});
