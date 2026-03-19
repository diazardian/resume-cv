import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { pageViews } from '@/db/schema';
import { eq, sql, and, gte, lt } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { path, referrer, userAgent } = body;

    if (!path) {
      return NextResponse.json(
        { error: 'Path is required' },
        { status: 400 }
      );
    }

    const device = userAgent?.includes('Mobile') ? 'mobile' : 'desktop';

    const inserted = await db
      .insert(pageViews)
      .values({
        path,
        referrer: referrer || null,
        userAgent: userAgent || null,
        device,
      })
      .returning();

    return NextResponse.json(
      { success: true, view: inserted[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error('Page view error:', error);
    return NextResponse.json(
      { error: 'Failed to track page view' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '7d';
    const path = searchParams.get('path');

    let startDate: Date;
    const now = new Date();

    switch (period) {
      case '24h':
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    const conditions = [gte(pageViews.createdAt, startDate)];
    if (path) {
      conditions.push(eq(pageViews.path, path));
    }

    const baseWhere = and(...conditions);

    const totalViews = await db
      .select({ count: sql<number>`count(*)` })
      .from(pageViews)
      .where(baseWhere);

    const uniqueVisitors = await db
      .select({ count: sql<number>`count(distinct ${pageViews.userAgent})` })
      .from(pageViews)
      .where(baseWhere);

    const viewsByPath = await db
      .select({
        path: pageViews.path,
        count: sql<number>`count(*)`.as('count'),
      })
      .from(pageViews)
      .where(baseWhere)
      .groupBy(pageViews.path)
      .orderBy(sql<number>`count(*) desc`);

    const viewsByDevice = await db
      .select({
        device: pageViews.device,
        count: sql<number>`count(*)`.as('count'),
      })
      .from(pageViews)
      .where(baseWhere)
      .groupBy(pageViews.device);

    return NextResponse.json({
      period,
      totalViews: totalViews[0]?.count || 0,
      uniqueVisitors: uniqueVisitors[0]?.count || 0,
      viewsByPath,
      viewsByDevice,
    });
  } catch (error) {
    console.error('Failed to fetch analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
