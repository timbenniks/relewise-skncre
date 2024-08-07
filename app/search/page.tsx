import SearchBar from "../../components/SearchBar";
import {
  BrandFacetResult,
  CategoryFacetResult,
  ProductDataStringValueFacetResult,
  ProductSearchBuilder,
} from "@relewise/client";
import { getOptionsWithUser, MapToHygraphDatastructure, relewiseSearcher } from "@/lib/relewiseTrackingUtils";
import Card from "@/components/Card";
import BrandFacet from "@/components/BrandFacet";
import IngredientFacet from "@/components/IngredientFacet";
import CategoryFacet from "@/components/CategoryFacet";
import { Key } from "react";

export default async function SearchPage({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    brands?: string;
    ingredients?: string;
    categories?: string;
    page?: string;
  };
}) {

  const query = searchParams?.query || null;
  const brandsParam = searchParams?.brands
    ? decodeURIComponent(searchParams.brands).split(",")
    : [];
  const categoryParam = searchParams?.categories
    ? decodeURIComponent(searchParams?.categories || "").split(",")
    : [];
  const ingredientsParam = searchParams?.ingredients
    ? decodeURIComponent(searchParams.ingredients).split(",")
    : [];

  const searcher = relewiseSearcher();

  const settings = getOptionsWithUser(process.env.NEXT_PUBLIC_RELEWISE_USER as string, "Hygraph Demo - Search Page");

  let builder;
  let result;
  builder = new ProductSearchBuilder(settings)
    .setSelectedProductProperties({
      displayName: true,
      categoryPaths: true,
      assortments: false,
      pricing: true,
      allData: false,
      viewedByUserInfo: false,
      purchasedByUserInfo: false,
      brand: true,
      allVariants: false,
      dataKeys: ["slug", "image", "shortDescription"],
      viewedByUserCompanyInfo: false,
      purchasedByUserCompanyInfo: false,
    })
    .setTerm(query)
    .pagination((p) => p.setPageSize(30).setPage(1))
    .facets((f) =>
      f
        .addBrandFacet(brandsParam)
        .addProductDataStringValueFacet(
          "ingredients",
          "Product",
          ingredientsParam
        )
        .addSalesPriceRangeFacet("Product")
        .addCategoryFacet("ImmediateParent", categoryParam)
    );
  
    var preppedQuery = builder.build();
    preppedQuery.custom = {timestamp: Date.now().toString()};

  if (query) {
    builder.setTerm(query);
    result = await searcher.searchProducts(preppedQuery);
  } else {
    result = await searcher.searchProducts(preppedQuery);
  }

  const brandFacets =
    (result?.facets?.items?.find((item) =>
      item.$type.includes("BrandFacetResult")
    ) as BrandFacetResult) || undefined;

  const ingredientFacets =
    (result?.facets?.items?.find((item) =>
      item.$type.includes("ProductDataStringValueFacetResult")
    ) as ProductDataStringValueFacetResult) || undefined;

  const categoryFacets =
    (result?.facets?.items?.find((item) =>
      item.$type.includes("CategoryFacetResult")
    ) as CategoryFacetResult) || undefined;

console.log(result);
    const relewiseMappedProducts = MapToHygraphDatastructure(result?.results);

  return (
    <main className="max-w-screen-2xl mx-auto">
      <SearchBar placeholder="Any product attribute..." />
      {relewiseMappedProducts && relewiseMappedProducts.length > 0 && (
        <>
          <h3 className="text-5xl pt-12 mb-12 font-bold font-title text-center">
            Search result - server response time: {result?.statistics?.serverTimeInMs} ms
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <aside className="md:col-span-2">
              <h2 className="text-2xl font-bold mb-4">Filter by:</h2>
              <CategoryFacet availableFacets={categoryFacets?.available} />
              <BrandFacet availableFacets={brandFacets?.available} />
              <IngredientFacet availableFacets={ingredientFacets?.available} />
            </aside>

            <section className="md:col-span-10 mb-12">
              <div className="grid gap-6 pb-32 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 md:gap-12">
                {relewiseMappedProducts.map((product: { key: Key | null | undefined; image: { url: string; }; title: string; url: string; brand: any; }) => (
                  <Card
                    key={product.key}
                    image={product.image}
                    title={product.title}
                    url={product.url}
                    brand={product.brand || ""}
                    cta="BUY NOW"
                    small={true}
                  />
                ))}
              </div>
            </section>
          </div>
        </>
      )}
    </main>
  );
}
