import prismadb from "@/lib/primadb";
import { ProductClient } from "./components/client";
import { format } from "date-fns";
import { ProductColumn } from "./components/column";

interface CategoriesPageProps {
  params: Promise<{ storeId: string }>;
}

const ProductPage = async (props: CategoriesPageProps) => {
  const { params } = props;
  const { storeId } = await params;

  console.log("STORE ID", storeId);
  const products = await prismadb.product.findMany({
    where: {
      storeId: storeId,
    },
    include: {
      images:true,
      category: true,
    },
    orderBy: {
      createAt: "desc",
    },
  });

  const formatProductsColumn: ProductColumn[] = products.map((item) => ({

    id: item.id,
    imageUrl: item.images[0]?.url ?? '',
    name: item.name,
    createAt: format(item.createAt, "MMMM do,yyyy"),
    isFeatured: item.isFeatured ,
    isArchieved: item.isArchived ,
    sku: item.sku || "",
    category: item.category.name,
    price:Number(item.price)
    
  }));
  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductClient data={formatProductsColumn} />
        {/* <BillboardClient data={formatBillboardColumn} /> */}
      </div>
    </div>
  );
};
export default ProductPage;
