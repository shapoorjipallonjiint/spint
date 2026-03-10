export function getDropboxPathFromUrl(url: string) {
    const clean = url.split("?")[0];

    console.log("Clean URL:", clean);

    const parts = clean.split("/uploads/");

    if (parts.length < 2) return null;

    console.log("Parts:", parts);
    return `/uploads/${parts[1]}`;
}