import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Project from "@/app/models/Project";
import { verifyAdmin } from "@/lib/verifyAdmin";
import "@/app/models/Sector";
import "@/app/models/Country";
import "@/app/models/Service";
import { getServiceMap } from '../../../../helpers/getServiceMap'
import type { ProjectType } from "@/app/models/Project";



export async function GET(request: NextRequest) {
    try {
        await connectDB();
        const id = request.nextUrl.searchParams.get("id");
        const slug = request.nextUrl.searchParams.get("slug");

        const serviceMap = await getServiceMap();


        if (id) {
            const project = await Project.findOne({}).populate("projects.secondSection.sector", "name name_ar _id").populate("projects.secondSection.location", "name name_ar _id").lean<ProjectType>();
            const foundProject = project?.projects.find((project) => project._id.toString() === id);
            if (!foundProject) {
                return NextResponse.json({ message: "Project not found" }, { status: 404 });
            } else {
                const serviceId = foundProject.secondSection?.service?.toString();

                const service =
                    serviceId ? serviceMap.get(serviceId) : undefined;

                if (!service) {
                    return NextResponse.json(
                        { message: "Service not found" },
                        { status: 404 }
                    );
                }

                const responseProject = {
                    ...foundProject,
                    secondSection: {
                        ...foundProject.secondSection,
                        service, // ✅ ServiceLean here
                    },
                };

                return NextResponse.json(
                    { data: responseProject, message: "Project fetched successfully" },
                    { status: 200 }
                );
            }
        } else if (slug) {
            const project = await Project.findOne({}).populate("projects.secondSection.service", "name name_ar _id").populate("projects.secondSection.sector", "name name_ar _id").populate("projects.secondSection.location", "name name_ar _id");
            const foundProject = project.projects.find((project: { slug: string }) => project.slug === slug);
            if (!foundProject) {
                return NextResponse.json({ message: "Project not found" }, { status: 404 });
            } else {
                const serviceId = foundProject.secondSection.service.toString();
                if (serviceId && serviceMap.has(serviceId)) {
                    foundProject.secondSection.service = serviceMap.get(serviceId);
                }
                return NextResponse.json({ data: foundProject, message: "Project fetched successfully" }, { status: 200 });
            }
        } else {
            const project = await Project.findOne({}).populate("projects.secondSection.service", "name name_ar _id").populate("projects.secondSection.sector", "name name_ar _id").populate("projects.secondSection.location", "name name_ar _id");
            if (!project) {
                return NextResponse.json({ message: "Project not found" }, { status: 404 });
            }
            return NextResponse.json({ data: project, message: "Project fetched successfully" }, { status: 200 });
        }

    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const body = await request.json();
        const isAdmin = await verifyAdmin(request);
        const id = request.nextUrl.searchParams.get("id");
        if (!isAdmin) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        await connectDB();

        const project = await Project.findOne({})
        if (id) {
            const foundProject = project.projects.find((project: { _id: string }) => project._id.toString() === id);
            if (!foundProject) {
                return NextResponse.json({ message: "Project not found" }, { status: 404 });
            }
            foundProject.firstSection = body.firstSection;
            foundProject.secondSection = body.secondSection;
            foundProject.thirdSection = body.thirdSection;
            foundProject.fourthSection = body.fourthSection;
            foundProject.bannerSection = body.bannerSection;
            foundProject.images = body.images;
            foundProject.slug = body.slug;
            foundProject.thumbnail = body.thumbnail;
            foundProject.thumbnailAlt = body.thumbnailAlt;
            foundProject.metaTitle = body.metaTitle;
            foundProject.metaDescription = body.metaDescription;
            await project.save();
            return NextResponse.json({ data: project, message: "Project updated successfully" }, { status: 200 });
        }
        if (!project) {
            await Project.create({ ...body });
            return NextResponse.json({ data: project, message: "Project created successfully" }, { status: 200 });
        } else {
            await Project.findOneAndUpdate({}, body, { upsert: true, new: true });
            return NextResponse.json({ data: project, message: "Project updated successfully" }, { status: 200 });
        }
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const isAdmin = await verifyAdmin(request);
        if (!isAdmin) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        await connectDB();
        const project = await Project.findOne({});
        console.log(body)
        project.projects.push(body);
        await project.save();
        return NextResponse.json({ data: project, message: "Project created successfully" }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const id = request.nextUrl.searchParams.get("id");
        const isAdmin = await verifyAdmin(request);
        if (!isAdmin) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        await connectDB();
        const project = await Project.findOne({});
        if (!project) {
            return NextResponse.json({ message: "Project not found" }, { status: 404 });
        }
        project.projects = project.projects.filter((project: { _id: string }) => project._id.toString() !== id);
        await project.save();
        return NextResponse.json({ data: project, message: "Project deleted successfully" }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}


