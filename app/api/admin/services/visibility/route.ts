import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import connectDB from "@/lib/mongodb";
import { verifyAdmin } from "@/lib/verifyAdmin";
import ServiceVisibility from "@/app/models/ServiceVisibility";
import { isKnownServiceSlug, SERVICE_SLUGS } from "@/lib/serviceRegistry";
import { readHiddenServiceSlugs, SERVICE_VISIBILITY_TAG } from "@/lib/serviceVisibility";

import DesignStudio from "@/app/models/DesignStudio";
import Engineering from "@/app/models/Engineering";
import Facade from "@/app/models/Facade";
import IntegratedFacilityManagement from "@/app/models/IntegratedFacilityManagement";
import InteriorDesign from "@/app/models/InteriorDesign";
import Mep from "@/app/models/Mep";
import Water from "@/app/models/Water";

// ids of the hidden services (projects link services by id); read only
async function hiddenServiceIds(hiddenSlugs: string[]) {
    if (!hiddenSlugs.length) return [];
    const docs = (
        await Promise.all(
            [Engineering, Mep, InteriorDesign, Facade, IntegratedFacilityManagement, Water, DesignStudio].map((Model) =>
                Model.find({}, { _id: 1, link: 1 }).lean<{ _id: unknown; link?: string }[]>()
            )
        )
    ).flat();
    return docs.filter((d) => hiddenSlugs.includes(String(d.link))).map((d) => String(d._id));
}

// public: which services are hidden on the website
export async function GET() {
    try {
        const hiddenServices = await readHiddenServiceSlugs();
        return NextResponse.json(
            { data: { hiddenServices, hiddenServiceIds: await hiddenServiceIds(hiddenServices), allServices: SERVICE_SLUGS } },
            { status: 200 }
        );
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

// admin: hide / show one service. Body: { slug: "mep", hidden: true | false }
// Only this small settings document is updated - the service documents are never written.
export async function PATCH(request: NextRequest) {
    try {
        const isAdmin = await verifyAdmin(request);
        if (!isAdmin) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { slug, hidden } = await request.json();
        if (!isKnownServiceSlug(slug) || typeof hidden !== "boolean") {
            return NextResponse.json({ message: "Invalid service or value" }, { status: 400 });
        }

        await connectDB();
        await ServiceVisibility.findOneAndUpdate(
            {},
            hidden ? { $addToSet: { hiddenServices: slug } } : { $pull: { hiddenServices: slug } },
            { upsert: true, new: true }
        );

        // show the change on the website right away (menus, footers, service pages, project filters, search)
        revalidateTag(SERVICE_VISIBILITY_TAG, "max");
        revalidatePath("/", "layout");

        const hiddenServices = await readHiddenServiceSlugs();
        return NextResponse.json(
            {
                data: { hiddenServices, hiddenServiceIds: await hiddenServiceIds(hiddenServices) },
                message: hidden ? "Service hidden from the website" : "Service is visible on the website again",
            },
            { status: 200 }
        );
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
