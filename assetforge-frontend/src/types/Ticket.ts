export interface Ticket {
    id: number;
    ticketNumber: string;
    prefix: string;
    title: string;
    description: string;
    status: string;
    priority: string;
    createdAt: string;

    // Who created the ticket
    createdById: number;
    createdByName?: string;

    // Who is it assigned to
    assignedToId?: number;
    assignedToName?: string;
}