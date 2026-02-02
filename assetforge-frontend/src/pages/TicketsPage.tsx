import { useEffect, useState } from "react";
import type { Ticket } from "../types/Ticket";
import { getTickets } from "../services/ticketService";
import CreateTicket from "../components/CreateTicket";
import { getTicket } from "../services/ticketService";
import ViewTicketPanel from "../components/ViewTicketPanel";

export default function TicketsPage() {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);
    const [openCreate, setOpenCreate] = useState(false);

    // View ticket panel
    const [openPanel, setOpenPanel] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

    const loadTickets = async () => {
        try {
            const res = await getTickets();
            setTickets(res.data);
        } catch (err) {
            console.error("failed to load tickets:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleView = async (id: number) => {
        const res = await getTicket(id);
        setSelectedTicket(res.data);
        setOpenPanel(true);
    };

    const priorityStyles: Record<string, string> = {
        High: "bg-red-100 text-red-700",
        Medium: "bg-yellow-100 text-yellow-700",
        Low: "bg-gray-100 text-gray-700",
    };

    const statusStyles: Record<string, string> = {
        Open: "bg-green-100 text-green-700",
        Closed: "bg-gray-100 text-black-700",
    };

    useEffect(() => {
        loadTickets();
    }, []);

    if (loading) return (<><div className="text-gray-600">Loading tickets ...</div></>);

    return (
        <>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-semibold mb-4">Tickets</h1>

                <button onClick={() => setOpenCreate(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">+ Create Ticket</button>
            </div>

            <CreateTicket open={openCreate}
            onClose={() => setOpenCreate(false)}
            onCreate={loadTickets}/>

            <ViewTicketPanel open={openPanel}
            onClose={() => setOpenPanel(false)}
            ticket={selectedTicket}/>

            <div className="bg-white shadow rounded-lg p-6">
                <table className="w-full table-auto">
                    <thead>
                        <tr className="text-left text-gray-600 border-b">
                            <th className="py-3 px-4">Ticket</th>
                            <th className="py-3 px-4">Status</th>
                            <th className="py-3 px-4">Priority</th>
                            <th className="py-3 px-4">Description</th>
                            <th className="py-3 px-4">Assigned</th>
                            <th className="py-3 px-4">Created</th>
                            <th className="py-3 px-4">Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {tickets.map((ticket) => (
                            <tr key={ticket.id} className="border-b hover:bg-gray-50">
                                <td className="py-3 px-4">{ticket.ticketNumber}</td>
                                <td className="py-3 px-4">
                                    <span className={`px-2 py-1 rounded text-sm font-medium ${statusStyles[ticket.status]}`}>
                                        {ticket.status}
                                    </span>
                                </td>
                                <td className="py-3 px-4">
                                    <span className={`px-2 py-1 rounded text-sm font-medium ${priorityStyles[ticket.priority]}`}>
                                        {ticket.priority}
                                    </span>
                                </td>
                                <td className="py-3 px-4">{ticket.title}</td>
                                <td className="py-3 px-4">{ticket.assignedToName ?? "Unassigned"}</td>
                                <td className="py-3 px-4">{new Date(ticket.createdAt).toLocaleDateString()}</td>
                                <td className="py-3 px-4">
                                    <button className="text-blue-600 hover:underline mr-3"
                                    onClick={() => handleView(ticket.id)}>View</button>
                                    <button className="text-gray-600 hover:underline">Edit</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}