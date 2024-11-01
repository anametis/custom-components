import CircularRings from "@/components/chart/CircularRings";
import MultiRings from "@/components/chart/MultiRigs";
import ringData from "@/data/dummy/ringData";
import Tooltip from "@/components/tooltip/Tooltip";
import Quotex from "@/components/Quotex";
import useSocketIo from "@/hooks/useSocketIO";

export default function Home() {
  // const { isConnected, error, lastMessage, emit, clearHistory } =
  //   useSocketIo({
  //     url: "wss://ws2.qxbroker.com",
  //     authSession: "MJ6a4jCllQG2jlMVvHie9fMpVYSoZHbylvf9aOri",
  //     isDemo: 1,
  //     tournamentId: 0,
  //     autoConnect: true,
  //   });

  //   const handleRequestInstruments = () => {
  //     emit('instruments/list', { _placeholder: true, num: 0 });
  //   };
  //   handleRequestInstruments();
  return (
    <div className="mx-auto flex flex-col justify-center items-center">
      {/* <Quotex /> */}
      <MultiRings data={ringData} />


      {/* <div className="flex w-full items-center justify-start gap-10 flex-wrap ">
        <Tooltip text="this is 1">
          <div className="bg-red-500 rounded-full text-center h-10 w-10">1</div>
        </Tooltip>
      </div> */}
      {/* <div className="grid gap-4 grid-cols-1 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-8 w-full">
        {Array.from({ length: 23 }).map((_, index) => (
          <div
            key={index}
            className="bg-red-500 h-20 w-24 flex items-center justify-center flex-col mx-auto"
          >
            {index}
          </div>
        ))}
      </div> */}
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
        style={{
          display: "grid",
          gap: "10px",
          gridTemplateColumns: "repeat(auto-fit,96px)",
        }}
      >
        {Array.from({ length: 23 }).map((_, index) => (
          <Tooltip key={index} text="hi">
          <div
            className="bg-yellow-500 h-24 w-24 flex items-center justify-center flex-col"
          >
            {index}
          </div>
          </Tooltip>
        ))}
      </div>
    </div>
  );
}
