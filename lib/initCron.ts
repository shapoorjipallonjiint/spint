import { startUploadCleanupCron } from "@/lib/cron/cleanupUnusedUploads";

let started = false;

export function initCron() {
    if (!started) {
        console.log("Initializing cron...");
        startUploadCleanupCron();
        started = true;
    }
}