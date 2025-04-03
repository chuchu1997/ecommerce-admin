import prismadb from "@/lib/primadb";
import { CategoryClient } from "./components/client";
import { format } from "date-fns";
import { CategoryColumn as CategoriesColumn } from "./components/column";

interface SubCategoriesPage {
  params: Promise<{ storeId: string }>;
}

const SubCategoryPage = async (props: SubCategoriesPage) => {
  const { params } = props;
  const { storeId } = await params;

  const subCategories = await prismadb.subcategory.findMany({
    where: {
      storeId: storeId,
    },
    include: {
      billboard: true,
      category:true
    },
    orderBy: {
      createdAt: "desc",
    },
   
  });

  const formatCategoriesColumn: CategoriesColumn[] = subCategories.map((subCategory) => ({
    slug:subCategory.slug,
    billboardImageUrl: subCategory.billboard.imageUrl,
    id: subCategory.id,
    name: subCategory.name,
    billboardLabel: subCategory.billboard.label,
    parentCategory:subCategory.category.name,
    createAt: format(subCategory.createdAt, "MMMM do,yyyy"),
  }));
  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryClient data={formatCategoriesColumn} />
        {/* <BillboardClient data={formatBillboardColumn} /> */}
      </div>
    </div>
  );
};
export default SubCategoryPage;
