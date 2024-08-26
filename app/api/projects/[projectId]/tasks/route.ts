import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import Task from "@/types/task";
import prisma from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: { projectId: string } },
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body: Omit<Task, "id"> = await req.json();
    const { title, columnId, dueDate, completed, description } = body;

    // Find the first column if columnId is not provided
    let targetColumnId = columnId;
    if (!targetColumnId) {
      const firstColumn = await prisma.column.findFirst({
        where: { projectId: params.projectId },
        orderBy: { order: "asc" },
      });
      if (!firstColumn) {
        return NextResponse.json(
          { message: "No columns found in the project" },
          { status: 400 },
        );
      }
      targetColumnId = firstColumn.id;
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        dueDate: dueDate ? new Date(dueDate) : null,
        completed,
        userId,
        projectId: params.projectId,
        columnId: targetColumnId,
      },
    });

    return NextResponse.json(task);
  } catch (error) {
    console.error("POST /api/projects/[projectId]/tasks - Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
