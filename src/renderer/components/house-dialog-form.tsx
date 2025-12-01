import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "~/components/ui/input"
import { Toast } from "~/components/Toast"
import { Button } from "~/components/ui/button"
import { NotebookPen } from "lucide-react"
import { z } from "zod"
import {PSHouse, PSParticipant} from "@/db/sqlite/p_sports/schema"

// Define the schema for the House form
export const HouseSchema = z.object({
  name: z.string().min(1, { message: "House name is required" }),
  abbreviation: z.string().optional(),
  color: z.string().optional(),
})

type HouseSchemaType = z.infer<typeof HouseSchema>

export default function HouseDialogForm({
  house,
  purpose = "create",
    onCreate,
    onUpdate,
    houses,
    fetchHouses,
}: Readonly<{
  purpose?: "create" | "edit";
  house?: PSHouse;
  onCreate?: (house: Omit<PSHouse,"id"|"createdAt"|"updatedAt"|"deletedAt">) => Promise<void>;
  onUpdate?: (id:string,house: Partial<PSHouse>) => Promise<void>;
  houses:PSHouse[];
  fetchHouses: () => Promise<void>;
}>) {
  const [isOpen, setIsOpen] = useState(false)

  const defaultValues: HouseSchemaType = {
    name: house?.name || "",
  }

  const form = useForm({
    defaultValues,
    resolver: zodResolver(HouseSchema),
  })

  async function onSubmit(data: HouseSchemaType) {
    try {
      if (purpose === "edit") {
        await onUpdate(house?.id, data);
      } else {
        await onCreate({
          name: data.name,
          abbreviation: data.abbreviation?? null,
          color: data?.color??null,
        });
      }

      form.reset()
      setIsOpen(false)
      Toast({ message: `House ${purpose === "create" ? "created" : "updated"} successfully`, variation: "success" })
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
          {purpose === "create" ? <span>New House</span> : <NotebookPen className="h-4 w-4" />}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{purpose === "create" ? "Create New" : "Edit"} House</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="House Name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="abbreviation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Abbreviation</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="House Abbreviation" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>House Color</FormLabel>
                  <FormControl>
                    <Input
                      type="color"
                      {...field}
                      className="h-10 w-20 p-1 border rounded-md"
                    />
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
      </DialogContent>
    </Dialog>
  )
}
