import React, { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { useForm } from "react-hook-form";
import { NewSessionSchema, NewSessionSchemaType } from "@/shared/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "./ui/input";
import { Toast } from "./Toast";
import { Button } from "./ui/button";
import SeachableSelectWithCreationLogic from "./seachableSelectWithCreationLogic";
import { z } from "zod";
import { useSession } from "../hooks/use_session";
import { DatePicker, TimePicker } from 'antd';
import dayjs from 'dayjs';
import { SearchableSelectWithDialog } from "./creatable_select";
import { nanoid } from "nanoid";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { DisciplineType } from "@/shared/constants/constants";


const defaultValues: NewSessionSchemaType = {
  title: "",
  date: "",
  time: "",
  location: "",
  type: "",
};

type Props = {
  type?: "new" | "edit",
  trigger?: React.ReactNode,
  defValues?: NewSessionSchemaType & { id: string }
}

export default function NewSessionDialogForm({ type = "new", defValues, trigger }: Props) {
  const [open, setOpen] = React.useState(false);
  const { createSession, updateSession } = useSession();
  const form = useForm({
    defaultValues,
    resolver: zodResolver(NewSessionSchema),
  });
  async function onSubmit(data: NewSessionSchemaType) {
    const validated = NewSessionSchema.safeParse(data);
    try {
      if (validated.error) {
        throw new Error(validated.error.message);
      }
      const d = validated.data;
      if (type === "edit" && defValues) {
        return handleUpdate(d);
      }
      const res = await createSession({
        title: d.title,
        date: d.date,
        time: d.time,
        location: d.location,
        type: d.type as any,
      });
      if (res) {
        setOpen(false);
        form.reset();
      }
    } catch (error) {
      console.log(error);
      Toast({ message: error.message, variation: "error" });
    }
  }
  async function handleUpdate(data: NewSessionSchemaType) {
    try {
      const res = await updateSession(defValues?.id, { ...data as any });
      if (res) {
        Toast({ message: "Session updated successfully", variation: "success" });
        setOpen(false);
        form.reset();
      }
    } catch (error) {
      console.log(error);
      Toast({ message: error.message, variation: "error" });
    }
  }
  useEffect(() => {
    if (type === "edit" && defValues) {
      form.reset(defValues);
    } else {
      form.reset(defaultValues);
    }
  }, [defValues])
  return (
    <Dialog open={open} onOpenChange={(v) => setOpen(v)}>
      <DialogTrigger asChild>
        {trigger ? (
          trigger
        ) : (
          <Button className='shadow-md shadow-white/50'>New Session</Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Session</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-3'>
            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='Title' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='date'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormDescription>
                    Date session will take place
                  </FormDescription>
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
              name='time'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Time</FormLabel>
                  <FormDescription>
                    Time session will take place if known
                  </FormDescription>
                  <FormControl>
                    <TimePicker format={"HH:mm"} value={field.value ? dayjs(field.value, "HH:mm") : null} onChange={(_, time) => {
                      console.log(_, time)
                      field.onChange(time)
                    }} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='location'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input type='text' {...field} placeholder='location' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='type'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Discipline Type</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder={"Select a Dicipline Type"}/>
                      </SelectTrigger>
                      <SelectContent>
                        {
                        DisciplineType.map(t=>(
                          <SelectItem disabled={t==="tournament"} key={t} value={t} className="capitalize">{t}</SelectItem>
                        ))
                      }
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button>{type === "new" ? "Create" : "Update"}</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}