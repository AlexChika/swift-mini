import usersTypeDefs from "./user.typedef";
import conversationDefs from "./conversations";
import messageDefs from "./messages";
import chatDefs from "./chat.typedef";

const typeDefs = [conversationDefs, chatDefs, usersTypeDefs, messageDefs];

export default typeDefs;
