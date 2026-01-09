import * as React from "react";

import connectDB from "@/lib/mongodb";
import Enquiry from "@/app/models/Enquiry";
import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/verifyAdmin";
import { EnquiryEmail } from "@/app/templates/EnquiryEmail";
import { resend } from "@/lib/resend";

export async function POST(request: Request) {
    const body = await request.json();

    const emailReactNode = (
        <EnquiryEmail
            name={body.name}
            email={body.email}
            organization={body.organization}
            country={body.country}
            subject={body.subject}
            message={body.message}
        />
    );

    try {
        await connectDB();

        const enquiry = await Enquiry.create({
            name: body.name,
            email: body.email,
            organization: body.organization,
            country: body.country,
            subject: body.subject,
            message: body.message,
        });

        try {
            await resend.emails.send({
                from: "SP International <onboarding@resend.dev>",
                to: ["shapoorjipallonjiint@gmail.com"],
                replyTo: body.email,
                subject: `New Enquiry: ${body.subject}`,
                react: emailReactNode,
            });
        } catch (emailError) {
            console.error("Email sending failed", emailError);
        }

        return NextResponse.json(
            {
                success: true,
                message: "Thank you, we will get back to you soon",
                data: enquiry,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error sending message", error);

        return NextResponse.json({ success: false, message: "Error sending message" }, { status: 500 });
    }
}

export async function GET() {
    try {
        await connectDB();
        const enquiry = await Enquiry.find();
        if (!enquiry) {
            return NextResponse.json({ message: "No enquiry found" }, { status: 404 });
        }
        return NextResponse.json({ data: enquiry }, { status: 200 });
    } catch (error) {
        console.log("Error fetching enquiry", error);
        return NextResponse.json({ message: "Error fetching enquiry" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        await connectDB();
        const isAdmin = await verifyAdmin(req);
        if (!isAdmin) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        const { id } = await req.json();
        const enquiry = await Enquiry.findByIdAndDelete(id);
        if (!enquiry) {
            return NextResponse.json({ message: "Enquiry not found" }, { status: 404 });
        }
        return NextResponse.json({ message: "Enquiry deleted successfully" }, { status: 200 });
    } catch (error) {
        console.log("Error deleting enquiry", error);
        return NextResponse.json({ message: "Error deleting enquiry" }, { status: 500 });
    }
}
