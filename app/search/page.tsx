
import SearchBar from "../../components/SearchBar";
import { ProductSearchBuilder, Searcher } from "@relewise/client";
import { getRelewiseUser } from "@/lib/relewiseTrackingUtils";
import Card from "@/components/Card";
import BrandFacet from "@/components/BrandFacet";
import IngredientFacet from "@/components/IngredientFacet";
import CategoryFacet from "@/components/CategoryFacet"
import { valueFromAST } from "graphql";

export default async function SearchPage({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    brands?: string;
    ingredients?: string;
    categories?:string;
    page?: string;
  };
}) {
  const query = searchParams?.query || "";
  const brandsParam = decodeURIComponent(searchParams?.brands || "").split(",");
  const categoryParam = decodeURIComponent(searchParams?.categories || "").split(",");
  const ingredientsParam = searchParams?.ingredients 
  ? decodeURIComponent(searchParams.ingredients).split(",") 
  : [];

  const searcher = new Searcher(
    process.env.NEXT_PUBLIC_RELEWISE_DATASET_ID as string,
    process.env.NEXT_PUBLIC_RELEWISE_API_KEY as string,
    {
      serverUrl: process.env.NEXT_PUBLIC_RELEWISE_SERVER_URL,
    }
  );

  const settings = {
    language: "en-gb",
    currency: "EUR",
    displayedAtLocation: "Search Page",
    user: getRelewiseUser(),
  };

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
  .setTerm(null)
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

  if (query && query.length > 0) {

      builder.setTerm(query);
      result = await searcher.searchProducts(builder.build());  
  }
  else if(query.length==0){
    result = await searcher.searchProducts(builder.build());  
  }

  
  
  const brandFacets = result?.facets?.items?.find((item) =>
    item.$type.includes("BrandFacetResult")
  );

  const ingredientFacets = result?.facets?.items?.find((item) =>
    item.$type.includes("ProductDataStringValueFacetResult")
  );

  const categoryFacets = result?.facets?.items?.find((item) =>
    item.$type.includes("CategoryFacetResult")
  );


  const relewiseMappedProducts = result?.results?.map((result) => {
    return {
      key: result.productId,
      image: {
        url: result?.data?.image.value,
      },
      title: result?.displayName || "",
      url: `/pdp/${result?.data?.slug.value}`,
      brand: result?.brand?.displayName,
      // @ts-ignore
      category: result?.categoryPaths[0].pathFromRoot[0].displayName,
      price: result?.listPrice,
    };
  });

  return (
    <main className="max-w-screen-2xl mx-auto">
      <SearchBar placeholder="Any product attribute..." />

      {relewiseMappedProducts && relewiseMappedProducts.length > 0 && (
        <>
        {/* <pre>{JSON.stringify(result?.facets?.items, null, 2)}</pre> */}
          <h3 className="text-5xl pt-12 mb-12 font-bold font-title text-center">
            Search result
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
                {relewiseMappedProducts.map((product) => (
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
