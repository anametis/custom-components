import CircularRings from "@/components/chart/CircularRings";
import MultiRings from "@/components/chart/MultiRigs";
import ringData from "@/data/dummy/ringData";
import Tooltip from "@/components/tooltip/Tooltip";
import Quotex from "@/components/Quotex";

export default function Home() {
  return (
    <div className="mx-auto flex flex-col justify-center items-center">
      {/* <Quotex /> */}
      <p>the old</p>
      <CircularRings data={ringData} />
      <p>the new</p>
      {/* <MultiRings data={ringData} /> */}
      <Tooltip text="this is 1">
        <div className="bg-yellow-500 rounded-full text-center h-10 w-10">
          0
        </div>
      </Tooltip>

      {/* <div className="flex w-full items-center justify-start gap-10 flex-wrap ">
        <Tooltip text="this is 1">
          <div className="bg-red-500 rounded-full text-center h-10 w-10">1</div>
        </Tooltip>
      </div> */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-8 w-full">
          {Array.from({ length: 23 }).map((_, index) => (
            <div key={index} className="bg-red-500 h-20 w-24 flex items-center justify-center flex-col mx-auto">{index}</div>
          ))}
        </div>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-8 w-full">
          {Array.from({ length: 23 }).map((_, index) => (
            <div key={index} className="bg-green-500 h-20 w-24 flex items-center justify-center flex-col">{index}</div>
          ))}
        </div>
        <div className="flex flex-wrap gap-4 w-full flex-start">
          {Array.from({ length: 23 }).map((_, index) => (
            <div key={index} className="bg-yellow-500 h-20 w-24 flex items-center justify-center flex-col">{index}</div>
          ))}
        </div>
    </div>
  );
}
