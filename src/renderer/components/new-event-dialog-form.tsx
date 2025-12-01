import React, { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "~/components/ui/input"
import { Toast } from "~/components/Toast"
import { Button } from "~/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { Textarea } from "~/components/ui/textarea"
import { NotebookPen } from "lucide-react"
import { z } from "zod"
import { MEvent } from "@/db/sqlite/main/schema";
import { useEvents } from "~/hooks/use_events";
import { ScrollArea } from "~/components/ui/scroll-area";
import { DisciplineType, natures } from "@/shared/constants/constants";
import { metrics } from "@/shared/settings"
import { useSessionSettings } from "../pages/sessions/performance_session/components/hooks/use_settings"

// Define the schema for the Event form
const NewEventSchema = z.object({
    title: z.string().min(1, { message: "Title is required" }),
    description: z.string().optional(),
    eventType: z.enum(["team", "individual"]),
    type: z.enum([...DisciplineType] as [string]),
    ageGroup: z.string(),
    gender: z.enum(["male", "female", "mixed"]),
    measurementMetric: z.string().optional(),
    measurementNature: z.enum(natures),
})

type NewEventSchemaType = z.infer<typeof NewEventSchema>

export default function NewEventDialogForm({
    event,
    purpose = "create",
}: Readonly<{
    purpose?: "create" | "edit"
    event?: MEvent // Replace with your Event type
}>) {
    const [isOpen, setIsOpen] = useState(false)
    const { createEvent, listAllEvents, updateEvent } = useEvents();
    const { settings } = useSessionSettings();

    const defaultValues: NewEventSchemaType = {
        title: event?.title || "",
        description: event?.description || "",
        eventType: event?.eventType || "individual",
        type: event?.type || "athletics",
        ageGroup: event?.ageGroup || undefined,
        gender: event?.gender || "mixed",
        measurementMetric: event?.measurementMetric || "",
        measurementNature: event?.measurementNature || "time",
    }

    const form = useForm({
        defaultValues,
        resolver: zodResolver(NewEventSchema),
    })

    async function onSubmit(data: NewEventSchemaType) {
        try {
            const validated = NewEventSchema.safeParse(data);

            if (purpose === "edit") {
                if (validated.error) {
                    throw new Error(validated.error.message);
                }
                const res = await updateEvent(event?.id, validated.data as MEvent);
                if (res) {
                    await listAllEvents();
                    form.reset();
                    setIsOpen(false);
                }
            } else {
                if (validated.error) {
                    throw new Error(validated.error.message);
                }
                const res = await createEvent({
                    title: validated.data.title,
                    type: validated.data.type as any,
                    eventType: validated.data.eventType,
                    description: validated.data.description,
                    ageGroup: validated.data.ageGroup,
                    gender: validated.data.gender,
                    measurementMetric: validated.data.measurementMetric,
                    measurementNature: validated.data.measurementNature,
                });
                if (res) {
                    await listAllEvents();
                    form.reset();
                    setIsOpen(false);
                }
            }

            form.reset()
            setIsOpen(false)
            Toast({ message: `Event ${purpose === "create" ? "created" : "updated"} successfully`, variation: "success" })
        } catch (error) {
            console.error(error)
            Toast({ message: error.message, variation: "error" })
        }
    }

    return (
        <Dialog
            open={isOpen}
            onOpenChange={(v) => {
                if (!v) {
                    form.reset()
                }
                setIsOpen(v)
            }}
        >
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    size={purpose === "edit" ? "icon" : "default"}
                    className={`${purpose === "edit" ? "w-6 h-6" : ""}`}
                >
                    {purpose === "create" ? <span>New Event</span> : <NotebookPen className="h-4 w-4" />}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]"><ScrollArea className={"h-full max-h-[90dvh] px-3"}>
                <DialogHeader>
                    <DialogTitle>{purpose === "create" ? "Create New" : "Edit"} Event</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="Event Title" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea {...field} placeholder="Event Description" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Discipline Type</FormLabel>
                                    <FormControl>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a Discipline Type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {DisciplineType.map((discipline) => (
                                                    <SelectItem className="capitalize" key={discipline} value={discipline}>
                                                        {discipline}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="eventType"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Type</FormLabel>
                                    <FormControl>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select event type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="individual">Individual</SelectItem>
                                                <SelectItem value="team">Team</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="ageGroup"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Age Group</FormLabel>
                                    <FormControl>
                                        <>
                                            <Select name={field.name} onValueChange={field.onChange} value={field.value}>
                                                <SelectTrigger className={"capitalize"}>
                                                    <SelectValue placeholder="Select age group" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {
                                                        Object.keys(settings.ageGroups).map((item, index) => {
                                                            return (
                                                                <SelectItem className={"capitalize"} value={item} key={item}>{item}</SelectItem>
                                                            )
                                                        })
                                                    }
                                                </SelectContent>
                                            </Select>
                                        </>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="gender"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Gender</FormLabel>
                                    <FormControl>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select gender" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="male">Male</SelectItem>
                                                <SelectItem value="female">Female</SelectItem>
                                                <SelectItem value="mixed">Mixed</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="measurementNature"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nature of measurement</FormLabel>
                                    <FormControl>
                                        <Select name={field.name} onValueChange={field.onChange} value={field.value}>
                                            <SelectTrigger className={"capitalize"}>
                                                <SelectValue placeholder="Select nature" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {
                                                    natures.map((item, index) => {
                                                        return (
                                                            <SelectItem className={"capitalize"} value={item} key={item}>{item}</SelectItem>
                                                        )
                                                    })
                                                }
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="measurementMetric"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Measurement Metric</FormLabel>
                                    <FormControl>
                                        <Select disabled={form.getValues("measurementNature").length<=0} name={field.name} onValueChange={field.onChange} value={field.value}>
                                            <SelectTrigger className={"capitalize"}>
                                                <SelectValue placeholder="Select metric" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {
                                                    Object.keys(metrics[form.getValues("measurementNature")]).map((item, index) => {
                                                        return (
                                                            <SelectItem className={"capitalize"} value={item} key={item}>{item}</SelectItem>
                                                        )
                                                    })
                                                }
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" className="capitalize">
                            {purpose}
                        </Button>
                    </form>
                </Form></ScrollArea>
            </DialogContent>

        </Dialog>
    )
}
