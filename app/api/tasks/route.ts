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
    const { title, description, projectId, dueDate, isToday, columnId } = body;

    if (!title) {
      return NextResponse.json(
        { message: "Title is required" },
        { status: 400 },
      );
    }

    let targetColumnId = columnId;

    // If projectId is provided but columnId is not, find or create a default column
    if (projectId && !targetColumnId) {
      const project = await prisma.project.findUnique({
        where: { id: projectId },
        include: { columns: { orderBy: { order: "asc" } } },
      });

      if (project) {
        if (project.columns.length > 0) {
          targetColumnId = project.columns[0].id;
        } else {
          // Create a default column if the project has no columns
          const defaultColumn = await prisma.column.create({
            data: {
              title: "To Do",
              order: 0,
              projectId: projectId,
            },
          });
          targetColumnId = defaultColumn.id;
        }
      }
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        dueDate: dueDate ? new Date(dueDate) : null,
        isToday,
        userId,
        projectId: projectId || null,
        columnId: targetColumnId,
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
