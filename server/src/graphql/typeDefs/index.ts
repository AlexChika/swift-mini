import usersTypeDefs from "./user.typedef";
import conversationDefs from "./conversations";
import messageDefs from "./messages";
import chatDefs from "./chat.typedef";
import messageDefsNew from "./message.typedef";

const typeDefs = [
  conversationDefs, // to be deprecated
  chatDefs,
  usersTypeDefs,
  messageDefs, // to be deprecated
  messageDefsNew
];

export default typeDefs;
