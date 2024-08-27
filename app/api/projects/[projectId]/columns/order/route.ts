import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function PUT(
  req: NextRequest,
  { params }: { params: { projectId: string } },
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { order } = await req.json();

    if (!Array.isArray(order)) {
      return NextResponse.json(
        { message: "Invalid order data" },
        { status: 400 },
      );
    }

    // Update the order of columns
    await prisma.$transaction(
      order.map((columnId, index) =>
        prisma.column.update({
          where: { id: columnId, projectId: params.projectId },
          data: { order: index },
        }),
      ),
    );

    return NextResponse.json({ message: "Column order updated successfully" });
  } catch (error) {
    console.error(
      "PUT /api/projects/[projectId]/columns/order - Error:",
      error,
    );
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
