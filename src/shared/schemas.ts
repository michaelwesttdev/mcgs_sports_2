import { z } from "zod";
import { DisciplineType } from "./constants/constants";

export const NewSessionSchema = z.object({
  title: z.string().min(1, "Session name is required"),
  date: z.string({ message: "Date is required" }),
  time: z.string().refine((value) => {
    const timeRegex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(value);
  }, "Invalid time format. Please use HH:MM format."),
  location: z.string().min(1, "Location is required"),
  type: z.string({message:"Discipline Type must be selected"}),
});
export const NewMainEventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  type: z.string({message:"Discipline Type must be selected"}),
  eventType: z.enum(["team", "individual"], {
    message: "Event type is required",
  }),
});

/* types */
export type NewSessionSchemaType = z.infer<typeof NewSessionSchema>;
export type NewMainEventSchemaType = z.infer<typeof NewMainEventSchema>;
