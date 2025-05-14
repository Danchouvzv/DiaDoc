import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileDown, Share2, TrendingUp, PieChart, BarChartHorizontalBig, LineChart } from "lucide-react"; // Added more icons
import { DatePickerWithRange } from "@/components/ui/date-picker-range"; 


export default function ReportsPage() {
  return (
    <div className="flex flex-col gap-8"> 
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-2">
        <h1 className="text-4xl font-bold tracking-tight flex items-center">
          <LineChart className="mr-3 h-10 w-10 text-primary"/>Health Reports
        </h1>
        <div className="flex gap-2 items-center">
          <span className="text-sm text-muted-foreground hidden sm:inline">Select Date Range:</span>
          <DatePickerWithRange className="w-auto shadow-sm" />
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-1">
        <Card className="transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-1 overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-4 bg-muted/30 p-6">
            <div>
              <CardTitle className="text-xl flex items-center"><TrendingUp className="mr-3 h-6 w-6 text-primary"/>Weekly Glucose & Activity</CardTitle>
              <CardDescription className="mt-1">Overview of your glucose levels and physical activity.</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="shadow-sm hover:shadow-md transition-all duration-200 hover:bg-primary/5 hover:border-primary/50 active:scale-95">
                <Share2 className="mr-2 h-4 w-4" /> Share
              </Button>
              <Button variant="outline" size="sm" className="shadow-sm hover:shadow-md transition-all duration-200 hover:bg-primary/5 hover:border-primary/50 active:scale-95">
                <FileDown className="mr-2 h-4 w-4" /> Export PDF
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-80 w-full bg-background rounded-lg flex items-center justify-center text-muted-foreground border-2 border-dashed border-border/50 p-4 shadow-inner" data-ai-hint="health data graph">
              Glucose & Activity Chart Placeholder
            </div>
          </CardContent>
        </Card>

        <Card className="transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-1 overflow-hidden">
          <CardHeader className="pb-4 bg-muted/30 p-6">
             <CardTitle className="text-xl flex items-center"><PieChart className="mr-3 h-6 w-6 text-accent"/>Nutrition Summary</CardTitle>
            <CardDescription className="mt-1">Calorie and macronutrient intake analysis for the selected period.</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-80 w-full bg-background rounded-lg flex items-center justify-center text-muted-foreground border-2 border-dashed border-border/50 p-4 shadow-inner" data-ai-hint="nutrition chart report">
              Nutrition Chart Placeholder
            </div>
          </CardContent>
        </Card>

        <Card className="transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-1 overflow-hidden">
          <CardHeader className="pb-4 bg-muted/30 p-6">
            <CardTitle className="text-xl flex items-center"><BarChartHorizontalBig className="mr-3 h-6 w-6 text-green-500"/>Health History Heatmap</CardTitle>
            <CardDescription className="mt-1">Visualizing your health data patterns over time.</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-80 w-full bg-background rounded-lg flex items-center justify-center text-muted-foreground border-2 border-dashed border-border/50 p-4 shadow-inner" data-ai-hint="heatmap data visualization">
              Heatmap Placeholder
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
