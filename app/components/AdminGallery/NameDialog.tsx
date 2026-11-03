"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FormError } from "@/app/components/common/FormError";

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description?: string;
    initial?: { name: string; name_ar: string };
    onSave: (values: { name: string; name_ar: string }) => Promise<boolean>;
};

/** Form body. Mounted fresh each time the dialog opens, so it always starts from `initial`. */
const NameForm = ({ onOpenChange, title, description, initial, onSave }: Omit<Props, "open">) => {
    const [name, setName] = useState(initial?.name || "");
    const [nameAr, setNameAr] = useState(initial?.name_ar || "");
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);

    const submit = async () => {
        if (!name.trim()) {
            setError("English name is required");
            return;
        }
        setSaving(true);
        const ok = await onSave({ name: name.trim(), name_ar: nameAr.trim() });
        setSaving(false);
        if (ok) onOpenChange(false);
    };

    return (
        <>
            <DialogHeader>
                <DialogTitle className="text-lg">{title}</DialogTitle>
                {description && <DialogDescription>{description}</DialogDescription>}
            </DialogHeader>

            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <Label className="font-bold">Name (English)</Label>
                    <Input value={name} onChange={(e) => setName(e.target.value)} autoFocus />
                    <FormError error={error} />
                </div>
                <div className="flex flex-col gap-2">
                    <Label className="font-bold">Name (Arabic)</Label>
                    <Input value={nameAr} dir="rtl" onChange={(e) => setNameAr(e.target.value)} />
                </div>
            </div>

            <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
                    Cancel
                </Button>
                <Button type="button" className="text-white" onClick={submit} disabled={saving}>
                    {saving ? "Saving..." : "Save"}
                </Button>
            </div>
        </>
    );
};

/**
 * Add / edit dialog for an English + Arabic name.
 * `onSave` should resolve to true on success so the dialog can close.
 */
const NameDialog = ({ open, ...rest }: Props) => (
    <Dialog open={open} onOpenChange={rest.onOpenChange}>
        <DialogContent>{open && <NameForm {...rest} />}</DialogContent>
    </Dialog>
);

export default NameDialog;
