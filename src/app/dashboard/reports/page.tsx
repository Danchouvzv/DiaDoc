import { Metadata } from 'next';
import { useState } from 'react';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'react-hot-toast';
import { DateRange } from 'react-day-picker';

export const metadata: Metadata = {
  title: 'Reports & Export - DiaDoc',
  description: 'Export and analyze your health data in various formats',
};

export default function ReportsPage() {
  const [selectedFormat, setSelectedFormat] = useState('pdf');
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(),
  });
  const [selectedData, setSelectedData] = useState({
    glucose: true,
    food: true,
    activity: true,
    wellbeing: true,
  });

  const handleExport = async () => {
    try {
      if (!dateRange?.from || !dateRange?.to) {
        toast.error('Please select a date range');
        return;
      }

      const from = dateRange.from.toISOString().split('T')[0];
      const to = dateRange.to.toISOString().split('T')[0];
      
      const entities = Object.entries(selectedData)
        .filter(([_, isSelected]) => isSelected)
        .map(([entity]) => entity);

      if (entities.length === 0) {
        toast.error('Please select at least one data type');
        return;
      }
      
      const params = new URLSearchParams({
        from,
        to,
        entities: entities.join(','),
      });

      const response = await fetch(`/api/exports/${selectedFormat}?${params}`);
      
      if (!response.ok) {
        throw new Error('Export failed');
      }

      // Handle file download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `health-data.${selectedFormat}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success('Export completed successfully');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export data');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Reports & Export</h2>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Date Range</h3>
          <DateRangePicker 
            date={dateRange}
            onDateChange={setDateRange}
          />
          
          <h3 className="text-xl font-semibold mt-6 mb-4">Data to Include</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="glucose" 
                checked={selectedData.glucose}
                onCheckedChange={(checked) => 
                  setSelectedData(prev => ({ ...prev, glucose: !!checked }))
                }
              />
              <Label htmlFor="glucose">Glucose Readings</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="food" 
                checked={selectedData.food}
                onCheckedChange={(checked) => 
                  setSelectedData(prev => ({ ...prev, food: !!checked }))
                }
              />
              <Label htmlFor="food">Food Log</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="activity" 
                checked={selectedData.activity}
                onCheckedChange={(checked) => 
                  setSelectedData(prev => ({ ...prev, activity: !!checked }))
                }
              />
              <Label htmlFor="activity">Activity Log</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="wellbeing" 
                checked={selectedData.wellbeing}
                onCheckedChange={(checked) => 
                  setSelectedData(prev => ({ ...prev, wellbeing: !!checked }))
                }
              />
              <Label htmlFor="wellbeing">Wellbeing Data</Label>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Export Format</h3>
          <RadioGroup 
            value={selectedFormat} 
            onValueChange={setSelectedFormat}
            className="space-y-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="pdf" id="pdf" />
              <Label htmlFor="pdf">PDF Report</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="csv" id="csv" />
              <Label htmlFor="csv">CSV (Spreadsheet)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="json" id="json" />
              <Label htmlFor="json">JSON (Raw Data)</Label>
            </div>
          </RadioGroup>

          <div className="mt-8">
            <Button 
              className="w-full"
              onClick={handleExport}
            >
              Export Data
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
} 