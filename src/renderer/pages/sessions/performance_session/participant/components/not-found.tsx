import { Button } from "~/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { UserX } from "lucide-react"
import { useNavigate } from "react-router"

export default function NotFound() {
    const navigate = useNavigate()
  return (
    <div className="container mx-auto p-6 flex items-center justify-center min-h-[60vh]">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
            <UserX className="w-6 h-6 text-muted-foreground" />
          </div>
          <CardTitle>Participant Not Found</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            The participant you're looking for doesn't exist or may have been removed.
          </p>
          <Button asChild>
            <Button variant="ghost" onClick={()=>navigate("/")}>Go Back</Button>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
