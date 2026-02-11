import { useState, useEffect } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import { API_BASE_URL } from "../../config/api";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";

interface Lead {
    id: number;
    name: string;
    email: string;
    phone: string;
    company: string;
    status: string;
    created_at: string;
}

export default function LeadsTable() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        company: "",
        status: "New"
    });

    useEffect(() => {
        fetchLeads();
    }, []);

    const fetchLeads = () => {
        fetch(`${API_BASE_URL}/leads`)
            .then((res) => res.json())
            .then((data) => {
                setLeads(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching leads:", err);
                setLoading(false);
            });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        fetch(`${API_BASE_URL}/leads`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData)
        })
            .then(res => res.json())
            .then(() => {
                fetchLeads();
                setIsModalOpen(false);
                setFormData({ name: "", email: "", phone: "", company: "", status: "New" });
            })
            .catch(err => console.error("Error creating lead:", err));
    };

    const handleDelete = (id: number) => {
        if (confirm("Are you sure you want to delete this lead?")) {
            fetch(`${API_BASE_URL}/leads?id=${id}`, {
                method: "DELETE"
            })
                .then(res => res.json())
                .then(() => fetchLeads())
                .catch(err => console.error("Error deleting lead:", err));
        }
    };

    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="p-4 flex justify-between items-center border-b border-gray-100 dark:border-white/[0.05]">
                <h3 className="font-semibold text-gray-800 dark:text-white/90">All Leads</h3>
                <Button size="sm" onClick={() => setIsModalOpen(true)}>+ Add Lead</Button>
            </div>

            <div className="max-w-full overflow-x-auto">
                <Table>
                    <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                        <TableRow>
                            <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Name</TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Contact</TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Company</TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Status</TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Actions</TableCell>
                        </TableRow>
                    </TableHeader>

                    <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                        {loading ? (
                            <TableRow><td className="p-4 text-center" colSpan={5}>Loading...</td></TableRow>
                        ) : leads.length === 0 ? (
                            <TableRow><td className="p-4 text-center" colSpan={5}>No leads found</td></TableRow>
                        ) : (
                            leads.map((lead) => (
                                <TableRow key={lead.id}>
                                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                                        <div className="font-medium text-gray-800 text-theme-sm dark:text-white/90">{lead.name}</div>
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        <div className="flex flex-col">
                                            <span>{lead.email}</span>
                                            <span className="text-xs">{lead.phone}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        {lead.company}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        <Badge
                                            size="sm"
                                            color={
                                                lead.status === "New" ? "success" :
                                                    lead.status === "Contacted" ? "warning" :
                                                        lead.status === "Qualified" ? "info" : "error"
                                            }
                                        >
                                            {lead.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                                        <button
                                            onClick={() => handleDelete(lead.id)}
                                            className="text-red-500 hover:text-red-700 transition"
                                        >
                                            Delete
                                        </button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} className="max-w-[500px] p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Add New Lead</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label>Full Name</Label>
                        <Input name="name" value={formData.name} onChange={handleInputChange} required placeholder="John Doe" />
                    </div>
                    <div>
                        <Label>Email</Label>
                        <Input name="email" type="email" value={formData.email} onChange={handleInputChange} required placeholder="john@example.com" />
                    </div>
                    <div>
                        <Label>Phone</Label>
                        <Input name="phone" value={formData.phone} onChange={handleInputChange} placeholder="+1 234 567 890" />
                    </div>
                    <div>
                        <Label>Company</Label>
                        <Input name="company" value={formData.company} onChange={handleInputChange} placeholder="Acme Inc." />
                    </div>
                    <div>
                        <Label>Status</Label>
                        <div className="relative">
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleInputChange}
                                className="w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
                            >
                                <option value="New">New</option>
                                <option value="Contacted">Contacted</option>
                                <option value="Qualified">Qualified</option>
                                <option value="Lost">Lost</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 mt-6">
                        <Button variant="outline" onClick={(e) => { e?.preventDefault(); setIsModalOpen(false); }}>Cancel</Button>
                        <Button type="submit">Add Lead</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
