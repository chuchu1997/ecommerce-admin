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
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId") || undefined;
    const isFeatured = searchParams.get("isFeatured");

    if (!storeId) {
      return new NextResponse("Store Id is required ", { status: 400 });
    }

    const products = await prismadb.product.findMany({
      where: {
        storeId: storeId,
        categoryId,
        isFeatured: isFeatured ? true : undefined,
        isArchived: false,
      },
      include: {
        images: true,
        category: true,
      },
      orderBy: {
        createAt: "desc",
      },
    });

    return NextResponse.json(products, { status: 200 });
  } catch (err) {
    console.log("[PRODUCTS_GET]", err);
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

    const {
      name,
      categoryId,
      price,
      images,
      isFeatured,
      isArchived,
      description,
      shortDescription,
      slug,
      sku,
      stockQuantity,
      viewCount,
      ratingCount,
    } = body;

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!categoryId) {
      return new NextResponse("Billboard ID is required", { status: 400 });
    }

    if (!storeId) {
      return new NextResponse("Store Id is required ", { status: 400 });
    }
    if (!price) {
      return new NextResponse("Billboard ID is required", { status: 400 });
    }
    if (!images || !images.length) {
      return new NextResponse("Images is required", { status: 400 });
    }

    if (!description) {
      return new NextResponse("Billboard ID is required", { status: 400 });
    }

    if (!shortDescription) {
      return new NextResponse("Billboard ID is required", { status: 400 });
    }
    if (!slug) {
      return new NextResponse("Billboard ID is required", { status: 400 });
    }
    if (!sku) {
      return new NextResponse("Billboard ID is required", { status: 400 });
    }
    if (!stockQuantity) {
      return new NextResponse("Billboard ID is required", { status: 400 });
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

    const product = await prismadb.product.create({
      data: {
        description,
        shortDescription,
        sku,
        slug,
        stockQuantity,
        name,
        price,
        isFeatured,
        isArchived,
        categoryId,
        viewCount,
        ratingCount,
        storeId: storeId,
        images: {
          createMany: {
            data: [...images.map((image: { url: string }) => image)],
          },
        },
      },
    });
    // const category = await prismadb.category.create({
    //   data: {
    //     name: name,
    //     billboardId: billboardId,
    //     storeId: storeId,
    //   },
    // });

    return NextResponse.json(product, { status: 200 });
  } catch (err) {
    console.log("[PRODUCT_POST]", err);
    return new NextResponse("Interal error", { status: 500 });
  }
}
