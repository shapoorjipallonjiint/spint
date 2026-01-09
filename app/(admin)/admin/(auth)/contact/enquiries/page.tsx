"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { LuMessageSquareShare } from "react-icons/lu";
import { MdDelete } from "react-icons/md";
import { toast } from "sonner";

const EnquiryPage = () => {
    const [enquiryList, setEnquiryList] = useState<
        {
            _id: string;
            name: string;
            email: string;
            organization: string;
            country: string;
            subject: string;
            message: string;
            createdAt: string;
        }[]
    >([]);

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

    return (
        <div className="relative overflow-x-auto rounded-2xl">
            <table className="w-full text-left text-gray-500">
                <thead className="text-15 uppercase bg-gray-100">
                    <tr>
                        <th className="px-6 py-3">Name</th>
                        <th className="px-6 py-3">Email</th>
                        <th className="px-6 py-3">Organization</th>
                        <th className="px-6 py-3">Country</th>
                        <th className="px-6 py-3">Subject</th>
                        <th className="px-6 py-3">Message</th>
                        <th className="px-6 py-3">Delete</th>
                    </tr>
                </thead>

                <tbody>
                    {enquiryList.length === 0 ? (
                        <tr>
                            <td colSpan={7} className="px-6 py-8 text-center text-gray-500 text-25">
                                No enquiries found
                            </td>
                        </tr>
                    ) : (
                        enquiryList.map((enquiry) => (
                            <tr key={enquiry._id} className="bg-white border-b">
                                <td className="px-6 py-4">{enquiry.name}</td>
                                <td className="px-6 py-4">{enquiry.email}</td>
                                <td className="px-6 py-4">{enquiry.organization}</td>
                                <td className="px-6 py-4">{enquiry.country}</td>
                                <td className="px-6 py-4">{enquiry.subject}</td>

                                <td className="px-6 py-4">
                                    <Dialog>
                                        <DialogTrigger className="bg-primary text-white px-2 py-1 rounded-md">
                                            <LuMessageSquareShare />
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Message</DialogTitle>
                                            </DialogHeader>

                                            <div className="mt-3 max-h-[300px] overflow-y-auto rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
                                                {enquiry.message}
                                            </div>

                                            <DialogClose className="mt-3 bg-black text-white px-3 py-1 rounded-md">
                                                Close
                                            </DialogClose>
                                        </DialogContent>
                                    </Dialog>
                                </td>

                                <td className="px-6 py-4">
                                    <Dialog>
                                        <DialogTrigger className="bg-red-500 text-white px-2 py-1 rounded-md">
                                            <MdDelete />
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Are you sure?</DialogTitle>
                                            </DialogHeader>
                                            <div className="flex gap-2">
                                                <DialogClose className="bg-gray-300 px-3 py-1 rounded-md">No</DialogClose>
                                                <DialogClose
                                                    className="bg-red-600 text-white px-3 py-1 rounded-md"
                                                    onClick={() => handleDeleteEnquiry(enquiry._id)}
                                                >
                                                    Yes
                                                </DialogClose>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default EnquiryPage;
