import { getOptionsWithUser } from "@/lib/relewiseTrackingUtils";
import Card from "./Card";
import { PurchasedWithProductBuilder, Recommender } from "@relewise/client";

interface Props {
  productId: string;
}

export default async function ProductList({ productId }: Props) {
  const settings = getOptionsWithUser(
    process.env.NEXT_PUBLIC_RELEWISE_USER as string, "Hygraph Demo - PDP"
  );

  const recommender = new Recommender(
    process.env.NEXT_PUBLIC_RELEWISE_DATASET_ID as string,
    process.env.NEXT_PUBLIC_RELEWISE_API_KEY as string,
    {
      serverUrl: process.env.NEXT_PUBLIC_RELEWISE_SERVER_URL,
    }
  );

  const purchasedWithProduct = new PurchasedWithProductBuilder(settings)
    .setSelectedProductProperties({
      displayName: true,
      categoryPaths: true,
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
    .recommendVariant(false)
    .allowReplacingOfRecentlyShownRecommendations(true)
    .allowFillIfNecessaryToReachNumberOfRecommendations(true)
    .prioritizeDiversityBetweenRequests(false)
    .product({ productId: productId })

    .setNumberOfRecommendations(3);

  const result = await recommender.recommendPurchasedWithProduct(
    purchasedWithProduct.build()
  );

  const relewiseMappedProducts = result?.recommendations?.map((result) => {
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
    <section className="bg-tertiary">
      <h3 className="text-5xl pt-12 mb-12 font-bold font-title text-center">
        Others bought
      </h3>

      <div className="grid gap-6 mx-12 pb-32 grid-cols-3 lg:gap-12">
        {relewiseMappedProducts &&
          relewiseMappedProducts.map((product: any) => {
            return (
              <Card
                key={product.id}
                image={product.image}
                title={product.title}
                url={product.url}
                brand={product.brand}
                cta="BUY NOW"
                small={true}
              />
            );
          })}
      </div>
    </section>
  );
}
