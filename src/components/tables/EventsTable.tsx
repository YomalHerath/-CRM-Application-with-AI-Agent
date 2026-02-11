import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import { API_BASE_URL } from "../../config/api";

export interface Event {
    id?: string;
    title?: string;
    start?: any;
    end?: any;
    extendedProps: {
        calendar: string;
        description: string;
        source?: string;
    };
}

export default function EventsTable({ events, refreshEvents }: { events: Event[], refreshEvents: () => void }) {
    const handleDelete = (id: string) => {
        if (confirm("Are you sure you want to delete this event?")) {
            fetch(`${API_BASE_URL}/events?id=${id}`, {
                method: "DELETE"
            })
                .then(res => res.json())
                .then(() => refreshEvents())
                .catch(err => console.error("Error deleting event:", err));
        }
    };

    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="max-w-full overflow-x-auto">
                <Table>
                    <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                        <TableRow>
                            <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Title</TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Start Date</TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">End Date</TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Type</TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Source</TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Actions</TableCell>
                        </TableRow>
                    </TableHeader>
                    <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                        {events.map((event) => (
                            <TableRow key={event.id}>
                                <TableCell className="px-5 py-4 sm:px-6 text-start">
                                    <div className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                        {event.title}
                                    </div>
                                    <div className="text-gray-500 text-theme-xs dark:text-gray-400">
                                        {event.extendedProps.description}
                                    </div>
                                </TableCell>
                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                    {event.start ? event.start.replace("T", " ") : ""}
                                </TableCell>
                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                    {event.end ? event.end.replace("T", " ") : ""}
                                </TableCell>
                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                    <Badge
                                        size="sm"
                                        color={
                                            event.extendedProps.calendar === "Danger" ? "error" :
                                                event.extendedProps.calendar === "Success" ? "success" :
                                                    event.extendedProps.calendar === "Warning" ? "warning" : "primary"
                                        }
                                    >
                                        {event.extendedProps.calendar}
                                    </Badge>
                                </TableCell>
                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                    <Badge size="sm" color="light">{event.extendedProps.source || 'web'}</Badge>
                                </TableCell>
                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                    <div className="flex -ml-2 space-x-2">
                                        <button
                                            onClick={() => event.id && handleDelete(event.id)}
                                            className="inline-block p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full"
                                            title="Delete Event"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" x2="10" y1="11" y2="17" /><line x1="14" x2="14" y1="11" y2="17" /></svg>
                                        </button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
