import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { newsletterSubscriptions } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { z } from 'zod';

const subscribeSchema = z.object({
  email: z.string().email('Please enter a valid email'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = subscribeSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: result.error.issues },
        { status: 400 }
      );
    }

    const { email } = result.data;

    const existing = await db
      .select()
      .from(newsletterSubscriptions)
      .where(eq(newsletterSubscriptions.email, email))
      .limit(1);

    if (existing.length > 0) {
      if (existing[0].subscribed) {
        return NextResponse.json(
          { error: 'This email is already subscribed' },
          { status: 409 }
        );
      }

      await db
        .update(newsletterSubscriptions)
        .set({ subscribed: true })
        .where(eq(newsletterSubscriptions.email, email));

      return NextResponse.json(
        { success: true, message: 'Successfully re-subscribed to newsletter' },
        { status: 200 }
      );
    }

    const inserted = await db
      .insert(newsletterSubscriptions)
      .values({ email, subscribed: true })
      .returning();

    return NextResponse.json(
      { success: true, message: 'Successfully subscribed to newsletter', data: inserted[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to process subscription' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const subscriptions = await db
      .select()
      .from(newsletterSubscriptions)
      .where(eq(newsletterSubscriptions.subscribed, true))
      .orderBy(desc(newsletterSubscriptions.createdAt));

    return NextResponse.json({
      subscriptions,
      total: subscriptions.length,
    });
  } catch (error) {
    console.error('Failed to fetch subscriptions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subscriptions' },
      { status: 500 }
    );
  }
}
