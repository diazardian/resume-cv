import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { contactMessages } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = contactSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: result.error.issues },
        { status: 400 }
      );
    }

    const { name, email, subject, message } = result.data;

    const inserted = await db
      .insert(contactMessages)
      .values({ name, email, subject, message })
      .returning();

    return NextResponse.json(
      { success: true, message: 'Message sent successfully', data: inserted[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const readFilter = searchParams.get('read');

    const baseQuery = db
      .select()
      .from(contactMessages)
      .orderBy(desc(contactMessages.createdAt));

    let messages;
    if (readFilter === 'true') {
      messages = await baseQuery.where(eq(contactMessages.read, true));
    } else if (readFilter === 'false') {
      messages = await baseQuery.where(eq(contactMessages.read, false));
    } else {
      messages = await baseQuery;
    }

    return NextResponse.json({
      messages,
      total: messages.length,
      unread: messages.filter((m) => !m.read).length,
    });
  } catch (error) {
    console.error('Failed to fetch messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}
