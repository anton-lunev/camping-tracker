import { Trackers } from "@/components/trackers/Trackers";
import { getSubs } from "@/components/trackers/actions";

export default async function Home() {
  const trackers = await getSubs();
  return (
    <div className="flex flex-col items-center justify-center">
      <Trackers trackers={trackers} />
    </div>
  );
}
