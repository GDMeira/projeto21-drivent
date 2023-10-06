import faker from '@faker-js/faker';
import { TicketStatus, Ticket, TicketType } from '@prisma/client';
import { prisma } from '@/config';

export async function createTicketType(isRemote = faker.datatype.boolean(), includesHotel = faker.datatype.boolean()) {
  return prisma.ticketType.create({
    data: {
      name: faker.name.findName(),
      price: faker.datatype.number(),
      isRemote,
      includesHotel,
    },
  });
}

export async function createTicket(enrollmentId: number, ticketTypeId: number, status: TicketStatus) {
  return prisma.ticket.create({
    data: {
      enrollmentId,
      ticketTypeId,
      status,
    },
  });
}

export function returnTicketWithTicketType(
  isRemote: boolean,
  includesHotel: boolean,
  status: TicketStatus,
): Ticket & { TicketType: TicketType } {
  return {
    id: faker.datatype.number({ min: 1, max: 10 }),
    enrollmentId: faker.datatype.number({ min: 1, max: 10 }),
    ticketTypeId: faker.datatype.number({ min: 1, max: 10 }),
    createdAt: faker.date.recent(),
    updatedAt: faker.date.recent(),
    status,
    TicketType: {
      id: faker.datatype.number({ min: 1, max: 10 }),
      name: faker.name.findName(),
      price: faker.datatype.number(),
      isRemote,
      includesHotel,
      createdAt: faker.date.recent(),
      updatedAt: faker.date.recent(),
    },
  };
}
