"use client"

import { DynamicMultiStepDialog } from "./dynamic_multistep_dialog"
import type { StepConfig } from "../../shared/types/mutli_step_dialog_types"
import { Users, Send, Building, Calendar, FileText } from "lucide-react"
import { Input } from "~/components/ui/input"
import { Textarea } from "~/components/ui/textarea"

// Example 1: Team Assignment (3 steps)
const teamAssignmentSteps: StepConfig[] = [
  {
    id: "participants",
    title: "Select Participants",
    description: "Choose team members to assign",
    icon: <Users className="h-4 w-4" />,
    type: "multi-select",
    items: [
      { id: "1", label: "Alice Johnson", description: "alice@example.com", avatar: "AJ" },
      { id: "2", label: "Bob Smith", description: "bob@example.com", avatar: "BS" },
      { id: "3", label: "Carol Davis", description: "carol@example.com", avatar: "CD" },
      { id: "4", label: "David Wilson", description: "david@example.com", avatar: "DW" },
    ],
    validation: (selections) => selections.participants?.length > 0,
  },
  {
    id: "team",
    title: "Select Team",
    description: "Choose which team they'll join",
    icon: <Building className="h-4 w-4" />,
    type: "single-select",
    items: [
      {
        id: "dev",
        label: "Development Team",
        description: "Frontend and backend developers",
        badge: { text: "Tech", className: "bg-blue-100 text-blue-800" },
      },
      {
        id: "design",
        label: "Design Team",
        description: "UI/UX designers and researchers",
        badge: { text: "Creative", className: "bg-purple-100 text-purple-800" },
      },
      {
        id: "marketing",
        label: "Marketing Team",
        description: "Marketing and growth specialists",
        badge: { text: "Growth", className: "bg-green-100 text-green-800" },
      },
    ],
    validation: (selections) => !!selections.team,
  },
  {
    id: "review",
    title: "Review & Submit",
    description: "Confirm your team assignments",
    icon: <Send className="h-4 w-4" />,
    type: "review",
  },
]

// Example 2: Project Setup (5 steps)
const projectSetupSteps: StepConfig[] = [
  {
    id: "project-type",
    title: "Project Type",
    description: "What type of project are you creating?",
    icon: <FileText className="h-4 w-4" />,
    type: "single-select",
    items: [
      { id: "web", label: "Web Application", description: "Frontend and backend web app" },
      { id: "mobile", label: "Mobile App", description: "iOS and Android application" },
      { id: "desktop", label: "Desktop Application", description: "Cross-platform desktop app" },
      { id: "api", label: "API Service", description: "Backend API and microservices" },
    ],
    validation: (selections) => !!selections["project-type"],
  },
  {
    id: "technologies",
    title: "Technologies",
    description: "Select the technologies you'll use",
    icon: <Building className="h-4 w-4" />,
    type: "multi-select",
    items: [
      { id: "react", label: "React", badge: { text: "Frontend", className: "bg-blue-100 text-blue-800" } },
      { id: "vue", label: "Vue.js", badge: { text: "Frontend", className: "bg-green-100 text-green-800" } },
      { id: "node", label: "Node.js", badge: { text: "Backend", className: "bg-yellow-100 text-yellow-800" } },
      { id: "python", label: "Python", badge: { text: "Backend", className: "bg-red-100 text-red-800" } },
      { id: "postgres", label: "PostgreSQL", badge: { text: "Database", className: "bg-purple-100 text-purple-800" } },
    ],
    validation: (selections) => selections.technologies?.length > 0,
  },
  {
    id: "team-size",
    title: "Team Size",
    description: "How many people will work on this project?",
    icon: <Users className="h-4 w-4" />,
    type: "single-select",
    items: [
      { id: "solo", label: "Solo (1 person)", description: "Just me working on this" },
      { id: "small", label: "Small Team (2-5 people)", description: "Small collaborative team" },
      { id: "medium", label: "Medium Team (6-15 people)", description: "Medium-sized development team" },
      { id: "large", label: "Large Team (16+ people)", description: "Large enterprise team" },
    ],
    validation: (selections) => !!selections["team-size"],
  },
  {
    id: "timeline",
    title: "Timeline",
    description: "When do you need this completed?",
    icon: <Calendar className="h-4 w-4" />,
    type: "single-select",
    items: [
      { id: "asap", label: "ASAP (Rush)", description: "Urgent delivery needed" },
      { id: "month", label: "Within a month", description: "Standard timeline" },
      { id: "quarter", label: "Within 3 months", description: "Comfortable timeline" },
      { id: "flexible", label: "Flexible", description: "No strict deadline" },
    ],
    validation: (selections) => !!selections.timeline,
  },
  {
    id: "details",
    title: "Project Details",
    description: "Add additional project information",
    icon: <FileText className="h-4 w-4" />,
    type: "custom",
    customContent: ({ selections, onSelectionChange, stepId }) => (
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium">Project Name</label>
          <Input
            placeholder="Enter project name"
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
          <label className="text-sm font-medium">Description</label>
          <Textarea
            placeholder="Describe your project..."
            value={selections[stepId]?.description || ""}
            onChange={(e) =>
              onSelectionChange(stepId, {
                ...selections[stepId],
                description: e.target.value,
              })
            }
          />
        </div>
        <div>
          <label className="text-sm font-medium">Budget Range</label>
          <Input
            placeholder="e.g., $10,000 - $50,000"
            value={selections[stepId]?.budget || ""}
            onChange={(e) =>
              onSelectionChange(stepId, {
                ...selections[stepId],
                budget: e.target.value,
              })
            }
          />
        </div>
      </div>
    ),
    validation: (selections) => selections.details?.name?.length > 0,
  },
]

export default function ExampleUsage() {
  const handleTeamAssignmentSubmit = (selections: Record<string, any>) => {
    console.log("Team Assignment Submitted:", selections)
    alert("Team assignment completed!")
  }

  const handleProjectSetupSubmit = (selections: Record<string, any>) => {
    console.log("Project Setup Submitted:", selections)
    alert("Project setup completed!")
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Dynamic Multi-Step Dialog Examples</h1>
        <p className="text-muted-foreground">
          These examples show how the dynamic dialog can handle different numbers of steps and content types
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Team Assignment (3 Steps)</h2>
          <p className="text-sm text-muted-foreground">
            Multi-select participants, single-select team, review and submit
          </p>
          <DynamicMultiStepDialog
            title="Assign Team Members"
            triggerLabel="Start Team Assignment"
            triggerIcon={<Users className="mr-2 h-4 w-4" />}
            steps={teamAssignmentSteps}
            onSubmit={handleTeamAssignmentSubmit}
          />
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Project Setup (5 Steps)</h2>
          <p className="text-sm text-muted-foreground">Single-select, multi-select, and custom form steps</p>
          <DynamicMultiStepDialog
            title="Create New Project"
            triggerLabel="Start Project Setup"
            triggerIcon={<FileText className="mr-2 h-4 w-4" />}
            steps={projectSetupSteps}
            onSubmit={handleProjectSetupSubmit}
          />
        </div>
      </div>
    </div>
  )
}
