import { ticketsRepository } from "@/repositories"

async function getTicketsType() {
    return await ticketsRepository.readTicketTypes();
}

async function getTicket(userId: number){
    return ticketsRepository.readTicketByUserId(userId);
}

async function postTicket(userId: number, ticketTypeId: number){
    return ticketsRepository.createTicket(userId, ticketTypeId);
}

export const ticketsService = {
    getTicketsType,
    getTicket,
    postTicket,
    
}