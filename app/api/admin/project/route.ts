import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Project from "@/app/models/Project";
import Home from "@/app/models/Home";
import { verifyAdmin } from "@/lib/verifyAdmin";
import "@/app/models/Sector";
import "@/app/models/Service";
import { getServiceMap } from "../../../../helpers/getServiceMap";
import type { ProjectType } from "@/app/models/Project";
import type { Types } from "mongoose";

/* ================= TYPES ================= */

type LocationCity = {
  _id: Types.ObjectId;
  name?: string;
  name_ar?: string;
};

type HomeLean = {
  sixthSection?: {
    cities?: LocationCity[];
  };
};

type LocationDTO = {
  _id: string;
  name?: string;
  name_ar?: string;
};

type ProjectItem = ProjectType["projects"][number];

/* ========================================= */

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const id = request.nextUrl.searchParams.get("id");
    const slug = request.nextUrl.searchParams.get("slug");

    const serviceMap = await getServiceMap();

    /* ---------- LOCATION MAP ---------- */
    const home = (await Home.findOne(
      {},
      { "sixthSection.cities": 1, _id: 0 }
    ).lean()) as HomeLean | null;

    const locationMap = new Map<string, LocationDTO>();

    home?.sixthSection?.cities?.forEach((city) => {
      locationMap.set(city._id.toString(), {
        _id: city._id.toString(),
        name: city.name,
        name_ar: city.name_ar,
      });
    });
    /* ---------------------------------- */

    const project = await Project.findOne({})
      .populate("projects.secondSection.sector", "name name_ar _id")
      .lean<ProjectType>();

    if (!project) {
      return NextResponse.json(
        { message: "Project not found" },
        { status: 404 }
      );
    }

    /* ---------- MAPPER ---------- */
    const mapProject = (p: ProjectItem) => {
      const serviceId = p.secondSection?.service?.toString();
      const service = serviceId ? serviceMap.get(serviceId) ?? null : null;

      const locationId = p.secondSection?.location;
      const location =
        typeof locationId === "string"
          ? locationMap.get(locationId) ?? null
          : null;

      return {
        ...p,
        secondSection: {
          ...p.secondSection,
          service,
          location,
        },
      };
    };
    /* ----------------------------- */

    /* ===== SINGLE PROJECT BY ID ===== */
    if (id) {
      const found = project.projects.find(
        (p) => p._id.toString() === id
      );

      if (!found) {
        return NextResponse.json(
          { message: "Project not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(
        {
          data: mapProject(found),
          message: "Project fetched successfully",
        },
        { status: 200 }
      );
    }

    /* ===== SINGLE PROJECT BY SLUG ===== */
    if (slug) {
      const index = project.projects.findIndex(
        (p) => p.slug === slug
      );

      if (index === -1) {
        return NextResponse.json(
          { message: "Project not found" },
          { status: 404 }
        );
      }

      const current = project.projects[index];
      const nextProject =
        project.projects[index + 1] ?? project.projects[0];

      return NextResponse.json(
        {
          data: mapProject(current),
          nextProject,
          message: "Project fetched successfully",
        },
        { status: 200 }
      );
    }

    /* ===== ALL PROJECTS ===== */
    return NextResponse.json(
      {
        data: {
          ...project,
          projects: project.projects.map(mapProject),
        },
        message: "Projects fetched successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

/* ================= PATCH ================= */

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const id = request.nextUrl.searchParams.get("id");
    const isAdmin = await verifyAdmin(request);

    if (!isAdmin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (!id) {
      return NextResponse.json(
        { message: "Invalid request" },
        { status: 400 }
      );
    }

    await connectDB();
    const project = await Project.findOne({});

    if (!project) {
      return NextResponse.json(
        { message: "Project not found" },
        { status: 404 }
      );
    }

    const found = project.projects.find(
      (p: ProjectItem) => p._id.toString() === id
    );

    if (!found) {
      return NextResponse.json(
        { message: "Project not found" },
        { status: 404 }
      );
    }

    Object.assign(found, body);
    await project.save();

    return NextResponse.json(
      { data: project, message: "Project updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

/* ================= POST ================= */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const isAdmin = await verifyAdmin(request);

    if (!isAdmin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const project = await Project.findOne({});

    if (!project) {
      return NextResponse.json(
        { message: "Project container not found" },
        { status: 404 }
      );
    }

    project.projects.push(body);
    await project.save();

    return NextResponse.json(
      { data: project, message: "Project created successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

/* ================= DELETE ================= */

export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get("id");
    const isAdmin = await verifyAdmin(request);

    if (!isAdmin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (!id) {
      return NextResponse.json(
        { message: "Invalid request" },
        { status: 400 }
      );
    }

    await connectDB();
    const project = await Project.findOne({});

    if (!project) {
      return NextResponse.json(
        { message: "Project not found" },
        { status: 404 }
      );
    }

    project.projects = project.projects.filter(
      (p: ProjectItem) => p._id.toString() !== id
    );

    await project.save();

    return NextResponse.json(
      { data: project, message: "Project deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
