import React from 'react'
 import { FileText, Trophy, Calendar, Send } from "lucide-react"
import { Input } from "~/components/ui/input"
import { Textarea } from "~/components/ui/textarea"
import type { StepConfig } from "../../../../../../shared/types/mutli_step_dialog_types"
import { DynamicMultiStepDialog } from '@/renderer/components/dynamic_multistep_dialog'
type Props = {}

export default function RoundCreationForm({}: Props) {
   const roundCreationSteps: StepConfig[] = [
  {
    id: "round-details",
    title: "Round Details",
    description: "Provide a name and optional description for this round",
    icon: <FileText className="h-4 w-4" />,
    type: "custom",
    customContent: ({ selections, onSelectionChange, stepId }) => (
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium">Round Name</label>
          <Input
            placeholder="e.g., Quarterfinals"
            value={selections[stepId]?.name || ""}
            onChange={(e) =>
              onSelectionChange(stepId, {
                ...selections[stepId],
                name: e.target.value,
              })
            }
          />
        </div>
        <div>
          <label className="text-sm font-medium">Description (Optional)</label>
          <Textarea
            placeholder="e.g., This is the first knockout round..."
            value={selections[stepId]?.description || ""}
            onChange={(e) =>
              onSelectionChange(stepId, {
                ...selections[stepId],
                description: e.target.value,
              })
            }
          />
        </div>
      </div>
    ),
    validation: (selections) => selections["round-details"]?.name?.length > 0,
  },
  {
    id: "round-type",
    title: "Round Type",
    description: "What type of round is this?",
    icon: <Trophy className="h-4 w-4" />,
    type: "single-select",
    items: [
      { id: "normal", label: "Normal Round", description: "Standard matches" },
      { id: "quarter-final", label: "Quarter Final", description: "Top 8 teams" },
      { id: "semi-final", label: "Semi Final", description: "Top 4 teams" },
      { id: "final", label: "Final", description: "Championship round" },
      { id: "third-place", label: "Third Place Playoff", description: "Runner-up decider" },
    ],
    validation: (selections) => !!selections["round-type"],
  },
  {
    id: "review",
    title: "Review & Generate",
    description: "Confirm your round setup",
    icon: <Send className="h-4 w-4" />,
    type: "review",
  },
]

  return (
    <DynamicMultiStepDialog
  title="Create Tournament Round"
  triggerLabel="Generate Matches"
  triggerIcon={<Calendar className="mr-2 h-4 w-4" />}
  steps={roundCreationSteps}
  onSubmit={(selections) => {
    console.log("Round created with config:", selections)
    // TODO: Call your match generator based on round type
  }}
/>

  )
}