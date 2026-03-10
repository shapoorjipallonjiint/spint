import cron from "node-cron";
import connectDB from "@/lib/mongodb";
import Upload from "@/app/models/Upload";
import { deleteDropboxFile } from "@/lib/connectDropbox";
import { getDropboxPathFromUrl } from "@/lib/getDropboxPathFromUrl";

export function startUploadCleanupCron() {

    cron.schedule("0 0 3 * * *", async () => {

        console.log("Running unused upload cleanup...");

        try {

            await connectDB();

            const unusedFiles = await Upload.find({ status: "unused" });

            console.log("Found", unusedFiles.length, "unused files");

            for (const file of unusedFiles) {

                console.log("Deleting:", file.path);
                if (!file.path) continue;


                try {

                    await deleteDropboxFile(file.path);

                    await Upload.deleteOne({ _id: file._id });

                    console.log("Deleted:", file.path);

                } catch (err) {

                    console.error("Failed deleting:", file.path, err);

                }
            }

        } catch (error) {

            console.error("Cleanup job failed:", error);

        }

    });

}