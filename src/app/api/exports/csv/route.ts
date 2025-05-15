import { NextRequest, NextResponse } from 'next/server';
import { exportService } from '@/lib/export/export-service';
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
    const entity = searchParams.get('entity');
    const from = searchParams.get('from');
    const to = searchParams.get('to');

    if (!entity || !from || !to) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Validate date range
    const dateRange = await exportService.validateDateRange({ from, to });

    // Generate CSV
    const csv = await exportService.exportToCSV(userId, entity, dateRange);

    // Set headers for file download
    const headers = new Headers();
    headers.set('Content-Type', 'text/csv');
    headers.set(
      'Content-Disposition',
      `attachment; filename="${entity}-${from}-to-${to}.csv"`
    );

    return new NextResponse(csv, {
      status: 200,
      headers,
    });
  } catch (error: any) {
    console.error('CSV export error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: error.status || 500 }
    );
  }
} 