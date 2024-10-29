import CircularRings from "@/components/chart/CircularRings";
import MultiRings from "@/components/chart/MultiRigs";
import ringData from "@/data/dummy/ringData";

export default function Home() {
  return (
    <div className="mx-auto flex flex-col justify-center items-center">
      <p>the old</p>
      <CircularRings data={ringData} />
      <p>the new</p>
      <MultiRings data={ringData} />
    </div>
  );
}
