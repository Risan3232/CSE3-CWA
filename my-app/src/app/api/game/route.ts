import { NextRequest, NextResponse } from "next/server";

// Temporary in-memory storage (replace with database in Week 7)
let gameSessions: any[] = [];

// POST: Create a new game session (e.g., save timer, messages, stage, output)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json(); // Expect { timer: number, messages: string[], stage: number, output?: string }
    const newSession = {
      id: Date.now(), // Simple ID (use UUID in production)
      ...body,
      createdAt: new Date().toISOString(),
    };
    gameSessions.push(newSession);
    return NextResponse.json(newSession, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create session" }, { status: 500 });
  }
}

// GET: Read all game sessions (e.g., for loading previous games)
export async function GET() {
  try {
    return NextResponse.json(gameSessions);
  } catch (error) {
    return NextResponse.json({ error: "Failed to retrieve sessions" }, { status: 500 });
  }
}

// PUT: Update an existing session (e.g., modify messages or output)
export async function PUT(req: NextRequest) {
  try {
    const { id, ...updates } = await req.json();
    const sessionIndex = gameSessions.findIndex(s => s.id === id);
    if (sessionIndex === -1) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }
    gameSessions[sessionIndex] = { ...gameSessions[sessionIndex], ...updates };
    return NextResponse.json(gameSessions[sessionIndex]);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update session" }, { status: 500 });
  }
}

// DELETE: Delete a session (e.g., remove old games)
export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    gameSessions = gameSessions.filter(s => s.id !== id);
    return NextResponse.json({ message: "Session deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete session" }, { status: 500 });
  }
}
