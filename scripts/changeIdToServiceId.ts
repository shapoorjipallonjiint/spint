import fs from "fs";
import mongoose from "mongoose";
import connectDB from "../lib/mongodb";
import Project from "../app/models/Project";

async function migrateFromJSON() {
  await connectDB();

  // 📂 load your JSON file
  const raw = fs.readFileSync("./test.projects.json", "utf-8");
  const jsonData = JSON.parse(raw);

  const dbProject = await Project.findOne({});

  if (!dbProject) {
    console.log("❌ No project found in DB");
    return;
  }

  jsonData[0].projects.forEach((jsonProject: any) => {
    const dbProjectItem = dbProject.projects.find(
      (p: any) => p.slug === jsonProject.slug
    );

    if (!dbProjectItem) return;

    // 🔥 transform services
    const oldServices = jsonProject.secondSection?.service || [];

    dbProjectItem.secondSection.service = oldServices.map((s: any) => {
      const serviceId = s.$oid || s; // handle both formats

      return {
        serviceId: new mongoose.Types.ObjectId(serviceId),
        firstSection: {
          title: "",
          title_ar: "",
          description: "",
          description_ar: "",
        },
        secondSection: {
          title: "",
          title_ar: "",
          description: "",
          description_ar: "",
        },
      };
    });
  });

  await dbProject.save();

  console.log("✅ Migration from JSON completed");
}

migrateFromJSON();