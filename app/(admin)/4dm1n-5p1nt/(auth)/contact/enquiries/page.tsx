"use client";

import { useEffect, useMemo, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
} from "@/components/ui/dialog";
import { Download, Eye, Mail, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AdminLoader from "@/app/components/common/AdminLoader";

type Enquiry = {
    _id: string;
    name: string;
    email: string;
    organization: string;
    country: string;
    subject: string;
    message: string;
    createdAt: string;
};

const formatDate = (value: string) => {
    const date = new Date(value);
    return Number.isNaN(date.getTime())
        ? "-"
        : date.toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
};

// CSV of the enquiries currently shown (values quoted, quotes doubled)
const toCsv = (rows: Enquiry[]) => {
    const head = ["Received", "Name", "Email", "Organization", "Country", "Subject", "Message"];
    const quote = (value: string) => `"${(value ?? "").replace(/"/g, '""')}"`;
    const lines = rows.map((e) =>
        [formatDate(e.createdAt), e.name, e.email, e.organization, e.country, e.subject, e.message].map(quote).join(",")
    );
    return [head.map(quote).join(","), ...lines].join("\r\n");
};

const EnquiryPage = () => {
    const [enquiryList, setEnquiryList] = useState<Enquiry[]>([]);
    const [loaded, setLoaded] = useState(false);
    const [search, setSearch] = useState("");
    const [subjectFilter, setSubjectFilter] = useState("all");

    const handleFetchEnquiry = async () => {
        try {
            const response = await fetch("/api/admin/contact/enquiry");
            const data = await response.json();

            if (response.ok) {
                setEnquiryList(data.data);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error("Error fetching enquiries", error);
        } finally {
            setLoaded(true);
        }
    };

    const handleDeleteEnquiry = async (id: string) => {
        try {
            const response = await fetch("/api/admin/contact/enquiry", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(data.message);
                handleFetchEnquiry();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error("Error deleting enquiry", error);
        }
    };

    useEffect(() => {
        handleFetchEnquiry();
    }, []);

    // display only: newest first, then subject filter and search
    const subjects = useMemo(
        () => Array.from(new Set(enquiryList.map((e) => e.subject).filter(Boolean))).sort(),
        [enquiryList]
    );
    const visible = useMemo(() => {
        const query = search.trim().toLowerCase();
        return [...enquiryList]
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .filter((e) => subjectFilter === "all" || e.subject === subjectFilter)
            .filter(
                (e) =>
                    !query ||
                    [e.name, e.email, e.organization, e.country, e.message].some((v) => v?.toLowerCase().includes(query))
            );
    }, [enquiryList, search, subjectFilter]);

    const exportCsv = () => {
        const blob = new Blob(["﻿" + toCsv(visible)], { type: "text/csv;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `contact-enquiries-${new Date().toISOString().slice(0, 10)}.csv`;
        link.click();
        URL.revokeObjectURL(url);
    };

    if (!loaded) return <AdminLoader />;

    return (
        <div className="flex flex-col gap-4">
            {/* header: count, search, subject filter, export */}
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200/70 bg-white p-4">
                <div className="flex items-center gap-2">
                    <h2 className="text-[15px] font-semibold text-slate-900">Contact Enquiries</h2>
                    <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                        {visible.length === enquiryList.length ? enquiryList.length : `${visible.length} of ${enquiryList.length}`}
                    </span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <div className="relative">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <Input
                            type="search"
                            placeholder="Search name, email, organization, message"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="h-9 w-72 pl-9"
                        />
                    </div>
                    <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                        <SelectTrigger className="h-9 w-[180px] text-sm">
                            <SelectValue placeholder="All subjects" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                            <SelectItem value="all" className="hover:bg-gray-200">All subjects</SelectItem>
                            {subjects.map((subject) => (
                                <SelectItem key={subject} value={subject} className="hover:bg-gray-200">
                                    {subject}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <button
                        type="button"
                        onClick={exportCsv}
                        disabled={visible.length === 0}
                        className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 hover:border-primary/40 hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
                        title="Download the enquiries shown as a CSV file"
                    >
                        <Download className="h-4 w-4" />
                        Export CSV
                    </button>
                </div>
            </div>

            {/* list */}
            <div className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white">
                {visible.length === 0 ? (
                    <div className="px-6 py-12 text-center text-sm text-slate-500">
                        {enquiryList.length === 0 ? "No enquiries yet." : "No enquiries match the search or filter."}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                                <tr>
                                    <th className="px-4 py-3 font-medium">Received</th>
                                    <th className="px-4 py-3 font-medium">From</th>
                                    <th className="px-4 py-3 font-medium">Organization</th>
                                    <th className="px-4 py-3 font-medium">Country</th>
                                    <th className="px-4 py-3 font-medium">Subject</th>
                                    <th className="px-4 py-3 font-medium">Message</th>
                                    <th className="px-4 py-3 text-right font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {visible.map((enquiry) => (
                                    <tr key={enquiry._id} className="align-top transition-colors hover:bg-slate-50/70">
                                        <td className="whitespace-nowrap px-4 py-3 text-slate-500">{formatDate(enquiry.createdAt)}</td>
                                        <td className="px-4 py-3">
                                            <p className="font-medium text-slate-900">{enquiry.name}</p>
                                            <a href={`mailto:${enquiry.email}`} className="text-xs text-primary hover:underline">
                                                {enquiry.email}
                                            </a>
                                        </td>
                                        <td className="px-4 py-3 text-slate-700">{enquiry.organization}</td>
                                        <td className="px-4 py-3 text-slate-700">{enquiry.country}</td>
                                        <td className="px-4 py-3">
                                            <span className="inline-block whitespace-nowrap rounded-full bg-slate-100 px-2.5 py-0.5 text-xs text-slate-700">
                                                {enquiry.subject}
                                            </span>
                                        </td>
                                        <td className="max-w-[320px] px-4 py-3 text-slate-600">
                                            <p className="line-clamp-2">{enquiry.message}</p>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-end gap-1">
                                                {/* full enquiry */}
                                                <Dialog>
                                                    <DialogTrigger
                                                        title="View enquiry"
                                                        className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-slate-500 hover:bg-primary/10 hover:text-primary"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </DialogTrigger>
                                                    <DialogContent className="sm:max-w-2xl">
                                                        <DialogHeader>
                                                            <DialogTitle>{enquiry.subject}</DialogTitle>
                                                            <DialogDescription>Received {formatDate(enquiry.createdAt)}</DialogDescription>
                                                        </DialogHeader>
                                                        <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                                                            {[
                                                                ["Name", enquiry.name],
                                                                ["Email", enquiry.email],
                                                                ["Organization", enquiry.organization],
                                                                ["Country", enquiry.country],
                                                            ].map(([label, value]) => (
                                                                <div key={label}>
                                                                    <dt className="text-xs uppercase tracking-wide text-slate-500">{label}</dt>
                                                                    <dd className="break-words text-slate-900">{value || "-"}</dd>
                                                                </div>
                                                            ))}
                                                        </dl>
                                                        <div className="max-h-[300px] overflow-y-auto whitespace-pre-wrap rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm leading-relaxed text-slate-800">
                                                            {enquiry.message}
                                                        </div>
                                                        <div className="flex justify-end gap-2">
                                                            <DialogClose className="cursor-pointer rounded-md border border-slate-200 px-4 py-2 text-sm hover:bg-slate-50">
                                                                Close
                                                            </DialogClose>
                                                            <a
                                                                href={`mailto:${enquiry.email}?subject=${encodeURIComponent(`Re: ${enquiry.subject}`)}`}
                                                                className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm text-white"
                                                            >
                                                                <Mail className="h-4 w-4" />
                                                                Reply by email
                                                            </a>
                                                        </div>
                                                    </DialogContent>
                                                </Dialog>

                                                {/* delete, after confirming */}
                                                <Dialog>
                                                    <DialogTrigger
                                                        title="Delete enquiry"
                                                        className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-slate-500 hover:bg-red-50 hover:text-red-600"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </DialogTrigger>
                                                    <DialogContent>
                                                        <DialogHeader>
                                                            <DialogTitle>Delete the enquiry from {enquiry.name}?</DialogTitle>
                                                            <DialogDescription>This cannot be undone.</DialogDescription>
                                                        </DialogHeader>
                                                        <div className="flex justify-end gap-2">
                                                            <DialogClose className="cursor-pointer rounded-md border border-slate-200 px-4 py-2 text-sm hover:bg-slate-50">
                                                                Cancel
                                                            </DialogClose>
                                                            <DialogClose
                                                                className="cursor-pointer rounded-md bg-red-600 px-4 py-2 text-sm text-white"
                                                                onClick={() => handleDeleteEnquiry(enquiry._id)}
                                                            >
                                                                Delete
                                                            </DialogClose>
                                                        </div>
                                                    </DialogContent>
                                                </Dialog>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EnquiryPage;
