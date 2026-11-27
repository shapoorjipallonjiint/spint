// One-time: clear the "LeadershipAR" test placeholders in Leadership > SEO (English Meta Title / Meta Description),
// so the Leadership page keeps its default title (layout) until real SEO text is entered in the CMS.
//   node --env-file=.env.local --disable-warning=MODULE_TYPELESS_PACKAGE_JSON scripts/clear-leadership-seo-placeholders.mts            -> dry run
//   node --env-file=.env.local --disable-warning=MODULE_TYPELESS_PACKAGE_JSON scripts/clear-leadership-seo-placeholders.mts --apply    -> writes
// Only a field whose value is exactly the placeholder is cleared; anything else (real text) is left alone.
import mongoose from "mongoose";

const PLACEHOLDER = "LeadershipAR";
const apply = process.argv.includes("--apply");

async function main() {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error("MONGODB_URI is not set (run with --env-file=.env.local)");
    await mongoose.connect(uri);
    const collection = mongoose.connection.db!.collection("leaderships");

    const docs = await collection.find({}, { projection: { metaTitle: 1, metaDescription: 1 } }).toArray();
    if (docs.length !== 1) throw new Error(`Expected exactly 1 leadership document, found ${docs.length}`);
    const doc = docs[0];

    const set: Record<string, string> = {};
    for (const field of ["metaTitle", "metaDescription"]) {
        if (doc[field] === PLACEHOLDER) set[field] = "";
        console.log(`  ${field}: ${JSON.stringify(doc[field])}${field in set ? ' -> ""' : " (left as is)"}`);
    }

    if (!apply) console.log("\nDry run: nothing written. Re-run with --apply to save.");
    else if (Object.keys(set).length) {
        // only if the values are still the placeholders read above
        const filter: Record<string, unknown> = { _id: doc._id };
        for (const field of Object.keys(set)) filter[field] = PLACEHOLDER;
        const result = await collection.updateOne(filter, { $set: set });
        console.log(`\nSaved (matched: ${result.matchedCount}, modified: ${result.modifiedCount}).`);
    } else console.log("\nNothing to change.");

    await mongoose.disconnect();
}

main().catch(async (error) => {
    console.error(error);
    await mongoose.disconnect();
    process.exit(1);
});
