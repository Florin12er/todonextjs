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

    const columns = await prisma.column.findMany({
      where: { projectId: params.projectId },
      orderBy: { order: "asc" },
      include: { tasks: true },
    });

    return NextResponse.json(columns);
  } catch (error) {
    console.error("GET /api/projects/[projectId]/columns - Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { projectId: string } },
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { title, order } = await req.json();

    const column = await prisma.column.create({
      data: {
        title,
        order,
        projectId: params.projectId,
      },
    });

    return NextResponse.json(column);
  } catch (error) {
    console.error("POST /api/projects/[projectId]/columns - Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
