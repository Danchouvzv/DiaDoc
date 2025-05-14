import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Bell, Palette, ShieldCheck, KeyRound, UserCog, SaveAll, Globe } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-4xl font-bold tracking-tight flex items-center"><UserCog className="mr-3 h-10 w-10 text-primary"/>Settings</h1>

      <Card className="transition-all duration-300 ease-in-out hover:shadow-2xl overflow-hidden">
        <CardHeader className="p-6 bg-muted/30">
          <CardTitle className="text-2xl font-semibold">Account</CardTitle>
          <CardDescription>Manage your account preferences and personal information.</CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="space-y-1">
            <Label htmlFor="name" className="text-base">Full Name</Label>
            <Input id="name" defaultValue="John Doe" className="py-3 text-base focus:ring-2 focus:ring-primary/50 shadow-sm h-12"/>
          </div>
          <div className="space-y-1">
            <Label htmlFor="email" className="text-base">Email Address</Label>
            <Input id="email" type="email" defaultValue="john.doe@example.com" className="py-3 text-base focus:ring-2 focus:ring-primary/50 shadow-sm h-12"/>
          </div>
          <Button variant="outline" className="shadow-sm hover:shadow-md transition-all duration-200 hover:bg-primary/5 hover:border-primary/50 active:scale-95 text-base py-3 h-12">
            <KeyRound className="mr-2 h-5 w-5" />
            Change Password
          </Button>
        </CardContent>
      </Card>

      <Card className="transition-all duration-300 ease-in-out hover:shadow-2xl overflow-hidden">
        <CardHeader className="p-6 bg-muted/30">
          <CardTitle className="text-2xl font-semibold flex items-center"><Bell className="mr-2 h-6 w-6"/>Notifications</CardTitle>
          <CardDescription>Configure how you receive notifications from DiaDoc.</CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          {[
            {id: "diaryReminders", label: "Diary Reminders", description: "Get reminders to fill your daily logs.", defaultChecked: true},
            {id: "glucoseAlerts", label: "Glucose Level Alerts", description: "Receive alerts for critical glucose levels.", defaultChecked: true},
            {id: "emailNotifications", label: "Email Notifications", description: "Receive important updates via email.", defaultChecked: false},
          ].map((item, index, arr) => (
            <React.Fragment key={item.id}>
              <div className="flex items-center justify-between p-4 rounded-lg border border-input hover:border-primary/30 hover:bg-primary/5 transition-all duration-200 ease-in-out">
                <div>
                  <Label htmlFor={item.id} className="text-base font-medium">{item.label}</Label>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
                <Switch id={item.id} defaultChecked={item.defaultChecked} />
              </div>
              {index < arr.length -1 && <Separator />}
            </React.Fragment>
          ))}
        </CardContent>
      </Card>
      
      <Card className="transition-all duration-300 ease-in-out hover:shadow-2xl overflow-hidden">
        <CardHeader className="p-6 bg-muted/30">
          <CardTitle className="text-2xl font-semibold flex items-center"><Palette className="mr-2 h-6 w-6"/>Appearance</CardTitle>
          <CardDescription>Customize the look and feel of the application.</CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg border border-input hover:border-primary/30 hover:bg-primary/5 transition-all duration-200 ease-in-out">
            <Label htmlFor="darkMode" className="text-base font-medium">Dark Mode</Label>
            {/* This switch would ideally control the theme globally via context/localStorage */}
            <Switch id="darkMode" defaultChecked aria-label="Toggle dark mode" />
          </div>
           <div className="flex items-center justify-between p-4 rounded-lg border border-input hover:border-primary/30 hover:bg-primary/5 transition-all duration-200 ease-in-out">
            <Label htmlFor="language" className="text-base font-medium flex items-center"><Globe className="mr-2 h-5 w-5"/>Language</Label>
             <span className="text-muted-foreground text-sm">English (US)</span> {/* Placeholder for select */}
          </div>
        </CardContent>
      </Card>

      <Card className="transition-all duration-300 ease-in-out hover:shadow-2xl overflow-hidden">
        <CardHeader className="p-6 bg-muted/30">
          <CardTitle className="text-2xl font-semibold flex items-center"><ShieldCheck className="mr-2 h-6 w-6"/>Security & Privacy</CardTitle>
          <CardDescription>Manage your security settings and connected devices.</CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <Button variant="outline" className="w-full sm:w-auto shadow-sm hover:shadow-md transition-all duration-200 hover:bg-primary/5 hover:border-primary/50 active:scale-95 text-base py-3 h-12">
            <ShieldCheck className="mr-2 h-5 w-5" />
            Manage Connected Devices
          </Button>
          {/* More security options can be added here */}
        </CardContent>
      </Card>

      <div className="flex justify-end mt-4">
        <Button size="lg" className="shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 active:scale-100 text-base px-8 py-3 h-14">
          <SaveAll className="mr-2 h-6 w-6"/> Save All Settings
        </Button>
      </div>
    </div>
  );
}
