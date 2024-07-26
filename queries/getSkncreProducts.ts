import { request } from "graphql-request";
import { graphql } from "../gql"

const query = graphql(`
  query skncreProducts {
    skncreProducts(first: 300) {
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
  }
`);

export async function getSkncreProducts() {
  const data = await request(
    process.env.NEXT_HYGRAPH_ENDPOINT as string,
    query
  );

  return data;
}