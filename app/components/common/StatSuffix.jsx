import { getSuffix } from "@/helpers/getSuffix.ts";

// Suffix after a stat number from the CMS ("60th" -> "th", "1st" -> "st", "40+" -> "+").
// Ordinals (st / nd / rd / th) are shown small and raised (superscript), their top roughly level with the top of
// the digits; anything else ("+", "%", ...) stays as plain text.
// Positioned with `relative` instead of vertical-align so the line height (and the row of stats) doesn't shift.
const StatSuffix = ({ value }) => {
    const suffix = getSuffix(value);
    if (/^(st|nd|rd|th)$/i.test(suffix.trim())) {
        return <span className="relative -top-[0.65em] ms-[0.05em] text-[0.5em]">{suffix.trim()}</span>;
    }
    return suffix;
};

export default StatSuffix;
