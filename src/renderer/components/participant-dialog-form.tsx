import React, { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "~/components/ui/input"
import { Toast } from "~/components/Toast"
import { Button } from "~/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { NotebookPen } from "lucide-react"
import { z } from "zod"
import { PSHouse, PSParticipant } from "@/db/sqlite/p_sports/schema";
import { ScrollArea } from "~/components/ui/scroll-area";
import { SearchableSelectWithDialog } from "~/components/creatable_select";
import { HouseSchema } from "~/components/house-dialog-form";
import { nanoid } from "nanoid";

// Define the schema for the Participant form
const ParticipantSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  dob: z.string().min(1, { message: "Date of birth is required" }),
  gender: z.enum(["male", "female"]),
  houseId: z.string().optional(),
})

type ParticipantSchemaType = z.infer<typeof ParticipantSchema>

export default function ParticipantDialogForm({
  participant,
  purpose = "create",
  onCreate,
  onUpdate,
  houses,
  fetchHouses,
  createHouse,
}: Readonly<{
  purpose?: "create" | "edit";
  participant?: PSParticipant;
  onCreate?: (participant: Omit<PSParticipant, "id" | "createdAt" | "updatedAt" | "deletedAt">) => Promise<void>;
  onUpdate?: (id: string, participant: Partial<PSParticipant>) => Promise<void>;
  houses: PSHouse[];
  fetchHouses: () => Promise<void>;
  createHouse: (house: Omit<PSHouse, "id" | "createdAt" | "updatedAt" | "deletedAt">) => Promise<void>;
}>) {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState<{ kind: string, state: boolean }>({
    kind: "",
    state: false
  });
  const [dotCount, setDotCount] = useState(0);

  // Fetch houses when dialog opens
  React.useEffect(() => {
    if (isOpen) {
      fetchHouses().catch((e: Error) => {
        console.log(e)
        Toast({ message: "Something went Wrong", variation: "error" })
      })
    }
  }, [isOpen])

  const defaultValues: ParticipantSchemaType = {
    firstName: participant?.firstName || "",
    lastName: participant?.lastName || "",
    dob: participant?.dob || "",
    gender: participant?.gender || "male",
    houseId: participant?.houseId || "",
  }

  const form = useForm({
    defaultValues,
    resolver: zodResolver(ParticipantSchema),
  })

  async function onSubmit(data: ParticipantSchemaType) {
    setLoading({
      kind:(purpose==="create"?"Creating ":"Updating ")+"Participant",
      state:true
    })
    try {
      const validated = ParticipantSchema.safeParse(data);
      if (validated.error) {
        throw new Error(validated.error.message);
      }

      if (purpose === "edit") {
        await onUpdate(participant?.id, validated.data)
      } else {
        await onCreate({
          firstName: validated.data.firstName,
          lastName: validated.data.lastName,
          dob: validated.data.dob,
          gender: validated.data.gender,
          houseId: validated.data.houseId,
        })
      }

      form.reset()
      setIsOpen(false)
      Toast({
        message: `Participant ${purpose === "create" ? "created" : "updated"} successfully`,
        variation: "success",
      })
    } catch (error) {
      console.error(error)
      Toast({ message: error.message, variation: "error" })
    }finally{
      setLoading({
        kind:"",
        state:false
      })
    }
  }
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
          {purpose === "create" ? <span>New Participant</span> : <NotebookPen className="h-4 w-4" />}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <ScrollArea className={"max-h-[90dvh] px-3"}><DialogHeader>
          <DialogTitle>{purpose === "create" ? "Create New" : "Edit"} Participant</DialogTitle>
        </DialogHeader>
          {
            loading.state ? (
              <div className='flex items-center justify-center h-full'>
                <p className='text-lg'>{loading.kind}{'.'.repeat(dotCount)} </p>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="First Name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Last Name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="dob"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date of Birth</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} placeholder="Date of Birth" />
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
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="houseId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>House</FormLabel>
                        <FormControl>
                          <SearchableSelectWithDialog value={field.value} onChange={field.onChange} options={houses.map((house) => (
                            {
                              id: house.id,
                              name: house.name
                            }
                          ))} schema={HouseSchema} onAddOption={async (data) => {
                            try {
                              const newHouse: Omit<PSHouse, "createdAt" | "updatedAt" | "deletedAt"> = {
                                id: nanoid(),
                                name: data.name,
                                abbreviation: data.abbreviation,
                                color: data.color,

                              }
                              await createHouse(newHouse);
                              field.onChange(newHouse.id);
                            } catch (e) {
                              console.log(e);
                              Toast({ message: "Something went wrong", variation: "error" })
                            }
                          }} override={{
                            "color": {
                              type: "color"
                            }
                          }} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="capitalize">
                    {purpose}
                  </Button>
                </form>
              </Form>
            )
          }
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
