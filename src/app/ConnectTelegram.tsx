import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SendIcon } from "lucide-react";
import Image from "next/image";
import { Portal } from "@/components/Portal";

export function ConnectTelegram() {
  return (
    <div className="max-w-md w-full space-y-4 text-center mb-8">
      <Portal targetId="header-slot">
        <div className="flex flex-col gap-3 items-center">
          <h1 className="text-3xl font-light text-white drop-shadow-sm">
            Link Your Account to Telegram
          </h1>

          <Button
            asChild
            className="bg-[#1c93e3] hover:bg-[#1a8ad5] text-white w-fit mt-2"
          >
            <Link
              href="https://t.me/CampingTrackerBot"
              target="_blank"
              rel="noopener noreferrer"
            >
              <SendIcon className="mr-1 h-4 w-4" /> Connect with Telegram
            </Link>
          </Button>
        </div>
      </Portal>

      <Link
        href="https://t.me/CampingTrackerBot"
        target="_blank"
        rel="noopener noreferrer"
        className="block relative w-full aspect-[16/9] my-4"
      >
        <Image
          src="/telegram_bot.png"
          alt="Friendly robot next to Telegram logo"
          fill
          className="object-contain"
          priority
        />
      </Link>
    </div>
  );
}
