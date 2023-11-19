const resolvers = {
  Query: {
    searchUsers() {},
  },
  Mutation: {
    createUsername(_: any, args: { username: string }, ctx: any) {
      console.log({ ctx });
    },
  },
  // Subscription: {},
};

export default resolvers;
