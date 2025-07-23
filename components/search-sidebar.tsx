"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export function SearchSidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const params = new URLSearchParams(searchParams);

    for (const [key, value] of formData.entries()) {
      if (value) {
        params.set(key, value as string);
      } else {
        params.delete(key);
      }
    }
    router.push(`/?${params.toString()}`);
  };

  return (
    <aside className="bg-gray-100 p-6 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Filter Properties</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="min_price">Min Price</Label>
          <Input id="min_price" name="min_price" type="number" placeholder="Any" defaultValue={searchParams.get('min_price') ?? ''} />
        </div>
        <div>
          <Label htmlFor="max_price">Max Price</Label>
          <Input id="max_price" name="max_price" type="number" placeholder="Any" defaultValue={searchParams.get('max_price') ?? ''} />
        </div>
        <div>
          <Label htmlFor="min_beds">Min Beds</Label>
          <Input id="min_beds" name="min_beds" type="number" placeholder="Any" defaultValue={searchParams.get('min_beds') ?? ''} />
        </div>
        <div>
          <Label htmlFor="min_baths">Min Baths</Label>
          <Input id="min_baths" name="min_baths" type="number" placeholder="Any" defaultValue={searchParams.get('min_baths') ?? ''} />
        </div>
        <Button type="submit" className="w-full">
          Search
        </Button>
      </form>
    </aside>
  );
}
