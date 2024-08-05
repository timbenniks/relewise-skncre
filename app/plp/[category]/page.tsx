import type { Metadata } from "next";
import type { SkncreProductsQuery } from "@/gql/graphql";
import { getSkncreProducts } from "@/queries/getSkncreProducts";
import Card from "../../../components/Card";
import { ProductSearchBuilder, Searcher, UserFactory } from "@relewise/client";
import { getRelewiseUser, relewiseTracker } from "../../../helpers";
import { getOptionsWithUser } from "@/lib/relewiseTrackingUtils";

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
  // const { skncreProducts }: SkncreProductsQuery = await getSkncreProducts();

  // const mappedProducts = skncreProducts.map((product) => {
  //   return {
  //     key: product.productId,
  //     image: {
  //       url: product.images[0],
  //     },
  //     title: product.name,
  //     url: `/pdp/${product.slug}`,
  //   };
  // });

  const settings = {
    ...getOptionsWithUser(process.env.NEXT_PUBLIC_RELEWISE_USER as string),
    take: 100,
    skip: 0,
  };

  const cat = decodeURIComponent(params.category);

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

  const searcher = new Searcher(
    process.env.NEXT_PUBLIC_RELEWISE_DATASET_ID as string,
    process.env.NEXT_PUBLIC_RELEWISE_API_KEY as string,
    {
      serverUrl: process.env.NEXT_PUBLIC_RELEWISE_SERVER_URL,
    }
  );

  const result = await searcher.searchProducts(builder.build());

  const relewiseMappedProducts = result?.results?.map((result) => {
    return {
      key: result.productId,
      image: {
        url: result?.data?.image.value,
      },
      title: result.displayName,
      url: `/pdp/${result?.data?.slug.value}`,
      brand: result?.brand?.displayName,
      // @ts-ignore
      category: result?.categoryPaths[0].pathFromRoot[0].displayName,
      price: result?.listPrice,
    };
  });

  return (
    <main className="max-w-screen-2xl mx-auto">
      <section className="mb-12">
        <h3 className="text-5xl pt-12 mb-12 font-bold font-title text-center">
          Product List for {cat}
        </h3>

        <div className="grid gap-6 mx-12 pb-32 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 md:gap-12">
          {relewiseMappedProducts &&
            relewiseMappedProducts.map((product) => {
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
