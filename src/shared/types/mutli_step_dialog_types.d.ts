import type React from "react"
export interface StepItem {
  id: string
  label: string
  description?: string
  avatar?: string
  badge?: {
    text: string
    className?: string
  }
  metadata?: Record<string, any>
}

export interface StepConfig {
  id: string
  title: string
  description: string
  icon?: React.ReactNode
  type: "multi-select" | "single-select" | "review" | "custom"
  items?: StepItem[]
  validation?: (selections: Record<string, any>) => boolean
  customContent?: (props: {
    selections: Record<string, any>
    onSelectionChange: (stepId: string, value: any) => void
    stepId: string
  }) => JSX.Element | null
}

export interface MultiStepDialogProps {
  title: string
  triggerLabel: string
  triggerIcon?: React.ReactNode
  steps: StepConfig[]
  onSubmit: (selections: Record<string, any>) => void
  onCancel?: () => void
  maxHeight?: string
  className?: string
}
