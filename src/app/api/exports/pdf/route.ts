import { NextRequest, NextResponse } from 'next/server';
import { exportService } from '@/lib/export/export-service';
import { pdfService } from '@/lib/export/pdf-service';
import { getAuth } from '@clerk/nextjs/server';

export async function GET(req: NextRequest) {
  try {
    // Get user session
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get query parameters
    const searchParams = req.nextUrl.searchParams;
    const from = searchParams.get('from');
    const to = searchParams.get('to');

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