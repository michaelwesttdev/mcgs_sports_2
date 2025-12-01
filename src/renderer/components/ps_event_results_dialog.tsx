import { useEffect, useRef, useState } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z, ZodSchema } from "zod"
import { PlusCircle, Trash2, Grid2X2Check, UserRoundX } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form"
import { Input } from "~/components/ui/input"
import { Button } from "~/components/ui/button"
import { nanoid } from "nanoid";
import { Toast } from "~/components/Toast";
import { cn } from "~/lib/utils";
import SeachableSelectWithCreationLogic from "~/components/seachableSelectWithCreationLogic";
import { ScrollArea } from "~/components/ui/scroll-area";
import { PSEvent, PSEventResult, PSHouse, PSParticipant } from "@/db/sqlite/p_sports/schema";
import { getAge } from "@/shared/helpers/dates";
import { useSettings } from "~/hooks/use_settings";
import {
  assignPointsPreservingOrder,
  checkIfRecordHasBeenBroken
} from "@/shared/helpers/ps_helpers";
import { metrics, PSessionSettings } from "@/shared/settings";
import { Checkbox , TimePicker } from "antd";

import dayjs from "dayjs";
import { TimeOtpInput } from "./TimePicker"
import { useSessionSettings } from "../pages/sessions/performance_session/components/hooks/use_settings"

const EventResultSchema = z.object({
  bestScore: z
    .string()
    .min(1, "Best score is required"),
  results: z.array(
    z.object({
      id: z.string(),
      participantId: z.string().min(1, "Participant is required"),
      position: z.coerce.number().int().min(0, "Position must be 0 (disqualified) or a positive number"),
    }),
  ),
});
type EventResultFormValues = z.infer<typeof EventResultSchema>
interface EventResultsDialogProps {
  eventId: string
  eventTitle: string
  event: PSEvent,
  participants: PSParticipant[],
  houses: PSHouse[],
  results: PSEventResult[],
  canOpen?: boolean,
  createResult: (result: Omit<PSEventResult, "createdAt" | "updatedAt" | "deletedAt">) => Promise<void>,
  updateResult: (resultId: string, result: Partial<PSEventResult>) => Promise<void>,
  deleteResult: (resultId: string) => Promise<void>,
  updateEvent: (eventId: string, data: Partial<PSEvent>) => Promise<void>,
  toggleButton?: React.ReactElement,
  onDone: (event?:PSEvent) => void
}

