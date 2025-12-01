import React, { useEffect, useState } from "react";
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
  FormDescription,
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
import { NotebookPen } from "lucide-react";
import { z } from "zod";
import { ScrollArea } from "~/components/ui/scroll-area";
import { useSessionState } from "../SessionStateContext";
import { SearchableSelectWithDialog } from "@/renderer/components/creatable_select";
import { TeamSchema } from "./TeamFormDialog";
import { nanoid } from "nanoid";
import { TSPlayer } from "@/db/sqlite/t_sports/schema";

type Props = {
  purpose?: "create" | "edit";
  trigger?: React.ReactNode;
  player?:TSPlayer
};

export const PlayerSchema = z.object({
  name: z.string({ message: "Player Name is Required" }).min(3),
  teamId: z.string({ message: "Player's Team is required" }),
});

export type ZodPlayerType = z.infer<typeof PlayerSchema>;
const defaultValues: ZodPlayerType = {
  name: "",
  teamId: "",
};
export default function PlayerFormDialog({
  purpose = "create",
  trigger,
  player
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const { createPlayer, teams, createTeam,updatePlayer } = useSessionState();
  const [loading, setLoading] = useState<{ kind: string; state: boolean }>({
    kind: "",
    state: false,
  });
  const [dotCount, setDotCount] = useState(0);
  const form = useForm({
    defaultValues,
    resolver: zodResolver(PlayerSchema),
  });
  async function onSubmit(values: ZodPlayerType) {
    const validated = PlayerSchema.safeParse(values);
    if (!validated.success) {
      Toast({
        message: "An Error Occured. Please check your data for corrections.",
        variation: "error",
      });
      return;
    }
    setLoading({
      kind: `${purpose==="create"?"Creating":"Updating"} Player`,
      state: true,
    });
    try {
      const { name, teamId } = validated.data;
      if(purpose=="edit"){
        if(!player) throw new Error();
        await updatePlayer(player.id,validated.data)
      }else{
      await createPlayer({
        name,
        teamId,
      });}
      Toast({ message: `Player successfully ${purpose==="create"?"created":"updated"}.`, variation: "success" });
      form.reset(defaultValues);
      setIsOpen(false);
    } catch (error) {
      console.log(error);
      Toast({
        message: "An Error Occured. Please try again",
        variation: "error",
      });
    } finally {
      setLoading({
        kind: "",
        state: false,
      });
    }
  }
  useEffect(()=>{
    if(player){
      form.reset({
        name:player.name,
        teamId:player.teamId
      })
    }
  },[player])
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
        
        {trigger?trigger:<Button
          variant="outline"
          size={purpose === "edit" ? "icon" : "default"}
          className={`${purpose === "edit" ? "w-6 h-6" : ""}`}>
          {purpose === "create" ? (
            <span>New Player</span>
          ) : (
            <NotebookPen className="h-4 w-4" />
          )}
        </Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <ScrollArea className={"max-h-[90dvh] px-3"}>
          <DialogHeader>
            <DialogTitle>
              {purpose === "create" ? "Create New" : "Edit"} Player
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
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Player&apos;s Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Player's Name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="teamId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Player&apos;s Team</FormLabel>
                      <FormControl>
                        <SearchableSelectWithDialog
                          value={field.value}
                          options={teams.map((team) => ({
                            id: team.id,
                            name: team.name,
                          }))}
                          onChange={field.onChange}
                          onAddOption={async (data) => {
                            const id = nanoid();
                            await createTeam({ id, ...data });
                            field.onChange(id);
                          }}
                          schema={TeamSchema}
                          label="Add New Team"
                          description="Add a new team"
                          dialogTitle="Add New Team"
                          placeholder="Select a Team"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* selects for home team and away team id */}

                <Button type="submit" className="capitalize">
                  {purpose}
                </Button>
              </form>
            </Form>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
