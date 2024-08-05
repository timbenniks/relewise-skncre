import Card from "./Card";
import {
  PopularProductsBuilder,
  Recommender,
} from "@relewise/client";

interface Props {
  productId: string;
}

export default async function PopularProducts({ productId }: Props) {
  const settings = {
    language: "en-gb",
    currency: "EUR",
    displayedAtLocation: "Product Details Page",
    user: {},
  };

  const recommender = new Recommender(
    process.env.NEXT_PUBLIC_RELEWISE_DATASET_ID as string,
    process.env.NEXT_PUBLIC_RELEWISE_API_KEY as string,
    {
      serverUrl: process.env.NEXT_PUBLIC_RELEWISE_SERVER_URL,
    }
  );

  const popularProductsBuilder =
    new PopularProductsBuilder(settings)
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

  const result = await recommender.recommendPopularProducts(
    popularProductsBuilder.build()
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
    <section className="bg-primary">
      <h3 className="text-5xl pt-12 mb-12 font-bold font-title text-center text-tertiary">
        Popular products
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
