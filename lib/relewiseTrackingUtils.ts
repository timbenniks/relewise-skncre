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