import prismadb from "@/lib/primadb";
import { ProductForm } from "./components/product.form";
// import { CategoryForm } from "./components/category-form";
// import { BillboardsForm } from "./components/billboard-form";
import { Size, Color } from "@prisma/client";

interface ProductPageProps {
  params: Promise<{ slug: string; storeId: string }>;
}

const ProductPage = async (props: ProductPageProps) => {
  const { params } = props;
  const { slug, storeId } = await params;

  const categories = await prismadb.category.findMany({
    where: {
      storeId: storeId,
    },
    include: {
      subcategories: true,
    },
  });

  const product = await prismadb.product.findUnique({
    where: {
      slug: slug,
      storeId: storeId,
    },
    include: {
      productSizes: {
        include: {
          size: true, // Include the size details
        },
      },
      productColors: {
        include: {
          color: true, // Include the color details
        },
      },
      images: true, // Include related image if required by ProductForm
    },
  });
  let sizes: Size[] = [];
  let colors: Color[] = [];
  // Lấy danh sách màu sắc từ productColors nếu đã include
  if (!product?.productColors || product.productColors.length === 0) {
    colors = await prismadb.color.findMany({
      where: {
        storeId: storeId,
      },
    });
  } else {
    colors = product.productColors.map((productColor) => productColor.color); // hoặc lấy từ product.productSizes nếu đã include
  }
  

  sizes = await prismadb.size.findMany({
    where: {
      storeId: storeId,
    },
  });

  return (
    <div className="flex">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductForm
          initialData={product}
          categories={categories}
          sizes={sizes}
          colors={colors}
        />
      </div>
    </div>
  );
};

export default ProductPage;
