/** @format */

import { getCurrentUser } from "@/lib/auth/utils";
import prismadb from "@/lib/primadb";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,

  { params }: { params: { sizeId: string } }
) {
  try {
    const { sizeId } = await params;

    if (!sizeId) {
      return new NextResponse("Size Id is required ", { status: 400 });
    }

    // const billboards = await prismadb.billboard.findUnique({
    //   where: {
    //     id: billboardId,
    //   },
    // });
    const size = await prismadb.size.findUnique({
      where: {
        id: sizeId,
      },
    });

    return NextResponse.json(size, { status: 200 });
  } catch (err) {
    console.log("[SIZE_ID_GET]", err);
    return new NextResponse("Interal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; sizeId: string } }
) {
  try {
    const user = await getCurrentUser();
    const body = await req.json();
    const { name, description } = body;

    const { storeId, sizeId } = await params;
    if (!user) {
      return new NextResponse("Unauthenticaed", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }
    if (!sizeId) {
      return new NextResponse("SizeID id is required", { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        userID: user.id,
      },
    });
    if (!storeByUserId) {
      return new NextResponse("Forbiden", { status: 403 });
    }

    const sizeUpdate = await prismadb.size.updateMany({
      where: {
        id: sizeId,
        storeId: storeId,
      },
      data: {
        name,
        description,
      },
    });
    return NextResponse.json(sizeUpdate);
    // return NextResponse.json(store);
  } catch (err) {
    console.log("[SIZE_PATCH]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; sizeId: string } }
) {
  try {
    const user = await getCurrentUser();

    const { storeId, sizeId } = await params;

    if (!user) {
      return new NextResponse("Unauthenticaed", { status: 401 });
    }

    if (!storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }
    if (!sizeId) {
      return new NextResponse("SIZE id is required", { status: 400 });
    }
    const storeByUserId = await prismadb.store.findFirst({
      where: {
        userID: user.id,
      },
    });
    if (!storeByUserId) {
      return new NextResponse("Forbiden", { status: 403 });
    }

    const sizeDelete = await prismadb.size.deleteMany({
      where: {
        id: sizeId,
        storeId: storeId,
      },
    });
    return NextResponse.json(sizeDelete);
  } catch (err) {
    console.log("[SIZE_DELETE]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}
