import React, { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogFooter, DialogTrigger, DialogHeader } from "@/renderer/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form"

import { Input } from "@/renderer/components/ui/input";
import { Button } from "@/renderer/components/ui/button";
import { z } from "zod";
import { MStudent } from "@/db/sqlite/main/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { NotebookPen } from "lucide-react";
import { ScrollArea } from "@/renderer/components/ui/scroll-area";
import { useStudents } from "@/renderer/hooks/use_students";
import { Toast } from "@/renderer/components/Toast";
import { DatePicker } from "antd";
import dayjs from "dayjs";

const StudentSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  dob: z.string().min(1, "Date of birth is required"),
  gender: z.enum(["male", "female"]),
});

type StudentFormProps = {
  student?: MStudent;
  purpose?:"create"|"update";
  trigger?:React.ReactNode
};

type ZodStudentType = z.infer<typeof StudentSchema>

const defaultValues:ZodStudentType={
    firstName:"",
    lastName:"",
    dob:"",
    gender:"male"
}

export default function StudentFormDialog({  student,purpose="create",trigger }: StudentFormProps) {
const [isOpen, setIsOpen] = useState(false);
const {createStudent,updateStudent} = useStudents()
  const [loading, setLoading] = useState<{ kind: string, state: boolean }>({
    kind: "",
    state: false
  });
  const [dotCount, setDotCount] = useState(0);
  const form = useForm({
    defaultValues,
    resolver:zodResolver(StudentSchema)
  })

 async function onSubmit(values:ZodStudentType) {
     setLoading({
          kind:(purpose==="create"?"Creating ":"Updating ")+"Student",
          state:true
        })
        try {
          const validated = StudentSchema.safeParse(values);
          if (validated.error) {
            throw new Error(validated.error.message);
          }
    
          if (purpose === "update") {
            await updateStudent(student?.id, validated.data)
          } else {
            await createStudent({
              firstName: validated.data.firstName,
              lastName: validated.data.lastName,
              dob: validated.data.dob,
              gender: validated.data.gender
            })
          }
    
          form.reset()
          setIsOpen(false)
          Toast({
            message: `Student ${purpose === "create" ? "created" : "updated"} successfully`,
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

  React.useEffect(() => {
      if (student) {
        form.reset({
            ...student
        })
      }
    }, [student]);
  React.useEffect(() => {
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
          size={purpose === "update" ? "icon" : "default"}
          className={`${purpose === "update" ? "w-6 h-6" : ""}`}
        >
          {purpose === "create" ? <span>New Student</span> : <NotebookPen className="h-4 w-4" />}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <ScrollArea className={"max-h-[90dvh] px-3"}><DialogHeader>
          <DialogTitle>{purpose === "create" ? "Create New" : "Edit"} Student</DialogTitle>
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
                          <DatePicker value={field.value ? dayjs(field.value) : null} onChange={(_, date) => {
                      field.onChange(date.toString())
                    }} />
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
  );
}
