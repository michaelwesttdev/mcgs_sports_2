import { TournamentGroup } from "@/db/sqlite/tournaments/schema";
import { DynamicMultiStepDialog } from "@/renderer/components/dynamic_multistep_dialog";
import { StepConfig } from "@/shared/types/mutli_step_dialog_types";
import { Plus, Send, Target, Users } from "lucide-react";
import React, { ReactNode } from "react";
import { useSessionState } from "../SessionStateContext";
import { Input } from "@/renderer/components/ui/input";
import { nanoid } from "nanoid";
import { Toast } from "@/renderer/components/Toast";

export default function GroupForm() {
  const { teamsNormal,groupCreate,groupTeamCreate,groupTeamsNormal} = useSessionState();
  const GroupAssignmentSteps: StepConfig[] = [
    {
      id: "group",
      title: "Group Details",
      description: "Add group information",
      icon: <Target className="h-4 w-4" />,
      type: "custom",
      customContent: ({ selections, onSelectionChange, stepId }) => (
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Group Name</label>
            <Input
              placeholder="Enter group name"
              value={selections[stepId]?.name || ""}
              onChange={(e) =>
                onSelectionChange(stepId, {
                  ...selections[stepId],
                  name: e.target.value,
                })
              }
            />
          </div>
        </div>
      ),
      validation: (selections) => selections.group?.name?.length > 0,
    },
    {
      id: "teams",
      title: "Select Teams",
      description: "Select teams to assign to the group",
      icon: <Users className="h-4 w-4" />,
      type: "multi-select",
      items: teamsNormal.filter(t=>groupTeamsNormal.some(gt=>gt.teamId!==t.id)).map((team) => {
        return {
          id: team.id,
          label: team.name,
        };
      }),
      validation: (selections) => selections.teams?.length > 0,
    },
    {
      id: "review",
      title: "Review & Submit",
      description: "Confirm your group-team assignments",
      icon: <Send className="h-4 w-4" />,
      type: "review",
    },
  ];
  const handleGroupCreationSubmit = async(selections: Record<string, any>) => {
    try {
        const {group,teams} = selections as {group:{name:string},teams:string[]};
        const newGroup: TournamentGroup = {
          id: nanoid(),
          ...group,
        };
        await groupCreate(newGroup);
        await Promise.all(teams.map(async(teamId)=>{
            await groupTeamCreate({
                groupId:newGroup.id,
                teamId
            })
        }))
        Toast({message:"Group created",variation:"success"})
    } catch (error) {
        console.log(error);
        Toast({message:"Group creation failed",variation:"error"})
    }
  };
  return (
    <DynamicMultiStepDialog
      title="Create Group And Assign Teams"
      triggerLabel="Start Group Creation"
      triggerIcon={<Plus className="mr-2 h-4 w-4" />}
      steps={GroupAssignmentSteps}
      onSubmit={handleGroupCreationSubmit}
    />
  );
}
