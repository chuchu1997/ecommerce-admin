/** @format */

import { getCurrentUser } from "@/lib/auth/utils";
import prismadb from "@/lib/primadb";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,

  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = await params;
    if (!slug) {
      return new NextResponse("SERVICE SLUG is required ", { status: 400 });
    }
    const service = await prismadb.service.findUnique({
      where: {
        slug: slug,
      },
      include: {
        images: true,
        category: true,
        subcategory: true,
      },
    });
    return NextResponse.json(service, { status: 200 });
  } catch (err) {
    console.log("[SERVICE_GET_IDw]", err);
    return new NextResponse("Interal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; slug: string } }
) {
  try {
    const user = await getCurrentUser();
    const body = await req.json();
    const {
      name,
      categoryId,
      price,
      images,
      description,
      subCategoryId,
      slugData,
    } = body;
    const { storeId, slug } = await params;

    console.log("SLUG", slug);
    console.log("SLUGDATA", slugData);

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!categoryId) {
      return new NextResponse("category ID is required", { status: 400 });
    }

    if (!storeId) {
      return new NextResponse("Store Id is required ", { status: 400 });
    }

    if (!images || !images.length) {
      return new NextResponse("Images is required", { status: 400 });
    }

    if (!description) {
      return new NextResponse("Billboard ID is required", { status: 400 });
    }

    if (!slug) {
      return new NextResponse("Billboard ID is required", { status: 400 });
    }

    const storeByUserId = await prismadb.store.findMany({
      where: {
        id: storeId,
        userID: user.id,
      },
    });
    if (!storeByUserId) {
      return new NextResponse("Forbinden", { status: 403 });
    }

    await prismadb.service.update({
      where: {
        slug: slug,
      },
      data: {
        description,
        slug: slug,
        name,
        price: price ?? 0,
        subcategoryId: subCategoryId ?? null,
        categoryId,
        storeId: storeId,
        images: {
          deleteMany: {},
        },
        // images: {
        //   deleteMany: {},
        // },
      },
    });

    console.log("HELLO !!");

    const service = await prismadb.service.update({
      where: {
        slug: slug,
      },
      data: {
        description,

        slug: slugData,

        name,
        price: price ?? 0,
        subcategoryId: subCategoryId ?? null,

        categoryId,

        storeId: storeId,
        images: {
          createMany: {
            data: [...images.map((image: { url: string }) => image)],
          },
        },
      },
    });
    return NextResponse.json(service);
    // return NextResponse.json(store);
  } catch (err) {
    console.log("[SERVICE_PATCH]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; slug: string } }
) {
  try {
    const user = await getCurrentUser();

    const { storeId, slug } = await params;

    if (!user) {
      return new NextResponse("Unauthenticaed", { status: 401 });
    }

    if (!storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }
    if (!slug) {
      return new NextResponse("Slug id is required", { status: 400 });
    }
    const storeByUserId = await prismadb.store.findFirst({
      where: {
        userID: user.id,
      },
    });
    if (!storeByUserId) {
      return new NextResponse("Forbiden", { status: 403 });
    }

    const service = await prismadb.service.deleteMany({
      where: {
        slug: slug,
        storeId: storeId,
      },
    });
    return NextResponse.json(service);
  } catch (err) {
    console.log("[STORE_DELETE]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}
