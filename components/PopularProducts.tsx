import {
  getOptionsWithUser,
  MapToHygraphDatastructure,
  relewiseRecommender,
} from "@/lib/relewiseTrackingUtils";
import Card from "./Card";
import { PopularProductsBuilder } from "@relewise/client";

interface Props {
  productId: string;
}

export default async function PopularProducts({ productId }: Props) {
  const settings = getOptionsWithUser(
    process.env.NEXT_PUBLIC_RELEWISE_USER as string,
    "Hygraph Demo - PDP"
  );

  const recommender = relewiseRecommender();

  const builder = new PopularProductsBuilder(settings)
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
    .basedOn("MostViewed")
    .setNumberOfRecommendations(3);

  var preppedQuery = builder.build();
  preppedQuery.custom = { timestamp: Date.now().toString() };

  const result = await recommender.recommendPopularProducts(preppedQuery);

  //Map to exsiting hygraph component data structure
  const relewiseMappedProducts = MapToHygraphDatastructure(
    result?.recommendations
  );

  return (
    <section className="bg-primary">
      <h3 className="text-5xl pt-12 mb-4 font-bold font-title text-center text-tertiary">
        Popular products
      </h3>
      <p className="text-center mb-12 text-tertiary">
        Server response: {result?.statistics?.serverTimeInMs} ms
      </p>

      <div className="grid gap-6 mx-12 pb-32 grid-cols-3 lg:gap-12">
        {relewiseMappedProducts &&
          relewiseMappedProducts.map((product: any) => {
            return (
              <Card
                key={product.id}
                image={product.image}
                title={product.title}
                url={product.url}
                cta="BUY NOW"
                small={true}
                brand={product.brand}
              />
            );
          })}
      </div>
    </section>
  );
}
