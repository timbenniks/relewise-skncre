import { FC, useRef } from 'react';
import SearchBar from '../../components/SearchBar';
import { ProductSearchBuilder, Searcher } from '@relewise/client';
import { getRelewiseUser } from '@/lib/relewiseTrackingUtils';
import Card from '@/components/Card';

interface SearchResult {
  name: string;
}

export default async function SearchPage({
    searchParams,
  }: {
    searchParams?: {
      query?: string;
      page?: string;
    };
  })
{
    const query = searchParams?.query || '';
    const currentPage = Number(searchParams?.page) || 1;
console.log("query: " + query);
  const searcher = new Searcher(
    process.env.NEXT_PUBLIC_RELEWISE_DATASET_ID as string,
    process.env.NEXT_PUBLIC_RELEWISE_API_KEY as string,
    {
      serverUrl: process.env.NEXT_PUBLIC_RELEWISE_SERVER_URL,
    }
  );
  const settings = {
    language: 'en-gb',
    currency: 'EUR',
    displayedAtLocation: 'Search Page',
    user: getRelewiseUser(),
};
let builder;
let result;
  
    if (query && query.length > 2) {
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
        .pagination(p => p
            .setPageSize(30)
            .setPage(1))
        .facets(f => f
            .addBrandFacet()
            .addProductDataStringValueFacet("ingredients",'Product')
            .addSalesPriceRangeFacet('Product')
            .addCategoryFacet("ImmediateParent")
        );

            result =  await searcher.searchProducts(builder.build());
    }
  
    const relewiseMappedProducts = result?.results?.map((result) => {
        return {
          key: result.productId,
          image: {
            url: result?.data?.image.value,
          },
          title: result?.displayName||"",
          url: `/pdp/${result?.data?.slug.value}`,
          brand: result?.brand?.displayName,
          // @ts-ignore
          category: result?.categoryPaths[0].pathFromRoot[0].displayName,
          price: result?.listPrice,
        };
      });

  return (
    <main className="max-w-screen-2xl mx-auto px-4">
      <SearchBar placeholder="Search here" />
      
      {relewiseMappedProducts && relewiseMappedProducts.length > 0 && (
        <>
          <h3 className="text-5xl pt-12 mb-12 font-bold font-title text-center">
            Search result
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <aside className="md:col-span-2">
              <h2 className="text-2xl font-bold mb-4">Filter by:</h2>
              <div className="mb-4">
                <h3 className="font-semibold">Facets</h3>
                <ul>
                  <li><input type="checkbox" id="fat1" /> <label htmlFor="cat1">Facet 1</label></li>
                  <li><input type="checkbox" id="fat2" /> <label htmlFor="cat2">Facet 2</label></li>
                  <li><input type="checkbox" id="fat3" /> <label htmlFor="cat3">Facet 3</label></li>
                </ul>
              </div>
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
};