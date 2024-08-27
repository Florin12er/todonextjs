import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
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

    const body = await req.json();
    const { title, columnId, dueDate, completed, description } = body;

    // Find the first column if columnId is not provided
    let targetColumnId = columnId;
    if (!targetColumnId) {
      const firstColumn = await prisma.column.findFirst({
        where: { projectId: params.projectId },
        orderBy: { order: "asc" },
      });
      if (!firstColumn) {
        // If no columns exist, create a default column
        const defaultColumn = await prisma.column.create({
          data: {
            title: "To Do",
            order: 0,
            projectId: params.projectId,
          },
        });
        targetColumnId = defaultColumn.id;
      } else {
        targetColumnId = firstColumn.id;
      }
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        dueDate: dueDate ? new Date(dueDate) : null,
        completed: completed || false,
        isToday: false, // Set a default value
        userId,
        projectId: params.projectId,
        columnId: targetColumnId,
      },
    });

    return NextResponse.json(task);
  } catch (error) {
    console.error("POST /api/projects/[projectId]/tasks - Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: (error as Error).message },
      { status: 500 },
    );
  }
}
