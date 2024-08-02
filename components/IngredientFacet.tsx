"use client";
import React, { FC, useState, ChangeEvent } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";

interface IngredientFacetProps {
  availableFacets: {
    value: string;
    hits: number;
    selected: boolean;
  }[];
}

const IngredientFacet: FC<IngredientFacetProps> = ({ availableFacets }) => {
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
      params.set("ingredients", facets.join(","));
    } else {
      params.delete("ingredients");
    }

    router.replace(`${pathname}?${params.toString()}`);
  };

  const finalFacets = availableFacets.filter((facet) => facet.hits > 1).sort((faceta, facetb)=>facetb.hits - faceta.hits);

  if (!finalFacets || finalFacets.length === 0) {
    return null;
  }

  return (
    <div className="mb-4">
      <h3 className="font-semibold">Ingredients</h3>
      <ul>
        {finalFacets.map((facet) => (
          <li key={facet.value}>
            <label className="felx space-x-1">
              <input
                type="checkbox"
                id={facet.value}
                value={facet.value}
                onChange={handleFacetChange}
                className="relative top-0.5"
                checked={selectedFacets.includes(facet.value)}
              />
              <span>
                {facet.value}({facet.hits})
              </span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default IngredientFacet;
