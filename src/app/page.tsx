import MultiRings from "@/components/chart/MultiRigs";
import ringData from "@/data/dummy/ringData";
import Tooltip from "@/components/tooltips/Tooltip";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <Tooltip text="testing this ">
        <MultiRings data={ringData} className="mt-96" />
      </Tooltip>
    </div>
  );
}
