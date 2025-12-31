"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Trash2, Pencil, Move, Briefcase, Users } from "lucide-react";

/* ---------------- TYPES ---------------- */

type City = {
  id?: "sp-group" | "sp-international" | "";
  name?: string;
  name_ar?: string;
  left?: string;
  top?: string;
  completedProjects?: string;
  employees?: string;
};

/* ---------------- COMPONENT ---------------- */

export default function MapSectionPage() {
  const [locations, setLocations] = useState<City[]>([]);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const [spGroupSearch, setSpGroupSearch] = useState("");
  const [spInternationalSearch, setSpInternationalSearch] = useState("");

  const { register, handleSubmit, control, watch, reset } = useForm<City>({
    defaultValues: { id: "" },
    shouldUnregister: true,
  });

  const selectedId = watch("id");

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
        body: JSON.stringify({
          sixthSection: { cities: updatedCities },
        }),
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
    const updated =
      editIndex !== null
        ? locations.map((l, i) => (i === editIndex ? data : l))
        : [...locations, data];

    saveLocationsToHome(updated);
  };

  const handleDelete = (index: number) => {
    saveLocationsToHome(locations.filter((_, i) => i !== index));
  };

  /* ---------------- FILTERS ---------------- */

  const spGroupLocations = locations.filter((l) => l.id === "sp-group");
  const spInternationalLocations = locations.filter(
    (l) => l.id === "sp-international"
  );

  const filteredSpGroup = spGroupLocations.filter((l) =>
    l.name?.toLowerCase().includes(spGroupSearch.toLowerCase())
  );

  const filteredSpInternational = spInternationalLocations.filter((l) =>
    l.name?.toLowerCase().includes(spInternationalSearch.toLowerCase())
  );

  /* ---------------- UI ---------------- */

  return (
    <div className="p-6 space-y-4 fixed w-[calc(100vw-300px)]">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Map Section</h1>
        <Button
          className="text-white bg-black"
          onClick={() => {
            reset({ id: "" });
            setEditIndex(null);
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
          handleDelete={handleDelete}
          showStats
        />
      </div>

      {/* -------- ADD / EDIT DIALOG -------- */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editIndex !== null ? "Edit Country" : "Add Country"}
            </DialogTitle>
          </DialogHeader>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-2 gap-4"
          >
            {/* CATEGORY */}
            <div className="col-span-2">
              <Label>Category</Label>
              <Controller
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
                      <SelectItem value="sp-international">
                        SP International
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <Input {...register("name", { required: true })} placeholder="Name" />
            <Input
              {...register("name_ar", { required: true })}
              placeholder="Name (Arabic)"
            />
            <Input {...register("left", { required: true })} placeholder="X (%)" />
            <Input {...register("top", { required: true })} placeholder="Y (%)" />

            {selectedId === "sp-international" && (
              <>
                <Input
                  {...register("completedProjects", { required: true })}
                  placeholder="Completed Projects"
                />
                <Input
                  {...register("employees", { required: true })}
                  placeholder="Employees"
                />
              </>
            )}

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
              <Button type="submit" disabled={saving}>
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
            <div
              key={index}
              className="p-4 flex justify-between items-center border-b last:border-b-0"
            >
              <div>
                <p className="font-medium">{loc.name}</p>

                <div className="mt-1 flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Move className="w-3.5 h-3.5" />
                    X:{loc.left} Y:{loc.top}
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
                    setOpen(true);
                  }}
                >
                  <Pencil />
                </Button>

                <Button
                  className="text-white bg-black"
                  size="sm"
                  onClick={() => handleDelete(index)}
                >
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
