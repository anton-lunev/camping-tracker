import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SendIcon } from "lucide-react";
import Image from "next/image";
import { Portal } from "@/components/Portal";

export function ConnectTelegram() {
  return (
    <div className="mb-8 w-full max-w-md space-y-4 text-center">
      <Portal targetId="header-slot">
        <div className="flex flex-col items-center gap-3">
          <h1 className="text-3xl font-light text-white drop-shadow-sm">
            Link Your Account to Telegram
          </h1>

          <Button
            asChild
            className="mt-2 w-fit bg-[#1c93e3] text-white hover:bg-[#1a8ad5]"
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
        className="relative my-4 block aspect-[16/9] w-full"
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
