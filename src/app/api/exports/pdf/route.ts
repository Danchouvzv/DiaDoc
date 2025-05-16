import { NextRequest, NextResponse } from 'next/server';
import { exportService } from '@/lib/export/export-service';
import { pdfService } from '@/lib/export/pdf-service';
// Удаляем импорт Clerk

export async function GET(req: NextRequest) {
  try {
    // Временная заглушка для демонстрации
    // В реальном приложении здесь должна быть проверка авторизации через Firebase
    const userId = "demo-user-123"; // Временный идентификатор пользователя для тестирования
    
    // Get query parameters
    const searchParams = req.nextUrl.searchParams;
    const from = searchParams.get('from');
    const to = searchParams.get('to');
    const entities = searchParams.get('entities')?.split(',') || ['glucose', 'food', 'activity', 'wellbeing'];

    // Логируем информацию для отладки
    console.log(`PDF Export request for: ${from} to ${to}, entities: ${entities.join(', ')}`);

    if (!from || !to) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Validate date range
    const dateRange = await exportService.validateDateRange({ from, to });

    // Generate PDF
    const pdfBuffer = await pdfService.generateReport(userId, dateRange);

    // Set headers for file download
    const headers = new Headers();
    headers.set('Content-Type', 'application/pdf');
    headers.set(
      'Content-Disposition',
      `attachment; filename="health-report-${from}-to-${to}.pdf"`
    );

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers,
    });
  } catch (error: any) {
    console.error('PDF export error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: error.status || 500 }
    );
  }
} 