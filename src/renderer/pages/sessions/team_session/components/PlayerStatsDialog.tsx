import { Button } from "@/renderer/components/ui/button";
import { Input } from "@/renderer/components/ui/input";
import { Label } from "@/renderer/components/ui/label";
import { TSFixture, TSPlayer } from "@/db/sqlite/t_sports/schema";
import { useMemo, useState } from "react";
import { StepConfig } from "../../../../../shared/types/mutli_step_dialog_types";
import { ChartBar, Send, Users } from "lucide-react";
import { useSessionState } from "./SessionStateContext";
import { useSessionSettings } from "./hooks/use_settings";
import { SearchableSelectWithDialog } from "@/renderer/components/creatable_select";
import { z } from "zod";
import { Toast } from "@/renderer/components/Toast";
import { TSessionSettings } from "@/shared/settings";
import { DynamicMultiStepDialog } from "../../../../components/dynamic_multistep_dialog";

interface PlayerStatsDialogProps {
  fixture: TSFixture;
}

export function PlayerStatsDialog({ fixture }: PlayerStatsDialogProps) {
  const { players, createPlayerFixtureStats, playerFixtureStats,updatePlayerFixtureStats } =
    useSessionState();
  const PlayerStatsEntryConfig: StepConfig[] = [
    {
      id: "player",
      title: "Select Player",
      description: "Choose player to add stats for.",
      icon: <Users className="h-4 w-4" />,
      type: "single-select",
      items: players.map((player) => ({
        id: player.id,
        label: `${player.name}`,
        metadata: player,
      })),
      validation: (selections) => !!selections.player,
    },
    {
      id: "stats",
      title: "Select Stats",
      description: "Insert choose or create stats for the player.",
      icon: <ChartBar className="h-4 w-4" />,
      type: "custom",
      customContent: ({ selections, onSelectionChange, stepId }) => {
        const {
          settings: { statKeys },
          settings,
          updateSettings,
        } = useSessionSettings();

        const { playerFixtureStats } = useSessionState();
        const [newKey, setNewKey] = useState("");
        const [newValue, setNewValue] = useState("");

        const initialStats: { key: string; value: string }[] =
          playerFixtureStats
            .filter((ps) => ps.playerId === selections.player)
            .map((stat) => ({ key: stat.statKey, value: stat.statValue }));

        const selectedStats: { key: string; value: string }[] = useMemo(() => {
          const fromStep = selections[stepId] ?? [];
          // Prevent duplicate keys — prioritize selections[stepId]
          const seen = new Set();
          return [
            ...fromStep,
            ...initialStats.filter(({ key }) => {
              if (selections[stepId]?.some((s: any) => s.key === key))
                return false;
              if (seen.has(key)) return false;
              seen.add(key);
              return true;
            }),
          ];
        }, [selections, stepId, playerFixtureStats]);

        const addStat = () => {
          const trimmedKey = newKey.trim();
          const trimmedValue = newValue.trim();
          if (!trimmedKey || !trimmedValue) return;

          const updated = [
            ...selectedStats.filter((s) => s.key !== trimmedKey),
            { key: trimmedKey, value: trimmedValue },
          ];
          onSelectionChange(stepId, updated);
          setNewKey("");
          setNewValue("");
        };

        const removeStat = (key: string) => {
          onSelectionChange(
            stepId,
            selectedStats.filter((stat) => stat.key !== key)
          );
        };

        const handleValueChange = (key: string, value: string) => {
          const updated = selectedStats.map((stat) =>
            stat.key === key ? { ...stat, value } : stat
          );
          onSelectionChange(stepId, updated);
        };

        return (
          <div className="space-y-4">
            <label className="text-sm font-medium">Add or Select Stats</label>

            {/* New stat form */}
            <div className="flex gap-2">
              <SearchableSelectWithDialog
                onChange={setNewKey}
                value={newKey}
                options={statKeys.map((key) => ({
                  id: key,
                  name: key,
                }))}
                schema={z.object({
                  key: z.string().min(1),
                })}
                onAddOption={async (data) => {
                  const key = data.key.trim().toLowerCase();
                  const exists = statKeys.find(
                    (existingKey) =>
                      existingKey.toLowerCase() === key.toLowerCase()
                  );

                  if (exists) {
                    Toast({
                      message: "Stat key already exists",
                      variation: "error",
                    });
                    return;
                  }

                  const newSettings: TSessionSettings = {
                    ...settings,
                    statKeys: [...settings.statKeys, key],
                  };

                  await updateSettings({ settings: newSettings });
                  setNewKey(key);
                  Toast({
                    message: "New stat key added",
                    variation: "success",
                  });
                }}
              />
              <Input
                placeholder="Value"
                value={newValue}
                type="number"
                onChange={(e) => setNewValue(e.target.value)}
              />
              <button
                type="button"
                className="px-3 py-2 bg-primary text-white rounded"
                onClick={addStat}>
                Add
              </button>
            </div>

            {/* Selected stats list */}
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                Selected Stats
              </p>
              <div className="space-y-2">
                {selectedStats.map(({ key, value }) => (
                  <div key={key} className="flex items-center gap-2">
                    <span className="w-32 font-medium text-right">{key}:</span>
                    <Input
                      className="flex-1"
                      placeholder="Enter value"
                      type="number"
                      value={value}
                      onChange={(e) => handleValueChange(key, e.target.value)}
                    />
                    <button
                      className="text-red-600 hover:text-red-800 text-sm"
                      onClick={() => removeStat(key)}>
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      },
      validation: (selections) => {
        const stats: { key: string; value: string }[] =
          selections["stats"] || [];

        return (
          Array.isArray(stats) &&
          stats.length > 0 &&
          stats.every(
            (stat) =>
              typeof stat.key === "string" &&
              stat.key.trim().length > 0 &&
              typeof stat.value === "string" &&
              stat.value.trim().length > 0 &&
              !isNaN(Number(stat.value))
          )
        );
      },
    },
  ];

  async function handleSubmit(selections: Record<string, any>) {
    const {
      player: pId,
      stats,
    }: { player: string; stats: { key: string; value: string }[] } =
      selections as any;
    const player = players.find((p) => p.id === pId);
    if (!player || !fixture) return;
    try {
      const existingStats = playerFixtureStats.filter(
        (stat) => stat.playerId === pId
      );
      const statsExistingFromInput = existingStats.filter((stat) =>
        stats.some((st) => st.key === stat.statKey)
      );
      const statsNotExistingFromPlayer = stats.filter(
        (stat) => !existingStats.some((es) => es.statKey === stat.key)
      );
      if(statsExistingFromInput.length>0){
        await Promise.all(statsExistingFromInput.map(async(stat)=>{
          const st = stats.find(s=>s.key===stat.statKey)
          await updatePlayerFixtureStats(stat.id,{...stat,statValue:st?.value})
        }))
      }
      await Promise.all(
        statsNotExistingFromPlayer.map(async (stat) => {
          await createPlayerFixtureStats({
            statKey:stat.key,
            statValue:stat.value,
            playerId:pId,
            fixtureId:fixture.id
          });
        })
      );
      Toast({message:"Stats Added",variation:"success"})
    } catch (error) {
      console.log(error);
      Toast({message:"An error occured.",variation:"error"})
    }
  }

  return (
    <DynamicMultiStepDialog
      title="Assign Player Stats"
      triggerLabel="Enter Player Stats"
      triggerIcon={<Users className="mr-2 h-4 w-4" />}
      steps={PlayerStatsEntryConfig}
      onSubmit={handleSubmit}
    />
  );
}
