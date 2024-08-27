import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function PUT(
  req: NextRequest,
  { params }: { params: { projectId: string; taskId: string } },
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, description, dueDate, completed, isToday, columnId, order } =
      body;

    const updatedTask = await prisma.task.update({
      where: { id: params.taskId, projectId: params.projectId },
      data: {
        title,
        description,
        dueDate: dueDate ? new Date(dueDate) : null,
        completed,
        isToday,
        columnId,
        order,
      },
    });

    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error(
      "PUT /api/projects/[projectId]/tasks/[taskId] - Error:",
      error,
    );
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { projectId: string; taskId: string } },
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await prisma.task.delete({
      where: { id: params.taskId, userId },
    });

    return NextResponse.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error(
      "DELETE /api/projects/[projectId]/tasks/[taskId] - Error:",
      error,
    );
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
