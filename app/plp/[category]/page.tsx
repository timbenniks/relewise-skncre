import type { Metadata } from "next";
import Card from "../../../components/Card";
import { ProductSearchBuilder } from "@relewise/client";
import { getRelewiseUser, relewiseTracker } from "../../../helpers";
import { getOptionsWithUser, MapToHygraphDatastructure, relewiseSearcher } from "@/lib/relewiseTrackingUtils";
import { Key } from "react";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Product List Page",
    description: "Product List Page",
  };
}

export default async function Plp({
  params,
}: {
  params: { category: string };
}) {

  const settings = {
    ...getOptionsWithUser(process.env.NEXT_PUBLIC_RELEWISE_USER as string, "Hygraph Demo - PLP"),
    take: 100,
    skip: 0,
  };
  const searcher = relewiseSearcher();
  const cat = decodeURIComponent(params.category);

  //Simple standard implementation of tracking
  await relewiseTracker().trackProductCategoryView({
    idPath: [cat],
    user: getRelewiseUser(),
  });

  const builder = new ProductSearchBuilder(settings)
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
    .filters((f) =>
      f.addProductCategoryIdFilter(
        "ImmediateParentOrItsParent",
        cat || "Facial Care"
      )
    );

    var preppedQuery = builder.build();
    preppedQuery.custom = {timestamp: Date.now().toString()};

  const result = await searcher.searchProducts(preppedQuery);

  //Map to exsiting hygraph component data structure
  const relewiseMappedProducts = MapToHygraphDatastructure(result?.results);

  return (
    <main className="max-w-screen-2xl mx-auto">
      <section className="mb-12">
        <h3 className="text-5xl pt-12 mb-12 font-bold font-title text-center">
          Product List for {cat}  - server response: {result?.statistics?.serverTimeInMs} ms
        </h3>

        <div className="grid gap-6 mx-12 pb-32 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 md:gap-12">
          {relewiseMappedProducts &&
            relewiseMappedProducts.map((product: { key: Key | null | undefined; image: { url: string; }; title: string; url: string; brand: any; }) => {
              return (
                <Card
                  key={product.key}
                  image={product.image}
                  title={product.title as string}
                  url={product.url}
                  cta="BUY NOW"
                  small={true}
                  brand={product.brand || ""}
                />
              );
            })}
        </div>
      </section>
    </main>
  );
}
