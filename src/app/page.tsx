import { Trackers } from "@/components/trackers/Trackers";
import { getSubs } from "@/components/trackers/actions";
import { SignedIn, UserButton } from "@clerk/nextjs";

export default async function Home() {
  const trackers = await getSubs();
  return (
    <div className="flex flex-col items-center justify-center">
      <header className="absolute top-2 right-1 z-2">
        <SignedIn>
          <UserButton />
        </SignedIn>
      </header>
      <Trackers trackers={trackers} />
    </div>
  );
}
