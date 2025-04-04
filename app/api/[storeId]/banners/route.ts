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

    const banners = await prismadb.billboard.findMany({
      where: {
        storeId: storeId,
        isActiveBanner: true,
      },
    });

    return NextResponse.json(banners, { status: 200 });
  } catch (err) {
    console.log("[BANNER_GET]", err);
    return new NextResponse("Interal error", { status: 500 });
  }
}
