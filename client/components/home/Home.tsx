import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams
} from "next/navigation";
import NavBar from "./NavBar";
import Footer from "./Footer";
import SideBar from "./SideBar";
import { Session } from "next-auth";
import Chats from "@/components/chats/Chats";
import { useCallback, useEffect } from "react";
import Groups from "@/components/groups/Groups";
import AllChats from "@/components/allChats/AllChats";
import { Box, HStack, Text, VStack } from "@chakra-ui/react";
import { getPageName, getParam, toEms, toRems } from "@/lib/helpers";

type Props = {
  session: Session;
};

function Home({ session }: Props) {
  const router = useRouter();
  const path = usePathname();
  const sp = useSearchParams();
  const param = getParam(sp.get("swift"));
  const pageName = getPageName(param || "home");
  const { chatId: id } = useParams<{ chatId: string }>();

  // resets param to home if param is not valid
  useEffect(() => {
    if (param) return;
    router.replace(`/${path.slice(1)}?swift=home`);
  }, [param, path, router]);

  const handleMenuClick = useCallback(
    (p: Param) => {
      if (p === param) return;
      router.replace(`/${path.slice(1)}?swift=${p}`);
    },
    [path, router, param]
  );

  return (
    <HStack
      gap={0}
      w="100%"
      bg="{colors.secondaryBg}"
      border="4px solid {colors.appBorder}"
      borderRightWidth={{ base: "4px", xmd: "1px" }}
      display={{ base: id ? "none" : "flex", xmd: "flex" }}
      css={{
        margin: { base: "0px", xmd: toEms(5, 0, 5, 5) },
        borderRadius: { base: "0px", xmd: "10px 0px 0px 10px" }
      }}
      maxW={{ xmd: toRems(380), "2xmd": toRems(440), xl: toRems(460) }}>
      <SideBar handleMenuClick={handleMenuClick} param={param || "home"} />
      {/* Home content */}
      <VStack w="100%" h="100%" gap={0}>
        <Box px={2.5} w="100%" h="100%">
          <NavBar handleMenuClick={handleMenuClick} pageName={pageName} />

          {param === "home" && <AllChats session={session} />}
          {param === "duo" && <Chats session={session} />}
          {param === "swiftAi" && <Text>AI</Text>}
          {param === "group" && <Groups session={session} />}
          {param === "calls" && <Text>Calls</Text>}
          {param === "search" && <Text>Search</Text>}
          {param === "profile" && <Text>Profile</Text>}
        </Box>

        <Footer handleMenuClick={handleMenuClick} param={param || "home"} />
      </VStack>
    </HStack>
  );
}

export default Home;
