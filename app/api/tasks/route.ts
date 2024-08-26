import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, description, projectId, dueDate, isToday } = body;

    if (!title) {
      return NextResponse.json(
        { message: "Title is required" },
        { status: 400 },
      );
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        status: "TODO",
        dueDate: dueDate ? new Date(dueDate) : null,
        isToday,
        userId,
        projectId: projectId || null,
      },
    });

    return NextResponse.json(task);
  } catch (error) {
    console.error("POST /api/tasks - Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
