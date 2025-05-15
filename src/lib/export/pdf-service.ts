import { Document, Page, Text, View, StyleSheet, PDFViewer } from '@react-pdf/renderer';
import { DateRange } from './export-service';
import { exportService } from './export-service';

// Define styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 30,
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  text: {
    fontSize: 12,
    marginBottom: 5,
  },
  table: {
    display: 'table',
    width: 'auto',
    marginVertical: 10,
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableCell: {
    padding: 5,
    borderWidth: 1,
    borderColor: '#000000',
  },
  tableHeader: {
    backgroundColor: '#f0f0f0',
    fontWeight: 'bold',
  },
});

interface PDFReportProps {
  userId: string;
  dateRange: DateRange;
  data: {
    glucose: any[];
    food: any[];
    activity: any[];
    wellbeing: any[];
  };
  insights: {
    glucoseInsights: string[];
    foodInsights: string[];
    activityInsights: string[];
    wellbeingInsights: string[];
  };
}

const PDFReport = ({ userId, dateRange, data, insights }: PDFReportProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.title}>Health Report</Text>
        <Text style={styles.text}>Period: {dateRange.from} to {dateRange.to}</Text>
        
        {/* Glucose Section */}
        <Text style={styles.subtitle}>Glucose Readings</Text>
        <View style={styles.table}>
          {data.glucose.slice(0, 10).map((reading, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={[styles.tableCell, index === 0 && styles.tableHeader]}>
                {reading.timestamp}
              </Text>
              <Text style={[styles.tableCell, index === 0 && styles.tableHeader]}>
                {reading.value} mg/dL
              </Text>
            </View>
          ))}
        </View>
        
        {/* Insights Section */}
        <Text style={styles.subtitle}>AI Insights</Text>
        {insights.glucoseInsights.map((insight, index) => (
          <Text key={index} style={styles.text}>• {insight}</Text>
        ))}
      </View>
      
      {/* Additional pages for food, activity, and wellbeing data */}
      <Page style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.subtitle}>Food Log</Text>
          {/* Food entries table */}
        </View>
      </Page>
    </Page>
  </Document>
);

class PDFService {
  private static instance: PDFService;

  private constructor() {}

  public static getInstance(): PDFService {
    if (!PDFService.instance) {
      PDFService.instance = new PDFService();
    }
    return PDFService.instance;
  }

  public async generateReport(
    userId: string,
    dateRange: DateRange
  ): Promise<Buffer> {
    // Fetch all required data
    const data = await exportService.exportToJSON(userId, 
      ['glucose', 'food', 'activity', 'wellbeing'],
      dateRange
    );

    // TODO: Fetch AI insights
    const insights = {
      glucoseInsights: ['Sample insight 1', 'Sample insight 2'],
      foodInsights: ['Sample food insight'],
      activityInsights: ['Sample activity insight'],
      wellbeingInsights: ['Sample wellbeing insight'],
    };

    // Create PDF document
    const report = (
      <PDFReport
        userId={userId}
        dateRange={dateRange}
        data={data.data}
        insights={insights}
      />
    );

    // TODO: Implement PDF generation using @react-pdf/renderer
    // This will require setting up proper server-side rendering
    // For now, we'll return a placeholder
    return Buffer.from('PDF Generation not implemented');
  }
}

export const pdfService = PDFService.getInstance(); 