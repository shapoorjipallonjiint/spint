// One-time: set the Home CMS values that the home page now reads so the site looks exactly as it did when they were
// hardcoded:
//   - First Section > Sub Title Link: "##" placeholder -> "/about-us" (the hero arrow's link)
//   - Seventh Section > Button Text -> "People & Careers" (the careers button label)
//   - Fifth Section items > Image Alt / Logo Alt -> "<title> sector" / "<title> icon"
//   - (only while empty) Social Icons Label, Second / Third Section button text, map legend labels -> the site text
//   npm run align-home-cms-with-site            -> dry run, prints what would change, writes nothing
//   npm run align-home-cms-with-site -- --apply -> writes
// Only these English fields are set (with $set on their exact paths); nothing else in the document is touched or removed.
import mongoose from "mongoose";

type SectorItem = { _id: mongoose.Types.ObjectId; title?: string; imageAlt?: string; logoAlt?: string };

const apply = process.argv.includes("--apply");

async function main() {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error("MONGODB_URI is not set (run through the npm script so .env.local is loaded)");

    await mongoose.connect(uri);
    // collection of the HomePresence model (app/models/Home.ts)
    const collection = mongoose.connection.db!.collection("homepresences");

    const docs = await collection.find({}).toArray();
    if (docs.length !== 1) throw new Error(`Expected exactly 1 home document, found ${docs.length}`);
    const doc = docs[0];

    const set: Record<string, string> = {};
    const changes: string[] = [];
    const plan = (path: string, from: unknown, to: string) => {
        if (from === to) return;
        set[path] = to;
        changes.push(`  ${path}: ${JSON.stringify(from)} -> ${JSON.stringify(to)}`);
    };

    // fields added later (label / button text / legend): filled with the text the site shows when they are empty,
    // only while they are still empty, so a value typed in the CMS is never overwritten
    const fillIfEmpty = (path: string, current: unknown, to: string) => {
        if (typeof current === "string" && current.trim()) return;
        plan(path, current, to);
    };
    fillIfEmpty("firstSection.socialLabel", doc.firstSection?.socialLabel, "Stay Connected");
    fillIfEmpty("secondSection.button.text", doc.secondSection?.button?.text, "READ MORE");
    fillIfEmpty("thirdSection.buttonText", doc.thirdSection?.buttonText, "READ MORE");
    fillIfEmpty("sixthSection.legend.spGroup", doc.sixthSection?.legend?.spGroup, "SP Group");
    fillIfEmpty("sixthSection.legend.spInternational", doc.sixthSection?.legend?.spInternational, "SP International");

    plan("firstSection.subTitle.link", doc.firstSection?.subTitle?.link, "/about-us");
    plan("seventhSection.button.text", doc.seventhSection?.button?.text, "People & Careers");
    (doc.fifthSection?.items as SectorItem[] | undefined)?.forEach((item, i) => {
        const title = item.title ?? "";
        plan(`fifthSection.items.${i}.imageAlt`, item.imageAlt, `${title} sector`);
        plan(`fifthSection.items.${i}.logoAlt`, item.logoAlt, `${title} icon`);
    });

    console.log(changes.length ? `Will change (${changes.length}):\n${changes.join("\n")}` : "Nothing to change.");

    if (!apply) {
        console.log("\nDry run: nothing written. Re-run with --apply to save.");
    } else if (changes.length) {
        // only if the document is still the one read above (same sector count), so array indexes still match
        const result = await collection.updateOne(
            { _id: doc._id, "fifthSection.items": { $size: doc.fifthSection?.items?.length ?? 0 } },
            { $set: set }
        );
        console.log(`\nSaved (matched: ${result.matchedCount}, modified: ${result.modifiedCount}).`);
    }

    await mongoose.disconnect();
}

main().catch(async (error) => {
    console.error(error);
    await mongoose.disconnect();
    process.exit(1);
});
