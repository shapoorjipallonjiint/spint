import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import connectDB from "@/lib/mongodb";
import { verifyAdmin } from "@/lib/verifyAdmin";
import ServiceVisibility from "@/app/models/ServiceVisibility";
import Project from "@/app/models/Project";
import { isKnownServiceSlug } from "@/lib/serviceRegistry";
import { readFeaturedProjects, SERVICE_VISIBILITY_TAG } from "@/lib/serviceVisibility";
import type { Types } from "mongoose";

type ProjectIdsLean = { projects?: { _id: Types.ObjectId }[] };

// admin: save the projects shown in one service's Featured Projects section.
// Body: { slug: "mep", projectIds: [...] } in the order shown in the section - an empty list means the section is not
// shown on that service page.
// Only featuredProjects.<slug> of the small services settings document is set; projects and services are never written.
export async function PUT(request: NextRequest) {
    try {
        const isAdmin = await verifyAdmin(request);
        if (!isAdmin) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { slug, projectIds } = await request.json();
        if (!isKnownServiceSlug(slug) || !Array.isArray(projectIds)) {
            return NextResponse.json({ message: "Invalid service or projects" }, { status: 400 });
        }

        await connectDB();

        // keep only ids of projects that exist, each once, in the order given (the Featured Projects order of this service)
        const projectDoc = await Project.findOne({}, { "projects._id": 1 }).lean<ProjectIdsLean>();
        const existing = new Set((projectDoc?.projects || []).map((p) => p._id.toString()));
        const cleanIds = [...new Set(projectIds.map(String))].filter((id) => existing.has(id));

        await ServiceVisibility.findOneAndUpdate(
            {},
            { $set: { [`featuredProjects.${slug}`]: cleanIds } },
            { upsert: true, new: true }
        );

        // show the change on the service pages right away
        revalidateTag(SERVICE_VISIBILITY_TAG, "max");
        revalidatePath("/", "layout");

        return NextResponse.json(
            {
                data: { slug, projectIds: cleanIds, featuredProjects: await readFeaturedProjects() },
                message: cleanIds.length
                    ? `${cleanIds.length} featured project${cleanIds.length === 1 ? "" : "s"} saved`
                    : "No featured projects - the section is hidden on this service page",
            },
            { status: 200 }
        );
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
