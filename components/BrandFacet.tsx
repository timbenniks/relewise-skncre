"use client";
import React, { FC, useState, ChangeEvent } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";

interface BrandFacetProps {
  availableFacets: {
    value: { id: string; displayName: string };
    hits: number;
    selected: boolean;
  }[];
}

const BrandFacet: FC<BrandFacetProps> = ({ availableFacets }) => {
  const [selectedFacets, setSelectedFacets] = useState<string[]>([]);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const handleFacetChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;

    let updatedFacets = [...selectedFacets];
    if (checked) {
      updatedFacets.push(value);
    } else {
      updatedFacets = updatedFacets.filter((facet) => facet !== value);
    }

    setSelectedFacets(updatedFacets);
    updateQueryParams(updatedFacets);
  };

  const updateQueryParams = (facets: string[]) => {
    const params = new URLSearchParams(searchParams);

    if (facets.length > 0) {
      params.set("brands", facets.join(","));
    } else {
      params.delete("brands");
    }

    router.replace(`${pathname}?${params.toString()}`);
  };

  if (!availableFacets || availableFacets.length === 0) {
    return null;
  }

  return (
    <div className="mb-4">
      <h3 className="font-semibold">Brands</h3>
      <ul>
        {availableFacets.map((facet) => (
          <li key={facet.value.displayName}>
            <label className="felx space-x-1">
              <input
                type="checkbox"
                id={facet.value.id}
                value={facet.value.displayName}
                onChange={handleFacetChange}
                className="relative top-0.5"
                checked={selectedFacets.includes(facet.value.displayName)}
              />
              <span>
                {facet.value.displayName}({facet.hits})
              </span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BrandFacet;
