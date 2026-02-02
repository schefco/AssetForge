import type { Ticket } from "../types/Ticket";

interface Props {
    open: boolean;
    onClose: () => void;
    ticket: Ticket | null;
}

export default function ViewTicketPanel({ open, onClose, ticket }: Props) {
    if (!open || !ticket) return null;

    return (
        <div className="fixed inset-0 flex justify-end z-50">
            {/* Background overlay */}
            <div className="absolute inset-0 bg-black-40"
            onClick={onClose}/>

            {/* Slide over panel */}
            <div className="relative w-[450px] bg-white shadow-xl h-full p-6 animate-slideIn">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold">Ticket Details</h2>
                    <button onClick={onClose}
                    className="text-gray-500 hover:text-gray-700 text-xl">X</button>
                </div>

                <div className="space-y-4">
                    <div>
                        <p className="text-sm text-gray-500">Ticket Number</p>
                        <p className="font-medium">{ticket.ticketNumber}</p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">Title</p>
                        <p className="font-medium">{ticket.title}</p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">Description</p>
                        <p className="font-medium">{ticket.description}</p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">Status</p>
                        <p className="font-medium">{ticket.status}</p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">Priority</p>
                        <p className="font-medium">{ticket.priority}</p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">Created By</p>
                        <p className="font-medium">{ticket.createdByName}</p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">Assigned To</p>
                        <p className="font-medium">{ticket.assignedToName ?? "Unassigned"}</p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">Created At</p>
                        <p className="font-medium">{new Date(ticket.createdAt).toLocaleString()}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}