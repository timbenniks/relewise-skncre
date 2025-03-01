
import { request } from "graphql-request";
import { graphql } from "../gql"
import type { Stage } from "../gql/graphql";

const query = graphql(`
  query Pdp($slug: String!, $stage: Stage! = PUBLISHED) {
    skncreProduct(where: { slug: $slug }, stage: $stage) {
      productId
      slug
      brand
      name
      category
      shortDescription
      description
      images
      ingredients
      price
      stock
    }
    pdp(where: { slug: "face-serum" }, stage: $stage) {
      id
      __typename
      slug
      title
      description
      ogImage {
        url
      }
      components {
        ... on Tutorial {
          __typename
          id
          title
          image {
            url
          }
          items {
            __typename
            text
          }
        }
        ... on Routine {
          __typename
          id
          chapeau
          cta
          description
          image {
            url
          }
          title
          url
        }
        ... on ProductList {
          __typename
          title
          relatedProductList {
            relatedProductId
            relatedProducts {
              products {
                description
                id
                images {
                  alt
                  url
                }
                ingredients
                name
                price
                shortDescription
                slug
                stock
              }
            }
          }
        }
      }
    }
  }
`);

export async function getPdp(slug: string, stage: "PUBLISHED" | "DRAFT") {
  const variables = {
    slug: slug || "face-serum",
    stage: stage as Stage || "PUBLISHED" as Stage
  };

  const data = await request(
    process.env.NEXT_HYGRAPH_ENDPOINT as string,
    query,
    variables
  );

  return data;
}