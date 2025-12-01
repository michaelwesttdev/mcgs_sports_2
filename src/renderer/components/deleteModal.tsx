"use client";

import type React from "react";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";

interface DeleteModalProps {
  title?: string;
  description?: string;
  itemName?: string;
  onDelete: () => void;
  trigger?: React.ReactNode;
}

export function DeleteModal({
  title = "Delete Item",
  description = "Are you sure you want to delete this item? This action cannot be undone.",
  itemName,
  onDelete,
  trigger,
}: DeleteModalProps) {
  const [open, setOpen] = useState(false);

  const handleDelete = () => {
    onDelete();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant='destructive' size='sm'>
            <Trash2 className='h-4 w-4 mr-2' />
            Delete
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {itemName
              ? `Are you sure you want to delete "${itemName}"? This action cannot be undone.`
              : description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className='gap-2 sm:gap-0'>
          <Button variant='outline' onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant='destructive' onClick={handleDelete}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
