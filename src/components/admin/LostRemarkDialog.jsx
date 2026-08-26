import { useEffect, useState } from "react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function LostRemarkDialog({
  open,
  onOpenChange,
  onSubmit,
  loading = false,
  orderCount = 1,
}) {
  const [remark, setRemark] = useState("");

  // Popup close hone par remark reset
  useEffect(() => {
    if (!open) {
      setRemark("");
    }
  }, [open]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanRemark = remark.trim();

    if (!cleanRemark) {
      return;
    }

    await onSubmit(cleanRemark);
  };

  const handleOpenChange = (value) => {
    if (loading) return;

    onOpenChange(value);

    if (!value) {
      setRemark("");
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={handleOpenChange}
    >
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              Mark Order as Lost?
            </DialogTitle>

            <DialogDescription>
              {orderCount > 1
                ? `You are about to mark ${orderCount} orders as Lost. Please enter a remark.`
                : "You are about to mark this order as Lost. Please enter a remark."}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-5">
            <Label htmlFor="lost-remark">
              Remark
              <span className="ml-1 text-red-500">
                *
              </span>
            </Label>

            <textarea
              id="lost-remark"
              value={remark}
              onChange={(e) =>
                setRemark(e.target.value)
              }
              placeholder="Enter reason for marking order as lost"
              disabled={loading}
              rows={4}
              maxLength={500}
              className="
                mt-2
                w-full
                resize-none
                rounded-lg
                border
                border-gray-300
                bg-white
                px-3
                py-2
                text-sm
                text-gray-900
                outline-none
                transition
                placeholder:text-gray-400
                focus:border-[#0446DB]
                focus:ring-2
                focus:ring-[#0446DB]/10
                disabled:cursor-not-allowed
                disabled:bg-gray-100
              "
            />

            <div className="mt-1 text-right text-xs text-gray-400">
              {remark.length}/500
            </div>
          </div>

          <DialogFooter className="mt-6">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                disabled={loading}
              >
                Cancel
              </Button>
            </DialogClose>

            <Button
              type="submit"
              variant="destructive"
              disabled={
                loading ||
                !remark.trim()
              }
            >
              {loading
                ? "Updating..."
                : orderCount > 1
                  ? "Mark Orders as Lost"
                  : "Mark as Lost"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}