import { getOptionsWithUser, MapToHygraphDatastructure, relewiseRecommender } from "@/lib/relewiseTrackingUtils";
import Card from "./Card";
import { PurchasedWithProductBuilder} from "@relewise/client";

interface Props {
  productId: string;
}

export default async function ProductList({ productId }: Props) {
  const settings = getOptionsWithUser(
    process.env.NEXT_PUBLIC_RELEWISE_USER as string, "Hygraph Demo - PDP"
  );

  const recommender = relewiseRecommender();

  const builder = new PurchasedWithProductBuilder(settings)
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

    var preppedQuery = builder.build();
    preppedQuery.custom = {timestamp: Date.now().toString()};

    const result = await recommender.recommendPurchasedWithProduct(
      preppedQuery
  );

  //Map to exsiting hygraph component data structure
  const relewiseMappedProducts = MapToHygraphDatastructure(result?.recommendations);

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
