import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import connectDB from "@/lib/mongodb";
import { verifyAdmin } from "@/lib/verifyAdmin";
import ServiceVisibility from "@/app/models/ServiceVisibility";
import { isKnownServiceSlug, SERVICE_SLUGS } from "@/lib/serviceRegistry";
import { readHiddenServiceSlugs, readServiceOrder, SERVICE_VISIBILITY_TAG } from "@/lib/serviceVisibility";

import DesignStudio from "@/app/models/DesignStudio";
import Engineering from "@/app/models/Engineering";
import Facade from "@/app/models/Facade";
import IntegratedFacilityManagement from "@/app/models/IntegratedFacilityManagement";
import InteriorDesign from "@/app/models/InteriorDesign";
import Mep from "@/app/models/Mep";
import Water from "@/app/models/Water";

// id -> slug of every service document (projects link services by id); read only
async function serviceIdSlugs() {
    const docs = (
        await Promise.all(
            [Engineering, Mep, InteriorDesign, Facade, IntegratedFacilityManagement, Water, DesignStudio].map((Model) =>
                Model.find({}, { _id: 1, link: 1 }).lean<{ _id: unknown; link?: string }[]>()
            )
        )
    ).flat();
    const map: Record<string, string> = {};
    docs.forEach((d) => {
        if (isKnownServiceSlug(d.link)) map[String(d._id)] = d.link;
    });
    return map;
}

// everything the website needs: hidden services (by slug and by id) and their order
async function serviceSettings() {
    const [hiddenServices, serviceOrder, idSlugs] = await Promise.all([readHiddenServiceSlugs(), readServiceOrder(), serviceIdSlugs()]);
    const hiddenServiceIds = Object.keys(idSlugs).filter((id) => hiddenServices.includes(idSlugs[id]));
    return { hiddenServices, hiddenServiceIds, serviceOrder, serviceIdSlugs: idSlugs };
}

// show the change on the website right away (menus, footers, service pages, project filters / tabs, search)
function refreshWebsite() {
    revalidateTag(SERVICE_VISIBILITY_TAG, "max");
    revalidatePath("/", "layout");
}

// public: which services are hidden on the website and in which order they are listed
export async function GET() {
    try {
        return NextResponse.json({ data: { ...(await serviceSettings()), allServices: SERVICE_SLUGS } }, { status: 200 });
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

        refreshWebsite();

        return NextResponse.json(
            {
                data: await serviceSettings(),
                message: hidden ? "Service hidden from the website" : "Service is visible on the website again",
            },
            { status: 200 }
        );
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

// admin: save the display order of the services. Body: { order: ["mep", "water", ...] } - all 7 services, each once.
// Only the serviceOrder field of this small settings document is updated - the service documents are never written.
export async function PUT(request: NextRequest) {
    try {
        const isAdmin = await verifyAdmin(request);
        if (!isAdmin) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { order } = await request.json();
        const isFullOrder =
            Array.isArray(order) &&
            order.length === SERVICE_SLUGS.length &&
            order.every(isKnownServiceSlug) &&
            new Set(order).size === SERVICE_SLUGS.length;
        if (!isFullOrder) {
            return NextResponse.json({ message: "Invalid order - every service must be listed once" }, { status: 400 });
        }

        await connectDB();
        await ServiceVisibility.findOneAndUpdate({}, { $set: { serviceOrder: order } }, { upsert: true, new: true });

        refreshWebsite();

        return NextResponse.json({ data: await serviceSettings(), message: "Service order saved" }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
