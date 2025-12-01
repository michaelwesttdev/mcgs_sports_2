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
  purpose?: "create" | "update";
  trigger?: React.ReactNode;
  fixture?: TSFixture;
};
export const FixtureSchema = z.object({
  name: z.string(),
  gender: z.string(),
  round: z.string(),
  date: z.string(),
  homeTeamId: z.string(),
  awayTeamId: z.string(),
});
export type FixtureFormDataType = z.infer<typeof FixtureSchema>;
const defaultValues: FixtureFormDataType = {
  name: "",
  gender: "male",
  round: "match",
  date: "",
  homeTeamId: "",
  awayTeamId: "",
};
export default function FixtureFormDialog({
  purpose = "create",
  trigger,
  fixture,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const {
    teams,
    createTeam,
    createFixture,
    updateFixture,
    fixtureParticipants,
    createFixtureParticipant,
    updateFixtureParticipant,
  } = useSessionState();
  const [loading, setLoading] = useState<{ kind: string; state: boolean }>({
    kind: "",
    state: false,
  });
  const [dotCount, setDotCount] = useState(0);
  const form = useForm({
    defaultValues,
    resolver: zodResolver(FixtureSchema),
  });
  async function onSubmit(values: FixtureFormDataType) {
    const validated = FixtureSchema.safeParse(values);
    if (!validated.success) {
      Toast({
        message: "An Error Occured. Please check your data for corrections.",
        variation: "error",
      });
      return;
    }
    setLoading({
      kind: `${purpose === "create" ? "Creating" : "Updating"} Player`,
      state: true,
    });
    try {
      const { name, gender, round, date, homeTeamId, awayTeamId } =
        validated.data;
      if (purpose == "update") {
        if (!fixture) throw new Error();
        const changedHomeTeam = fixture.homeTeamId !== homeTeamId;
        const changedAwayTeam = fixture.awayTeamId !== awayTeamId;
        const homeTeamResultExists = fixtureParticipants.some(fp=>fp.fixtureId===fixture.id&&fp.teamId===fixture.homeTeamId)
        const awayTeamResultExists = fixtureParticipants.some(fp=>fp.fixtureId===fixture.id&&fp.teamId===fixture.awayTeamId)
        console.dir({changedAwayTeam,changedHomeTeam})
        if (changedHomeTeam || !homeTeamResultExists) {
          const exists = fixtureParticipants.find(
            (fp) =>
              fp.teamId === fixture.homeTeamId && fp.fixtureId === fixture.id
          );
          if (exists) {
            await updateFixtureParticipant(exists.id, {
              ...exists,
              teamId: homeTeamId,
            });
          } else {
            await createFixtureParticipant({
              fixtureId: fixture.id,
              teamId: homeTeamId,
              score: 0,
            });
          }
        }
        if (changedAwayTeam || !awayTeamResultExists) {
          const exists = fixtureParticipants.find(
            (fp) =>
              fp.teamId === fixture.awayTeamId && fp.fixtureId === fixture.id
          );
          if (exists) {
            await updateFixtureParticipant(exists.id, {
              ...exists,
              teamId: awayTeamId,
            });
          } else {
            await createFixtureParticipant({
              fixtureId: fixture.id,
              teamId: awayTeamId,
              score: 0,
            });
          }
        }
        await updateFixture(fixture.id, validated.data);
      } else {
        const id = nanoid();
        await createFixtureParticipant({
          fixtureId: id,
          teamId: homeTeamId,
          score: 0,
        });
        await createFixtureParticipant({
          fixtureId: id,
          teamId: awayTeamId,
          score: 0,
        });
        await createFixture({
          id,
          name,
          gender,
          round,
          date,
          homeTeamId,
          awayTeamId,
        });
      }
      Toast({
        message: `Fixture successfully ${
          purpose === "create" ? "created" : "updated"
        }.`,
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
  useEffect(() => {
    if (fixture) {
      form.reset({
        ...fixture,
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
          <Button
            variant="outline"
            size={purpose === "update" ? "icon" : "default"}
            className={`${purpose === "update" ? "w-6 h-6" : ""}`}>
            {purpose === "create" ? (
              <span>New Fixture</span>
            ) : (
              <NotebookPen className="h-4 w-4" />
            )}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <ScrollArea className={"max-h-[90dvh] px-3"}>
          <DialogHeader>
            <DialogTitle>
              {purpose === "create" ? "Create New" : "Edit"} Fixture
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
                      <FormLabel>Fixture Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Fixture Name" />
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
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="round"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Round</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select round" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="match">Match</SelectItem>
                            <SelectItem value="semi-final">
                              semi-Final
                            </SelectItem>
                            <SelectItem value="final">Final</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date</FormLabel>
                      <FormDescription>
                        Date session will take place
                      </FormDescription>
                      <FormControl>
                        <DatePicker
                          value={field.value ? dayjs(field.value) : null}
                          onChange={(_, date) => {
                            field.onChange(date.toString());
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* selects for home team and away team id */}
                <FormField
                  control={form.control}
                  name="homeTeamId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Home Team</FormLabel>
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
                          placeholder="Select a Home Team"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="awayTeamId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Away Team</FormLabel>
                      <FormControl>
                        <SearchableSelectWithDialog
                          value={field.value}
                          options={teams.map((team) => ({
                            id: team.id,
                            name: team.name,
                          }))}
                          onChange={field.onChange}
                          onAddOption={createTeam}
                          schema={TeamSchema}
                          label="Add New Team"
                          description="Add a new team"
                          dialogTitle="Add New Team"
                          placeholder="Select an Away Team"
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
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
