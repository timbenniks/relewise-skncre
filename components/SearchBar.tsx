"use client";

import { useSearchParams, usePathname, useRouter } from "next/navigation";

export default function SearchBar({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  function handleSearch(term: string) {
    const params = new URLSearchParams();

    if (term) {
      params.set("query", term);
    }

    replace(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="w-full bg-tertiary p-8 flex flex-col ">
      <p className="text-dark font-bold font-title text-xl mb-2">
        Search our product catalog
      </p>
      <input
        className="w-96 block text-xl px-4 py-3 text-primary placeholder:text-primary border border-primary"
        placeholder={placeholder}
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
        defaultValue={searchParams.get("query")?.toString()}
      />
    </div>
  );
}
