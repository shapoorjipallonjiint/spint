"use client";

import { useState } from "react";
import type { UseFormSetValue, FieldValues, Path, PathValue } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { DEFAULT_CUBE_COLUMNS, cubeColumnIndexes, cubeSlot, normalizeColumns, type CredentialCube } from "@/lib/credentialsCubes";

// Admin editor for the homepage "Our Credentials" cubes: a preview of the staircase (same layout as the site).
// - Column layout: how many cubes each column has (cubes fill each column bottom to top).
// - Drag a cube onto another to swap the two exactly (both languages move together).
// - Click a cube to edit its value + label in a modal; Save puts it in the form (the page's Submit stores it).
// The whole cubes list is always written back, so no cube (or its other language) is ever lost - cubes that no
// longer fit the layout are kept in the data, just not shown.
type Props<T extends FieldValues> = {
    setValue: UseFormSetValue<T>;
    cubes: CredentialCube[] | undefined; // live values (watch)
    name: Path<T>; // e.g. "thirdSection.credentials.cubes"
    columns: number[] | undefined; // live values (watch)
    columnsName: Path<T>; // e.g. "thirdSection.credentials.columns"
    lang?: "en" | "ar";
    showLayout?: boolean; // the layout is shared by both languages; show its controls in one column only
};

const MAX_PER_COLUMN = 8;

