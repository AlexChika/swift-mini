import { merge } from "@lib/utils";
import chatResolver from "./chat.resolver";
import userResolver from "./user.resolver";
import messageResolver from "./message.resolver";

const resolvers = merge({}, chatResolver, userResolver, messageResolver);

export default resolvers;
