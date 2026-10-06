import { headers } from "next/headers";
import { normalizeCountryCode } from "./countryCodes";

// Visitor's country from Vercel's IP geolocation header (no browser permission involved); "" when unknown.
// `?geo=AE` overrides it everywhere except the production deployment, for testing locally / on previews.
export async function getVisitorCountry(geoParam?: string | string[]) {
    if (process.env.VERCEL_ENV !== "production") {
        const override = normalizeCountryCode(Array.isArray(geoParam) ? geoParam[0] : geoParam);
        if (override) return override;
    }

    const headerList = await headers();
    return normalizeCountryCode(headerList.get("x-vercel-ip-country"));
}
