/** @format */

import { getCurrentUser } from "@/lib/auth/utils";
import prismadb from "@/lib/primadb";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,

  { params }: { params: { productId: string } }
) {
  try {
    const { productId } = await params;

    if (!productId) {
      return new NextResponse("Product Id is required ", { status: 400 });
    }

    const product = await prismadb.product.findUnique({
      where: {
        id: productId,
      },
    });

    return NextResponse.json(product, { status: 200 });
  } catch (err) {
    console.log("[PRODUCT_GET_ID]", err);
    return new NextResponse("Interal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; productId: string } }
) {
  try {
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
    const { storeId, productId } = await params;
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

    const storeByUserId = await prismadb.store.findMany({
      where: {
        id: storeId,
        userID: user.id,
      },
    });
    if (!storeByUserId) {
      return new NextResponse("Forbinden", { status: 403 });
    }

    await prismadb.product.update({
      where: {
        id: productId,
      },
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
          deleteMany: {},
        },
        // images: {
        //   deleteMany: {},
        // },
      },
    });

    const product = await prismadb.product.update({
      where: {
        id: productId,
      },
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
    return NextResponse.json(product);
    // return NextResponse.json(store);
  } catch (err) {
    console.log("[PRODUCT_PATCH]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; productId: string } }
) {
  try {
    const user = await getCurrentUser();

    const { storeId, productId } = await params;

    if (!user) {
      return new NextResponse("Unauthenticaed", { status: 401 });
    }

    if (!storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }
    if (!productId) {
      return new NextResponse("Category id is required", { status: 400 });
    }
    const storeByUserId = await prismadb.store.findFirst({
      where: {
        userID: user.id,
      },
    });
    if (!storeByUserId) {
      return new NextResponse("Forbiden", { status: 403 });
    }

    const product = await prismadb.product.deleteMany({
      where: {
        id: productId,
        storeId: storeId,
      },
    });
    return NextResponse.json(product);
  } catch (err) {
    console.log("[STORE_DELETE]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}
