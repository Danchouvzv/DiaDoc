import { DateRange } from './export-service';
import { exportService } from './export-service';

// Типы данных для PDF
interface PDFData {
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

/**
 * Сервис для генерации PDF-отчетов с данными о здоровье
 */
class PDFService {
  private static instance: PDFService;

  private constructor() {}

  public static getInstance(): PDFService {
    if (!PDFService.instance) {
      PDFService.instance = new PDFService();
    }
    return PDFService.instance;
  }

  /**
   * Генерирует HTML-разметку для PDF-отчета
   */
  private generateHTML(data: PDFData): string {
    const { dateRange, userId, data: healthData, insights } = data;
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Health Report</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          .header { text-align: center; margin-bottom: 20px; }
          .title { font-size: 24px; font-weight: bold; margin-bottom: 5px; }
          .subtitle { font-size: 18px; margin-bottom: 15px; }
          .section { margin-bottom: 20px; }
          .table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          .table th, .table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          .table th { background-color: #f2f2f2; }
          .insights { background-color: #f9f9f9; padding: 10px; border-radius: 5px; }
          .insights-item { margin-bottom:. 5px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="title">DiaDoc Health Report</div>
          <div class="subtitle">Period: ${dateRange.from} to ${dateRange.to}</div>
          <div>User: ${userId}</div>
        </div>
        
        <div class="section">
          <h2>Glucose Readings</h2>
          <table class="table">
            <tr>
              <th>Time</th>
              <th>Value (mg/dL)</th>
            </tr>
            ${healthData.glucose.slice(0, 10).map(reading => `
              <tr>
                <td>${reading.timestamp}</td>
                <td>${reading.value}</td>
              </tr>
            `).join('')}
          </table>
          
          <div class="insights">
            <h3>AI Insights - Glucose</h3>
            <ul>
              ${insights.glucoseInsights.map(insight => `
                <li class="insights-item">${insight}</li>
              `).join('')}
            </ul>
          </div>
        </div>
        
        <div class="section">
          <h2>Food Log</h2>
          <table class="table">
            <tr>
              <th>Time</th>
              <th>Food</th>
              <th>Carbs (g)</th>
            </tr>
            ${healthData.food.slice(0, 10).map(entry => `
              <tr>
                <td>${entry.timestamp}</td>
                <td>${entry.name}</td>
                <td>${entry.carbs || '-'}</td>
              </tr>
            `).join('')}
          </table>
        </div>
        
        <div class="section">
          <h2>Activity Log</h2>
          <table class="table">
            <tr>
              <th>Date</th>
              <th>Activity</th>
              <th>Duration</th>
            </tr>
            ${healthData.activity.slice(0, 10).map(entry => `
              <tr>
                <td>${entry.date}</td>
                <td>${entry.type}</td>
                <td>${entry.duration} min</td>
              </tr>
            `).join('')}
          </table>
        </div>
        
        <div class="section">
          <h2>Wellbeing Data</h2>
          <table class="table">
            <tr>
              <th>Date</th>
              <th>Metric</th>
              <th>Value</th>
            </tr>
            ${healthData.wellbeing.slice(0, 10).map(entry => `
              <tr>
                <td>${entry.date}</td>
                <td>${entry.metric}</td>
                <td>${entry.value}</td>
              </tr>
            `).join('')}
          </table>
        </div>
        
        <div class="footer">
          <p>© ${new Date().getFullYear()} DiaDoc - Generated on ${new Date().toLocaleString()}</p>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Генерирует PDF-отчет для указанного пользователя за выбранный период
   */
  public async generateReport(userId: string, dateRange: DateRange): Promise<Buffer> {
    try {
      // Загружаем данные из базы
      const exportData = await exportService.exportToJSON(
        userId,
        ['glucose', 'food', 'activity', 'wellbeing'],
        dateRange
      );

      // Генерируем примерные инсайты (в реальном приложении здесь будет логика AI)
      const insights = {
        glucoseInsights: [
          'Средний уровень глюкозы в пределах нормы',
          'Обнаружены 2 случая гипогликемии за выбранный период',
          'Уровень глюкозы наиболее стабилен в первой половине дня'
        ],
        foodInsights: [
          'Рекомендуется увеличить потребление белка',
          'Потребление углеводов в пределах нормы'
        ],
        activityInsights: [
          'Физическая активность ниже рекомендуемой нормы',
          'Наблюдается положительная динамика в регулярности упражнений'
        ],
        wellbeingInsights: [
          'Качество сна улучшилось за последнюю неделю',
          'Уровень стресса выше среднего'
        ]
      };

      // Составляем данные для отчета
      const pdfData: PDFData = {
        userId,
        dateRange,
        data: exportData.data,
        insights
      };

      // Генерируем HTML для PDF
      const html = this.generateHTML(pdfData);

      // В реальном приложении здесь был бы код для преобразования HTML в PDF
      // Например, с использованием puppeteer или html-pdf
      
      // Пока возвращаем HTML в виде буфера
      return Buffer.from(html);
    } catch (error) {
      console.error('Error generating PDF report:', error);
      throw new Error('Failed to generate PDF report');
    }
  }
}

export const pdfService = PDFService.getInstance(); 