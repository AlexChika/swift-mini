import { useEffect } from "react";
import { Session } from "next-auth";
import NavBar from "../home/NavBar";
import { Box, HStack, VStack } from "@chakra-ui/react";
import { getPageName, getParam, toEms, toRems } from "@/lib/helpers";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams
} from "next/navigation";
import { MenuIcon } from "@/lib/icons";

type Props = {
  session: Session;
  children: React.ReactNode;
};

function Home({ session, children }: Props) {
  const { chatId: id } = useParams<{ chatId: string }>();
  const router = useRouter();
  const path = usePathname();
  const sp = useSearchParams().get("swift");
  const param = getParam(sp);
  const pageName = getPageName(param || "home");

  useEffect(() => {
    if (param) return;
    router.replace(`/${path.slice(1)}?swift=home`);
  }, [param, path]);

  return (
    <HStack
      gap={0}
      w="100%"
      bg="{colors.secondaryBg}"
      border="4px solid {colors.appBorder}"
      borderRightWidth={{ base: "4px", xmd: "1px" }}
      display={{ base: id ? "none" : "flex", xmd: "flex" }}
      maxW={{ xmd: toRems(380), "2xmd": toRems(440), xl: toRems(460) }}
      css={{
        margin: { base: "0px", xmd: toEms(5, 0, 5, 5) },
        borderRadius: { base: "0px", xmd: "10px 0px 0px 10px" }
      }}>
      {/* sidebar */}
      <Box
        py={3}
        px={2.5}
        h="100%"
        w={toRems(60)}
        display={{ base: "none", xmd: "block" }}
        borderRight="1px solid {colors.appBorder}">
        <Box border="1px solid red" mt={2.5} mb={4}>
          <MenuIcon color="skyblue" />
        </Box>
      </Box>

      {/* Home content */}
      <VStack px={2.5} w="100%" h="100%" gap={0}>
        <Box w="100%" h="100%">
          <NavBar page={pageName} />
          {children}
        </Box>

        {/* footer */}
        <Box
          display={{ base: "block", xmd: "none" }}
          w="100%"
          alignSelf="flex-end"
          border="2px solid red"
          minH={toRems(60)}
          h={toRems(60)}>
          hello footer
        </Box>
      </VStack>
    </HStack>
  );
}

export default Home;
