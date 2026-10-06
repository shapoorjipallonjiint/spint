"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Trash2, Pencil, Move, Briefcase, Users } from "lucide-react";
import MapPointPicker, { cityMapPoint } from "./MapPointPicker";
import { hasMapPoint } from "@/lib/mapDataHelper";
import { COUNTRY_OPTIONS } from "@/lib/countryCodes";

/* ---------------- TYPES ---------------- */

type City = {
    _id?: string;
    id?: "sp-group" | "sp-international" | "";
    name?: string;
    name_ar?: string;
    left?: string;
    top?: string;
    x?: number;
    y?: number;
    completedProjects?: string;
    employees?: string;
    showInProjectFilter?: boolean;
    code?: string;
};

// Radix Select can't hold "" as an item value
const NO_CODE = "none";

/* ---------------- COMPONENT ---------------- */

export default function MapSectionPage() {
    const [locations, setLocations] = useState<City[]>([]);
    const [open, setOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [editIndex, setEditIndex] = useState<number | null>(null);

    const [spGroupSearch, setSpGroupSearch] = useState("");
    const [spInternationalSearch, setSpInternationalSearch] = useState("");

    const { register, handleSubmit, control, watch, reset, setValue } = useForm<City>({
        defaultValues: { id: "" },
        shouldUnregister: false,
    });

    const selectedId = watch("id");
    const pickedX = watch("x");
    const pickedY = watch("y");
    const [pointError, setPointError] = useState(false);

    /* ---------------- FETCH ---------------- */

    const fetchMapData = async () => {
        try {
            const res = await fetch("/api/admin/home");
            const json = await res.json();

            setLocations(json.data?.sixthSection?.cities || []);
        } catch {
            toast.error("Failed to load map data");
        }
    };

    useEffect(() => {
        fetchMapData();
    }, []);

    /* ---------------- SAVE ---------------- */

    const saveLocationsToHome = async (updatedCities: City[]) => {
        try {
            setSaving(true);

            const res = await fetch("/api/admin/home", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                // only the cities path is written, so the section title (edited on the Home page) is never touched
                body: JSON.stringify({ "sixthSection.cities": updatedCities }),
            });

            if (!res.ok) throw new Error();

            toast.success("Location saved");
            setLocations(updatedCities);
            setOpen(false);
            setEditIndex(null);
            reset({ id: "" });
        } catch {
            toast.error("Failed to save location");
        } finally {
            setSaving(false);
        }
    };

    /* ---------------- ADD / EDIT ---------------- */

    const onSubmit = (data: City) => {
        // new countries must be placed on the map; existing ones keep their current position unless re-picked
        const existing = editIndex !== null ? locations[editIndex] : undefined;
        if (!hasMapPoint(data) && !(existing && cityMapPoint(existing))) {
            setPointError(true);
            return;
        }

        // merge onto the saved record so nothing the form doesn't show (_id, legacy left/top, ...) is ever dropped
        const updated =
            editIndex !== null
                ? locations.map((l, i) => (i === editIndex ? { ...l, ...data } : l))
                : [...locations, data];

        saveLocationsToHome(updated);
    };

    const handleDelete = (index: number) => {
        saveLocationsToHome(locations.filter((_, i) => i !== index));
    };

    /* ---------------- FILTERS ---------------- */

    const spGroupLocations = locations.filter((l) => l.id === "sp-group");
    const spInternationalLocations = locations.filter((l) => l.id === "sp-international");

    const filteredSpGroup = spGroupLocations.filter((l) => l.name?.toLowerCase().includes(spGroupSearch.toLowerCase()));

    const filteredSpInternational = spInternationalLocations.filter((l) =>
        l.name?.toLowerCase().includes(spInternationalSearch.toLowerCase())
    );

                console.log(locations, "locs");
    /* ---------------- UI ---------------- */

    return (
        <div className="p-6 space-y-4 fixed w-[calc(100vw-300px)]">
            {/* HEADER */}
            <div className="flex justify-between items-center">
                <h1 className="text-xl font-bold">Map Section</h1>
                <Button
                    className="text-white bg-black"
                    onClick={() => {
                        reset({
                            id: "",
                            showInProjectFilter: false,
                        });

                        setEditIndex(null);
                        setPointError(false);
                        setOpen(true);
                    }}
                >
                    Add Country
                </Button>
            </div>

            {/* TWO COLUMNS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* -------- SP GROUP -------- */}
                <Column
                    title="SP Group"
                    search={spGroupSearch}
                    setSearch={setSpGroupSearch}
                    locations={filteredSpGroup}
                    total={spGroupLocations.length}
                    locationsAll={locations}
                    reset={reset}
                    setEditIndex={setEditIndex}
                    setOpen={setOpen}
                    setPointError={setPointError}
                    handleDelete={handleDelete}
                    showStats={false}
                />

                {/* -------- SP INTERNATIONAL -------- */}
                <Column
                    title="SP International"
                    search={spInternationalSearch}
                    setSearch={setSpInternationalSearch}
                    locations={filteredSpInternational}
                    total={spInternationalLocations.length}
                    locationsAll={locations}
                    reset={reset}
                    setEditIndex={setEditIndex}
                    setOpen={setOpen}
                    setPointError={setPointError}
                    handleDelete={handleDelete}
                    showStats
                />
            </div>

            {/* -------- ADD / EDIT DIALOG -------- */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-4xl max-h-[95vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{editIndex !== null ? "Edit Country" : "Add Country"}</DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4">
                        {/* CATEGORY */}
                        <div className="col-span-2">
                            <Label>Category</Label>
                            <Controller
                                key={editIndex ?? "new"}
                                name="id"
                                control={control}
                                rules={{ required: true }}
                                render={({ field }) => (
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="sp-group">SP Group</SelectItem>
                                            <SelectItem value="sp-international">SP International</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </div>

                        <div>
                            <Label>Name</Label>
                            <Input {...register("name", { required: true })} placeholder="Name" />
                        </div>

                        <div>
                            <Label>Name (Arabic)</Label>
                            <Input {...register("name_ar", { required: true })} placeholder="Name (Arabic)" />
                        </div>

                        <div className="col-span-2">
                            <Label>Country Code</Label>
                            <Controller
                                key={`code-${editIndex ?? "new"}`}
                                name="code"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        value={field.value || NO_CODE}
                                        onValueChange={(v) => field.onChange(v === NO_CODE ? "" : v)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select country" />
                                        </SelectTrigger>
                                        <SelectContent className="max-h-72">
                                            <SelectItem value={NO_CODE}>None</SelectItem>
                                            {COUNTRY_OPTIONS.map((opt) => (
                                                <SelectItem key={opt.code} value={opt.code}>
                                                    {opt.name} ({opt.code})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                                Visitors from this country see its projects first on the Projects page.
                            </p>
                        </div>

                        <div className="col-span-2">
                            <Label>Position on map</Label>
                            <MapPointPicker
                                cities={locations}
                                editingCity={editIndex !== null ? locations[editIndex] : undefined}
                                picked={
                                    typeof pickedX === "number" && typeof pickedY === "number"
                                        ? { x: pickedX, y: pickedY }
                                        : undefined
                                }
                                onPick={({ x, y }) => {
                                    setValue("x", x, { shouldDirty: true });
                                    setValue("y", y, { shouldDirty: true });
                                    setPointError(false);
                                }}
                            />
                            {pointError && (
                                <p className="text-sm text-red-600 mt-1">Click on the map to place this country.</p>
                            )}
                        </div>

                        {selectedId === "sp-international" && (
                            <>
                                <div>
                                    <Label>Completed Projects</Label>
                                    <Input {...register("completedProjects", { required: true })} />
                                </div>

                                <div>
                                    <Label>Employees</Label>
                                    <Input {...register("employees", { required: true })} />
                                </div>
                            </>
                        )}

                                                <div className="col-span-2 flex items-center gap-2">
                            <Controller
                                name="showInProjectFilter"
                                control={control}
                                render={({ field }) => (
                                    <input
                                        type="checkbox"
                                        checked={!!field.value}
                                        onChange={(e) => field.onChange(e.target.checked)}
                                        className="h-4 w-4"
                                    />
                                )}
                            />
                            <Label>Show in Project Filter</Label>
                        </div>

                        <div className="col-span-2 flex justify-end gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    setOpen(false);
                                    setEditIndex(null);
                                    reset({ id: "" });
                                }}
                            >
                                Cancel
                            </Button>
                            <Button className="text-white bg-black" type="submit" disabled={saving}>
                                {saving ? "Saving..." : "Save"}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}

/* ---------------- COLUMN COMPONENT ---------------- */

type ColumnProps = {
    title: string;
    search: string;
    setSearch: React.Dispatch<React.SetStateAction<string>>;

    locations: City[];
    total: number;
    locationsAll: City[];

    reset: (values?: City) => void;
    setEditIndex: React.Dispatch<React.SetStateAction<number | null>>;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setPointError: React.Dispatch<React.SetStateAction<boolean>>;
    handleDelete: (index: number) => void;

    showStats: boolean;
};

function Column({
    title,
    search,
    setSearch,
    locations,
    total,
    locationsAll,
    reset,
    setEditIndex,
    setOpen,
    setPointError,
    handleDelete,
    showStats,
}: ColumnProps) {
    return (
        <div className="border rounded-md flex flex-col h-[calc(100vh-180px)]">
            {/* HEADER */}
            <div className="px-4 py-3 border-b bg-muted/40 space-y-2 sticky top-0 z-10">
                <div className="flex justify-between">
                    <p className="font-semibold">{title}</p>
                    <p className="text-sm text-muted-foreground">Count: {total}</p>
                </div>
                <Input
                    placeholder={`Search ${title}...`}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="h-8"
                />
            </div>

            {/* LIST */}
            <div className="flex-1 overflow-y-auto">
                {locations.map((loc: City) => {
                    const index = locationsAll.findIndex((l: City) => l === loc);

                    return (
                        <div key={index} className="p-4 flex justify-between items-center border-b last:border-b-0">
                            <div>
                                <p className="font-medium">
                                    {loc.name}
                                    {loc.code && <span className="ml-2 text-xs text-muted-foreground">({loc.code})</span>}
                                </p>

                                <div className="mt-1 flex flex-wrap gap-4 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                        <Move className="w-3.5 h-3.5" />
                                        {hasMapPoint(loc) ? `Map: ${loc.x}, ${loc.y}` : `X:${loc.left} Y:${loc.top} (typed)`}
                                    </div>

                                    {showStats && loc.completedProjects && (
                                        <div className="flex items-center gap-1">
                                            <Briefcase className="w-3.5 h-3.5" />
                                            {loc.completedProjects}
                                        </div>
                                    )}

                                    {showStats && loc.employees && (
                                        <div className="flex items-center gap-1">
                                            <Users className="w-3.5 h-3.5" />
                                            {loc.employees}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <Button
                                    className="text-white bg-black"
                                    size="sm"
                                    onClick={() => {
                                        reset(loc);
                                        setEditIndex(index);
                                        setPointError(false);
                                        setOpen(true);
                                    }}
                                >
                                    <Pencil />
                                </Button>

                                <Button className="text-white bg-black" size="sm" onClick={() => handleDelete(index)}>
                                    <Trash2 />
                                </Button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
