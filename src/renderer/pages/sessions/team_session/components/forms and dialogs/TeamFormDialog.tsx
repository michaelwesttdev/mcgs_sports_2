import React, { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form"
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
import { DatePicker } from "antd"
import dayjs from "dayjs"
import { useSessionState } from "../SessionStateContext"


type Props = {
    purpose?: "create" | "edit";
    trigger?: React.ReactNode
}

export const TeamSchema = z.object({
    name:z.string({
        message:"Team name is Required"
    })
})

export type TeamZodType = z.infer<typeof TeamSchema>;

const defaultValues:TeamZodType = {
    name:""
}

export default function TeamFormDialog({ purpose = "create", trigger }: Props) {
    const [isOpen, setIsOpen] = useState(false)
    const {createTeam} = useSessionState();
    const [loading, setLoading] = useState<{ kind: string, state: boolean }>({
        kind: "",
        state: false
    });
    const [dotCount, setDotCount] = useState(0);
    const form = useForm({
        defaultValues,
        resolver:zodResolver(TeamSchema)
    })
    async function onSubmit(values: TeamZodType) {
        const validated = TeamSchema.safeParse(values);
                if(!validated.success){
                    Toast({message:"An Error Occured. Please check your data for corrections.",variation:"error"});
                    return;
                }
                setLoading({
                        kind:"Creating Team",
                        state:true
                    })
                try {
                    const {name}=validated.data;
                    await createTeam({
                        name
                    });
                    Toast({message:"Team successfully created.",variation:"success"});
                    form.reset(defaultValues);
                    setIsOpen(false);
                } catch (error) {
                    console.log(error);
                    Toast({message:"An Error Occured. Please try again",variation:"error"});
                }finally{
                    setLoading({
                        kind:"",
                        state:false
                    })
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
                    {purpose === "create" ? <span>New Team</span> : <NotebookPen className="h-4 w-4" />}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <ScrollArea className={"max-h-[90dvh] px-3"}><DialogHeader>
                    <DialogTitle>{purpose === "create" ? "Create New" : "Edit"} Team</DialogTitle>
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
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Team Name</FormLabel>
                                                <FormControl>
                                                    <Input {...field} placeholder="Team Name" />
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