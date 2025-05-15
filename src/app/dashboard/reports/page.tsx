'use client';

import { useState } from 'react';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'react-hot-toast';
import { DateRange } from 'react-day-picker';
import { FileText, FileSpreadsheet, Code, ArrowDownToLine, Calendar, CheckCircle2 } from 'lucide-react';

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
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
          Reports & Export
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Export your health data in various formats for analysis and sharing
        </p>
      </div>
      
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Left Column */}
        <div className="space-y-8">
          <Card className="overflow-hidden border-0 shadow-lg dark:shadow-indigo-900/20">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-500 p-4">
              <div className="flex items-center">
                <Calendar className="h-6 w-6 text-white mr-2" />
                <h2 className="text-xl font-semibold text-white">Date Range</h2>
              </div>
            </div>
            <div className="p-6">
              <DateRangePicker 
                date={dateRange}
                onDateChange={setDateRange}
                className="w-full"
              />
            </div>
          </Card>
          
          <Card className="overflow-hidden border-0 shadow-lg dark:shadow-indigo-900/20">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-500 p-4">
              <div className="flex items-center">
                <CheckCircle2 className="h-6 w-6 text-white mr-2" />
                <h2 className="text-xl font-semibold text-white">Data to Include</h2>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <Checkbox 
                  id="glucose" 
                  checked={selectedData.glucose}
                  onCheckedChange={(checked) => 
                    setSelectedData(prev => ({ ...prev, glucose: !!checked }))
                  }
                  className="h-5 w-5 border-2"
                />
                <div>
                  <Label htmlFor="glucose" className="text-base font-medium">Glucose Readings</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Blood glucose measurements and trends</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <Checkbox 
                  id="food" 
                  checked={selectedData.food}
                  onCheckedChange={(checked) => 
                    setSelectedData(prev => ({ ...prev, food: !!checked }))
                  }
                  className="h-5 w-5 border-2"
                />
                <div>
                  <Label htmlFor="food" className="text-base font-medium">Food Log</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Meals, nutrition and carbohydrate intake</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <Checkbox 
                  id="activity" 
                  checked={selectedData.activity}
                  onCheckedChange={(checked) => 
                    setSelectedData(prev => ({ ...prev, activity: !!checked }))
                  }
                  className="h-5 w-5 border-2"
                />
                <div>
                  <Label htmlFor="activity" className="text-base font-medium">Activity Log</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Exercise, steps and physical activity</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <Checkbox 
                  id="wellbeing" 
                  checked={selectedData.wellbeing}
                  onCheckedChange={(checked) => 
                    setSelectedData(prev => ({ ...prev, wellbeing: !!checked }))
                  }
                  className="h-5 w-5 border-2"
                />
                <div>
                  <Label htmlFor="wellbeing" className="text-base font-medium">Wellbeing Data</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Sleep, stress and mood tracking</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
        
        {/* Right Column */}
        <div>
          <Card className="overflow-hidden border-0 shadow-lg h-full dark:shadow-indigo-900/20">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-500 p-4">
              <h2 className="text-xl font-semibold text-white">Export Format</h2>
            </div>
            <div className="p-6">
              <RadioGroup 
                value={selectedFormat} 
                onValueChange={setSelectedFormat}
                className="space-y-6"
              >
                <div className={`flex items-start space-x-3 p-4 rounded-lg border-2 transition-all ${selectedFormat === 'pdf' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700'}`}>
                  <RadioGroupItem value="pdf" id="pdf" className="mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 mr-2 text-blue-600" />
                      <Label htmlFor="pdf" className="text-base font-medium">PDF Report</Label>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Comprehensive report with charts, statistics and analysis
                    </p>
                  </div>
                </div>
                
                <div className={`flex items-start space-x-3 p-4 rounded-lg border-2 transition-all ${selectedFormat === 'csv' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700'}`}>
                  <RadioGroupItem value="csv" id="csv" className="mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center">
                      <FileSpreadsheet className="h-5 w-5 mr-2 text-green-600" />
                      <Label htmlFor="csv" className="text-base font-medium">CSV (Spreadsheet)</Label>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Tabular data for Excel or other spreadsheet applications
                    </p>
                  </div>
                </div>
                
                <div className={`flex items-start space-x-3 p-4 rounded-lg border-2 transition-all ${selectedFormat === 'json' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700'}`}>
                  <RadioGroupItem value="json" id="json" className="mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center">
                      <Code className="h-5 w-5 mr-2 text-purple-600" />
                      <Label htmlFor="json" className="text-base font-medium">JSON (Raw Data)</Label>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Raw data format for developers and system integration
                    </p>
                  </div>
                </div>
              </RadioGroup>

              <div className="mt-8">
                <Button 
                  className="w-full py-6 text-base font-medium bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-700 hover:to-indigo-600 transition-all shadow-lg hover:shadow-xl"
                  onClick={handleExport}
                >
                  <ArrowDownToLine className="mr-2 h-5 w-5" />
                  Export Data
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
} 