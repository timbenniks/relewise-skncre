import Hero from "@/components/Hero";
import NoComponentFile from "@/components/NoComponentFile";
import Routine from "@/components/Routine";
import ProductHighlight from "@/components/ProductHighlight";
import Editorial from "@/components/Editorial";
import Cta from "@/components/Cta";
import Card from "@/components/Card";
import Tutorial from "@/components/Tutorial";
import TutorialItem from "@/components/TutorialItem"
import ProductList from "@/components/ProductList"
import { Tracker, UserFactory } from "@relewise/client";

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

type Mapping = {
  [name: string]: any
}

export const mapping: Mapping = {
  Editorial,
  Hero,
  ProductHighlight,
  Routine,
  Cta,
  Card,
  Tutorial,
  TutorialItem,
  ProductList
};

export function getComponentForName(name: string) {
  return mapping[name] ?? NoComponentFile
}