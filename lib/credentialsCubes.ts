export const CUBE_COLUMNS = [4, 3, 2, 1, 1];
export const CUBE_COUNT = CUBE_COLUMNS.reduce((sum, n) => sum + n, 0); // 11

export type CredentialCube = {
    value?: string;
    value_ar?: string;
    key?: string;
    key_ar?: string;
};

// where list item `index` sits: column and row (both 1-based, row counted from the top of that column)
export const CUBE_SLOTS = CUBE_COLUMNS.flatMap((count, col) =>
    Array.from({ length: count }, (_, row) => ({ column: col + 1, row: row + 1, rowsInColumn: count }))
);

// list -> columns of cubes (missing cubes become empty ones so the staircase keeps its shape)
export function toCubeColumns<T extends CredentialCube>(cubes: T[] | undefined | null): (T | CredentialCube)[][] {
    const list = Array.isArray(cubes) ? cubes : [];
    let start = 0;
    return CUBE_COLUMNS.map((count) => {
        const column = Array.from({ length: count }, (_, i) => list[start + i] ?? {});
        start += count;
        return column;
    });
}
