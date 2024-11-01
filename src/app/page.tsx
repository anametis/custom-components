import MultiRings from "@/components/chart/MultiRigs";
import ringData from "@/data/dummy/ringData";
import Tooltip from "@/components/tooltip/Tooltip";
import Quotex from "@/components/Quotex";
// import CircularRings from "@/components/chart/CircularRings";
// import useSocketIo from "@/hooks/useSocketIO";

export default function Home() {
  return (
    <div className="mx-auto flex flex-col justify-center items-center">
      {/* <Quotex /> */}

      <MultiRings data={ringData} />

      <div className="flex flex-wrap gap-4 justify-between">
        {Array.from({ length: 23 }).map((_, index) => (
          <div
            key={index}
            className="bg-green-500 h-24 w-24 flex items-center justify-center flex-col mx-auto"
          >
            {index}
          </div>
        ))}
      </div>
      <div
        className="w-full bg-gray-500 grid gap-3 sm:justify-between justify-center"
        style={{ gridTemplateColumns: "repeat(auto-fit,96px)" }}
      >
        {Array.from({ length: 23 }).map((_, index) => (
          <Tooltip key={index} text="hi">
            <div className="bg-yellow-500 h-24 w-24 flex items-center justify-center flex-col">
              {index}
            </div>
          </Tooltip>
        ))}
      </div>
    </div>
  );
}
