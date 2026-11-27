// One-time cleanup: clear test placeholders in a page's English SEO (metaTitle / metaDescription), so the page keeps
// its layout default title until real SEO text is entered in the CMS. Only a field whose value is exactly the given
// placeholder is cleared; real text is never touched.
//   node --env-file=.env.local --disable-warning=MODULE_TYPELESS_PACKAGE_JSON scripts/clear-seo-placeholders.mts <collection> <placeholder>          -> dry run
//   node --env-file=.env.local --disable-warning=MODULE_TYPELESS_PACKAGE_JSON scripts/clear-seo-placeholders.mts <collection> <placeholder> --apply  -> writes
// e.g. scripts/clear-seo-placeholders.mts qualities quality
import mongoose from "mongoose";

const [collectionName, placeholder] = process.argv.slice(2).filter((arg) => !arg.startsWith("--"));
const apply = process.argv.includes("--apply");

async function main() {
    if (!collectionName || !placeholder) throw new Error("Usage: clear-seo-placeholders.mts <collection> <placeholder> [--apply]");
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error("MONGODB_URI is not set (run with --env-file=.env.local)");
    await mongoose.connect(uri);
    const collection = mongoose.connection.db!.collection(collectionName);

    const docs = await collection.find({}, { projection: { metaTitle: 1, metaDescription: 1 } }).toArray();
    if (docs.length !== 1) throw new Error(`Expected exactly 1 document in "${collectionName}", found ${docs.length}`);
    const doc = docs[0];

    const set: Record<string, string> = {};
    for (const field of ["metaTitle", "metaDescription"]) {
        if (doc[field] === placeholder) set[field] = "";
        console.log(`  ${field}: ${JSON.stringify(doc[field])}${field in set ? ' -> ""' : " (left as is)"}`);
    }

    if (!apply) console.log("\nDry run: nothing written. Re-run with --apply to save.");
    else if (Object.keys(set).length) {
        // only if the values are still the placeholders read above
        const filter: Record<string, unknown> = { _id: doc._id };
        for (const field of Object.keys(set)) filter[field] = placeholder;
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
