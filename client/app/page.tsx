import HomePage from "@/components/home";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";

async function Page() {
  const session = await getServerSession(authOptions);

  return <HomePage session={session} />;
}

export default Page;
