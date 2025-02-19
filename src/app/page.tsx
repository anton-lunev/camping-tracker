import { Trackers } from "@/components/trackers/Trackers";
import { getTrackers } from "@/components/trackers/actions";
import { SignedIn, UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { ConnectTelegram } from "@/app/ConnectTelegram";

export default async function Home() {
  const trackers = await getTrackers();
  const user = await currentUser();
  const isTelegramConnected = !!user?.privateMetadata.telegramId;

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex w-full flex-col items-center justify-center gap-4">
        <div className="flex aspect-3840/600 w-full items-center justify-center p-4">
          <div
            className="absolute inset-0 aspect-3840/600 bg-[url(/header.jpeg)] bg-contain bg-no-repeat"
            style={{
              maskImage:
                "linear-gradient(180deg, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)",
            }}
          />
          <div className="z-1 flex gap-2" id="header-slot"></div>
        </div>

        <header className="absolute top-2 right-1 z-2">
          <SignedIn>
            <UserButton />
          </SignedIn>
        </header>
      </div>

      {!isTelegramConnected ? <ConnectTelegram /> : null}

      {isTelegramConnected ? <Trackers trackers={trackers} /> : null}
    </div>
  );
}
