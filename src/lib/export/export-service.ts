import { db } from '../firebase';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { stringify } from 'csv-stringify/sync';
import { z } from 'zod';

// Validation schemas
export const DateRangeSchema = z.object({
  from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export const ExportOptionsSchema = z.object({
  format: z.enum(['csv', 'json', 'pdf']),
  entities: z.array(z.enum(['glucose', 'food', 'activity', 'wellbeing'])),
  includeAIInsights: z.boolean().optional(),
});

export type DateRange = z.infer<typeof DateRangeSchema>;
export type ExportOptions = z.infer<typeof ExportOptionsSchema>;

export interface ExportResult {
  data: any;
  metadata: {
    generatedAt: string;
    format: string;
    recordCount: number;
  };
}

class ExportService {
  private static instance: ExportService;

  private constructor() {}

  public static getInstance(): ExportService {
    if (!ExportService.instance) {
      ExportService.instance = new ExportService();
    }
    return ExportService.instance;
  }

  private async fetchData(
    userId: string,
    entity: string,
    dateRange: DateRange
  ): Promise<any[]> {
    const startDate = new Date(dateRange.from);
    const endDate = new Date(dateRange.to);

    const q = query(
      collection(db, `users/${userId}/${entity}`),
      where('timestamp', '>=', Timestamp.fromDate(startDate)),
      where('timestamp', '<=', Timestamp.fromDate(endDate))
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp.toDate().toISOString(),
    }));
  }

  public async exportToCSV(
    userId: string,
    entity: string,
    dateRange: DateRange
  ): Promise<string> {
    const data = await this.fetchData(userId, entity, dateRange);
    
    // Flatten nested objects for CSV
    const flattenedData = data.map(item => this.flattenObject(item));
    
    return stringify(flattenedData, {
      header: true,
      columns: Object.keys(flattenedData[0] || {}),
    });
  }

  public async exportToJSON(
    userId: string,
    entities: string[],
    dateRange: DateRange
  ): Promise<ExportResult> {
    const result: { [key: string]: any[] } = {};
    
    for (const entity of entities) {
      result[entity] = await this.fetchData(userId, entity, dateRange);
    }

    return {
      data: result,
      metadata: {
        generatedAt: new Date().toISOString(),
        format: 'json',
        recordCount: Object.values(result).reduce((acc, arr) => acc + arr.length, 0),
      },
    };
  }

  private flattenObject(obj: any, prefix = ''): any {
    return Object.keys(obj).reduce((acc: any, k: string) => {
      const pre = prefix.length ? prefix + '.' : '';
      if (
        typeof obj[k] === 'object' &&
        obj[k] !== null &&
        !(obj[k] instanceof Date) &&
        !Array.isArray(obj[k])
      ) {
        Object.assign(acc, this.flattenObject(obj[k], pre + k));
      } else {
        acc[pre + k] = Array.isArray(obj[k]) ? JSON.stringify(obj[k]) : obj[k];
      }
      return acc;
    }, {});
  }

  public async validateDateRange(dateRange: unknown): Promise<DateRange> {
    return DateRangeSchema.parse(dateRange);
  }

  public async validateExportOptions(options: unknown): Promise<ExportOptions> {
    return ExportOptionsSchema.parse(options);
  }
}

export const exportService = ExportService.getInstance(); 