import Card from "./Card";
import {
  ProductsViewedAfterViewingProductBuilder,
  Recommender,
} from "@relewise/client";

interface Props {
  productId: string;
}

export default async function ProductList({ productId }: Props) {
  const settings = {
    language: "en-gb",
    currency: "EUR",
    displayedAtLocation: "Product Details Page",
    user: {},
  };

  const recommender = new Recommender(
    "0dac7093-af97-41a1-b7de-3cc1cc3f3120",
    "np1VU:ftHwW1Aah",
    {
      serverUrl: "https://sandbox-api.relewise.com/",
    }
  );

  const viewedAfterViewingbuilder =
    new ProductsViewedAfterViewingProductBuilder(settings)
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
      .product({ productId })
      .setNumberOfRecommendations(3);

  const result = await recommender.recommendProductsViewedAfterViewingProduct(
    viewedAfterViewingbuilder.build()
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
        Others browsed these
      </h3>

      <div className="grid gap-6 mx-12 pb-32 grid-cols-3 lg:gap-12">
        {relewiseMappedProducts &&
          relewiseMappedProducts.map((product: any) => {
            return (
              <Card
                key={product.id}
                image={product.image}
                title={product.title}
                url={`/pdp/${product.slug}`}
                cta="BUY NOW"
                small={true}
              />
            );
          })}
      </div>
    </section>
  );
}
