// ISO 3166-1 alpha-2 codes: the same standard Vercel uses for the `x-vercel-ip-country` request header
export const ISO_COUNTRY_CODES = [
    "AD", "AE", "AF", "AG", "AI", "AL", "AM", "AO", "AQ", "AR", "AS", "AT", "AU", "AW", "AX", "AZ",
    "BA", "BB", "BD", "BE", "BF", "BG", "BH", "BI", "BJ", "BL", "BM", "BN", "BO", "BQ", "BR", "BS",
    "BT", "BV", "BW", "BY", "BZ", "CA", "CC", "CD", "CF", "CG", "CH", "CI", "CK", "CL", "CM", "CN",
    "CO", "CR", "CU", "CV", "CW", "CX", "CY", "CZ", "DE", "DJ", "DK", "DM", "DO", "DZ", "EC", "EE",
    "EG", "EH", "ER", "ES", "ET", "FI", "FJ", "FK", "FM", "FO", "FR", "GA", "GB", "GD", "GE", "GF",
    "GG", "GH", "GI", "GL", "GM", "GN", "GP", "GQ", "GR", "GS", "GT", "GU", "GW", "GY", "HK", "HM",
    "HN", "HR", "HT", "HU", "ID", "IE", "IL", "IM", "IN", "IO", "IQ", "IR", "IS", "IT", "JE", "JM",
    "JO", "JP", "KE", "KG", "KH", "KI", "KM", "KN", "KP", "KR", "KW", "KY", "KZ", "LA", "LB", "LC",
    "LI", "LK", "LR", "LS", "LT", "LU", "LV", "LY", "MA", "MC", "MD", "ME", "MF", "MG", "MH", "MK",
    "ML", "MM", "MN", "MO", "MP", "MQ", "MR", "MS", "MT", "MU", "MV", "MW", "MX", "MY", "MZ", "NA",
    "NC", "NE", "NF", "NG", "NI", "NL", "NO", "NP", "NR", "NU", "NZ", "OM", "PA", "PE", "PF", "PG",
    "PH", "PK", "PL", "PM", "PN", "PR", "PS", "PT", "PW", "PY", "QA", "RE", "RO", "RS", "RU", "RW",
    "SA", "SB", "SC", "SD", "SE", "SG", "SH", "SI", "SJ", "SK", "SL", "SM", "SN", "SO", "SR", "SS",
    "ST", "SV", "SX", "SY", "SZ", "TC", "TD", "TF", "TG", "TH", "TJ", "TK", "TL", "TM", "TN", "TO",
    "TR", "TT", "TV", "TW", "TZ", "UA", "UG", "UM", "US", "UY", "UZ", "VA", "VC", "VE", "VG", "VI",
    "VN", "VU", "WF", "WS", "YE", "YT", "ZA", "ZM", "ZW",
] as const;

const VALID_CODES = new Set<string>(ISO_COUNTRY_CODES);

const englishNames = new Intl.DisplayNames(["en"], { type: "region" });

export const countryCodeName = (code: string) => englishNames.of(code) || code;

// sorted by name, for the admin dropdown
export const COUNTRY_OPTIONS = ISO_COUNTRY_CODES.map((code) => ({ code, name: countryCodeName(code) })).sort((a, b) =>
    a.name.localeCompare(b.name)
);

// "ae " -> "AE"; anything that is not a real ISO code -> "" (no match)
export const normalizeCountryCode = (value?: string | null) => {
    const code = (value || "").trim().toUpperCase();
    return VALID_CODES.has(code) ? code : "";
};

const nameKey = (name: string) =>
    name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .replace(/[^a-z]/g, "");

// short / local names an admin may have typed that differ from the standard English name
const NAME_ALIASES: Record<string, string> = {
    uae: "AE",
    emirates: "AE",
    ksa: "SA",
    saudi: "SA",
    kingdomofsaudiarabia: "SA",
    uk: "GB",
    england: "GB",
    greatbritain: "GB",
    usa: "US",
    us: "US",
    unitedstatesofamerica: "US",
    srilanka: "LK",
    ivorycoast: "CI",
    turkey: "TR",
    turkiye: "TR",
};

const CODE_BY_NAME = new Map<string, string>(ISO_COUNTRY_CODES.map((code) => [nameKey(countryCodeName(code)), code]));

// best-effort name -> code, used only by the one-time backfill (unmatched names are left for the admin to pick)
export const guessCountryCode = (name?: string | null) => {
    const key = nameKey(name || "");
    if (!key) return "";
    return CODE_BY_NAME.get(key) || NAME_ALIASES[key] || "";
};
