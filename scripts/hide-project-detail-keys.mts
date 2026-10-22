// One-time: turn on the admin eye toggle (hidden: true) for project detail rows other than Client, Consultant and Location,
// so the site keeps showing only those (Project, Sector and Status come from their own fields).
//   npm run hide-project-detail-keys            -> dry run, prints what would change, writes nothing
//   npm run hide-project-detail-keys -- --apply -> writes
// Only adds `hidden` to rows that don't have it yet; keys and values are never touched, and nothing is removed.
// Take a backup of the projects collection before running with --apply.
import mongoose from "mongoose";

type Item = { key?: string; value?: string; hidden?: boolean };
type ProjectItem = { _id: mongoose.Types.ObjectId; firstSection?: { title?: string }; secondSection?: { items?: Item[] } };

const SHOWN = /^\s*(client|consultants?|location)\b/i;
const apply = process.argv.includes("--apply");

async function main() {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error("MONGODB_URI is not set (run through the npm script so .env.local is loaded)");

    await mongoose.connect(uri);
    const collection = mongoose.connection.db!.collection("projects");

    const doc = await collection.findOne({}, { projection: { "projects._id": 1, "projects.firstSection.title": 1, "projects.secondSection.items": 1 } });
    if (!doc) throw new Error("No projects document found");
    const projects: ProjectItem[] = doc.projects || [];

    const byKey = new Map<string, number>();
    let alreadySet = 0;
    for (const project of projects) {
        for (const item of project.secondSection?.items || []) {
            if (SHOWN.test(item.key ?? "")) continue;
            if (item.hidden !== undefined) {
                alreadySet++;
                continue;
            }
            const key = (item.key ?? "").trim() || "(empty key)";
            byKey.set(key, (byKey.get(key) || 0) + 1);
        }
    }
    const total = [...byKey.values()].reduce((sum, n) => sum + n, 0);

    console.log(`${projects.length} projects, ${alreadySet} rows already have a hidden setting (left as is)\n`);
    console.log(`Will hide (${total} rows):`);
    [...byKey].sort((a, b) => b[1] - a[1]).forEach(([key, n]) => console.log(`  ${key}: ${n}`));

    if (!apply) {
        console.log("\nDry run: nothing written. Re-run with --apply to save.");
    } else if (total) {
        const result = await collection.updateOne(
            { _id: doc._id },
            { $set: { "projects.$[].secondSection.items.$[it].hidden": true } },
            // rows with a hidden setting already (e.g. set meanwhile in admin) are never overwritten
            { arrayFilters: [{ "it.key": { $not: SHOWN }, "it.hidden": { $exists: false } }] }
        );
        console.log(`\nSaved (modified: ${result.modifiedCount}).`);
    }

    await mongoose.disconnect();
}

main().catch(async (error) => {
    console.error(error);
    await mongoose.disconnect();
    process.exit(1);
});
