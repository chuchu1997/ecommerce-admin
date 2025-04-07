import prismadb from "@/lib/primadb";
import { ServiceForm } from "./components/service.form";
// import { CategoryForm } from "./components/category-form";
// import { BillboardsForm } from "./components/billboard-form";

interface ProductPageProps {
  params: Promise<{ slug: string; storeId: string }>;
}

const ServicePage = async (props: ProductPageProps) => {
  const { params } = props;
  const { slug, storeId } = await params;

  console.log("SLUG", slug);

  const categories = await prismadb.category.findMany({
    where: {
      storeId: storeId,
    },
    include: {
      subcategories: true,
    },
  });

  const service = await prismadb.service.findUnique({
    where: {
      slug: slug,
      storeId: storeId,
    },
    include: {
      images: true, // Include related image if required by ProductForm
    },
  });

  return (
    <div className="flex">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ServiceForm initialData={service} categories={categories} />
      </div>
    </div>
  );
};

export default ServicePage;
