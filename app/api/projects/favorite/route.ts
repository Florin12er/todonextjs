import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const favoriteProjects = await prisma.project.findMany({
      where: {
        userId: userId,
        isFavorite: true, // Only get favorite projects
      },
      include: {
        tasks: {
          select: {
            id: true,
            completed: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(favoriteProjects);
  } catch (error) {
    console.error("GET /api/projects/favorite - Error:", error);
    if (error instanceof Error) {
      return NextResponse.json(
        { message: "Internal Server Error", error: error.message },
        { status: 500 },
      );
    } else {
      return NextResponse.json(
        { message: "Internal Server Error" },
        { status: 500 },
      );
    }
  }
}
