import { ProductSearchResponse, Recommender, Searcher, Tracker, UserFactory } from '@relewise/client';

export function getRelewiseUser() {
  return UserFactory.anonymous();
}

export const relewiseTracker = () => {
  const tracker = new Tracker(
    process.env.NEXT_PUBLIC_RELEWISE_DATASET_ID as string,
    process.env.NEXT_PUBLIC_RELEWISE_API_KEY as string,
    {
      serverUrl: process.env.NEXT_PUBLIC_RELEWISE_SERVER_URL,
    }
  );

  return tracker;
};

export const relewiseRecommender = () => {
  const recommender = new Recommender(
    process.env.NEXT_PUBLIC_RELEWISE_DATASET_ID as string,
    process.env.NEXT_PUBLIC_RELEWISE_API_KEY as string,
    {
      serverUrl: process.env.NEXT_PUBLIC_RELEWISE_SERVER_URL,
    }
  );

  return recommender;
};

export const relewiseSearcher = () => {
  const searcher = new Searcher(
    process.env.NEXT_PUBLIC_RELEWISE_DATASET_ID as string,
    process.env.NEXT_PUBLIC_RELEWISE_API_KEY as string,
    {
      serverUrl: process.env.NEXT_PUBLIC_RELEWISE_SERVER_URL,
    }
  );

  return searcher;
};

export function MapToHygraphDatastructure(result: any | undefined) {
  return result?.map((result: { productId: any; data: { image: { value: any; }; slug: { value: any; }; }; displayName: any; brand: { displayName: any; }; categoryPaths: { pathFromRoot: { displayName: any; }[]; }[]; listPrice: any; }) => {
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
}

export function getOptionsWithUser(user: string | "anonymous" | "bennich" | "benniks" | "hygraph", displayedAtLocation: string) {
  const users: any = [];

  users["anonymous"] = UserFactory.anonymous(),
  users["bennich"] = {
    "authenticatedId": "8298a53e-fd1d-4397-8b30-bc1cd84b27c0",
    "email": "christianb@relewise.com",
    "classifications": {
      "snailpreference": "true",
    },
    "identifiers": {},
    "data": {},
    "company": {
      "id": "Relewise"
    }
  },
    users["benniks"] = {
      "authenticatedId": "8298a53e-fd1d-4397-8b30-bc1cd84b27c4",
      "email": "tim.benniks@hygraph.com",
      "classifications": {
        "snailpreference": "false",
      },
      "identifiers": {},
      "data": {},
      "company": {
        "id": "Hygraph"
      }
    },
    users["hygraph"] = {
      "authenticatedId": "8298a53e-fd1d-4397-8b30-bc1cd84b27d5",
      "email": "someone@hygraph.com",
      "identifiers": {},
      "data": {},
      "company": {
        "id": "Hygraph"
      }
    }

  return {
    language: "en-gb",
    currency: "EUR",
    displayedAtLocation: displayedAtLocation,
    user: users[user],
  }
};