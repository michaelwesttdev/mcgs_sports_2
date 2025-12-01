import { Check, ChevronsUpDown, PlusCircle } from "lucide-react";
import { useState } from "react";
import { z, ZodTypeAny } from "zod";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "~/components/ui/popover";
import {
    Command,
    CommandInput,
    CommandList,
    CommandGroup,
    CommandItem,
    CommandEmpty,
} from "~/components/ui/command";
import { FieldOverride, ZodFormDialog } from "~/components/zod-form-dialog"; // your dynamic form component

interface SearchableSelectWithDialogProps<TOption extends { id: string; name: string }> {
    value: string;
    onChange: (value: string) => void;
    options: TOption[];
    schema: ZodTypeAny;
    label?: string;
    description?: string;
    dialogTitle?: string;
    onAddOption: (data: any) => Promise<void>;
    placeholder?: string;
    override?: Record<string, FieldOverride>
}

export function SearchableSelectWithDialog<TOption extends { id: string; name: string }>({
    value,
    onChange,
    options,
    schema,
    onAddOption,
    label = "Add New",
    description = "Add a new item.",
    dialogTitle = "Create New",
    placeholder = "Select an option",
    override
}: SearchableSelectWithDialogProps<TOption>) {
    const [open, setOpen] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [search, setSearch] = useState("");

    const filtered = options.filter((opt) =>
        opt.name.toLowerCase().includes(search.toLowerCase())
    );

    const selectedName = options.find((opt) => opt.id === value)?.name ?? placeholder;

    const handleAdd = async (data: any) => {
        const newItem = await onAddOption(data);
        setDialogOpen(false);
    };

    return (
        <div className="relative">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button type={"button"} variant="outline" role="combobox" className="w-full justify-between">
                        {selectedName}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                    <Command>
                        <CommandInput placeholder="Search..." value={search} onValueChange={setSearch} />
                        <CommandList>
                            <CommandEmpty>
                                <div className="px-4 py-2 text-sm text-muted-foreground">No results.</div>
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start px-4 py-2 text-sm"
                                    onClick={() => {
                                        setDialogOpen(true);
                                        setOpen(false);
                                    }}
                                >
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    {label}
                                </Button>
                            </CommandEmpty>
                            <CommandGroup>
                                {filtered.map((opt) => (
                                    <CommandItem
                                        key={opt.id}
                                        value={opt.id}
                                        onSelect={() => {
                                            onChange(opt.id);
                                            setOpen(false);
                                        }}
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                value === opt.id ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                        {opt.name}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                            <CommandGroup>
                                <CommandItem
                                    onSelect={() => {
                                        setDialogOpen(true);
                                        setOpen(false);
                                    }}
                                >
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    {label}
                                </CommandItem>
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>

            <ZodFormDialog overrides={override}
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                title={dialogTitle}
                description={description}
                schema={schema}
                onSubmit={handleAdd}

            />
        </div>
    );
}
