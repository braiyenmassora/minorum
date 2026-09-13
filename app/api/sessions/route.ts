import { NextResponse } from "next/server";

import { clearSessions, listSessions } from "@/lib/services/chat-session-db";

export async function GET() {
  try {
    const sessions = await listSessions();
    return NextResponse.json({ sessions });
  } catch {
    return NextResponse.json({ error: "Failed to list sessions" }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    await clearSessions();
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to clear sessions" }, { status: 500 });
  }
}
