import { NextResponse } from 'next/server';
import { StreamingAvatar } from '@heygen/streaming-avatar';

export async function POST() {
  const avatar = new StreamingAvatar({
    token: process.env.HEYGEN_API_TOKEN || '',
  });

  try {
    const session = await avatar.createStartAvatar({
      avatarName: 'MyAvatar',
      quality: 'high',
    });

    return NextResponse.json(session);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
