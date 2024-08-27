import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { projectId: string } },
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const project = await prisma.project.findUnique({
      where: { id: params.projectId, userId },
      include: {
        columns: {
          include: {
            tasks: true,
          },
          orderBy: {
            order: "asc",
          },
        },
      },
    });

    if (!project) {
      return NextResponse.json(
        { message: "Project not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error("GET /api/projects/[projectId] - Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
export async function DELETE(
  req: NextRequest,
  { params }: { params: { projectId: string } },
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const projectId = params.projectId;

    // Check if the project belongs to the user
    const project = await prisma.project.findUnique({
      where: { id: projectId, userId },
    });

    if (!project) {
      return NextResponse.json(
        { message: "Project not found" },
        { status: 404 },
      );
    }

    // Use a transaction to ensure all operations are performed or none
    await prisma.$transaction(async (prisma) => {
      // Delete all tasks associated with the project
      await prisma.task.deleteMany({
        where: { projectId },
      });

      // Delete all columns associated with the project
      await prisma.column.deleteMany({
        where: { projectId },
      });

      // Delete the project
      await prisma.project.delete({
        where: { id: projectId },
      });
    });

    return NextResponse.json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/projects/[projectId] - Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
