import prismadb from "@/lib/primadb";
import { CategoryClient } from "./components/client";
import { format } from "date-fns";
import { CategoryColumn } from "./components/column";

interface CategoriesPageProps {
  params: Promise<{ storeId: string }>;
}

const CategoryPage = async (props: CategoriesPageProps) => {
  const { params } = props;
  const { storeId } = await params;

  console.log("STORE ID", storeId);
  const categories = await prismadb.category.findMany({
    where: {
      storeId: storeId,
    },
    include: {
      billboard: true,
    },
    orderBy: {
      createAt: "desc",
    },
  });

  const formatCategoriesColumn: CategoryColumn[] = categories.map((item) => ({
    id: item.id,
    name: item.name,
    billboardLabel: item.billboard.label,
    createAt: format(item.createAt, "MMMM do,yyyy"),
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
export default CategoryPage;
