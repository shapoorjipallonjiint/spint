"use client";

import { useState } from "react";
import type { UseFormSetValue, FieldValues, Path, PathValue } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { CUBE_COUNT, CUBE_SLOTS, toCubeColumns, type CredentialCube } from "@/lib/credentialsCubes";

// Admin editor for the homepage "Our Credentials" cubes: a preview of the staircase (same layout as the site).
// Clicking a cube opens a modal to edit its value + label; Save puts the change in the form (the page's Save button
// stores it), Cancel drops it. The whole cubes list is written back on each change, so other cubes are never lost.
type Props<T extends FieldValues> = {
    setValue: UseFormSetValue<T>;
    cubes: CredentialCube[] | undefined; // live values (watch)
    name: Path<T>; // e.g. "thirdSection.credentials.cubes"
    lang?: "en" | "ar";
};

const CredentialsCubesEditor = <T extends FieldValues>({ setValue, cubes, name, lang = "en" }: Props<T>) => {
    const ar = lang === "ar";
    const valueKey = ar ? "value_ar" : "value";
    const labelKey = ar ? "key_ar" : "key";

    const [editing, setEditing] = useState<number | null>(null);
    const [draft, setDraft] = useState({ value: "", label: "" });

    const openCube = (index: number) => {
        const cube = cubes?.[index] ?? {};
        setDraft({ value: cube[valueKey] ?? "", label: cube[labelKey] ?? "" });
        setEditing(index);
    };

    const save = () => {
        if (editing === null) return;
        // full list (padded to all cubes) so saving one cube keeps every other cube and its other language
        const next = Array.from({ length: CUBE_COUNT }, (_, i) => ({ ...(cubes?.[i] ?? {}) }));
        next[editing] = { ...next[editing], [valueKey]: draft.value, [labelKey]: draft.label };
        setValue(name, next as PathValue<T, Path<T>>, { shouldDirty: true });
        setEditing(null);
    };

    let index = 0;
    const columns = toCubeColumns(cubes).map((column) => column.map((cube) => ({ cube, index: index++ })));
    const slot = editing !== null ? CUBE_SLOTS[editing] : null;
    const english = editing !== null ? cubes?.[editing] : undefined;

    return (
        <div className="rounded-md border border-black/20 bg-[#F5F5F5] p-4">
            <p className="text-xs text-black/60 mb-3">
                Same layout as the homepage. Click a cube to edit its value and label.
                {ar && " Empty Arabic text shows the English text on the Arabic site."}
            </p>
            <div dir="ltr" className="flex items-end gap-[3px] overflow-x-auto pb-1">
                {columns.map((column, colIndex) => (
                    <div key={colIndex} className="flex flex-col gap-[3px]">
                        {column.map(({ cube, index }) => {
                            const value = (ar && cube.value_ar) || cube.value || "";
                            const label = (ar && cube.key_ar) || cube.key || "";
                            return (
                                <button
                                    key={index}
                                    type="button"
                                    onClick={() => openCube(index)}
                                    title={`Edit cube ${index + 1}`}
                                    className="relative w-[92px] h-[72px] px-1 flex flex-col items-center justify-center text-center text-white cursor-pointer hover:ring-4 hover:ring-amber-400 hover:z-10 transition-shadow"
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

            <Dialog open={editing !== null} onOpenChange={(open) => !open && setEditing(null)}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>
                            Cube {editing !== null ? editing + 1 : ""}
                            {slot && (
                                <span className="block text-sm font-normal text-black/50">
                                    Column {slot.column}, {slot.rowsInColumn === 1 ? "single cube" : `row ${slot.row} of ${slot.rowsInColumn}`}
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
