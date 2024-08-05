import { Tracker, UserFactory } from '@relewise/client';

export function getRelewiseUser() {
  return UserFactory.anonymous();
}

export const relewiseTracker = () => {
  const tracker = new Tracker(
    "0dac7093-af97-41a1-b7de-3cc1cc3f3120",
    "np1VU:ftHwW1Aah",
    {
      serverUrl: "https://sandbox-api.relewise.com/",
    }
  );

  return tracker;
};

export function getOptionsWithUser(user: string | "none" | "bennich" | "benniks") {
  const users: any = [];

  users["none"] = {}
  users["bennich"] = {
    "authenticatedId": "8298a53e-fd1d-4397-8b30-bc1cd84b27c0",
    "email": "christian@relewise.com",
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
    }

  return {
    language: "en-gb",
    currency: "EUR",
    user: users[user],
  }
}