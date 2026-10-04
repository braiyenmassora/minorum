import { type NextRequest, NextResponse } from "next/server";

import { hasGateCookie } from "@/lib/core/auth/gate-cookie";
import { isProduction } from "@/lib/env";
import { clearSessions, listSessions } from "@/lib/services/chat-session-db";

async function isAuthorized(request: NextRequest): Promise<boolean> {
  if (!isProduction()) {
    return true;
  }
  return hasGateCookie(request);
}

export async function GET(request: NextRequest) {
  if (!(await isAuthorized(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const sessions = await listSessions();
    return NextResponse.json({ sessions });
  } catch {
    return NextResponse.json(
      { error: "Failed to list sessions" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  if (!(await isAuthorized(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await clearSessions();
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to clear sessions" },
      { status: 500 },
    );
  }
}
