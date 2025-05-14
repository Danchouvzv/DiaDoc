import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap, Watch, Footprints, Activity, Bike, PersonStanding, Dumbbell } from "lucide-react"; // Added more icons
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


export default function ActivityLogPage() {
  return (
    <div className="flex flex-col gap-8"> 
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold tracking-tight flex items-center">
          <Activity className="mr-3 h-10 w-10 text-primary"/>Activity Log
        </h1>
      </div>

      <Card className="transition-all duration-300 ease-in-out hover:shadow-2xl overflow-hidden">
        <CardHeader className="bg-muted/30">
          <CardTitle className="text-2xl">Log New Activity</CardTitle>
          <CardDescription>Record your physical activities. Sync with your fitness tracker for seamless logging.</CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4"> 
            <div className="space-y-2">
              <Label htmlFor="activityType" className="text-base font-medium">Activity Type</Label>
              <Select>
                <SelectTrigger id="activityType" className="py-3 text-base focus:ring-2 focus:ring-primary/50 shadow-sm h-12">
                  <SelectValue placeholder="Select activity..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="walking"><Footprints className="inline mr-2 h-4 w-4 text-muted-foreground" />Walking</SelectItem>
                  <SelectItem value="running"><Activity className="inline mr-2 h-4 w-4 text-muted-foreground" />Running</SelectItem>
                  <SelectItem value="cycling"><Bike className="inline mr-2 h-4 w-4 text-muted-foreground" />Cycling</SelectItem>
                  <SelectItem value="swimming"><PersonStanding className="inline mr-2 h-4 w-4 text-muted-foreground" />Swimming</SelectItem> {/* Using PersonStanding as a proxy */}
                  <SelectItem value="gym"><Dumbbell className="inline mr-2 h-4 w-4 text-muted-foreground" />Gym Workout</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration" className="text-base font-medium">Duration (minutes)</Label>
              <Input id="duration" type="number" placeholder="e.g., 45" className="py-3 text-base focus:ring-2 focus:ring-primary/50 shadow-sm h-12" />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="steps" className="text-base font-medium">Steps Taken (Optional)</Label>
            <Input id="steps" type="number" placeholder="e.g., 6500" className="py-3 text-base focus:ring-2 focus:ring-primary/50 shadow-sm h-12" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <Button variant="outline" className="py-3 text-base shadow-sm hover:shadow-md transition-all duration-200 ease-in-out hover:bg-primary/5 h-12">
              <Watch className="mr-2 h-5 w-5" /> {/* Generic watch icon */}
              Sync Google Fit
            </Button>
            <Button variant="outline" className="py-3 text-base shadow-sm hover:shadow-md transition-all duration-200 ease-in-out hover:bg-primary/5 h-12">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-5 w-5 lucide lucide-apple"><path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z"/><path d="M10 2c1 .5 2 2 2 5"/></svg>
              Sync Apple Health
            </Button>
          </div>

          <div className="flex justify-end pt-4 mt-2 border-t border-border/50">
            <Button size="lg" className="shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 active:scale-100 text-base px-8 py-3">
              <Zap className="mr-2 h-5 w-5" />
              Log Activity
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="transition-all duration-300 ease-in-out hover:shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl">Past Activities</CardTitle>
          <CardDescription>Review your logged exercises and achievements.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No activities logged yet. Get moving and log your progress!</p>
          {/* Placeholder for a list/table of past activities */}
        </CardContent>
      </Card>
    </div>
  );
}
