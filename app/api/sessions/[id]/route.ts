import { type NextRequest, NextResponse } from "next/server";

import { hasGateCookie } from "@/lib/core/auth/gate-cookie";
import { isProduction } from "@/lib/env";
import { titleFromMessages } from "@/lib/models/chat-session";
import type { Message } from "@/lib/models/message";
import {
  deleteSession,
  getSession,
  setSessionPinned,
  upsertSession,
} from "@/lib/services/chat-session-db";

type RouteContext = {
  params: Promise<{ id: string }>;
};

async function isAuthorized(request: NextRequest): Promise<boolean> {
  if (!isProduction()) {
    return true;
  }
  return hasGateCookie(request);
}

export async function GET(request: NextRequest, context: RouteContext) {
  if (!(await isAuthorized(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  try {
    const session = await getSession(id);
    if (!session) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ session });
  } catch {
    return NextResponse.json(
      { error: "Failed to load session" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest, context: RouteContext) {
  if (!(await isAuthorized(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  let messages: Message[];
  try {
    const body = (await request.json()) as { messages?: unknown };
    if (!Array.isArray(body.messages)) {
      throw new Error("invalid messages");
    }
    messages = body.messages as Message[];
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  if (messages.length === 0) {
    return NextResponse.json({ error: "Empty messages" }, { status: 400 });
  }

  try {
    const session = await upsertSession({
      id,
      title: titleFromMessages(messages),
      messages,
    });
    return NextResponse.json({ session });
  } catch {
    return NextResponse.json(
      { error: "Failed to save session" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  if (!(await isAuthorized(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  let pinned: boolean;
  try {
    const body = (await request.json()) as { pinned?: unknown };
    if (typeof body.pinned !== "boolean") {
      throw new Error("invalid pinned");
    }
    pinned = body.pinned;
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  try {
    const session = await setSessionPinned(id, pinned);
    if (!session) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ session });
  } catch {
    return NextResponse.json(
      { error: "Failed to update session" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  if (!(await isAuthorized(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  try {
    await deleteSession(id);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete session" },
      { status: 500 },
    );
  }
}
