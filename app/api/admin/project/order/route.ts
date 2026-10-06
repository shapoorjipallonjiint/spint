import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { verifyAdmin } from "@/lib/verifyAdmin";
import Project from "@/app/models/Project";
import Home from "@/app/models/Home";
import ProjectOrder from "@/app/models/ProjectOrder";
import { isValidOrderKey, orderKeyForCountry } from "@/lib/countryCodes";
import type { Types } from "mongoose";

type OrderLean = { key: string; projectIds?: string[] };
type HomeLean = { sixthSection?: { cities?: { _id: Types.ObjectId; code?: string }[] } };
type ProjectsLean = { projects?: { _id: Types.ObjectId; secondSection?: { location?: string } }[] };

// all saved country / Africa orders (public: the projects page reads them)
export async function GET() {
    try {
        await connectDB();
        const orders = await ProjectOrder.find({}, { key: 1, projectIds: 1, _id: 0 }).lean<OrderLean[]>();
        return NextResponse.json(
            { data: orders.map((o) => ({ key: o.key, projectIds: o.projectIds || [] })) },
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

// save one order: { key: "AE" | "AFRICA" | ..., projectIds: [...] }
// writes only that ProjectOrder record; the projects themselves are never touched
export async function POST(request: NextRequest) {
    try {
        const isAdmin = await verifyAdmin(request);
        if (!isAdmin) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const key = typeof body?.key === "string" ? body.key : "";
        const projectIds: unknown[] = Array.isArray(body?.projectIds) ? body.projectIds : [];

        if (!isValidOrderKey(key)) {
            return NextResponse.json({ message: "Invalid country" }, { status: 400 });
        }

        await connectDB();

        // projects that really belong to this key (by their location's country code)
        const home = await Home.findOne({}, { "sixthSection.cities._id": 1, "sixthSection.cities.code": 1 }).lean<HomeLean>();
        const codeByLocation = new Map(
            (home?.sixthSection?.cities || []).map((c) => [c._id.toString(), c.code || ""])
        );
        const projectDoc = await Project.findOne(
            {},
            { "projects._id": 1, "projects.secondSection.location": 1 }
        ).lean<ProjectsLean>();
        const memberIds = new Set(
            (projectDoc?.projects || [])
                .filter((p) => orderKeyForCountry(codeByLocation.get(String(p.secondSection?.location))) === key)
                .map((p) => p._id.toString())
        );

        // keep only ids of this key's projects, each once
        const cleanIds = [...new Set(projectIds.map(String))].filter((id) => memberIds.has(id));

        await ProjectOrder.findOneAndUpdate({ key }, { $set: { projectIds: cleanIds } }, { upsert: true });

        return NextResponse.json({ data: { key, projectIds: cleanIds }, message: "Order saved" }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

// reset one country / Africa to the global order: removes only that ProjectOrder record (projects untouched)
export async function DELETE(request: NextRequest) {
    try {
        const isAdmin = await verifyAdmin(request);
        if (!isAdmin) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const key = request.nextUrl.searchParams.get("key") || "";
        if (!isValidOrderKey(key)) {
            return NextResponse.json({ message: "Invalid country" }, { status: 400 });
        }

        await connectDB();
        await ProjectOrder.deleteOne({ key });

        return NextResponse.json({ data: { key }, message: "Order reset to global" }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
