"use client"

import { useState } from "react"
import { Button } from "~/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog"
import { ChevronLeft, ChevronRight, Send } from "lucide-react"
import type { MultiStepDialogProps } from "../../shared/types/mutli_step_dialog_types"
import { StepRenderer } from "./step_renderer"
import { Toast } from "@/renderer/components/Toast"
import { ScrollArea } from "./ui/scroll-area"

export function DynamicMultiStepDialog({
  title,
  triggerLabel,
  triggerIcon,
  steps,
  onSubmit,
  onCancel,
  maxHeight = "90vh",
  className = "",
}: MultiStepDialogProps) {
  const [open, setOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [selections, setSelections] = useState<Record<string, any>>({})
    const [loading,setLoading] = useState({
      kind:"",
      state:false
    })

  const handleSelectionChange = (stepId: string, value: any) => {
    setSelections((prev) => ({
      ...prev,
      [stepId]: value,
    }))
  }

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = () => {
    try {
      setLoading({
        kind:"Please Wait While We Complete The Operation",
        state:true
      })
      onSubmit(selections)
    setOpen(false)
    // Reset form
    setCurrentStep(0)
    setSelections({})
    } catch (error) {
      console.log(error)
    }finally{
      setLoading({
        kind:"Please Wait While We Complete The Operation",
        state:true
      })
    }
  }

  const handleCancel = () => {
    if (onCancel) {
      onCancel()
    }
    setOpen(false)
    setCurrentStep(0)
    setSelections({})
  }

  const currentStepConfig = steps[currentStep]
  const canProceed = currentStepConfig.validation ? currentStepConfig.validation(selections) : true

  const isLastStep = currentStep === steps.length - 1

  return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>
            {triggerIcon}
            {triggerLabel}
          </Button>
        </DialogTrigger>
        <DialogContent className={`sm:max-w-[500px] flex flex-col ${className}`} style={{ maxHeight }}>
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="flex items-center gap-2">
              {currentStepConfig.icon}
              {title} - Step {currentStep + 1} of {steps.length}
            </DialogTitle>
            <DialogDescription>{currentStepConfig.description}</DialogDescription>
          </DialogHeader>

          {/* Progress indicator */}
          <div className="flex items-center justify-between mb-4 flex-shrink-0 overflow-x-auto">
            {steps.map((_, index) => (
              <div key={index} className="flex items-center flex-1">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    index <= currentStep ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {index + 1}
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-1 ${index < currentStep ? "bg-primary" : "bg-muted"}`} />
                )}
              </div>
            ))}
          </div>

          {/* Step content */}
          <ScrollArea className="flex-1 overflow-y-auto">
            <StepRenderer
              step={currentStepConfig}
              selections={selections}
              onSelectionChange={handleSelectionChange}
              allSelections={selections}
              allSteps={steps}
            />
          </ScrollArea>

          {/* Navigation buttons */}
          <div className="flex justify-between pt-4 border-t flex-shrink-0">
            <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 0}>
              <ChevronLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>

            <div className="flex gap-2">
              <Button variant="ghost" onClick={handleCancel}>
                Cancel
              </Button>
              {!isLastStep ? (
                <Button onClick={handleNext} disabled={!canProceed}>
                  Next
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={!canProceed}>
                  <Send className="mr-2 h-4 w-4" />
                  Submit
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
  )
}
