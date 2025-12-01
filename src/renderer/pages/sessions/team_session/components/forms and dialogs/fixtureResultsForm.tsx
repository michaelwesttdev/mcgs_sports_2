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
import { useFieldArray, useForm } from "react-hook-form";
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
import { PSHouse, PSParticipant } from "@/db/sqlite/p_sports/schema";
import { ScrollArea } from "~/components/ui/scroll-area";
import { SearchableSelectWithDialog } from "~/components/creatable_select";
import { HouseSchema } from "~/components/house-dialog-form";
import { nanoid } from "nanoid";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import { useSessionState } from "../SessionStateContext";
import { TeamSchema } from "./TeamFormDialog";
import { TSFixture } from "@/db/sqlite/t_sports/schema";

type Props = {
  trigger?: React.ReactNode;
  fixture: TSFixture;
};
export const FixtureResultsSchema = z.object({
  results: z.array(
    z.object({
      teamId: z.string().min(1),
      score: z.number().int().min(0),
    })
  ),
});
export type FixtureResultsFormDataType = z.infer<typeof FixtureResultsSchema>;
const defaultValues: FixtureResultsFormDataType = {
  results: [],
};
export default function FixtureResultsFormDialog({ trigger, fixture }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const { teams, fixtureParticipants, updateFixtureParticipant } =
    useSessionState();
  const [loading, setLoading] = useState<{ kind: string; state: boolean }>({
    kind: "",
    state: false,
  });
  const [dotCount, setDotCount] = useState(0);
  const form = useForm({
    defaultValues,
    resolver: zodResolver(FixtureResultsSchema),
  });
  const { fields } = useFieldArray({
    control: form.control,
    name: "results",
  });
  async function onSubmit(values: FixtureResultsFormDataType) {
    const validated = FixtureResultsSchema.safeParse(values);
    if (!validated.success) {
      Toast({
        message: "An Error Occured. Please check your data for corrections.",
        variation: "error",
      });
      return;
    }
    setLoading({
      kind: `Updating Fixture Results`,
      state: true,
    });
    try {
      await Promise.all(
        values.results.map(async (v) => {
          const result = fixtureParticipants.find(
            (fp) => v.teamId === fp.teamId && fp.fixtureId === fixture.id
          );
          if (!result) return;
          await updateFixtureParticipant(result.id, {
            ...result,
            score: v.score,
          });
        })
      ).catch((e) => {
        throw e;
      });

      Toast({
        message: `Fixture results applied`,
        variation: "success",
      });
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
  function getTeamName(id:string){
    const team = teams.find(t=>t.id===id);
    if(!team) return "";
    return team.name
  }
  useEffect(() => {
    if (fixture) {
      form.reset({
        results: fixtureParticipants
          .filter((fp) => fp.fixtureId === fixture.id)
          .map((fp) => ({
            teamId: fp.teamId,
            score: fp.score,
          })),
      });
    }
  }, [fixture]);
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
        {trigger || (
          <Button variant="outline">
            <span>Enter Fixture Results</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <ScrollArea className={"max-h-[90dvh] px-3"}>
          <DialogHeader>
            <DialogTitle>Enter Fixture Results</DialogTitle>
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
                {fields.map((item, index) => (
                  <FormField
                    control={form.control}
                    name={`results.${index}.score`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{getTeamName(item.teamId)} Score</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(+e.target.value)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
                <Button type="submit" className="capitalize">
                  Submit
                </Button>
              </form>
            </Form>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
