import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Badge } from "~/components/ui/badge"
import { Avatar, AvatarFallback } from "~/components/ui/avatar"
import { Trophy, Calendar, Target, Award, TrendingUp, ArrowLeft } from "lucide-react"
import { getParticipantData, ParticipantData } from "./components/participant-data"
import NotFound from "./components/not-found"
import { useNavigate, useParams, useSearchParams } from "react-router"
import { useEffect, useState } from "react"
import Loader from "@/renderer/components/Loader"
import { useSessionState } from "../components/SessionStateContext"
import { Button } from "@/renderer/components/ui/button"
import ScrollBox from "@/renderer/components/ScrollBox"

export default function PerfomanceParticipantPage() {
  const params = useParams();
  const navigate = useNavigate();
  const [participantData,setParticipantData] = useState<ParticipantData>();
  const [loading,setLoading] = useState(true);
  const {events,eventResults:results,participants,houses} = useSessionState();
  const [searchString, setSearchString] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("searchP")

  if (!params.pId) {
    return (
        <NotFound/>
    )
  }

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const getPositionColor = (position: number) => {
    if (position === 1) return "text-yellow-600 bg-yellow-50"
    if (position === 2) return "text-gray-600 bg-gray-50"
    if (position === 3) return "text-amber-600 bg-amber-50"
    return "text-blue-600 bg-blue-50"
  }

  const getPositionIcon = (position: number) => {
    if (position <= 3) return <Trophy className="w-4 h-4" />
    return <Target className="w-4 h-4" /> 
  }

  useEffect(()=>{
    if(params.pId){
     (async ()=>{
      const participant = participants.find(p=>p.id===params.pId);
      const house = houses.find(h=>h.id===participant.houseId)
      const data = await getParticipantData(params.pId,house,participant,events,results);
      setParticipantData(data);
     })().finally(()=>{
      setLoading(false)
     })
    }
  },[])
  useEffect(()=>{
    if(search && search!=="undefined"){
      setSearchString(search);
    }
  },[])
console.log(searchParams.toString())

  if(loading){
    return (
      <Loader/>
    )
  }

  if(!participantData){
    return (
      <NotFound/>
    )
  }

  const { participant, house, eventResults, stats } = participantData

  return (
    <ScrollBox>
    <div className="container mx-auto p-6 space-y-6">
      {/* Header Section */}
      <Button onClick={()=>{
        navigate(`/sessions/performance/${params.sessionId}?tab=Participants&searchP=${searchString}`)
      }}><ArrowLeft/>Back</Button>
      <div className="flex flex-col md:flex-row gap-6">
        <Card className="flex-1">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16">
                <AvatarFallback className="text-lg font-semibold">
                  {getInitials(participant.firstName, participant.lastName)}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl">
                  {participant.firstName} {participant.lastName}
                </CardTitle>
                <div className="flex items-center gap-2 mt-2">
                  {house && (
                    <Badge
                      variant="secondary"
                      className="text-white"
                      style={{ backgroundColor: house.color || "#6b7280" }}
                    >
                      {house.name}
                    </Badge>
                  )}
                  <Badge variant="outline" className="capitalize">
                    {participant.gender}
                  </Badge>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Date of Birth:</span>
                <p className="font-medium">{participant.dob}</p>
              </div>
              <div>
                <span className="text-muted-foreground">House:</span>
                <p className="font-medium">{house?.name || "No House"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-1 gap-4 md:w-80">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Award className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-600">{stats.totalPoints}</p>
                  <p className="text-sm text-muted-foreground">Total Points</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600">{stats.totalVlp}</p>
                  <p className="text-sm text-muted-foreground">Total VLP</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Calendar className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-purple-600">{stats.eventsParticipated}</p>
                  <p className="text-sm text-muted-foreground">Events</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Trophy className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-yellow-600">{stats.averagePosition.toFixed(1)}</p>
                  <p className="text-sm text-muted-foreground">Avg Position</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Performance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              Top Finishes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">1st Place:</span>
                <span className="font-semibold text-yellow-600">{stats.firstPlace}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">2nd Place:</span>
                <span className="font-semibold text-gray-600">{stats.secondPlace}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">3rd Place:</span>
                <span className="font-semibold text-amber-600">{stats.thirdPlace}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Best Performance</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.bestResult ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {getPositionIcon(stats.bestResult.position)}
                  <span className="font-semibold">Position {stats.bestResult.position}</span>
                </div>
                <p className="text-sm text-muted-foreground">{stats.bestResult.eventTitle}</p>
                <p className="text-sm font-medium">{stats.bestResult.points} points</p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No events completed</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Event Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Individual:</span>
                <span className="font-semibold">{stats.individualEvents}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Team:</span>
                <span className="font-semibold">{stats.teamEvents}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Event Results */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Event Participation History</CardTitle>
        </CardHeader>
        <CardContent>
          {eventResults.length > 0 ? (
            <div className="space-y-4">
              {eventResults.map((result) => (
                <div key={result.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge className={`${getPositionColor(result.position)} border-0`}>
                          <span className="flex items-center gap-1">
                            {getPositionIcon(result.position)}#{result.position}
                          </span>
                        </Badge>
                        <h3 className="font-semibold">{result.event.title}</h3>
                        <Badge variant="outline" className="capitalize">
                          {result.event.eventType}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Event #:</span>
                          <p className="font-medium">{result.event.eventNumber}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Age Group:</span>
                          <p className="font-medium">{result.event.ageGroup}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Gender:</span>
                          <p className="font-medium capitalize">{result.event.gender}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Status:</span>
                          <Badge variant={result.event.status === "complete" ? "default" : "secondary"}>
                            {result.event.status}
                          </Badge>
                        </div>
                      </div>

                      {result.event.description && (
                        <p className="text-sm text-muted-foreground mt-2">{result.event.description}</p>
                      )}
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <div className="text-right">
                        <p className="text-2xl font-bold text-blue-600">{result.points}</p>
                        <p className="text-sm text-muted-foreground">Points</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-green-600">{result.vlp}</p>
                        <p className="text-xs text-muted-foreground">VLP</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No event participation recorded yet.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
    </ScrollBox>
  )
}
