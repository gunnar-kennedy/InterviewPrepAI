import { NextResponse } from 'next/server';
import { StreamingAvatar, TaskType } from '@heygen/streaming-avatar';

export async function POST(req: Request) {
  const { sessionId, text } = await req.json();

  const avatar = new StreamingAvatar({
    token: process.env.HEYGEN_API_TOKEN || '',
  });

  try {
    await avatar.speak({
      sessionId,
      text,
      task_type: TaskType.SINGLE,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
