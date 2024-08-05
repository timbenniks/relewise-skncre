import type { Metadata, ResolvingMetadata } from "next";
import { draftMode } from "next/headers";
import type { PdpQuery } from "@/gql/graphql";
import { getPdp } from "@/queries/getPdp";
import ComponentRenderer from "@/components/ComponentRenderer";
import ProductDetail from "@/components/ProductDetail";
import OthersBought from "../../../components/OthersBought";
import RelatedProducts from "../../../components/RelatedProducts.tsx";
import { getRelewiseUser, relewiseTracker } from "../../../helpers";

type Props = {
  params: { product: string };
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { isEnabled } = draftMode();
  const prd: PdpQuery = await getPdp(
    params.product as string,
    isEnabled ? "DRAFT" : "PUBLISHED"
  );

  return {
    title: isEnabled
      ? `⚡️ ${prd?.skncreProduct?.name}`
      : prd?.skncreProduct?.name || "",
    description: prd?.skncreProduct?.description || "",
    openGraph: {
      type: "website",
      title: prd?.skncreProduct?.name || "",
      images: [prd?.skncreProduct?.images[0] || ""],
    },
    twitter: {
      card: "summary_large_image",
      title: prd?.skncreProduct?.name || "",
      description: prd?.skncreProduct?.description || "",
    },
  };
}

export default async function Home({
  params,
}: {
  params: { product: string };
}) {
  const { isEnabled } = draftMode();
  const prd: PdpQuery = await getPdp(
    params.product as string,
    isEnabled ? "DRAFT" : "PUBLISHED"
  );

  await relewiseTracker().trackProductView({
    productId: prd?.skncreProduct?.productId,
    user: getRelewiseUser(),
  });

  return (
    <main className="max-w-screen-2xl mx-auto">
      <ProductDetail product={prd?.skncreProduct} />
      <section className="mb-12">
        <ComponentRenderer data={prd?.pdp.components} />

        <RelatedProducts productId={prd?.skncreProduct?.productId} />
        <OthersBought productId={prd?.skncreProduct?.productId} />
      </section>
    </main>
  );
}
