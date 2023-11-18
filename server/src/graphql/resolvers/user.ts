const resolvers = {
  Query: {
    searchUsers() {},
  },
  Mutation: {
    createUsername(_, args) {
      console.log(args);
    },
  },
  // Subscription: {},
};

export default resolvers;
