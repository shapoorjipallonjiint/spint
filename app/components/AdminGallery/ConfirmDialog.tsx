"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

/** Generic confirmation dialog. Used before any destructive action. */
const ConfirmDialog = ({
    open,
    onOpenChange,
    title,
    children,
    confirmLabel = "Delete",
    destructive = true,
    onConfirm,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    children?: React.ReactNode;
    confirmLabel?: string;
    destructive?: boolean;
    onConfirm: () => Promise<void> | void;
}) => {
    const [busy, setBusy] = useState(false);

    const confirm = async () => {
        setBusy(true);
        try {
            await onConfirm();
        } finally {
            setBusy(false);
            onOpenChange(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-lg">{title}</DialogTitle>
                    {children && <DialogDescription asChild><div className="text-sm text-black/70">{children}</div></DialogDescription>}
                </DialogHeader>
                <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={busy}>
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        className={destructive ? "bg-red-600 hover:bg-red-700 text-white" : "text-white"}
                        onClick={confirm}
                        disabled={busy}
                    >
                        {busy ? "Please wait..." : confirmLabel}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ConfirmDialog;
