/** @format */

import { getCurrentUser } from "@/lib/auth/utils";
import prismadb from "@/lib/primadb";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,

  { params }: { params: { storeId: string } }
) {
  try {
    const { storeId } = await params;

    if (!storeId) {
      return new NextResponse("Store Id is required ", { status: 400 });
    }

    const categories = await prismadb.category.findMany({
      where: {
        storeId: storeId,
      },
      include: {
        subcategories: true,
      },
    });

    return NextResponse.json(categories, { status: 200 });
  } catch (err) {
    console.log("[CATEGORIES_GET]", err);
    return new NextResponse("Interal error", { status: 500 });
  }
}

export async function POST(
  req: Request,

  { params }: { params: { storeId: string } }
) {
  try {
    const { storeId } = await params;

    const user = await getCurrentUser();

    const body = await req.json();

    const { billboardId, name, slugData } = body;

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!billboardId) {
      return new NextResponse("Billboard ID is required", { status: 400 });
    }
    if (!name) {
      return new NextResponse("Name  is required", { status: 400 });
    }
    if (!storeId) {
      return new NextResponse("Store Id is required ", { status: 400 });
    }
    if (!slugData) {
      return new NextResponse("Slug is required", { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: storeId,
        userID: user.id,
      },
    });
    if (!storeByUserId) {
      return new NextResponse("Forbiden ", { status: 403 });
    }

    const category = await prismadb.category.create({
      data: {
        slug: slugData,
        name: name,
        billboardId: billboardId,
        storeId: storeId,
      },
    });

    return NextResponse.json(category, { status: 200 });
  } catch (err) {
    console.log("[CATEGORY_POST]", err);
    return new NextResponse("Interal error", { status: 500 });
  }
}
