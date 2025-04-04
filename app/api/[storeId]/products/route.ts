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
    const limit = parseInt(searchParams.get("limit") || "4"); // Mặc định 4 sản phẩm mỗi lần
    const currentPage = parseInt(searchParams.get("currentPage") || "1"); // Trang mặc định là 1
    const subCategoryId = searchParams.get("subCategoryId") || undefined;

    if (!storeId) {
      return new NextResponse("Store Id is required ", { status: 400 });
    }

    const products = await prismadb.product.findMany({
      where: {
        storeId: storeId,
        categoryId,
        isFeatured: isFeatured ? true : undefined,
        isArchived: false,
        subcategory: {
          id: subCategoryId,
        },
      },
      include: {
        images: true,
        category: true,
        subcategory: true,
      },
      orderBy: {
        createAt: "desc",
      },
      take: limit,
      skip: (currentPage - 1) * limit,
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
      subCategoryId,
      price,
      images,
      isFeatured,
      isArchived,
      description,
      shortDescription,
      slugData,
      sku,
      stockQuantity,
      viewCount,
      ratingCount,
    } = body;

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!categoryId) {
      return new NextResponse("Bắt buộc phải có phân loại", { status: 400 });
    }

    if (!storeId) {
      return new NextResponse("Store Id is required ", { status: 400 });
    }
    if (!price) {
      return new NextResponse("Bắt buộc phải nhập giá tiền ", { status: 400 });
    }
    if (!images || !images.length) {
      return new NextResponse("Bắt buộc phải có hình ảnh ", { status: 400 });
    }

    if (!description) {
      return new NextResponse("Bắt buộc phải có mô tả sản phẩm ", {
        status: 400,
      });
    }

    if (!shortDescription) {
      return new NextResponse("Bắt buộc phải có mô tả ngắn sản phẩm ", {
        status: 400,
      });
    }
    if (!slugData) {
      return new NextResponse("Bắt buộc phải có slug để tối ưu SEO", {
        status: 400,
      });
    }
    if (!sku) {
      return new NextResponse("Bắt buộc phải có SKU để quản lý sản phẩm ", {
        status: 400,
      });
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
        slug: slugData,
        stockQuantity,
        subcategoryId: subCategoryId ?? null,
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

    return NextResponse.json(product, { status: 200 });
  } catch (err) {
    console.log("[PRODUCT_POST]", err);
    return new NextResponse("Interal error", { status: 500 });
  }
}
