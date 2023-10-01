import { getHotelById, getHotels } from "@/controllers";
import { authenticateToken, validateParams } from "@/middlewares";
import { hotelIdParamSchema } from "@/schemas";
import { Router } from "express";

const hotelsRouter = Router();

hotelsRouter
  .all('/*', authenticateToken)
  .get('/', getHotels)
  .get('/:hotelId', validateParams(hotelIdParamSchema), getHotelById);

export { hotelsRouter };