const CredentialsCubesEditor = <T extends FieldValues>({
    setValue,
    cubes,
    name,
    columns,
    columnsName,
    lang = "en",
    showLayout = true,
}: Props<T>) => {
    const ar = lang === "ar";
    const valueKey = ar ? "value_ar" : "value";
    const labelKey = ar ? "key_ar" : "key";

    const layout = normalizeColumns(columns) ?? DEFAULT_CUBE_COLUMNS;
    const total = layout.reduce((sum, n) => sum + n, 0);

    const [editing, setEditing] = useState<number | null>(null);
    const [draft, setDraft] = useState({ value: "", label: "" });
    const [dragFrom, setDragFrom] = useState<number | null>(null);
    const [dragOver, setDragOver] = useState<number | null>(null);

    // full list, padded to the layout and never shorter than what is stored
    const fullList = () =>
        Array.from({ length: Math.max(total, cubes?.length ?? 0) }, (_, i) => ({ ...(cubes?.[i] ?? {}) }));
    const writeCubes = (next: CredentialCube[]) => setValue(name, next as PathValue<T, Path<T>>, { shouldDirty: true });
    const writeLayout = (next: number[]) => setValue(columnsName, next as PathValue<T, Path<T>>, { shouldDirty: true });

    const openCube = (index: number) => {
        const cube = cubes?.[index] ?? {};
        setDraft({ value: cube[valueKey] ?? "", label: cube[labelKey] ?? "" });
        setEditing(index);
    };

    const save = () => {
        if (editing === null) return;
        const next = fullList();
        next[editing] = { ...next[editing], [valueKey]: draft.value, [labelKey]: draft.label };
        writeCubes(next);
        setEditing(null);
    };

    // exact position exchange: the dragged cube and the drop target swap places, nothing else moves
    const swap = (from: number, to: number) => {
        if (from === to) return;
        const next = fullList();
        [next[from], next[to]] = [next[to], next[from]];
        writeCubes(next);
    };

    const setColumnCount = (col: number, count: number) => {
        const next = [...layout];
        next[col] = Math.min(MAX_PER_COLUMN, Math.max(1, Math.floor(count) || 1));
        writeLayout(next);
    };

    const columnsInView = cubeColumnIndexes(layout).map((indexes) => indexes.map((index) => ({ index, cube: cubes?.[index] ?? {} })));
    const hiddenCount = Math.max(0, (cubes?.length ?? 0) - total);
    const slot = editing !== null ? cubeSlot(layout, editing) : null;
    const english = editing !== null ? cubes?.[editing] : undefined;

    return (
        <div className="rounded-md border border-black/20 bg-[#F5F5F5] p-4 flex flex-col gap-4">
            {showLayout && (
                <div className="flex flex-col gap-2">
                    <Label className="font-bold">Column layout</Label>
                    <p className="text-xs text-black/60">
                        Cubes in each column, left to right. Cubes fill each column from the bottom up.
                    </p>
                    <div className="flex flex-wrap items-end gap-2">
                        {layout.map((count, col) => (
                            <div key={col} className="flex flex-col gap-1 items-center">
                                <span className="text-[11px] text-black/50">Col {col + 1}</span>
                                <Input
                                    type="number"
                                    min={1}
                                    max={MAX_PER_COLUMN}
                                    value={count}
                                    onChange={(e) => setColumnCount(col, Number(e.target.value))}
                                    className="w-16 text-center bg-white"
                                />
                            </div>
                        ))}
                        <Button type="button" variant="outline" onClick={() => writeLayout([...layout, 1])}>
                            + Column
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            disabled={layout.length <= 1}
                            onClick={() => writeLayout(layout.slice(0, -1))}
                        >
                            − Column
                        </Button>
                    </div>
                    {hiddenCount > 0 && (
                        <p className="text-xs text-amber-700">
                            {hiddenCount} cube{hiddenCount > 1 ? "s are" : " is"} kept but not shown (more cubes than the layout has room for).
                            Add room to show {hiddenCount > 1 ? "them" : "it"} again.
                        </p>
                    )}
                </div>
            )}

            <div>
                <p className="text-xs text-black/60 mb-3">
                    Same layout as the homepage. Click a cube to edit it; drag a cube onto another to swap their places.
                    {ar && " Empty Arabic text shows the English text on the Arabic site."}
                </p>
                <div dir="ltr" className="flex items-end gap-[3px] overflow-x-auto pb-1">
                    {columnsInView.map((column, colIndex) => (
                        <div key={colIndex} className="flex flex-col gap-[3px]">
                            {column.map(({ cube, index }) => {
                                const value = (ar && cube.value_ar) || cube.value || "";
                                const label = (ar && cube.key_ar) || cube.key || "";
                                return (
                                    <button
                                        key={index}
                                        type="button"
                                        draggable
                                        onDragStart={(e) => {
                                            e.dataTransfer.effectAllowed = "move";
                                            e.dataTransfer.setData("text/plain", String(index));
                                            setDragFrom(index);
                                        }}
                                        onDragOver={(e) => {
                                            if (dragFrom === null) return;
                                            e.preventDefault();
                                            e.dataTransfer.dropEffect = "move";
                                            setDragOver(index);
                                        }}
                                        onDragLeave={() => setDragOver((o) => (o === index ? null : o))}
                                        onDrop={(e) => {
                                            e.preventDefault();
                                            if (dragFrom !== null) swap(dragFrom, index);
                                            setDragFrom(null);
                                            setDragOver(null);
                                        }}
                                        onDragEnd={() => {
                                            setDragFrom(null);
                                            setDragOver(null);
                                        }}
                                        onClick={() => openCube(index)}
                                        title={`Cube ${index + 1}: click to edit, drag to swap`}
                                        className={`relative w-[92px] h-[72px] px-1 flex flex-col items-center justify-center text-center text-white cursor-grab active:cursor-grabbing hover:ring-4 hover:ring-amber-400 hover:z-10 transition-[box-shadow,opacity] ${
                                            dragFrom === index ? "opacity-40" : ""
                                        } ${dragOver === index && dragFrom !== index ? "ring-4 ring-emerald-400 z-10" : ""}`}
                                        style={{ background: "linear-gradient(360deg, #1E45A2 0%, #30B6F9 100%)" }}
                                    >
                                        <span className="absolute top-0.5 left-1 text-[10px] font-bold text-white/80">{index + 1}</span>
                                        <span className="text-[12px] font-semibold leading-tight">{value || "—"}</span>
                                        <span className="text-[9px] font-light leading-tight">{label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>

            <Dialog open={editing !== null} onOpenChange={(open) => !open && setEditing(null)}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>
                            Cube {editing !== null ? editing + 1 : ""}
                            {slot && (
                                <span className="block text-sm font-normal text-black/50">
                                    Column {slot.column},{" "}
                                    {slot.rowsInColumn === 1 ? "single cube" : `row ${slot.rowFromBottom} of ${slot.rowsInColumn} (from the bottom)`}
                                    {ar && " (Arabic)"}
                                </span>
                            )}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-1">
                            <Label className="font-bold">Value (bold)</Label>
                            <Input
                                type="text"
                                autoFocus
                                placeholder={ar ? english?.value || "Value" : "e.g. 1,500+"}
                                value={draft.value}
                                onChange={(e) => setDraft((d) => ({ ...d, value: e.target.value }))}
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <Label className="font-bold">Label</Label>
                            <Input
                                type="text"
                                placeholder={ar ? english?.key || "Label" : "e.g. PMV Assets"}
                                value={draft.label}
                                onChange={(e) => setDraft((d) => ({ ...d, label: e.target.value }))}
                                onKeyDown={(e) => {
                                    // Enter saves the cube instead of submitting the whole page form
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        save();
                                    }
                                }}
                            />
                        </div>
                        <p className="text-xs text-black/50">Click the page&apos;s Submit button afterwards to save it to the website.</p>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setEditing(null)}>
                            Cancel
                        </Button>
                        <Button type="button" onClick={save}>
                            Save
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default CredentialsCubesEditor;
