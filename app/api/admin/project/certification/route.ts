import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { verifyAdmin } from "@/lib/verifyAdmin";
import CertificationBadge from "@/app/models/CertificationBadge";

// shared certification badges (admin Projects > Certifications)
const pickFields = (body: Record<string, unknown>) => ({
    name: typeof body.name === "string" ? body.name.trim() : "",
    name_ar: typeof body.name_ar === "string" ? body.name_ar : "",
    image: typeof body.image === "string" ? body.image : "",
    alt: typeof body.alt === "string" ? body.alt : "",
    alt_ar: typeof body.alt_ar === "string" ? body.alt_ar : "",
});

export async function GET() {
    try {
        await connectDB();
        const badges = await CertificationBadge.find({}).sort({ createdAt: 1 });
        return NextResponse.json({ data: badges, message: "Certifications fetched successfully" }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const isAdmin = await verifyAdmin(request);
        if (!isAdmin) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        const fields = pickFields(await request.json());
        if (!fields.name || !fields.image) {
            return NextResponse.json({ message: "Name and badge image are required" }, { status: 400 });
        }
        await connectDB();
        const badge = await CertificationBadge.create(fields);
        return NextResponse.json({ data: badge, message: "Certification created successfully" }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const isAdmin = await verifyAdmin(request);
        if (!isAdmin) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        const id = request.nextUrl.searchParams.get("id");
        const fields = pickFields(await request.json());
        if (!id) {
            return NextResponse.json({ message: "Missing id" }, { status: 400 });
        }
        if (!fields.name || !fields.image) {
            return NextResponse.json({ message: "Name and badge image are required" }, { status: 400 });
        }
        await connectDB();
        // no upsert: editing a badge that was deleted meanwhile must not recreate it
        const badge = await CertificationBadge.findByIdAndUpdate(id, fields, { new: true });
        if (!badge) {
            return NextResponse.json({ message: "Certification not found" }, { status: 404 });
        }
        return NextResponse.json({ data: badge, message: "Certification updated successfully" }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const isAdmin = await verifyAdmin(request);
        if (!isAdmin) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        const id = request.nextUrl.searchParams.get("id");
        await connectDB();
        // projects keep their certificationBadgeId; with the badge gone they simply show no badge
        const badge = await CertificationBadge.findByIdAndDelete(id);
        if (!badge) {
            return NextResponse.json({ message: "Certification not found" }, { status: 404 });
        }
        return NextResponse.json({ data: badge, message: "Certification deleted successfully" }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
