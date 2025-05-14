import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Edit3, Save, ShieldAlert, Trash2, UserCircle2, BarChartBig, Target } from "lucide-react";

export default function ProfilePage() {
  // Placeholder user data
  const user = {
    name: "John Doe",
    email: "john.doe@example.com",
    avatarUrl: "https://picsum.photos/256/256", 
    joinDate: "January 15, 2023",
    goals: {
      calories: 2000,
      steps: 10000,
      targetGlucoseMin: 70,
      targetGlucoseMax: 140,
    },
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <h1 className="text-4xl font-bold tracking-tight flex items-center"><UserCircle2 className="mr-3 h-10 w-10 text-primary"/>User Profile</h1>
        <Button variant="outline" size="lg" className="shadow-sm hover:shadow-md transition-all duration-200 hover:bg-primary/5 hover:border-primary/50 active:scale-95 text-base py-3">
          <Edit3 className="mr-2 h-5 w-5" />
          Edit Profile
        </Button>
      </div>

      <Card className="transition-all duration-300 ease-in-out hover:shadow-2xl overflow-hidden">
        <CardHeader className="flex flex-col md:flex-row items-center gap-6 p-6 bg-muted/30">
          <Avatar className="h-36 w-36 border-4 border-primary/30 shadow-lg">
            <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint="profile person large" />
            <AvatarFallback className="text-5xl bg-muted">{user.name.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="text-center md:text-left">
            <CardTitle className="text-4xl font-semibold">{user.name}</CardTitle>
            <CardDescription className="text-xl text-muted-foreground">{user.email}</CardDescription>
            <p className="text-md text-muted-foreground mt-1">Joined: {user.joinDate}</p>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="p-6"> 
          <h2 className="text-2xl font-semibold mb-6 text-primary flex items-center"><Target className="mr-2 h-6 w-6"/>Health Goals</h2>
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <div className="space-y-1">
                <Label htmlFor="calories" className="text-base">Target Daily Calories</Label>
                <Input id="calories" type="number" defaultValue={user.goals.calories} className="py-3 text-base focus:ring-2 focus:ring-primary/50 shadow-sm h-12"/>
              </div>
              <div className="space-y-1">
                <Label htmlFor="steps" className="text-base">Target Daily Steps</Label>
                <Input id="steps" type="number" defaultValue={user.goals.steps} className="py-3 text-base focus:ring-2 focus:ring-primary/50 shadow-sm h-12"/>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <div className="space-y-1">
                <Label htmlFor="glucoseMin" className="text-base">Target Glucose Min (mg/dL)</Label>
                <Input id="glucoseMin" type="number" defaultValue={user.goals.targetGlucoseMin} className="py-3 text-base focus:ring-2 focus:ring-primary/50 shadow-sm h-12"/>
              </div>
              <div className="space-y-1">
                <Label htmlFor="glucoseMax" className="text-base">Target Glucose Max (mg/dL)</Label>
                <Input id="glucoseMax" type="number" defaultValue={user.goals.targetGlucoseMax} className="py-3 text-base focus:ring-2 focus:ring-primary/50 shadow-sm h-12"/>
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <Button size="lg" className="shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 active:scale-100 text-base px-8 py-3">
                <Save className="mr-2 h-5 w-5" />
                Save Goals
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

       <Card className="transition-all duration-300 ease-in-out hover:shadow-2xl overflow-hidden">
        <CardHeader className="p-6 bg-muted/30">
          <CardTitle className="text-2xl font-semibold text-primary flex items-center"><ShieldAlert className="mr-2 h-6 w-6"/>Account Settings</CardTitle>
          <CardDescription>Manage your account details and preferences.</CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
           <div>
             <Button variant="outline" className="w-full sm:w-auto shadow-sm hover:shadow-md transition-all duration-200 hover:bg-primary/5 hover:border-primary/50 active:scale-95 text-base py-3">Change Password</Button>
           </div>
           <div>
             <Button variant="destructive" className="w-full sm:w-auto shadow-sm hover:shadow-lg transition-all duration-200 hover:bg-destructive/90 active:scale-95 text-base py-3">
               <Trash2 className="mr-2 h-5 w-5"/> Delete Account
             </Button>
           </div>
        </CardContent>
      </Card>
    </div>
  );
}