export default function PsEventResultsDialog({ deleteResult, onDone, updateEvent, canOpen = true, toggleButton, results, createResult, updateResult, eventId, participants, houses, eventTitle, event }: EventResultsDialogProps) {
  const [open, setOpen] = useState(false)
  const { settings } = useSessionSettings();
  const [outOfBoundsAllowance, setOutOfBoundsAllowance] = useState(false);
  const [loading, setLoading] = useState<{ kind: string, state: boolean }>({
    kind: "",
    state: false
  });
  const [dotCount, setDotCount] = useState(0);

  const handleDecimalInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.currentTarget.value;

    // Allow empty string or dash (for typing negative numbers)
    if (input === "" || input === "-") {
      form.setValue("bestScore", input);
      return;
    }

    const step = e.currentTarget.step;
    const isDecimal = step.includes(".");

    if (isDecimal && input.includes(".")) {
      const [intPart, decimalPart] = input.split(".");
      const trimmed = `${intPart}.${decimalPart.slice(0, 2)}`;
      form.setValue("bestScore", trimmed);
    } else {
      // Must handle the case where the input has no decimal point
      form.setValue("bestScore", input);
    }
  };



  // Initialize form with default values
  const form = useForm<EventResultFormValues>({
    resolver: zodResolver(EventResultSchema),
    defaultValues: {
      bestScore: "",
      results: [
        {
          id: nanoid(),
          participantId: "",
          position: 1,
        },
      ],
    },
  })

  // Setup field array for dynamic results
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "results",
  })

  // Add a new result entry
  const addResult = () => {
    append({
      id: nanoid(),
      participantId: "",
      position: fields.length + 1,
    })
  }

  // Disqualify a participant
  const disqualifyParticipant = (index: number) => {
    form.setValue(`results.${index}.position`, 0)
  }

  // Submit handler
  const onSubmit = async (data: EventResultFormValues) => {
    setLoading({
      kind: "Saving Results",
      state: true
    })
    try {
      const submission = assignPointsPreservingOrder(data.results.map((r: {
        id: string,
        participantId: string,
        position: number
      }) => {
        return {
          id: r.id,
          participantId: r.participantId,
          position: r.position,
        }
      }), event.eventType, settings, eventId)
      const isSameEntry = (
        a: Omit<PSEventResult, "createdAt" | "updatedAt" | "deletedAt">,
        b: Omit<PSEventResult, "createdAt" | "updatedAt" | "deletedAt">
      ) => a.id === b.id

      // Separate existing and new
      const alreadyInDB = submission.filter(sub =>
        results.some(existing => isSameEntry(sub, existing))
      );

      const newEntries = submission.filter(sub =>
        !results.some(existing => isSameEntry(sub, existing))
      );

      if (alreadyInDB.length > 0) {
        Promise.all(alreadyInDB.map(async (result) => {
          await updateResult(result.id, result)
        })).catch(e => {
          console.log(e);
          throw e;
        })
      }
      if (newEntries.length > 0) {
        Promise.all(newEntries.map(async (result) => {
          await createResult(result)
        })).catch(e => {
          console.log(e);
          throw e;
        })
      }
      const recordStatus = checkIfRecordHasBeenBroken(data.bestScore, [...alreadyInDB, ...newEntries], event.measurementNature, event, participants, houses)
      const recordData = recordStatus.isBroken ?
        {
          record: recordStatus.newRecord,
          recordHolder: recordStatus.recordHolder,
          isRecordBroken: recordStatus.isBroken
        } : {};
      await updateEvent(event.id, {
        bestScore: data.bestScore,
        status: [...alreadyInDB, ...newEntries].length > 0 ? "complete" : "pending",
        ...recordData
      })
      Toast({
        variation: "success",
        message: "Event results have been saved successfully.",
      })

      setOpen(false)
      form.reset({
        bestScore: "",
        results: [
          {
            id: nanoid(),
            participantId: "",
            position: 1,
          },
        ],
      });

      onDone(event);
    } catch (error) {
      console.error("Error saving event results:", error)
      Toast({
        variation: "error",
        message: "Failed to save event results. Please try again.",
      })
    } finally {
      setLoading({
        kind: "",
        state: false
      })
    }
  }

  useEffect(() => {
    if (open && results.length > 0) {
      const resultsHaveOutOfBounds = results.map(res => {
        const p = participants.find(p => p.id === res.participantId);
        if (p) {
          const ageGroup = settings.ageGroups[event.ageGroup];
          const age = getAge(p.dob);
          if (typeof ageGroup === "number") {
            return !(age >= ageGroup)
          }
          else if (Array.isArray(ageGroup)) {
            return !(age >= ageGroup[0] && age <= ageGroup[1])
          }
        }
      });
      setOutOfBoundsAllowance(resultsHaveOutOfBounds.includes(true))
      form.reset({
        bestScore: event.bestScore ?? "",
        results: results.map(result => ({
          id: result.id,
          participantId: result.participantId,
          position: result.position,
        })),
      });
    }
  }, [open, results]);
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
    <Dialog open={open} onOpenChange={(v) => {
      if (!canOpen) {
        setOpen(false)
      }
      if (!v) {
         form.reset({
        bestScore: "",
        results: [
          {
            id: nanoid(),
            participantId: "",
            position: 1,
          },
        ],
      });
      }
      setOpen(v)
    }}>
      <DialogTrigger asChild>
        {
          toggleButton || <Button variant="outline" size="icon" className={`w-6 h-6`} >
            <Grid2X2Check className="h-4 w-4" />
          </Button>
        }

      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] px-0 pt-4">
        <ScrollArea className={"max-h-[90dvh] px-3"}>
          <DialogHeader>
            <DialogTitle>Enter Results for Event number {event.eventNumber} {"-->"} {eventTitle}</DialogTitle>
            <DialogDescription>
              Add the results for this event. Click the plus button to add more entries.
            </DialogDescription>
          </DialogHeader>
          {
            loading.state ? (
              <div className='flex items-center justify-center h-full'>
                <p className='text-lg'>{loading.kind}{'.'.repeat(dotCount)} </p>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex flex-col">
                      <div className="flex items-center justify-between my-4 gap-3">
                        <h3 className="text-lg font-medium underline">Results</h3>
                        <div className="flex items-center gap-2">
                          <span>Allow out of bounds age groups</span>
                          <Checkbox checked={outOfBoundsAllowance} onChange={(e) => setOutOfBoundsAllowance(e.target.checked)} />
                        </div>
                      </div>
                      <FormField
                        control={form.control}
                        name={`bestScore`}
                        render={({ field }) => {
                          let inputType = "text";
                          let step = undefined;
                          let placeholder = "Enter value";
                          let label = "Best Score";
                          let isTime = false;
                          let timeFormat = "mm:ss.SSS";
                          if (event.measurementNature === "height" || event.measurementNature === "length") {
                            inputType = "number";
                            step = "0.01";
                            placeholder = "e.g, 5.25";
                            label = "Best Distance/height";
                          } else if (
                            event.measurementNature === "time"
                          ) {
                            isTime = true;
                            if (event.measurementMetric === "hours") {
                              timeFormat = "HH:MM:ss";
                              placeholder = "e.g, 01:23:45 (hh:mm:ss)";
                            } else if (event.measurementMetric === "minutes") {
                              timeFormat = "MM:ss";
                              placeholder = "e.g, 12:34 (MM:ss)";
                            } else if (event.measurementMetric === "seconds") {
                              timeFormat = "ss.SS";
                              placeholder = "e.g, 59.99 (ss.SSS)";
                            } else {
                              timeFormat = "DD:HH:MM:ss.SSS";
                              placeholder = "e.g, 03:09.08 (MM:ss.SSS)";
                            }
                            label = "Best Time";
                          } else if (event.measurementNature === "score") {
                            inputType = "number";
                            step = "1";
                            placeholder = "e.g, 100 (points)";
                            label = "Best Score";
                          }
                          return (
                            <FormItem className={"flex flex-1 items-center gap-2"}>
                              <FormLabel className={"flex flex-col text-[14px] w-full"}>{label}
                                <span className={"text-xs text-muted-foreground"}>{isTime ? `Format: ${timeFormat}` : "NB: use only numbers"}</span>
                              </FormLabel>
                              <FormControl>
                                {isTime ? (
                                  <TimeOtpInput
                                    onChange={field.onChange}
                                    value={field.value}
                                    format={event.measurementMetric === "days" ? "DD:HH:mm:ss.SS" : event.measurementMetric === "hours" ? "HH:mm:ss.SS" : event.measurementMetric === "minutes" ? "mm:ss.SS" : "ss.SS"}
                                  />
                                ) : (
                                  <Input
                                    type={inputType}
                                    step={step}
                                    {...field}
                                    onChange={handleDecimalInputChange}
                                    placeholder={placeholder}
                                    className={cn("w-full")}
                                  />
                                )}
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          );
                        }}
                      />
                    </div>

                    {fields.map((field, index) => (
                      <div key={field.id} className="rounded-lg border p-2 space-y-4">
                        <div className="flex items-center gap-4 w-full">
                          {(index > 0 || field.participantId) && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={async () => {
                                const resultInDb = results.find(r => r.participantId === field.participantId && r.eventId === eventId);
                                if (resultInDb) {
                                  await deleteResult(resultInDb.id);
                                }
                                remove(index)
                              }}
                              className="h-8 w-8 p-0"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Remove</span>
                            </Button>
                          )}
                          <span className={"text-red-600 text-xs tracking-wider"}>{form.watch(`results.${index}.position`) === 0
                            ? "Disqualified" : <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              onClick={() => disqualifyParticipant(index)}
                              className="flex items-center gap-1 w-6 h-6 text-xs"
                            >
                              <UserRoundX className="h-3 w-3" />
                            </Button>}</span>
                        </div>
                        {/*form fields*/}
                        <div className="flex items-center gap-2 w-full">
                          <FormField
                            control={form.control}
                            name={`results.${index}.position`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className={"grid text-[14px]"}>Position
                                  <span className={"text-xs text-muted-foreground"}>NB: 0 means DQ</span>
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    min="0"
                                    {...field}
                                    className={
                                      cn("max-w-[60px]", form.watch(`results.${index}.position`) === 0 ? "bg-red-50 dark:bg-red-950/20" : "")
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`results.${index}.participantId`}
                            render={({ field }) => (
                              <FormItem className={"flex-1"}>
                                <FormLabel className={"grid text-[14px]"}>{event.eventType === "individual" ? "Participant" : "House"}
                                  <span className={"text-xs text-muted-foreground"}>Participant for Position</span>
                                </FormLabel>
                                <SeachableSelectWithCreationLogic canCreate={false} options={event?.eventType === "individual"
                                  ? participants
                                    .filter((p) => {
                                      const ageGroup = settings.ageGroups[event.ageGroup];
                                      const age = getAge(p.dob);
                                      const genderAllowed = event?.gender === "mixed" || p.gender === event?.gender;

                                      if (!genderAllowed) {
                                        return false;
                                      }

                                      if (typeof ageGroup === "number") {
                                        return outOfBoundsAllowance ? true : age >= ageGroup;
                                      }

                                      if (Array.isArray(ageGroup)) {
                                        if (outOfBoundsAllowance) {
                                          return age <= ageGroup[1];
                                        } else {
                                          return age >= ageGroup[0] && age <= ageGroup[1];
                                        }
                                      }

                                      return false;
                                    })
                                    .map((participant) =>{
                                      const totalEventsParticipated = results.filter(res=>res.participantId===participant.id).length;
                                      return {
                                      label: `${participant?.firstName ?? ""} ${participant?.lastName ?? ""}`,
                                      value: participant?.id ?? "",
                                      disabled:totalEventsParticipated>=settings.rules.maxEventsPerPerson
                                    }
                                    })
                                  : houses.map((house) => (
                                    {
                                      label: `${house.name}`,
                                      value: house.id
                                    }
                                  ))} onChange={field.onChange} value={field.value} placeholder={`Select ${event.eventType === "individual" ? "participant" : "house"}`} />
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    ))}

                  </div>

                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addResult}
                      className="flex items-center gap-1"
                    >
                      <PlusCircle className="h-4 w-4" />
                      Add Result
                    </Button>
                    <Button type="submit">Save Results</Button>
                  </DialogFooter>
                </form>
              </Form>)}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
