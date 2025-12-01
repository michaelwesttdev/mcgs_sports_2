"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "~/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { Checkbox } from "~/components/ui/checkbox"
import { Badge } from "~/components/ui/badge"
import { Settings, Plus, X } from "lucide-react"
import { useSessionSettings } from "./hooks/use_settings"
import { formats, genders, TieBreakerOption, tieBreakerOptions, TournamentFormat, TournamentSessionSettings } from "@/shared/settings"
import { Toast } from "@/renderer/components/Toast"

interface SettingsPanelProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SettingsPanel({ open, onOpenChange }: SettingsPanelProps) {
  const {settings,updateSettings,fetchSettings} = useSessionSettings()
  const [format, setFormat] = useState<TournamentFormat|undefined>(undefined)
  const [allowDraws, setAllowDraws] = useState(false)
  const [useGroups, setUseGroups] = useState(false)
  const [ageGroup, setAgeGroup] = useState("")
  const [gender, setGender] = useState("mixed")
  const [tieBreakerRules, setTieBreakerRules] = useState<TieBreakerOption[]>([])
  const [loading,setLoading] = useState(false);
  //const [customStats, setCustomStats] = useState(["goals", "assists", "yellow_cards"])
  //const [newStat, setNewStat] = useState("")

  const toggleTieBreaker = (r: string) => {
    const rule = tieBreakerOptions.find(ru=>ru.value===r)
    setTieBreakerRules((prev) => (prev.includes(rule) ? prev.filter((r) => r !== rule) : [...prev, rule]))
  }

  /* const addCustomStat = () => {
    if (newStat.trim() && !customStats.includes(newStat.trim())) {
      setCustomStats([...customStats, newStat.trim()])
      setNewStat("")
    }
  }

  const removeCustomStat = (stat: string) => {
    setCustomStats(customStats.filter((s) => s !== stat))
  } */

  const handleSave = async () => {
    setLoading(true)
    try {
      const updatedSettings:TournamentSessionSettings = {
      ...settings,
      format,
      useGroups,
      allowDraws,
      tieBreakerOptions:tieBreakerRules,
      gender:gender as "male"|"female"|"mixed",
      ageGroup
    }
    await updateSettings({
      settings:updatedSettings
    })
    onOpenChange(false)
      Toast({message:"Settings saved.",variation:"success"})
    } catch (error) {
      console.log(error);
      Toast({message:"Failed to save settings",variation:"error"})
    }finally{
      setLoading(false)
    }
  }

  function restSettingsStates(){
    setFormat(settings.format),
    setAllowDraws(settings.allowDraws??false),
    setUseGroups(settings.useGroups??false),
    setTieBreakerRules(settings.tieBreakerOptions??[])
    setGender(settings.gender??"mixed")
    setAgeGroup(settings.ageGroup??"")
  }

  useEffect(()=>{
    if(settings){
      restSettingsStates();
    }else{
      fetchSettings()
    }
  },[settings])

  if(!settings){
    return null
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Tournament Settings
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Tournament Format */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tournament Format</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="format">Format</Label>
                <Select value={format?.name} onValueChange={(v)=>{
                  const selectedFormat = formats.find(f=>f.name===v);
                  setFormat(selectedFormat)
                }}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="max-h-[250px]">
                    {formats.map((f) => (
                      <SelectItem key={f.name} value={f.name}>
                        {f.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="allow-draws" checked={allowDraws} onCheckedChange={(checked)=>setAllowDraws(checked as boolean)} />
                <Label htmlFor="allow-draws">Allow draws</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="use-groups" checked={useGroups} onCheckedChange={(checked)=>setUseGroups(checked as boolean)} />
                <Label htmlFor="use-groups">Use group stage</Label>
              </div>
            </CardContent>
          </Card>

          {/* Tie-breaker Rules */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tie-breaker Rules</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {tieBreakerOptions.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={option.value}
                      checked={tieBreakerRules.find(op=>op?.value===option.value)?true:false}
                      onCheckedChange={() => toggleTieBreaker(option.value)}
                    />
                    <Label htmlFor={option.value}>{option.label}</Label>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <div className="text-sm text-muted-foreground mb-2">Selected rules (in order of priority):</div>
                <div className="flex flex-wrap gap-2">
                  {tieBreakerRules.map((rule, index) => (
                    <Badge key={rule.value} variant="secondary">
                      {index + 1}. {tieBreakerOptions.find((o) => o.value === rule.value)?.label}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* misc settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Other Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label>Gender</Label>
                <Select value={gender} onValueChange={(v)=>setGender(v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Gender"/>
                  </SelectTrigger>
                  <SelectContent>
                    {
                      genders.map(g=>(
                        <SelectItem className="capitalize" value={g} key={g}>{g}</SelectItem>
                      ))
                    }
                  </SelectContent>
                </Select>
              </div>
              <div className="mt-4">
                <Label>Age Group</Label>
                <Input value={ageGroup} onChange={(e)=>{
                  setAgeGroup(e.target.value)
                }} placeholder="e.g U14, Seniors, Open..."/>
              </div>
            </CardContent>
          </Card>

          {/* Custom Stats Schema */}
          {/* <Card>
            <CardHeader>
              <CardTitle className="text-lg">Custom Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Add custom statistic (e.g., saves, fouls)"
                  value={newStat}
                  onChange={(e) => setNewStat(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addCustomStat()}
                />
                <Button onClick={addCustomStat} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {customStats.map((stat) => (
                  <Badge key={stat} variant="outline" className="gap-1">
                    {stat}
                    <button onClick={() => removeCustomStat(stat)} className="ml-1 hover:text-destructive">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card> */}

          {/* Save Button */}
          <div className="flex justify-end gap-2">
            <Button disabled={loading} variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button disabled={loading} onClick={handleSave}>{loading?"Saving Settings...":"Save Settings"}</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
