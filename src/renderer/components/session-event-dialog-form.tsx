import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "~/components/ui/input";
import { Toast } from "~/components/Toast";
import { Button } from "~/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Textarea } from "~/components/ui/textarea";
import { NotebookPen } from "lucide-react";
import { z } from "zod";
import { PSEvent } from "@/db/sqlite/p_sports/schema";
import { ScrollArea } from "~/components/ui/scroll-area";
import { useSettings } from "~/hooks/use_settings";
import { natures } from "@/shared/constants/constants";
import { metrics } from "@/shared/settings";
import { useSessionSettings } from "../pages/sessions/performance_session/components/hooks/use_settings";

// Define the schema for the Session Event form
const SessionEventSchema = z.object({
  eventNumber: z.number().optional(),
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().optional(),
  eventType: z.enum(["team", "individual"]),
  ageGroup: z.string().optional(),
  gender: z.enum(["male", "female", "mixed"]),
  recordHolder: z.string().optional().nullable(),
  measurementMetric: z.string(),
  record: z.string().optional().nullable(),
  status: z.enum(["pending", "complete"]).optional(),
  isRecordBroken: z.boolean().optional(),
  measurementNature: z.enum(natures),
});

type SessionEventSchemaType = z.infer<typeof SessionEventSchema>;

export default function SessionEventDialogForm({
  event,
  purpose = "create",
  onCreate,
  onUpdate,
  trigger,
  eventNumber,
}: Readonly<{
  purpose?: "create" | "edit";
  event?: PSEvent;
  onCreate?: (data: SessionEventSchemaType) => Promise<void>;
  onUpdate?: (
    id: string,
    data: Partial<SessionEventSchemaType>
  ) => Promise<void>;
  trigger?: React.ReactElement;
  eventNumber?: number;
}>) {
  const [isOpen, setIsOpen] = useState(false);
  const { settings } = useSessionSettings();
  const [loading, setLoading] = useState<{ kind: string; state: boolean }>({
    kind: "",
    state: false,
  });
  const [dotCount, setDotCount] = useState(0);

  const defaultValues: SessionEventSchemaType = {
    eventNumber: 1,
    title: "",
    description: "",
    eventType: "individual",
    ageGroup: "",
    gender: "mixed",
    recordHolder: "",
    measurementMetric: "",
    record: "",
    status: "pending",
    isRecordBroken: false,
    measurementNature: "time",
  };

  const form = useForm({
    defaultValues,
    resolver: zodResolver(SessionEventSchema),
  });

  async function onSubmit(data: SessionEventSchemaType) {
    setLoading({
      kind: (purpose === "create" ? "Creating " : "Updating ") + "Event",
      state: true,
    });
    try {
      const validated = SessionEventSchema.safeParse(data);
      if (validated.error) {
        throw new Error(validated.error.message);
      }

      if (purpose === "edit") {
        await onUpdate(event?.id, data);
      } else {
        await onCreate(data);
      }

      form.reset();
      setIsOpen(false);
      Toast({
        message: `Session Event ${
          purpose === "create" ? "created" : "updated"
        } successfully`,
        variation: "success",
      });
    } catch (error) {
      console.error(error);
      Toast({ message: error.message, variation: "error" });
    } finally {
      setLoading({
        kind: "",
        state: false,
      });
    }
  }

  useEffect(() => {
    if (event) {
      form.reset({
        eventNumber: event?.eventNumber ?? 0,
        title: event?.title ?? "",
        description: event?.description ?? "",
        eventType: event?.eventType ?? "team",
        ageGroup: event?.ageGroup ?? "",
        gender: event?.gender ?? "male",
        recordHolder: event?.recordHolder || "",
        measurementMetric: event?.measurementMetric ?? "",
        record: event?.record ?? "",
        status: event?.status ?? "pending",
        isRecordBroken: event?.isRecordBroken ?? false,
        measurementNature: event?.measurementNature ?? "time",
      });
    }
  }, [event]);
  useEffect(() => {
    if (eventNumber) {
      form.setValue("eventNumber", eventNumber);
    }
  });
  useEffect(() => {
    if (loading.state) {
      const interval = setInterval(() => {
        setDotCount((prev) => (prev + 1) % 4);
      }, 500);
      return () => clearInterval(interval);
    } else {
      setDotCount(0);
    }
  }, [loading.state]);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(v) => {
        if (!v) {
          form.reset();
        }
        setIsOpen(v);
      }}>
      <DialogTrigger asChild>
        {trigger ? (
          trigger
        ) : (
          <Button
            variant="outline"
            size={purpose === "edit" ? "icon" : "default"}
            className={`${purpose === "edit" ? "w-6 h-6" : ""} w-max`}>
            {purpose === "create" ? (
              <span>New Session Event</span>
            ) : (
              <NotebookPen className="h-4 w-4" />
            )}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <ScrollArea className={"max-h-[90dvh] px-3"}>
          {" "}
          <DialogHeader>
            <DialogTitle>
              {purpose === "create" ? "Create New" : "Edit"} Session Event
            </DialogTitle>
          </DialogHeader>
          {loading.state ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-lg">
                {loading.kind}
                {".".repeat(dotCount)}{" "}
              </p>
            </div>
          ) : (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4">
                <FormField
                  control={form.control}
                  name="eventNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Event Number</FormLabel>
                      <FormControl>
                        <Input
                          min={eventNumber}
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value
                                ? Number.parseInt(e.target.value)
                                : 0
                            )
                          }
                          placeholder="Event Number"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
                  name="eventType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select event type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="individual">
                              Individual
                            </SelectItem>
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
                        <Select
                          name={field.name}
                          onValueChange={field.onChange}
                          value={field.value}>
                          <SelectTrigger className={"capitalize"}>
                            <SelectValue placeholder="Select age group" />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.keys(settings.ageGroups).map(
                              (item, index) => {
                                return (
                                  <SelectItem
                                    className={"capitalize"}
                                    value={item}
                                    key={item}>
                                    {item}
                                  </SelectItem>
                                );
                              }
                            )}
                          </SelectContent>
                        </Select>
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
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}>
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
                        <Select
                          name={field.name}
                          onValueChange={field.onChange}
                          value={field.value}>
                          <SelectTrigger className={"capitalize"}>
                            <SelectValue placeholder="Select Nature" />
                          </SelectTrigger>
                          <SelectContent>
                            {natures.map((item, index) => {
                              return (
                                <SelectItem
                                  className={"capitalize"}
                                  value={item}
                                  key={item}>
                                  {item}
                                </SelectItem>
                              );
                            })}
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
                        <Select
                          name={field.name}
                          onValueChange={field.onChange}
                          value={field.value}>
                          <SelectTrigger className={"capitalize"}>
                            <SelectValue placeholder="Select metric" />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.keys(
                              metrics[form.getValues("measurementNature")]
                            ).map((item, index) => {
                              return (
                                <SelectItem
                                  className={"capitalize"}
                                  value={item}
                                  key={item}>
                                  {item}
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="record"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Record</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Current Record" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="recordHolder"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Record Holder</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Record Holder Name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="complete">Complete</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="capitalize">
                  {purpose === "create" ? "Create " : "Update "} Event
                </Button>
              </form>
            </Form>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
