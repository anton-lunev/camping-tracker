import { matchAccounts } from "@/app/link/[token]/actions";
import { redirect } from "next/navigation";

export default async function LinkPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const { success } = await matchAccounts(token);

  if (!success) {
    return `Could not connect your account`;
  }
  redirect("/");
}
