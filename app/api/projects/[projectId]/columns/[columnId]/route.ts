import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { projectId: string; columnId: string } },
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const column = await prisma.column.findUnique({
      where: { id: params.columnId, projectId: params.projectId },
      include: { tasks: true },
    });

    if (!column) {
      return NextResponse.json(
        { message: "Column not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(column);
  } catch (error) {
    console.error(
      "GET /api/projects/[projectId]/columns/[columnId] - Error:",
      error,
    );
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { projectId: string; columnId: string } },
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { title, order } = await req.json();

    const updatedColumn = await prisma.column.update({
      where: { id: params.columnId, projectId: params.projectId },
      data: { title, order },
    });

    return NextResponse.json(updatedColumn);
  } catch (error) {
    console.error(
      "PUT /api/projects/[projectId]/columns/[columnId] - Error:",
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
  { params }: { params: { projectId: string; columnId: string } },
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await prisma.column.delete({
      where: { id: params.columnId, projectId: params.projectId },
    });

    return NextResponse.json({ message: "Column deleted successfully" });
  } catch (error) {
    console.error(
      "DELETE /api/projects/[projectId]/columns/[columnId] - Error:",
      error,
    );
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
