// One-time: fill `code` on Home > sixthSection.cities (map locations) from each location's name.
//   npm run backfill-country-codes            -> dry run, prints what would change, writes nothing
//   npm run backfill-country-codes -- --apply -> writes
// Only sets `code` on entries that have none (matched by _id); nothing else in the document is touched.
// Names it can't match are listed so the code can be picked in Admin > Home > Map Locations.
import mongoose from "mongoose";
import { guessCountryCode } from "../lib/countryCodes.ts";

type City = { _id: mongoose.Types.ObjectId; name?: string; code?: string };

const apply = process.argv.includes("--apply");

async function main() {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error("MONGODB_URI is not set (run through the npm script so .env.local is loaded)");

    await mongoose.connect(uri);
    const homes = mongoose.connection.db!.collection("homepresences");

    const home = await homes.findOne({}, { projection: { "sixthSection.cities": 1 } });
    const cities: City[] = home?.sixthSection?.cities || [];

    const toSet: { city: City; code: string }[] = [];
    const unmatched: City[] = [];
    let alreadySet = 0;

    for (const city of cities) {
        if (city.code) {
            alreadySet++;
            continue;
        }
        const code = guessCountryCode(city.name);
        if (code) toSet.push({ city, code });
        else unmatched.push(city);
    }

    console.log(`${cities.length} locations, ${alreadySet} already have a code\n`);
    console.log(`Will set (${toSet.length}):`);
    toSet.forEach(({ city, code }) => console.log(`  ${city.name} -> ${code}`));
    console.log(`\nNo match, pick manually in admin (${unmatched.length}):`);
    unmatched.forEach((city) => console.log(`  ${city.name ?? "(no name)"} [${city._id}]`));

    if (!apply) {
        console.log("\nDry run: nothing written. Re-run with --apply to save.");
    } else if (toSet.length) {
        for (const { city, code } of toSet) {
            await homes.updateOne(
                { _id: home!._id },
                { $set: { "sixthSection.cities.$[c].code": code } },
                // the code check again here so a code set meanwhile in admin is never overwritten
                { arrayFilters: [{ "c._id": city._id, "c.code": { $in: [null, ""] } }] }
            );
        }
        console.log(`\nSaved ${toSet.length} codes.`);
    }

    await mongoose.disconnect();
}

main().catch(async (error) => {
    console.error(error);
    await mongoose.disconnect();
    process.exit(1);
});
