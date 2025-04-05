import { getCategoriesWithProducts } from "@/actions/categories";
import CategoryPageComponent from "@/app/admin/categories/page-component";

// This is a use server by default so we fetch the data on the server which is faster and secure and then we pass them on the client component

export default async function Categories() {
  const categories = await getCategoriesWithProducts();

  return <CategoryPageComponent categories={categories} />;
}
