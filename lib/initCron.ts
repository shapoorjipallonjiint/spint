// import { startUploadCleanupCron } from "@/lib/cron/cleanupUnusedUploads";

let started = false;

export function initCron() {
    if (!started) {
        console.log("Initializing cron...");
        // disabled for now: only the About save marks uploads as "used", so this nightly job
        // would delete images that other pages still use. Re-enable once usage detection covers every page.
        // startUploadCleanupCron();
        started = true;
    }
}