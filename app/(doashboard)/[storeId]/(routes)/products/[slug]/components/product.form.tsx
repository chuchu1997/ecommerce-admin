/** @format */

"use client";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import {
  Category as PrismaCategory,
  Product,
  Image,
  ProductSize,
  ProductColor,
  Size,
  Color,
} from "@prisma/client";

interface Category extends PrismaCategory {
  subcategories?: { id: string; name: string }[];
}
import { Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { AlertModal } from "@/components/modals/alert-modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import ImageUpload from "@/components/ui/image-upload";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import EditorComponent from "@/components/editor";

const formSchema = z.object({
  name: z.string().min(1),
  categoryId: z.string().min(1),
  price: z.coerce.number().min(1),
  images: z.object({ url: z.string() }).array(),

  isFeatured: z.boolean().default(false).optional(),

  isArchived: z.boolean().default(false).optional(),
  description: z.string().min(1),

  shortDescription: z.string().min(1),
  slugData: z.string().min(1),
  sku: z.string().min(1),
  stockQuantity: z.coerce.number(),

  //IS OPTIONAL
  sizes: z
    .array(
      z.object({
        sizeId: z.string().min(1), // Add proper validation for id
        price: z.coerce.number().min(0), // Add price validation
        stockQuantity: z.coerce.number().min(0), // Add stock quantity validation
      })
    )
    .optional(),

  colors: z
    .array(
      z.object({
        colorId: z.string().min(1),
        price: z.coerce.number().min(0),
        stockQuantity: z.coerce.number().min(0),
      })
    )
    .optional(),
  viewCount: z.coerce.number().default(0).optional(),
  ratingCount: z.coerce.number().default(5).optional(),

  subCategoryId: z.string().optional(),
});
interface ProductProps {
  initialData:
    | (Product & {
        images: Image[];
        productSizes: (ProductSize & {
          size: Size;
        })[];
        productColors: (ProductColor & {
          color: Color;
        })[];
      })
    | null;
  categories: Category[];
  sizes: Size[];
  colors: Color[];
}

type ProductFormValues = z.infer<typeof formSchema>;

export const ProductForm: React.FC<ProductProps> = ({
  initialData,
  categories,
  sizes,
  colors,
}) => {
  const params = useParams();
  const router = useRouter();
  const title = initialData ? "Chỉnh sửa sản phẩm" : "Tạo sản phẩm ";
  const description = initialData ? "Chỉnh sửa sản phẩm" : "Tạo sản phẩm mới ";
  const toastMessage = initialData ? "Đã chỉnh sửa " : "Đã tạo sản phẩm ";
  const action = initialData ? "Lưu thay đổi " : "Tạo sản phẩm";
  const [open, setOpen] = useState(false);

  const [loading, setLoading] = useState(false);

  const [showEditor, setShowEditor] = useState(false);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          price: parseFloat(String(initialData.price)),
          subCategoryId: initialData.subcategoryId ?? "",
          slugData: initialData.slug,
          sizes: initialData.productSizes.map((size) => ({
            ...size,
            price: size.price ?? 0,
          })),
          colors: initialData.productColors.map((color) => ({
            ...color,
            price: color.price ?? 0,
          })),
        }
      : {
          sizes: [],
          colors: [],
          name: "",
          categoryId: "",
          price: 0,
          images: [],
          subCategoryId: "",
          isFeatured: false,
          isArchived: false,
          description: "",
          shortDescription: "",
          slugData: "",
          sku: "",
          stockQuantity: 0,
          viewCount: 0,
          ratingCount: 5,
        },
  });

  //HANDLE FOR SUBCATEGORIES

  const [subcategories, setSubcategories] = useState<
    { id: string; name: string }[]
  >(
    initialData?.categoryId
      ? categories.find((category) => category.id === initialData.categoryId)
          ?.subcategories || []
      : []
  );

  useEffect(() => {
    const selectedCategory = categories.find(
      (category) => category.id === form.watch("categoryId")
    );
    if (selectedCategory) {
      setSubcategories(selectedCategory?.subcategories || []);
      if (selectedCategory?.subcategories?.length === 0) {
        form.setValue("subCategoryId", "");
      }
    }
  }, [form.watch("categoryId"), categories]);

  const onSubmit = async (data: ProductFormValues) => {
    console.log("ONSUBMIT CALL !!");
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(
          `/api/${params.storeId}/products/${params.slug}`,
          data
        );
      } else {
        await axios.post(`/api/${params.storeId}/products`, data);
      }
      router.refresh();
      router.push(`/${params.storeId}/products/`);
      toast.success(toastMessage);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_err) {
      toast.error("Something when wrong !!");
    } finally {
      setLoading(false);
    }
  };
  const onDelete = async () => {
    try {
      setLoading(true);

      await axios.delete(`/api/${params.storeId}/products/${params.slug}`);
      router.refresh();
      toast.success("Xóa Sản Phẩm  thành công !!");
    } catch (err) {
      toast.error(
        `Make sure you removed all products using this category first !! ${
          err instanceof Error ? err.message : String(err)
        }`
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex flex-col gap-4">
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        loading={loading}
        onConfirm={async () => {
          await onDelete();
          setOpen(false);
        }}
      />
      <div className="flex items-center justify-between my-4">
        <Heading title={title} description={description} />
        {/* BUTTON DELETE JUST WORKING ON EDIT MODE  */}
        {initialData && (
          <Button
            variant="destructive"
            size="icon"
            disabled={loading}
            onClick={async () => {
              setOpen(true);
            }}>
            <Trash className="w-4 h-4 "></Trash>
          </Button>
        )}
      </div>

      <Separator />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full md:w-1/2 mx-auto">
          <div className="grid grid-cols-1 gap-8 mt-[15px]">
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Danh mục </FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a main category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent position="popper">
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="subCategoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Danh mục con</FormLabel>
                  <div className="relative ">
                    <Select
                      disabled={
                        categories.find(
                          (category) => category.id === form.watch("categoryId")
                        )?.subcategories?.length === 0
                      } // Disable nếu không có subcategories
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            defaultValue={field.value}
                            placeholder="Select a sub category"
                          />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent position="popper">
                        {subcategories.map((subcategory) => (
                          <SelectItem
                            key={subcategory.id}
                            value={subcategory.id}>
                            {subcategory.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="images"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hình ảnh sản phẩm </FormLabel>
                  <FormControl>
                    <ImageUpload
                      disabled={loading}
                      onChange={(url) => {
                        field.onChange(
                          (field.value = [...field.value, { url }])
                        );
                      }}
                      onRemove={(url) =>
                        field.onChange([
                          ...field.value.filter(
                            (current) => current.url !== url
                          ),
                        ])
                      }
                      value={field.value.map(
                        (image) => image.url
                      )}></ImageUpload>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên sản phẩm </FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      {...field}
                      placeholder="Tên sản phẩm   "></Input>
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="slugData"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      pattern="\S*"
                      disabled={loading}
                      {...field}
                      placeholder="Slug "></Input>
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả sản phẩm </FormLabel>
                  {!showEditor ? (
                    <div
                      className="border p-4 rounded-lg text-gray-500 cursor-pointer hover:bg-gray-100"
                      onClick={() => setShowEditor(true)}>
                      ✍️ Click để thêm mô tả
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <FormControl>
                        <EditorComponent
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>

                      <div className="text-right">
                        <Button
                          type="button"
                          onClick={() => setShowEditor(false)}>
                          Ẩn Text Editor
                        </Button>
                      </div>
                    </div>
                  )}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="shortDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả ngắn </FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      {...field}
                      placeholder="Short Description  "></Input>
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="stockQuantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số lượng </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      disabled={loading}
                      {...field}
                      placeholder="Stock label  "></Input>
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Giá </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      disabled={loading}
                      {...field}
                      placeholder="Price label  "></Input>
                  </FormControl>
                </FormItem>
              )}
            />
            {/* NẾU CÓ COLOR THÌ CHO CHỌN  */}
            {colors.length > 0 && (
              <FormField
                control={form.control}
                name="colors"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Màu sắc</FormLabel>
                    <FormDescription>
                      Chọn các màu sắc có sẵn cho sản phẩm.
                    </FormDescription>
                    <div className="flex flex-col space-y-2">
                      {colors.map((color) => (
                        <FormItem
                          key={color.id}
                          className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value?.some(
                                (item) => item.colorId === color.id
                              )}
                              onCheckedChange={(checked) => {
                                const isChecked = checked === true;
                                if (isChecked) {
                                  field.onChange([
                                    ...(field.value || []),
                                    color.id,
                                  ]);
                                } else {
                                  field.onChange(
                                    (field.value || []).filter(
                                      (val) => val.colorId !== color.id
                                    )
                                  );
                                }
                              }}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="text-sm font-normal">
                              {color.name}
                            </FormLabel>
                          </div>
                        </FormItem>
                      ))}
                    </div>
                  </FormItem>
                )}
              />
            )}
            {/* NẾU CÓ SIZE THÌ CHO CHỌN */}
            {sizes.length > 0 && (
              <FormField
                control={form.control}
                name="sizes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sizes</FormLabel>
                    <FormDescription>
                      Chọn các kích thước có sẵn cho sản phẩm.
                    </FormDescription>
                    <div className="flex flex-col space-y-2">
                      {sizes.map((size) => (
                        <FormItem
                          key={size.id}
                          className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value?.some(
                                (item) => item.sizeId === size.id
                              )}
                              onCheckedChange={(checked) => {
                                const isChecked = checked === true;
                                if (isChecked) {
                                  field.onChange([
                                    ...(field.value || []),
                                    { sizeId: size.id }, // ✅
                                  ]);
                                } else {
                                  field.onChange(
                                    (field.value || []).filter((val) => val.sizeId !== size.id)
                                  )
                                }
                              }}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="text-sm font-normal">
                              {size.name}
                            </FormLabel>
                          </div>
                        </FormItem>
                      ))}
                    </div>
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="sku"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SKU </FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      {...field}
                      placeholder="SKU  "></Input>
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isFeatured"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      onCheckedChange={field.onChange}
                      checked={field.value}></Checkbox>
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel> Sản phẩm nổi bật ? </FormLabel>
                    <FormDescription>
                      Nếu nhấn vào thì sản phẩm sẽ được hiển thị ở trang chủ
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isArchived"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      onCheckedChange={field.onChange}
                      checked={field.value}></Checkbox>
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Tạm tắt</FormLabel>
                    <FormDescription>
                      Nếu nhấn vào thì sản phẩm sẽ không hiển thị ở bất cứ đâu
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </div>

          <Button
            disabled={loading}
            className="ml-auto mt-4 cursor-pointer"
            type="submit">
            {action}
          </Button>
        </form>
      </Form>

      <Separator />
    </div>
  );
};
