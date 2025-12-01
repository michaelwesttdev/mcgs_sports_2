import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Input } from "./ui/input";
import { Command, CommandInput, CommandItem, CommandList } from "./ui/command";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { DefaultValues, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z, ZodObject, ZodSchema } from "zod";
import { Button } from "./ui/button";
import { ChevronsUpDown } from "lucide-react";
import { cn } from "../lib/utils";

type CreateConfigProps = {
  schema: ZodSchema;
  formDefaults: DefaultValues<any>;
  onCreate: <T>(data: T) => void;
  formTitle?: string;
};

type Props = {
  canCreate: boolean;
  options: { value: string; label: string,disabled?:boolean }[];
  onChange: (value: string) => void;
  value: string;
  placeholder?: string;
  searchPlaceholder?: string;
  createConfig?: CreateConfigProps;
};

export default function SeachableSelectWithCreationLogic({
  canCreate,
  options,
  onChange,
  value,
  placeholder = "Select an option",
  searchPlaceholder = "Search...",
  createConfig,
}: Readonly<Props>) {
  const [open, setOpen] = useState(false);
  return (
    <Popover
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
      }}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          type='button'
          aria-expanded={false}
          className={cn(
            "w-full justify-between",
            !value && "text-muted-foreground"
          )}
          disabled={false}>
          {value ? options.find(op=>op.value===value)?.label : placeholder}
          <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent side="left">
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            {options?.map((option) => (
              <CommandItem
              disabled={option.disabled}
                key={option?.value}
                onSelect={() => {
                  onChange(option?.value);
                  setOpen(false);
                }}>
                {option?.label}
              </CommandItem>
            ))}
            {/*  {canCreate && (
              <CommandItem
                onSelect={() => {
                  onCreate(value);
                  setOpen(false);
                }}>
                Create {value}
              </CommandItem>
            )} */}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
