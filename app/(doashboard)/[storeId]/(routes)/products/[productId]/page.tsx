



import prismadb from "@/lib/primadb";
import { ProductForm } from "./components/product.form";
// import { CategoryForm } from "./components/category-form";
// import { BillboardsForm } from "./components/billboard-form";

interface CategoryPage {
  params: Promise<{ productId: string; storeId: string }>;
}

const ProductPage = async (props: CategoryPage) => {
  const { params } = props;
  const { productId, storeId } = await params;



  const categories = await prismadb.category.findMany({
    where:{
        storeId:storeId
    }
  })

  const product = await prismadb.product.findUnique({
    where: {
      id: productId,
      storeId:storeId
    },
    include: {
     images:true, // Include related image if required by ProductForm
    },
  });


  return (
    <div className="flex">
      <div className="flex-1 space-y-4 p-8 pt-6">
    
        <ProductForm
            initialData={product}
            categories={categories}
        />
    
      </div>
    </div>
  );
};

export default ProductPage;
