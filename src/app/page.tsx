import { Suspense } from "react";
import DataTable from "@/components/table/DataTable";
import { fetchItems } from "@/data/data";

export const revalidate = 3600; // Revalidate every hour

export default async function Home() {
  const items = await fetchItems();

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Data Table</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <DataTable initialItems={items} />
      </Suspense>
      <div className="block md:hidden text-red-500">testing 1</div>
      <div className="hidden md:block text-blue-500">test 2</div>
      <ResponsiveComponent data={"test"} />
    </main>
  );
}

const DesktopLayout = ({ data }: { data: string }) => (
  <div className="grid grid-cols-3">
    {/* Desktop-specific layout */}
    {data}
  </div>
);

const MobileLayout = ({ data }: { data: string }) => (
  <div className="flex flex-col">
    {/* Mobile-specific layout */}
    {data}
  </div>
);

const ResponsiveComponent = ({ data }: { data: string }) => {
  return (
    <div className="md:block">
      <div className="hidden md:block">
        <DesktopLayout data={data} />
      </div>
      <div className="block md:hidden">
        <MobileLayout data={data} />
      </div>
    </div>
  );
};
