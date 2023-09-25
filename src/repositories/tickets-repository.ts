import { prisma } from '@/config';
import { notFoundError } from '@/errors';

async function readTicketTypes() {
    const result = await prisma.ticketType.findMany();

    return result;
}

async function readTicketByUserId(userId: number) {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            Enrollment: true
        }
    })

    const enrollId = user.Enrollment.map(e => e.id);

    if (!enrollId || enrollId.length === 0) throw notFoundError()

    const ticket = await prisma.ticket.findFirst({
        where: {
            enrollmentId: enrollId[0]
        },
        select: {
            createdAt: true,
            enrollmentId: true,
            id: true,
            status: true,
            ticketTypeId: true,
            updatedAt: true,
            TicketType: true
        }

    })

    if (!ticket) throw notFoundError()

    return ticket;
}

async function createTicket(userId: number, ticketTypeId: number) {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            Enrollment: true
        }
    })

    const enrollId = user.Enrollment.map(e => e.id);

    if (!enrollId || enrollId.length === 0) throw notFoundError()

    const ticket = await prisma.ticket.create({
        data: {
            enrollmentId: enrollId[0],
            status: 'RESERVED',
            ticketTypeId
        },
        include: {
            TicketType: true
        }

    })

    if (!ticket) throw notFoundError()

    return ticket;
}

export const ticketsRepository = {
    readTicketTypes,
    readTicketByUserId,
    createTicket,

}