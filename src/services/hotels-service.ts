import { notFoundError, notPaidError } from "@/errors";
import { enrollmentRepository, hotelsRepository, ticketsRepository } from "@/repositories";


async function getHotels(userId: number) {
    const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
    if (!enrollment) throw notFoundError();

    const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
    if (!ticket) throw notFoundError();
    if (ticket.status !== 'PAID' || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) throw notPaidError()

    const hotels = await hotelsRepository.readHotels();
    if (!hotels || hotels.length === 0) throw notFoundError();

    return hotels;
}

async function getHotelById(userId: number, hotelId: number) {
    const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
    if (!enrollment) throw notFoundError();

    const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
    if (!ticket) throw notFoundError();
    if (ticket.status !== 'PAID' || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) throw notPaidError()

    const hotel = await hotelsRepository.readHotelById(hotelId);
    if (!hotel) throw notFoundError();

    return hotel;
}

export const hotelsService = {
    getHotels,
    getHotelById
};
