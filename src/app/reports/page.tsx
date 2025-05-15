import { Metadata } from 'next';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'react-hot-toast';

export const metadata: Metadata = {
  title: 'Export Data - DiaDoc',
  description: 'Export your health data in various formats',
};

export default function ReportsPage() {
  const handleExport = async (format: string) => {
    try {
      const from = '2024-01-01'; // TODO: Get from date picker
      const to = '2024-12-31';   // TODO: Get from date picker
      const entities = ['glucose', 'food', 'activity', 'wellbeing'];
      
      const params = new URLSearchParams({
        from,
        to,
        entities: entities.join(','),
      });

      const response = await fetch(`/api/exports/${format}?${params}`);
      
      if (!response.ok) {
        throw new Error('Export failed');
      }

      // Handle file download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `health-data.${format}`;
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
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Export Health Data</h1>
      
      <div className="grid gap-8 md:grid-cols-2">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Date Range</h2>
          <DateRangePicker />
          
          <h2 className="text-xl font-semibold mt-6 mb-4">Data to Include</h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox id="glucose" defaultChecked />
              <Label htmlFor="glucose">Glucose Readings</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="food" defaultChecked />
              <Label htmlFor="food">Food Log</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="activity" defaultChecked />
              <Label htmlFor="activity">Activity Log</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="wellbeing" defaultChecked />
              <Label htmlFor="wellbeing">Wellbeing Data</Label>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Export Format</h2>
          <RadioGroup defaultValue="pdf" className="space-y-4">
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
              onClick={() => handleExport('pdf')}
            >
              Export Data
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
} 