import { useState } from "react";
import { createTicket } from "../services/ticketService";

interface CreateTicketProps {
    open: boolean;
    onClose: () => void;
    onCreate: () => void;
}

export default function CreateTicket({ open, onClose, onCreate }: CreateTicketProps) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState("Medium");

    if (!open) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await createTicket({
                title,
                description,
                priority,
            });

            onCreate(); // refresh parent list
            onClose(); // close modal
        } catch (err) {
            console.error("Failed to create ticket:", err);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
            <div className="bg-white p-6 rounded shadow-lg w-[450px]">
                <h2 className="text-xl font-semibold mb-4">Create Ticket</h2>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input type="text"
                    placeholder="Title"
                    className="border p-2 rounded"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required/>

                    <textarea placeholder="Description"
                    className="border p-2 rounded h-24"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required/>

                    <select className="border p-2 rounded"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}>
                        <option>Low</option>
                        <option>Medium</option>
                        <option>High</option>
                    </select>

                    <div className="flex justify-end gap-3 mt-4">
                        <button type="button"
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
                            Cancel
                        </button>

                        <button type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                            Create
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}