import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const projects = await prisma.project.findMany({
      where: {
        userId: userId,
        isFavorite: false, // Exclude favorite projects
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

    return NextResponse.json(projects);
  } catch (error) {
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

export async function POST(req: NextRequest) {
  try {
    const { userId } = auth();
    const user = await currentUser();

    if (!userId || !user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, color, isFavorite, design } = body;

    if (!name) {
      return NextResponse.json(
        { message: "Name is required" },
        { status: 400 },
      );
    }

    let dbUser = await prisma.user.findUnique({ where: { id: userId } });

    if (!dbUser) {
      dbUser = await prisma.user.create({
        data: {
          id: userId,
          email: user.emailAddresses[0].emailAddress,
          name: `${user.firstName} ${user.lastName}`.trim(),
        },
      });
    }

    const project = await prisma.project.create({
      data: {
        name,
        color: color || "#808080",
        isFavorite: isFavorite || false,
        design: design || "LIST",
        userId: dbUser.id,
      },
    });

    return NextResponse.json(project);
  } catch (error) {
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
