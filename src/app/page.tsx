import DatasetSearch from "@/app/_components/DatasetSearch";
import {Suspense} from "react";

export default async function Home() {

  return (
    <div className="px-10 pt-20 w-full max-w-7xl mx-auto">
      <Suspense>
        <DatasetSearch />
      </Suspense>
    </div>
  );
}
