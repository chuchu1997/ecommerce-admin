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

    const billboards = await prismadb.billboard.findMany({
      where: {
        id: storeId,
      },
    });

    return NextResponse.json(billboards, { status: 200 });
  } catch (err) {
    console.log("[BILLBOARDS_POST]", err);
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

    const { label, imageUrl } = body;

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!label) {
      return new NextResponse("Label is required", { status: 400 });
    }
    if (!imageUrl) {
      return new NextResponse("Image Url is required", { status: 400 });
    }
    if (!storeId) {
      return new NextResponse("Store Id is required ", { status: 400 });
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

    const billboard = await prismadb.billboard.create({
      data: {
        label,
        imageUrl,
        storeId: storeId,
      },
    });

    return NextResponse.json(billboard, { status: 200 });
  } catch (err) {
    console.log("[BILLBOARDS_POST]", err);
    return new NextResponse("Interal error", { status: 500 });
  }
}
