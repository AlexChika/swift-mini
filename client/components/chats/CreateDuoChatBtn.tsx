// import React from "react";
// import { Session } from "next-auth";
// import { toRems } from "@/lib/helpers";
// import { Box, Text } from "@chakra-ui/react";
// import CreateDuoChatModal from "./CreateDuoChatModal";

// type Props = {
//   session: Session;
//   openChat: (chatId: string) => void;
// };

// function CreateDuoChatBtn({ session, openChat }: Props) {
//   const [isOpen, setIsOpen] = React.useState(false);

//   return (
//     <Box
//       py={2}
//       mb={4}
//       border="2px solid {colors.primaryBg}"
//       borderRadius={12}
//       cursor="pointer"
//       onClick={() => setIsOpen(true)}>
//       <Text
//         textAlign="center"
//         color="{colors.primaryText}"
//         fontSize={{ base: toRems(14), md: toRems(15) }}
//         fontWeight={500}>
//         Find or Create a New Chat
//       </Text>

//       <CreateDuoChatModal
//         session={session}
//         isOpen={isOpen}
//         openChat={openChat}
//         setIsOpen={setIsOpen}
//       />
//     </Box>
//   );
// }

// export default CreateDuoChatBtn;
