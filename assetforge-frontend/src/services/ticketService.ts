import api from "../api/axios";
import type { TicketCreate } from "../types/TicketCreate";

export const getTickets = () => api.get("/ticket");
export const getTicket = (id: number) => api.get(`/ticket/${id}`);
export const getMyTickets = () => api.get("/ticket/mine");
export const getTechnicianQueue = () => api.get("/ticket/queue");

export const createTicket = (data: TicketCreate) => api.post("ticket", data);
export const updateTicket = (id: number, data: any) => api.put(`/ticket/${id}`, data);

export const assignTicket = (id: number, techId: number) => api.put(`/ticket/${id}/assign/${techId}`);

export const deleteTicket = (id: number) => api.delete(`/ticket/${id}`);