"use client"

import type { StepConfig, StepItem } from "../../shared/types/mutli_step_dialog_types"
import { Checkbox } from "~/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group"
import { Label } from "~/components/ui/label"
import { ScrollArea } from "~/components/ui/scroll-area"
import { Badge } from "~/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { JSX } from "react"

interface StepRendererProps {
  step: StepConfig
  selections: Record<string, any>
  onSelectionChange: (stepId: string, value: any) => void
  allSelections: Record<string, any>
  allSteps: StepConfig[]
}

export function  StepRenderer({ step, selections, onSelectionChange, allSelections, allSteps }: StepRendererProps):JSX.Element|null{
  const currentSelection = selections[step.id]

  const handleMultiSelectToggle = (itemId: string) => {
    const current = currentSelection || []
    const updated = current.includes(itemId) ? current.filter((id: string) => id !== itemId) : [...current, itemId]
    onSelectionChange(step.id, updated)
  }

  const handleSingleSelect = (itemId: string) => {
    onSelectionChange(step.id, itemId)
  }

  const RenderItem = (item: StepItem, isSelected: boolean, onToggle: () => void) => (
    <div key={item.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 border">
      {step.type === "multi-select" ? (
        <Checkbox id={item.id} checked={isSelected} onCheckedChange={onToggle} />
      ) : (
        <RadioGroupItem value={item.id} id={item.id} />
      )}
      <div className="flex items-center space-x-3 flex-1">
        {item.avatar && (
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
            {item.avatar}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <Label htmlFor={item.id} className="text-sm font-medium cursor-pointer flex items-center gap-2">
            {item.label}
            {item.badge && (
              <Badge className={item.badge.className || "bg-secondary text-secondary-foreground"}>
                {item.badge.text}
              </Badge>
            )}
          </Label>
          {item.description && <p className="text-xs text-muted-foreground mt-1">{item.description}</p>}
        </div>
      </div>
    </div>
  )

  const RenderMultiSelect = () => {
    const selectedItems = currentSelection || []

    return (
      <div className="h-full flex flex-col">
        <div className="text-sm text-muted-foreground flex-shrink-0">{step.description}</div>
        <ScrollArea className="w-full h-full flex-1 rounded-md border p-4">
          <div className="space-y-3">
            {step.items?.map((item) =>
              RenderItem(item, selectedItems.includes(item.id), () => handleMultiSelectToggle(item.id)),
            )}
          </div>
        </ScrollArea>
        {selectedItems.length > 0 && (
          <div className="flex flex-wrap gap-1 flex-shrink-0">
            <span className="text-sm text-muted-foreground">Selected:</span>
            {selectedItems.map((id: string) => {
              const item = step.items?.find((i) => i.id === id)
              return (
                <Badge key={id} variant="secondary" className="text-xs">
                  {item?.label}
                </Badge>
              )
            })}
          </div>
        )}
      </div>
    )
  }

  const RenderSingleSelect = () => (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground">{step.description}</div>
      <ScrollArea className="h-[300px] w-full">
        <RadioGroup value={currentSelection} onValueChange={handleSingleSelect} className="space-y-3">
          {step.items?.map((item) => RenderItem(item, currentSelection === item.id, () => handleSingleSelect(item.id)))}
        </RadioGroup>
      </ScrollArea>
    </div>
  )

  const RenderReview = () => {
  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground">{step.description}</div>
      <ScrollArea className="h-[300px] w-full">
        <div className="space-y-4">
          {allSteps.slice(0, -1).map((reviewStep) => {
            const stepSelection = allSelections[reviewStep.id]
            if (!stepSelection) return null

            let selectedItems: StepItem[] = []

            if (reviewStep.type === "multi-select") {
              selectedItems = reviewStep.items?.filter((item) =>
                stepSelection.includes(item.id)
              ) || []
            } else if (reviewStep.type === "single-select") {
              selectedItems = reviewStep.items?.filter(
                (item) => item.id === stepSelection
              ) || []
            }

            return (
              <Card key={reviewStep.id}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    {reviewStep.icon}
                    {reviewStep.title}
                    {reviewStep.type === "multi-select" && (
                      <Badge variant="outline" className="text-xs">
                        {selectedItems.length} selected
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Multi or single select */}
                  {selectedItems.length > 0 ? (
                    <div className="space-y-2">
                      {selectedItems.map((item) => (
                        <div key={item.id} className="flex items-center space-x-3 p-2 rounded-lg bg-muted/30">
                          {item.avatar && (
                            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                              {item.avatar}
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium flex items-center gap-2">
                              {item.label}
                              {item.badge && (
                                <Badge className={`text-xs ${item.badge.className}`}>{item.badge.text}</Badge>
                              )}
                            </p>
                            {item.description && (
                              <p className="text-xs text-muted-foreground truncate">{item.description}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    // Custom step fallback
                    reviewStep.type === "custom" && (
                      <div className="space-y-1 text-sm text-muted-foreground">
                        {Object.entries(stepSelection).map(([key, value]) => (
                          <div key={key} className="flex gap-4">
                            <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                            <span className="text-primary">{String(value)}</span>
                          </div>
                        ))}
                      </div>
                    )
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </ScrollArea>
    </div>
  )
}


  const RenderCustom = () => {
    if (!step.customContent) return null
    return step.customContent({
      selections: allSelections,
      onSelectionChange,
      stepId: step.id,
    })
  }

  switch (step.type) {
    case "multi-select":
      return <RenderMultiSelect/>
    case "single-select":
      return <RenderSingleSelect/>
    case "review":
      return <RenderReview/>
    case "custom":
      return RenderCustom()
    default:
      return <></>
  }
}
