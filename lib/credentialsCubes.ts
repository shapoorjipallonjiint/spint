// Homepage "Our Credentials" cubes.
// `columns` (admin: Home > Third Section) = how many cubes each column has, left to right. The cubes list fills the
// columns BOTTOM TO TOP: item 1 is the bottom cube of column 1, then up that column, then column 2 from the bottom...
// Documents saved before `columns` existed have no layout stored: they keep the original fixed layout below, which
// filled each column top to bottom (the admin converts them to the new order on load, see fromLegacyCubes).
export const DEFAULT_CUBE_COLUMNS = [4, 3, 2, 1, 1];

export type CredentialCube = {
    value?: string;
    value_ar?: string;
    key?: string;
    key_ar?: string;
};

// a usable layout: positive whole numbers only; anything else falls back to the default
export function normalizeColumns(columns: unknown): number[] | null {
    if (!Array.isArray(columns)) return null;
    const clean = columns.map((n) => Math.floor(Number(n))).filter((n) => Number.isFinite(n) && n > 0);
    return clean.length ? clean : null;
}

// list indexes per column, in RENDER order (each column top cube first). legacy = old top-to-bottom fill.
export function cubeColumnIndexes(columns: unknown): number[][] {
    const layout = normalizeColumns(columns);
    const counts = layout ?? DEFAULT_CUBE_COLUMNS;
    let start = 0;
    return counts.map((count) => {
        const indexes = Array.from({ length: count }, (_, i) => start + i);
        start += count;
        // new layout: list goes bottom -> top, so the top cube is the last one of the column
        return layout ? indexes.reverse() : indexes;
    });
}

// list -> columns of cubes in render order (missing cubes become empty ones so the staircase keeps its shape)
export function toCubeColumns<T extends CredentialCube>(cubes: T[] | undefined | null, columns?: unknown): (T | CredentialCube)[][] {
    const list = Array.isArray(cubes) ? cubes : [];
    return cubeColumnIndexes(columns).map((indexes) => indexes.map((i) => list[i] ?? {}));
}

// where list item `index` sits (1-based column; row counted from the bottom, 1 = bottom)
export function cubeSlot(columns: unknown, index: number) {
    const cols = cubeColumnIndexes(columns);
    for (let c = 0; c < cols.length; c++) {
        const pos = cols[c].indexOf(index);
        if (pos !== -1) return { column: c + 1, rowFromBottom: cols[c].length - pos, rowsInColumn: cols[c].length };
    }
    return null;
}

// Old documents (no `columns`): reorder the list into the new bottom-to-top order for the default layout, so every
// cube stays exactly where it is on the site. Cubes beyond the layout are kept at the end, untouched.
export function fromLegacyCubes<T extends CredentialCube>(cubes: T[] | undefined | null): { columns: number[]; cubes: (T | CredentialCube)[] } {
    const list = Array.isArray(cubes) ? cubes : [];
    const legacy = cubeColumnIndexes(null); // old top-to-bottom indexes, render order
    const next: (T | CredentialCube)[] = [];
    // new order: per column, bottom cube first = legacy render order reversed
    legacy.forEach((indexes) => [...indexes].reverse().forEach((i) => next.push(list[i] ?? {})));
    const used = DEFAULT_CUBE_COLUMNS.reduce((sum, n) => sum + n, 0);
    return { columns: [...DEFAULT_CUBE_COLUMNS], cubes: [...next, ...list.slice(used)] };
}
